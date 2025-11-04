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
