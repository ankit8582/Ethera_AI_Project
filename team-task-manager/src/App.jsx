import { useState, useEffect, useCallback, memo, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { auth, firebaseEnabled } from "./firebaseConfig";
import Profile from "./Profile";
import {
  authRegister,
  authLogin,
  getProjects,
  createProject as apiCreateProject,
  patchProjectMembers,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function Header() {
    return (
      <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Team Task Manager
                </h1>
                <p className="text-sm opacity-90">Organize • Collaborate • Achieve</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Welcome to</p>
                <p className="font-semibold">Ethera AI</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">EA</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function Footer() {
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

const ProjectTeamForm = memo(({
  projectName,
  projectDescription,
  memberEmail,
  darkMode,
  selectedProjectId,
  projects,
  onProjectNameChange,
  onProjectDescriptionChange,
  onMemberEmailChange,
  onCreateProject,
  onAddProjectMember,
  onRemoveProjectMember,
  projectNameRef,
  projectDescriptionRef,
  memberEmailRef,
}) => {
  return (
    <div className={`${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} mt-6 p-6 rounded-3xl shadow-2xl border border-white/20`}>
      <div className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
        <h2 className="text-2xl font-bold text-purple-600">Project & Team Management</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <input
          ref={projectNameRef}
          type="text"
          name="projectName"
          id="projectName"
          autoComplete="off"
          spellCheck="false"
          placeholder="Project name"
          value={projectName}
          onChange={onProjectNameChange}
          className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
        />
        <input
          ref={projectDescriptionRef}
          type="text"
          name="projectDescription"
          id="projectDescription"
          autoComplete="off"
          spellCheck="false"
          placeholder="Project description"
          value={projectDescription}
          onChange={onProjectDescriptionChange}
          className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
        />
        <input
          ref={memberEmailRef}
          type="email"
          name="memberEmail"
          id="memberEmail"
          autoComplete="off"
          spellCheck="false"
          placeholder="Member email to add"
          value={memberEmail}
          onChange={onMemberEmailChange}
          className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <button
          onClick={onCreateProject}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
        >
          Create Project
        </button>
        <button
          onClick={() => selectedProjectId && onAddProjectMember(selectedProjectId)}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
        >
          Add Member to Project
        </button>
      </div>
      {projects.length > 0 && (
        <div className="mt-8 space-y-6">
          {projects.map((project) => (
            <div key={project._id} className={`p-6 rounded-3xl ${darkMode ? "bg-gray-900 border-gray-700" : "bg-slate-50 border-slate-200"} border shadow-lg`}>
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-indigo-600">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">{project.description || 'No description provided.'}</p>
                  <p className="text-sm text-gray-500 mt-2">Owner: {project.ownerId?.username || 'Unknown'}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {project.members?.map((member) => (
                    <span key={member._id} className="px-3 py-2 rounded-full bg-blue-100 text-blue-800 text-sm">
                      {member.username}
                      {project.ownerId?._id !== member._id && (
                        <button
                          type="button"
                          onClick={() => onRemoveProjectMember(project._id, member.email)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.projectName === nextProps.projectName &&
    prevProps.projectDescription === nextProps.projectDescription &&
    prevProps.memberEmail === nextProps.memberEmail &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.selectedProjectId === nextProps.selectedProjectId &&
    prevProps.projects === nextProps.projects
  );
});

function LoginPage({
  darkMode,
  notification,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginEmailRef,
  loginPasswordRef,
  loginUser,
}) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginUser(navigate);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className={`flex-1 p-6 ${darkMode ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"}`}>
        {notification && (
          <div className={`fixed top-20 right-4 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-pink-500"} shadow-lg z-50 animate-pulse`}>
            {notification.message}
          </div>
        )}
        <div className={`max-w-xl mx-auto ${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} rounded-3xl shadow-2xl p-8 border border-white/20`}>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Login</h1>
          <div className="space-y-4">
            <input
              ref={loginEmailRef}
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              name="login-email"
              autoComplete="off"
              suppressHydrationWarning={true}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            />
            <input
              ref={loginPasswordRef}
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              name="login-password"
              autoComplete="off"
              suppressHydrationWarning={true}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
            >
              Login
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            New user? <Link to="/register" className="text-blue-600 underline hover:text-blue-700">Register here</Link>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Forgot password? <Link to="/reset-password" className="text-blue-600 underline hover:text-blue-700">Reset it here</Link>
          </p>
          <p className="text-xs text-gray-400 mt-4">Firebase auth is {firebaseEnabled ? "enabled" : "not configured yet"}.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function RegisterPage({
  darkMode,
  notification,
  regUsername,
  setRegUsername,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regUsernameRef,
  regEmailRef,
  regPasswordRef,
  registerUser,
}) {
  const navigate = useNavigate();

  const handleRegister = async () => {
    await registerUser(navigate);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className={`flex-1 p-6 ${darkMode ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"}`}>
        {notification && (
          <div className={`fixed top-20 right-4 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-pink-500"} shadow-lg z-50 animate-pulse`}>
            {notification.message}
          </div>
        )}
        <div className={`max-w-xl mx-auto ${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} rounded-3xl shadow-2xl p-8 border border-white/20`}>
          <h1 className="text-4xl font-bold mb-6 text-blue-600">Register</h1>
          <div className="space-y-4">
            <input
              ref={regUsernameRef}
              type="text"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              name="reg-username"
              autoComplete="off"
              suppressHydrationWarning={true}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
            />
            <input
              ref={regEmailRef}
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              name="reg-email"
              autoComplete="off"
              suppressHydrationWarning={true}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
            />
            <input
              ref={regPasswordRef}
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              name="reg-password"
              autoComplete="off"
              suppressHydrationWarning={true}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
            />
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
            >
              Register
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-purple-600 underline hover:text-purple-700">Login here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ResetPasswordPage({
  darkMode,
  notification,
  setUsers,
  showNotification,
  resetEmailRef,
  resetPasswordRef,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    const emailTrim = email.trim().toLowerCase();
    const passwordTrim = newPassword.trim();

    if (!emailTrim) {
      showNotification("Please enter your email.", "error");
      return;
    }

    if (firebaseEnabled) {
      try {
        await sendPasswordResetEmail(auth, emailTrim);
        showNotification("Password reset email sent. Check your inbox.", "success");
        navigate("/login");
        return;
      } catch (error) {
        showNotification(error.message, "error");
        return;
      }
    }

    if (!passwordTrim) {
      showNotification("Please enter a new password.", "error");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = savedUsers.findIndex((user) => {
      const storedEmail = user.email?.trim().toLowerCase();
      const storedUsername = user.username?.trim().toLowerCase();
      return storedEmail === emailTrim || storedUsername === emailTrim;
    });

    if (userIndex === -1) {
      showNotification("Email not found. Use the email or username you registered with.", "error");
      return;
    }

    savedUsers[userIndex].password = passwordTrim;
    localStorage.setItem("users", JSON.stringify(savedUsers));
    setUsers(savedUsers);
    showNotification("Password updated. Please login with new password.", "success");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className={`flex-1 p-6 ${darkMode ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"}`}>
        {notification && (
          <div className={`fixed top-20 right-4 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-pink-500"} shadow-lg z-50 animate-pulse`}>
            {notification.message}
          </div>
        )}
        <div className={`max-w-xl mx-auto ${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} rounded-3xl shadow-2xl p-8 border border-white/20`}>
          <h1 className="text-4xl font-bold mb-6 text-blue-600">Reset Password</h1>
          <div className="space-y-4">
            <input
              ref={resetEmailRef}
              type="email"
              placeholder="Registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="reset-email"
              autoComplete="off"
              suppressHydrationWarning={true}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            />
            {!firebaseEnabled && (
              <input
                ref={resetPasswordRef}
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                name="reset-password"
                autoComplete="off"
                suppressHydrationWarning={true}
                className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200`}
              />
            )}
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
            >
              {firebaseEnabled ? "Send Reset Email" : "Set New Password"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Remembered password? <Link to="/login" className="text-blue-600 underline hover:text-blue-700">Login here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function DashboardPage({
  darkMode,
  notification,
  apiAvailable,
  currentUser,
  tasks,
  totalTasks,
  completedTasks,
  overdueTasks,
  pendingTasks,
  progressPercentage,
  handleTaskChange,
  handleAddTask,
  task,
  category,
  priority,
  dueDate,
  projects,
  selectedProjectId,
  assignedTo,
  handleCategoryChange,
  handlePriorityChange,
  handleDueDateChange,
  handleProjectSelectChange,
  handleAssignedToChange,
  projectName,
  projectDescription,
  memberEmail,
  handleProjectNameChange,
  handleProjectDescriptionChange,
  handleMemberEmailChange,
  createNewProject,
  addProjectMember,
  removeProjectMember,
  projectNameRef,
  projectDescriptionRef,
  memberEmailRef,
  taskInputRef,
  draggedIndex,
  logout,
  setDarkMode,
  setFilter,
  filter,
  search,
  setSearch,
  sortBy,
  setSortBy,
  getSortedTasks,
  handleDragStart,
  handleDragOver,
  handleDrop,
  editTask,
  completeTask,
  deleteTaskItem,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className={`flex-1 p-6 ${darkMode ? "bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"}`}>
        {notification && (
          <div className={`fixed top-20 right-4 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-pink-500"} shadow-lg z-50 animate-pulse`}>
            {notification.message}
          </div>
        )}

        {!apiAvailable && (
          <div className="mb-6 rounded-3xl border border-yellow-300 bg-yellow-50/80 p-4 text-yellow-900 shadow-inner">
            Backend unavailable. Tasks will be saved locally for now.
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700 text-white p-6 rounded-3xl shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome, {currentUser.username}</h1>
              <p className="text-lg mt-2 opacity-90">This is your personal dashboard.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/profile" className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200">
                Profile
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <button
                onClick={() => logout(navigate)}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} mt-6 p-6 rounded-3xl shadow-2xl border border-white/20`}>
          <h2 className="text-2xl font-bold mb-6 text-green-600">Add New Task</h2>
          <div className="space-y-6">
            <input
              ref={taskInputRef}
              type="text"
              autoComplete="off"
              spellCheck="false"
              name="task-title"
              placeholder="Enter task..."
              value={task}
              onChange={handleTaskChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTask();
                }
              }}
              className={`w-full border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="task-category"
                value={category}
                onChange={handleCategoryChange}
                className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Shopping</option>
                <option>Health</option>
                <option>Learning</option>
              </select>
              <select
                name="task-priority"
                value={priority}
                onChange={handlePriorityChange}
                className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <input
                name="task-due-date"
                type="date"
                value={dueDate}
                onChange={handleDueDateChange}
                className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                name="task-project"
                value={selectedProjectId}
                onChange={handleProjectSelectChange}
                className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
              <select
                name="task-assigned-to"
                value={assignedTo}
                onChange={handleAssignedToChange}
                className={`border-2 p-4 rounded-xl ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
              >
                <option value="">Assign to me</option>
                {projects
                  .find((project) => project._id === selectedProjectId)
                  ?.members?.map((member) => (
                    <option key={member._id} value={member._id}>{member.username}</option>
                  ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddTask}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
            >
              Add Task
            </button>
          </div>
        </div>

        <ProjectTeamForm
          projectName={projectName}
          projectDescription={projectDescription}
          memberEmail={memberEmail}
          darkMode={darkMode}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectNameChange={handleProjectNameChange}
          onProjectDescriptionChange={handleProjectDescriptionChange}
          onMemberEmailChange={handleMemberEmailChange}
          onCreateProject={createNewProject}
          onAddProjectMember={addProjectMember}
          onRemoveProjectMember={removeProjectMember}
          projectNameRef={projectNameRef}
          projectDescriptionRef={projectDescriptionRef}
          memberEmailRef={memberEmailRef}
        />

        <div className={`${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} mt-6 p-6 rounded-3xl shadow-2xl border border-white/20`}>
          <div className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
            <h2 className="text-2xl font-bold text-blue-600">Dashboard Summary</h2>
            <div className="flex gap-3 flex-wrap">
              <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200">Dashboard</Link>
              <Link to="/profile" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200">Profile</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-blue-50 to-indigo-50"} shadow-lg border border-white/20`}>
              <p className="text-sm text-gray-500 mb-2">Username</p>
              <p className="text-2xl font-bold text-indigo-600">{currentUser.username}</p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-green-50 to-emerald-50"} shadow-lg border border-white/20`}>
              <p className="text-sm text-gray-500 mb-2">Total Tasks</p>
              <p className="text-2xl font-bold text-green-600">{totalTasks}</p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-emerald-50 to-teal-50"} shadow-lg border border-white/20`}>
              <p className="text-sm text-gray-500 mb-2">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{completedTasks}</p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-orange-50 to-red-50"} shadow-lg border border-white/20`}>
              <p className="text-sm text-gray-500 mb-2">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-red-50 to-pink-50"} shadow-lg border border-white/20`}>
              <p className="text-sm text-gray-500 mb-2">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Task completion progress</p>
              <p className="text-lg font-bold text-indigo-600">{progressPercentage}%</p>
            </div>
            <div className="w-full h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div className="h-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} mt-6 p-6 rounded-3xl shadow-2xl border border-white/20`}>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Your Tasks</h2>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter("All")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 active:shadow-inner ${
                  filter === "All"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : `${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-black hover:bg-gray-200"}`
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Completed")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 active:shadow-inner ${
                  filter === "Completed"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : `${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-black hover:bg-gray-200"}`
                }`}
              >
                ✅ Completed
              </button>
              <button
                onClick={() => setFilter("Pending")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 active:shadow-inner ${
                  filter === "Pending"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : `${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-black hover:bg-gray-200"}`
                }`}
              >
                ⏳ Pending
              </button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                className={`border-2 p-3 rounded-xl min-w-64 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-500"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
              >
                <option>Default</option>
                <option>Priority</option>
                <option>Date</option>
                <option>Category</option>
                <option>Completion</option>
              </select>
            </div>
          </div>

          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">No tasks added yet.</p>
          ) : getSortedTasks().length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">No tasks match your filter.</p>
          ) : (
            <ul className="space-y-4">
              {getSortedTasks().map((item) => {
                const actualIndex = tasks.indexOf(item);
                return (
                  <li
                    key={actualIndex}
                    draggable
                    onDragStart={() => handleDragStart(actualIndex)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(actualIndex)}
                    className={`flex flex-col md:flex-row justify-between items-center border-2 p-6 rounded-2xl cursor-move transition-all duration-200 transform hover:scale-102 hover:shadow-xl ${
                      draggedIndex === actualIndex
                        ? "opacity-50 bg-gray-300"
                        : item.completed
                        ? `${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600" : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"}`
                        : `${darkMode ? "bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600" : "bg-gradient-to-r from-white to-blue-50 border-blue-200"}`
                    }`}
                  >
                    <div className="flex-1">
                      <div className={item.completed ? "line-through text-gray-400" : ""}>{item.title}</div>
                      <div className="text-sm text-gray-500 mt-2">
                        Category: {item.category} | Due: {item.dueDate || "No date"} | Priority: {item.priority}
                      </div>
                    </div>

                    <span
                      className={`ml-0 md:ml-4 mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold text-white ${
                        item.priority === "High"
                          ? "bg-gradient-to-r from-red-500 to-pink-500"
                          : item.priority === "Medium"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}
                    >
                      {item.priority}
                    </span>

                    <div className="flex gap-3 mt-4 md:mt-0">
                      <button
                        onClick={() => editTask(item._id)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => completeTask(item._id)}
                        className={`px-4 py-2 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200 ${
                          item.completed
                            ? "bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        }`}
                      >
                        {item.completed ? "Undo" : "Complete"}
                      </button>
                      <button
                        onClick={() => deleteTaskItem(item._id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children, currentUser }) {
  return currentUser ? children : <Navigate to="/login" replace />;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Work");
  const [filter, setFilter] = useState("All");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [sortBy, setSortBy] = useState("Default");
  const [notification, setNotification] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Refs to prevent cursor jumping
  const taskInputRef = useRef(null);
  const projectNameRef = useRef(null);
  const projectDescriptionRef = useRef(null);
  const memberEmailRef = useRef(null);
  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const regUsernameRef = useRef(null);
  const regEmailRef = useRef(null);
  const regPasswordRef = useRef(null);
  const resetEmailRef = useRef(null);
  const resetPasswordRef = useRef(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((item) => item.completed).length;
  const overdueTasks = tasks.filter((item) => {
    return !item.completed && item.dueDate && new Date(item.dueDate) < new Date();
  }).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const storedCurrent = JSON.parse(localStorage.getItem("currentUser"));

    if (storedCurrent) {
      if (storedCurrent.token && storedCurrent.user) {
        setCurrentUser(storedCurrent.user);
        setToken(storedCurrent.token);
        loadTasks(storedCurrent.user.id || storedCurrent.user.uid || storedCurrent.user.username, storedCurrent.token);
        loadProjects(storedCurrent.token);
      } else {
        setCurrentUser(storedCurrent);
        loadTasks(storedCurrent.uid || storedCurrent.username);
      }
    }
  }, []);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function loadTasks(userId, authToken) {
    try {
      const tasks = await getTasks(userId, authToken);
      setTasks(tasks);
      saveUserTasks(userId, tasks);
      setApiAvailable(true);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setApiAvailable(false);
      const localTasks = loadUserTasks(userId);
      setTasks(localTasks);
      showNotification('Backend unavailable. Loaded tasks from local storage.', 'warning');
    }
  }

  async function loadProjects(authToken) {
    try {
      const loaded = await getProjects(authToken);
      setProjects(loaded);
      if (loaded.length > 0 && !selectedProjectId) {
        setSelectedProjectId(loaded[0]._id);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects([]);
    }
  }

  const handleTaskChange = useCallback((e) => {
    setTask(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e) => {
    setPriority(e.target.value);
  }, []);

  const handleDueDateChange = useCallback((e) => {
    setDueDate(e.target.value);
  }, []);

  const handleProjectSelectChange = useCallback((e) => {
    setSelectedProjectId(e.target.value);
  }, []);

  const handleAssignedToChange = useCallback((e) => {
    setAssignedTo(e.target.value);
  }, []);

  const handleProjectNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  const handleProjectDescriptionChange = useCallback((e) => {
    setProjectDescription(e.target.value);
  }, []);

  const handleMemberEmailChange = useCallback((e) => {
    setMemberEmail(e.target.value);
  }, []);

  const createNewProject = useCallback(async () => {
    if (!projectName.trim()) {
      showNotification('Project name is required.', 'error');
      return;
    }

    try {
      const payload = {
        name: projectName,
        description: projectDescription,
        memberEmails: memberEmail ? [memberEmail.toLowerCase()] : [],
      };
      const newProj = await apiCreateProject(payload, token);
      setProjects((prevProjects) => [...prevProjects, newProj]);
      setProjectName('');
      setProjectDescription('');
      setMemberEmail('');
      setSelectedProjectId(newProj._id);
      showNotification('Project created successfully!', 'success');
    } catch (err) {
      console.error('Error creating project:', err);
      showNotification(err.message || 'Unable to create project.', 'error');
    }
  }, [projectName, projectDescription, memberEmail, token]);

  const addProjectMember = useCallback(async (projectId) => {
    if (!memberEmail.trim()) {
      showNotification('Member email is required.', 'error');
      return;
    }

    try {
      const updated = await patchProjectMembers(projectId, { action: 'add', memberEmail: memberEmail.toLowerCase() }, token);
      setProjects((prevProjects) => prevProjects.map((project) => (project._id === projectId ? updated : project)));
      setMemberEmail('');
      showNotification('Member added successfully!', 'success');
    } catch (err) {
      console.error('Error adding member:', err);
      showNotification(err.message || 'Unable to add member.', 'error');
    }
  }, [memberEmail, token]);

  const removeProjectMember = useCallback(async (projectId, email) => {
    try {
      const updated = await patchProjectMembers(projectId, { action: 'remove', memberEmail: email.toLowerCase() }, token);
      setProjects((prevProjects) => prevProjects.map((project) => (project._id === projectId ? updated : project)));
      showNotification('Member removed successfully!', 'success');
    } catch (err) {
      console.error('Error removing member:', err);
      showNotification(err.message || 'Unable to remove member.', 'error');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      if (token) {
        localStorage.setItem("currentUser", JSON.stringify({ user: currentUser, token }));
      } else {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser, token]);

  const localTasksKey = (userId) => `tasks_${userId}`;

  const saveUserTasks = (userId, tasksToSave) => {
    localStorage.setItem(localTasksKey(userId), JSON.stringify(tasksToSave));
  };

  const loadUserTasks = (userId) => {
    return JSON.parse(localStorage.getItem(localTasksKey(userId))) || [];
  };

  const persistTasks = (userId, tasksToSave) => {
    setTasks(tasksToSave);
    saveUserTasks(userId, tasksToSave);
  };

  const registerUser = async (navigate) => {
    const username = regUsername.trim();
    const email = regEmail.trim().toLowerCase();
    const password = regPassword.trim();

    if (!username || !email || !password) {
      showNotification("Please fill all registration fields.", "error");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (savedUsers.some((user) => user.email === email)) {
      showNotification("Email already registered.", "error");
      return;
    }

    if (firebaseEnabled) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = {
          username,
          email,
          uid: userCredential.user.uid,
        };
        setUsers([...savedUsers, newUser]);
        setCurrentUser(newUser);
        setTasks([]);
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
        showNotification("Firebase registration successful!", "success");
        navigate("/dashboard");
        return;
      } catch (error) {
        showNotification(error.message, "error");
        return;
      }
    }

    try {
      const response = await authRegister({ username, email, password, role: 'member' });
      setUsers([...savedUsers, response.user]);
      setCurrentUser(response.user);
      setToken(response.token);
      setTasks([]);
      setProjects([]);
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      await loadTasks(response.user.id, response.token);
      await loadProjects(response.token);
      showNotification("Registration successful! Logged in.", "success");
      navigate("/dashboard");
    } catch (error) {
      showNotification(error.message || "Registration failed.", "error");
    }
  };

  const loginUser = async (navigate) => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (firebaseEnabled) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = {
          username: email.split("@")[0],
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        };
        setCurrentUser(user);
        loadTasks(user.uid);
        setLoginEmail("");
        setLoginPassword("");
        showNotification(`Welcome back, ${user.username}!`, "success");
        navigate("/dashboard");
        return;
      } catch (error) {
        showNotification(error.message, "error");
        return;
      }
    }

    try {
      const response = await authLogin({ email, password });
      setCurrentUser(response.user);
      setToken(response.token);
      setLoginEmail("");
      setLoginPassword("");
      await loadTasks(response.user.id, response.token);
      await loadProjects(response.token);
      showNotification(`Welcome back, ${response.user.username}!`, "success");
      navigate("/dashboard");
    } catch (error) {
      showNotification(error.message || "Invalid email or password.", "error");
    }
  };

  const logout = async (navigate) => {
    if (firebaseEnabled) {
      try {
        await signOut(auth);
      } catch (error) {
        console.warn("Firebase logout failed:", error.message);
      }
    }

    setCurrentUser(null);
    setToken(null);
    setTasks([]);
    setProjects([]);
    showNotification("Logged out successfully.", "success");
    navigate("/login");
  };

  const handleAddTask = async () => {
    if (!currentUser) {
      showNotification("Please log in before adding a task.", "error");
      return;
    }

    if (task.trim() === "") return;

    const currentUserId = currentUser.id || currentUser.uid || currentUser.username;
    const assignedUserId = assignedTo || currentUserId;
    const projectId = selectedProjectId || null;

    const newTask = {
      title: task,
      category,
      priority,
      dueDate,
      userId: currentUserId,
      assignedTo: assignedUserId,
      projectId,
    };

    try {
      const createdTask = await createTask(newTask, token);
      setTasks([...tasks, createdTask]);
      setTask("");
      setDueDate("");
      setAssignedTo("");
      showNotification(`Task added to ${category}!`, "success");
      setApiAvailable(true);
    } catch (err) {
      console.error('Error adding task:', err);
      setApiAvailable(false);
      const fallbackTask = {
        _id: `${Date.now()}`,
        title: task,
        category,
        priority,
        dueDate,
        completed: false,
        userId: currentUserId,
        assignedTo: assignedUserId,
        projectId,
        createdAt: new Date().toISOString(),
      };
      const updatedTasks = [...tasks, fallbackTask];
      setTasks(updatedTasks);
      saveUserTasks(currentUserId, updatedTasks);
      setTask("");
      setDueDate("");
      setAssignedTo("");
      showNotification("Task saved locally because backend is unavailable.", "warning");
    }
  };

  const deleteTaskItem = async (id) => {
    const userId = currentUser?.id || currentUser?.uid || currentUser?.username;

    try {
      await deleteTask(id, token);
      const updatedTasks = tasks.filter((t) => t._id !== id);
      setTasks(updatedTasks);
      saveUserTasks(userId, updatedTasks);
      showNotification("Task deleted!", "success");
    } catch {
      const updatedTasks = tasks.filter((t) => t._id !== id);
      persistTasks(userId, updatedTasks);
      showNotification("Task deleted locally because backend is unavailable.", "warning");
    }
  };

  const completeTask = async (id) => {
    const userId = currentUser?.uid || currentUser?.username;
    const taskToUpdate = tasks.find((t) => t._id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    try {
      const serverTask = await updateTask(id, { completed: updatedTask.completed }, token);
      const updatedTasks = tasks.map((t) => (t._id === id ? serverTask : t));
      persistTasks(userId, updatedTasks);
    } catch {
      const updatedTasks = tasks.map((t) => (t._id === id ? updatedTask : t));
      persistTasks(userId, updatedTasks);
      showNotification("Task updated locally because backend is unavailable.", "warning");
    }
  };

  const editTask = async (id) => {
    const userId = currentUser?.uid || currentUser?.username;
    const taskToEdit = tasks.find((t) => t._id === id);
    if (!taskToEdit) return;

    const newText = prompt("Edit your task:", taskToEdit.title);

    if (newText && newText.trim() !== "") {
      const updatedTask = { ...taskToEdit, title: newText };
      try {
        const serverTask = await updateTask(id, { title: newText }, token);
        const updatedTasks = tasks.map((t) => (t._id === id ? serverTask : t));
        persistTasks(userId, updatedTasks);
        showNotification("Task updated!", "success");
      } catch {
        const updatedTasks = tasks.map((t) => (t._id === id ? updatedTask : t));
        persistTasks(userId, updatedTasks);
        showNotification("Task updated locally because backend is unavailable.", "warning");
      }
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...tasks];
    const draggedTask = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedTask);
    setTasks(updated);
    setDraggedIndex(null);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter === "Completed") {
      filtered = filtered.filter((item) => item.completed);
    } else if (filter === "Pending") {
      filtered = filtered.filter((item) => !item.completed);
    }

    return filtered.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  };

  const getSortedTasks = () => {
    const sorted = [...getFilteredTasks()];

    if (sortBy === "Priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "Date") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "Category") {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "Completion") {
      sorted.sort((a, b) => a.completed - b.completed);
    }

    return sorted;
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage
          darkMode={darkMode}
          notification={notification}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginEmailRef={loginEmailRef}
          loginPasswordRef={loginPasswordRef}
          loginUser={loginUser}
        />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage
          darkMode={darkMode}
          notification={notification}
          regUsername={regUsername}
          setRegUsername={setRegUsername}
          regEmail={regEmail}
          setRegEmail={setRegEmail}
          regPassword={regPassword}
          setRegPassword={setRegPassword}
          regUsernameRef={regUsernameRef}
          regEmailRef={regEmailRef}
          regPasswordRef={regPasswordRef}
          registerUser={registerUser}
        />} />
        <Route path="/reset-password" element={currentUser ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage
          darkMode={darkMode}
          notification={notification}
          setUsers={setUsers}
          showNotification={showNotification}
          resetEmailRef={resetEmailRef}
          resetPasswordRef={resetPasswordRef}
        />} />
        <Route path="/dashboard" element={<ProtectedRoute currentUser={currentUser}><DashboardPage
          darkMode={darkMode}
          notification={notification}
          apiAvailable={apiAvailable}
          currentUser={currentUser}
          tasks={tasks}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          overdueTasks={overdueTasks}
          pendingTasks={pendingTasks}
          progressPercentage={progressPercentage}
          handleTaskChange={handleTaskChange}
          handleAddTask={handleAddTask}
          task={task}
          category={category}
          priority={priority}
          dueDate={dueDate}
          projects={projects}
          selectedProjectId={selectedProjectId}
          assignedTo={assignedTo}
          handleCategoryChange={handleCategoryChange}
          handlePriorityChange={handlePriorityChange}
          handleDueDateChange={handleDueDateChange}
          handleProjectSelectChange={handleProjectSelectChange}
          handleAssignedToChange={handleAssignedToChange}
          projectName={projectName}
          projectDescription={projectDescription}
          memberEmail={memberEmail}
          handleProjectNameChange={handleProjectNameChange}
          handleProjectDescriptionChange={handleProjectDescriptionChange}
          handleMemberEmailChange={handleMemberEmailChange}
          createNewProject={createNewProject}
          addProjectMember={addProjectMember}
          removeProjectMember={removeProjectMember}
          projectNameRef={projectNameRef}
          projectDescriptionRef={projectDescriptionRef}
          memberEmailRef={memberEmailRef}
          taskInputRef={taskInputRef}
          draggedIndex={draggedIndex}
          logout={logout}
          setDarkMode={setDarkMode}
          setFilter={setFilter}
          filter={filter}
          setSearch={setSearch}
          search={search}
          sortBy={sortBy}
          setSortBy={setSortBy}
          getSortedTasks={getSortedTasks}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          editTask={editTask}
          completeTask={completeTask}
          deleteTaskItem={deleteTaskItem}
        /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute currentUser={currentUser}><Profile currentUser={currentUser} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
