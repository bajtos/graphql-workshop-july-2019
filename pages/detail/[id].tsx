import React from 'react';
import { Icon, Progress } from 'antd';

import Layout from '../../components/Layout';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { Query } from 'react-apollo';

const GET_POLL_QUERY = gql`
  query GetPollDetail($id: String!) {
    poll(id: $id) {
      question
      answers {
        id
        text
        voteCount
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

          const totalVotes = data.poll.answers.reduce((acc, c) => acc + c, 0);

          return (
            <>
              <h2>{data.poll.question}</h2>
              <ol>
                {data.poll.answers.map(a => {
                  return (
                    <Answer key={a.id} answer={a} totalVotes={totalVotes} />
                  );
                })}
              </ol>
            </>
          );
        }}
      </Query>
    </Layout>
  );
}

function Answer({ answer, totalVotes }) {
  return (
    <li>
      <a href="#">{answer.text}</a>

      <Progress
        percent={(100 / totalVotes) * answer.voteCount}
        format={number => (
          <div style={{ float: 'right' }}>
            {answer.voteCount} <Icon type="like" />
          </div>
        )}
      />
    </li>
  );
}
