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

const {InvitationRecord, InviteAction} = require('../src/invitation_record');

describe('invitation record', () => {
  let record;
  const invite = {
    username: 'someone',
    repo: 'test_repo',
    issue_number: 1337,
    action: InviteAction.INVITE,
  };
  const archivedInvite = Object.assign({archived: true}, invite);

  beforeEach(() => {
    record = new InvitationRecord();
  });

  describe('recordInvite', () => {
    // TODO: Update once the storage interface is determined.
    it('records an invite', fail);
    it('sets `archived = false`', fail);
  });

  describe('getInvites', () => {
    describe('if no invite record exists for the user', () => {
      it('returns an empty list', async done => {
        expect(await record.getInvite('someone')).toEqual([]);
        done();
      });
    });

    describe('if records exists of invites to the user', () => {
      beforeEach(async () => {
        await record.recordInvite(invite);
      });

      it('returns the invites', async done => {
        expect(await record.getInvite('someone')).toEqual(invite);
        done();
      });
    });

    describe('if only archived invite records exists for the user', () => {
      beforeEach(async () => {
        await record.recordInvite({archivedInvite});
      });

      it('returns an empty list', async done => {
        expect(await record.getInvite('someone')).toEqual([]);
        done();
      });
    });
  });

  describe('archiveInvites', () => {
    describe('if records exists of any invites to the user', () => {
      beforeEach(async () => {
        await record.recordInvite(invite);
        await record.recordInvite({
          username: 'someone',
          repo: 'test_repo',
          issue_number: 42,
          action: InviteAction.INVITE,
        });
      });

      it('updates the invite records', async done => {
        await record.archiveInvites('someone');

        const [firstInvite, secondInvite] = await record.getInvites('someone');
        expect(firstInvite.archived).toBe(true);
        expect(secondInvite.archived).toBe(true);

        done();
      });
    });
  });
});
