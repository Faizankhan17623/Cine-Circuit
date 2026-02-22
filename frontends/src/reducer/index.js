import { combineReducers } from "redux";
import authReducer  from '../Slices/authSlice'
import cartReducer from '../Slices/CartSlice'
import profileReducer from '../Slices/ProfileSlice'
import addtofavouriteReducer from '../Slices/AddtoFavouritslistSlice'
import showReducer from '../Slices/ShowSlice'
import theatreReducer from '../Slices/TheatreSlice'
import orgainezerReducer from '../Slices/orgainezerSlice'
import paymentReducer from '../Slices/PaymentSlice'
import tagsReducer from '../Slices/TagsSlice'
import castReducer from '../Slices/CastSlice'
import maintenanceReducer from '../Slices/maintenanceSlice'

const rootReduers = combineReducers({
    auth:authReducer,
    cart:cartReducer,
    profile:profileReducer,
    addtofavourite:addtofavouriteReducer,
    show:showReducer,
    theatre:theatreReducer,
    orgainezer:orgainezerReducer,
    tags:tagsReducer,
    cast:castReducer,
    payment:paymentReducer,
    maintenance:maintenanceReducer
})


export default rootReduers