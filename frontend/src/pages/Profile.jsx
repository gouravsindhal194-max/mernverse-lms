import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserDetails, reset } from '../features/auth/authSlice';
import { User, Mail, Save } from 'lucide-react';

const Profile = () => {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const { name, email } = formData;
  const dispatch = useDispatch();
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    if (isError) {
      setUpdateMessage(message);
    }
    
    if (isSuccess && updateMessage === 'Saving...') {
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    }

    // Don't reset right away if we want to show success message,
    // but we can dispatch reset when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setUpdateMessage('Saving...');
    dispatch(updateUserDetails({ name, email }));
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-900 text-white flex items-center gap-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
              <p className="mt-1 text-gray-300">Update your personal information.</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-8 space-y-6">
            {updateMessage && (
              <div className={`p-4 rounded-lg text-sm font-medium ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {updateMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={onChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  disabled
                  value={user?.role || ''}
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-500 shadow-sm py-3 px-4 border cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Roles cannot be changed after registration.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center items-center rounded-lg border border-transparent bg-primary-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (
                  <>
                    <Save className="mr-2 h-5 w-5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
