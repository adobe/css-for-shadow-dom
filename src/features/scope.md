---
title: '@scope'
description: 'Enables scoped styling with upper and lower boundaries, where proximity to defined scopes affects which rules win.'
support: 'caution'
baseline: 'newly'
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

Global `@scope` cannot cross the shadow boundary to apply to shadow elements. Within shadow DOM, `@scope` works with `:host` and `:host()` as the scoping root, and implicit `@scope` (without a boundary) correctly scopes to the shadow root. Note that `::slotted()` within `@scope` lacks test coverage and may have inconsistent support.

Ranked **caution** due to limited real-world testing with shadow DOM. While WPT tests pass and Firefox 131+ completes cross-browser support, some edge cases like `::slotted()` in `@scope` remain unverified.
