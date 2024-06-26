import React from 'react'

const LeaveRoomButton:React.FC=()=> {
    const handleRoomDisconnection = () => {
        // 动态获取接口
        const siteUrl = window.location.origin;
        // 设置当前定向到的URL
        window.location.href = siteUrl;
      };
      return (
        <div className='video_button_container'>
          <button className='video_button_end' onClick={handleRoomDisconnection}>
            离开房间
          </button>
        </div>
      );
}
export default LeaveRoomButton