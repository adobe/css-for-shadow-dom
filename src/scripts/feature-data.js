/*
 * Copyright 2026 Adobe. All rights reserved.
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
import fs from 'node:fs';
import path from 'node:path';
import Fetch from '@11ty/eleventy-fetch';

import { features } from 'web-features';

const CACHE_DURATION = '12h';
const SNAPSHOT_FILE = path.join('src', '_data', 'snapshot.json');
const FETCH_RETRY_DELAYS = [1000, 2000, 4000];
const USE_COMMITTED_DATA = process.env.USE_COMMITTED_DATA === 'true';
const TRACKED_BROWSERS = ['chrome', 'edge', 'firefox', 'safari'];
let browserRunsPromise;
let browserRunsError;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readSnapshot = () => {
  if (!fs.existsSync(SNAPSHOT_FILE)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
};

const getSnapshotData = () => readSnapshot()?.data ?? null;

const getPassingBrowserResults = () => Object.fromEntries(TRACKED_BROWSERS.map((browser) => [browser, 'PASS']));

const normalizePassingTests = (passingTests) => {
  if (!passingTests) {
    return null;
  }

  if (Array.isArray(passingTests)) {
    return Object.fromEntries(passingTests.map((testName) => [testName, getPassingBrowserResults()]));
  }

  return passingTests;
};

const normalizeFeatureResults = (results = {}) => ({
  summary: results.summary || {},
  failing: results.failing ?? null,
  passing: normalizePassingTests(results.passing),
});

const serializePassingTests = (passingTests) => {
  if (!passingTests) {
    return null;
  }

  return Object.keys(passingTests);
};

const hasAllBrowserResults = (resultsByBrowser) => TRACKED_BROWSERS.every((browser) => resultsByBrowser[browser]);

const isPassingTestResult = (resultsByBrowser) =>
  hasAllBrowserResults(resultsByBrowser) && TRACKED_BROWSERS.every((browser) => resultsByBrowser[browser] === 'PASS');

const isFailingTestResult = (resultsByBrowser) => Object.values(resultsByBrowser).includes('FAIL');

const fetchJsonWithRetry = async (url, label) => {
  let lastError;

  for (let attempt = 0; attempt < FETCH_RETRY_DELAYS.length; attempt++) {
    try {
      return await Fetch(url, {
        duration: CACHE_DURATION,
        type: 'json',
      });
    } catch (error) {
      lastError = error;

      if (attempt < FETCH_RETRY_DELAYS.length - 1) {
        console.warn(
          `Retrying ${label} fetch (${attempt + 1}/${FETCH_RETRY_DELAYS.length - 1}) after failure: ${error.message}`,
        );
        await sleep(FETCH_RETRY_DELAYS[attempt]);
      }
    }
  }

  throw lastError;
};

const getBrowserRuns = async () => {
  if (USE_COMMITTED_DATA) {
    throw new Error('Live WPT fetch disabled in committed-data mode');
  }

  if (browserRunsError) {
    throw browserRunsError;
  }

  if (!browserRunsPromise) {
    const browserRunsUrl =
      'https://wpt.fyi/api/runs?label=master&label=stable&max-count=1&product=chrome&product=edge&product=firefox&product=safari';

    browserRunsPromise = fetchJsonWithRetry(browserRunsUrl, 'browser runs').catch((error) => {
      browserRunsError = error;
      throw error;
    });
  }

  return await browserRunsPromise;
};

const formatResultsUrl = (resultsUrl, testScope) => {
  return resultsUrl.replace('-summary_v2.json.gz', '') + testScope;
};

const getBrowserVersions = async () => {
  if (USE_COMMITTED_DATA) {
    const cachedBrowserVersions = getSnapshotData()?.browserVersions;

    if (cachedBrowserVersions) {
      return cachedBrowserVersions;
    }

    throw new Error('Committed-data mode requires browser versions in src/_data/snapshot.json');
  }

  try {
    const browserRuns = await getBrowserRuns();
    const browsers = {};

    for (const browser of browserRuns) {
      const browserName = browser.browser_name;
      const shortVersion = /^\d+(\.?(?!0))\d+/.exec(browser.browser_version)[0];

      browsers[browserName] = shortVersion;
    }

    return browsers;
  } catch (error) {
    const snapshot = readSnapshot();
    const cachedBrowserVersions = snapshot?.data?.browserVersions;

    if (cachedBrowserVersions) {
      console.warn(`Using cached browser versions from snapshot after WPT fetch failure: ${error.message}`);
      return cachedBrowserVersions;
    }

    throw error;
  }
};

const getCachedFeatureResults = (featureKey) => {
  if (!featureKey) {
    return null;
  }

  const cachedFeatureResults = getSnapshotData()?.results?.find((entry) => entry.feature === featureKey) ?? null;

  return cachedFeatureResults ? normalizeFeatureResults(cachedFeatureResults) : null;
};

const getWptResults = async (testScopes, featureKey) => {
  if (USE_COMMITTED_DATA) {
    const cachedFeatureResults = getCachedFeatureResults(featureKey);

    if (cachedFeatureResults) {
      return cachedFeatureResults;
    }

    throw new Error(`Committed-data mode requires WPT results for "${featureKey}" in src/_data/snapshot.json`);
  }

  let browserRuns;

  try {
    browserRuns = await getBrowserRuns();
  } catch (error) {
    const cachedFeatureResults = getCachedFeatureResults(featureKey);

    if (cachedFeatureResults) {
      console.warn(`Using cached WPT results for "${featureKey}" after WPT fetch failure: ${error.message}`);
      return cachedFeatureResults;
    }

    console.warn(`Skipping WPT results for "${featureKey || 'unknown feature'}": ${error.message}`);
    return {};
  }

  const testResults = {};

  for (const testScope of testScopes) {
    const browsers = browserRuns.map((x) => ({
      name: x.browser_name,
      version: x.browser_version,
      resultsUrl: formatResultsUrl(x.results_url, testScope),
    }));

    const testName = testScope.split('/').pop().replace('.html', '');

    for (const browser of browsers) {
      try {
        const browserResults = await fetchJsonWithRetry(browser.resultsUrl, `"${testScope}" for ${browser.name}`);

        const tests = browserResults.subtests;

        if (tests.length === 0 && browserResults.status) {
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
      } catch (error) {
        console.warn(`Error fetching "${testScope}" for ${browser.name}: ${error.message}`);
      }
    }
  }

  let hasPassingTests = false;
  let hasFailingTests = false;

  const results = {};

  if (Object.keys(testResults).length > 0) {
    results.summary = TRACKED_BROWSERS.reduce((acc, browser) => {
      const statuses = Object.values(testResults).map((r) => r[browser]);
      acc[browser] = statuses.every((s) => s === 'PASS') ? 'passes' : 'fails';
      return acc;
    }, {});

    const passedTests = Object.fromEntries(Object.entries(testResults).filter(([, test]) => isPassingTestResult(test)));
    const failedTests = Object.fromEntries(Object.entries(testResults).filter(([, test]) => isFailingTestResult(test)));

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

export { getWptResults, getBrowserVersions, getBaselineStatus, normalizeFeatureResults, serializePassingTests };
