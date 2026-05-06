export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span>📋</span>
              </div>
              <h3 className="text-xl font-bold">Team Task Manager</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Streamline your team's productivity with our intuitive task management solution.
              Built with React, Firebase, and modern web technologies.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span>📘</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span>📷</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span>🐦</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">
              Features
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Task Management</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Team Collaboration</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Progress Tracking</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Dark Mode</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">
              Support
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Help Center</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Documentation</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Contact Us</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 Ethera AI. All rights reserved. Built with ❤️ using React & Firebase.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">R</span>
                </div>
                <span className="text-sm font-semibold text-blue-300">
                  React
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">F</span>
                </div>
                <span className="text-sm font-semibold text-orange-300">
                  Firebase
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
