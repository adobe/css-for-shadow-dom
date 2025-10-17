/*!
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

import dotenvFlow from "dotenv-flow";
import { HtmlBasePlugin } from "@11ty/eleventy";
import filters from "./config/filters.js";
import plugins from "./config/plugins/index.js";

dotenvFlow.config();

export default async function (eleventyConfig) {
  // framework options
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Plugins
  Object.keys(plugins).forEach((pluginName) => {
    eleventyConfig.addPlugin(plugins[pluginName]);
  });

  // passthroughs
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      output: "dist",
      input: "src",
      layouts: "_layouts"
    },
  };
}
