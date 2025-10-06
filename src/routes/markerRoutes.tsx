import { Navigate, Route, Routes } from "react-router-dom";
import MarkerPage from "../pages/marker/main";


const MarkerRoute = () => {

  return (
    <Routes>
        <Route index element={<Navigate to="main" replace />} /> 
        
        <Route path="main" element={<MarkerPage />} />
    </Routes>
  )
};

export default MarkerRoute;