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

/**
 * Interface for working with the GitHub API.
 */
class GitHub {
  /**
   * Constructor.
   *
   * @param {!octokit.Octokit} client Octokit GitHub client.
   * @param {string} org GitHub repository owner/organization.
   * @param {Logger} logger logging interface.
   */
  constructor(client, org, logger = console) {
    Object.assign(this, {client, org, logger});
  }

  /**
   * Checks whether a user is a member of the organization.
   *
   * @param {string} username user to check membership of.
   * @return {boolean}
   */
  async userIsMember(username) {
    // https://octokit.github.io/rest.js/#octokit-routes-orgs-check-membership
    // octokit.orgs.checkMembership({org, username});
    return false;
  }

  /**
   * Attempts to invite a user to the organization.
   *
   * @param {string} username user to invite.
   * @return {boolean} true if invite was sent; false if user already a member.
   */
  async inviteUser(username) {
    // https://octokit.github.io/rest.js/#octokit-routes-orgs-create-invitation
    // octokit.orgs.addOrUpdateMembership({org, username})
    return false;
  }

  /**
   * Adds a comment to an issue.
   *
   * @param {string} repo repository name.
   * @param {number} issue GitHub issue number.
   * @param {string} comment comment body.
   */
  async addComment(repo, issue, comment) {
    // https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    // octokit.issues.createComment({owner, repo, issue_number, body})
  }
}

module.exports = {GitHub};
