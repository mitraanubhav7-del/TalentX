import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  MapPin,
  Network,
  RefreshCw,
  UsersRound,
} from 'lucide-react';
import './MarketInsights.css';

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function InsightBars({ title, icon: Icon, items, labelKey = 'name', valueKey = 'count', formatValue = formatNumber }) {
  const maximum = Math.max(...items.map(item => item[valueKey]), 1);

  return (
    <section className="glass-panel market-chart-card">
      <h2><span className="market-icon-well"><Icon size={18} /></span>{title}</h2>
      <div className="market-bars">
        {items.map(item => (
          <div className="market-bar-row" key={item[labelKey]}>
            <div className="market-bar-label">
              <span title={item[labelKey]}>{item[labelKey]}</span>
              <strong>{formatValue(item[valueKey])}</strong>
            </div>
            <div
              className="market-bar-track"
              role="progressbar"
              aria-label={`${item[labelKey]} ${title.toLowerCase()}`}
              aria-valuemin="0"
              aria-valuemax={maximum}
              aria-valuenow={item[valueKey]}
            >
              <div
                className="market-bar-fill"
                style={{ width: `${(item[valueKey] / maximum) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketInsightsContent({ data, onOpenSkillGraph }) {
  const metrics = [
    {
      label: 'JOB LISTINGS ANALYZED',
      value: formatNumber(data.summary.analyticsListings),
      icon: BriefcaseBusiness,
    },
    {
      label: 'ESTIMATED OPENINGS',
      value: formatNumber(data.summary.estimatedOpenings),
      icon: UsersRound,
    },
    {
      label: 'WEIGHTED AVERAGE SALARY',
      value: data.summary.averageSalaryLpa === null ? 'N/A' : `₹${data.summary.averageSalaryLpa} LPA`,
      icon: CircleDollarSign,
    },
    {
      label: 'SALARY RANGE',
      value: data.summary.salaryRangeLpa.minimum === null
        ? 'N/A'
        : `₹${data.summary.salaryRangeLpa.minimum}–${data.summary.salaryRangeLpa.maximum} LPA`,
      icon: Building2,
    },
  ];

  return (
    <div className="market-insights">
      <header className="market-header">
        <div>
          <span className="market-eyebrow"><BarChart3 size={15} /> DATASET ANALYTICS</span>
          <h1>Job Market Insights</h1>
          <p>Hiring demand, skills, experience and salary trends from the supplied job datasets.</p>
        </div>
        <button className="btn-secondary" onClick={onOpenSkillGraph}>
          <Network size={16} /> Open skill graph
        </button>
      </header>

      <section className="market-metrics" aria-label="Market summary">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <article className="glass-panel market-metric-card" key={metric.label}>
              <span className="market-icon-well"><Icon size={19} /></span>
              <div>
                <div className="market-metric-value">{metric.value}</div>
                <div className="market-metric-label">{metric.label}</div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="market-charts" aria-label="Job market breakdowns">
        <InsightBars title="Most listed skills" icon={BarChart3} items={data.topSkills} />
        <InsightBars
          title="Job locations"
          icon={MapPin}
          items={data.topLocations}
          formatValue={formatNumber}
        />
        <InsightBars
          title="Experience required"
          icon={BriefcaseBusiness}
          items={data.experienceDistribution}
        />
        <InsightBars
          title="Top hiring roles"
          icon={Building2}
          items={data.topRoles}
          labelKey="title"
          valueKey="openings"
          formatValue={formatNumber}
        />
      </section>

      <section className="glass-panel market-table-card">
        <div className="market-table-heading">
          <div>
            <h2><span className="market-icon-well"><Building2 size={18} /></span>Companies hiring</h2>
            <p>Openings and weighted average salary from the data-science salary dataset.</p>
          </div>
        </div>
        <div className="market-table-scroll">
          <table className="market-table">
            <thead>
              <tr><th>Company</th><th>Estimated openings</th><th>Average salary</th></tr>
            </thead>
            <tbody>
              {data.topCompanies.map(company => (
                <tr key={company.name}>
                  <th scope="row">{company.name}</th>
                  <td>{formatNumber(company.openings)}</td>
                  <td>{company.averageSalaryLpa === null ? 'N/A' : `₹${company.averageSalaryLpa} LPA`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="market-sources">
        Metrics are calculated from {data.sources.join(' and ')}. Salary values are in lakh per annum (LPA);
        openings and averages reflect the dataset&apos;s aggregated company/job rows.
      </footer>
    </div>
  );
}

export function MarketInsights({ onOpenSkillGraph }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/insights/market', { signal: controller.signal })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load market insights.');
        return result;
      })
      .then(data => setState({ status: 'ready', data, error: '' }))
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState({ status: 'error', data: null, error: error.message });
        }
      });

    return () => controller.abort();
  }, [attempt]);

  if (state.status === 'loading') {
    return <section className="glass-panel market-state" aria-live="polite">Loading job market analytics…</section>;
  }

  if (state.status === 'error') {
    return (
      <section className="glass-panel market-state market-state-error" role="alert">
        <h1>Market insights are unavailable</h1>
        <p>{state.error}</p>
        <button
          className="btn-secondary"
          onClick={() => {
            setState({ status: 'loading', data: null, error: '' });
            setAttempt(value => value + 1);
          }}
        >
          <RefreshCw size={16} /> Try again
        </button>
      </section>
    );
  }

  return <MarketInsightsContent data={state.data} onOpenSkillGraph={onOpenSkillGraph} />;
}
