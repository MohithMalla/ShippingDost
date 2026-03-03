import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plane, Truck, Car, X, MapPin, Zap } from 'lucide-react';

export default function Dashboard() {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [activeMode, setActiveMode] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // Get all past data when the page opens
  useEffect(() => {
    axios.get('https://shippingdost-4.onrender.com/api/v1/shipping-charge/history')
      .then(res => setHistoryLogs(res.data));
  }, []);

  // When you click a card, show only those specific logs
  const filterByMode = (mode) => {
    const matched = historyLogs.filter(item => item.transportMode === mode);
    setFilteredData(matched);
    setActiveMode(mode);
  };

  // Helper to calculate total spent on Air, Truck, or Van
  const calculateTotal = (mode) => 
    historyLogs.filter(l => l.transportMode === mode)
               .reduce((sum, current) => sum + current.finalCharge, 0);

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Three cards showing total money spent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Air Total" val={calculateTotal('AEROPLANE')} icon={<Plane/>} theme="blue" onClick={() => filterByMode('AEROPLANE')} />
        <StatCard label="Truck Total" val={calculateTotal('TRUCK')} icon={<Truck/>} theme="orange" onClick={() => filterByMode('TRUCK')} />
        <StatCard label="Van Total" val={calculateTotal('MINI_VAN')} icon={<Car/>} theme="emerald" onClick={() => filterByMode('MINI_VAN')} />
      </div>

      {/* Cool banner showing the latest transport mode used */}
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase italic">
            <Zap size={14}/> Recent Update
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Route Insights</h2>
          <p className="text-slate-400 max-w-xl text-lg italic">
            Looking at your data, "{historyLogs[0]?.transportMode || 'Standard'}" is currently your most frequent shipping method.
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
           <MapPin size={200}/>
        </div>
      </div>

      {/* This section opens only when you click a Stat Card */}
      {activeMode && (
        <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase tracking-tight">{activeMode} Details</h3>
            <button onClick={() => setActiveMode(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"><X/></button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map(log => (
              <div key={log.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Ref: # {log.id}</p>
                  <p className="text-sm font-bold text-slate-700">Hub: {log.warehouseName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900">₹{log.finalCharge.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase italic">{log.distance.toFixed(1)} KM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Small component for the stat boxes
function StatCard({ label, val, icon, theme, onClick }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600",
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600"
  };
  return (
    <button onClick={onClick} className={`${styles[theme]} border-2 p-8 rounded-[2rem] text-left transition-all hover:text-white group relative overflow-hidden shadow-sm hover:shadow-2xl`}>
      <div className="relative z-10">
        <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl w-fit mb-6 group-hover:bg-white/20">{icon}</div>
        <p className="text-xs font-black uppercase opacity-60 mb-1">{label}</p>
        <p className="text-4xl font-black italic">₹{val.toLocaleString()}</p>
      </div>
    </button>
  );
}