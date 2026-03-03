import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { Truck, Zap, Info, MapPin, Target, CheckCircle, BarChart3, ChevronRight } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Component to auto-center map when coordinates change
function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 7);
  }, [coords]);
  return null;
}

export default function Calculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [coords, setCoords] = useState(null);
  const [options, setOptions] = useState({ sellers: [], customers: [], products: [] });
  const [form, setForm] = useState({ sellerId: '', customerId: '', productId: '', deliverySpeed: 'standard' });

  // Browser Geolocation API for real-time B2B intelligence
  const getMyPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location access denied. Using manual selection.")
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c, p] = await Promise.all([
          axios.get('https://shippingdost-4.onrender.com/api/v1/sellers'),
          axios.get('https://shippingdost-4.onrender.com/api/v1/customers'),
          axios.get('https://shippingdost-4.onrender.com/api/v1/products')
        ]);
        setOptions({ sellers: s.data, customers: c.data, products: p.data });
      } catch (err) { console.error("Dropdown load failed", err); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sellerId || !form.customerId || !form.productId) return alert("Select all fields.");
    setLoading(true);
    try {
      const res = await axios.post('https://shippingdost-4.onrender.com/api/v1/shipping-charge/calculate', form);
      setResult(res.data);
    } catch (err) { alert(err.response?.data?.message || "Logic Error."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Advanced Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
              <Truck className="text-blue-600" size={32}/> Estimator
            </h2>
            <button type="button" onClick={getMyPosition} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${coords ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}>
              {coords ? <CheckCircle size={16}/> : <Target size={16}/>}
              {coords ? "Location Linked" : "Access Location"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SelectField label="Kirana Store" data={options.customers} onChange={val => setForm({...form, customerId: val})} />
            <SelectField label="Manufacturer" data={options.sellers} onChange={val => setForm({...form, sellerId: val})} />
            <SelectField label="Product Item" data={options.products} onChange={val => setForm({...form, productId: val})} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Speed</label>
              <select className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-blue-500 text-sm font-bold appearance-none"
                onChange={e => setForm({...form, deliverySpeed: e.target.value})}>
                <option value="standard">Standard (Economy)</option>
                <option value="express">Express (Priority)</option>
              </select>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl active:scale-[0.98]">
            {loading ? "Optimizing Route..." : "Run Calculation Logic"}
          </button>
        </form>

        {/* Intelligence Result Card */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white border-4 border-slate-900 p-8 rounded-[2.5rem] space-y-6 shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center border-b pb-5">
                <span className="text-xs font-black text-blue-600 uppercase italic">Route Optimized</span>
                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">{result.transportMode}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Shipping Price</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter italic">₹{result.shippingCharge.toFixed(2)}</h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl text-[11px] text-blue-800 font-bold leading-relaxed">
                💡 {result.transportMode} selected for {result.distance.toFixed(1)} KM route.
              </div>
            </div>

            {/* Mode Comparison Graph */}
            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><BarChart3 size={16}/> Mode Logic</div>
              <div className="space-y-3">
                <ProgressBar label="Air" value={100} current={result.transportMode === 'AEROPLANE'} />
                <ProgressBar label="Truck" value={70} current={result.transportMode === 'TRUCK'} />
                <ProgressBar label="Van" value={40} current={result.transportMode === 'MINI_VAN'} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map Section */}
      {result && (
        <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl animate-in slide-in-from-bottom-10">
          <MapContainer center={[17.5524, 82.8550]} zoom={6} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapRecenter coords={[result.nearestWarehouse.warehouseLocation.lat, result.nearestWarehouse.warehouseLocation.lng]} />
            
            {/* Optimized Path Visualizer */}
            <Polyline 
              positions={[
                [17.7, 83.2], // Example Seller
                [result.nearestWarehouse.warehouseLocation.lat, result.nearestWarehouse.warehouseLocation.lng],
                [17.5524, 82.8550] // User Location
              ]} 
              color="#2563eb" weight={5} dashArray="10, 15"
            />
            
            <Marker position={[result.nearestWarehouse.warehouseLocation.lat, result.nearestWarehouse.warehouseLocation.lng]}>
                <Popup>Nearest Hub: {result.nearestWarehouse.warehouseName}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ label, value, current }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
        <span className={current ? "text-blue-400" : "text-slate-500"}>{label} {current && "✔"}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${current ? 'bg-blue-500' : 'bg-slate-700'}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function SelectField({ label, data, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <select className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-blue-500 text-sm font-bold appearance-none transition-all cursor-pointer"
          onChange={e => onChange(e.target.value)}>
          <option value="">Select {label}...</option>
          {data.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><ChevronRight size={18}/></div>
      </div>
    </div>
  );
}