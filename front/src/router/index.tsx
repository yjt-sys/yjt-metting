import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import HomePage from "../pages/HomePage/HomePage"
import JoinRoomPage from "../pages/JoinRoomPage/JoinRoomPage"
import MeetingPage from "../pages/MeetingPage/MeetingPage"
const router=createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<HomePage/>
            },
            {
                path:"/join-room",
                element:<JoinRoomPage/>
            },
            {
                path:"/meeting",
                element:<MeetingPage/>
            }
        ]
    }
])

export default router