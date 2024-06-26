import React, { useEffect } from 'react';
import logo from '@assets/images/logo.jpg';
import ConnectingButtons from './ConnectingButtons';
import './HomePage.css';
import { useDispatch } from 'react-redux';
import { setIsRoomHost } from '@/store/modules/app'
import { Card } from 'antd';
const HomePage: React.FC = () => {
    const dispatch = useDispatch()
    //默认host状态为false,每次进入到首页，都给isRoomHost设置为false
    useEffect(() => {
        dispatch(setIsRoomHost(false))
    }, []);

    return (
        <div className='home_page_container'>
            <Card className='home_page_panel' title={<div className='home_page_header'>
                    <img src={logo} className='home_page_image' />
                    <p className='home_page_title'>一按闫会议</p>
                </div>}>
                

                <ConnectingButtons />
            </Card>
        </div>
    );
}
export default HomePage
