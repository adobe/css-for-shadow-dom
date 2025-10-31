---
title: "@property"
description: "Allows for property type checking and constraining, setting default values, and defining whether or not a custom property can inherit values. "
support: "acceptable"
baseline: "newly"
functional: "critical"
usage: "light-dom-priority"
---

{% comment %}
/*
 * Copyright 2025 Adobe. All rights reserved.
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
{% endcomment %}
Per current browser support, `@property` definitions can only exist in light DOM. However, applied defined properties in shadow DOM respect those definitions. This makes them usable for applications that are able to host a global stylesheet and don’t require scoped definitions.
