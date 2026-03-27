import type { ElementType } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, GlassCard } from "../components/UI";
import { Mail, ShieldCheck, Shield, Clock } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();

  const adminData = {
    name: "Admin Hub",
    email: "admin@organizehub.com",
    role: "Admin",
    lastLogin: "March 17, 2026 15:52",
    status: "Peak Access",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=executive",
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
        <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Profile"
        description="Quick view of your account details."
      >
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
        >
          Open settings
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard className="p-0 overflow-hidden text-center">
            <div className="p-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-md border border-slate-200 overflow-hidden bg-slate-50 mb-4">
                <img
                  src={adminData.avatar}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                {adminData.name}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{adminData.role}</p>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard title="Account details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <InfoRow label="Email" value={adminData.email} icon={Mail} />
              <InfoRow label="Role" value={adminData.role} icon={Shield} />
              <InfoRow
                label="Status"
                value={adminData.status}
                icon={ShieldCheck}
              />
              <InfoRow
                label="Last login"
                value={adminData.lastLogin}
                icon={Clock}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
