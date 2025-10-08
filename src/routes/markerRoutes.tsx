import { Navigate, Route, Routes } from "react-router-dom";
import MarkerPage from "../pages/marker/main";
import Layout from "../components/layout/Layout";


const MarkerRoute = () => {

  return (
    <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Navigate to="main" replace />} /> 
          
          <Route path="main" element={<MarkerPage />} />
        </Route>
    </Routes>
  )
};

export default MarkerRoute;