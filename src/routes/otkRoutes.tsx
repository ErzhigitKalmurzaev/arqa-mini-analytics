import { Navigate, Route, Routes } from "react-router-dom";
import QualityControl from "../pages/otk/skan";
import Layout from "../components/layout/Layout";


const OTKRoute = () => {

  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route index element={<Navigate to="control" replace />} /> 
          
        <Route path="control" element={<QualityControl />} />
      </Route>
    </Routes>
  )
};

export default OTKRoute;