import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/voter.css';

import { votePageInfo } from '../../../../types/api';

const ResultPage: React.FC = () => {
  const [pollState, setPollState] = useState<votePageInfo>({
    poll_id: -1,
    poll_description: '',
    poll_name: '',
    votes_per_voter: 1,
    is_open: false,
    pollItemNames: ['', '', ''],
  });

  const [voteState, setVoteState] = useState<Record<string, number>>({
    ...pollState.pollItemNames.reduce(
      (acc, itemName) => ({
        ...acc,
        [itemName]: 0,
      }),
      {},
    ),
  });

  const handleVote = (itemName: string) => {
    if (pollState.votes_per_voter > 0) {
      setPollState({ ...pollState, votes_per_voter: pollState.votes_per_voter - 1 });
      setVoteState((prevState) => ({
        ...prevState,
        [itemName]: prevState[itemName] + 1,
      }));
    }
  };

  const handleClose = () => {
    setPollState({ ...pollState, is_open: false });

    fetch(`/api/polls/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollState.poll_id),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(() => {
        setPollState({
          poll_id: -1,
          poll_description: '',
          poll_name: '',
          votes_per_voter: 1,
          is_open: false,
          pollItemNames: ['', '', ''],
        });
      })
      .catch(() => console.log('error closing poll'));
  };

  const { pollId } = useParams<{ pollId: string }>();

  useEffect(() => {
    const fetchPollData = () => {
      fetch(`/api/polls/${pollId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          return response.json();
        })
        .then((data: votePageInfo) => {
          setPollState(data);
        })
        .catch(() => console.log('error creating new poll'));
    };

    fetchPollData();

    const intervalId = setInterval(fetchPollData, 1000); // Fetch every second

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [pollId]);

  return (
    <div className='container'>
      <h1>{pollState.poll_name}</h1>
      <p>{pollState.poll_description}</p>
      <p>
        <br />
        Vote to see results...
      </p>
      {pollState.pollItemNames.map((name: string, index: number) => (
        <div key={index}>
          <p>
            {name}: votes {voteState[name]}
          </p>
          {pollState.is_open && pollState.votes_per_voter > 0 && (
            <button type='button' onClick={() => handleVote(name)}>
              vote here
            </button>
          )}
        </div>
      ))}
      <button>Close Poll</button>
      <Link to='/'>Create New Poll</Link>
      {!pollState.is_open && <Link to='/results'>See Results</Link>}
    </div>
  );
};

export default ResultPage;
