import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TaskManager } from './pages/TaskManager';
import { TaskEditor } from './pages/TaskEditor';
import { ResultViewer } from './pages/ResultViewer';
import { CrawlerTask } from './types';

// Simple Router state management
type ViewState = 'dashboard' | 'tasks' | 'settings' | 'create-task' | 'edit-task' | 'view-results';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedTask, setSelectedTask] = useState<CrawlerTask | undefined>(undefined);
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedTask(undefined);
    setCurrentView('create-task');
  };

  const handleEdit = (task: CrawlerTask) => {
    setSelectedTask(task);
    setCurrentView('edit-task');
  };

  const handleViewResults = (taskId: string) => {
    setViewTaskId(taskId);
    setCurrentView('view-results');
  };

  const handleCloseEditor = () => {
    setCurrentView('tasks');
    setSelectedTask(undefined);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager onCreate={handleCreate} onEdit={handleEdit} onViewResults={handleViewResults} />;
      case 'create-task':
      case 'edit-task':
        return <TaskEditor task={selectedTask} onClose={handleCloseEditor} />;
      case 'view-results':
        return viewTaskId ? <ResultViewer taskId={viewTaskId} onBack={() => setCurrentView('tasks')} /> : null;
      case 'settings':
        return <div className="text-white p-4">Settings module coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={currentView.includes('task') || currentView === 'view-results' ? 'tasks' : currentView} onTabChange={(tab) => setCurrentView(tab as ViewState)}>
      {renderContent()}
    </Layout>
  );
}

export default App;
