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

const {InvitationRecord, Invite, InviteAction}

INVITE_MACROS = {
  invite: InviteAction.INVITE,
  tryassign: InviteAction.INVITE_AND_ASSIGN,
}
// Regex source: https://github.com/shinnn/github-username-regex
USERNAME_PATTERN = '^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$'
MACRO_PATTERN = `/(${Object.keys(INVITE_MACROS).join('|')})`
FULL_MACRO_REGEX = new RegExp(`${MACRO_PATTERN} @${USERNAME_PATTERN}`, 'i');

/**
 * GitHub bot which can invite users to an organization and assign issues in
 * response to macro comments.
 */
class InviteBot {
  /**
   * Constructor.
   *
   * @param {!octokit.Octokit} client GitHub API client.
   * @param {string} org GitHub organization.
   * @param {!Datastore} datastore Google Cloud datastore.
   * @param {Logger} logger logging interface.
   */
  constructor(client, org, datastore, logger = console) {
    this.github = new GitHub(client, org, logger);
    this.record = new InvitationRecord(datastore, logger);
    this.logger = logger;
  }

  /**
   * Parses a comment for invitation macros.
   *
   * @param {string} comment comment body to parse.
   * @return {!Object<string, InviteAction>} map of parsed users and actions.
   */
  parseMacros() {
    return {};
  }

  /**
   * Attempt to invite the user, record the invite, and comment with an update
   * about the status of the invite.
   *
   * Should be called in response to new comments with the /invite or /tryassign
   * macros.
   *
   * @param {!Invite} invite invite to attempt.
   * @return {boolean} true if user isn't a member yet and the invite is sent.
   */
  async tryInvite(invite) {
    return false;
  }

  /**
   * Attempt to assign the user to the associated issue and comments on the
   * thread.
   *
   * Should be called in response to accepted invitations in order to update the
   * thread(s) from which the user was invited.
   *
   * @param {!Invite} invite accepted invite to assign user from.
   * @param {boolean} accepted true if the user just accepted an invite.
   */
  async tryAssign(invite, accepted) {
    return false;
  }
}

module.exports = {InviteBot};
