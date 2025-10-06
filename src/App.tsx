import { useTranslation } from 'react-i18next'
import './App.css'
import DirectorRoute from './routes/directorRoutes'
import ReceiverRoute from './routes/receiverRoutes'
import OTKRoute from './routes/otkRoutes'
import PackerRoute from './routes/packerRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { checkAuth } from './store/auth/authSlice'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import MarkerRoute from './routes/markerRoutes'

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
      <Routes>
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
      <ToastContainer autoClose={1000}/>
    </div>
  )
};

export const ProtectedRoute = ({ allowed, navigate, children }: { allowed: boolean; navigate: string; children: React.ReactNode }) => {
  return allowed ? children : <Navigate to={navigate} replace />;
};
