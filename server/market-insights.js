import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const defaultDataDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'market-data');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      row.push(field);
      if (row.some(value => value.length > 0)) rows.push(row);
      row = [];
      field = '';
      if (character === '\r' && text[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some(value => value.length > 0)) rows.push(row);

  if (rows.length === 0) return [];
  const headers = rows[0].map((header, index) => (
    index === 0 ? header.replace(/^\uFEFF/, '').trim() : header.trim()
  ));
  return rows.slice(1).map(values => Object.fromEntries(
    headers.map((header, index) => [header, (values[index] || '').trim()])
  ));
}

function numericValue(value) {
  const match = String(value || '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function addCount(counts, label, amount = 1, key = label) {
  if (!label) return;
  const current = counts.get(key) || { name: label, count: 0 };
  current.count += amount;
  counts.set(key, current);
}

function sortedCounts(counts, limit = 8) {
  return [...counts.values()]
    .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name))
    .slice(0, limit);
}

function normalizeExperienceBucket(experience) {
  const minimum = String(experience || '').match(/(\d+)\s*-\s*\d+/);
  if (!minimum) return 'Not specified';
  const years = Number(minimum[1]);
  if (years <= 2) return '0–2 years';
  if (years <= 5) return '3–5 years';
  if (years <= 10) return '6–10 years';
  return '11+ years';
}

export function buildMarketInsights(analyticsCsv, dataScienceCsv) {
  const listings = parseCsv(analyticsCsv);
  const dataScienceRows = parseCsv(dataScienceCsv);
  const skillCounts = new Map();
  const locationCounts = new Map();
  const experienceCounts = new Map();
  const companyTotals = new Map();
  const roleTotals = new Map();
  let estimatedOpenings = 0;
  let salaryTotal = 0;
  let salaryWeight = 0;
  let minimumSalary = null;
  let maximumSalary = null;

  for (const listing of listings) {
    const skillsForListing = new Map();
    for (const rawSkill of (listing.key_skills || '').split(/[,;|]/)) {
      const skill = rawSkill.replace(/\.{2,}$/, '').trim();
      if (skill.length > 1 && skill.length <= 60) {
        const key = skill.toLocaleLowerCase();
        if (!skillsForListing.has(key)) skillsForListing.set(key, skill);
      }
    }
    for (const [key, skill] of skillsForListing) addCount(skillCounts, skill, 1, key);

    const locationsForListing = new Map();
    for (const rawLocation of (listing.location || '').split(/[,;|]/)) {
      const location = rawLocation.trim();
      if (location) {
        const key = location.toLocaleLowerCase();
        if (!locationsForListing.has(key)) locationsForListing.set(key, location);
      }
    }
    for (const [key, location] of locationsForListing) addCount(locationCounts, location, 1, key);

    addCount(experienceCounts, normalizeExperienceBucket(listing.experience));
  }

  for (const entry of dataScienceRows) {
    const openings = numericValue(entry.num_of_jobs) || 0;
    const averageSalary = numericValue(entry.avg_salary);
    const lowSalary = numericValue(entry.min_salary);
    const highSalary = numericValue(entry.max_salary);
    const company = entry.company_name.trim();
    const role = entry.job_title.trim();

    estimatedOpenings += openings;
    if (averageSalary !== null && openings > 0) {
      salaryTotal += averageSalary * openings;
      salaryWeight += openings;
    }
    if (lowSalary !== null) {
      minimumSalary = minimumSalary === null ? lowSalary : Math.min(minimumSalary, lowSalary);
    }
    if (highSalary !== null) {
      maximumSalary = maximumSalary === null ? highSalary : Math.max(maximumSalary, highSalary);
    }

    if (company) {
      const current = companyTotals.get(company) || { name: company, openings: 0, salaryTotal: 0, salaryWeight: 0 };
      current.openings += openings;
      if (averageSalary !== null && openings > 0) {
        current.salaryTotal += averageSalary * openings;
        current.salaryWeight += openings;
      }
      companyTotals.set(company, current);
    }
    if (role) addCount(roleTotals, role, openings);
  }

  if (listings.length === 0 || dataScienceRows.length === 0) {
    throw new Error('Market-insights CSV files must each contain at least one data row.');
  }

  return {
    summary: {
      analyticsListings: listings.length,
      dataScienceRows: dataScienceRows.length,
      estimatedOpenings,
      averageSalaryLpa: salaryWeight ? Number((salaryTotal / salaryWeight).toFixed(2)) : null,
      salaryRangeLpa: {
        minimum: minimumSalary,
        maximum: maximumSalary,
      },
    },
    topSkills: sortedCounts(skillCounts, 10),
    topLocations: sortedCounts(locationCounts, 10),
    experienceDistribution: [...experienceCounts.values()]
      .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name)),
    topCompanies: [...companyTotals.values()]
      .map(company => ({
        name: company.name,
        openings: company.openings,
        averageSalaryLpa: company.salaryWeight
          ? Number((company.salaryTotal / company.salaryWeight).toFixed(2))
          : null,
      }))
      .sort((first, second) => second.openings - first.openings || first.name.localeCompare(second.name))
      .slice(0, 10),
    topRoles: sortedCounts(roleTotals, 10).map(role => ({
      title: role.name,
      openings: role.count,
    })),
    sources: ['Analytics Jobs.csv', 'DataScience Jobs.csv'],
  };
}

export async function loadMarketInsights(dataDirectory = defaultDataDirectory) {
  const [analyticsCsv, dataScienceCsv] = await Promise.all([
    readFile(path.join(dataDirectory, 'Analytics Jobs.csv'), 'utf8'),
    readFile(path.join(dataDirectory, 'DataScience Jobs.csv'), 'utf8'),
  ]);
  return buildMarketInsights(analyticsCsv, dataScienceCsv);
}

export function createMarketInsightsRouter(dataDirectory = defaultDataDirectory) {
  const router = Router();
  let insightsPromise;

  router.get('/market', async (_request, response, next) => {
    try {
      if (!insightsPromise) insightsPromise = loadMarketInsights(dataDirectory);
      response.set('Cache-Control', 'public, max-age=300');
      response.json(await insightsPromise);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
