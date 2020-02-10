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

describe('end-to-end', () => {
  describe('when @someone is a member of the org', () => {
    describe('when a comment includes "/invite @someone"', () => {
      it('comments', fail);
    });

    describe('when a comment includes "/tryassign @someone"', () => {
      describe('when the issue is already assigned', () => {
        it('comments', fail);
      });

      describe('when the issue is unassigned', () => {
        it('assigns, comments', fail)
      })
    });
  });

  describe('when @someone is not a member of the org', () => {
    describe('when a comment includes "/invite @someone"', () => {
      it('invites, records, comments', fail);

      describe('once the invite is accepted', () => {
        it('comments, archives', fail);
      })
    });

    describe('when a comment includes "/tryassign @someone"', () => {
      describe('when the issue is already assigned', () => {
        it('invites, records, comments', fail);

        describe('once the invite is accepted', () => {
          it('comments, archives', fail);
        });
      });

      describe('when the issue is unassigned', () => {
        it('invites, records, comments', fail);

        describe('once the invite is accepted', () => {
          it('assigns, comments, archives', fail);
        });
      });
    });
  });
});
