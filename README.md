# Modern CSS Feature Support For Shadow DOM

Tracking the state of support for CSS features within and across the shadow DOM to provide visibility into feature parity, usage details, and outstanding issues and bugs.

## Feature Content

### Feature Data

Additional data for a feature is provided through an Eleventy Template Data File, which takes the filename format of `[feature-slug].json` and lives in the `/features` directory.

The data may include:

- resources
- related issues

Here is the full available schema:

```json
{
  "wpt": ["/css/[full-test-path-1].html", "/css/[full-test-path-2].html"],
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

> **Note**: Build-time compiled test result data is saved to `wpt-results.json` for tracking test history to enable reviewing and updating feature support definitions when changes occur.

#### `issues` schema

> **Note**: Do not list issues that are covered by WPT unless there is lack of a resolution and outstanding discussion

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
