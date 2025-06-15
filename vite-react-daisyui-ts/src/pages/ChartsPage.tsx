import { LineChartExample } from '../components/charts/LineChartExample';
import { BarChartExample } from '../components/charts/BarChartExample';
import { PieChartExample } from '../components/charts/PieChartExample';

export const ChartsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Recharts Examples</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <LineChartExample />
        </div>
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <BarChartExample />
        </div>
        <div className="bg-base-200 p-4 rounded-lg shadow lg:col-span-2">
          <PieChartExample />
        </div>
      </div>
      <div className="mt-8 p-4 bg-base-200 rounded-lg">
        <h2 className="text-xl font-bold mb-4">About Recharts</h2>
        <p className="mb-4">
          These charts are built with Recharts, a composable charting library built on React components.
        </p>
        <div className="flex gap-4">
          <a 
            href="https://recharts.org/en-US/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Recharts Documentation
          </a>
          <a 
            href="https://recharts.org/en-US/examples" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            More Examples
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
