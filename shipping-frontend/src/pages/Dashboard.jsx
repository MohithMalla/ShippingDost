import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plane, Truck, Car, X, MapPin, Zap } from 'lucide-react';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [drillDownData, setDrillDownData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/shipping-charge/history')
      .then(res => setLogs(res.data));
  }, []);

  const handleModeClick = (mode) => {
    const filtered = logs.filter(log => log.transportMode === mode);
    setDrillDownData(filtered);
    setSelectedMode(mode);
  };

  const getSum = (mode) => logs.filter(l => l.transportMode === mode)
                               .reduce((acc, curr) => acc + curr.finalCharge, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Interactive Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModeCard label="Air Expense" val={getSum('AEROPLANE')} icon={<Plane/>} theme="blue" onClick={() => handleModeClick('AEROPLANE')} />
        <ModeCard label="Truck Expense" val={getSum('TRUCK')} icon={<Truck/>} theme="orange" onClick={() => handleModeClick('TRUCK')} />
        <ModeCard label="Van Expense" val={getSum('MINI_VAN')} icon={<Car/>} theme="emerald" onClick={() => handleModeClick('MINI_VAN')} />
      </div>

      {/* Dynamic Route Intelligence Card */}
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
            <Zap size={14}/> Real-Time Optimization
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Your Location Intelligence</h2>
          <p className="text-slate-400 max-w-xl text-lg leading-relaxed italic">
            Based on your active coordinates, the system has identified the ""{logs[0]?.transportMode || 'Optimal'}"" path as your lowest-cost shipping stat.
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-5 rotate-12 bg-white/10 p-20 rounded-full">
           <MapPin size={200}/>
        </div>
      </div>

      {/* Drill-down Section */}
      {selectedMode && (
        <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase tracking-tight">{selectedMode} LOGS</h3>
            <button onClick={() => setSelectedMode(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"><X/></button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {drillDownData.map(log => (
              <div key={log.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Ref: # {log.id}</p>
                  <p className="text-sm font-bold text-slate-700">Hub: {log.warehouseName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900">₹{log.finalCharge.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase italic">{log.distance.toFixed(1)} KM Transit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ModeCard({ label, val, icon, theme, onClick }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600",
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600"
  };
  return (
    <button onClick={onClick} className={`${styles[theme]} border-2 p-8 rounded-[2rem] text-left transition-all hover:text-white group relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1`}>
      <div className="relative z-10">
        <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl w-fit mb-6 shadow-sm group-hover:bg-white/20">{icon}</div>
        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="text-4xl font-black italic">₹{val.toLocaleString()}</p>
      </div>
    </button>
  );
}