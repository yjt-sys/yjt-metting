import React from 'react';

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
    ? 'create_room_button'
    : 'join_room_button';
  return (
    <button className={buttonClass} onClick={onClickHandler}>
      {buttonText}
    </button>
  );
};

export default ConnectingButton;
