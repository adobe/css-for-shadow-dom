---
title: 'light-dark()'
description: 'A color function for defining two values, the first responding to light mode and the second to dark mode based on user preference or in response to an explicit value on color-scheme.'
support: 'caution'
functional: 'supported'
usage: 'cross-boundary'
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

The `light-dark()` function works fully within shadow DOM contexts: it inherits correctly, works through custom properties, with `::slotted()`, and when set directly within shadow DOM. Requires a `color-scheme` value to be set. Note that `light-dark()` only applies to color values.

Ranked **caution** due to Baseline newly available status (May 2024). Unsupporting browsers revert colors to initial values, risking severe visual breakage.
