import React from 'react';
import { Icon, Progress } from 'antd';

import Layout from '../../components/Layout';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { Query, Mutation } from 'react-apollo';
import { GetPollDetail } from '../../__generated__/GetPollDetail';
import { VotePollVariables, VotePoll } from '../../__generated__/VotePoll';

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

const VOTE_POLL_MUTATION = gql`
  mutation VotePoll($pollId: String!, $answerId: String!) {
    votePoll(pollId: $pollId, answerId: $answerId) {
      id
      voteCount
      answers {
        id
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
      <Query<GetPollDetail> query={GET_POLL_QUERY} variables={{ id }}>
        {({ data, error, loading }) => {
          if (loading) return <Icon type="loading" />;
          if (error) return error.toString();

          const totalVotes = data.poll.answers.reduce(
            (acc, c) => acc + c.voteCount,
            0
          );

          return (
            <>
              <h2>{data.poll.question}</h2>
              <ol>
                {data.poll.answers.map(a => {
                  return (
                    <Answer
                      key={a.id}
                      pollId={id}
                      answer={a}
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

function Answer({ answer, totalVotes, pollId }) {
  return (
    <Mutation<VotePoll, VotePollVariables> mutation={VOTE_POLL_MUTATION}>
      {(vote, { loading, error }) => (
        <li>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              vote({ variables: { pollId, answerId: answer.id } });
            }}
          >
            {answer.text}
          </a>
          {loading && <Icon type="loading" />}
          <Progress
            percent={(100 / totalVotes) * answer.voteCount}
            format={number => (
              <div style={{ float: 'right' }}>
                {answer.voteCount} <Icon type="like" />
              </div>
            )}
          />
        </li>
      )}
    </Mutation>
  );
}
