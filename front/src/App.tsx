import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { connectWithSocketIOServer } from './utils/wss';
import './App.css'
function App() {
  useEffect(() => {
    connectWithSocketIOServer();
  }, [])
  return (
    <div className='app'>
        <Outlet />
    </div>
  )
}

export default App
