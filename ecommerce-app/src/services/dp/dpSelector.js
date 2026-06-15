import localProvider from './localProvider';
import apiProvider from './apiProvider';

const dataSource = import.meta.env.VITE_DATA_SOURCE || 'local';

console.log(`[TrendBaazar] Active Data Source resolved to: ${dataSource.toUpperCase()}`);

export const dp = dataSource === 'api' ? apiProvider : localProvider;

export default dp;
