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

import supportLevels from "../src/_data/support-levels.js";

const support = (supportLevel) => {
  const tagClass = `tag tag--${supportLevel} spectrum-Body spectrum-Body--sizeXS`;

  return `<span class="${tagClass}">${supportLevels[supportLevel]}</span>`;
};

const wptSources = (sources) => {
  const sourceLinks = sources.map((source) => {
    const sourceLabel = source.match(/(\/([\w|-]+)\.html)/);
    return `<a href="https://wpt.fyi/results${source}">${sourceLabel[2]}</a>`;
  });
  return `<strong>WPT sources:</strong> ${sourceLinks.join(", ")}`;
};

const year = () => `${new Date().getFullYear()}`;

export default {
  support,
  wptSources,
  year,
};
