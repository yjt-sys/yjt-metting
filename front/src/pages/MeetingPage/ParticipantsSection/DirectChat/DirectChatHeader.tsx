import React from 'react'
import {participantsProps} from '@/store/modules/app'
const DirectChatHeader:React.FC<{activeConversation:participantsProps|null}>=({ activeConversation })=> {
 return (
    <div className='direct_chat_header'>
    <p className='direct_chat_header_paragraph'>
      {activeConversation ? activeConversation.identity : ''}
    </p>
  </div>
 )
}
export default DirectChatHeader