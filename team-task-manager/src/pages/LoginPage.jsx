import { Link, useNavigate } from "react-router-dom";
import { firebaseEnabled } from "../firebaseConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage({
  darkMode,
  notification,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginUser,
  googleLogin,
}) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginUser(navigate);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div
        className={`flex-1 p-6 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        {notification && (
          <div
            className={`fixed top-20 right-4 px-4 py-3 rounded-lg text-white ${
              notification.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-red-500 to-pink-500"
            } shadow-lg z-50 animate-pulse`}
          >
            {notification.message}
          </div>
        )}
        <div
          className={`max-w-xl mx-auto ${
            darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"
          } rounded-3xl shadow-2xl p-8 border border-white/20`}
        >
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Login
          </h1>
          <div className="space-y-4">
            <input
              key={`login-email-input`}
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              name="login-email"
              autoComplete="off"
              className={`w-full border-2 p-4 rounded-xl ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-black placeholder-gray-500"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            />
            <input
              key={`login-password-input`}
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              name="login-password"
              autoComplete="off"
              className={`w-full border-2 p-4 rounded-xl ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-black placeholder-gray-500"
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200"
            >
              Login
            </button>
            {firebaseEnabled && (
              <button
                onClick={() => googleLogin(navigate)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-200 mt-4"
              >
                Sign in with Google
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            New user?{" "}
            <Link to="/register" className="text-blue-600 underline hover:text-blue-700">
              Register here
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Forgot password?{" "}
            <Link to="/reset-password" className="text-blue-600 underline hover:text-blue-700">
              Reset it here
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Firebase auth is {firebaseEnabled ? "enabled" : "not configured yet"}. If you receive an "invalid-credential" error, verify Email/Password sign-in is enabled in Firebase Authentication.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
