import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/index.css';

import { NewPollRequest, PollItem } from '../../../../types/api';

interface PollState {
  pollname: string;
  description: string;
  options: string[];
}

const CreatePollPage: React.FC = (): JSX.Element => {
  const [inputState, setInputState] = useState<PollState>({
    pollname: '',
    description: '',
    options: ['', '', ''],
  });

  const [showLink, setShowLink] = useState<boolean>(true);

  const [pollId, setPollId] = useState<string>('');

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };

  const handleOptionsInputs = (index: number, value: string) => {
    setInputState((prevState) => {
      const newOptions = [...prevState.options];
      newOptions[index] = value;
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };

  const addOption = () => {
    setInputState((prevState) => ({
      ...prevState,
      options: [...prevState.options, ''],
    }));
  };

  const deleteOption = (index: number) => {
    setInputState((prevState) => {
      const newOptions: string[] = [...prevState.options];
      newOptions.splice(index, 1);
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const data: NewPollRequest = {
      name: inputState.pollname,
      description: inputState.description,
      items: inputState.options.map((option) => ({ name: option })),
      maxVotes: 1,
    };
    fetch('/api/polls', {
      method: 'POST',
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
        console.log(res);
        setPollId(res.urlSlug);
        setShowLink(true);
        setInputState({
          pollname: '',
          description: '',
          options: ['', '', ''],
        });
      })
      .catch((e) => console.log(e));
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
        {inputState.options.map((option, index) => (
          <div key={index}>
            <input
              type='text'
              value={option}
              onChange={(e) => handleOptionsInputs(index, e.target.value)}
              placeholder='Option'
            />
            {inputState.options.length >= 3 && (
              <button type='button' onClick={() => deleteOption(index)}>
                Delete Option
              </button>
            )}
          </div>
        ))}
        <button type='button' onClick={() => addOption()}>
          Add Option
        </button>
        <button name='createPoll' className='submitbutton' type='submit'>
          Create Poll
        </button>
        <div className='pollLink'>{showLink && <Link to={`${pollId}`}>Poll Link</Link>}</div>
      </form>
    </div>
  );
};

export default CreatePollPage;
