import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import JoinRoomTitle from './JoinRoomTitle';
import './JoinRoomPage.css';
import JoinRoomContent from './JoinRoomContent';
import { setIsRoomHost,type appInitialStateProps } from '@/store/modules/app'
import { Card } from 'antd';
const JoinRoomPage: React.FC = () => {
    const state = useSelector((state: { app: appInitialStateProps }) => state.app)
    const dispatch = useDispatch()
    //useLocaltion返回URL的location对象，search属性返回的是问号之后的查询字符串
    const search = useLocation().search;
    useEffect(() => {
        const isRoomHost = new URLSearchParams(search).get('host');

        if (isRoomHost) {
            //将主持人的状态保存到redux的store里面
            dispatch(setIsRoomHost(isRoomHost))
        }
    }, []);
    return (
        <>
            <div className='join_room_page_container'>
                <Card>
                    <JoinRoomTitle isRoomHost={state.isRoomHost} />
                    <JoinRoomContent />
                </Card>
            </div>
        </>
    )
}
export default JoinRoomPage