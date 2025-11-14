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

import dayjs from 'dayjs';
import slugify from 'slugify';
import { titleCase as titleCaseFn } from 'title-case';
import { url } from '../src/_data/meta.js';

const toISOString = (dateString) => dayjs(dateString).toISOString();

const formatDate = (date, format) => dayjs(date).format(format);

const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*¿?¡!<>{}]/g,
    lower: true,
  });
};

const titleCase = (str) => {
  let title = '';
  switch (str) {
    case 'light-dom-priority':
      title = 'Light DOM Priority';
      break;
    case 'will-change':
      title = 'Will Change';
      break;
    case 'may-change':
      title = 'May Change';
      break;
    default:
      return titleCaseFn(str);
      break;
  }

  return title;
};

const removeExtension = (str) => str.replace(/\.[^\/.]+$/, '');

const issueID = (str) => {
  const match = str.match(/issues\/(\d*)/);

  if (match[1]) {
    return match[1];
  }

  return '';
};

const absoluteUrl = (href) => `${url}${href}`;

export default {
  toISOString,
  formatDate,
  slugifyString,
  titleCase,
  removeExtension,
  issueID,
  absoluteUrl,
};
