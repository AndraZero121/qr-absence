import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaIdCard } from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import logo from "../../assets/logo.png"; // Assuming logo is available here

const LoginPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Configuration for each role
  const roleConfig = {
    'admin': {
      title: 'Admin',
      color: 'text-red-600',
      bgColor: 'bg-red-600',
      gradient: 'from-red-50 to-red-100',
      fields: [
        { name: 'identifier', label: 'Nama Pengguna', placeholder: 'Masukkan username', type: 'text', icon: <FaUser /> },
        { name: 'password', label: 'Kata Sandi', placeholder: 'Masukkan kata sandi', type: 'password', icon: <FaLock /> }
      ],
      dashboard: '/admin/dashboard'
    },
    'waka': {
      title: 'Waka',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600',
      gradient: 'from-purple-50 to-purple-100',
      fields: [
        { name: 'identifier', label: 'Kode Guru', placeholder: 'Masukkan kode guru', type: 'text', icon: <FaIdCard /> },
        { name: 'password', label: 'Kata Sandi', placeholder: 'Masukkan kata sandi', type: 'password', icon: <FaLock /> }
      ],
      dashboard: '/waka/dashboard'
    },
    'peserta-didik': {
      title: 'Peserta Didik',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-600',
      gradient: 'from-cyan-50 to-cyan-100',
      fields: [
        { name: 'identifier', label: 'NISN', placeholder: 'Masukkan NISN', type: 'text', icon: <FaIdCard /> }
      ],
      dashboard: '/siswa/dashboard'
    },
    'guru': {
      title: 'Guru',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      fields: [
        { name: 'identifier', label: 'Kode Guru', placeholder: 'Masukkan kode guru', type: 'text', icon: <FaIdCard /> },
        { name: 'password', label: 'Kata Sandi', placeholder: 'Masukkan password', type: 'password', icon: <FaLock /> }
      ],
      dashboard: '/guru/dashboard'
    },
    'wali-kelas': {
      title: 'Wali Kelas',
      color: 'text-green-600',
      bgColor: 'bg-green-600',
      gradient: 'from-green-50 to-green-100',
      fields: [
        { name: 'identifier', label: 'Kode Guru', placeholder: 'Masukkan kode guru', type: 'text', icon: <FaIdCard /> },
        { name: 'password', label: 'Kata Sandi', placeholder: 'Masukkan password', type: 'password', icon: <FaLock /> }
      ],
      dashboard: '/walikelas/dashboard'
    },
    'pengurus-kelas': {
      title: 'Pengurus Kelas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-600',
      gradient: 'from-orange-50 to-orange-100',
      fields: [
        { name: 'identifier', label: 'NISN', placeholder: 'Masukkan NISN', type: 'text', icon: <FaIdCard /> }
      ],
      dashboard: '/pengurus-kelas/dashboard'
    }
  };

  const config = roleConfig[role] || roleConfig['admin'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emptyFields = config.fields.filter(field => !formData[field.name]);
    if (emptyFields.length > 0) {
      setError('Mohon isi semua kolom yang tersedia.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call or use real service
      const { authService } = await import('../../services/auth');

      const { user } = await authService.login(
        formData.identifier,
        formData.password || '' 
      );

      console.log('Login berhasil sebagai', role, user);

      localStorage.setItem('userRole', role);
      localStorage.setItem('userIdentifier', formData.identifier);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userData', JSON.stringify(user));

      navigate(config.dashboard);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 422) {
        setError('Data kredensial tidak cocok atau akun tidak aktif.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        // Fallback for demo/development if service fails
        // Remove this block in production and handle error properly
        if (process.env.NODE_ENV !== 'production' && !error.response) {
            console.warn("Dev mode: Bypass login for testing UI");
            localStorage.setItem('userRole', role);
            localStorage.setItem('userIdentifier', formData.identifier);
            localStorage.setItem('userName', 'Test User');
            localStorage.setItem('userData', JSON.stringify({ name: 'Test User', role: role }));
            navigate(config.dashboard);
            return;
        }
        setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      }
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
    setError('');
  };

  return (
    <PageWrapper className={`min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center p-4 font-sans`}>
      
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-block bg-white p-3 rounded-2xl shadow-md mb-4">
             <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Selamat Datang</h1>
          <p className="text-gray-500 text-sm mt-1">Silakan masuk ke akun <span className={`font-bold ${config.color}`}>{config.title}</span> Anda</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Top Decorative Bar */}
          <div className={`h-2 w-full ${config.bgColor}`}></div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm flex items-start gap-2 animate-shake">
                   <FaEye className="mt-0.5" />
                   <span>{error}</span>
                </div>
              )}

              {config.fields.map((field, index) => (
                <div key={index} className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1 block">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      {field.icon}
                    </div>
                    <input
                      type={field.type === 'password' && showPassword ? 'text' : field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400 text-sm"
                      required
                    />
                    
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm uppercase tracking-wide shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl focus:ring-2 focus:ring-offset-2 ${config.bgColor} opacity-90 hover:opacity-100`}
              >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                    </span>
                ) : "Masuk Sekarang"}
              </button>
            </form>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
            <button 
                onClick={() => navigate('/')} 
                className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center gap-2 transition-colors"
            >
                <FaArrowLeft size={12} /> Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;