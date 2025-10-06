import { Navigate, Route, Routes } from "react-router-dom";
import PackerSkan from "../pages/packer/packerSkan";


const PackerRoute = () => {

  return (
    <Routes>
        <Route index element={<Navigate to="skan" replace />} /> 
        
        <Route path="skan" element={<PackerSkan />} />
    </Routes>
  )
};

export default PackerRoute;