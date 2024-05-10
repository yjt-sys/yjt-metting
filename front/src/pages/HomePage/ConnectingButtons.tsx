import React from 'react';
import ConnectingButton from './ConnectingButton';
import { useNavigate } from 'react-router-dom';

const ConnectingButtons = () => {
  const navigate = useNavigate();

  //作为用户加入会议
  const pushToJoinRoomPage = () => {
    navigate('/join-room');
  };

  //作为主持人创建会议
  const pushToJoinRoomPageAsHost = () => {
    navigate('/join-room?host=true');
  };

  return (
    <div className='connecting_buttons_container'>
      <ConnectingButton
        buttonText='加入会议'
        onClickHandler={pushToJoinRoomPage}
      />
      <ConnectingButton
        createRoomButton
        buttonText='主持会议'
        onClickHandler={pushToJoinRoomPageAsHost}
      />
    </div>
  );
};

export default ConnectingButtons;
