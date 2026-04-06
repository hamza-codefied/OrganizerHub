import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, PremiumTabs } from "../components/UI";
import { DataTable } from "../components/DataTable";
import { cn } from "../lib/utils";
import CustomSelect from "../components/CustomSelect";
import { useAdminOrganizers } from "../hooks/useAdminOrganizers";
import {
  adminChangeSuspensionStatus,
  adminVerifyOrganization,
  type AdminOrganizerListItem,
  type OrganizersRange,
} from "../lib/adminOrganizersApi";
import {
  Users,
  BadgeCheck,
  Ban,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Power,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";

const RANGE_TABS: { id: OrganizersRange; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "weekly", label: "Weekly" },
  { id: "daily", label: "Daily" },
  { id: "yearly", label: "Yearly" },
  { id: "all", label: "All time" },
];

function mapOrganizerStatus(
  org: AdminOrganizerListItem,
): "Pending" | "Active" | "Suspended" | "Rejected" {
  if (!org.status) return "Suspended";
  const v = (org.isVerified || "").toLowerCase();
  if (v === "false") return "Rejected";
  if (v === "pending") return "Pending";
  return "Active";
}

function categoryLabel(org: AdminOrganizerListItem): string {
  if (!org.categories?.length) return "—";
  return org.categories.map((c) => c.name).join(", ");
}

type OrganizerRow = AdminOrganizerListItem & { id: string };

const OrganizersPage = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<OrganizersRange>("monthly");
  const [searchDraft, setSearchDraft] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const { data, error, isLoading, refetch } = useAdminOrganizers({
    range,
    search: searchDraft,
    categoryId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerRow | null>(null);
  const [deactivationReason, setDeactivationReason] = useState("Admin action");
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected" | "Suspended"
  >("All");

  const rows: OrganizerRow[] = useMemo(() => {
    const list = data?.organizers ?? [];
    return list.map((o) => ({ ...o, id: o.organizer_id }));
  }, [data?.organizers]);

  const categorySelectOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const o of rows) {
      for (const c of o.categories ?? []) {
        map.set(c.id, c.name);
      }
    }
    const sorted = Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
    return [
      { value: "", label: "All categories" },
      ...sorted.map(([id, name]) => ({ value: String(id), label: name })),
    ];
  }, [rows]);

  const filteredOrganizers = useMemo(() => {
    return rows.filter((org) => {
      const s = mapOrganizerStatus(org);
      if (statusFilter === "All") return true;
      if (statusFilter === "Approved") return s === "Active";
      if (statusFilter === "Pending") return s === "Pending";
      if (statusFilter === "Rejected") return s === "Rejected";
      return s === "Suspended";
    });
  }, [rows, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: data?.total_organizers ?? rows.length,
      pending: rows.filter((o) => mapOrganizerStatus(o) === "Pending").length,
      rejected: rows.filter((o) => mapOrganizerStatus(o) === "Rejected").length,
      suspended: rows.filter((o) => mapOrganizerStatus(o) === "Suspended").length,
    };
  }, [data?.total_organizers, rows]);

  const openDeactivateModal = (org: OrganizerRow) => {
    setSelectedOrganizer(org);
    setDeactivationReason("Admin action");
    setActionMessage(null);
    setConfirmOpen(true);
  };

  const handleDeactivate = async () => {
    if (!selectedOrganizer) return;
    setIsSubmitting(true);
    try {
      if (mapOrganizerStatus(selectedOrganizer) === "Pending") {
        await adminVerifyOrganization({
          organizer_id: selectedOrganizer.organizer_id,
          isVerified: false,
        });
        setActionMessage({
          type: "success",
          text: "Organization rejected.",
        });
      } else {
        await adminChangeSuspensionStatus({
          organizer_id: selectedOrganizer.organizer_id,
          isActive: false,
          message: deactivationReason.trim() || "Admin action",
        });
        setActionMessage({
          type: "success",
          text: "Organizer suspended successfully.",
        });
      }
      setConfirmOpen(false);
      setSelectedOrganizer(null);
      await refetch();
    } catch (error: unknown) {
      setActionMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Action failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveOrActivate = async (org: OrganizerRow) => {
    const s = mapOrganizerStatus(org);
    if (s === "Pending" || s === "Rejected") {
      setIsSubmitting(true);
      setActionMessage(null);
      try {
        await adminVerifyOrganization({
          organizer_id: org.organizer_id,
          isVerified: true,
        });
        setActionMessage({
          type: "success",
          text: s === "Rejected" ? "Organization re-approved." : "Organization approved.",
        });
        await refetch();
      } catch (error: unknown) {
        setActionMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Could not update verification.",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (s === "Suspended") {
      setIsSubmitting(true);
      setActionMessage(null);
      try {
        await adminChangeSuspensionStatus({
          organizer_id: org.organizer_id,
          isActive: true,
        });
        setActionMessage({
          type: "success",
          text: "Organization activated.",
        });
        await refetch();
      } catch (error: unknown) {
        setActionMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Could not activate organization.",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (s !== "Active") {
      void refetch();
      return;
    }
    openDeactivateModal(org);
  };

  type Organizer = OrganizerRow;

  const columns = [
    {
      header: "Name",
      accessor: (org: Organizer) => (
        <div className="flex items-center gap-3 py-1">
          
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
              {org.name}
            </span>
            <BadgeCheck
              className={cn(
                "w-3.5 h-3.5",
                mapOrganizerStatus(org) === "Active" ? "text-emerald-500" : "text-slate-300",
              )}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: (org: Organizer) => (
        <span className="text-xs font-medium text-slate-500">{org.email}</span>
      ),
    },
    {
      header: "Business",
      accessor: (org: Organizer) => (
        <span className="text-xs font-medium text-slate-600">{org.business_name || "—"}</span>
      ),
    },
    {
      header: "Category",
      accessor: (org: Organizer) => (
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[200px]">
          {categoryLabel(org)}
        </span>
      ),
    },
    {
      header: "Location",
      accessor: (org: Organizer) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs font-medium">{org.location || "—"}</span>
        </div>
      ),
    },
    {
      header: "Plan",
      accessor: () => (
        <span className="text-xs font-bold text-slate-400">—</span>
      ),
    },
    {
      header: "Status",
      accessor: (org: Organizer) => {
        const s = mapOrganizerStatus(org);
        return (
          <div
            className={cn(
              "inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
              s === "Active"
                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                : s === "Pending"
                  ? "bg-yellow-200 border-yellow-500 text-yellow-700 shadow-sm"
                  : s === "Rejected"
                    ? "bg-slate-700 border-slate-800 text-white shadow-sm"
                    : "bg-rose-500 border-rose-500 text-white shadow-sm",
            )}
          >
            <span>{s === "Active" ? "Approved" : s}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader
        title="Organizers"
        description="Manage professional profiles & verification."
      >
        <div className="flex w-full sm:w-auto overflow-x-auto">
          <PremiumTabs
            tabs={RANGE_TABS}
            activeTab={range}
            onChange={(id) => setRange(id as OrganizersRange)}
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Organizers"
          value={isLoading && !data ? "—" : stats.total}
          icon={Users}
          color="primary"
          className="shadow-md"
        />
        <StatCard
          title="Total Pending"
          value={isLoading && !data ? "—" : stats.pending}
          icon={Clock}
          color="amber"
          className="shadow-md"
        />
        <StatCard
          title="Total Rejected"
          value={isLoading && !data ? "—" : stats.rejected}
          icon={XCircle}
          color="secondary"
          className="shadow-md"
        />
        <StatCard
          title="Total Suspended"
          value={isLoading && !data ? "—" : stats.suspended}
          icon={Ban}
          color="rose"
          className="shadow-md"
        />
      </div>

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-sm">
          <p className="flex-1 font-medium">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wide hover:bg-rose-100/80"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="w-full lg:flex-1">
          <PremiumTabs
            tabs={[
              { id: "All", label: "All" },
              { id: "Pending", label: "Pending" },
              { id: "Approved", label: "Approved" },
              { id: "Rejected", label: "Rejected" },
              { id: "Suspended", label: "Suspended" },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <div className="w-full lg:w-72">
          <CustomSelect
            value={categoryId ?? ""}
            onChange={(v) => setCategoryId(v === "" ? undefined : v)}
            options={categorySelectOptions}
          />
        </div>
      </div>

      <div className="mt-8 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-lg border border-slate-200 min-h-[240px]">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Loading organizers…</span>
            </div>
          </div>
        )}
        <DataTable
          columns={columns}
          data={filteredOrganizers}
          searchPlaceholder="Search by name…"
          serverSideSearch
          onSearch={setSearchDraft}
          onRowClick={(org) => navigate(`/users/organizers/${org.organizer_id}`)}
          rowActions={[
            {
              label: "View Profile",
              icon: Eye,
              onClick: (org: Organizer) => navigate(`/users/organizers/${org.organizer_id}`),
            },
            {
              label: (org: Organizer) => {
                const st = mapOrganizerStatus(org);
                if (st === "Pending") return "Approve";
                if (st === "Rejected") return "Reapprove";
                return st === "Suspended" ? "Activate" : "Suspend";
              },
              icon: (org: Organizer) => {
                const st = mapOrganizerStatus(org);
                if (st === "Pending" || st === "Rejected") return CheckCircle2;
                return Power;
              },
              onClick: (org: Organizer) => {
                void handleApproveOrActivate(org);
              },
              variant: (org: Organizer) =>
                mapOrganizerStatus(org) === "Active" ? ("danger" as const) : ("success" as const),
            },
            {
              label: "Reject",
              icon: XCircle,
              show: (org: Organizer) => mapOrganizerStatus(org) === "Pending",
              onClick: (org: Organizer) => {
                openDeactivateModal(org);
              },
              variant: "danger" as const,
            },
          ]}
          belowSearch={
            <div className="space-y-1">
              {isSubmitting ? (
                <p className="text-xs text-slate-500 font-medium">Submitting admin action...</p>
              ) : null}
              {actionMessage ? (
                <p
                  className={cn(
                    "text-xs font-medium",
                    actionMessage.type === "error" ? "text-rose-600" : "text-emerald-600",
                  )}
                >
                  {actionMessage.text}
                </p>
              ) : null}
            </div>
          }
        />
      </div>

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
                  {selectedOrganizer && mapOrganizerStatus(selectedOrganizer) === "Pending"
                    ? "Reject Signup"
                    : "Confirm suspension"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedOrganizer && mapOrganizerStatus(selectedOrganizer) === "Pending"
                    ? "Are you sure you want to reject the application from "
                    : "This will suspend "}
                  <span className="font-semibold text-slate-800">{selectedOrganizer?.name}</span>.
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
                      ? selectedOrganizer && mapOrganizerStatus(selectedOrganizer) === "Pending"
                        ? "Rejecting..."
                        : "Suspending..."
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
