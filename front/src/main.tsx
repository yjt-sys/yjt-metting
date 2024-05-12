import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './init.ts'
import router from './router/index.tsx'
import { RouterProvider } from 'react-router-dom'
import store from './store/index.ts'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <RouterProvider router={router}>

      </RouterProvider>
    </Provider>
)

