import { Navigate, Route, Routes } from "react-router-dom";
import PackerSkan from "../pages/packer/packerSkan";
import Layout from "../components/layout/Layout";


const PackerRoute = () => {

  return (
    <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Navigate to="skan" replace />} /> 
          
          <Route path="skan" element={<PackerSkan />} />
        </Route>
    </Routes>
  )
};

export default PackerRoute;