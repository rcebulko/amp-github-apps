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
 * Possible invite action types.
 * @readonly
 * @enum {number}
 */
const InviteAction = {
  INVITE: 1,
  INVITE_AND_ASSIGN: 2,
}

/**
 * An invite triggered by the bot.
 *
 * @typedef {{
 *   username: string,
 *   repo: string,
 *   issue_number: number,
 *   action: InviteAction,
 *   archived: boolean,
 * }}
 */
let Invite;

/**
 * A record of invites sent by the bot that may require follow-up actions.
 */
class InvitationRecord {
  /**
   * Constructor.
   *
   * @param {Logger} logger logging interface.
   */
  constructor(logger = console) {}

  /**
   * Records an invite created by the bot.
   *
   * @param {!Invite} invite invite to record.
   */
  async recordInvite(invite) {}

  /**
   * Looks up the invitation for a user, if one is recorded.
   *
   * @param {string} username username to look up invitation for.
   * @return {!Array<!Invite>} the invitation; null if no unarchived invite exists.
   */
  async getInvites(username) {
    return null;
  }

  /**
   * Marks an invite as archived, indicating all necessary follow-up actions
   * have been completed.
   *
   * @param {string} username username to archive invitation for.
   */
  async archiveInvites(username) {}
}

module.exports = {InvitationRecord, Invite, InviteAction};
