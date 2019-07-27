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

          const totalVotes = data.poll.answers.reduce((acc, c) => acc + c, 0);

          return (
            <>
              <h2>{data.poll.question}</h2>
              <ol>
                {data.poll.answers.map(a => {
                  const { id, text } = a;
                  const votes = a.users.length;

                  return (
                    <Answer
                      key={id}
                      text={text}
                      votes={votes}
                      totalVotes={totalVotes}
                    />
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

function Answer({ text, votes, totalVotes }) {
  return (
    <li>
      <a href="#">{text}</a>

      <Progress
        percent={(100 / totalVotes) * votes}
        format={number => (
          <div style={{ float: 'right' }}>
            {votes} <Icon type="like" />
          </div>
        )}
      />
    </li>
  );
}
