/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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
import {GraphQL} from 'pr-ref-check';
import {RateLimitedGraphQL} from './rate_limited_graphql';

const PAGE_SIZE = 100;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const GITHUB_REPO = process.env.GITHUB_REPO || 'ampproject/amphtml';
const [GITHUB_ORG, GITHUB_REPO_NAME] = GITHUB_REPO.split('/');

const graphql = new RateLimitedGraphQL(process.env.GITHUB_ACCESS_TOKEN);

const _prInfoCache: Record<number, GraphQL.PrInfo> = {};
const prInfoQuery = (prNumber: number): string => `query {
  repository(owner: "ampproject", name: "amphtml") {
    pullRequest(number: ${prNumber}) {
      title
      number
      mergedAt
    }
  }
}`;

async function getPrInfo(prNumber: number): Promise<GraphQL.PrInfo> {
  if (!_prInfoCache[prNumber]) {
    const {repository} = (await graphql.runQuery(
      prInfoQuery(prNumber)
    )) as GraphQL.PrInfoResponse;
    _prInfoCache[prNumber] = repository.pullRequest;
  }

  return _prInfoCache[prNumber];
}

const refHistoryQuery = (
  ref: string,
  since: Date,
  after: string | null
): string => `query {
  repository(owner: "${GITHUB_ORG}", name: "${GITHUB_REPO_NAME}") {
    ref(qualifiedName: "${ref}") {
      target {
        # cast Target to a Commit
        ... on Commit {
          history(
            first: ${PAGE_SIZE},
            after: ${JSON.stringify(after)},
            since: "${since.toISOString()}"
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              abbreviatedOid
              messageHeadline
            }
          }
        }
      }
    }
  }
}`;

async function getRefHistoryPage(
  ref: string,
  since: Date,
  after: string | null
): Promise<GraphQL.CommitHistory> {
  const {repository} = (await graphql.runQuery(
    refHistoryQuery(ref, since, after)
  )) as GraphQL.CommitHistoryResponse;
  return repository.ref.target.history;
}

async function* getRefHistory(
  ref: string,
  since: Date
): AsyncIterable<GraphQL.Commit> {
  const commits = [];
  let after = null;

  while (true) {
    const {
      pageInfo: {hasNextPage, endCursor},
      nodes,
    } = (await getRefHistoryPage(ref, since, after)) as GraphQL.CommitHistory;

    for (let i = 0; i < nodes.length; ++i) {
      yield nodes[i];
    }

    if (!hasNextPage || commits.length > 500) {
      break;
    }
    after = endCursor;
  }
}

export async function isPrInRef(
  ref: string,
  prNumber: number
): Promise<boolean> {
  const {mergedAt} = await getPrInfo(prNumber);
  const since = new Date(Number(new Date(mergedAt)) - ONE_DAY_MS);

  let checked = 0;
  for await (const commit of getRefHistory(ref, since)) {
    ++checked;
    if (commit.messageHeadline.endsWith(` (#${prNumber})`)) {
      console.log(`${ref}: Checked ${checked} commits`);
      return true;
    }
  }
  console.log(`${ref}: Checked ${checked} commits`);
  return false;
}
