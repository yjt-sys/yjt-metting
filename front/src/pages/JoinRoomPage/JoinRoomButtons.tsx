import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd'

interface JoinRoomButtonsProps{
    handleJoinRoom: () => void;
    isRoomHost: boolean;
    roomIdValue: string;
}

const JoinRoomButtons:React.FC<JoinRoomButtonsProps>=({ handleJoinRoom, isRoomHost,roomIdValue })=> {
    const successButtonText = isRoomHost ? '主持' : '加入';
    const navigate = useNavigate();
    //返回到介绍页面
    const pushToIntroductionPage = () => {
      navigate('/');
    };
    return (
      <div className='join_room_buttons_container'>
        <Button  onClick={handleJoinRoom} type='primary' disabled={roomIdValue.length===0 && !isRoomHost}>{successButtonText}</Button>
        &nbsp;&nbsp;&nbsp;
        <Button onClick={pushToIntroductionPage}>取消</Button>
      </div>
    );
}
export default JoinRoomButtons