import React from 'react';
import Link from 'next/link';
import { Icon } from 'antd';

import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const QUERY_ALL_POLLS = gql`
  query GetAllPolls {
    polls {
      id
      question
      voteCount
    }
  }
`;

export default function Index() {
  return (
    <Layout>
      <h2>Latest Questions</h2>
      <Query query={QUERY_ALL_POLLS}>
        {({ data, error, loading }) => {
          if (loading) {
            return <Icon type="loading" />;
          }
          if (error) {
            return error.toString();
          }
          return (
            <ul>
              {data.polls.map(p => (
                <PollOverview poll={p} />
              ))}
            </ul>
          );
        }}
      </Query>
    </Layout>
  );
}

function PollOverview({ poll }) {
  return (
    <li>
      <Link href={`detail?id=${poll.id}`} as={`/detail/${poll.id}`}>
        <a>{poll.question}</a>
      </Link>{' '}
      ({poll.voteCount} <Icon type="like" />)
    </li>
  );
}
