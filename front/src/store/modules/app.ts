import { createSlice, Dispatch } from "@reduxjs/toolkit";
export interface appInitialStateProps {
  identity: string;
  isRoomHost: boolean;
  connectOnlyWithAudio: boolean;
  roomId: string | null;
  showOverlay: boolean;
  participants: Array<participantsProps>;
  messages: Array<messagesProps>;
  //是否开启私聊
  activeConversation:null|participantsProps;
  //聊天记录
  directChatHistory:Array<directChatHistoryProps>;
  //我们的socketid
  socketId: string | null;
}
export interface chatHistoryProps{
    isAuthor:boolean
    messageContent:string
    identity:string
}
export interface directChatHistoryProps{
  socketId:string;
  chatHistory:chatHistoryProps[]
}
export interface participantsProps{
  identity:string;
  id:string;
  roomId:string;
  socketId:string;
  onlyAudio?:boolean;
}
export interface messagesProps{
  messageContent: string;
  isAuthor: boolean;
  content:string;
  identity:string;
  messageCreatedByMe:boolean;
}

const initialState:appInitialStateProps={
  identity: "",
  isRoomHost: false,
  connectOnlyWithAudio: false,
  roomId: null,
  showOverlay: true,
  participants: [],
  messages: [],
  //是否开启私聊
  activeConversation: null,
  //聊天记录
  directChatHistory:[],
  //我们的socketid
  socketId: null,
}
const app = createSlice({
  name: "app",

  initialState,

  reducers: {
    setIsRoomHost(state, { payload }) {
      state.isRoomHost = payload;
    },
    setIdentity(state, { payload }) {
      state.identity = payload;
    },
    setConnectOnlyWithAudio(state, { payload }) {
      state.connectOnlyWithAudio = payload;
    },
    setRoomId(state, { payload }) {
      state.roomId = payload;
    },
    setShowOverlay(state, { payload }) {
      state.showOverlay = payload;
    },
    setParticipants(state, { payload }) {
      state.participants = payload;
    },
    setMessages(state, { payload }) {
      state.messages = payload;
    },
    setActiveConversation(state, { payload }) {
      state.activeConversation = payload;
    },
    setDirectChatHistory(state, { payload }) {
      state.directChatHistory = payload;
    },
    setSocketId(state, { payload }) {
        state.socketId = payload;
    }
  },
});

export type AppDispatch = Dispatch<
  ReturnType<(typeof app.actions)[keyof typeof app.actions]>
>;

export const {
  setIsRoomHost,
  setConnectOnlyWithAudio,
  setIdentity,
  setRoomId,
  setActiveConversation,
  setDirectChatHistory,
  setMessages,
  setParticipants,
  setShowOverlay,
  setSocketId
} = app.actions;

export default app.reducer;
