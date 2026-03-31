import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, PremiumTabs } from "../components/UI";
import { DataTable } from "../components/DataTable";
import { ORGANIZERS, CATEGORIES } from "../data/mockData";
import { cn } from "../lib/utils";
import { adminDeactivateProfile } from "../lib/edgeFunctions";
import DetailsDialog from "../components/DetailsDialog";
import CustomSelect from "../components/CustomSelect";
import {
  Users,
  BadgeCheck,
  Ban,
  Star,
  Briefcase,
  ShieldCheck,
  UserPlus,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Power,
  AlertCircle,
  MapPin,
} from "lucide-react";

const OrganizersPage = () => {
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState("");
  const [detailsPayload, setDetailsPayload] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null);
  const [deactivationReason, setDeactivationReason] = useState("Admin action");
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  type Organizer = (typeof ORGANIZERS)[0];
  const [organizers, setOrgs] = useState<Organizer[]>(ORGANIZERS);

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Suspended"
  >("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filteredOrganizers = organizers.filter((org) => {
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Approved" && org.status === "Active") ||
      (statusFilter !== "Approved" && org.status === statusFilter);
    const matchCategory =
      categoryFilter === "All Categories" || org.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const stats = {
    total: organizers.length,
    pending: organizers.filter((o) => o.status === "Pending").length,
    suspended: organizers.filter((o) => o.status === "Suspended").length,
    approved: organizers.filter((o) => o.status === "Active").length,
  };

  const setOrganizers = (updater: (prev: Organizer[]) => Organizer[]) => {
    setOrgs(updater);
  };

  const openDeactivateModal = (org: Organizer) => {
    setSelectedOrganizer(org);
    setDeactivationReason("Admin action");
    setActionMessage(null);
    setConfirmOpen(true);
  };

  const handleDeactivate = async () => {
    if (!selectedOrganizer) return;
    setIsSubmitting(true);
    try {
      await adminDeactivateProfile({
        target_profile_id: String(selectedOrganizer.id),
        reason: deactivationReason.trim() || "Admin action",
      });
      setOrganizers((prev) =>
        prev.map((o) =>
          o.id === selectedOrganizer.id ? { ...o, status: "Suspended" } : o,
        ),
      );
      setActionMessage({
        type: "success",
        text: "Organizer suspended successfully.",
      });
      setConfirmOpen(false);
      setSelectedOrganizer(null);
    } catch (error: any) {
      setActionMessage({
        type: "error",
        text: error?.message || "Failed to suspend organizer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: (org: Organizer) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-primary border border-slate-200 shrink-0">
            {org.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
              {org.name}
            </span>
            <BadgeCheck className="w-3.5 h-3.5 text-rose-400" />
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: (org: Organizer) => (
        <span className="text-xs font-medium text-slate-500">
          {org.email}
        </span>
      ),
    },
    {
      header: "Category",
      accessor: (org: Organizer) => (
        <span className="text-xs font-medium text-slate-600">
          {org.category}
        </span>
      ),
    },
    {
      header: "Location",
      accessor: (org: Organizer) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{org.location}</span>
        </div>
      ),
    },
    {
      header: "Plan",
      accessor: (org: Organizer) => (
        <div className="flex flex-col items-start gap-1">
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm bg-slate-100 text-slate-600 border-slate-200",
              org.subscriptionPlan === "None" && "bg-transparent border-transparent text-slate-400 shadow-none"
            )}
          >
            {org.subscriptionPlan}
          </span>
          {org.subscriptionPlan !== "None" && (
            <span className="text-[9px] font-bold text-slate-400 ml-0.5">
              ${org.subscriptionPlan === "Premium" ? "49" : "19"}/mo
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (org: Organizer) => (
        <div
          className={cn(
            "inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
            org.status === "Active"
              ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
              : org.status === "Pending"
                ? "bg-slate-100 border-slate-100 text-slate-700"
                : "bg-rose-500 border-rose-500 text-white shadow-sm",
          )}
        >
          <span>{org.status === "Active" ? "Approved" : org.status}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader
        title="Organizers"
        description="Manage professional profiles & verification."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Organizers"
          value={stats.total}
          icon={Users}
          color="primary"
          className="shadow-md"
        />
        <StatCard
          title="Total Pending"
          value={stats.pending}
          icon={Clock}
          color="amber"
          className="shadow-md"
        />
        <StatCard
          title="Total Suspended"
          value={stats.suspended}
          icon={Ban}
          color="rose"
          className="shadow-md"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="w-full lg:flex-1">
          <PremiumTabs
            tabs={[
              { id: "All", label: "All" },
              { id: "Pending", label: "Pending" },
              { id: "Approved", label: "Approved" },
              { id: "Suspended", label: "Suspended" },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <div className="w-full lg:w-72">
          <CustomSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "All Categories", label: "All Categories" },
              ...CATEGORIES.map((c) => ({ value: c.name, label: c.name })),
            ]}
          />
        </div>
      </div>

      <div className="mt-8 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredOrganizers}
          searchPlaceholder="Locate organizer..."
          onRowClick={(org) => navigate(`/users/organizers/${org.id}`)}
          rowActions={[
            {
              label: "View Profile",
              icon: Eye,
              onClick: (org: any) => navigate(`/users/organizers/${org.id}`),
            },
            {
              label: (org: Organizer) => {
                if (org.status === "Pending") return "Approve";
                return org.status === "Suspended" ? "Activate" : "Suspend";
              },
              icon: (org: Organizer) => {
                if (org.status === "Pending") return CheckCircle2;
                return Power;
              },
              onClick: (org: Organizer) => {
                if (org.status !== "Active") {
                  setOrganizers((prev) =>
                    prev.map((o) =>
                      o.id === org.id ? { ...o, status: "Active" } : o,
                    ),
                  );
                  setActionMessage({
                    type: "success",
                    text: `Organizer ${org.status === "Pending" ? "approved" : "activated"} successfully.`,
                  });
                  return;
                }
                openDeactivateModal(org);
              },
              variant: (org: Organizer) =>
                org.status === "Active"
                  ? ("danger" as const)
                  : ("success" as const),
            },
            {
              label: "Reject",
              icon: XCircle,
              show: (org: Organizer) => org.status === "Pending",
              onClick: (org: Organizer) => {
                openDeactivateModal(org);
              },
              variant: "danger" as const,
            },
          ]}
          belowSearch={
            <div className="space-y-1">
              {isSubmitting ? (
                <p className="text-xs text-slate-500 font-medium">
                  Submitting admin action...
                </p>
              ) : null}
              {actionMessage ? (
                <p
                  className={cn(
                    "text-xs font-medium",
                    actionMessage.type === "error"
                      ? "text-rose-600"
                      : "text-emerald-600",
                  )}
                >
                  {actionMessage.text}
                </p>
              ) : null}
            </div>
          }
        />
      </div>

      <DetailsDialog
        open={detailsOpen}
        title={detailsTitle}
        onClose={() => setDetailsOpen(false)}
      >
        {detailsPayload && (
          <div className="mt-2 space-y-4">
            {detailsPayload.id && detailsPayload.services ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={detailsPayload.avatar}
                    alt=""
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <p className="font-black text-slate-800 text-lg">
                      {detailsPayload.name}
                    </p>
                    <p className="text-sm font-bold text-slate-500">
                      {detailsPayload.email}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      {detailsPayload.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Plan
                    </p>
                    <p className="font-black text-slate-800">
                      {detailsPayload.subscriptionPlan}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <p className="font-black text-slate-800">
                      {detailsPayload.status}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-700">
                  Invite sent to{" "}
                  <span className="text-slate-900">
                    {detailsPayload.name || "—"}
                  </span>{" "}
                  ({detailsPayload.email || "—"}).
                </p>
              </div>
            )}
          </div>
        )}
      </DetailsDialog>

      {confirmOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => {
                  if (isSubmitting) return;
                  setConfirmOpen(false);
                }}
                aria-hidden
              />
              <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2 className="text-lg font-black text-slate-800">
                  {selectedOrganizer?.status === "Pending" ? "Reject Signup" : "Confirm suspension"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedOrganizer?.status === "Pending" 
                    ? `Are you sure you want to reject the application from `
                    : `This will suspend `}
                  <span className="font-semibold text-slate-800">
                    {selectedOrganizer?.name}
                  </span>
                  .
                </p>
                <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-500">
                  Reason
                </label>
                <textarea
                  value={deactivationReason}
                  onChange={(e) => setDeactivationReason(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter reason"
                />
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setConfirmOpen(false)}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleDeactivate()}
                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting 
                      ? (selectedOrganizer?.status === "Pending" ? "Rejecting..." : "Suspending...") 
                      : "Confirm"}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

export default OrganizersPage;
