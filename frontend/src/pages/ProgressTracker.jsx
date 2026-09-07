import { Link } from 'react-router-dom';

const ProgressTracker = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Detailed Progress Tracker</h2>
      <p className="text-xl text-gray-500 mb-8">This module is coming soon.</p>
      <Link to="/dashboard" className="text-primary-600 font-medium hover:text-primary-500">Back to Dashboard</Link>
    </div>
  );
};

export default ProgressTracker;
