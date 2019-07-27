import React from 'react';
import Link from 'next/link';
import { Icon } from 'antd';

import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import PollList from '../components/PollList';

const QUERY_ALL_POLLS = gql`
  query GetAllPolls {
    polls {
      ...PollListFragment
    }
  }
  ${PollList.fragments.polls}
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
          return <PollList polls={data.polls} />;
        }}
      </Query>
    </Layout>
  );
}
