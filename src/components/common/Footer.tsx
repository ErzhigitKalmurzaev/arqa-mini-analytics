import { LogOut } from 'lucide-react'
import Button from '../ui/Button'
import { useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice';

export default function Footer() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  }
  
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
        <div>© {new Date().getFullYear()} Level Up</div>
        <div>
          <Button onClick={handleLogout}><LogOut size={17} className='mr-1'/> Выйти </Button>
        </div>
      </div>
    </footer>
  )
}


