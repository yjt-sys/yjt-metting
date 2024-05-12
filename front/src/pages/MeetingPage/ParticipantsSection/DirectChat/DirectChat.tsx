import React, { useState, useEffect, SetStateAction } from 'react';
import ConversationNotChosen from './ConversationNotChosen';
import DirectChatHeader from './DirectChatHeader';
import MessagesContainer from './MessagesContainer';
import NewMessage from './NewMessage';
import {useSelector} from 'react-redux'
import {appInitialStateProps,directChatHistoryProps} from '@/store/modules/app'
//获取用户的历史记录
const getDirectChatHistory = (directChatHistory:Array<directChatHistoryProps>, socketId:string|null = null) => {
    //是否存在directChatHistory或者socketId
    if (!socketId || !directChatHistory) {
      return [];
    }
  
    const history = directChatHistory.find(
      (history:directChatHistoryProps) => history.socketId === socketId
    );
  
    return history ? history.chatHistory : [];
  };
const DirectChat:React.FC=()=> {
    const [messages, setMessages] = useState([]);
    const state = useSelector((state:{app:appInitialStateProps})=>state.app)
  useEffect(() => {
    if(state.activeConversation){
        setMessages(
            getDirectChatHistory(
                state.directChatHistory,
                state.activeConversation ? state.activeConversation.socketId : null
            ) as SetStateAction<never[]>
        );
    }
    
  }, [state.activeConversation,state.directChatHistory]);
 return (
    <div className='direct_chat_container'>
    <DirectChatHeader activeConversation={state.activeConversation} />
    <MessagesContainer messages={messages} />
    <NewMessage />
    {!state.activeConversation && <ConversationNotChosen />}
  </div>
 )
}
export default DirectChat