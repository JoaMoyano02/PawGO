import React, { useState, useEffect, useRef } from 'react';
import { 
  Dog, MapPin, ShieldCheck, Clock, CreditCard, Star, 
  User, CheckCircle, Navigation, Camera, AlertCircle, 
  Calendar, Award, Bell, Play, Square, Sparkles, Heart, 
  ChevronRight, ArrowLeft, RefreshCw, Layers, PhoneCall, MessageSquare, Send, Image
} from 'lucide-react';

// Mock initial data
const INITIAL_PETS = [
  { id: 1, name: "Rocco", breed: "Golden Retriever", age: 3, energy: "Alta", reactiveness: "Baja", size: "Grande", notes: "Le encanta correr en el Parque Sarmiento y jugar con pelotas.", photo: "🐕" },
  { id: 2, name: "Luna", breed: "French Bulldog", age: 2, energy: "Media", reactiveness: "Media", size: "Pequeño", notes: "Sensible al calor, requiere descansos con agua cerca del Buen Pastor.", photo: "🐶" }
];

const WALKERS = [
  { id: 101, name: "Mateo Rossi", rating: 4.9, walksDone: 154, distance: "Nueva Córdoba (A 200m)", verified: true, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80", bio: "Estudiante de Veterinaria en la UNC. Amante del Parque Sarmiento.", badge: "Primeros Auxilios" },
  { id: 102, name: "Camila Peralta", rating: 4.8, walksDone: 112, distance: "Güemes (A 450m)", verified: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", bio: "Entrenadora canina en Córdoba Capital. Rutas por Cañada y Güemes.", badge: "Entrenador Certificado" },
  { id: 103, name: "Gonzalo Juárez", rating: 5.0, walksDone: 230, distance: "Cerro de las Rosas (A 1.2 km)", verified: true, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80", bio: "Paseos individuales y personalizados en Zona Norte y Alberdi.", badge: "Top Paseador" }
];

const PAST_WALKS = [
  { id: 501, date: "Ayer, 17:00 hs", walkerName: "Mateo Rossi", petName: "Rocco", duration: "45 min", type: "Normal", price: 3500, rating: 5, status: "Completado" },
  { id: 502, date: "24 de Oct, 11:30 hs", walkerName: "Camila Peralta", petName: "Luna", duration: "30 min", type: "Express", price: 2800, rating: 5, status: "Completado" }
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'walker', text: '¡Hola! Ya estoy llegando a tu edificio en Nueva Córdoba para buscar a Rocco.', time: '16:00' },
  { id: 2, sender: 'owner', text: '¡Buenísimo Mateo! Ya le puse pretal y pechera. Bajamos en 1 minuto.', time: '16:01' }
];

export default function App() {
  // App role state
  const [role, setRole] = useState('owner'); // 'owner' | 'walker'

  // Owner App State
  const [pets, setPets] = useState(INITIAL_PETS);
  const [selectedPet, setSelectedPet] = useState(INITIAL_PETS[0]);
  const [ownerTab, setOwnerTab] = useState('home'); // 'home' | 'book' | 'active' | 'chat' | 'history' | 'profile'
  const [walkType, setWalkType] = useState('normal'); // 'express' | 'normal' | 'premium'
  const [selectedWalker, setSelectedWalker] = useState(WALKERS[0]);
  const [isImmediate, setIsImmediate] = useState(true);

  // Shared Active Walk State
  const [activeWalk, setActiveWalk] = useState(null); 

  // Chat State
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES);
  const [newMessageText, setNewMessageText] = useState('');

  // Walker App State
  const [isOnline, setIsOnline] = useState(true);
  const [walkerEarnings, setWalkerEarnings] = useState(52400);
  const [walkerCompletedWalks, setWalkerCompletedWalks] = useState(16);

  // Timer simulation for active walk
  useEffect(() => {
    let interval = null;
    if (activeWalk && activeWalk.status === 'in_progress') {
      interval = setInterval(() => {
        setActiveWalk((prev) => {
          if (!prev) return null;
          const nextTime = prev.timeElapsed + 1;
          const totalSec = prev.durationMinutes * 60;
          const progress = Math.min(100, Math.floor((nextTime / totalSec) * 100));

          let updatedPhotos = [...prev.photos];
          if (nextTime === 10 && updatedPhotos.length === 0) {
            updatedPhotos.push({ time: "16:10", text: "¡Llegamos al Parque Sarmiento! Rocco está feliz disfrutando del sol.", img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80" });
          }

          if (progress >= 100) {
            return { ...prev, timeElapsed: nextTime, routeProgress: 100, status: 'finished', photos: updatedPhotos };
          }

          return { ...prev, timeElapsed: nextTime, routeProgress: progress, photos: updatedPhotos };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWalk]);

  // Handle Request Walk (Owner)
  const handleRequestWalk = () => {
    const newWalk = {
      id: Date.now(),
      pet: selectedPet,
      walker: selectedWalker,
      type: walkType === 'express' ? 'Paseo Express (30m)' : walkType === 'normal' ? 'Paseo Normal (45m)' : 'Premium Individual (60m)',
      durationMinutes: walkType === 'express' ? 30 : walkType === 'normal' ? 45 : 60,
      price: walkType === 'express' ? 2800 : walkType === 'normal' ? 3500 : 5000,
      timeElapsed: 0,
      routeProgress: 0,
      status: 'requested',
      photos: []
    };
    setActiveWalk(newWalk);
    setOwnerTab('active');
  };

  // Handle Walker Accepts Request
  const handleAcceptRequest = () => {
    if (activeWalk) {
      setActiveWalk({ ...activeWalk, status: 'in_progress' });
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'walker', text: `¡Paseo aceptado! Voy camino a buscar a ${activeWalk.pet.name}.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }
  };

  // Send Chat Message
  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const msg = {
      id: Date.now(),
      sender: role,
      text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMessageText('');

    // Simulated Auto Response from Walker if Owner sends a message
    if (role === 'owner') {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'walker', text: `¡De acuerdo! Todo en orden por aquí con ${activeWalk ? activeWalk.pet.name : selectedPet.name}. 👌`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }, 1500);
    }
  };

  // Handle Add Photo/Report (Walker)
  const handleAddWalkerReport = (type) => {
    if (!activeWalk) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReport = type === 'photo' 
      ? { time: timeStr, text: "¡Parada de descanso con agua cerca del Buen Pastor!", img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=400&q=80" }
      : { time: timeStr, text: "💩 Realizó sus necesidades de forma normal en Plaza España.", img: null };
    
    const updated = { ...activeWalk, photos: [newReport, ...activeWalk.photos] };
    setActiveWalk(updated);

    // Send automated chat notification
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'walker', text: `[REPORTE DE PASEO]: ${newReport.text}`, time: timeStr, isReport: true }
    ]);
  };

  const handleFinishWalk = () => {
    if (!activeWalk) return;
    setWalkerEarnings((prev) => prev + activeWalk.price);
    setWalkerCompletedWalks((prev) => prev + 1);
    setActiveWalk({ ...activeWalk, status: 'finished' });
  };

  const handleClearWalk = () => {
    setActiveWalk(null);
    setOwnerTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col items-center">
      
      {/* GLOBAL TOP NAVIGATION & ROLE SWITCHER BAR */}
      <header className="w-full max-w-md bg-slate-900 text-white p-3 shadow-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-violet-600 to-amber-500 p-2 rounded-xl text-white shadow">
            <Dog className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
              PawGo
            </span>
            <span className="text-[10px] block text-amber-400 font-medium -mt-1">📍 Córdoba, Argentina</span>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="bg-slate-800 p-1 rounded-full border border-slate-700 flex text-xs font-semibold">
          <button
            onClick={() => setRole('owner')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
              role === 'owner' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Dueño
          </button>
          <button
            onClick={() => setRole('walker')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
              role === 'walker' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dog className="w-3.5 h-3.5" /> Paseador
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (MOBILE FRAME DISPLAY) */}
      <main className="w-full max-w-md bg-white min-h-[calc(100vh-60px)] shadow-2xl flex flex-col relative pb-20 overflow-x-hidden">
        
        {/* ========================================================================= */}
        {/* VISTA DEL DUEÑO (OWNER VIEW) */}
        {/* ========================================================================= */}
        {role === 'owner' && (
          <div className="flex-1 flex flex-col">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-800 text-white p-5 rounded-b-3xl shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div>
                  <span className="text-violet-200 text-xs font-medium">¡Hola, Valentina!</span>
                  <h1 className="text-xl font-bold">Paseos en Córdoba 🐾</h1>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Pet selector pills */}
              <div className="flex gap-2 overflow-x-auto pt-2 pb-1 relative z-10 scrollbar-none">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                      selectedPet.id === pet.id 
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300' 
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    <span>{pet.photo}</span>
                    <span>{pet.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: HOME / MAP */}
            {ownerTab === 'home' && (
              <div className="p-4 space-y-5 flex-1">
                {/* Active Walk Floating Notification Banner */}
                {activeWalk && (
                  <div 
                    onClick={() => setOwnerTab('active')}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <Navigation className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-100">Paseo en progreso</p>
                        <p className="text-sm font-bold">{activeWalk.pet.name} con {activeWalk.walker.name}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}

                {/* Cordoba Interactive Map Simulation */}
                <div className="bg-slate-100 rounded-3xl p-3 border border-slate-200 shadow-inner relative overflow-hidden h-60 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-slate-200 opacity-90 flex flex-col justify-between p-2">
                    <div className="w-full h-full relative border border-slate-300 rounded-xl bg-slate-100 overflow-hidden">
                      {/* Córdoba City Streets SVG */}
                      <svg className="absolute inset-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#cbd5e1" strokeWidth="14" />
                        <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#cbd5e1" strokeWidth="16" />
                        <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#cbd5e1" strokeWidth="16" />
                        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#cbd5e1" strokeWidth="12" />
                        
                        {/* Parque Sarmiento Area */}
                        <rect x="52%" y="30%" width="42%" height="32%" fill="#dcfce7" rx="10" stroke="#86efac" strokeWidth="2" />
                        <text x="56%" y="48%" fill="#15803d" fontSize="9" fontStyle="italic" fontWeight="bold">Parque Sarmiento</text>
                        
                        {/* Buen Pastor Area */}
                        <circle cx="28%" cy="45%" r="18" fill="#fef08a" stroke="#facc15" strokeWidth="2" />
                        <text x="18%" y="47%" fill="#854d0e" fontSize="8" fontWeight="bold">Buen Pastor</text>

                        <text x="47%" y="15%" fill="#64748b" fontSize="8" fontWeight="bold">Av. Hipólito Yrigoyen</text>
                        <text x="47%" y="78%" fill="#64748b" fontSize="8" fontWeight="bold">Av. Colón</text>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Map Header Overlay */}
                  <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-sm text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <MapPin className="w-4 h-4 text-violet-600" />
                      <span>Nueva Córdoba / Güemes</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      🇦🇷 Córdoba Capital
                    </span>
                  </div>

                  {/* Simulated Walker Markers on Map */}
                  <div className="relative z-10 flex items-center justify-around my-auto">
                    {WALKERS.map((w, idx) => (
                      <div 
                        key={w.id} 
                        onClick={() => { setSelectedWalker(w); setOwnerTab('book'); }}
                        className={`group relative cursor-pointer transform transition hover:scale-110 ${idx === 1 ? '-translate-y-4' : ''}`}
                      >
                        <div className="bg-violet-600 text-white p-1 rounded-full shadow-lg ring-4 ring-violet-300">
                          <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-full object-cover" />
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                          {w.name.split(' ')[0]} ({w.distance.split(' ')[0]})
                        </span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setOwnerTab('book')}
                    className="relative z-10 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> Solicitar Paseo en Córdoba
                  </button>
                </div>

                {/* Pet Profile Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedPet.photo}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{selectedPet.name}</h3>
                        <p className="text-xs text-slate-500">{selectedPet.breed} • {selectedPet.age} años</p>
                      </div>
                    </div>
                    <span className="bg-violet-100 text-violet-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      Energía {selectedPet.energy}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                    "{selectedPet.notes}"
                  </p>
                </div>

                {/* Near Walkers List */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                    <span>Paseadores Verificados en Córdoba</span>
                    <span className="text-xs text-violet-600 font-semibold cursor-pointer">Ver mapa</span>
                  </h3>
                  <div className="space-y-2.5">
                    {WALKERS.map((w) => (
                      <div key={w.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-violet-300 transition">
                        <div className="flex items-center gap-3">
                          <img src={w.avatar} alt={w.name} className="w-11 h-11 rounded-2xl object-cover" />
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-bold text-xs text-slate-900">{w.name}</h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <p className="text-[11px] text-slate-500">{w.distance} • {w.walksDone} paseos</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-slate-800">{w.rating}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded ml-1 font-medium">{w.badge}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setSelectedWalker(w); setOwnerTab('book'); }}
                          className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                        >
                          Elegir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: BOOKING FORM */}
            {ownerTab === 'book' && (
              <div className="p-4 space-y-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setOwnerTab('home')} className="p-1.5 bg-slate-100 rounded-xl hover:bg-slate-200">
                    <ArrowLeft className="w-4 h-4 text-slate-700" />
                  </button>
                  <h2 className="font-bold text-slate-900 text-base">Paseo para {selectedPet.name} en Córdoba</h2>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-3.5 rounded-2xl border border-violet-200 flex items-center gap-3">
                  <img src={selectedWalker.avatar} alt={selectedWalker.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-sm text-slate-900">{selectedWalker.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-slate-600">{selectedWalker.bio}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Modalidad de Reserva</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsImmediate(true)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        isImmediate ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" /> Inmediato (Ahora)
                    </button>
                    <button
                      onClick={() => setIsImmediate(false)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        !isImmediate ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Calendar className="w-4 h-4" /> Programar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Tipo de Paseo</label>
                  <div className="space-y-2">
                    {[
                      { id: 'express', name: 'Paseo Express', time: '30 mins', desc: 'Recorrido ágil cerca del domicilio.', price: 2800 },
                      { id: 'normal', name: 'Paseo Estándar', time: '45 mins', desc: 'Circuito Parque Sarmiento o Buen Pastor.', price: 3500 },
                      { id: 'premium', name: 'Premium Exclusivo', time: '60 mins', desc: 'Dedicación 100% individual de alta energía.', price: 5000 }
                    ].map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setWalkType(type.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          walkType === type.id 
                            ? 'bg-violet-50 border-violet-600 ring-2 ring-violet-400' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-900">{type.name}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">{type.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{type.desc}</p>
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">${type.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Método de pago</span>
                    <span className="font-bold text-violet-700 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Mercado Pago (•••• 4920)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total a abonar</span>
                    <span className="text-base text-violet-700">
                      ${walkType === 'express' ? 2800 : walkType === 'normal' ? 3500 : 5000} ARS
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRequestWalk}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition transform active:scale-95"
                >
                  <CheckCircle className="w-5 h-5 text-amber-300" /> Confirmar y Solicitar Paseo
                </button>
              </div>
            )}

            {/* TAB CONTENT: ACTIVE WALK TRACKER */}
            {ownerTab === 'active' && (
              <div className="p-4 space-y-4 flex-1">
                {!activeWalk ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="bg-slate-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
                      <Dog className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800">No hay ningún paseo activo</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Solicita un paseo desde el inicio para monitorearlo en tiempo real.</p>
                    <button 
                      onClick={() => setOwnerTab('home')}
                      className="bg-violet-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Ir al Inicio
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Status Card Header */}
                    <div className={`p-4 rounded-3xl text-white shadow-lg transition-all ${
                      activeWalk.status === 'requested' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                        : activeWalk.status === 'in_progress'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-700'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                          {activeWalk.status === 'requested' && "Buscando Confirmación"}
                          {activeWalk.status === 'in_progress' && "Paseo En Curso • Córdoba"}
                          {activeWalk.status === 'finished' && "Paseo Finalizado Exitosamente"}
                        </span>
                        <Clock className="w-4 h-4" />
                      </div>

                      <h2 className="text-lg font-extrabold">
                        {activeWalk.status === 'requested' && "Esperando respuesta del paseador..."}
                        {activeWalk.status === 'in_progress' && `${activeWalk.pet.name} está en el Parque Sarmiento`}
                        {activeWalk.status === 'finished' && `¡${activeWalk.pet.name} volvió a casa!`}
                      </h2>

                      {activeWalk.status === 'in_progress' && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Progreso del recorrido por GPS</span>
                            <span>{activeWalk.routeProgress}%</span>
                          </div>
                          <div className="w-full bg-white/30 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-300 h-full transition-all duration-500" 
                              style={{ width: `${activeWalk.routeProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cordoba Map View for active walk */}
                    <div className="bg-slate-100 rounded-3xl h-56 relative overflow-hidden border border-slate-200 shadow-inner flex flex-col justify-between p-3">
                      <div className="absolute inset-0 bg-slate-200 opacity-90 flex flex-col justify-between p-2">
                        <svg className="absolute inset-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
                          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#cbd5e1" strokeWidth="16" />
                          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="16" />
                          <circle cx="50%" cy="35%" r="35" fill="#dcfce7" stroke="#86efac" strokeWidth="2" />
                          <text x="41%" y="37%" fill="#15803d" fontSize="9" fontWeight="bold">Parque Sarmiento</text>
                        </svg>
                      </div>

                      <div className="relative z-10 flex-1 flex items-center justify-center">
                        <div className="bg-violet-600 text-white p-2 rounded-full shadow-2xl ring-8 ring-violet-400/40 animate-bounce">
                          <Dog className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={activeWalk.walker.avatar} alt="walker" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{activeWalk.walker.name}</p>
                            <p className="text-[10px] text-slate-500">Av. Hipólito Yrigoyen / Nueva Córdoba</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setOwnerTab('chat')}
                            className="p-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center gap-1 text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Chat
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Photos and Event Updates Timeline */}
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-violet-600" />
                        <span>Actualizaciones de la Mascota</span>
                      </h3>
                      {activeWalk.photos.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                          Aún no se han enviado fotos del paseo...
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {activeWalk.photos.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                              {item.img ? (
                                <img src={item.img} alt="report" className="w-14 h-14 rounded-xl object-cover" />
                              ) : (
                                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xl">
                                  💩
                                </div>
                              )}
                              <div className="flex-1">
                                <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">{item.time}</span>
                                <p className="text-xs text-slate-800 font-medium mt-1">{item.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CHAT */}
            {ownerTab === 'chat' && (
              <div className="flex-1 flex flex-col h-[calc(100vh-140px)] bg-slate-50">
                {/* Chat Header */}
                <div className="bg-white p-3 border-b border-slate-200 flex items-center gap-3 shadow-sm">
                  <img src={selectedWalker.avatar} alt="Paseador" className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{selectedWalker.name}</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> En línea en Córdoba
                    </p>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                  {chatMessages.map((msg) => {
                    const isMe = (role === 'owner' && msg.sender === 'owner') || (role === 'walker' && msg.sender === 'walker');
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                          msg.isReport
                            ? 'bg-amber-100 border border-amber-300 text-amber-900 font-medium'
                            : isMe 
                            ? 'bg-violet-600 text-white rounded-br-none shadow-sm' 
                            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`text-[9px] block mt-1 text-right ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input Bar */}
                <div className="bg-white p-2.5 border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-100 text-xs p-2.5 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-violet-600 hover:bg-violet-700 text-white p-2.5 rounded-full transition shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {ownerTab === 'history' && (
              <div className="p-4 space-y-4 flex-1">
                <h2 className="font-bold text-slate-900 text-base">Historial de Paseos en Córdoba</h2>
                <div className="space-y-3">
                  {PAST_WALKS.map((w) => (
                    <div key={w.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{w.date}</span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">Paseo con {w.walkerName}</h4>
                          <p className="text-xs text-slate-500">Mascota: {w.petName} • {w.duration}</p>
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">${w.price} ARS</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-800">{w.rating}.0</span>
                        </div>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> {w.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROFILE */}
            {ownerTab === 'profile' && (
              <div className="p-4 space-y-4 flex-1">
                <div className="text-center space-y-2 py-3">
                  <div className="w-20 h-20 bg-violet-600 text-white rounded-full mx-auto flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-violet-200">
                    VR
                  </div>
                  <h2 className="font-bold text-slate-900 text-base">Valentina Rodríguez</h2>
                  <p className="text-xs text-slate-500">Nueva Córdoba, Córdoba Capital</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-slate-700">Mis Mascotas</h3>
                  {pets.map((p) => (
                    <div key={p.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p.photo}</span>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.breed}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full font-bold">Editar</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-xs text-slate-700">Métodos de Pago</h3>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-violet-600" /> Mercado Pago (•••• 4920)
                    </span>
                    <span className="text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                </div>
              </div>
            )}

            {/* OWNER BOTTOM TAB BAR */}
            <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center z-40">
              {[
                { id: 'home', label: 'Inicio', icon: MapPin },
                { id: 'active', label: 'En Vivo', icon: Navigation, badge: activeWalk ? '!' : null },
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'history', label: 'Paseos', icon: Clock },
                { id: 'profile', label: 'Perfil', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOwnerTab(tab.id)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition relative ${
                    ownerTab === tab.id ? 'text-violet-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-[10px]">{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA DEL PASEADOR (WALKER VIEW) */}
        {/* ========================================================================= */}
        {role === 'walker' && (
          <div className="flex-1 flex flex-col p-4 space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={WALKERS[0].avatar} alt="Mateo" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400" />
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="font-bold text-sm text-white">{WALKERS[0].name}</h2>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Paseador Verificado • Córdoba ⭐ {WALKERS[0].rating}</p>
                </div>
              </div>

              <div 
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5 text-xs font-extrabold transition ${
                  isOnline ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-slate-950 animate-pulse' : 'bg-slate-400'}`}></div>
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 p-3.5 rounded-2xl shadow space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Ganancias Hoy</span>
                <p className="text-xl font-black">${walkerEarnings} ARS</p>
              </div>
              <div className="bg-violet-50 border border-violet-200 p-3.5 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">Paseos en Córdoba</span>
                <p className="text-xl font-black text-violet-900">{walkerCompletedWalks}</p>
              </div>
            </div>

            {/* INCOMING REQUEST CARD */}
            {activeWalk && activeWalk.status === 'requested' && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-0.5 rounded-3xl shadow-xl animate-bounce">
                <div className="bg-white p-4 rounded-[22px] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                      ¡Nueva Solicitud Entrante!
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">${activeWalk.price} ARS</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeWalk.pet.photo}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Mascota: {activeWalk.pet.name}</h4>
                      <p className="text-xs text-slate-500">{activeWalk.pet.breed} • {activeWalk.type}</p>
                      <p className="text-[11px] text-violet-700 font-semibold">Ubicación: Nueva Córdoba (A 200m)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={handleClearWalk}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={handleAcceptRequest}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow"
                    >
                      Aceptar Paseo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE WALK DASHBOARD (WALKER) */}
            {activeWalk && activeWalk.status === 'in_progress' && (
              <div className="bg-white p-4 rounded-3xl border border-violet-200 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeWalk.pet.photo}</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">En paseo con {activeWalk.pet.name}</h3>
                      <p className="text-xs text-slate-500">{activeWalk.type}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                    En Curso
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Enviar actualización al dueño</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddWalkerReport('photo')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-4 h-4 text-violet-600" /> Subir Foto
                    </button>
                    <button
                      onClick={() => handleAddWalkerReport('poop')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>💩</span> Reportar Pipi/Pó
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleFinishWalk}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" /> Finalizar Paseo y Cobrar
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}