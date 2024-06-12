import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { NewPollRequest, PollItem } from '../../../../types/api';

interface PollState {
  pollname: string;
  description: string;
  options: string[];
}

const VoterPage: React.FC = () => {
  const [inputState, setInputState] = useState<PollState>({
    pollname: '',
    description: '',
    options: ['', '', ''],
  });

  const [showLink, setShowLink] = useState<boolean>(false);
  const [pollId, setPollId] = useState<string>('');

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const data: NewPollRequest = {
      name: inputState.pollname,
      description: inputState.description,
      items: [
        { name: inputState.options[0] },
        { name: inputState.options[1] },
        { name: inputState.options[2] },
      ],
      maxVotes: 1,
    };
    fetch(`http://localhost:3000/api/polls/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((res) => {
        setPollId(res.e.pollId);
        setShowLink(true);
        setInputState({
          pollname: '',
          description: '',
          options: ['', '', ''],
        });
      })
      .catch(() => console.log('error creating new poll'));
  };

  return (
    <div>
      <form className='createInput' onSubmit={handleSubmit}>
        <h3>Create a Poll</h3>
        <input
          name='pollname'
          value={inputState.pollname}
          type=' text'
          onChange={handleInputs}
          placeholder='Poll Name'
        ></input>
        <input
          name='description'
          value={inputState.description}
          type='text'
          onChange={handleInputs}
          placeholder='Description'
        ></input>
        <h4>Poll Options</h4>
        <input
          name='option1'
          value={inputState.options[0]}
          onChange={handleInputs}
          placeholder='Option'
        ></input>
        <input
          name='option2'
          value={inputState.options[1]}
          onChange={handleInputs}
          placeholder='Option'
        ></input>
        <input
          name='option3'
          value={inputState.options[2]}
          onChange={handleInputs}
          placeholder='Option'
        ></input>
        <button name='createPoll' className='submitbutton' type='submit'>
          Create Poll
        </button>
        <div className='pollLink'>{showLink && <Link to={`/p/${pollId}`}>Poll Link</Link>}</div>
      </form>
    </div>
  );
};

export default VoterPage;
