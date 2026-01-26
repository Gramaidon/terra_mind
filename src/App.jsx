import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { 
  Search, Map as MapIcon, Zap, Info, User, PlusCircle, 
  BrainCircuit, TrendingUp, MapPin, Camera, CheckCircle, 
  Cpu, ArrowLeft, FileText, Phone, Activity, Expand, 
  Globe, BarChart3, DollarSign, ShieldCheck, Layers, Lightbulb,
  MessageSquare, Lock, PenTool, CreditCard, Landmark, FileCheck,
  Hourglass, Send, Mail, Lock as LockIcon, ChevronRight, AlertTriangle, Construction,
  Ruler, FileBadge
} from 'lucide-react';

// --- 1. UTILS & DATA (Mock Data & Helper) ---

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

// DATA DUMMY (Pastikan file gambar lokal ada di folder public/images/ jika menggunakan path lokal)
const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Tanah Global Jonggol View Bukit",
    location: "Jonggol, Sukawangi, Bogor",
    price: 1987480000,
    pricePerMeter: 220000,
    area: 9034,
    legality: "SHM",
    type: "Kavling Villa",
    description: "Tanah globalan seluas 9034 m² berlokasi di Jonggol, Sukawangi, Bogor. Sangat ideal untuk pembangunan villa pribadi, estate eksklusif, atau investasi properti jangka panjang. Akses jalan mudah dilalui kendaraan, lingkungan tenang dan asri dengan pemandangan hijau alami.",
    // Menggunakan path lokal (Pastikan file ada di public/images/tanah-jonggol.png)
    // Jika belum ada, ganti string ini kembali ke URL Unsplash
    image: "/images/1_1.png",
    images: [
      "/images/1_1.png",
      "/images/1_2.jpg",
      "/images/1_3.jpg",
      "/images/1_4.jpg"
    ],
    seller: "Rezza Siartomoro",
    phone: "+6285894872978",
    coordinates: { x: -6.646172, y: 107.0331773 }, 
    aiScore: 92,
    isVerified: true
  },
  {
    id: 2,
    title: "Tanah Kavling Bonjovi Village",
    location: "Sukayaja, Jonggol, Bogor",
    price: 50000000,
    pricePerMeter: 500000,
    area: 100,
    legality: "SHM",
    type: "Komersial",
    description: "INVESTASI CERDAS DI TIMUR CIBUBUR! \n\n⚡ LAUNCHING PERDANA: TERSEDIA 50 UNIT EKSKLUSIF! ⚡\n\nKesempatan langka memiliki aset tanah seluas 100 m² hanya dengan 50 Juta Rupiah! Kami membuka 50 unit kavling siap bangun dalam satu hamparan yang rapi dan tertata.\n\n✅ Harga All-In (Terima Beres): Tidak ada biaya tersembunyi, harga sudah termasuk biaya pengurusan Surat Hak Milik (SHM) atas nama Anda.\n✅ Lokasi Strategis: Terletak di kawasan berkembang Sukayaja, Jonggol dengan pemandangan asri dan udara sejuk.\n✅ Potensi Tinggi: Sangat cocok untuk tabungan aset, perkebunan produktif, atau dibangun villa mungil.\n\nJangan tunda! Amankan posisi terbaik Anda dari 50 unit yang tersedia sebelum kehabisan!",    
    image: "/images/2_1.jpeg", // Pastikan file ada di folder public/images/
    images: [
      "/images/2_1.jpeg",
      "/images/2_2.jpeg",
      "/images/2_3.jpeg",
      "/images/2_4.jpeg",
      "/images/2_5.jpeg",
      "/images/2_6.jpeg"
    ],
    seller: "Rezza Siartomoro",
    phone: "628198765432",
    coordinates: { x: -6.5468243, y: 106.9997408 },
    aiScore: 98,
    isVerified: true,
    
    // --- DATA BARU (UNIT STOK) ---
    totalUnits: 50,
    availableUnits: 50, // 50 dari 50 masih ada
    isCluster: true     // Penanda bahwa ini adalah Cluster/Kawasan
  },
  // {
  //   id: 3,
  //   title: "Kebun Durian Produktif Bogor",
  //   location: "Caringin, Bogor, Jawa Barat",
  //   price: 450000000,
  //   pricePerMeter: 900000,
  //   area: 500,
  //   legality: "AJB",
  //   type: "Perkebunan",
  //   description: "Tanah subur sudah ada pohon durian musang king. Udara sejuk, sumber air melimpah. Cocok untuk healing atau investasi jangka panjang di bidang agrobisnis.",
  //   image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000",
  //   images: [
  //     "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000",
  //     "https://images.unsplash.com/photo-1598555731364-783515431dc8?auto=format&fit=crop&q=80&w=1000"
  //   ],
  //   seller: "Pak Asep Tani",
  //   phone: "628123456780",
  //   coordinates: { x: 20, y: 70 },
  //   aiScore: 85,
  //   isVerified: false 
  // },
];

// --- 2. COMPONENTS (Navbar, Card) ---

function Navbar({ currentView, setView }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-0 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-emerald-200 transition-all p-1">
            {/* Ganti path logo sesuai lokasi file di public/ */}
            <img 
              src="/Logo_terramind.png" 
              alt="TerraMind Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'; 
                e.target.parentElement.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 18 18"/></svg>';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Terra<span className="text-emerald-600">Mind</span></h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide">Smart Land, Smart Choice</p>
          </div>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavButton active={currentView === 'home'} onClick={() => setView('home')} icon={Search} label="Cari Tanah" />
          <NavButton active={currentView === 'valuation'} onClick={() => setView('valuation')} icon={Zap} label="Cek Harga AI" highlight />
          <NavButton active={currentView === 'map'} onClick={() => setView('map')} icon={MapIcon} label="Peta Pintar" />
          <NavButton active={currentView === 'profile'} onClick={() => setView('profile')} icon={Info} label="Tentang" />
        </nav>

        {/* ACTION BUTTONS */}
        {/* <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('signin')}
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <User size={18} /> Masuk
          </button>
           <button 
            onClick={() => setView('upload')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-200 hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> Pasang Iklan
          </button>
        </div> */}

      </div>
    </header>
  );
}

function NavButton({ active, onClick, icon: Icon, label, highlight }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300
        ${active 
          ? (highlight ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700') 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
      `}
    >
      <Icon size={16} className={active && highlight ? 'fill-indigo-700' : ''} />
      {label}
    </button>
  );
}

function PropertyCard({ property, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-100 transition duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
        {property.isVerified && (
           <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 z-10">
             <ShieldCheck size={12} /> Verified by TerraMind
           </div>
        )}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
          <CheckCircle size={12} /> {property.legality}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-100">
            {property.type}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg border border-gray-200" title="AI Sedang Maintenance">
            <Cpu size={14} /> AI Ready
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-emerald-700 transition">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
          <MapPin size={16} className="text-gray-400" /> {property.location}
        </div>

        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Harga Total</p>
            <p className="text-lg font-bold text-emerald-700">{formatRupiah(property.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Luas Tanah</p>
            <p className="text-base font-bold text-gray-700">{property.area} m²</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. MAIN VIEWS / PAGES ---

function Home({ properties, filters, setFilters, onItemClick, onTryAI }) {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-emerald-900 h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Background" />
           <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up cursor-pointer hover:bg-white/20 transition group" onClick={onTryAI}>
            <Zap size={16} className="text-yellow-400 fill-yellow-400 group-hover:scale-110 transition" />
            <span className="text-white text-xs font-bold tracking-wide uppercase">AI Property Valuation (Beta)</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Terra<span className="text-emerald-400">Mind</span>
          </h2>
          <p className="text-emerald-100 text-lg md:text-xl font-light mb-8">
            Solusi Cerdas Jual Beli Tanah Masa Depan. Temukan aset terbaik Anda hari ini.
          </p>
          
          {/* Smart Search Bar */}
          <div className="bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto backdrop-blur-sm bg-white/95">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-300 transition">
              <MapPin size={20} className="text-emerald-500" />
              <input 
                type="text" 
                placeholder="Cari lokasi (cth: Jonggol, Canggu)..." 
                className="w-full p-3 bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="w-full md:w-auto flex gap-2">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 md:px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition w-full md:w-auto shadow-lg shadow-emerald-200">
                <Search size={20} /> Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlight CTA */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative border border-white/10">
          <div className="absolute -right-20 -top-20 opacity-10">
            <Layers size={300} />
          </div>
          <div className="relative z-10 mb-4 md:mb-0">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <ShieldCheck className="text-yellow-300" /> Transaksi Tanah Aman & Terpercaya
            </h3>
            <p className="text-emerald-100 text-sm max-w-lg">
              Kami memverifikasi setiap listing untuk memastikan keamanan investasi Anda. Dapatkan data lengkap mulai dari lokasi hingga legalitas.
            </p>
          </div>
          <button 
            onClick={() => {}} 
            className="relative z-10 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg flex items-center gap-2 whitespace-nowrap transform cursor-default"
          >
            <CheckCircle size={18} className="fill-emerald-700 text-white" /> Listing Terverifikasi
          </button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Rekomendasi Terbaik</h3>
            <p className="text-gray-500 text-sm mt-1">Pilihan tanah premium untuk investasi Anda</p>
          </div>
          <div className="flex gap-2">
            {['Semua', 'SHM', 'AJB'].map((l) => (
               <button 
                 key={l}
                 onClick={() => setFilters({...filters, legality: l})}
                 className={`text-xs px-4 py-2 rounded-full border transition font-medium ${filters.legality === l ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600'}`}
               >
                 {l}
               </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} onClick={() => onItemClick(prop)} />
          ))}
        </div>
      </div>
    </>
  );
}

// --- MAINTENANCE VIEWS ---

function AIValuation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full mb-6">
        <Construction size={48} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Fitur Sedang Dalam Pemeliharaan</h1>
      <p className="text-gray-500 max-w-lg mx-auto text-lg mb-8">
        Kami sedang meningkatkan sistem kecerdasan buatan (AI) kami untuk memberikan hasil valuasi yang lebih akurat. Fitur ini akan segera kembali.
      </p>
      <div className="flex justify-center gap-4">
        <div className="px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 text-left">
           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
             <BrainCircuit size={20} />
           </div>
           <div>
             <p className="font-bold text-gray-900 text-sm">Upgrade Model AI</p>
             <p className="text-xs text-gray-500">Meningkatkan akurasi prediksi harga</p>
           </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 text-left">
           <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
             <Globe size={20} />
           </div>
           <div>
             <p className="font-bold text-gray-900 text-sm">Sinkronisasi Data</p>
             <p className="text-xs text-gray-500">Update data harga pasar terbaru</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- AUTH VIEWS (MOCKED FOR FRONTEND DEMO) ---

function SignIn({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // MOCK LOGIN MANUAL (Tanpa Database)
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi delay jaringan
    setTimeout(() => {
        if (email === 'demo@terramind.com' && password === '123456') {
            alert("Login Berhasil! (Mode Demo)");
            onNavigate('home');
        } else {
            // Untuk demo, kita izinkan login apapun atau beri hint
            alert("Login Berhasil! (Simulasi: Karena Database belum terhubung, semua input dianggap benar untuk demo).");
            onNavigate('home');
        }
        setLoading(false);
    }, 1500);
  };

  // GOOGLE LOGIN (Firebase Auth tetap jalan di frontend)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // API Call dimatikan dulu
      /*
      await fetch('http://localhost:5000/api/google-login', { ... });
      */

      alert(`Login Google Berhasil! Halo ${user.displayName}`);
      onNavigate('home');
    } catch (error) {
      console.error(error);
      alert("Gagal login dengan Google (Pastikan konfigurasi Firebase benar).");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Masuk ke TerraMind</h2>
          <p className="text-xs text-emerald-600 mt-2 bg-emerald-50 py-1 px-2 rounded-lg inline-block">
             Demo Account: demo@terramind.com / 123456
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg">
            {loading ? 'Memuat...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
           <div className="h-px bg-gray-200 flex-1"></div>
           <span className="text-xs text-gray-400 font-bold uppercase">Atau</span>
           <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <button onClick={handleGoogleLogin} type="button" className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl transition hover:bg-gray-50 flex items-center justify-center gap-2">
           <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
           Masuk dengan Gmail
        </button>

        <p className="text-center text-gray-500 text-sm mt-8">
          Belum punya akun? <button onClick={() => onNavigate('signup')} className="text-emerald-600 font-bold hover:underline">Daftar disini</button>
        </p>
      </div>
    </div>
  );
}

function SignUp({ onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // MOCK REGISTER (Tanpa Database)
  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi delay
    setTimeout(() => {
        // API Call dimatikan
        /*
        await fetch('http://localhost:5000/api/signup', ...);
        */
        
        alert(`Pendaftaran Berhasil! Silakan login menggunakan email: ${email}`);
        onNavigate('signin');
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
            <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg">
            {loading ? 'Mendaftar...' : 'Daftar Akun'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sudah punya akun? <button onClick={() => onNavigate('signin')} className="text-emerald-600 font-bold hover:underline">Masuk disini</button>
        </p>
      </div>
    </div>
  );
}

// --- PROPERTY DETAIL (WITH INTERACTIVE GALLERY) ---

function PropertyDetail({ property, onBack }) {
  const [activeImage, setActiveImage] = useState(property ? property.image : '');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (property) {
      setActiveImage(property.image);
    }
  }, [property]);

  if (!property) return null;

  // Menghitung Persentase Ketersediaan untuk Progress Bar
  const availabilityPercentage = property.totalUnits 
    ? Math.round((property.availableUnits / property.totalUnits) * 100) 
    : 0;

  // Menentukan warna progress bar (Hijau jika banyak, Merah jika sedikit)
  const progressColor = availabilityPercentage > 50 ? 'bg-emerald-500' : (availabilityPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500');
  const statusText = availabilityPercentage === 100 ? 'Baru Launching!' : (availabilityPercentage < 20 ? 'Segera Habis!' : 'Tersedia');

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-6 font-medium transition group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition">
            <ArrowLeft size={16} />
          </div>
          Kembali ke Pencarian
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI (GAMBAR & DESKRIPSI) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="w-full h-[450px] bg-gray-200 rounded-3xl overflow-hidden shadow-sm relative group">
              <img 
                src={activeImage} 
                alt={property.title} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
              />
              {property.isVerified && (
                 <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-2">
                   <ShieldCheck size={14} /> Dokumen Terverifikasi
                 </div>
              )}
              {/* Badge khusus jika Cluster/Ada Unit */}
              {property.isCluster && (
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-2">
                   <Layers size={14} /> Cluster Exclusive
                 </div>
              )}
            </div>

            {/* Mini Gallery */}
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {property.images.slice(0, 3).map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`
                      h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition relative
                      ${activeImage === img ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-transparent hover:border-emerald-300'}
                    `}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${idx+1}`} />
                  </div>
                ))}
                <div 
                  onClick={() => setIsGalleryOpen(true)}
                  className="h-24 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-emerald-50 hover:text-emerald-600 border-2 border-transparent hover:border-emerald-200 transition"
                >
                   <Camera size={24} />
                   <span className="text-xs font-bold mt-1">Lihat Semua ({property.images.length})</span>
                </div>
              </div>
            )}

            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-200">{property.legality}</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">{property.type}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{property.title}</h1>
              <p className="text-gray-500 flex items-center gap-2 text-lg">
                <MapPin size={20} className="text-gray-400" /> {property.location}
              </p>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" /> Deskripsi Properti
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{property.description}</p>
            </div>
          </div>

          {/* KOLOM KANAN (HARGA, STOK & KONTAK) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                <div className="mb-8 text-center md:text-left">
                  <p className="text-gray-500 text-sm mb-1 font-medium">Harga Penawaran</p>
                  <h2 className="text-4xl font-bold text-emerald-700 mb-1">{formatRupiah(property.price)}</h2>
                  <p className="text-sm text-gray-400 font-medium">{formatRupiah(property.pricePerMeter)} / m²</p>
                </div>

                {/* --- FITUR BARU: INFO KETERSEDIAAN UNIT --- */}
                {property.totalUnits && (
                  <div className="bg-gray-50 border border-emerald-100 rounded-2xl p-5 mb-6 shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                           <Activity size={16} /> Status Unit
                        </div>
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${availabilityPercentage === 100 ? 'bg-blue-500' : 'bg-orange-500'}`}>
                           {statusText}
                        </span>
                     </div>
                     
                     <div className="flex items-end gap-1 mb-2">
                        <span className="text-3xl font-bold text-gray-900">{property.availableUnits}</span>
                        <span className="text-sm text-gray-500 mb-1.5 font-medium">/ {property.totalUnits} unit tersedia</span>
                     </div>

                     {/* Progress Bar Visual */}
                     <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                           className={`${progressColor} h-3 rounded-full transition-all duration-1000 ease-out`} 
                           style={{ width: `${availabilityPercentage}%` }}
                        ></div>
                     </div>
                     <p className="text-xs text-gray-400 text-right">Update: Real-time</p>
                  </div>
                )}
                {/* ------------------------------------------- */}

                <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4 border border-gray-100">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-sm text-gray-500 flex items-center gap-2"><Expand size={16} className="text-indigo-500"/> Luas Tanah</span>
                      <span className="font-bold text-gray-900 text-lg">{property.area} m²</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-sm text-gray-500 flex items-center gap-2"><FileBadge size={16} className="text-indigo-500"/> Legalitas</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{property.legality}</span>
                  </div>
                  {/* Tampilkan Tipe Unit jika ada */}
                  {property.isCluster && (
                     <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                       <span className="text-sm text-gray-500 flex items-center gap-2"><Construction size={16} className="text-indigo-500"/> Tipe Unit</span>
                       <span className="font-bold text-gray-900">Commercial Lot</span>
                     </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                    {property.seller.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{property.seller}</p>
                    <p className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                      <CheckCircle size={12} /> Verified Agent
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => window.open(`https://wa.me/${property.phone}`, '_blank')}
                  className="w-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition hover:bg-emerald-50"
                >
                  <Phone size={20} /> Chat via WhatsApp
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL GALERI FULLSCREEN */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col animate-fade-in">
          <div className="flex justify-between items-center p-4 md:p-6 text-white">
            <h3 className="font-bold text-lg">{property.title} - Galeri Foto</h3>
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <div className="w-6 h-6 flex items-center justify-center font-bold">✕</div>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {property.images.map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img 
                    src={img} 
                    alt={`Gallery ${idx}`} 
                    className="w-full h-auto object-cover hover:scale-105 transition duration-500" 
                  />
                  <div className="bg-gray-900/50 p-2 text-center text-white text-xs">
                    Foto {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Upload({ onSubmit, onCancel }) {
  // MOCK UPLOAD (Tanpa Database)
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi Upload
    setTimeout(() => {
        // API Call dimatikan
        /*
        const data = new FormData(); ... fetch(...)
        */

        alert("Sukses! Iklan berhasil diunggah. (Data ini hanya simulasi dan akan hilang saat refresh)");
        onSubmit(e);
        setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Pasang Iklan Tanah</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Iklan</label>
            <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="Contoh: Tanah Kavling Murah" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Harga Total</label>
               <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Luas (m²)</label>
               <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" required />
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi</label>
            <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="Kecamatan, Kota" required />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
             <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 h-32"></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto Utama (PNG/JPG)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/png, image/jpeg" className="absolute inset-0 opacity-0 cursor-pointer" required />
                <p className="text-gray-500 text-sm">{file ? file.name : "Klik untuk upload gambar"}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
             <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Batal</button>
             <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg">
                {loading ? 'Mengupload...' : 'Upload Iklan'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MapView({ properties, onItemClick }) {
    return (
      <div className="h-[calc(100vh-64px)] w-full bg-blue-50 relative overflow-hidden flex flex-col items-center justify-center animate-fade-in">
         <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center shadow-xl max-w-md mx-4 relative z-10">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Peta Pintar TerraMind</h3>
            <p className="text-gray-500 mb-6">Fitur peta interaktif dengan layer AI (zonasi, harga pasar) akan segera hadir dalam update berikutnya.</p>
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition">
              Lihat Demo Marker
            </button>
         </div>
         
         <div 
           className="absolute inset-0 -z-0 opacity-10" 
           style={{
             backgroundImage: 'radial-gradient(#059669 2px, transparent 2px)', 
             backgroundSize: '30px 30px'
           }}
         ></div>
      </div>
    );
}

function Profile({ onCtaClick }) {
  // ... (Bagian Profile tidak berubah, gunakan kode lama)
  // Untuk menghemat ruang, saya tidak menulis ulang Profile karena tidak ada API call di sana.
  // Silakan gunakan kode Profile dari jawaban sebelumnya.
  return (
    <div className="animate-fade-in">
      <div className="bg-gray-900 text-white py-20 px-4 text-center">
         <h1 className="text-4xl font-bold mb-4">Tentang TerraMind</h1>
         <p className="text-gray-400">Platform Properti Masa Depan</p>
         <button onClick={onCtaClick} className="mt-8 bg-emerald-600 px-6 py-2 rounded-full">Kembali ke Home</button>
      </div>
    </div>
  );
}

// --- 4. MAIN APP CONTROLLER ---

export default function App() {
  const [view, setView] = useState('home'); 
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [selectedProp, setSelectedProp] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    type: 'Semua',
    legality: 'Semua'
  });

  const filteredProperties = properties.filter(prop => {
    const matchSearch = prop.location.toLowerCase().includes(filters.search.toLowerCase()) || 
                        prop.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchType = filters.type === 'Semua' || prop.type === filters.type;
    const matchLegal = filters.legality === 'Semua' || prop.legality === filters.legality;
    return matchSearch && matchType && matchLegal;
  });

  const handlePropertyClick = (prop) => {
    setSelectedProp(prop);
    setView('details');
    window.scrollTo(0, 0);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    // Di sini tidak ada fetch API lagi
    setView('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar currentView={view} setView={setView} />
      <main className="pb-20">
        {view === 'home' && (
          <Home 
            properties={filteredProperties} 
            filters={filters} 
            setFilters={setFilters} 
            onItemClick={handlePropertyClick} 
            onTryAI={() => setView('valuation')}
          />
        )}
        {view === 'details' && selectedProp && (
          <PropertyDetail 
            property={selectedProp} 
            onBack={() => setView('home')} 
          />
        )}
        {view === 'upload' && (
          <Upload 
            onSubmit={handleUploadSubmit} 
            onCancel={() => setView('home')} 
          />
        )}
        {view === 'map' && (
          <MapView 
            properties={properties} 
            onItemClick={handlePropertyClick}
          />
        )}
        {view === 'valuation' && (
          <AIValuation />
        )}
        {view === 'profile' && (
          <Profile 
            onCtaClick={() => setView('home')} 
          />
        )}
        {view === 'signin' && (
          <SignIn onNavigate={setView} />
        )}
        {view === 'signup' && (
          <SignUp onNavigate={setView} />
        )}
      </main>
    </div>
  );
}