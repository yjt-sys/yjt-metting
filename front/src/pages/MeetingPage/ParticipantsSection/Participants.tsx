import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {UnknownAction} from '@reduxjs/toolkit'
import {type appInitialStateProps, setActiveConversation,type participantsProps } from '@/store/modules/app'
interface SingleParticipantProps{
    identity:string,
    lastItem:boolean,
    participant:participantsProps,
    setActiveConversation:(newValue:participantsProps)=>UnknownAction,
    socketId:string | null
}
const SingelParticipant:React.FC<SingleParticipantProps> = ({
        identity,
        lastItem,
        participant,
        setActiveConversation,
        socketId,
    }) => {

    const dispatch = useDispatch()
    //激活私信聊天，获取对象信息
    const handleOpenActiveConversation = () => {
        if (participant.socketId !== socketId) {
            dispatch(setActiveConversation(participant));
        }
    };
    return (
        <>
            <p
                className='participants_paragraph'
                onClick={handleOpenActiveConversation}
            >
                {identity}
            </p>
            {!lastItem && <span className='participants_separator_line'></span>}
        </>
    );
};

const Participants = () => {
    const state = useSelector((state:{app:appInitialStateProps})=>state.app)
    
    return (
        <div className='participants_container'>
            {state.participants.map((participant, index) => {
                return (
                    <SingelParticipant
                        identity={participant.identity}
                        lastItem={state.participants.length === index + 1}
                        participant={participant}
                        key={participant.identity}
                        setActiveConversation={setActiveConversation}
                        socketId={state.socketId}
                    />
                );
            })}
        </div>
    );
};
export default Participants