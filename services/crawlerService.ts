import { CrawlerTask, TaskStatus, ScrapedItem, RuleType } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY_TASKS = 'spiderflow_tasks';
const STORAGE_KEY_RESULTS = 'spiderflow_results';

// Initial Mock Data
const INITIAL_TASKS: CrawlerTask[] = [
  {
    id: '1',
    name: 'TechCrunch Headlines',
    targetUrl: 'https://techcrunch.com',
    maxDepth: 2,
    frequency: 'Daily',
    startTime: new Date().toISOString(),
    status: TaskStatus.IDLE,
    itemsScraped: 124,
    lastRun: new Date(Date.now() - 86400000).toISOString(),
    depthConfigs: [
      {
        depth: 1,
        description: 'Homepage List',
        rules: [
            { id: 'r1', name: 'Article Title', selector: 'h2.post-block__title a', type: RuleType.TEXT },
            { id: 'r2', name: 'Link', selector: 'h2.post-block__title a', type: RuleType.ATTRIBUTE, attribute: 'href' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Competitor Price Monitor',
    targetUrl: 'https://example-shop.com/products',
    maxDepth: 1,
    frequency: 'Hourly',
    startTime: new Date().toISOString(),
    status: TaskStatus.RUNNING,
    itemsScraped: 45,
    lastRun: new Date().toISOString(),
    depthConfigs: []
  }
];

// Initialize Storage
if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
}

export const CrawlerService = {
  getTasks: async (): Promise<CrawlerTask[]> => {
    await delay(500);
    const data = localStorage.getItem(STORAGE_KEY_TASKS);
    return data ? JSON.parse(data) : [];
  },

  getTaskById: async (id: string): Promise<CrawlerTask | undefined> => {
    await delay(300);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    return tasks.find((t: CrawlerTask) => t.id === id);
  },

  saveTask: async (task: CrawlerTask): Promise<void> => {
    await delay(600);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const index = tasks.findIndex((t: CrawlerTask) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(400);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const filtered = tasks.filter((t: CrawlerTask) => t.id !== id);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(filtered));
  },

  // Simulate Running a Task
  runTask: async (id: string): Promise<void> => {
    // 1. Set status to Running
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const index = tasks.findIndex((t: CrawlerTask) => t.id === id);
    if (index === -1) return;

    tasks[index].status = TaskStatus.RUNNING;
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    
    // 2. Simulate "Work" asynchronously
    setTimeout(() => {
        const currentTasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
        const idx = currentTasks.findIndex((t: CrawlerTask) => t.id === id);
        if (idx !== -1) {
            currentTasks[idx].status = TaskStatus.COMPLETED;
            currentTasks[idx].lastRun = new Date().toISOString();
            const newCount = Math.floor(Math.random() * 50) + 1;
            currentTasks[idx].itemsScraped = (currentTasks[idx].itemsScraped || 0) + newCount;
            localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(currentTasks));
            
            // Generate Fake Results
            CrawlerService.generateMockResults(id, newCount);
        }
    }, 5000); // 5 seconds processing time
  },

  stopTask: async (id: string): Promise<void> => {
    await delay(200);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const index = tasks.findIndex((t: CrawlerTask) => t.id === id);
    if (index !== -1) {
        tasks[index].status = TaskStatus.STOPPED;
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    }
  },

  getResults: async (taskId: string): Promise<ScrapedItem[]> => {
    await delay(500);
    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEY_RESULTS) || '[]');
    return allResults.filter((r: ScrapedItem) => r.taskId === taskId);
  },

  generateMockResults: (taskId: string, count: number) => {
     const allResults = JSON.parse(localStorage.getItem(STORAGE_KEY_RESULTS) || '[]');
     const newResults: ScrapedItem[] = Array.from({ length: count }).map((_, i) => ({
         id: Math.random().toString(36).substring(7),
         taskId,
         timestamp: new Date().toISOString(),
         url: `https://mock-target.com/page/${Math.floor(Math.random() * 100)}`,
         depth: 1,
         data: {
             'Article Title': `Mock Article Title ${Math.floor(Math.random() * 1000)}`,
             'Price': `$${(Math.random() * 100).toFixed(2)}`,
             'Description': 'This is sample scraped content that is not unicode encoded but plain text.'
         }
     }));
     localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify([...newResults, ...allResults]));
  }
};
