import React from 'react';
import { Button } from 'antd'
//定义接口类型
interface Props{
  createRoomButton?: boolean;
  buttonText: string;
  onClickHandler: () => void;
}

const ConnectingButton:React.FC<Props> = ({
  createRoomButton = false,
  buttonText,
  onClickHandler,
}) => {
  //判断按钮样式
  const buttonClass = createRoomButton
    ? 'primary'
    : undefined;
  return (
    <Button type={buttonClass} onClick={onClickHandler} style={{margin:"10px",width:"100px"}}>
      {buttonText}
    </Button>
  );
};

export default ConnectingButton;
