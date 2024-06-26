import store from "../store";
import { setShowOverlay, setMessages } from "../store/modules/app";

import Peer ,{SignalData}from "simple-peer";
import * as wss from "./wss";

import {messagesProps} from '../store/modules/app'
//指定请求的媒体类型和相对应的参数。
const defaultConstraints = {
  audio: true,
  video: { width: "480", height: "360" },
};

//仅开启音频链接
const onlyAudioConstraints = {
  audio: true,
  video: false,
};

//存储本地视频流
let localStream: MediaStream;

//获取本地预览及初始化房间连接
export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost: boolean,
  identity: string,
  roomId: string | null = null,
  onlyAudio: boolean
) => {
  //判断是开启音频还是音视频
  const constrains = onlyAudio ? onlyAudioConstraints : defaultConstraints;

  //采集本地音视频流（获取媒体输入的访问权限）
  navigator.mediaDevices
    .getUserMedia(constrains as MediaStreamConstraints)
    .then((stream) => {
      //   console.log('成功获取本地媒体流');
      localStream = stream;
      //预览本地视频
      showLocalVideoPreview(localStream);

      //派发action隐藏加载动画
      store.dispatch(setShowOverlay(false));

      //初始化房间连接
      isRoomHost
        ? wss.createNewRoom(identity, onlyAudio)
        : wss.joinRoom(roomId, identity, onlyAudio);
    })
    .catch((error) => {
      console.log("无法获取本地媒体流！");
      console.log(error);
    });
};
interface Peers {
    [key: string]: Peer.Instance;
  }
const peers:Peers = {};
let streams: MediaStream[] = [];
//配置STUN服务器
const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  };
};

const messageChannel = "messager";

//准备webRTC连接
export const prepareNewPeerConnection =(connUserSocketId:string, isInitiator:boolean) => {
  
  const configuration =getConfiguration();
  
  //实例化对等连接对象
  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
    channelName: messageChannel,
  });

  
  //信令数据传递
  peers[connUserSocketId].on("signal", (data) => {
    //==>peer1.on('signal', data)
    //data - webrtc offer, answer, or ice candidate
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    };
    wss.signalPeerData(signalData);
  });


  //获取媒体流stream
  peers[connUserSocketId].on("stream", (stream) => {
    console.log("成功获取远程Stream");
    //显示接收的stream媒体流
    addStream(stream, connUserSocketId);
    streams = [...streams, stream];
  });


  //data数据通道
  peers[connUserSocketId].on("data", (data) => {
    const messageData = JSON.parse(data);
    appendNewMessage(messageData);
  });
};

export const handleSignalingData = (data:{connUserSocketId:string,signal:SignalData}) => {
  //将信令数据添加到对等连接中
  peers[data.connUserSocketId].signal(data.signal); //==> peer2.signal(data)
};

//具体删除措施
export const removePeerConnection = (data:{socketId:string}) => {
  const { socketId } = data;
  //找到对应的元素
  const videoContainer = document.getElementById(socketId);
  const videoElement = document.getElementById(`${socketId}-video`) as HTMLVideoElement;

  if (videoContainer && videoElement) {
    const tracks = (videoElement.srcObject as MediaStream).getTracks();

    tracks.forEach((track) => track.stop());

    //将视频流设置为空
    videoElement.srcObject = null;
    //删除对应的元素
    videoContainer.removeChild(videoElement);
    if(videoContainer.parentNode){
        videoContainer.parentNode.removeChild(videoContainer);
    }
    

    if (peers[socketId]) {
      peers[socketId].destroy();
    }

    delete peers[socketId];
  }
};

/////////////////////////Video UI ///////////////////////////////////////

//显示本地视频
const showLocalVideoPreview = (stream:MediaStream) => {
  const videosContainer = document.getElementById("videos_portal");
  if(videosContainer){
    videosContainer.classList.add("videos_portal_styles");
  }
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_track_container");
  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = false;
  videoElement.srcObject = stream;

  //onloadedmetadata在指定视频/音频（audio/video）的元数据加载后触发。
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(videoElement);

  //仅开启音频的样式
  if (store.getState().app.connectOnlyWithAudio) {
    videoContainer.appendChild(onlyAudioLabel());
  }
  if(videosContainer){
    videosContainer.appendChild(videoContainer);
  }
};

//添加接收的stream媒体流并进行显示
const addStream = (stream:MediaStream, connUserSocketId:string) => {

  
  //使用js创建容器展示视频
  const videosContainer = document.getElementById("videos_portal");
  const videoContainer = document.createElement("div");
  videoContainer.id = connUserSocketId;
  videoContainer.classList.add("video_track_container");
  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = false;
  videoElement.srcObject = stream;
  videoElement.id = `${connUserSocketId}-video`;

  //onloadedmetadata在指定视频/音频（audio/video）的元数据加载后触发。
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  //放大/缩小视频信息
  videoElement.addEventListener("click", () => {
    if (videoElement.classList.contains("full_screen")) {
      videoElement.classList.remove("full_screen");
    } else {
      videoElement.classList.add("full_screen");
    }
  });

  videoContainer.appendChild(videoElement);

  //判断哪些用户是仅开启音频
  const participants = store.getState().app.participants;
  const participant = participants.find((p) => p.socketId === connUserSocketId);

  if (participant?.onlyAudio) {
    videoContainer.appendChild(onlyAudioLabel(participant.identity));
  } else {
    videoContainer.style.position = "static";
  }

  if(videosContainer){
    videosContainer.appendChild(videoContainer);
  }
};

//仅开启音频链接的样式效果
const onlyAudioLabel = (identity = "") => {
  const labelContainer = document.createElement("div");
  labelContainer.classList.add("label_only_audio_container");

  const label = document.createElement("p");
  label.classList.add("label_only_audio_text");
  label.innerHTML = `${identity}仅开启音频连接`;
  labelContainer.appendChild(label);
  return labelContainer;
};
/////////////////////////button logic ///////////////////////////////////////
export const toggleMic = (isMuted:boolean) => {
  //getAudioTracks - 返回可用的音频轨道
  //enabled - 获取或设置轨道是否激活 (true|false)
  localStream.getAudioTracks()[0].enabled = isMuted ? true : false;
};

export const toggleCamera = (isDisabled:boolean) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
};
//切换是视频流还是共享屏幕流
export const toggleScreenShare = (
  isScreenSharingActive:boolean,
  screenSharingStream?:MediaStream
) => {
  if (isScreenSharingActive) {
    //展示本地的媒体流
    switchVideoTracks(localStream);
  } else {
    //展示共享屏幕媒体流
    if(screenSharingStream){
        switchVideoTracks(screenSharingStream);
    }
  }
};
//对数据流具体进行一个替换
const switchVideoTracks = (stream:MediaStream) => {
  //遍历所有对等连接对象
  for (const socket_id in peers) {
    for (const index in peers[socket_id].streams[0].getTracks()) {
      for (const index2 in stream.getTracks()) {
        //kind属性规定轨道的种类（eg:audio,video）
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
        }
      }
    }
  }
};
/////////////////////////Messages ///////////////////////////////////////
const appendNewMessage = (messageData:Partial<messagesProps>) => {
  //同步到store进行保存
  const messages = store.getState().app.messages;
  store.dispatch(setMessages([...messages, messageData]));
};

//通过data通道发送聊天信息
export const sendMessageUsingDataChannel = (messageContent:string) => {
  //本地创建的聊天信息
  const identity = store.getState().app.identity;

  const localMessageData = {
    content: messageContent,
    identity: identity,
    messageCreatedByMe: true,
  };
  //将本地发送的聊天信息存储到store
  appendNewMessage(localMessageData);

  //聊天信息发送给远程webRTC对等方
  const messageData = {
    content: messageContent,
    identity: identity,
  };

  const stringifiedMessageData = JSON.stringify(messageData);
  for (const socket_id in peers) {
    peers[socket_id].send(stringifiedMessageData);
  }
};
