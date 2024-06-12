import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { votePageInfo } from '../../../../types/api';

const VoterPage: React.FC = () => {
  const [pollState, setPollState] = useState<votePageInfo>({
    poll_description: '',
    poll_name: '',
    votes_per_voter: 1,
    is_open: false,
    pollItemNames: ['', '', ''],
  });

  const handleVoteFunc = () => {
    if (pollState.votes_per_voter > 0) {
      setPollState({ ...pollState, votes_per_voter: pollState.votes_per_voter - 1 });
    }
  };

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch(`http://localhost:3000/api/polls/${id}`, {
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
  });

  return (
    <div>
      <h1>{pollState.poll_name}</h1>
      <p>{pollState.poll_description}</p>
      <p>
        <br />
        Vote to see results...
      </p>
      {pollState.is_open &&
        pollState.votes_per_voter > 0 &&
        pollState.pollItemNames.map((name: string, index: number) => (
          <div key={index}>
            <button type='button' onClick={() => handleVote()}>
              {name}
            </button>
            <p></p>
          </div>
        ))}
    </div>
  );

  // const [inputState, setInputState] = useState<PollState>({
  //   pollname: '',
  //   description: '',
  //   options: ['', '', ''],
  // });
  // const [showLink, setShowLink] = useState<boolean>(false);
  // const [pollId, setPollId] = useState<string>('');
  // const handleInputs = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setInputState({ ...inputState, [e.target.name]: e.target.value });
  // };
  // const handleSubmit = (e: React.FormEvent): void => {
  //   e.preventDefault();
  //   const data: NewPollRequest = {
  //     name: inputState.pollname,
  //     description: inputState.description,
  //     items: [
  //       { name: inputState.options[0] },
  //       { name: inputState.options[1] },
  //       { name: inputState.options[2] },
  //     ],
  //     maxVotes: 1,
  //   };
  //   fetch(`http://localhost:3000/api/polls/${id}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok.');
  //       }
  //       return response.json();
  //     })
  //     .then((res) => {
  //       setPollId(res.e.pollId);
  //       setShowLink(true);
  //       setInputState({
  //         pollname: '',
  //         description: '',
  //         options: ['', '', ''],
  //       });
  //     })
  //     .catch(() => console.log('error creating new poll'));
  // };
  // return (
  //   <div>
  //     <form className='createInput' onSubmit={handleSubmit}>
  //       <h3>Create a Poll</h3>
  //       <input
  //         name='pollname'
  //         value={inputState.pollname}
  //         type=' text'
  //         onChange={handleInputs}
  //         placeholder='Poll Name'
  //       ></input>
  //       <input
  //         name='description'
  //         value={inputState.description}
  //         type='text'
  //         onChange={handleInputs}
  //         placeholder='Description'
  //       ></input>
  //       <h4>Poll Options</h4>
  //       <input
  //         name='option1'
  //         value={inputState.options[0]}
  //         onChange={handleInputs}
  //         placeholder='Option'
  //       ></input>
  //       <input
  //         name='option2'
  //         value={inputState.options[1]}
  //         onChange={handleInputs}
  //         placeholder='Option'
  //       ></input>
  //       <input
  //         name='option3'
  //         value={inputState.options[2]}
  //         onChange={handleInputs}
  //         placeholder='Option'
  //       ></input>
  //       <button name='createPoll' className='submitbutton' type='submit'>
  //         Create Poll
  //       </button>
  //       <div className='pollLink'>{showLink && <Link to={`/p/${pollId}`}>Poll Link</Link>}</div>
  //     </form>
  //   </div>
  // );
};

export default VoterPage;
