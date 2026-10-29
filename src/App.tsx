import React, { useState, useEffect } from 'react';
import { ActivityCard } from './components/ActivityCard';
import { Navbar } from './components/Navbar';
import { INITIAL_ACTIVITIES, INITIAL_USERS } from './data/mockData';

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  
  // Navigation & Filters
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'shares' | 'manager'
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Desenvolvimento',
    status: 'Pendente',
    dueDate: '',
    sequence: 1,
    assignedTo: '',
    shareWithUser: ''
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('carlos@empresa.com');

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(u => u.email === loginEmail);
    if (found) {
      setCurrentUser(found);
      setFormData(prev => ({ ...prev, assignedTo: found.id }));
    } else {
      alert('Usuário não encontrado!');
    }
  };

  // Activity Submission (Create / Update)
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      alert('Preencha os campos obrigatórios (Título e Data de Entrega).');
      return;
    }

    if (editingActivity) {
      // Edit mode
      setActivities(activities.map(act => act.id === editingActivity.id ? {
        ...act,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        dueDate: formData.dueDate,
        sequence: Number(formData.sequence),
        assignedTo: formData.assignedTo
      } : act));
    } else {
      // Create mode
      const newAct = {
        id: `act-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        dueDate: formData.dueDate,
        sequence: Number(formData.sequence),
        assignedTo: formData.assignedTo || currentUser.id,
        createdBy: currentUser.id,
        sharedWith: formData.shareWithUser ? [{ userId: formData.shareWithUser, status: 'pending' }] : []
      };
      setActivities([newAct, ...activities]);
    }

    closeModal();
  };

  const openNewModal = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      description: '',
      type: 'Desenvolvimento',
      status: 'Pendente',
      dueDate: new Date().toISOString().split('T')[0],
      sequence: activities.length + 1,
      assignedTo: currentUser.id,
      shareWithUser: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      type: activity.type,
      status: activity.status,
      dueDate: activity.dueDate,
      sequence: activity.sequence,
      assignedTo: activity.assignedTo,
      shareWithUser: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setActivities(activities.map(act => act.id === id ? { ...act, status: newStatus } : act));
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      setActivities(activities.filter(act => act.id !== id));
    }
  };

  // Handle Share Response (Accept / Reject)
  const handleShareResponse = (activityId, action) => {
    setActivities(activities.map(act => {
      if (act.id === activityId) {
        const updatedShares = act.sharedWith.map(s => {
          if (s.userId === currentUser.id) {
            return { ...s, status: action === 'accept' ? 'accepted' : 'rejected' };
          }
          return s;
        });
        return { ...act, sharedWith: updatedShares };
      }
      return act;
    }));
  };

  // ==========================================
  // RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-lg mb-3">
              ⚡
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">TaskFlow Pro</h1>
            <p className="text-sm text-slate-500 mt-1">Gerenciamento Avançado de Atividades e Equipes</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-2">
                Selecione o Usuário de Acesso:
              </label>
              <select
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.email}>
                    {u.name} ({u.role === 'manager' ? 'Gerente 📊' : 'Colaborador 👤'})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-lg transition"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Dica: Selecione <strong>Ana Gerente</strong> para visualizar o painel gerencial completo.
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const myActivities = activities.filter(act => {
    const isAssignedToMe = act.assignedTo === currentUser.id;
    const isSharedWithMeAccepted = act.sharedWith?.some(s => s.userId === currentUser.id && s.status === 'accepted');
    return isAssignedToMe || isSharedWithMeAccepted;
  });

  const sharedPendingActivities = activities.filter(act => {
    return act.sharedWith?.some(s => s.userId === currentUser.id && s.status === 'pending');
  });

  const filteredActivities = myActivities.filter(act => {
    const matchesType = filterType === 'Todos' || act.type === filterType;
    const matchesStatus = filterStatus === 'Todos' || act.status === filterStatus;
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  }).sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Navbar Component */}
      <Navbar
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        
        {/* TAB 1: ACTIVITIES VIEW */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            
            {/* Header & New Activity Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Minhas Atividades</h1>
                <p className="text-sm text-slate-500">Gerencie, filtre e ordene suas entregas e sequências.</p>
              </div>
              <button
                onClick={openNewModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
              >
                <span>➕</span> Nova Atividade
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Pesquisar atividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Tipo:</span>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Design">Design</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400">
                Total exibido: {filteredActivities.length}
              </div>
            </div>

            {/* Activities List / Grid */}
            {filteredActivities.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-4xl mb-3">📭</p>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhuma atividade encontrada</h3>
                <p className="text-sm text-slate-400 mt-1">Crie uma nova atividade ou ajuste os filtros aplicados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    currentUserId={currentUser.id}
                    users={users}
                    onUpdateStatus={handleUpdateStatus}
                    onShare={handleShareResponse}
                    onDelete={handleDeleteActivity}
                    onEdit={openEditModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SHARES PENDING INBOX */}
        {activeTab === 'shares' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h1 className="text-2xl font-extrabold tracking-tight">Convites de Compartilhamento</h1>
              <p className="text-sm text-slate-500">Atividades compartilhadas por outros usuários pendentes de aceite.</p>
            </div>

            {sharedPendingActivities.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-4xl mb-3">🤝</p>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum convite pendente</h3>
                <p className="text-sm text-slate-400 mt-1">Quando alguém compartilhar uma atividade com você, aparecerá aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedPendingActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    currentUserId={currentUser.id}
                    users={users}
                    onUpdateStatus={handleUpdateStatus}
                    onShare={handleShareResponse}
                    onDelete={handleDeleteActivity}
                    onEdit={openEditModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGER DASHBOARD */}
        {activeTab === 'manager' && currentUser.role === 'manager' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h1 className="text-2xl font-extrabold tracking-tight">📊 Painel do Gerente</h1>
              <p className="text-sm text-slate-500">Acompanhe as entregas e o progresso de cada colaborador em tempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {users.filter(u => u.role === 'employee').map(emp => {
                const empActivities = activities.filter(a => a.assignedTo === emp.id);
                const total = empActivities.length;
                const completed = empActivities.filter(a => a.status === 'Concluído').length;
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div key={emp.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{emp.name}</h3>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                          {total} Atividades
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-500">Progresso de Entregas</span>
                          <span className="text-indigo-600 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>

                      {/* Recent Tasks List */}
                      <div className="space-y-2 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Atividades Atribuídas:</h4>
                        {empActivities.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Nenhuma atividade atribuída.</p>
                        ) : (
                          empActivities.map(act => (
                            <div key={act.id} className="text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl flex justify-between items-center">
                              <span className="font-medium truncate max-w-[150px]">{act.title}</span>
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                act.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {act.status}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* MODAL FOR CREATE / EDIT ACTIVITY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">
              {editingActivity ? '✏️ Editar Atividade' : '➕ Nova Atividade'}
            </h2>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Título da Atividade</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm"
                  placeholder="Ex: Otimizar consultas SQL"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm"
                  placeholder="Detalhes da tarefa..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm font-medium"
                  >
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Design">Design</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm font-medium"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Data de Entrega</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Sequência (Ordem)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sequence}
                    onChange={(e) => setFormData({ ...formData, sequence: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Atribuir para:</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm font-medium"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              {!editingActivity && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Compartilhar com (Opcional):</label>
                  <select
                    value={formData.shareWithUser}
                    onChange={(e) => setFormData({ ...formData, shareWithUser: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm font-medium"
                  >
                    <option value="">Ninguém</option>
                    {users.filter(u => u.id !== currentUser.id).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition"
                >
                  Salvar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}