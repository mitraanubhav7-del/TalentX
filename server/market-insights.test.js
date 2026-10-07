import assert from 'node:assert/strict';
import express from 'express';
import { test } from 'node:test';
import {
  buildMarketInsights,
  createMarketInsightsRouter,
  loadMarketInsights,
} from './market-insights.js';

test('buildMarketInsights parses quoted CSV rows and aggregates market data', () => {
  const analytics = [
    'experience,job_desig,key_skills,location',
    '1-3 yrs,"Data Scientist, NLP","Python, SQL, Python","Bengaluru, Chennai"',
    '6-10 yrs,Data Engineer,"Python; Spark","Bengaluru"',
  ].join('\n');
  const dataScience = [
    'company_name,job_title,num_of_jobs,avg_salary,min_salary,max_salary',
    'Example Co,Data Scientist,10,12.0L,8.0L,18.0L',
    'Example Co,Data Engineer,5,18.0L,15.0L,25.0L',
  ].join('\n');

  const insights = buildMarketInsights(analytics, dataScience);

  assert.equal(insights.summary.analyticsListings, 2);
  assert.equal(insights.summary.dataScienceRows, 2);
  assert.equal(insights.summary.estimatedOpenings, 15);
  assert.equal(insights.summary.averageSalaryLpa, 14);
  assert.deepEqual(insights.summary.salaryRangeLpa, { minimum: 8, maximum: 25 });
  assert.deepEqual(insights.topSkills[0], { name: 'Python', count: 2 });
  assert.deepEqual(insights.topLocations[0], { name: 'Bengaluru', count: 2 });
  assert.equal(insights.topCompanies[0].openings, 15);
  assert.deepEqual(insights.topRoles[0], { title: 'Data Scientist', openings: 10 });
  assert.ok(insights.experienceDistribution.some(bucket => bucket.name === '0–2 years' && bucket.count === 1));
});

test('buildMarketInsights preserves multiline quoted fields and rejects empty datasets', () => {
  const insights = buildMarketInsights(
    'job_description,key_skills,experience,location\n"First line\nsecond line","SQL, Python",3-5 yrs,Delhi',
    'company_name,job_title,num_of_jobs,avg_salary,min_salary,max_salary\nAcme,Analyst,1,10L,8L,12L'
  );
  assert.equal(insights.summary.analyticsListings, 1);
  assert.deepEqual(insights.topSkills.map(skill => skill.name).sort(), ['Python', 'SQL']);
  assert.throws(
    () => buildMarketInsights('header\n', 'company_name,job_title,num_of_jobs,avg_salary,min_salary,max_salary\n')
  );
});

test('loadMarketInsights summarizes the supplied hackathon datasets', async () => {
  const insights = await loadMarketInsights();

  assert.equal(insights.summary.analyticsListings, 15841);
  assert.equal(insights.summary.dataScienceRows, 1602);
  assert.equal(insights.summary.estimatedOpenings, 93005);
  assert.ok(insights.summary.averageSalaryLpa > 0);
  assert.equal(insights.topRoles[0].title, 'Business Analyst');
});

test('market insights API returns the aggregated dataset', async () => {
  const app = express();
  app.use('/api/insights', createMarketInsightsRouter());
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/insights/market`);
    assert.equal(response.status, 200);
    const insights = await response.json();
    assert.equal(insights.summary.estimatedOpenings, 93005);
    assert.equal(response.headers.get('cache-control'), 'public, max-age=300');
  } finally {
    await new Promise((resolve, reject) => (
      server.close(error => error ? reject(error) : resolve())
    ));
  }
});
