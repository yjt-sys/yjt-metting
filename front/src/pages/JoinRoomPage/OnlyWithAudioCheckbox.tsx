import React from 'react'
import {useDispatch} from 'react-redux'
import {UnknownAction} from '@reduxjs/toolkit'
import {Checkbox} from 'antd'
interface Props{
    connectOnlyWithAudio:boolean,
    setConnectOnlyWithAudio: (newValue:boolean)=>UnknownAction;
}
const OnlyWithAudioCheckbox: React.FC<Props> = ({connectOnlyWithAudio,setConnectOnlyWithAudio}) => {
    const dispatch = useDispatch()
    const handleConnectionTypeChange = () => {
        //将连接的状态类型存储到store当中
        dispatch(setConnectOnlyWithAudio(!connectOnlyWithAudio));
    };
    return (
        <div className='checkbox_container'>
            <Checkbox onChange={handleConnectionTypeChange}></Checkbox>
            <p className='checkbox_container_paragraph'>只开启音频</p>
        </div>
    )
}
export default OnlyWithAudioCheckbox