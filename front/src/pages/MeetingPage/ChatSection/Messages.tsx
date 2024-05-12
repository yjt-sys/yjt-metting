import React from 'react'
import {useSelector} from 'react-redux'
import {appInitialStateProps,messagesProps} from '@/store/modules/app'
interface messageProps extends messagesProps{
    sameAuthor: boolean
}
const Message:React.FC<Partial<messageProps>> = ({ identity, content, sameAuthor, messageCreatedByMe }) => {
    const alignClass = messageCreatedByMe
      ? 'message_align_right'
      : 'message_align_left';
  
    const authorText = messageCreatedByMe ? '我' : identity;
  
    const contentStyles = messageCreatedByMe
      ? 'message_right_styles'
      : 'message_left_styles';
  
    return (
      <div className={`message_container ${alignClass}`}>
        {!sameAuthor && <p className='message_title'>{authorText}</p>}
        <p className={`message_content ${contentStyles}`}>{content}</p>
      </div>
    );
  };
const Messages:React.FC=()=> {
    const store=useSelector((state:{app:appInitialStateProps})=>state.app)
 return (
    <div className='messages_container'>
    {store.messages.map((message:messagesProps, index:number) => {
      const sameAuthor =
        index > 0 && message.identity === store.messages[index - 1].identity;
      return (
        <Message
          key={`${message.content}${index}`}
          identity={message.identity}
          content={message.content}
          sameAuthor={sameAuthor}
          messageCreatedByMe={message.messageCreatedByMe}
        />
      );
    })}
  </div>
 )
}
export default Messages