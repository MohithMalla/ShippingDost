import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import History from './pages/History';
import { LayoutDashboard, Truck, History as HistoryIcon, ShieldCheck } from 'lucide-react';

export default function App() {
  const linkStyle = ({isActive}) => 
    `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`;

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <aside className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl sticky top-0 h-screen">
          <div className="p-8 flex items-center gap-3 border-b border-slate-800">
            <div className="bg-blue-600 p-2 rounded-lg"><ShieldCheck size={24}/></div>
            <h1 className="text-2xl font-black tracking-tighter">Shipping Dost</h1>
          </div>
          <nav className="flex-1 p-6 space-y-3">
            <NavLink to="/" className={linkStyle}><LayoutDashboard size={20}/> Dashboard</NavLink>
            <NavLink to="/calculate" className={linkStyle}><Truck size={20}/> New Estimate</NavLink>
            <NavLink to="/history" className={linkStyle}><HistoryIcon size={20}/> Audit History</NavLink>
          </nav>
        </aside>
        <main className="flex-1 p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calculate" element={<Calculator />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}