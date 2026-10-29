export const INITIAL_USERS = [
  { id: 'usr-1', name: 'Ana Gerente', role: 'manager', email: 'ana@empresa.com' },
  { id: 'usr-2', name: 'Carlos Dev', role: 'employee', email: 'carlos@empresa.com' },
  { id: 'usr-3', name: 'Beatriz Design', role: 'employee', email: 'beatriz@empresa.com' },
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Planejamento Arquitetural',
    description: 'Definir stack tecnológica e padrões de componentes React.',
    type: 'Desenvolvimento',
    status: 'Concluído',
    dueDate: '2026-04-10',
    sequence: 1,
    assignedTo: 'usr-2',
    createdBy: 'usr-1',
    sharedWith: [],
  },
  {
    id: 'act-2',
    title: 'Design System & UI Components',
    description: 'Criar componentes reutilizáveis utilizando Tailwind CSS.',
    type: 'Design',
    status: 'Em Andamento',
    dueDate: '2026-04-18',
    sequence: 2,
    assignedTo: 'usr-3',
    createdBy: 'usr-1',
    sharedWith: [{ userId: 'usr-2', status: 'accepted' }],
  },
  {
    id: 'act-3',
    title: 'Implementar Controle de Acesso',
    description: 'Validar rotas e permissões por perfil de usuário.',
    type: 'Desenvolvimento',
    status: 'Pendente',
    dueDate: '2026-04-25',
    sequence: 3,
    assignedTo: 'usr-2',
    createdBy: 'usr-2',
    sharedWith: [{ userId: 'usr-1', status: 'pending' }],
  },
];