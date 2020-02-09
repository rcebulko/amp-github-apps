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

const nock = require('nock');
const {createTokenAuth} = require('@octokit/auth');
const {Octokit} = require('@octokit/rest');

const {getFixture} = require('./_test_helper');
const {GitHub} = require('../src/github');

function fail() { throw new Error('Not implemented'); }

describe('GitHub interface', () => {
  const githubClient = new Octokit({
    authStrategy: createTokenAuth,
    auth: '_TOKEN_',
  });
  let github;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    github = new GitHub(githubClient, 'test_org');
  });

  afterEach(() => {
    // Fail the test if there were unused nocks.
    if(!nock.isDone()) {
      throw new Error('Not all nock interceptors were used!');
      nock.cleanAll();
    }
  });

  describe('userIsMember', () => {
    it('GETs /orgs/:org/members/:username', async done => {
      nock('https://api.github.com')
        .get('/orgs/test_org/members/someone')
        .reply(204);

      await github.userIsMember('someone');
      done();
    });

    it('returns true for 204: No Content', async done => {
      nock('https://api.github.com')
        .get('/orgs/test_org/members/someone')
        .reply(204);

      expect(await github.userIsMember('someone')).toBe(true);
      done();
    });

    it('returns false for 404: Not Found', async done => {
      nock('https://api.github.com')
        .get('/orgs/test_org/members/someone')
        .reply(404);

      expect(await github.userIsMember('someone')).toBe(false);
      done();
    });
  });

  describe('inviteUser', () => {
    it('PUTs to /orgs/:org/memberships/:username', async done => {
      nock('https://api.github.com')
        .put('/orgs/test_org/memberships/someone')
        .reply(200, getFixture('add_member.exists'))

        await github.inviteUser('someone');
        done();
    });

    it('returns true when the user is invited', async done => {
      nock('https://api.github.com')
        .put('/orgs/test_org/memberships/someone')
        .reply(200, getFixture('add_member.invited'))

        expect(await github.inviteUser('someone')).toBe(true);
        done();
    });

    it('returns false when the user is already a member', async done => {
      nock('https://api.github.com')
        .put('/orgs/test_org/memberships/someone')
        .reply(200, getFixture('add_member.exists'))

        expect(await github.inviteUser('someone')).toBe(false);
        done();
    });
  });

  describe('addComment', () => {
    it('POSTs comment to /repos/:owner/:repo/:issue_number/comment', async done => {
      nock('https://api.github.com')
        .post('/repos/test_org/test_repo/1337/comment', body => {
          expect(body).toEqual({ body: 'Test comment' });
        })
        .reply(200);

      await github.addComment('Test comment');
      done();
    });
  });
});