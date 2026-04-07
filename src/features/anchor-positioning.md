---
title: 'Anchor Positioning'
description: 'Positions elements relative to anchor elements anywhere on the page, independent of containing block layout.'
support: 'discouraged'
baseline: 'limited'
functional: 'progressing'
usage: 'cross-context'
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

Anchor positioning is spec'd to work within shadow DOM contexts; anchors can be named and positioned within the same shadow tree. Cross-shadow anchoring (referencing an anchor from a different shadow tree) presently has mixed browser support. The `anchor-scope` property for controlling anchor visibility across shadow boundaries shows similar browser inconsistencies.

**Not recommended** due to limited browser support, and specificially shadow DOM feature failures. Adoption likely should wait for fully Baseline cross-browser support. Strongly recommend a fallback strategy using positioning libraries like Floating UI.
