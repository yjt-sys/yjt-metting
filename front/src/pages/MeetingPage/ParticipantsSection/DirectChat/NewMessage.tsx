import React, { useState } from 'react'
import {  useSelector } from 'react-redux'
import * as wss from '@/utils/wss';
import {appInitialStateProps,participantsProps} from '@/store/modules/app'
import { Button, Input, Space } from 'antd';
const NewMessage: React.FC = () => {
    const state = useSelector((state:{app:appInitialStateProps}) => state.app);
    const [message, setMessage] = useState('');

    const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = () => {
        //发送消息
        wss.sendDirectMessage({
            receiverSocketId: (state.activeConversation as participantsProps).socketId,
            identity: state.identity,
            messageContent: message,
        });
        setMessage('');
    };
    return (
    <Space.Compact style={{ width: '100%' }}>
      <Input defaultValue="请输入消息..." value={message} onChange={handleTextChange} onKeyDown={handleKeyDown}/>
      <Button type="primary" onClick={sendMessage}>发送</Button>
    </Space.Compact>
    )
}
export default NewMessage