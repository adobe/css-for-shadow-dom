---
title: 'Popover API'
description: 'A web API that enables promoting elements to the top layer, escaping containing blocks and superseding z-index layering'
support: 'supported'
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

Popover works within shadow-DOM contexts, both declaratively and via scripting. The trigger and the content must exist in the same context, though the content may be the light DOM of another component as long as its ID is unique.

Ranked **progressing** due to focus behavior inconsistencies: Firefox and Safari fail tests for focus handling inside shadow DOM popovers. Core popover functionality and shadow host focus delegation work correctly across all browsers.
