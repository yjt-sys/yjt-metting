import React from 'react';
import {useSelector} from 'react-redux'
import { appInitialStateProps } from '@/store/modules/app'
import CameraButton from './CameraButton';
import LeaveRoomButton from './LeaveRoomButton';
import MicButton from './MicButton';
import SwitchToScreenSharingButton from './SwitchToScreenSharingButton';
const VideoButtons:React.FC = () => {
    const state = useSelector((state:{app:appInitialStateProps})=>state.app)
  return (
    <div className='video_buttons_container'>
      <MicButton />
      {!state.connectOnlyWithAudio && <CameraButton />}
      <LeaveRoomButton />
      {!state.connectOnlyWithAudio && <SwitchToScreenSharingButton />}
    </div>
  );
};

export default VideoButtons
