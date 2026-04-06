import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlassCard, PremiumTabs } from "../components/UI";
import { cn, formatCurrency } from "../lib/utils";
import { useAdminOrganizerDetails } from "../hooks/useAdminOrganizerDetails";
import {
  adminChangeSuspensionStatus,
  adminVerifyOrganization,
  type AdminOrganizerDetailsResponse,
  type AdminOrganizerServiceOffered,
} from "../lib/adminOrganizersApi";
import {
  BadgeCheck,
  Ban,
  Star,
  Briefcase,
  ShieldCheck,
  Zap,
  MapPin,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Award,
  Clock,
  Eye,
  ChevronLeft,
  CheckCircle2,
  Power,
  TrendingUp,
  Target,
  ExternalLink,
  Users,
  Globe,
  FileText,
  Wallet,
  Receipt,
  ArrowUpRight,
  Download,
  Tag,
  Megaphone,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { TimeFilterTabs, DashboardStatCard } from "../components/UI";
import { DateRangePicker } from "../components/DateRangePicker";
import type { DateRange } from "react-day-picker";

type OrganizerReview = { id: string; organizer: string; rating: number; comment: string; date: string; homeOwner: string; service: string };
type TeamMember = {
  id: string;
  organizerId: string;
  profilePicture: string;
  name: string;
  nationality: string;
  email: string;
  phone: string;
  skills: string[];
};

type OrganizerUIModel = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  tradeName: string;
  subscriptionPlan: string;
  rating: string;
  bio: string;
  companyBannerUrl: string;
  website: string;
  fullAddress: string;
  businessLicenseDocument: string;
  businessLicenseFileUrl: string;
  tradeRegistrationDocument: string;
  tradeRegistrationFileUrl: string;
  location: string;
  completedJobs: number;
  earnings: number;
  responseRate: number | null;
  onTimeRate: number | null;
  totalReviews: number;
  lastActive: string;
  status: "Active" | "Pending" | "Suspended" | "Rejected";
  certifications: string[];
  serviceAreas: string[];
  services: string[];
  servicesOffered: AdminOrganizerServiceOffered[];
  /** From API `gallery` — documents & images */
  galleryItems: { key: string; url: string }[];
};

function filenameFromUrl(url: string): string {
  if (!url) return "";
  try {
    const last = url.split("/").filter(Boolean).pop() || "";
    return decodeURIComponent(last.replace(/\+/g, " "));
  } catch {
    return url;
  }
}

function mapDisplayStatus(
  o: AdminOrganizerDetailsResponse["organizer"],
): "Active" | "Pending" | "Suspended" | "Rejected" {
  if (!o.status) return "Suspended";
  const v = (o.isVerified || "").toLowerCase();
  if (v === "false") return "Rejected";
  if (v === "pending") return "Pending";
  return "Active";
}

function organizerDescription(o: AdminOrganizerDetailsResponse["organizer"]): string {
  const raw = o.Description ?? o.description ?? "";
  return typeof raw === "string" ? raw.trim() : "";
}

function buildOrganizerViewModel(res: AdminOrganizerDetailsResponse): OrganizerUIModel {
  const o = res.organizer;
  const offered = res.services_offered ?? [];
  const cats = Array.from(
    new Set(offered.map((s) => s.category_name).filter(Boolean)),
  );
  const serviceAreas =
    cats.length > 0 ? cats : o.location ? [o.location] : [];

  const galleryItems = (res.gallery ?? [])
    .filter((g) => g?.url)
    .map((g) => ({ key: g.key, url: g.url }));

  return {
    id: o.organizer_id,
    organizationId: res.organization_id,
    name: o.name,
    email: o.email,
    phone: o.phone,
    businessName: o.business_name || "",
    tradeName: o.business_name || "",
    subscriptionPlan: "—",
    rating: "—",
    bio: organizerDescription(o),
    companyBannerUrl: o.company_banner || "",
    website: o.website || "",
    fullAddress: o.address || "",
    businessLicenseDocument: filenameFromUrl(o.business_license || ""),
    businessLicenseFileUrl: o.business_license || "",
    tradeRegistrationDocument: filenameFromUrl(o.trade_reg || ""),
    tradeRegistrationFileUrl: o.trade_reg || "",
    location: o.location || "",
    completedJobs: res.completed_services_count,
    earnings: res.total_earnings_estimated,
    responseRate: null,
    onTimeRate: null,
    totalReviews: 0,
    lastActive: "—",
    status: mapDisplayStatus(o),
    certifications: [],
    serviceAreas,
    services: offered.map((s) => s.service_name),
    servicesOffered: offered,
    galleryItems,
  };
}

function mapTeamApiToTeamMember(
  raw: unknown,
  index: number,
  organizerId: string,
): TeamMember | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name = String(r.name ?? r.full_name ?? "").trim();
  const id = String(r.id ?? r.organization_member_id ?? r.member_id ?? index);
  const pic =
    typeof r.profile_image_url === "string" && r.profile_image_url
      ? r.profile_image_url
      : typeof r.profile_picture === "string" && r.profile_picture
        ? r.profile_picture
        : typeof r.avatar_url === "string" && r.avatar_url
          ? r.avatar_url
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || id)}`;

  const nationality =
    typeof r.nationality_iso === "string" && r.nationality_iso.trim()
      ? r.nationality_iso.trim().toUpperCase()
      : String(r.nationality ?? r.country ?? "—");

  let skills: string[] = [];
  if (Array.isArray(r.services)) {
    skills = r.services
      .map((item) => {
        if (item && typeof item === "object" && "service_name" in item) {
          const svc = item as { service_name?: string; category_name?: string };
          const sn = svc.service_name?.trim();
          const cn = svc.category_name?.trim();
          if (sn && cn) return `${sn} · ${cn}`;
          return sn || cn || "";
        }
        return "";
      })
      .filter(Boolean);
  } else if (Array.isArray(r.skills)) {
    skills = r.skills.map(String);
  }

  return {
    id,
    organizerId,
    profilePicture: pic,
    name: name || "—",
    nationality,
    email: String(r.email ?? ""),
    phone: String(r.phone ?? ""),
    skills,
  };
}

function isLikelyImageUrl(url: string): boolean {
  const path = url.split("?")[0].toLowerCase();
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(path);
}

function formatGalleryKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useAdminOrganizerDetails(id);
  const org = useMemo(
    () => (data ? buildOrganizerViewModel(data) : null),
    [data],
  );
  const currentTeamMembers = useMemo(() => {
    if (!org) return [];
    const members = data?.team_members ?? [];
    if (!members.length) return [];
    return members
      .map((m, i) => mapTeamApiToTeamMember(m, i, org.id))
      .filter((m): m is TeamMember => m != null);
  }, [data?.team_members, org]);

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "services"
    | "packages"
    | "promo"
    | "reviews"
    | "team"
    | "transactions"
    | "gallery"
  >("overview");
  const [apiMessage, setApiMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const statsMultiplier = useMemo(() => {
    switch (timeFilter) {
      case "daily":
        return 0.05;
      case "weekly":
        return 0.25;
      case "monthly":
        return 0.75;
      case "yearly":
        return 1.0;
      case "custom":
        return 0.4;
      default:
        return 1.0;
    }
  }, [timeFilter]);

  const orgTransactions = useMemo(
    () =>
      [] as Array<{
        id: string;
        date: string;
        customerName?: string;
        customerEmail?: string;
        reference?: string;
        serviceName?: string;
        type?: string;
        grossAmount: number;
        platformFee: number;
        netToOrganizer: number;
        status: string;
      }>,
    [],
  );

  const totalPlatformContribution = useMemo(
    () => orgTransactions.reduce((sum, t) => sum + t.platformFee, 0),
    [orgTransactions],
  );

  const totalGrossVolume = useMemo(
    () => orgTransactions.reduce((sum, t) => sum + t.grossAmount, 0),
    [orgTransactions],
  );

  const updateStatus = async (status: "Active" | "Deactivated") => {
    if (!org) return;
    if (status === "Active") {
      if (org.status === "Pending" || org.status === "Rejected") {
        setIsSubmitting(true);
        setApiMessage("");
        try {
          await adminVerifyOrganization({
            organizer_id: org.id,
            isVerified: true,
          });
          await refetch();
          setApiMessage(
            org.status === "Rejected"
              ? "Organization re-approved."
              : "Organization approved.",
          );
        } catch (error: unknown) {
          setApiMessage(
            error instanceof Error ? error.message : "Could not update verification.",
          );
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
      if (org.status === "Suspended") {
        setIsSubmitting(true);
        setApiMessage("");
        try {
          await adminChangeSuspensionStatus({
            organizer_id: org.id,
            isActive: true,
          });
          await refetch();
          setApiMessage("Organization activated.");
        } catch (error: unknown) {
          setApiMessage(
            error instanceof Error ? error.message : "Could not activate organization.",
          );
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
      await refetch();
      setApiMessage("");
      return;
    }

    const reason = window.prompt("Reason for suspension:", "Admin action");
    if (!reason) return;

    setIsSubmitting(true);
    setApiMessage("");
    try {
      await adminChangeSuspensionStatus({
        organizer_id: org.id,
        isActive: false,
        message: reason,
      });
      await refetch();
      setApiMessage("Organization suspended.");
    } catch (error: unknown) {
      setApiMessage(
        error instanceof Error ? error.message : "Failed to suspend organization.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !org) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-semibold text-slate-600">Loading organizer…</p>
      </div>
    );
  }

  if (error && !org) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center px-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 font-black text-2xl">
          !
        </div>
        <p className="font-black text-slate-600">{error}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <button
            type="button"
            onClick={() => navigate("/users/organizers")}
            className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
          >
            Back to organizers
          </button>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 italic font-black text-4xl">
          !
        </div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">
          Organizer not found
        </p>
        <button
          onClick={() => navigate("/users/organizers")}
          className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
        >
          Back to organizers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/users/organizers")}
          className="p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-primary group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            Organizer
          </p>
         
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Profile Sidebar */}
        <div className="lg:w-1/4 space-y-6 sm:space-y-8">
          <GlassCard className="p-0 overflow-hidden border-white/60">
            <div className="h-12 sm:h-16 bg-slate-100 blur-3xl -mb-6 sm:-mb-8"></div>
            <div className="p-5 sm:p-8 pt-0 flex flex-col items-center text-center">
              <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tighter leading-tight">
                {org.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 sm:mt-3">
                <span
                  className={cn(
                    "px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    org.subscriptionPlan === "Premium"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-slate-50 text-slate-400 border-slate-100",
                  )}
                >
                  {org.subscriptionPlan} Tier
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                  <Star
                    className={cn(
                      "w-3 sm:w-3.5 h-3 sm:h-3.5",
                      org.rating === "—"
                        ? "text-slate-200 fill-slate-100"
                        : "text-amber-400 fill-amber-400",
                    )}
                  />
                  <span className="text-[10px] sm:text-xs font-black text-slate-800">
                    {org.rating}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-4 sm:mt-6 leading-relaxed px-2">
                {org.bio ? (
                  <span className="italic">&ldquo;{org.bio}&rdquo;</span>
                ) : (
                  <span className="text-slate-400 not-italic font-medium">No bio provided.</span>
                )}
              </p>

              <div className="w-full space-y-3 sm:space-y-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100 text-left">
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Business
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                    {org.businessName}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                    {org.email}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-slate-700">
                    {org.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                    {org.location}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Status controls"
            subtitle="Approve or change organizer status."
          >
            <div className="space-y-4 mt-6">
              {org.status === "Rejected" ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void updateStatus("Active")}
                  className="w-full flex items-center justify-between p-4 bg-emerald-500 rounded-2xl text-white transition-all shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span className="text-xs font-black uppercase tracking-widest">
                    Reapprove organization
                  </span>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : org.status === "Active" ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void updateStatus("Deactivated")}
                  className="w-full flex items-center justify-between p-4 bg-rose-100/40 hover:bg-rose-100/60 rounded-2xl border border-rose-200 transition-all text-rose-600 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span className="text-xs font-black uppercase tracking-widest">
                    Deactivate Account
                  </span>
                  <Power className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void updateStatus("Active")}
                  className="w-full flex items-center justify-between p-4 bg-emerald-500 rounded-2xl text-white transition-all shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span className="text-xs font-black uppercase tracking-widest">
                    Approve Account
                  </span>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  Current status:{" "}
                        <span
                    className={cn(
                      "inline-block ml-1 underline",
                      org.status === "Active"
                        ? "text-emerald-500"
                        : org.status === "Pending"
                          ? "text-amber-500"
                          : org.status === "Rejected"
                            ? "text-slate-700"
                            : "text-rose-500",
                    )}
                  >
                    {org.status}
                  </span>
                </p>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                  Last active: {org.lastActive}
                </p>
                {apiMessage ? (
                  <p className="text-xs font-medium text-slate-600 mt-3">
                    {apiMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:flex-1 min-w-0 space-y-6 sm:space-y-8">
          <PremiumTabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "services", label: "Services" },
              { id: "packages", label: "Packages" },
              { id: "promo", label: "Promo" },
              { id: "reviews", label: "Reviews" },
              { id: "team", label: "Team members" },
              { id: "transactions", label: "Transaction history" },
              { id: "gallery", label: "Gallery" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="space-y-6 sm:space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                <GlassCard
                  title="Business profile"
                  subtitle="Organizer record."
                >
                  <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">
                        Company banner
                      </p>
                      <div className="relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden border border-slate-100 bg-slate-100 aspect-[21/9] sm:aspect-[21/6]">
                        {org.companyBannerUrl ? (
                          <img
                            src={org.companyBannerUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            No banner
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Trade name
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          {org.tradeName}
                        </p>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Website
                        </p>
                        {org.website ? (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline break-all"
                          >
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            {org.website.replace(/^https?:\/\//, "")}
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-slate-400">—</span>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-0.5 sm:space-y-1">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Address
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                          {org.fullAddress}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Business license
                            </p>
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {org.businessLicenseDocument}
                            </p>
                          </div>
                        </div>
                        {org.businessLicenseFileUrl ? (
                          <a
                            href={org.businessLicenseFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 shadow-sm"
                          >
                            <Eye className="w-4 h-4" /> View
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">—</span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Trade registration
                            </p>
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {org.tradeRegistrationDocument}
                            </p>
                          </div>
                        </div>
                        {org.tradeRegistrationFileUrl ? (
                          <a
                            href={org.tradeRegistrationFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 shadow-sm"
                          >
                            <Eye className="w-4 h-4" /> View
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      label: "Completed",
                      value: org.completedJobs,
                      icon: Briefcase,
                      color: "blue",
                    },
                    {
                      label: "Earnings",
                      value: formatCurrency(org.earnings),
                      icon: TrendingUp,
                      color: "emerald",
                    },
                    {
                      label: "Response",
                      value:
                        org.responseRate == null ? "—" : `${org.responseRate}%`,
                      icon: Target,
                      color: "amber",
                    },
                  ].map((stat, i) => (
                    <GlassCard
                      key={i}
                      className="p-4 sm:p-6 text-center border-white/40"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border shadow-sm",
                          stat.color === "blue"
                            ? "bg-blue-50 text-blue-500 border-blue-100"
                            : stat.color === "emerald"
                              ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                              : "bg-amber-50 text-amber-500 border-amber-100",
                        )}
                      >
                        <stat.icon className="w-4 h-4 sm:w-5 h-5" />
                      </div>
                      <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 sm:mt-2">
                        {stat.label}
                      </p>
                    </GlassCard>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-8">
                  <GlassCard title="Subscription" subtitle="Plan details.">
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl gap-4">
                      <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Active Plan
                        </p>
                        <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2 sm:gap-3">
                          {org.subscriptionPlan} Tier
                          <Zap className="w-4 h-4 sm:w-5 h-5 text-amber-500 fill-amber-500" />
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Renewal
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          —
                        </p>
                      </div>
                    </div>
                  </GlassCard>

              
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6 sm:space-y-8">
                <GlassCard
                  title="Service areas"
                  subtitle="Operational regions."
                >
                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                    {org.serviceAreas.length === 0 ? (
                      <p className="text-sm font-bold text-slate-400">
                        No service areas listed.
                      </p>
                    ) : (
                      org.serviceAreas.map((area: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-primary/5 text-primary text-[10px] sm:text-[11px] font-bold border border-primary/10"
                        >
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-80" />
                          {area}
                        </span>
                      ))
                    )}
                  </div>
                </GlassCard>

                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {org.servicesOffered.length} Services
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {org.servicesOffered.length === 0 ? (
                    <GlassCard className="col-span-full py-12 text-center border-dashed border-slate-200">
                      <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        No services listed
                      </p>
                    </GlassCard>
                  ) : (
                    org.servicesOffered.map((service, i) => (
                      <GlassCard
                        key={`${service.service_id}-${i}`}
                        className="p-6 sm:p-8 group hover:border-primary/20 transition-all text-center"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary mx-auto mb-4 sm:mb-6 border border-primary/10 group-hover:rotate-12 transition-all">
                          <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          {service.category_name}
                        </p>
                        <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter leading-none mb-2">
                          {service.service_name}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 bg-slate-50 rounded-xl w-fit mx-auto mt-3 sm:mt-4 border border-slate-100">
                          <span className="text-lg sm:text-xl font-black text-slate-800">
                            ${service.price}
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                            / hr
                          </span>
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "packages" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Active Packages & Deals
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="col-span-full py-12 text-center border-dashed border-slate-200">
                    <Tag className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      No active packages found
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === "promo" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Promotion & Marketing Performance
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GlassCard className="col-span-full py-12 text-center border-dashed border-slate-200">
                    <Megaphone className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      No promotions currently active
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4 sm:space-y-6">
                {(() => {
                  const organizerReviews: OrganizerReview[] = [];
                  const topReviews = organizerReviews.slice(0, 5);

                  return (
                    <>
                      <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                        {organizerReviews.length} reviews submitted
                      </p>

                      {topReviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-2xl sm:text-3xl">
                            !
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-400">
                            No reviews yet for this organizer.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 sm:space-y-6">
                          {topReviews.map((review) => {
                            const filledStars = Math.floor(review.rating);
                            return (
                              <GlassCard key={review.id} className="p-5 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                                  <div className="flex items-center gap-2">
                                    <div className="flex bg-amber-50 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-amber-100 gap-1">
                                      {Array.from({ length: 5 }).map((_, j) => (
                                        <Star
                                          key={j}
                                          className={cn(
                                            "w-3 h-3 sm:w-4 sm:h-4",
                                            j < filledStars
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-slate-200",
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs sm:text-sm font-black text-slate-800 ml-1 sm:ml-2">
                                      {review.rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {review.date}
                                  </span>
                                </div>

                                <p className="text-sm sm:text-lg font-bold text-slate-600 italic leading-relaxed">
                                  "{review.comment}"
                                </p>

                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-50/50">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black border border-slate-100 shadow-inner text-[10px] sm:text-xs">
                                      {review.homeOwner
                                        ? review.homeOwner
                                            .split(" ")
                                            .map((x) => x[0])
                                            .join("")
                                            .toUpperCase()
                                        : "R"}
                                    </div>
                                    <div>
                                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Home owner
                                      </p>
                                      <p className="text-[10px] sm:text-xs font-bold text-primary">
                                        {review.homeOwner}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      Service
                                    </p>
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                                      {review.service}
                                    </p>
                                  </div>
                                </div>
                              </GlassCard>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6 sm:space-y-8">
                <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">
                  {currentTeamMembers.length} Team members
                </p>

                {currentTeamMembers.length === 0 ? (
                  <GlassCard className="p-10 sm:p-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 mx-auto">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-400">
                      No team members added for this organizer yet.
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {currentTeamMembers.map((member: TeamMember) => (
                      <GlassCard
                        key={member.id}
                        className="p-4 sm:p-6 border-white/60"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white shrink-0">
                            <img
                              src={member.profilePicture}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                              {member.name}
                            </h3>
                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                              {member.nationality}
                            </p>
                            <div className="mt-3 space-y-1">
                              <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate">
                                {member.email}
                              </p>
                              <p className="text-[10px] sm:text-xs font-bold text-slate-500">
                                {member.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-5 pt-4 border-t border-slate-100">
                          <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                            Services ({member.skills.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {member.skills.length === 0 ? (
                              <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                                No services assigned.
                              </span>
                            ) : (
                              member.skills.map((skill: string) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest"
                                >
                                  {skill}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-nowrap overflow-x-auto scrollbar-none items-center gap-2 mb-2 pb-1">
                  <TimeFilterTabs
                    activeTab={timeFilter === "custom" ? "" : timeFilter}
                    onChange={(id) => {
                      setTimeFilter(id);
                      if (id !== "custom") setDateRange(undefined);
                    }}
                  />

                  <DateRangePicker
                    range={dateRange}
                    onRangeChange={(range: DateRange | undefined) => {
                      setDateRange(range);
                      if (range) {
                        setTimeFilter("custom");
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      label: "Platform fee",
                      value: totalPlatformContribution * statsMultiplier,
                      icon: Wallet,
                      color: "primary",
                      subtitle: "Contributions",
                    },
                    {
                      label: "Gross volume",
                      value: totalGrossVolume * statsMultiplier,
                      icon: Receipt,
                      color: "emerald",
                      subtitle: `${Math.round(orgTransactions.length * statsMultiplier)} items`,
                    },
                    {
                      label: "Net to org",
                      value:
                        orgTransactions.reduce(
                          (s, t) => s + t.netToOrganizer,
                          0,
                        ) * statsMultiplier,
                      icon: TrendingUp,
                      color: "amber",
                      subtitle: "After fees",
                    },
                  ].map((stat, i) => (
                    <GlassCard key={i} className="p-5 sm:p-6 border-white/40">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border",
                            stat.color === "primary"
                              ? "bg-primary/10 text-primary border-primary/15"
                              : stat.color === "emerald"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100",
                          )}
                        >
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {stat.label}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">
                            {stat.subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">
                        {formatCurrency(stat.value)}
                      </p>
                    </GlassCard>
                  ))}
                </div>

                <GlassCard title="All transactions" subtitle="History record.">
                  {orgTransactions.length === 0 ? (
                    <p className="text-sm font-bold text-slate-400 text-center py-12">
                      No transactions recorded.
                    </p>
                  ) : (
                    <div className="mt-4 sm:mt-6 overflow-x-auto -mx-2 sm:mx-0 rounded-2xl border border-slate-100">
                      <table className="w-full min-w-[1000px] text-left">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/80">
                            <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Date
                            </th>
                            <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Customer
                            </th>
                            <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Service
                            </th>
                            <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                              Gross
                            </th>
                            <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-widest text-right">
                              Fee
                            </th>
                            <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orgTransactions.map((tx: any) => (
                            <tr
                              key={tx.id}
                              className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-[10px] sm:text-xs font-bold text-slate-700 whitespace-nowrap">
                                {tx.date}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <span className="text-[10px] sm:text-xs font-black text-slate-800 tracking-tight">
                                    {tx.customerName || "Manual Adj"}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400">
                                    {tx.customerEmail || tx.reference}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 min-w-[150px]">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Tag className="w-3 h-3 text-slate-400" />
                                  </div>
                                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
                                    {tx.serviceName || tx.type}
                                  </span>
                                </div>
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-3 text-[10px] sm:text-xs font-black text-right tabular-nums",
                                  tx.grossAmount < 0
                                    ? "text-rose-600"
                                    : "text-slate-800",
                                )}
                              >
                                {formatCurrency(tx.grossAmount)}
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-3 text-[10px] sm:text-xs font-black text-right tabular-nums",
                                  tx.platformFee < 0
                                    ? "text-rose-600"
                                    : "text-primary",
                                )}
                              >
                                {formatCurrency(tx.platformFee)}
                              </td>
                              <td className="px-4 py-3 text-right sm:text-left">
                                <span
                                  className={cn(
                                    "inline-flex px-2 py-0.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border",
                                    tx.status === "Completed"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                      : "bg-amber-50 text-amber-700 border-amber-100",
                                  )}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </GlassCard>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">
                  {org.galleryItems.length} Items
                </p>
                {org.galleryItems.length === 0 ? (
                  <GlassCard className="py-12 text-center border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      No gallery items yet.
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {org.galleryItems.map((item, i) => {
                      const label = formatGalleryKey(item.key) || `Item ${i + 1}`;
                      const showImage = isLikelyImageUrl(item.url);
                      return (
                        <div
                          key={`${item.key}-${i}`}
                          className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white group shadow-sm flex flex-col"
                        >
                          {showImage ? (
                            <img
                              src={item.url}
                              alt={label}
                              className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center gap-3 h-48 sm:h-56 bg-slate-50 p-6 text-center hover:bg-slate-100/80 transition-colors"
                            >
                              <FileText className="w-10 h-10 text-slate-400" />
                              <span className="text-[10px] sm:text-xs font-bold text-primary underline break-all line-clamp-3">
                                Open file
                              </span>
                            </a>
                          )}
                          <div className="p-3 bg-white/90 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] sm:text-xs font-bold text-slate-600">
                            <span className="uppercase tracking-widest truncate" title={item.key}>
                              {label}
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-slate-400 hover:text-primary"
                              aria-label="Open in new tab"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDetails;
