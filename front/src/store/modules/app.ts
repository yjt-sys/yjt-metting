import {createSlice,Dispatch} from "@reduxjs/toolkit"
export interface appInitialStateProps{
    identity:string,
    isRoomHost:boolean,
    connectOnlyWithAudio:boolean,
    roomId:string|null,
}

const app=createSlice({
    name:"app",

    initialState:{
        identity: '',
        isRoomHost: false,
        connectOnlyWithAudio: false,
        roomId: null,
    },

    reducers:{
        setIsRoomHost(state,{payload}){
            state.isRoomHost = payload
        },
        setIdentity(state,{payload}){
            state.identity = payload
        },
        setConnectOnlyWithAudio(state,{payload}){
            state.connectOnlyWithAudio = payload
        },
        setRoomId(state,{payload}){
            state.roomId = payload
        }
    }

})

export type AppDispatch = Dispatch<ReturnType<typeof app.actions[keyof typeof app.actions]>>;

export const {setIsRoomHost,setConnectOnlyWithAudio,setIdentity,setRoomId}=app.actions

export default app.reducer