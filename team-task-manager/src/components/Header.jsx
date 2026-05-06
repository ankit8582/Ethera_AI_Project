export default function Header() {
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
