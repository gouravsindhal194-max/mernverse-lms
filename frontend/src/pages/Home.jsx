import { Link } from 'react-router-dom';
import { BookOpen, Monitor, Award, Users, ArrowRight, PlayCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50 pt-16 sm:pt-24 lg:pt-32 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 opacity-30 pointer-events-none">
          <div className="w-[1000px] h-[500px] bg-primary-300 rounded-full blur-3xl filter opacity-40 mix-blend-multiply"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            The Future of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Interactive Learning
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
            MernVerse LMS is a next-generation platform designed to seamlessly connect instructors and students through an intuitive, centralized, and fully scalable learning environment.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/courses" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-1">
              Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:-translate-y-1 shadow-sm">
              Sign Up for Free
            </Link>
          </div>
        </div>
      </div>

      {/* Mockup Preview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10">
        <div className="bg-gray-900 rounded-2xl p-2 sm:p-4 shadow-2xl border border-gray-800 transform hover:scale-[1.01] transition-transform duration-500">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Platform preview" 
            className="rounded-xl w-full object-cover h-[300px] sm:h-[500px] opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full cursor-pointer hover:bg-white/30 transition-all">
              <PlayCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Why Choose MernVerse?</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              We've solved the problems of fragmented learning and rigid tools to give you an experience that simply works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-100 group">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Monitor className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Centralized Platform</h3>
              <p className="text-gray-600">Course material, assignments, and grades all in one beautiful, easily accessible dashboard.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-100 group">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rich Course Content</h3>
              <p className="text-gray-600">Instructors can seamlessly upload modules, video lessons, and interactive materials.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-100 group">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Progress Tracking</h3>
              <p className="text-gray-600">Monitor your journey with real-time completion status and integrated quiz evaluations.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors border border-gray-100 hover:border-primary-100 group">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
              <p className="text-gray-600">Dedicated, secure, and tailored experiences for Students, Instructors, and Admins.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your learning journey?</h2>
          <p className="text-primary-200 mb-8 text-lg">Join thousands of students and instructors on MernVerse today.</p>
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-lg font-bold text-primary-900 bg-white hover:bg-gray-100 transition-colors shadow-lg">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
