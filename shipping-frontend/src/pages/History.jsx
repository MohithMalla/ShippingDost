import { useEffect, useState } from 'react';
import axios from 'axios';
import { History as HistIcon, Search } from 'lucide-react';

export default function History() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all logs from the backend
    axios.get('https://shippingdost-4.onrender.com/api/v1/shipping-charge/history')
      .then(res => setOrders(res.data.reverse())) // Reversing to show latest order on top
      .catch(err => console.error("Could not fetch history:", err));
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in">
      
      {/* Header section with search bar */}
      <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <HistIcon className="text-blue-600" size={20}/> Previous Estimates
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-2 ring-blue-500 outline-none w-full sm:w-64" 
          />
        </div>
      </div>

      {/* Table to display the logs */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b">
            <tr>
              <th className="p-6">Order ID</th>
              <th className="p-6">Store ID</th>
              <th className="p-6">Warehouse</th>
              <th className="p-6 text-right">Price Paid</th>
              <th className="p-6 text-right">Date Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-mono text-[10px] text-slate-400">#LOG-{order.id}</td>
                <td className="p-6 text-sm font-bold text-slate-700">STORE-{order.customerId}</td>
                <td className="p-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border">
                    {order.warehouseName}
                  </span>
                </td>
                <td className="p-6 text-right font-black text-slate-900 text-lg">₹{order.finalCharge.toFixed(2)}</td>
                <td className="p-6 text-right text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
                  {new Date(order.timestamp).toLocaleDateString()} • {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-300 italic">
                  No orders found. Use the Estimator to add some data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}