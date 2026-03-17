import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck, Zap } from 'lucide-react';
import { PremiumBackground } from '../components/UI';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      login();
      navigate('/', { replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <PremiumBackground />
      
      <div className="absolute top-0 left-0 w-full h-full bg-slate-900/5 backdrop-blur-[2px] z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-premium p-12 rounded-[3rem] border border-white/60 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="text-center mb-10 relative">
            <div className="w-20 h-20 rounded-[2rem] primary-gradient flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 group">
              <span className="text-white font-black text-4xl group-hover:scale-110 transition-transform">O</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-3">
              OrganizeHub <span className="text-primary text-5xl">.</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 font-bold uppercase tracking-[0.3em] mb-1">Global Executive Framework</p>
            <p className="text-sm font-bold text-slate-500">Professional Command Center Authentication</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Vector</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@organizehub.com"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Protocol</label>
                <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Signal Recovery</button>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={cn(
                "w-full py-5 primary-gradient text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10",
                isLoading && "opacity-80"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Initiate Sync
                </>
              )}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100/50">
             <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encryption Active</span>
             </div>
             <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fast Deployment</span>
             </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          © 2026 OrganizeHub Global Infrastructure <br/>
          <span className="text-primary mt-1 inline-block">Enterprise Edition v4.2.0</span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
