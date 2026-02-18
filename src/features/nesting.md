---
title: 'Native Nesting'
description: 'The ability to nest one style rule inside of another.'
support: 'acceptable'
functional: 'supported'
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

Native CSS nesting works as expected within shadow DOM when applied to non-`:host` elements. However, nesting within `:host` selectors has mixed browser support: Safari versions earlier than 18.1 have known issues, nesting states on `:host` (e.g., `:hover`) fails, and the featureless `&` does not reference `:host`.
