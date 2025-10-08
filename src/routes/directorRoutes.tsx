import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/director/Dashboard";
import Orders from "../pages/director/orders/Orders";
import OrderCreate from "../pages/director/orders/create";
import Customers from "../pages/director/clients/Customers";
import ClientCreate from "../pages/director/clients/create";
import EmployeesPage from "../pages/director/employees/main";
import EmployeeCreate from "../pages/director/employees/create";
import Layout from "../components/layout/Layout";
import EmployeeEdit from "../pages/director/employees/edit";
import ClientEdit from "../pages/director/clients/edit";
import OrderEdit from "../pages/director/orders/edit";
import Statement from "../pages/director/statement/main";


const DirectorRoute = () => {

  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} /> 
            
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/create" element={<OrderCreate />} />
        <Route path="orders/:id" element={<OrderEdit />} />

        <Route path="clients" element={<Customers />} />
        <Route path="clients/create" element={<ClientCreate />} />
        <Route path="clients/:id" element={<ClientEdit />} />

        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/create" element={<EmployeeCreate />} />
        <Route path="employees/:id" element={<EmployeeEdit />} />

        <Route path="statement" element={<Statement />} />
      </Route>
    </Routes>
  )
};

export default DirectorRoute;