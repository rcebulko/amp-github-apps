/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS-IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare module 'pr-ref-check' {
  /** GraphQL query response structure. */
  export namespace GraphQL {
    export interface Commit {
      abbreviatedOid: string;
      messageHeadline: string;
    }

    export interface PageInfo {
      hasNextPage: boolean;
      endCursor: string;
    }

    export interface CommitHistory {
      nodes: Array<Commit>;
      pageInfo: PageInfo;
    }

    export interface CommitHistoryResponse {
      repository: {
        ref: {
          target: {
            history: CommitHistory;
          };
        };
      };
    }

    export interface PrInfo {
      title: string;
      number: number;
      mergedAt: string;
    }

    export interface PrInfoResponse {
      repository: {
        pullRequest: PrInfo;
      };
    }
  }
}
