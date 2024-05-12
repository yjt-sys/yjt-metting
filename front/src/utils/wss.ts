import io, { Socket } from "socket.io-client";
import store from "../store";
import { setRoomId, setParticipants, setSocketId } from "../store/modules/app";
import * as webRTCHandler from "./webRTCHandler.ts";
import { appendNewMessageToChatHistory } from "./directMessages";
import {SignalData} from 'simple-peer'
import { DefaultEventsMap } from "@socket.io/component-emitter";
const SERVER = "http://localhost:3001/";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
//客户端连接 socketio 服务器
export const connectWithSocketIOServer = () => {
  socket = io(SERVER);

  socket.on("connect", () => {
    console.log("成功连接到socket.io 服务器");
    store.dispatch(setSocketId(socket.id));
  });
  socket.on("room-id", (data) => {
    const { roomId } = data;
    store.dispatch(setRoomId(roomId));
  });
  socket.on("room-update", (data) => {
    const { connectedUsers } = data;
    store.dispatch(setParticipants(connectedUsers));
  });

  socket.on("conn-prepare", (data) => {
    const { connUserSocketId } = data;
    console.log(connUserSocketId);
    
    //准备webRTC连接(应答方-false)
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, false);

    //通知对方我已经准备完毕可以进行webRTC连接
    socket.emit("conn-init", { connUserSocketId: connUserSocketId });
  });
  //信令接收并存储
  socket.on("conn-signal", (data) => {
    webRTCHandler.handleSignalingData(data);
  });

  //此时是要完成发送方保存接收方信令
  socket.on("conn-init", (data) => {
    const { connUserSocketId } = data;
    //准备webRTC连接(发起方-true)
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, true);
  });

  //删除已退出者
  socket.on("user-disconected", (data) => {
    webRTCHandler.removePeerConnection(data);
  });

  socket.on("direct-message", (data) => {
    // console.log('成功获取发送的私信');
    // console.log(data);
    appendNewMessageToChatHistory(data);
  });
};

//主持人创建会议房间
export const createNewRoom = (identity: string, onlyAudio: boolean) => {
  const data = {
    identity,
    onlyAudio,
  };
  
  //向服务器发送创建会议房间的数据（事件）
  socket.emit("create-new-room", data);
};

//加入会议房间
export const joinRoom = (
  roomId: string | null,
  identity: string,
  onlyAudio: boolean
) => {
  //向服务器发送加入会议房间的数据（事件）
  const data = {
    roomId,
    identity,
    onlyAudio,
  };

  socket.emit("join-room", data);
};

interface connSignal{
  signal: SignalData,
  connUserSocketId: string,
}
//通过socket.io像后端传递信令数据
export const signalPeerData = (data:connSignal) => {
  socket.emit("conn-signal", data);
};

interface directMessageProps {
  receiverSocketId: string;
  identity: string;
  messageContent: string;
}

export const sendDirectMessage = (data:directMessageProps) => {
  socket.emit("direct-message", data);
};
