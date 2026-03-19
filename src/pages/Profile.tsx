import type { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, GlassCard } from '../components/UI';
import { Mail, ShieldCheck, Shield, Clock } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();

  const adminData = {
    name: 'Admin Hub',
    email: 'admin@organizehub.com',
    role: 'Global Executive',
    lastLogin: 'March 17, 2026 15:52',
    status: 'Peak Access',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=executive',
  };

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string;
    icon: ElementType;
  }) => {
    return (
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{label}</p>
          <p className="text-sm font-bold text-slate-800 mt-1">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <PageHeader title="Admin Profile" description="Quick view of your account details.">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Open settings
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="p-0 overflow-hidden text-center">
            <div className="h-32 primary-gradient blur-3xl -mb-16 opacity-10" />
            <div className="p-10 pt-0 relative flex flex-col items-center">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 border-4 border-white shadow-2xl relative mb-6">
                <img
                  src={adminData.avatar}
                  alt="Admin"
                  className="w-full h-full rounded-[2.2rem] object-cover"
                />
              </div>

              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{adminData.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">
                {adminData.role}
              </p>

             
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <GlassCard title="Account details" >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <InfoRow label="Email" value={adminData.email} icon={Mail} />
              <InfoRow label="Role" value={adminData.role} icon={Shield} />
              <InfoRow label="Status" value={adminData.status} icon={ShieldCheck} />
              <InfoRow label="Last login" value={adminData.lastLogin} icon={Clock} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
