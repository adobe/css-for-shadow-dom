---
title: About
---

<!--
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
-->

This project is maintained by [Adobe Spectrum Web Engineering](https://opensource.adobe.com/spectrum-web-components/) as a contribution to the web components community. It tracks how modern CSS features behave within and across the shadow DOM, surfacing parity gaps, real-world limitations, and the issues influencing interoperability.

Where possible, evaluations come from upstream [Web Platform Tests](https://wpt.fyi/) and link to the relevant specs and issue trackers. The goal isn’t to redefine correctness, it’s to make current behavior easier to see, compare, and talk about.

The dashboard reflects what ships in current stable browsers. As tests, specs, and implementations change, the data here changes too.

By showing where behavior diverges across contexts, this project helps highlight work that could unlock meaningful improvements for real-world adoption. The aim is to make it easier to line up spec intent, test coverage, and what developers experience in practice.

## Why is this needed?

When people say "browser support," they usually mean _light DOM_ support. That’s what Baseline, Interop, Can I Use, and MDN compatibility tables report.

Because most compatibility data reflects light DOM behavior, support in shadow DOM can lag, diverge, or shift as specs evolve and browsers ship updates.

Features considered “cross-browser” based on light DOM results may still have limited support or important caveats in shadow DOM. This directly affects when those features are safe to adopt in applications that mix contexts.

For example, cascade layers, container queries, `@scope`, and `@property` can behave differently between light and shadow DOM. Some differences are inherent to encapsulation, some are bugs, and some are still being worked out in the specs. This project tries to make those distinctions easier to spot.

The dashboard provides granular support information for high-impact CSS features across contexts and browsers, with links to relevant bugs and CSSWG discussions. Results are grounded in [Web Platform Tests](https://wpt.fyi/) (WPT), and tests are linked so behavior can be inspected and validated upstream. Data reflects stable browser releases.

## How is support determined?

Support ratings consider:

- Baseline status
- WPT results related to shadow DOM behavior
- Whether essential functionality works for shadow DOM
- Availability of fallbacks and the cost of failure
- Practical progressive-enhancement paths

Ratings can change as browsers fix issues or specs clarify behavior.

## How are features selected?

Features are chosen based on:

- Architectural impact
- Potential for mismatched expectations between contexts
- Spec volatility

For example, `@property` can only be registered in light DOM today, but the registration affects usage inside shadow DOM. That nuance isn’t obvious from standard compatibility data, so the dashboard calls it out and links to the relevant threads.

## Who is this for?

This project is for engineers designing, building, or maintaining systems that span light and shadow DOM and who manage the styling challenges mixed contexts introduce.

Use it to understand how modern CSS behaves across boundaries. The data and references are meant to support architectural decisions and make CSS integration with web components more predictable.

## How can I get involved?

Contributions improve shared understanding across specs, tests, and implementations.

- Share the project and [repo](https://github.com/adobe/css-for-shadow-dom)
- File or contribute to CSSWG and browser issues
- Add context or real-world use cases to linked issues
- [Suggest features to track](https://github.com/adobe/css-for-shadow-dom/discussions/new?category=feature-proposal)
- Suggest additional feature tests to include in this dashboard
- Propose new or expanded Web Platform tests

If you believe a result is incorrect or lacks context, please open an issue.

Help keep the information accurate as the platform evolves → see the [contributing guidelines](/contributing/).
