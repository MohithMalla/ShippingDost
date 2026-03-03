import { useEffect, useState } from 'react';
import axios from 'axios';
import { History as HistIcon, Search } from 'lucide-react';

export default function History() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetches your B2B history logs
    axios.get('http://localhost:8080/api/v1/shipping-charge/history')
      .then(res => setLogs(res.data.reverse())) // Show newest first
      .catch(err => console.error("History fetch error:", err));
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
          <HistIcon className="text-blue-600" size={20}/> Audit Logs
        </h3>
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16}/>
          <input type="text" placeholder="Search logs..." className="bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-2 ring-blue-500 outline-none w-full sm:w-64 shadow-sm" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
            <tr>
              <th className="p-6">Reference</th>
              <th className="p-6">Kirana Store</th>
              <th className="p-6">Warehouse</th>
              <th className="p-6 text-right">Final Charge</th>
              <th className="p-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6 font-mono text-[10px] text-slate-400">#LOG-{log.id}</td>
                <td className="p-6 text-sm font-bold text-slate-700 underline decoration-slate-200 decoration-2 underline-offset-4">STORE-{log.customerId}</td>
                <td className="p-6"><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-slate-200">WH-{log.warehouseId}</span></td>
                <td className="p-6 text-right font-black text-slate-900 text-lg">₹{log.finalCharge.toFixed(2)}</td>
                <td className="p-6 text-right text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
                  {new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">No transactions found. Go to Estimator to seed the logs.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}