function Profile({ currentUser }) {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700 text-white p-6 rounded-3xl shadow-2xl mb-8">
          <h1 className="text-4xl font-bold text-white">Your Profile</h1>
          <p className="text-lg mt-2 opacity-90">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentUser.username}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                @
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 break-all">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {currentUser.uid && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-lg border border-white/20 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  🔥
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Firebase User ID</p>
                  <p className="text-lg font-bold text-gray-600 dark:text-gray-400 break-all font-mono">{currentUser.uid}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Account Security</h3>
          <p className="opacity-90">Your account is secured with Firebase authentication. All your data is stored locally and synced securely.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
