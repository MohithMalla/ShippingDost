import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { Truck, Target, CheckCircle, BarChart3, ChevronRight } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// This function moves the map automatically when we get a result
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
  const [myCoords, setMyCoords] = useState(null);
  const [dropdowns, setDropdowns] = useState({ sellers: [], customers: [], products: [] });
  const [formData, setFormData] = useState({ 
    sellerId: '', 
    customerId: '', 
    productId: '', 
    deliverySpeed: 'standard' 
  });

  // Getting our current location from the browser
  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission denied. Select manually.")
    );
  };

  // Fetching all sellers, customers, and products for the dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, c, p] = await Promise.all([
          axios.get('https://shippingdost-4.onrender.com/api/v1/sellers'),
          axios.get('https://shippingdost-4.onrender.com/api/v1/customers'),
          axios.get('https://shippingdost-4.onrender.com/api/v1/products')
        ]);
        setDropdowns({ sellers: s.data, customers: c.data, products: p.data });
      } catch (err) { 
        console.error("Data loading error!", err); 
      }
    };
    loadData();
  }, []);

  // When we click the button to calculate
  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!formData.sellerId || !formData.customerId || !formData.productId) {
      return alert("Please select all options first!");
    }
    
    setLoading(true);
    try {
      const response = await axios.post('https://shippingdost-4.onrender.com/api/v1/shipping-charge/calculate', formData);
      setResult(response.data);
    } catch (err) { 
      alert(err.response?.data?.message || "Error calculating price."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* The Input Form */}
        <form onSubmit={handleCalculate} className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <Truck className="text-blue-600" size={32}/> Estimator
            </h2>
            <button type="button" onClick={getMyLocation} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs ${myCoords ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}>
              {myCoords ? <CheckCircle size={16}/> : <Target size={16}/>}
              {myCoords ? "Location Linked" : "Access Location"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SelectField label="Kirana Store" data={dropdowns.customers} onChange={val => setFormData({...formData, customerId: val})} />
            <SelectField label="Manufacturer" data={dropdowns.sellers} onChange={val => setFormData({...formData, sellerId: val})} />
            <SelectField label="Product Item" data={dropdowns.products} onChange={val => setFormData({...formData, productId: val})} />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Speed</label>
              <select 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-blue-500 text-sm font-bold appearance-none"
                onChange={e => setFormData({...formData, deliverySpeed: e.target.value})}>
                <option value="standard">Standard (Economy)</option>
                <option value="express">Express (Priority)</option>
              </select>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl active:scale-[0.98]">
            {loading ? "Checking Route..." : "Run Calculation Logic"}
          </button>
        </form>

        {/* The Result Card that shows up after calculation */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white border-4 border-slate-900 p-8 rounded-[2.5rem] space-y-6 shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center border-b pb-5">
                <span className="text-xs font-black text-blue-600 uppercase italic">Route Found</span>
                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">{result.transportMode}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Final Price</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter italic">₹{result.shippingCharge.toFixed(2)}</h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl text-[11px] text-blue-800 font-bold leading-relaxed">
                Using {result.transportMode} for the {result.distance.toFixed(1)} KM trip.
              </div>
            </div>

            {/* Visual showing the mode logic */}
            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><BarChart3 size={16}/> Mode Breakdown</div>
              <div className="space-y-3">
                <ProgressBar label="Air" value={100} current={result.transportMode === 'AEROPLANE'} />
                <ProgressBar label="Truck" value={70} current={result.transportMode === 'TRUCK'} />
                <ProgressBar label="Van" value={40} current={result.transportMode === 'MINI_VAN'} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Showing the route on the Map */}
      {result && (
        <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl animate-in slide-in">
          <MapContainer center={[17.5524, 82.8550]} zoom={6} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapRecenter coords={[result.nearestWarehouse.warehouseLocation.lat, result.nearestWarehouse.warehouseLocation.lng]} />
            
            {/* Drawing the path line */}
            <Polyline 
              positions={[
                [17.7, 83.2], // Seller location
                [result.nearestWarehouse.warehouseLocation.lat, result.nearestWarehouse.warehouseLocation.lng], // Warehouse
                [17.5524, 82.8550] // Customer location
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

// Progress bar for the mode selection visualization
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

// Custom dropdown field
function SelectField({ label, data, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <select 
          className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-blue-500 text-sm font-bold appearance-none transition-all cursor-pointer"
          onChange={e => onChange(e.target.value)}>
          <option value="">Select {label}...</option>
          {data.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><ChevronRight size={18}/></div>
      </div>
    </div>
  );
}