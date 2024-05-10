import React from 'react'
import { Input } from 'antd';

interface Props{
    roomIdValue:string,
    setRoomIdValue:React.Dispatch<React.SetStateAction<string>>,
    nameValue:string,
    setNameValue:React.Dispatch<React.SetStateAction<string>>,
    isRoomHost:boolean
}



const JoinRoomInputs:React.FC<Props>=({ roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost })=> {
    // 获取会议ID
  const handleRoomIdValueChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setRoomIdValue(event.target.value);
  };
  //获取用户姓名
  const handleNameValueChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNameValue(event.target.value);
  };
 return (
    <div className='join_room_inputs_container'>
    {!isRoomHost && (
      <Input
        className='join_room_input'
        placeholder='请输入会议ID号...'
        value={roomIdValue}
        onChange={handleRoomIdValueChange}
      />
    )}
    <Input
      className='join_room_input'
      placeholder='请输你的姓名...'
      value={nameValue}
      onChange={handleNameValueChange}
    />
  </div>
 )
}
export default JoinRoomInputs