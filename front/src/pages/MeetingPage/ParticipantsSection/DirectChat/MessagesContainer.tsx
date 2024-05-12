import React, { useRef, useEffect } from 'react';
import { messagesProps } from '@/store/modules/app'
const SingleMessage = ({ isAuthor, messageContent }: { isAuthor: boolean, messageContent: string }) => {
    const messageStyling = isAuthor
        ? 'author_direct_message'
        : 'receiver_direct_message';

    const containerStyling = isAuthor
        ? 'direct_message_container_author'
        : 'direct_message_messageStylingcontainer_receiver';

    return (
        <div className={containerStyling}>
            <p className={messageStyling}>{messageContent}</p>
        </div>
    );
};
const MessagesContainer: React.FC<{messages:Array<messagesProps>}> = ({messages}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        //让元素平滑滚动到窗口的可视区域
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    return (
        <div className='direct_messages_container'>
            {messages.map((message) => {
                return (
                    <SingleMessage
                        messageContent={message.messageContent}
                        isAuthor={message.isAuthor}
                        key={`${message.messageContent} - ${message.identity}`}
                    />
                );
            })}
            <div ref={scrollRef}></div>
        </div>
    );
};

export default MessagesContainer;


