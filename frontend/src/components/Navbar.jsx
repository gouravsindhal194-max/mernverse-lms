import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { LogOut, BookOpen, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-gray-900 tracking-tight">Mern<span className="text-primary-600">Verse</span></span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/courses" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Courses
              </Link>
              {user && (
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  <div className="bg-gray-100 p-1.5 rounded-full hover:bg-primary-50 transition-colors">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="hidden sm:block">{user.name} ({user.role})</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
