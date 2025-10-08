import { configureStore } from "@reduxjs/toolkit"
import AuthSlice from "./auth/authSlice"
import EmployeeSlice from "./director/employeeSlice";
import ClientSlice from "./director/clientSlice";
import OrderSlice from "./director/orderSlice";
import ReceiverOrderSlice from "./receiver/ordersSlice";
import OTKSkanSLice from "./otk/skanSlice";
import PackerSkanSLice from "./packer/packSlice";
// сюда же можно подключить слайсы, если нужны

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    employee: EmployeeSlice.reducer,
    client: ClientSlice.reducer,
    order: OrderSlice.reducer,

    // receiver
    receiver_orders: ReceiverOrderSlice.reducer,

    //otk
    otk: OTKSkanSLice.reducer,

    //packer
    packer: PackerSkanSLice.reducer
  },
})

export type AppStore = typeof store;
// Тип RootState
export type RootState = ReturnType<typeof store.getState>;
// Тип Dispatch
export type AppDispatch = typeof store.dispatch;