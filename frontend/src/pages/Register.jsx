import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import { BookOpen, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Default role
  });

  const { name, email, password, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      role,
    };
    dispatch(register(userData));
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-xl shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Join MernVerse
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create an account to start your journey
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Full Name
            </label>
            <div className="mt-2">
              <input
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all"
                placeholder="••••••••"
                minLength="6"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              I am a
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={role === 'Student'}
                  onChange={onChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-600"
                />
                <span className="text-sm text-gray-900 font-medium">Student</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="Instructor"
                  checked={role === 'Instructor'}
                  onChange={onChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-600"
                />
                <span className="text-sm text-gray-900 font-medium">Instructor</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
