import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CourseStudents from './pages/CourseStudents';
import TakeQuiz from './pages/TakeQuiz';
import ProgressTracker from './pages/ProgressTracker';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/courses/:courseId/quiz/:quizId" element={<TakeQuiz />} />
            </Route>

            {/* Instructor / Admin Routes */}
            <Route element={<RoleRoute roles={['Instructor', 'Admin']} />}>
              <Route path="/create-course" element={<CreateCourse />} />
              <Route path="/edit-course/:id" element={<EditCourse />} />
              <Route path="/courses/:id/students" element={<CourseStudents />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
