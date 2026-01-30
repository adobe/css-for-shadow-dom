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

const button = (content, href, btnSize, btnType) => {
  const type = btnType || 'secondary';
  const size = btnSize || 'M';
  const classes = `spectrum-Button spectrum-Button--fill spectrum-Button--${type} spectrum-Button--size${size}`;
  const label = `<span class="spectrum-Button-label">${content}</span>`;

  if (href != '') {
    return `<a href="${href}" class="${classes}">${label}</a>`;
  } else {
    return `<button class="${classes}">${label}</button>`;
  }
};

const testResult = (content, result) => {
  let status = '';
  switch (result) {
    case 'passes':
      status = 'pass';
      break;
    case 'fails':
      status = 'fail';
      break;
    default:
      status = result;
      break;
  }

  const classes = `tag tag--${status} spectrum-Body spectrum-Body--sizeS`;
  return `<div class="${classes}">${content}</div>`;
};

export default {
  button,
  testResult,
};
