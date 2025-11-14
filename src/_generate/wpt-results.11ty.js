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
 * Generates wpt-results.json for tracking history of WPT test results
 */
class WPTResults {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalinkBypassOutputDir: true,
      permalink: './wpt-results.json',
    };
  }

  render(data) {
    const features = data.collections.features;
    const output = {};

    output.testQueryDate = new Date().toLocaleDateString();

    output.browserVersions = features[0].data.wptBrowsers;

    output.results = [];

    for (const feature of features) {
      const failingTests = feature.data.wptResults.failing;
      output.results.push({
        title: feature.data.title,
        summary: feature.data.wptResults.summary,
        failing: failingTests ?? 'none',
      });
    }

    return JSON.stringify(output, null, 2);
  }
}

export default WPTResults;
