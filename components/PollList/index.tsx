import React from 'react';
import Link from 'next/link';
import { Icon } from 'antd';
import gql from 'graphql-tag';
import {
  GetAllPolls_polls,
  GetAllPolls
} from '../../__generated__/GetAllPolls';

export default function PollList({ polls }: GetAllPolls) {
  return (
    <ul>
      {polls.map(p => (
        <PollOverview key={p.id} poll={p} />
      ))}
    </ul>
  );
}

function PollOverview({ poll }: { poll: GetAllPolls_polls }) {
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
