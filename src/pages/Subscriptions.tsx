import React, { useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader, GlassCard, StatCard, PremiumTabs } from "../components/UI";
import { DataTable } from "../components/DataTable";
import { DateRangePicker } from "../components/DateRangePicker";
import type { DateRange } from "react-day-picker";
import {
  SUBSCRIPTION_PLANS as INITIAL_PLANS,
  ORGANIZERS,
} from "../data/mockData";
import { cn, formatCurrency } from "../lib/utils";
import { organizerActivateSubscription } from "../lib/edgeFunctions";
import {
  Check,
  Shield,
  Zap,
  Layers,
  Users,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  X,
  BarChart,
  Megaphone,
  ArrowUpCircle,
  Briefcase
} from "lucide-react";

const SubscriptionsPage = () => {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: 0,
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenPlanModal = (plan: any = null) => {
    if (plan) {
      setCurrentPlan(plan);
      setPlanForm({
        name: plan.name,
        price: plan.price,
        features: [...plan.features],
      });
    } else {
      setCurrentPlan(null);
      setPlanForm({ name: "", price: 0, features: [] });
    }
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name) return;
    if (currentPlan) {
      setPlans(
        plans.map((p) => (p.id === currentPlan.id ? { ...p, ...planForm } : p)),
      );
    } else {
      setPlans([...plans, { id: `p-${Date.now()}`, ...planForm }]);
    }
    setIsPlanModalOpen(false);
  };

  const addFeature = () => {
    if (newFeature && !planForm.features.includes(newFeature)) {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, newFeature],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (feat: string) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((f) => f !== feat),
    });
  };

  const filteredSubscribers = ORGANIZERS.filter((org) => {
    if (dateRange?.from && dateRange?.to) {
      const expiry = new Date(org.subscriptionExpiry);
      return expiry >= dateRange.from && expiry <= dateRange.to;
    }
    return true;
  });

  const subscriberColumns = [
    {
      header: "Organizer",
      accessor: (org: any) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
             <span className="font-black text-slate-800 text-[13px] truncate">{org.name}</span>
             <span className="text-[10px] font-medium text-slate-500 truncate">{org.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Company",
      accessor: (org: any) => (
         <div className="flex flex-col">
           <span className="font-bold text-slate-700 text-[12px] truncate max-w-[150px]">
             {org.businessName || org.tradeName || 'Independent'}
           </span>
         </div>
      )
    },
    {
      header: "Plan",
      accessor: (org: any) => (
        <span
          className={cn(
            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
            org.subscriptionPlan === "Premium"
              ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-slate-50 text-slate-400 border-slate-100",
          )}
        >
          {org.subscriptionPlan}
        </span>
      )
    },
    {
      header: "Auto-renew",
      className: "hidden md:table-cell",
      accessor: (org: any) => (
        <span
          className={cn(
            "text-[9px] font-black uppercase tracking-widest",
            org.autoRenew ? "text-emerald-500" : "text-rose-500",
          )}
        >
          {org.autoRenew ? "Enabled" : "Disabled"}
        </span>
      )
    },
    {
      header: "Expires",
      accessor: (org: any) => (
        <p className="text-[11px] font-black text-slate-500 tracking-tight">
          {org.subscriptionExpiry}
        </p>
      )
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      <PageHeader
        title="Subscriptions"
        description="Manage plans and subscribers."
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <PremiumTabs
            tabs={[
              { id: "monthly", label: "Monthly" },
              { id: "yearly", label: "Yearly" },
            ]}
            activeTab={billingCycle}
            onChange={setBillingCycle}
            className="w-full sm:w-auto"
          />
          <button
            onClick={() => handleOpenPlanModal()}
            className="flex items-center justify-center gap-2 primary-gradient text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all outline-none whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New plan
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {plans.map((plan) => (
          <div key={plan.id}>
            <GlassCard
              className={cn(
                "relative overflow-hidden group p-6 sm:p-10 h-full border border-slate-200 shadow-sm flex flex-col",
                plan.name === "Premium"
                  ? "border-primary/30 bg-slate-50/50"
                  : "",
              )}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleOpenPlanModal(plan)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-primary shadow-sm border border-slate-100 bg-white/50 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPlans(plans.filter(p => p.id !== plan.id))}
                  className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 bg-white/50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {plan.name === "Premium" && (
                <div className="absolute top-8 right-[-45px] rotate-45 bg-gradient-to-r from-primary to-primary-700 text-white text-[9px] font-black px-12 py-1.5 shadow-xl tracking-[0.2em] uppercase">
                  Popular
                </div>
              )}

              <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                <div
                  className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center border-2 border-white shadow-xl transition-all duration-500 group-hover:rotate-6",
                    plan.name === "Premium"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {plan.name === "Premium" ? (
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
                  ) : (
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">
                    {plan.name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Plan
                  </p>
                </div>
              </div>

              <div className="mb-6 sm:mb-8 pb-6 border-b border-slate-100/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">
                    {formatCurrency(
                      billingCycle === "yearly" ? plan.price * 10 : plan.price,
                    ).replace(".00", "")}
                  </span>
                  <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
                    / {billingCycle === "yearly" ? "year" : "month"}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 sm:space-y-5 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-bold text-slate-600"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Check
                        className="w-3 h-3 text-emerald-500"
                        strokeWidth={4}
                      />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        ))}
      </div>

      <div className="pt-6 sm:pt-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Who's subscribed
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <StatCard
              title="Subscribers"
              value="1,402"
              icon={Users}
              className="py-3 px-6 h-auto sm:min-w-[200px]"
              color="primary"
            />
            <StatCard
              title="Revenue"
              value={formatCurrency(12400)}
              icon={TrendingUp}
              className="py-3 px-6 h-auto sm:min-w-[200px]"
              color="blue"
            />
          </div>
        </div>

        <div className="mb-4">
           {apiMessage ? (
              <div className="px-5 sm:px-8 py-3 rounded-lg border border-primary/20 bg-primary/5 mb-4">
                <p className="text-xs text-primary font-bold">{apiMessage}</p>
              </div>
            ) : null}
            <DataTable 
              columns={subscriberColumns} 
              data={filteredSubscribers} 
              searchPlaceholder="Search active subscribers..." 
              belowSearch={
                <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full xl:w-auto relative z-50">
                  <DateRangePicker 
                    range={dateRange}
                    onRangeChange={setDateRange}
                    placeholder="Filter by expiry date"
                  />
                  {dateRange && (
                    <button 
                      onClick={() => setDateRange(undefined)}
                      className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-2 py-2 hover:bg-rose-50 rounded-lg transition-colors shrink-0 outline-none"
                    >
                      Clear dates
                    </button>
                  )}
                </div>
              }
              rowActions={[
                {
                  label: "Activate Plan",
                  icon: Layers,
                  onClick: (org: any) => {
                     setIsSubmitting(true);
                     setApiMessage("");
                     void organizerActivateSubscription({
                       organization_id: String(org.id),
                       plan_slug: org.subscriptionPlan === "Premium" ? "premium" : "standard",
                       billing_cycle: billingCycle,
                       provider: "manual",
                       provider_subscription_id: "",
                     })
                     .then(() => setApiMessage(`New cycle activated for ${org.name}.`))
                     .catch((error: any) =>
                       setApiMessage(error?.message || "Failed to activate subscription."),
                     )
                     .finally(() => setIsSubmitting(false));
                  }
                }
              ]}
            />
        </div>
      </div>

      {/* Plan Modal */}
      {isPlanModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div
              onClick={() => setIsPlanModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40"
              aria-hidden
            />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-10">
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tighter">
                    {currentPlan ? "Edit plan" : "Create plan"}
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Set plan name, price, and features
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-2 sm:p-3 bg-slate-50 hover:bg-slate-100 rounded-xl sm:rounded-2xl text-slate-400 transition-all"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                <div className="space-y-4 sm:space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Plan name
                    </label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-5 px-5 sm:px-8 text-xs sm:text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all"
                      placeholder="Standard, Premium, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Price per month ($)
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm sm:text-base">
                        $
                      </div>
                      <input
                        type="number"
                        value={planForm.price}
                        onChange={(e) =>
                          setPlanForm({
                            ...planForm,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-5 pl-10 sm:pl-12 pr-6 text-xs sm:text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-8">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Features
                  </label>
                  <div className="space-y-4 p-4 sm:p-8 bg-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 min-h-[180px] sm:min-h-[220px]">
                    <div className="flex flex-wrap gap-2">
                      {planForm.features.map((feat, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-2 bg-white border border-slate-100 pl-3 pr-2 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
                        >
                          {feat.toLowerCase().includes("analytics") && (
                            <BarChart className="w-3 h-3 text-primary" />
                          )}
                          {feat.toLowerCase().includes("promotion") && (
                            <Megaphone className="w-3 h-3 text-emerald-500" />
                          )}
                          {feat.toLowerCase().includes("visibility") && (
                            <ArrowUpCircle className="w-3 h-3 text-amber-500" />
                          )}
                          {feat}
                          <button
                            onClick={() => removeFeature(feat)}
                            className="ml-1 p-0.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/50">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addFeature()}
                        placeholder="Add feature..."
                        className="flex-1 bg-transparent text-[10px] sm:text-xs font-bold outline-none border-b border-dashed border-slate-300 focus:border-primary/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg sm:rounded-xl hover:bg-primary/20 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-4">
                      {[
                        "Analytics Access",
                        "Promotions",
                        "Visibility Boost",
                        "Priority Support",
                      ].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() =>
                            !planForm.features.includes(f) &&
                            setPlanForm({
                              ...planForm,
                              features: [...planForm.features, f],
                            })
                          }
                          className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest p-2 bg-white border border-slate-100 rounded-lg hover:border-primary/20 text-slate-400 hover:text-primary transition-all text-left truncate"
                        >
                          + {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="flex-1 py-4 flex items-center justify-center bg-slate-50 text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl hover:bg-slate-100 transition-all order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="flex-1 py-4 primary-gradient text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  Save plan
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SubscriptionsPage;
