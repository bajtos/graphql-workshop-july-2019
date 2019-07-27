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
          return data.polls.map(p => {
            return (
              <ul>
                <li>
                  <Link href={`detail?id=${p.id}`}>
                    <a>{p.question}</a>
                  </Link>{' '}
                  ({p.voteCount} <Icon type="like" />)
                </li>
              </ul>
            );
          });
        }}
      </Query>
    </Layout>
  );
}
