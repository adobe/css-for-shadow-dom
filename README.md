# Modern CSS Feature Support For Shadow DOM

Tracking the state of support for CSS features within and across the shadow DOM to provide visibility into feature parity, usage details, and outstanding issues and bugs.

## Getting Started

1. Install all dependencies with `npm i`
2. Run locally with `npm start`

The project will be available at `http://localhost:8080/`.

_The browser will not automatically launch._

### Commits and Pre-Commit

If your commit push doesn't go through, ensure you are on Corp VPN and logged in to Enterprise GitHub (can be done in-browser).

Upon pre-commit, the following will be run via husky:

- `prepare` - inits husky
- `copyright` - adds or updates the Adobe copyright to all eligible files
- `changelogs` - refreshes generated changelog data
- `lint-staged` - formats staged files

## Deployment

GitHub Pages deployment is handled by the workflow at `.github/workflows/deploy-pages.yml`.

It runs only on pushes to `main` and on manual dispatch, so pull requests do not publish preview deployments.

### Additional Commands

- `npm run build` - preview build files, available in `dist`
- `npm run clean` - clean out `dist` and the `.cache`
  - this is also run prior to `start` and `build` to ensure freshest WPT data
- `npm run debug` - enables verbose console output of 11ty processing

## Project Features

This project is built with the [static site generator 11ty](https://11ty.dev).

The templating languages in use are Markdown, Liquid, and Javascript.

For Liquid, there are a few differences in the 11ty-specific implementation [as described in the docs](https://www.11ty.dev/docs/languages/liquid/).

CSS leverages Spectrum CSS for design tokens, and styles are processed with postcss.

On build, HTML and inline JS is minified.

SVG icons included in `/src/assets/icons` are combined into an SVG sprite via [eleventy-plugin-icons](https://www.npmjs.com/package/eleventy-plugin-icons) which is embedded via the `base` layout.

## Project Architecture

11ty inclusions such as plugins, filters, and shortcodes are primarily configured in `config`.

A custom script for ensuring inclusion and yearly updating of the Adobe copyright header is located in `bin`. It will be prepended or updated upon pre-commit, if relevant, and _does not_ need added manually.

Site source files are located in `src` and published to `dist`.

### Contents of `src`

- `_data` - 11ty global data files, storing data for availability throughout templates
- `_generate` - generates the COPYRIGHT statement with current year, and the compiled results for the latest WPT test runs as JSON
- `_includes` - template blocks and components for inclusion in layouts and templates
- `_layouts` - layout templates for content types, where `base` is the main layout which the others extend from
- `assets` - contains `css`, `icons` (SVG files, auto-combined into sprite), and `images`
- `features` - **the primary content type**, management described below in "Feature Content"
- `pages` - non-feature content, such as "About"
- `home.liquid` - the site home page

## Feature Content

A "feature" is the content type for each CSS feature profiled on this site.

For each feature, two files are expected:

- [feature-name].md - provides the critical metadata and support definition
- [feature-name].json - supplemental data, described in next section

Additionally, a changelog file is auto-generated, but may also be manually modified.

The Markdown file expects the following frontmatter:

```md
---
title: 'Main Feature Title'
description: 'Short definition for the CSS property/feature'
support: 'acceptable|supported|caution|discouraged'
functional: 'unsupported|low|progressing|critical|supported'
usage: 'light-dom-priority|cross-context|cross-boundary'
baselineFeature: '' # Include only if filename differs from feature ID
---
```

Where `support`, `functional`, and `usage` maps to definitions provided in corresponding global data files in `_data`.

> [!IMPORTANT]
> Each build has the potential to update the changelogs, and those diffs should be examined to see if modified test results necessitate changing support definitions for the corresponding features.

### Feature JSON Data

Additional data for a feature is provided through an Eleventy Template Data File, which takes the filename format of `[feature-slug].json` and lives in the `/features` directory.

The data may include:

- Web Platform Test sources
- resource links
- related issues
- baseline feature id - _include only if different from file name_

Here is the full available schema:

```json
{
  "wpt": ["/css/[full-test-path-1].html", "/css/[full-test-path-2].html"],
  "baselineFeature": "",
  "resources": [
    {
      "label": "",
      "url": ""
    }
  ],
  "issues": [
    {
      "label": "",
      "description": "",
      "status": "",
      "links": [
        {
          "url": "",
          "browser": ""
        }
      ]
    }
  ]
}
```

For `baselineFeature`, find the match in [the web-features repo](https://github.com/web-platform-dx/web-features/tree/main/features) by doing a file search in the sidebar. If it differs from the local filename in use, use the web-features name as the value for `baselineFeature`. Otherwise, the automation to pull the correct Baseline status will fail.

### `wpt` data

[Web Platform Tests](https://wpt.fyi) - aka "WPT" - are the unit tests for all web platform features and test all evergreen browsers. These tests _may_ include shadow DOM-specific feature tests.

For example, the test suite for container queries at present has two relevant testing scopes:

- [https://wpt.fyi/results/css/css-conditional/container-queries/container-for-shadow-dom.html](https://wpt.fyi/results/css/css-conditional/container-queries/container-for-shadow-dom.html)
- [https://wpt.fyi/results/css/css-conditional/container-queries/container-name-tree-scoped.html](https://wpt.fyi/results/css/css-conditional/container-queries/container-name-tree-scoped.html)

The `wpt` key for feature data expects an array containing the substring of the URL after `https://wpt.fyi/results` including `.html`. So for container queries, the full data becomes:

```js
"wpt": [
  "/css/css-conditional/container-queries/container-for-shadow-dom.html",
  "/css/css-conditional/container-queries/container-name-tree-scoped.html"
],
```

The naming convention for these tests usually follows the spec, hence why container queries tests are nested under `css-conditional`.

You can use the search on WPT to do partial string searches for the primary CSS feature, such as `at-property` to get a list of available test suites. From there, you'll have to check sub-tests to determine if relevant shadow DOM tests are available.

> [!IMPORTANT]
> Build-time compiled test result data is saved to `_data/snapshot.json` for tracking test history to enable reviewing and updating feature support definitions when changes occur.

The fetched test results are locally cached for 12 hours. You can refresh the data by removing the cache with `npm run clean`.

#### `issues` schema

> [!NOTE]
> Do not list issues that are covered by WPT unless there is lack of a resolution and outstanding discussion

The `label` and `description` are manual short summaries of the issue and its impact on shadow DOM implementations.

The `links` array is for one or more CSSWG issues or browser bug links, where `browser` is optional in the case of a CSSWG issue.

Acceptable `browser` values include:

- `chrome`
- `edge`
- `firefox`
- `safari`

Acceptable `status` values include:

- `will-change` - issue discussion shows progress towards an implementation adjustment or agreement towards making an adjustment (like a CSSWG resolution)
- `may-change` - there is active discussion but no, or only partial, implementation progression
- `stable` - issue has discussion or resolution pointing to no-change to identified behavior

## Changelogs

Changelogs are auto-generated based on the Baseline status and results from WPT.

They are located in `src/_data/changelogs`, one per feature.

If needed, you can modify the entry or add a manual entry. Manual entries should follow the shape of existing entries, with the `id` field tagged with the date and `-manual` as well as use the `type` of `manual`.
