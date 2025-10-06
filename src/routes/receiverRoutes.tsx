import { Navigate, Route, Routes } from "react-router-dom";
import Orders from "../pages/receiver/orders";
import OrderDetail from "../pages/receiver/orderDetail";
import Layout from "../components/layout/Layout";


const ReceiverRoute = () => {

  return (
    <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Navigate to="orders" replace />} /> 
          
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
        </Route>
    </Routes>
  )
};

export default ReceiverRoute;