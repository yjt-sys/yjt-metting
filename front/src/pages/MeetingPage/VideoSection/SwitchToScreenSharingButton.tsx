import  { useState } from 'react';
import SwitchImg from '@assets/images/switchToScreenSharing.svg';
import LocalScreenSharingPreview from './LocalScreenSharingPreview';
import * as webRTCHandler from '@/utils/webRTCHandler';
const constrains = {
  audio: false,
  video: true,
};

const SwitchToScreenSharingButton = () => {
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState<MediaStream | null>(null);
  const handleScreenShareToggle = async () => {
    if (!isScreenSharingActive) {
      let stream;
      try {
        //获取本地要共享的媒体资源
        stream = await navigator.mediaDevices.getDisplayMedia(constrains);
      } catch (error) {
        console.log('获取共享屏幕的媒体流失败');
      }
      if (stream) {
        setScreenSharingStream(stream);
        webRTCHandler.toggleScreenShare(isScreenSharingActive, stream);
        setIsScreenSharingActive(true);
      }
    } else {
      webRTCHandler.toggleScreenShare(isScreenSharingActive);
      setIsScreenSharingActive(false);
      //停止共享屏幕
      if(screenSharingStream){
        screenSharingStream.getTracks().forEach((track) => track.stop());
        setScreenSharingStream(null);
      }
    }
  };
  return (
    <>
      <div className='video_button_container'>
        <img
          src={SwitchImg}
          onClick={handleScreenShareToggle}
          className='video_button_image'
        />
      </div>
      {isScreenSharingActive && (
        <LocalScreenSharingPreview stream={screenSharingStream} />
      )}
    </>
  );
};

export default SwitchToScreenSharingButton;
