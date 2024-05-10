import React, { useState } from 'react'
import JoinRoomInputs from './JoinRoomInputs';
import ErrorMessage from './ErrorMessage';
import JoinRoomButtons from './JoinRoomButtons';
import OnlyWithAudioCheckbox from './OnlyWithAudioCheckbox';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomExists } from '../../services/api';
import {  setConnectOnlyWithAudio, setIdentity, setRoomId, type appInitialStateProps } from '../../store/modules/app'
import { useNavigate } from 'react-router-dom';
const JoinRoomContent: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector((state: { app: appInitialStateProps }) => state.app)
    const [roomIdValue, setRoomIdValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //加入房间
    const handleJoinRoom = async () => {
        dispatch(setIdentity(nameValue));
        if (state.isRoomHost) {
            createRoom();
        } else {
            await joinRoom();
        }
    };

    //作为成员加入房间
    const joinRoom = async () => {
        const responseMessage = await getRoomExists(roomIdValue);

        const { roomExists, full } = responseMessage;

        if (roomExists) {
            if (full) {
                setErrorMessage('会议房间人数已满，请稍后再试！');
            } else {
                //进入房间
                dispatch(setRoomId(roomIdValue));
                navigate('/meeting');
            }
        } else {
            setErrorMessage('会议房间不存在，请验证你的ID是否正确！');
        }
    };

    //作为主持人创建房间
    const createRoom = () => {
        navigate('/meeting');
    };
    return (
        <>
            <JoinRoomInputs
                roomIdValue={roomIdValue}
                setRoomIdValue={setRoomIdValue}
                nameValue={nameValue}
                setNameValue={setNameValue}
                isRoomHost={state.isRoomHost}
            />
            <OnlyWithAudioCheckbox
                connectOnlyWithAudio={state.connectOnlyWithAudio}
                setConnectOnlyWithAudio={setConnectOnlyWithAudio}
            />
            <ErrorMessage errorMessage={errorMessage} />
            <JoinRoomButtons
                isRoomHost={state.isRoomHost}
                handleJoinRoom={handleJoinRoom}
                roomIdValue={roomIdValue}
            />
        </>
    )
}
export default JoinRoomContent