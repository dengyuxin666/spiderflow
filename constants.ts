import { ScrapeRule, RuleType } from './types';

export const MOCK_DELAY = 800;

export const DEFAULT_RULE: ScrapeRule = {
  id: '',
  name: '',
  selector: '',
  type: RuleType.TEXT,
};

export const FREQUENCIES = [
  'Once',
  'Every 15 Minutes',
  'Hourly',
  'Daily',
  'Weekly',
  'Monthly'
];
