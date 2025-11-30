export enum TaskStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  STOPPED = 'STOPPED'
}

export enum RuleType {
  TEXT = 'TEXT',
  HTML = 'HTML',
  ATTRIBUTE = 'ATTRIBUTE',
  IMAGE = 'IMAGE'
}

export interface ScrapeRule {
  id: string;
  name: string; // The field name (e.g., "title", "price")
  selector: string; // CSS selector or XPath
  type: RuleType;
  attribute?: string; // e.g., 'href' if type is ATTRIBUTE
}

export interface DepthConfig {
  depth: number;
  description?: string;
  rules: ScrapeRule[];
}

export interface CrawlerTask {
  id: string;
  name: string;
  targetUrl: string;
  maxDepth: number;
  frequency: string; // e.g., "Once", "Daily", "Hourly"
  startTime: string;
  status: TaskStatus;
  depthConfigs: DepthConfig[];
  lastRun?: string;
  itemsScraped?: number;
}

export interface ScrapedItem {
  id: string;
  taskId: string;
  url: string;
  timestamp: string;
  depth: number;
  data: Record<string, string>;
}
