import React, { useState, useEffect, useRef } from 'react';

// --- INITIAL MOCK DATA ---
const DEFAULT_USERS = [
  {
    id: "U001",
    email: "admin@sales.com",
    password: "admin123",
    name: "Hendra Wijaya",
    role: "admin",
    position: "HR & Sales Manager",
    division: "Pusat & Operasional",
    phone: "081234567890",
    joinDate: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "U002",
    email: "sales@sales.com",
    password: "sales123",
    name: "Budi Pratama",
    role: "staff",
    position: "Senior Sales Representative",
    division: "Wilayah DKI Jakarta",
    phone: "087788990011",
    joinDate: "2024-02-10",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "U003",
    email: "ani@sales.com",
    password: "sales123",
    name: "Ani Lestari",
    role: "staff",
    position: "Sales Representative",
    division: "Wilayah Jawa Barat",
    phone: "085522334455",
    joinDate: "2024-03-01",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  }
];

const DEFAULT_TASKS = [
  {
    id: "T-101",
    title: "Kunjungan Klien PT Maju Mundur",
    description: "Presentasikan katalog produk terbaru dan diskon kuartal kedua.",
    assignedTo: "U002",
    assignedName: "Budi Pratama",
    deadline: "2026-06-15",
    status: "Sedang Dikerjakan", // Belum Mulai, Sedang Dikerjakan, Selesai
    priority: "Tinggi"
  },
  {
    id: "T-102",
    title: "Follow-up Prospek Restoran Padang Sederhana",
    description: "Hubungi manager operasional untuk penawaran mesin POS.",
    assignedTo: "U003",
    assignedName: "Ani Lestari",
    deadline: "2026-06-18",
    status: "Belum Mulai",
    priority: "Sedang"
  },
  {
    id: "T-103",
    title: "Penandatanganan Kontrak Minimarket Berkah",
    description: "Bawa berkas kontrak rangkap dua dan pastikan sudah ditandatangani di atas materai.",
    assignedTo: "U002",
    assignedName: "Budi Pratama",
    deadline: "2026-06-12",
    status: "Selesai",
    priority: "Tinggi"
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "A-01",
    title: "Target Sales Kuartal 2 - Fokus Ritel",
    content: "Diberitahukan kepada seluruh tim sales lapangan bahwa fokus utama bulan ini adalah penetrasi ke segmen ritel menengah. Bonus komisi tambahan 5% untuk pencapaian di atas target.",
    date: "2026-06-10",
    author: "Hendra Wijaya"
  },
  {
    id: "A-02",
    title: "Pembaruan SOP Absensi Kehadiran",
    content: "Setiap melakukan absen masuk dan keluar, pastikan foto selfie menunjukkan wajah dengan jelas dan GPS aktif di ponsel masing-masing.",
    date: "2026-06-08",
    author: "HRD Departement"
  }
];

const DEFAULT_ATTENDANCES = [
  {
    id: "ATT-01",
    userId: "U002",
    userName: "Budi Pratama",
    type: "Masuk",
    time: "2026-06-13 07:45",
    location: { lat: -6.1751, lng: 106.8650, address: "Monas, Jakarta Pusat" },
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    notes: "Kunjungan pagi pertama ke area perkantoran."
  }
];

export default function App() {
  // --- STATE PERSISTENCE ---
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('sales_users');
    return local ? JSON.parse(local) : DEFAULT_USERS;
  });
  
  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('sales_tasks');
    return local ? JSON.parse(local) : DEFAULT_TASKS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const local = localStorage.getItem('sales_announcements');
    return local ? JSON.parse(local) : DEFAULT_ANNOUNCEMENTS;
  });

  const [attendance, setAttendance] = useState(() => {
    const local = localStorage.getItem('sales_attendance');
    return local ? JSON.parse(local) : DEFAULT_ATTENDANCES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem('sales_current_user');
    return local ? JSON.parse(local) : null;
  });

  // --- UI STATES ---
  const [authTab, setAuthTab] = useState('login'); // login, register
  const [roleSelection, setRoleSelection] = useState('staff'); // staff, admin
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, absensi, tugas, hris, pengumuman
  const [notification, setNotification] = useState(null);

  // Form states for login/register
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('staff');
  const [regDiv, setRegDiv] = useState('Wilayah DKI Jakarta');
  const [regPos, setRegPos] = useState('Sales Representative');
  const [regPhone, setRegPhone] = useState('');

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('sales_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sales_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sales_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('sales_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sales_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sales_current_user');
    }
  }, [currentUser]);

  // Helper notification function
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // --- AUTH ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setActiveTab('dashboard');
      triggerNotification(`Selamat datang kembali, ${user.name}!`, 'success');
    } else {
      triggerNotification('Email atau Password salah!', 'error');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regPhone) {
      triggerNotification('Semua kolom wajib diisi!', 'error');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === regEmail.toLowerCase())) {
      triggerNotification('Email sudah terdaftar!', 'error');
      return;
    }

    const newUser = {
      id: "U" + Date.now().toString().slice(-4),
      email: regEmail,
      password: regPassword,
      name: regName,
      role: regRole,
      position: regRole === 'admin' ? 'Co-Administrator' : regPos,
      division: regDiv,
      phone: regPhone,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&q=80&w=200`
    };

    setUsers([...users, newUser]);
    setAuthTab('login');
    setLoginEmail(regEmail);
    setLoginPassword('');
    triggerNotification('Pendaftaran berhasil! Silakan login.', 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    triggerNotification('Anda telah keluar dari aplikasi.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-xl shadow-xl transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-700 rounded-lg">
              {/* Logo Icon SVG */}
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SALESTRACK PRO</h1>
              <p className="text-xs text-indigo-200">Sistem Monitoring & Absensi Sales Lapangan</p>
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <div className="font-semibold text-sm">{currentUser.name}</div>
                <div className="text-xs text-emerald-400 font-medium capitalize">{currentUser.role === 'admin' ? '🛡️ Admin HRD' : '💼 Sales Field'}</div>
              </div>
              <img src={currentUser.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover" />
              <button 
                onClick={handleLogout}
                className="p-2 bg-indigo-800 hover:bg-rose-700 rounded-lg transition-all"
                title="Log Keluar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <span className="text-xs bg-indigo-800 text-indigo-200 px-3 py-1.5 rounded-full border border-indigo-700">Aplikasi Lapangan Aktif</span>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 flex flex-col md:flex-row gap-6">
        
        {!currentUser ? (
          /* AUTHENTICATION VIEW */
          <div className="w-full max-w-md mx-auto my-auto py-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              
              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
                <button
                  className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all ${
                    authTab === 'login' ? 'bg-white text-indigo-900 shadow' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => setAuthTab('login')}
                >
                  Masuk Akun
                </button>
                <button
                  className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all ${
                    authTab === 'register' ? 'bg-white text-indigo-900 shadow' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => setAuthTab('register')}
                >
                  Pendaftaran Baru
                </button>
              </div>

              {authTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 text-center">Login Portal</h3>
                  <p className="text-xs text-slate-400 text-center">Akses kontrol operasional & monitoring sales</p>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Karyawan</label>
                    <input 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="contoh: sales@sales.com" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Masuk ke Dashboard</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 mt-6 space-y-1">
                    <p className="font-bold">Akun Demo Cepat:</p>
                    <p>💼 <strong>Staff Sales:</strong> sales@sales.com / sales123</p>
                    <p>🛡️ <strong>Admin HRD:</strong> admin@sales.com / admin123</p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 text-center">Buat Akun Baru</h3>
                  <p className="text-xs text-slate-400 text-center">Isi biodata untuk pengajuan akses ke admin</p>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={regName} 
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nama lengkap sesuai KTP" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pilih Peran Akses</label>
                    <select 
                      value={regRole} 
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                    >
                      <option value="staff">Staff Sales Lapangan</option>
                      <option value="admin">Administrator / HRD</option>
                    </select>
                  </div>

                  {regRole === 'staff' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Jabatan</label>
                        <select 
                          value={regPos} 
                          onChange={(e) => setRegPos(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                        >
                          <option value="Sales Representative">Sales Representative</option>
                          <option value="Senior Sales Executive">Senior Sales Executive</option>
                          <option value="Canvasser Lapangan">Canvasser Lapangan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Divisi Penugasan</label>
                        <select 
                          value={regDiv} 
                          onChange={(e) => setRegDiv(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                        >
                          <option value="Wilayah DKI Jakarta">DKI Jakarta</option>
                          <option value="Wilayah Jawa Barat">Jawa Barat</option>
                          <option value="Wilayah Jawa Tengah">Jawa Tengah</option>
                          <option value="Wilayah Jawa Timur">Jawa Timur</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">No. WhatsApp/HP</label>
                    <input 
                      type="tel" 
                      value={regPhone} 
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="contoh: 08123456789" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={regEmail} 
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@perusahaan.com" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password Baru</label>
                    <input 
                      type="password" 
                      value={regPassword} 
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Buat sandi minimal 6 karakter" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                  >
                    Kirim & Daftarkan Akun
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* MAIN LOGGED IN APP INTERFACE */
          <div className="w-full flex flex-col md:flex-row gap-6">
            
            {/* NAVIGATION SIDEBAR (for Tablet & Desktop) */}
            <aside className="w-full md:w-64 flex-shrink-0 flex md:flex-col gap-2 md:bg-white md:p-4 rounded-2xl md:shadow-md border border-transparent md:border-slate-100 overflow-x-auto no-scrollbar py-1">
              
              <div className="hidden md:block pb-4 mb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Akses Pengguna</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-3 h-3 rounded-full ${currentUser.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <span className="text-sm font-semibold text-slate-700 capitalize">{currentUser.role === 'admin' ? 'Mode Administrator' : 'Mode Sales Staff'}</span>
                </div>
              </div>

              {/* NAV ITEMS */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:w-full ${
                  activeTab === 'dashboard' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/15' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('absensi')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:w-full ${
                  activeTab === 'absensi' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/15' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{currentUser.role === 'admin' ? 'Data Kehadiran' : 'Kamera & Absensi'}</span>
              </button>

              <button
                onClick={() => setActiveTab('tugas')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:w-full ${
                  activeTab === 'tugas' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/15' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Manajemen Tugas</span>
              </button>

              <button
                onClick={() => setActiveTab('hris')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:w-full ${
                  activeTab === 'hris' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/15' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Profil & Data HRIS</span>
              </button>

              <button
                onClick={() => setActiveTab('pengumuman')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:w-full ${
                  activeTab === 'pengumuman' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/15' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Pengumuman</span>
              </button>
            </aside>

            {/* MAIN APP VIEWPORT */}
            <div className="flex-grow min-w-0">
              
              {/* VIEW 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* HERO HEADER */}
                  <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-6">
                      <svg className="w-72 h-72" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold">Halo, {currentUser.name}!</h2>
                      <p className="text-indigo-200 text-sm mt-1">Hari ini adalah {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="bg-indigo-700/60 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500 text-indigo-100">Divisi: {currentUser.division}</span>
                        <span className="bg-emerald-600/60 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500 text-emerald-100">Peran: {currentUser.role === 'admin' ? 'Administrator' : 'Sales Lapangan'}</span>
                      </div>
                    </div>
                  </div>

                  {/* STATS SECTION */}
                  {currentUser.role === 'admin' ? (
                    /* ADMIN STATS */
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Sales Staff</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-extrabold text-slate-800">{users.filter(u => u.role === 'staff').length}</span>
                          <span className="text-xs text-indigo-600 font-bold">Orang</span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Absen Hari Ini</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-extrabold text-indigo-900">{attendance.filter(a => a.time.includes(new Date().toISOString().split('T')[0])).length}</span>
                          <span className="text-xs text-slate-500 font-medium">dari {users.filter(u => u.role === 'staff').length}</span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Tugas Berjalan</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-extrabold text-amber-600">{tasks.filter(t => t.status !== 'Selesai').length}</span>
                          <span className="text-xs text-slate-500 font-medium">aktif</span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Tugas Selesai</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-extrabold text-emerald-600">{tasks.filter(t => t.status === 'Selesai').length}</span>
                          <span className="text-xs text-emerald-500 font-bold">selesai</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* STAFF STATS */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Attendance Quick Indicator */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Absensi Hari Ini</h4>
                        {attendance.some(a => a.userId === currentUser.id && a.time.includes(new Date().toISOString().split('T')[0]) && a.type === 'Masuk') ? (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-emerald-600">Sudah Absen Masuk</p>
                              <p className="text-xs text-slate-400">Jam: {attendance.find(a => a.userId === currentUser.id && a.time.includes(new Date().toISOString().split('T')[0]) && a.type === 'Masuk')?.time.split(' ')[1]}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 animate-pulse">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-rose-500">Belum Absen Masuk</p>
                              <button onClick={() => setActiveTab('absensi')} className="text-xs text-indigo-600 underline font-semibold">Buka absensi sekarang &rarr;</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Your Pending Tasks */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tugas Anda yang Aktif</h4>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
                            {tasks.filter(t => t.assignedTo === currentUser.id && t.status !== 'Selesai').length}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">Tugas Masih Berjalan</p>
                            <p className="text-xs text-slate-400">Silakan selesaikan target sebelum deadline.</p>
                          </div>
                        </div>
                      </div>

                      {/* Total Task Completed */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Sukses Selesai</h4>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                            {tasks.filter(t => t.assignedTo === currentUser.id && t.status === 'Selesai').length}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">Tugas Berhasil Diselesaikan</p>
                            <p className="text-xs text-emerald-600 font-semibold">Bagus! Pertahankan pencapaian.</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* MAIN DASHBOARD CONTENT AREA */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT 2 COLS: RECENT ACTIVITIES/LOGS (Admin) or TASKS (Staff) */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {currentUser.role === 'admin' ? (
                        /* ADMIN VIEW: REAL-TIME SALES ATTENDANCE FEED */
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-slate-800">Log Aktivitas Kehadiran Sales</h3>
                              <p className="text-xs text-slate-400">Kehadiran & Lokasi realtime yang dikirim oleh sales di lapangan</p>
                            </div>
                            <button onClick={() => setActiveTab('absensi')} className="text-xs bg-indigo-50 text-indigo-700 font-semibold py-1.5 px-3 rounded-lg hover:bg-indigo-100 transition-all">Lihat Semua</button>
                          </div>

                          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-1">
                            {attendance.length === 0 ? (
                              <p className="text-sm text-slate-400 text-center py-8">Belum ada aktivitas absensi hari ini.</p>
                            ) : (
                              attendance.map((log) => (
                                <div key={log.id} className="py-4 flex gap-4 items-start">
                                  <img src={log.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80"} alt={log.userName} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                                  <div className="flex-grow">
                                    <div className="flex justify-between">
                                      <span className="font-bold text-sm text-slate-800">{log.userName}</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.type === 'Masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{log.type === 'Absen ' + log.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                      <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span>{log.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2 font-medium">💬 &ldquo;{log.notes}&rdquo;</p>
                                    
                                    {/* Mock GPS coordinates block */}
                                    <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold mt-1">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <span>GPS: {log.location.lat.toFixed(5)}, {log.location.lng.toFixed(5)} ({log.location.address})</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ) : (
                        /* STAFF VIEW: TODAY'S ASSIGNED TASKS */
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-slate-800">Tugas Lapangan Terkini</h3>
                              <p className="text-xs text-slate-400">Pastikan untuk melapor status tugas secara berkala</p>
                            </div>
                            <button onClick={() => setActiveTab('tugas')} className="text-xs bg-indigo-50 text-indigo-700 font-semibold py-1.5 px-3 rounded-lg hover:bg-indigo-100 transition-all">Papan Tugas &rarr;</button>
                          </div>

                          <div className="space-y-4">
                            {tasks.filter(t => t.assignedTo === currentUser.id).length === 0 ? (
                              <p className="text-sm text-slate-400 text-center py-8">Anda tidak memiliki tugas saat ini.</p>
                            ) : (
                              tasks.filter(t => t.assignedTo === currentUser.id).slice(0, 3).map((task) => (
                                <div key={task.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        task.priority === 'Tinggi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                      }`}>{task.priority}</span>
                                      <span className="text-xs text-slate-400 font-semibold">{task.id}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mt-1">{task.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                                    <p className="text-xs text-indigo-900 font-bold mt-2">⏱️ Batas Waktu: {task.deadline}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                      task.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                                      task.status === 'Sedang Dikerjakan' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                                    }`}>{task.status}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* RIGHT 1 COL: ANNOUNCEMENTS PREVIEW */}
                    <div className="bg-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                          <h3 className="font-bold text-base text-indigo-100">Papan Informasi</h3>
                        </div>

                        <div className="space-y-4">
                          {announcements.slice(0, 2).map((ann) => (
                            <div key={ann.id} className="border-b border-indigo-900 pb-3 last:border-0">
                              <h4 className="text-sm font-bold text-emerald-300 hover:underline cursor-pointer" onClick={() => setActiveTab('pengumuman')}>{ann.title}</h4>
                              <p className="text-xs text-indigo-200 line-clamp-3 mt-1">{ann.content}</p>
                              <p className="text-[10px] text-indigo-400 mt-1.5">{ann.date} • Oleh {ann.author}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveTab('pengumuman')}
                        className="mt-6 w-full text-center text-xs bg-indigo-900 hover:bg-indigo-850 text-white font-bold py-2 px-4 rounded-xl transition-all"
                      >
                        Lihat Semua Pengumuman
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* VIEW 2: ABSENSI (Kamera HP & GPS Geolocation) */}
              {activeTab === 'absensi' && (
                <div className="space-y-6">
                  
                  {currentUser.role === 'admin' ? (
                    /* ADMIN KEHADIRAN VIEW */
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Rekap Presensi Karyawan</h3>
                          <p className="text-xs text-slate-400">Berikut adalah data absensi masuk dan keluar sales dilapangan</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="p-3 text-xs font-bold uppercase text-slate-400">Sales</th>
                              <th className="p-3 text-xs font-bold uppercase text-slate-400">Jenis</th>
                              <th className="p-3 text-xs font-bold uppercase text-slate-400">Waktu</th>
                              <th className="p-3 text-xs font-bold uppercase text-slate-400">Foto Selfie</th>
                              <th className="p-3 text-xs font-bold uppercase text-slate-400">Lokasi GPS</th>
                              <th className="p-3 text-xs font-bold uppercase text-slate-400">Aktivitas / Keterangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            {attendance.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center py-8 text-slate-400">Belum ada data kehadiran terekam.</td>
                              </tr>
                            ) : (
                              attendance.map((att) => (
                                <tr key={att.id} className="hover:bg-slate-50/50">
                                  <td className="p-3">
                                    <div className="font-bold text-slate-800">{att.userName}</div>
                                    <div className="text-xs text-slate-400">ID: {att.userId}</div>
                                  </td>
                                  <td className="p-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                      att.type === 'Masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>Absen {att.type}</span>
                                  </td>
                                  <td className="p-3 text-slate-600 font-medium">{att.time}</td>
                                  <td className="p-3">
                                    <img src={att.photo} alt="Presensi Selfie" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                                  </td>
                                  <td className="p-3">
                                    <div className="font-semibold text-slate-700 text-xs">{att.location.address}</div>
                                    <div className="text-[10px] text-indigo-600">{att.location.lat.toFixed(6)}, {att.location.lng.toFixed(6)}</div>
                                  </td>
                                  <td className="p-3 max-w-[200px] truncate text-slate-600 italic font-medium" title={att.notes}>
                                    &ldquo;{att.notes}&rdquo;
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* STAFF ABSENSI: CAMERA PORTAL & GEOLOCATION (HP OPTIMIZED) */
                    <StaffAbsensiForm 
                      currentUser={currentUser} 
                      attendance={attendance} 
                      setAttendance={setAttendance} 
                      triggerNotification={triggerNotification} 
                    />
                  )}

                </div>
              )}

              {/* VIEW 3: MANAJEMEN TUGAS */}
              {activeTab === 'tugas' && (
                <div className="space-y-6">
                  
                  {/* Task Board Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Papan Tugas Lapangan</h3>
                      <p className="text-xs text-slate-400">Kelola dan monitor tugas kunjungan sales serta pembaruan progres</p>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => {
                          const modal = document.getElementById('addTaskModal');
                          if (modal) modal.classList.toggle('hidden');
                        }}
                        className="bg-indigo-900 hover:bg-indigo-850 text-white font-bold py-2.5 px-4 rounded-xl shadow text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Buat Tugas Baru</span>
                      </button>
                    )}
                  </div>

                  {/* KANBAN BOARD */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* COLUMN 1: BELUM MULAI */}
                    <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200/60 flex flex-col min-h-[400px]">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm text-slate-700">Belum Mulai</span>
                        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === 'Belum Mulai').length}</span>
                      </div>
                      
                      <div className="space-y-3 flex-grow">
                        {tasks.filter(t => t.status === 'Belum Mulai').map(task => (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            currentUser={currentUser} 
                            tasks={tasks} 
                            setTasks={setTasks} 
                            triggerNotification={triggerNotification}
                          />
                        ))}
                      </div>
                    </div>

                    {/* COLUMN 2: SEDANG BERJALAN */}
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col min-h-[400px]">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm text-indigo-900">Sedang Dikerjakan</span>
                        <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === 'Sedang Dikerjakan').length}</span>
                      </div>

                      <div className="space-y-3 flex-grow">
                        {tasks.filter(t => t.status === 'Sedang Dikerjakan').map(task => (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            currentUser={currentUser} 
                            tasks={tasks} 
                            setTasks={setTasks} 
                            triggerNotification={triggerNotification}
                          />
                        ))}
                      </div>
                    </div>

                    {/* COLUMN 3: SELESAI */}
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100/60 flex flex-col min-h-[400px]">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm text-emerald-900">Selesai</span>
                        <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === 'Selesai').length}</span>
                      </div>

                      <div className="space-y-3 flex-grow">
                        {tasks.filter(t => t.status === 'Selesai').map(task => (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            currentUser={currentUser} 
                            tasks={tasks} 
                            setTasks={setTasks} 
                            triggerNotification={triggerNotification}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* MODAL: ADD TASK (ADMIN ONLY) */}
                  {currentUser.role === 'admin' && (
                    <AddTaskModal 
                      users={users} 
                      tasks={tasks} 
                      setTasks={setTasks} 
                      triggerNotification={triggerNotification} 
                    />
                  )}

                </div>
              )}

              {/* VIEW 4: PROFIL & DATA HRIS */}
              {activeTab === 'hris' && (
                <div className="space-y-6">
                  
                  {/* HRIS HEADER */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Portal Kepegawaian (HRIS)</h3>
                    <p className="text-xs text-slate-400">Informasi profil mandiri, divisi penempatan, serta daftar rekan kerja</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: LOGGED IN USER DETAILED PROFILE */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
                      <div className="relative">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-indigo-900 object-cover" />
                        <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                          currentUser.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-500'
                        }`}></span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-800 mt-4">{currentUser.name}</h4>
                      <p className="text-xs text-slate-400 capitalize">{currentUser.position} • {currentUser.division}</p>

                      <div className="w-full border-t border-slate-100 mt-6 pt-4 space-y-3 text-left">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">ID KARYAWAN</span>
                          <span className="text-sm font-semibold text-slate-700">{currentUser.id}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">EMAIL PERUSAHAAN</span>
                          <span className="text-sm font-semibold text-slate-700">{currentUser.email}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">NOMOR HP/WHATSAPP</span>
                          <span className="text-sm font-semibold text-slate-700">{currentUser.phone}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">TANGGAL BERGABUNG</span>
                          <span className="text-sm font-semibold text-slate-700">{currentUser.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: COLLEAGUE DIRECTORY */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-800 text-base mb-4">Direktori Rekan Kerja</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {users.map(colleague => (
                          <div key={colleague.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-center">
                            <img src={colleague.avatar} alt={colleague.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{colleague.name}</h4>
                              <p className="text-xs text-slate-500">{colleague.position}</p>
                              <p className="text-[10px] text-indigo-700 font-semibold">{colleague.division}</p>
                              <a href={`https://wa.me/${colleague.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1 hover:underline">
                                💬 WhatsApp: {colleague.phone}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* VIEW 5: PENGUMUMAN */}
              {activeTab === 'pengumuman' && (
                <div className="space-y-6">
                  
                  {/* Announcement Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Papan Pengumuman</h3>
                      <p className="text-xs text-slate-400">Pemberitahuan, SOP, dan info terbaru dari Manajemen Perusahaan</p>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => {
                          const modal = document.getElementById('addAnnounceModal');
                          if (modal) modal.classList.toggle('hidden');
                        }}
                        className="bg-indigo-900 hover:bg-indigo-850 text-white font-bold py-2.5 px-4 rounded-xl shadow text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <span>Buat Pengumuman</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{ann.date}</span>
                            <h4 className="font-bold text-slate-800 text-lg mt-1">{ann.title}</h4>
                          </div>
                          {currentUser.role === 'admin' && (
                            <button 
                              onClick={() => {
                                setAnnouncements(announcements.filter(a => a.id !== ann.id));
                                triggerNotification('Pengumuman berhasil dihapus.', 'success');
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-all p-1"
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-4 leading-relaxed whitespace-pre-line">{ann.content}</p>
                        <div className="border-t border-slate-50 mt-4 pt-3 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Diposting oleh: <strong className="text-slate-600">{ann.author}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* MODAL: ADD ANNOUNCEMENT (ADMIN ONLY) */}
                  {currentUser.role === 'admin' && (
                    <AddAnnounceModal 
                      announcements={announcements} 
                      setAnnouncements={setAnnouncements} 
                      currentUser={currentUser}
                      triggerNotification={triggerNotification} 
                    />
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 border-t border-slate-850 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs">&copy; 2026 SalesTrack Pro - Sistem Operasional Tim Sales Lapangan.</p>
          <p className="text-[10px] text-slate-500 mt-1">Dibuat menggunakan teknologi web modern, Geolocation Tracking, & HTML5 Camera.</p>
        </div>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENT: STAFF ABSENSI FORM WITH REAL CAMERA & GPS ---
function StaffAbsensiForm({ currentUser, attendance, setAttendance, triggerNotification }) {
  const [absentType, setAbsentType] = useState('Masuk');
  const [notes, setNotes] = useState('');
  
  // Camera-specific states
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(null);
  
  // Geolocation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize and request GPS on load
  useEffect(() => {
    fetchGPSCoordinates();
  }, []);

  const fetchGPSCoordinates = () => {
    if (!navigator.geolocation) {
      triggerNotification("Browser Anda tidak mendukung GPS Geolocation", "error");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock a real address using high accuracy lat/lng for visual mock
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocationData({
          lat,
          lng,
          address: `Koordinat GPS Akurat (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error(error);
        // Fallback mockup location when permission is denied or fails in iframe
        setLocationData({
          lat: -6.2088 + (Math.random() - 0.5) * 0.01,
          lng: 106.8456 + (Math.random() - 0.5) * 0.01,
          address: "Simulasi Lokasi Lapangan (Gedung Pusat Bisnis, Jakarta)"
        });
        setGpsLoading(false);
        triggerNotification("GPS Asli ditolak/gagal. Menggunakan fallback simulasi lokasi sales.", "error");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Start Video Stream
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setPhotoCaptured(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera failed: ", err);
      setHasCamera(false);
      setCameraActive(false);
      // Fallback: Simulate camera
      const randomAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
      ];
      setPhotoCaptured(randomAvatars[Math.floor(Math.random() * randomAvatars.length)]);
      triggerNotification("Kamera perangkat diblokir/tidak ada. Simulasi foto selfie diaktifkan.", "error");
    }
  };

  // Capture Photo from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      const dataUrl = canvas.toDataURL('image/png');
      setPhotoCaptured(dataUrl);
      
      // Stop stream
      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      setCameraActive(false);
    }
  };

  // Handle Absen Submit
  const handleAbsenSubmit = (e) => {
    e.preventDefault();
    
    if (!notes.trim()) {
      triggerNotification("Kolom keterangan/aktivitas wajib diisi!", "error");
      return;
    }

    if (!photoCaptured) {
      triggerNotification("Anda wajib mengambil foto selfie untuk verifikasi!", "error");
      return;
    }

    if (!locationData) {
      triggerNotification("Menunggu koordinat lokasi GPS...", "error");
      return;
    }

    const newLog = {
      id: "ATT-" + Date.now().toString().slice(-4),
      userId: currentUser.id,
      userName: currentUser.name,
      type: absentType,
      time: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      location: locationData,
      photo: photoCaptured,
      notes: notes
    };

    setAttendance([newLog, ...attendance]);
    setNotes('');
    setPhotoCaptured(null);
    triggerNotification(`Absen ${absentType} berhasil disimpan!`, 'success');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-xl font-bold text-slate-800">Kamera & Geolocation Lapangan</h3>
        <p className="text-xs text-slate-400">Lakukan absen kehadiran harian dengan mengaktifkan kamera depan dan GPS ponsel Anda</p>
      </div>

      <form onSubmit={handleAbsenSubmit} className="space-y-6">
        
        {/* Toggle Absent Type */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`py-3 rounded-xl font-bold text-sm transition-all text-center border ${
              absentType === 'Masuk' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            onClick={() => setAbsentType('Masuk')}
          >
            🌅 Absen Masuk Kerja
          </button>
          <button
            type="button"
            className={`py-3 rounded-xl font-bold text-sm transition-all text-center border ${
              absentType === 'Keluar' ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            onClick={() => setAbsentType('Keluar')}
          >
            🌇 Absen Pulang Kerja
          </button>
        </div>

        {/* GPS Location Area */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Kehadiran (GPS)</p>
              {gpsLoading ? (
                <span className="text-xs text-indigo-600 animate-pulse font-semibold">Mengambil lokasi satelit...</span>
              ) : (
                <p className="text-sm font-bold text-indigo-900">{locationData?.address || "Gagal mendapatkan lokasi"}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={fetchGPSCoordinates}
            className="text-xs bg-white text-indigo-800 border border-slate-200 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            🔄 Refresh GPS
          </button>
        </div>

        {/* CAMERA FIELD */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Verifikasi Kamera Selfie (Wajib)</label>
          
          <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center max-h-[300px]">
            {cameraActive && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            )}

            {!cameraActive && photoCaptured && (
              <img 
                src={photoCaptured} 
                alt="Selfie Terambil" 
                className="w-full h-full object-cover"
              />
            )}

            {!cameraActive && !photoCaptured && (
              <div className="text-center p-6">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs text-slate-500">Kamera belum aktif. Klik tombol dibawah.</p>
              </div>
            )}

            {/* Action overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg"
                >
                  {photoCaptured ? "Ambil Ulang Foto" : "Aktifkan Kamera Depan"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg"
                >
                  📸 Tangkap Selfie
                </button>
              )}
            </div>
          </div>
          
          {/* Hidden Canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* NOTES (MANDATORY FIELD) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Keterangan Aktivitas Saat Ini <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis detail aktivitas lapangan Anda, contoh: Memulai kunjungan harian area Mangga Dua, bertemu PIC PT Abadi Jaya"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm h-24"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-indigo-900 hover:bg-indigo-850 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-center"
        >
          Kirim Kehadiran Realtime &rarr;
        </button>

      </form>
    </div>
  );
}

// --- SUB-COMPONENT: KANBAN TASK CARD ---
function TaskCard({ task, currentUser, tasks, setTasks, triggerNotification }) {
  const handleStatusChange = (newStatus) => {
    const updated = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTasks(updated);
    triggerNotification(`Status tugas ${task.id} diubah ke ${newStatus}.`, 'success');
  };

  const isAssignedToMe = task.assignedTo === currentUser.id;
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all space-y-3">
      <div className="flex justify-between items-start gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          task.priority === 'Tinggi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
        }`}>{task.priority}</span>
        
        {isAdmin && (
          <button 
            onClick={() => {
              setTasks(tasks.filter(t => t.id !== task.id));
              triggerNotification(`Tugas ${task.id} telah dihapus.`, 'success');
            }}
            className="text-slate-400 hover:text-rose-600 transition-all"
            title="Hapus Tugas"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div>
        <h4 className="font-bold text-slate-800 text-sm leading-snug">{task.title}</h4>
        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
      </div>

      <div className="flex items-center gap-1.5 border-t border-slate-50 pt-2 text-[11px] text-slate-400">
        <span className="font-bold text-slate-600">Pelaksana:</span>
        <span className="bg-indigo-50 text-indigo-900 font-semibold px-2 py-0.5 rounded">{task.assignedName}</span>
      </div>

      <div className="flex justify-between items-center text-xs text-indigo-900 font-bold">
        <span>⏱️ {task.deadline}</span>
      </div>

      {/* Dynamic Status Mover Controls */}
      {(isAssignedToMe || isAdmin) && (
        <div className="flex gap-1 pt-1 border-t border-slate-50">
          {task.status !== 'Belum Mulai' && (
            <button
              onClick={() => handleStatusChange(task.status === 'Selesai' ? 'Sedang Dikerjakan' : 'Belum Mulai')}
              className="flex-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-lg transition-all"
            >
              &larr; Mundur
            </button>
          )}
          {task.status !== 'Selesai' && (
            <button
              onClick={() => handleStatusChange(task.status === 'Belum Mulai' ? 'Sedang Dikerjakan' : 'Selesai')}
              className="flex-1 text-[10px] bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-1.5 rounded-lg transition-all"
            >
              {task.status === 'Belum Mulai' ? 'Kerjakan &rarr;' : 'Selesaikan ✓'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: ADD TASK MODAL (ADMIN ONLY) ---
function AddTaskModal({ users, tasks, setTasks, triggerNotification }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assigned, setAssigned] = useState(users.filter(u => u.role === 'staff')[0]?.id || '');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Sedang');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title || !desc || !assigned || !deadline) {
      triggerNotification("Isi semua data tugas!", "error");
      return;
    }

    const staff = users.find(u => u.id === assigned);

    const newTask = {
      id: "T-" + Date.now().toString().slice(-3),
      title,
      description: desc,
      assignedTo: assigned,
      assignedName: staff ? staff.name : 'Unknown Staff',
      deadline,
      status: 'Belum Mulai',
      priority
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDesc('');
    setDeadline('');
    
    // Close modal
    document.getElementById('addTaskModal').classList.add('hidden');
    triggerNotification("Tugas baru berhasil dibuat & ditugaskan!", "success");
  };

  return (
    <div id="addTaskModal" className="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-800 text-base">Buat Penugasan Baru</h4>
          <button 
            type="button"
            onClick={() => document.getElementById('addTaskModal').classList.add('hidden')}
            className="text-slate-400 hover:text-slate-800 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nama Tugas / Kunjungan</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kunjungan Toko Kelontong Sejahtera" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Deskripsi & Instruksi</label>
            <textarea 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tulis detail instruksi sales di lapangan..." 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500 h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tugaskan Kepada</label>
              <select 
                value={assigned} 
                onChange={(e) => setAssigned(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500 text-xs"
              >
                {users.filter(u => u.role === 'staff').map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prioritas</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500 text-xs"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Batas Waktu (Deadline)</label>
            <input 
              type="date" 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-900 hover:bg-indigo-850 text-white font-bold py-2.5 rounded-xl transition-all"
          >
            Tugaskan Sales Lapangan
          </button>
        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: ADD ANNOUNCEMENT MODAL (ADMIN ONLY) ---
function AddAnnounceModal({ announcements, setAnnouncements, currentUser, triggerNotification }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateAnnounce = (e) => {
    e.preventDefault();
    if (!title || !content) {
      triggerNotification("Lengkapi semua kolom!", "error");
      return;
    }

    const newAnn = {
      id: "A-" + Date.now().toString().slice(-3),
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle('');
    setContent('');
    
    // Close modal
    document.getElementById('addAnnounceModal').classList.add('hidden');
    triggerNotification("Pengumuman berhasil diposting!", "success");
  };

  return (
    <div id="addAnnounceModal" className="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-800 text-base">Buat Pengumuman Baru</h4>
          <button 
            type="button"
            onClick={() => document.getElementById('addAnnounceModal').classList.add('hidden')}
            className="text-slate-400 hover:text-slate-800 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateAnnounce} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Judul Pengumuman</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jadwal Libur Idul Fitri & THR" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Konten Informasi</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis pesan lengkap kepada seluruh karyawan..." 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-indigo-500 h-32"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-900 hover:bg-indigo-850 text-white font-bold py-2.5 rounded-xl transition-all"
          >
            Siarkan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}