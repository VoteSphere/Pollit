import React, { useState } from 'react';

interface PollState {
  pollname: string;
  description: string;
  option1: string;
  option2: string;
  option3: string;
}

const CreatePollPage: React.FC = (): JSX.Element => {
  const [inputState, setInputState] = useState<PollState>({
    pollname: '',
    description: '',
    option1: '',
    option2: '',
    option3: '',
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form className='createInput'>
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
          value={inputState.option1}
          onChange={handleInputs}
          placeholder='Option'
        ></input>
        <input
          name='option2'
          value={inputState.option2}
          onChange={handleInputs}
          placeholder='Option'
        ></input>
        <input
          name='option3'
          value={inputState.option3}
          onChange={handleInputs}
          placeholder='Option'
        ></input>
        <button name='createPoll' className='submitbutton' type='submit'>
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePollPage;
