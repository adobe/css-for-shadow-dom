---
title: '@keyframes'
description: 'Defines a named set of keyframes for use with the CSS <code>animation</code> property.'
support: 'caution'
functional: 'progressing'
usage: 'cross-boundary'
baselineFeature: 'animations-css'
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

`@keyframes` defined outside of a shadow context are considered global and `@keyframes` defined within a shadow context are considered “tree-scoped”.

Ranked **caution** due to inconsistent behavior across browsers for cross-boundary usage. A consensus seems to have been reached for `@keyframes` defined within a shadow context to be tree-scoped, however, currently only Safari implements this correctly, Firefox leaks `@keyframes` defined within a tree outside, and Chrome has inconsistent support.
