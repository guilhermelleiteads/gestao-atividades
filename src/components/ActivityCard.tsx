export function ActivityCard({ activity, currentUserId, users, onUpdateStatus, onShare, onDelete, onEdit }) {
  const isOwner = activity.assignedTo === currentUserId;
  const assignedUser = users.find((user) => user.id === activity.assignedTo);
  const myShare = activity.sharedWith?.find((share) => share.userId === currentUserId);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition flex flex-col justify-between gap-4">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            {activity.type}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Seq: #{activity.sequence}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              activity.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
              activity.status === 'Em Andamento' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
              'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              {activity.status}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{activity.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{activity.description}</p>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
          <div>📅 Entrega: <strong className="text-slate-700 dark:text-slate-200">{activity.dueDate}</strong></div>
          <div>👤 Responsável: <strong className="text-slate-700 dark:text-slate-200">{assignedUser?.name || 'Desconhecido'}</strong></div>
        </div>
      </div>

      {myShare && (
        <div className={`p-2.5 rounded-xl text-xs flex justify-between items-center ${
          myShare.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
          myShare.status === 'accepted' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>
            {myShare.status === 'pending' ? '⚠️ Compartilhado com você. Aceitar?' :
             myShare.status === 'accepted' ? '✅ Você aceitou este compartilhamento' : '❌ Compartilhado rejeitado'}
          </span>
          {myShare.status === 'pending' && (
            <div className="flex gap-1">
              <button onClick={() => onShare(activity.id, 'accept')} className="bg-emerald-600 text-white px-2 py-1 rounded font-bold hover:bg-emerald-700">Aceitar</button>
              <button onClick={() => onShare(activity.id, 'reject')} className="bg-rose-600 text-white px-2 py-1 rounded font-bold hover:bg-rose-700">Recusar</button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 gap-2">
        <select
          value={activity.status}
          onChange={(event) => onUpdateStatus(activity.id, event.target.value)}
          className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Pendente">Pendente</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluído">Concluído</option>
        </select>

        <div className="flex items-center gap-1.5">
          {isOwner && (
            <button
              onClick={() => onEdit(activity)}
              className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 transition"
              title="Editar Atividade"
            >
              ✏️ Editar
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => onDelete(activity.id)}
              className="p-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition"
              title="Excluir"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}