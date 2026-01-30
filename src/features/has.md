---
title: ':has()'
description: 'Selector for selecting the parent or previous element based on detecting the presence of child elements or sibling relationships'
support: 'caution'
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

The `:has()` selector has mixed browser support for shadow DOM usage, with missing consensus on expected behavior. Cross-browser, `:has()` cannot cross the light/shadow boundary to peer into a different scope. Host-based selectors like `:host:has()` and `:host(:has())` have inconsistent support across browsers.

Ranked **caution** due to mixed browser consensus — effective use is limited to elements within the same scope, without relying on host-based or cross-boundary selectors.
