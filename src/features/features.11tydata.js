/*
 * Copyright 2025 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * This file fetches WPT data for each feature at build-time.
 * Data is cached locally for 12 hours.
 * Refresh the data by removing the cache with `npm run clean`.
 */
import Fetch from '@11ty/eleventy-fetch';

import { features } from 'web-features';

const getBrowserRuns = async () => {
  const browserRunsUrl =
    'https://wpt.fyi/api/runs?label=master&label=stable&max-count=1&product=chrome&product=edge&product=firefox&product=safari';
  return await Fetch(browserRunsUrl, {
    duration: '12h',
    type: 'json',
  });
};

const formatResultsUrl = (resultsUrl, testScope) => {
  return resultsUrl.replace('-summary_v2.json.gz', '') + testScope;
};

const getBrowserVersions = async () => {
  const browserRuns = await getBrowserRuns();
  const browsers = {};

  for (const browser of browserRuns) {
    const browserName = browser.browser_name;
    const shortVersion = /^\d+(\.?(?!0))\d+/.exec(browser.browser_version)[0];

    browsers[browserName] = shortVersion;
  }

  return browsers;
};

const getWptResults = async (testScopes) => {
  const browserRuns = await getBrowserRuns();

  const testResults = {};

  for (const testScope of testScopes) {
    const browsers = browserRuns.map((x) => ({
      name: x.browser_name,
      version: x.browser_version,
      resultsUrl: formatResultsUrl(x.results_url, testScope),
    }));

    for (const browser of browsers) {
      try {
        const browserResults = await Fetch(browser.resultsUrl, {
          duration: '1d',
          type: 'json',
        });

        const tests = browserResults.subtests;

        if (tests.length === 0 && browserResults.status) {
          const testName = testScope.split('/').pop().replace('.html', '');

          testResults[testName] = {
            ...testResults[testName],
            [browser.name]: browserResults.status,
          };
        }

        for (const test of tests) {
          testResults[test.name] = {
            ...testResults[test.name],
            [browser.name]: test.status,
          };
        }
      } catch (e) {
        console.log(`Error fetching "${testScope}"`);
      }
    }
  }

  let hasPassingTests = false;
  let hasFailingTests = false;

  const results = {};

  if (Object.keys(testResults).length > 0) {
    results.summary = ['chrome', 'edge', 'firefox', 'safari'].reduce((acc, browser) => {
      const statuses = Object.values(testResults).map((r) => r[browser]);
      acc[browser] = statuses.every((s) => s === 'PASS') ? 'passes' : 'fails';
      return acc;
    }, {});

    const passedTests = Object.fromEntries(
      Object.entries(testResults).filter((t) => !Object.values(t[1]).includes('FAIL')),
    );
    const failedTests = Object.fromEntries(
      Object.entries(testResults).filter((t) => Object.values(t[1]).includes('FAIL')),
    );

    hasPassingTests = Object.keys(passedTests).length > 0;
    hasFailingTests = Object.keys(failedTests).length > 0;

    if (hasFailingTests) {
      // Prioritize failing tests
      results.failing = failedTests;
    }

    if (hasPassingTests) {
      results.passing = passedTests;
    }
  }

  return results;
};

const getBaselineStatus = (data) => {
  const feature = data.baselineFeature || data.page.fileSlug;
  const status = features[feature].status.baseline;

  return (
    {
      low: 'newly',
      high: 'widely',
    }[status] ?? 'limited'
  );
};

// TODO: Allow filtering of subtests for example /css-scoping/ filter by host-has-*
export default {
  eleventyComputed: {
    wptResults: async (data) => (data.wpt ? await getWptResults(data.wpt) : false),
    wptBrowsers: await getBrowserVersions(),
    baseline: (data) => getBaselineStatus(data),
  },
};
