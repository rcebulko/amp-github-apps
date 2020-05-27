/**
 * Copyright 2020 The AMP HTML Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('dotenv').config();

import {isPrInRef} from './src/is_pr_in_ref';
import express from 'express';

const GITHUB_REPO = process.env.GITHUB_REPO || 'ampproject/amphtml';

express()
  .get(
    [
      '/:prNumber/:ref',
      '/pr/:prNumber/ref/:ref',
      '/ref/:ref/pr/:prNumber',
      '/pr/:prNumber/rtv/:ref',
      '/rtv/:ref/pr/:prNumber',
      '*',
    ],
    async (req, res) => {
      let {ref, prNumber} = req.params;
      // Allow either ordering of
      if (prNumber && ref && prNumber.length > ref.length) {
        const tmp = prNumber;
        prNumber = ref;
        ref = tmp;
      }
      const prNum = Number(prNumber);

      if (!ref || !prNum) {
        res.status(400);
        res.send(
          'Path should be of the form <code>/pr/:prNum/ref/:ref</code> or ' +
            '<code>/:prNum/:ref</code>'
        );
        return;
      }

      const prUrl = `https://github.com/${GITHUB_REPO}/pulls/${prNum}`;
      const refUrl = `https://github.com/${GITHUB_REPO}/commits/${ref}`;
      const isInRef = await isPrInRef(ref, prNum);

      res.send(
        `<h1>${isInRef ? 'YES' : 'NO'}</h1>
        <h2>
          <a href="${prUrl}">#${prNum}</a> ${isInRef ? 'is' : 'is not'} in
          <a href="${refUrl}"><code>${ref}</code></a>
        </h2>`
      );
    }
  )
  .listen(process.env.PORT || 8080, () => {
    console.log(`Listening...`);
  });
