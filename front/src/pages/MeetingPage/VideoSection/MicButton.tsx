import React, { useState } from 'react';
import MicButtonImg from '@assets/images/mic.svg';
import MicButtonImgOff from '@assets/images/micOff.svg';
import * as webRTCHandler from '@/utils/webRTCHandler';
const MicButton:React.FC = () => {
  const [isMicMuted, setIsMicMuted] = useState(false);

  const handleMicButtonPressed = () => {
    webRTCHandler.toggleMic(isMicMuted);
    setIsMicMuted(!isMicMuted);
  };
  return (
    <div className='video_button_container'>
      <img
        src={isMicMuted ? MicButtonImgOff : MicButtonImg}
        onClick={handleMicButtonPressed}
        className='video_button_image'
      />
    </div>
  );
};

export default MicButton;
