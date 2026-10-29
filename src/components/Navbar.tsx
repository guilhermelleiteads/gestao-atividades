export function Navbar({ currentUser, onLogout, activeTab, setActiveTab }) {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl font-bold tracking-wider text-xl">⚡ TaskFlow</div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
            {currentUser.role === 'manager' ? 'Perfil: Gerente 📊' : 'Perfil: Colaborador 👤'}
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'activities' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            📋 Minhas Atividades
          </button>

          <button
            onClick={() => setActiveTab('shares')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition relative ${
              activeTab === 'shares' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            🤝 Compartilhamentos
          </button>

          {currentUser.role === 'manager' && (
            <button
              onClick={() => setActiveTab('manager')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'manager' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              📊 Painel do Gerente
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition shadow"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}