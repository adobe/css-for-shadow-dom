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

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import slugify from 'slugify';
import { titleCase as titleCaseFn } from 'title-case';
import { url } from '../src/_data/meta.js';

dayjs.extend(relativeTime);

const toISOString = (dateString) => dayjs(dateString).toISOString();

const formatDate = (date, format) => dayjs(date).format(format);

// Only useful if we are able to do daily builds
const relativeDate = (date) => dayjs().to(date);

const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*¿?¡!<>{}]/g,
    lower: true,
  });
};

const titleCase = (str) => {
  let title = '';

  if (str.startsWith('at-')) {
    title = str.replace('at-', '@');
  } else {
    switch (str) {
      case 'light-dom-priority':
        title = 'Light DOM Priority';
        break;
      default:
        title = titleCaseFn(str);
        break;
    }
  }

  return !title.includes('Cross-') ? title.replaceAll('-', ' ') : title;
};

const removeExtension = (str) => str.replace(/\.[^\/.]+$/, '');

const issueID = (str) => {
  const match = str.match(/issues\/(\d*)/);

  if (match[1]) {
    return match[1];
  }

  return '';
};

const testStatus = (status) => (status === 'FAIL' ? 'fails' : 'passes');

const changelogEntryTitle = (type) => {
  return {
    'test-added': 'New failing test',
    'test-removed': 'New passing test',
    'test-result': 'Updated test result',
    baseline: 'Updated Baseline',
    milestone: 'New milestone',
  }[type];
};

const absoluteUrl = (href) => `${url}${href}`;

export default {
  toISOString,
  formatDate,
  relativeDate,
  slugifyString,
  titleCase,
  removeExtension,
  issueID,
  testStatus,
  changelogEntryTitle,
  absoluteUrl,
};
