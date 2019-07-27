import React from 'react';
import { Icon, Progress } from 'antd';

import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { Query } from 'react-apollo';

const GET_POLL_QUERY = gql`
  query GetPollDetail($id: String!) {
    poll(id: $id) {
      question
      answers {
        text
        users {
          username
        }
      }
    }
  }
`;

export default function Detail() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <Query query={GET_POLL_QUERY} variables={{ id }}>
        {({ data, error, loading }) => {
          if (loading) {
            return <Icon type="loading" />;
          }
          if (error) {
            return error.toString();
          }

          const maxAnswers = data.poll.answers.reduce(
            (acc, curr) => (curr > acc ? curr : acc),
            5
          );

          const answers = data.poll.answers.map(a => (
            <li key={a.text}>
              <a href="#">{a.text}</a>

              <Progress
                percent={(100 / maxAnswers) * a.users.length}
                format={number => (
                  <div style={{ float: 'right' }}>
                    {a.users.length} <Icon type="like" />
                  </div>
                )}
              />
            </li>
          ));
          return (
            <div>
              <h2>{data.poll.question}</h2>
              <ol>{answers}</ol>
            </div>
          );
        }}
      </Query>
    </Layout>
  );
}
