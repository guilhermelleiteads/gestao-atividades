# Mapa dos 11 conceitos React

Este documento relaciona os conceitos de [11 conceitos.md](11%20conceitos.md) com evidências encontradas na plataforma. Os conceitos marcados como **Não implementado** não possuem um trecho equivalente no código atual.

## 1. JSX

**Status: Atende.** JSX descreve a interface usando uma sintaxe semelhante a HTML.

- [src/main.tsx](src/main.tsx): o JSX passado para `ReactDOM.createRoot(...).render(...)` monta a aplicação.
- [src/App.tsx](src/App.tsx): retorna os elementos da tela de login ou da aplicação autenticada.
- [src/components/ActivityCard.tsx](src/components/ActivityCard.tsx) e [src/components/Navbar.tsx](src/components/Navbar.tsx): descrevem partes da interface em JSX.

## 2. Componentes

**Status: Atende.** A interface está dividida em componentes.

- [src/App.tsx](src/App.tsx): componente principal `App`.
- [src/components/ActivityCard.tsx](src/components/ActivityCard.tsx): componente reutilizável de atividade.
- [src/components/Navbar.tsx](src/components/Navbar.tsx): componente de navegação.

## 3. Props

**Status: Atende.** O componente pai envia dados e funções para os componentes filhos.

- [src/App.tsx](src/App.tsx): fornece `currentUser`, `activeTab` e funções de navegação a `Navbar`; fornece atividade, usuário e callbacks a cada `ActivityCard`.
- [src/components/Navbar.tsx](src/components/Navbar.tsx): recebe `currentUser`, `onLogout`, `activeTab` e `setActiveTab`.
- [src/components/ActivityCard.tsx](src/components/ActivityCard.tsx): recebe `activity`, `users`, `currentUserId` e callbacks de ação.

## 4. Virtual DOM

**Status: Atende.** A aplicação é montada pelo React e as mudanças de estado atualizam a interface por meio do mecanismo de renderização e reconciliação do React.

- [src/main.tsx](src/main.tsx): cria a raiz com `createRoot` e renderiza `<App />`.
- [src/App.tsx](src/App.tsx): alterações feitas com `useState` causam nova renderização da interface.

## 5. Listas e keys

**Status: Atende.** Coleções são transformadas em elementos com `map()` e os itens recebem `key`.

- [src/App.tsx](src/App.tsx): listas de usuários, opções e atividades usam `map()`; as atividades usam `key={activity.id}` e as opções usam `key={u.id}`.
- O painel gerencial também percorre colaboradores e atividades, identificando os elementos por seus IDs.

## 6. Renderização condicional

**Status: Atende.** O conteúdo exibido depende de estados e condições.

- [src/App.tsx](src/App.tsx): mostra login quando `currentUser` não existe; alterna abas; exibe estado vazio ou lista conforme o resultado; abre o modal conforme `isModalOpen`.
- [src/components/ActivityCard.tsx](src/components/ActivityCard.tsx): mostra controles de compartilhamento conforme o convite e ações de edição/exclusão conforme a propriedade da atividade.
- [src/components/Navbar.tsx](src/components/Navbar.tsx): mostra o painel gerencial somente para usuários com perfil `manager`.

## 7. State e useState

**Status: Atende.** `useState` guarda informações necessárias à interação e à atualização da tela.

- [src/App.tsx](src/App.tsx): estados de usuários, usuário atual, atividades, aba, filtros, modal e dados dos formulários.
- As ações de criar, editar, excluir e alterar status atualizam o estado de atividades.

**Limite atual:** os dados são mantidos apenas em memória. Ao recarregar a página, as alterações feitas durante a sessão não são persistidas.

## 8. Formulários

**Status: Atende.** A plataforma recebe e processa dados em formulários.

- [src/App.tsx](src/App.tsx): formulário de login usa `onSubmit={handleLogin}`.
- [src/App.tsx](src/App.tsx): formulário de atividade usa `onSubmit={handleSaveActivity}` e campos controlados por `formData` e `setFormData`.
- `handleSaveActivity` valida título e data de entrega antes de criar ou atualizar uma atividade.

## 9. useEffect

**Status: Não implementado.** Não há efeito executado com `useEffect` no código atual. O conceito não foi marcado como atendido apenas pela importação: uma importação sem uso não demonstra sincronização com sistemas externos.

Uma aplicação prática poderia usar `useEffect` para carregar dados de uma API ao iniciar a tela ou para reagir a mudanças que precisem sincronizar com um sistema externo.

## 10. Consumo de APIs

**Status: Não implementado.** Os dados iniciais vêm de arrays locais em [src/data/mockData.ts](src/data/mockData.ts). Não foram encontradas chamadas `fetch`, Axios ou outro cliente de API.

As alterações feitas na interface atualizam somente o estado local do React; não são enviadas a um servidor.

## 11. React Router

**Status: Não implementado.** Não há configuração de React Router nem rotas associadas a URLs.

- [src/App.tsx](src/App.tsx) guarda a aba ativa no estado `activeTab`.
- [src/components/Navbar.tsx](src/components/Navbar.tsx) muda essa aba usando botões e `setActiveTab`.

Essa navegação troca o conteúdo dentro da mesma página, mas não cria URLs ou histórico de navegação para páginas diferentes.

## Resultado geral

A plataforma demonstra diretamente os conceitos **1 a 8**. Os conceitos **9, 10 e 11** ainda precisam ser implementados para que todos os 11 estejam presentes. A interface funciona como demonstração com dados locais, não como integração persistente com servidor.