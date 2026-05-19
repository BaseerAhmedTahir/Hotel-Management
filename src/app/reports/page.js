'use client';
import { useEffect, useState } from 'react';
import { BarChart3, List } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState({ revenue: [], logs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(d => {
        setData({
          revenue: Array.isArray(d.revenue) ? d.revenue : [],
          logs: Array.isArray(d.logs) ? d.logs : []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getMonthName = (monthNum) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return date.toLocaleString('en-US', { month: 'short' });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-500">View monthly revenue and system audit logs</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-xl text-gray-500">Loading reports...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue Report */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Monthly Revenue
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Period</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.revenue.map((rev, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800/50">
                      <td className="py-3 px-4">
                        {getMonthName(rev.RevenueMonth)} {rev.RevenueYear}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        Rs {rev.TotalRevenue?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {data.revenue.length === 0 && (
                    <tr>
                      <td colSpan="2" className="py-8 text-center text-gray-500">No revenue data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <List className="w-5 h-5 mr-2 text-purple-500" />
              Recent Audit Logs
            </h2>
            <div className="overflow-y-auto max-h-[500px] pr-2">
              <div className="space-y-4">
                {data.logs.map((log, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.ActionType === 'INSERT' ? 'bg-blue-100 text-blue-800' :
                        log.ActionType === 'UPDATE' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.ActionType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.ActionDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-1">Table: {log.TableName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{log.Description}</div>
                  </div>
                ))}
                {data.logs.length === 0 && (
                  <div className="py-8 text-center text-gray-500">No audit logs found</div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
