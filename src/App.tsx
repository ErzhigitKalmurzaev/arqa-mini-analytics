import { useTranslation } from 'react-i18next'
import './App.css'
import DirectorRoute from './routes/directorRoutes.tsx'
import ReceiverRoute from './routes/receiverRoutes.tsx'
import OTKRoute from './routes/otkRoutes.tsx'
import PackerRoute from './routes/packerRoutes.tsx'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { checkAuth } from './store/auth/authSlice.ts'
import Login from './pages/Login/Login.tsx'
import { ToastContainer } from 'react-toastify';
import MarkerRoute from './routes/markerRoutes.tsx'
import QualityControl from './pages/otk/skan.tsx'

export default function App() {
  useTranslation()

  const { isAuthenticated, me_role } = useSelector((state : any) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]); // Убрать isAuthenticated из зависимостей
  
  useEffect(() => {
    if (isAuthenticated === 'error') {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const allowedCRMRoles = ['', 'director', 'receiver', 'otk', 'packer', 'marker', 'grouper'];

  const routes: any = {
    director: <DirectorRoute/>,
    receiver: <ReceiverRoute/>,
    otk: <OTKRoute/>,
    packer: <PackerRoute/>,
    marker: <MarkerRoute/>
  }
  
  return (
    <div>
      {/* <Routes>
          <Route path="/" element={isAuthenticated === 'success' ? <Navigate to="/crm/" /> : <Login />} />
          {
            me_role &&
            <>
              <Route path="/crm/*" element={
                <ProtectedRoute navigate="/"
                    allowed={allowedCRMRoles.some((i, index) => index === me_role)} >
                    {routes[allowedCRMRoles[me_role]]}
                </ProtectedRoute>
              } />
              <Route path="*" element={<div>Page not found</div>} />
            </>
          }
      </Routes>
      <ToastContainer autoClose={1000}/> */}
      <QualityControl/>
    </div>
  )
};

export const ProtectedRoute = ({ allowed, navigate, children }: { allowed: boolean; navigate: string; children: React.ReactNode }) => {
  return allowed ? children : <Navigate to={navigate} replace />;
};
