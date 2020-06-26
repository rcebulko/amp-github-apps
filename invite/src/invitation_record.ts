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

import {Database} from './db';
import {Invite, InviteActionType, Logger} from 'invite-bot';

export const InviteAction: Record<string, InviteActionType> = {
  INVITE: 'invite',
  INVITE_AND_ASSIGN: 'invite_and_assign',
};
const EXPIRATION_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

function expirationDate() {
  return new Date(Date.now() - EXPIRATION_INTERVAL_MS);
}

/**
 * A record of invites sent by the bot that may require follow-up actions.
 */
export class InvitationRecord {
  /**
   * Constructor.
   */
  constructor(private db: Database, private logger: Logger = console) {}

  /**
   * Records an invite created by the bot.
   */
  async recordInvite(invite: Invite): Promise<void> {
    this.logger.info(
      `recordInvite: Recording ${invite.action} to @${invite.username} from ` +
        `${invite.repo}#{invite.issue_number} (archived = ${invite.archived}).`
    );
    await this.db('invites').insert(invite);
  }

  /**
   * Looks up the invites for a user.
   */
  async getInvites(username: string): Promise<Array<Invite>> {
    this.logger.info(`getInvites: Looking up recorded invites to @${username}`);
    return (
      await this.db('invites').select().where({username, archived: false})
    ).map(invite => {
      // PostgresQL stores booleans as TINYINT, so we cast it to boolean.
      invite.archived = !!invite.archived;
      // PostgresQL returns timestamps as strings, so we wrap in a Date.
      invite.created_at = new Date(invite.created_at);
      return invite;
    });
  }

  /**
   * Marks a user's invites as archived, indicating all necessary follow-up
   * actions have been completed.
   */
  async archiveInvites(username: string): Promise<void> {
    this.logger.info(`archiveInvites: Archiving invites to @${username}`);
    await this.db('invites').where({username}).update({archived: true});
  }

  /**
   * Archive invites that have been expired by GitHub (over a week old).
   */
  async expireInvites(): Promise<void> {
    this.logger.info(`expireInvites: Archiving invites older than 7 days`);
    await this.db('invites')
      .where('created_at', '<', expirationDate().toISOString())
      .update({archived: true});
  }
}
