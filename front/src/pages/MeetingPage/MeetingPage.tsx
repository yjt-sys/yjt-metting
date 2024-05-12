import React,{useEffect} from 'react'
import ChatSection from './ChatSection/ChatSection';
import ParticipantsSection from './ParticipantsSection/ParticipantsSection';
import MeetingLabel from './MeetingLabel.tsx';
import VideoSection from './VideoSection/VideoSection';
import Overlay from './Overlay';
import './MeetingPage.css';
import * as webRTCHandler from '@/utils/webRTCHandler.ts';
import {useSelector} from 'react-redux'
import {appInitialStateProps} from '@/store/modules/app'
const MeetingPage:React.FC=()=> {
    const state = useSelector((state:{app:appInitialStateProps})=>state.app)
    useEffect(() => {
        //路由守卫
        if (!state.isRoomHost && !state.roomId) {
          // 动态获取接口
          const siteUrl = window.location.origin;
          // 设置当前定向到的URL
          window.location.href = siteUrl;
        }
        webRTCHandler.getLocalPreviewAndInitRoomConnection(
          state.isRoomHost,
          state.identity,
          state.roomId,
          state.connectOnlyWithAudio
        );
      }, []);
 return (
  <>
  <div className='room_container'>
      <ParticipantsSection />
      <VideoSection />
      <ChatSection />
      <MeetingLabel roomId={state.roomId} />
      {state.showOverlay && <Overlay />}
    </div>
  </>
 )
}
export default MeetingPage