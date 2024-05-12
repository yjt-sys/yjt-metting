import React, { useState } from 'react';

import * as webRTCHandler from '@/utils/webRTCHandler';
import { Button, Input, Space } from 'antd';

const NewMessage: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setMessage(event.target.value);
  };
  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      //发送消息给其他用户
      sendMessage();
    }
  };
  const sendMessage = () => {
    // console.log('发送消息给其他用户...');
    // console.log(message);
    //执行发送消息函数
    webRTCHandler.sendMessageUsingDataChannel(message);
    setMessage('');
  };
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input defaultValue="请输入消息..." value={message} onChange={handleTextChange} onKeyDown={handleKeyDown}/>
      <Button type="primary" onClick={sendMessage}>发送</Button>
    </Space.Compact>

  );
}
export default NewMessage