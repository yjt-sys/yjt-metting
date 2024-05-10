import {configureStore} from "@reduxjs/toolkit"
import appReducer from './modules/app'

const store=configureStore({
    reducer:{
        app:appReducer
    }
})

export default store