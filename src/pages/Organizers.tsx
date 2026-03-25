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
    "All" | "Pending" | "Active" | "Suspended"
  >("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filteredOrganizers = organizers.filter((org) => {
    const matchStatus = statusFilter === "All" || org.status === statusFilter;
    const matchCategory =
      categoryFilter === "All Categories" || org.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const stats = {
    total: organizers.length,
    pending: organizers.filter((o) => o.status === "Pending").length,
    suspended: organizers.filter((o) => o.status === "Suspended").length,
    active: organizers.filter((o) => o.status === "Active").length,
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
      header: "Business",
      className: "hidden sm:table-cell",
      accessor: (org: Organizer) => (
        <span className="font-black text-slate-800 text-xs sm:text-sm">
          {org.businessName}
        </span>
      ),
    },
    {
      header: "Organizer",
      accessor: (org: Organizer) => (
        <div className="cursor-pointer group py-1">
          <p className="font-black text-slate-800 leading-tight tracking-tight text-xs sm:text-sm group-hover:text-primary transition-colors truncate max-w-[120px] xs:max-w-none">
            {org.name}
          </p>
          <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {org.email}
          </p>
        </div>
      ),
    },
    {
      header: "Category",
      className: "hidden xl:table-cell",
      accessor: (org: Organizer) => (
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {org.category}
        </span>
      ),
    },
    {
      header: "Location",
      className: "hidden lg:table-cell",
      accessor: (org: Organizer) => (
        <span className="text-xs font-bold text-slate-600">{org.location}</span>
      ),
    },
    {
      header: "Plan",
      className: "hidden xs:table-cell",
      accessor: (org: Organizer) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
            org.subscriptionPlan === "Premium"
              ? "bg-amber-50/50 text-amber-600 border-amber-100"
              : "bg-slate-50 text-slate-400 border-slate-100",
          )}
        >
          {org.subscriptionPlan}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (org: Organizer) => (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
            org.status === "Active"
              ? "bg-emerald-50/50 text-emerald-600 border-emerald-100"
              : org.status === "Pending"
                ? "bg-amber-50/50 text-amber-600 border-amber-100"
                : "bg-slate-100 text-slate-400 border-slate-200",
          )}
        >
          {org.status === "Active" ? (
            <ShieldCheck className="w-3 h-3" />
          ) : org.status === "Pending" ? (
            <Clock className="w-3 h-3" />
          ) : (
            <Ban className="w-3 h-3" />
          )}
          <span className="hidden xs:inline">{org.status}</span>
          <span className="xs:hidden">{org.status.charAt(0)}</span>
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

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-end">

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
              icon: Power,
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
                  Confirm suspension
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  This will suspend{" "}
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
                    {isSubmitting ? "Suspending..." : "Confirm"}
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
