import React from 'react';
import Link from 'next/link';
import { Icon } from 'antd';
import gql from 'graphql-tag';

export default function PollList({ polls }) {
  return (
    <ul>
      {polls.map(p => (
        <PollOverview key={p.id} poll={p} />
      ))}
    </ul>
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

PollList.fragments = {
  polls: gql`
    fragment PollListFragment on Poll {
      id
      question
      voteCount
    }
  `
};
