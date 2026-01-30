---
title: 'Changelog for All Features'
layout: 'page.liquid'
eleventyExcludeFromCollections: true
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

{% for day in changelog-index %}

  <article>
    <h2 class="spectrum-Body spectrum-Body--sizeS"><em>{{ day.date | formatDate: 'MMMM D, YYYY' }}</em></h2>

    <ul>
    {% for entry in day.entries %}
        <li><strong><a href="/changelog/{{ entry.feature}}/">{{ entry.feature | titleCase }}</a>:</strong> {{ entry.summary }}</li>
    {% endfor %}
    </ul>

  </article>

{% endfor %}
