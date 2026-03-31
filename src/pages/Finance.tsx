import React, { useState } from "react";
import { PageHeader, StatCard } from "../components/UI";
import { DataTable } from "../components/DataTable";
import { TRANSACTIONS } from "../data/mockData";
import { formatCurrency, cn } from "../lib/utils";
import {
  DollarSign,
  TrendingUp,
  Megaphone,
  History,
  Download,
  Layers,
  CreditCard,
  Calendar,
} from "lucide-react";
import DetailsDialog from "../components/DetailsDialog";
import { DateRangePicker } from "../components/DateRangePicker";
import type { DateRange } from "react-day-picker";

const FinancePage = () => {
  type Transaction = (typeof TRANSACTIONS)[0];
  const [transactions, setTransactions] = useState<Transaction[]>(
    TRANSACTIONS as Transaction[],
  );

  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [typeFilter, setTypeFilter] = useState<string>("All");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState("");
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== "All" && tx.type !== typeFilter) return false;
    return true;
  });

  const getMultiplier = (filter: string) => {
    if (filter === "daily") return 0.04;
    if (filter === "weekly") return 0.18;
    if (filter === "monthly") return 1.0;
    if (filter === "yearly") return 12.0;
    if (filter === "custom" && customRange?.from) return 0.45;
    if (filter === "custom") return 0.0;
    return 1.0; // all
  };

  const mult = getMultiplier(dateFilter);

  const stats = {
    revenue: formatCurrency(2384.24 * mult),
    transactions: Math.floor(45 * mult),
    boost: formatCurrency(165.0 * mult),
    platformFees: formatCurrency(238.44 * mult),
    premiumSubs: formatCurrency(1194.0 * mult),
    standardSubs: formatCurrency(57.0 * mult),
    spotlight: formatCurrency(75.0 * mult),
    highlight: formatCurrency(90.0 * mult),
  };

  const transactionColumns = [
    {
      header: "Name",
      accessor: (tx: any) => (
        <span className="font-bold text-slate-800 text-[12px]">{tx.name}</span>
      ),
    },
    {
      header: "Email",
      className: "hidden md:table-cell",
      accessor: (tx: any) => (
        <span className="font-medium text-slate-500 text-[11px]">
          {tx.email}
        </span>
      ),
    },
    {
      header: "Category",
      accessor: (tx: any) => (
        <span className="font-bold text-slate-700 text-[11px] max-w-[200px] truncate block">
          {tx.category}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: (tx: any) => (
        <span
          className={cn(
            "px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
            tx.type === "Platform Fee"
              ? "bg-slate-100 border-slate-100 text-slate-500"
              : tx.type === "Refund"
                ? "bg-rose-500 border-rose-500 text-white"
                : tx.type.includes("Subscription")
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-amber-500 border-amber-500 text-white",
          )}
        >
          {tx.type}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: (tx: any) => (
        <span
          className={cn(
            "font-black text-[13px] tracking-tight",
            tx.amount < 0 ? "text-rose-500" : "text-slate-800",
          )}
        >
          {tx.amount < 0
            ? `-${formatCurrency(Math.abs(tx.amount))}`
            : formatCurrency(tx.amount)}
        </span>
      ),
    },
    {
      header: "Platform Fee",
      className: "hidden sm:table-cell",
      accessor: (tx: any) => (
        <span className="font-black text-slate-500 text-[12px] tracking-tight">
          ${tx.platformFee}
        </span>
      ),
    },
    {
      header: "Date",
      className: "hidden lg:table-cell",
      accessor: (tx: any) => (
        <span className="font-bold text-slate-500 text-[11px]">{tx.date}</span>
      ),
    },
    {
      header: "Method",
      className: "hidden lg:table-cell",
      accessor: (tx: any) => (
        <span className="font-bold text-slate-500 text-[11px]">
          {tx.method}
        </span>
      ),
    },
  ];

  const dateTabs = [
    { id: "all", label: "All" },
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
    { id: "custom", label: "Custom", icon: Calendar },
  ];

  const filterTabs = [
    "All",
    "Premium Subscriptions",
    "Standard Subscriptions",
    "Platform Fee",
    "Homepage Spotlight",
    "Highlighted Listing",
    "Refund",
  ];

  return (
    <>
      <div className="space-y-6 sm:space-y-10">
        <PageHeader title="Finance" description="Monitor revenue and payouts.">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 text-slate-600 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all outline-none">
              <Download className="w-4 h-4" />{" "}
              <span className="hidden xs:inline">Export</span>
            </button>
          </div>
        </PageHeader>

        <div className="flex flex-wrap items-center gap-2 mb-6 relative z-50">
          <div className="flex flex-wrap items-center gap-2">
            {dateTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateFilter(tab.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 outline-none",
                  dateFilter === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
                )}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>
          {dateFilter === "custom" && (
            <div className="ml-0 sm:ml-4 animate-in fade-in zoom-in-95 duration-200">
              <DateRangePicker
                range={customRange}
                onRangeChange={setCustomRange}
                placeholder="Select Custom Dates"
                className="mt-2 sm:mt-0 shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Row 1 Stats */}
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            icon={DollarSign}
            color="primary"
          />
          <StatCard
            title="Transactions"
            value={String(stats.transactions)}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Platform Fees"
            value={stats.platformFees}
            icon={Layers}
            color="emerald"
          />
        </div>

        {/* Row 2 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
          <StatCard
            title="Premium Subscriptions"
            value={stats.premiumSubs}
            icon={DollarSign}
            color="blue"
          />
          <StatCard
            title="Standard Subscriptions"
            value={stats.standardSubs}
            icon={DollarSign}
            color="orange"
          />
          <StatCard
            title="Homepage Spotlight"
            value={stats.spotlight}
            icon={DollarSign}
            color="primary"
          />
          <StatCard
            title="Highlighted Listing"
            value={stats.highlight}
            icon={DollarSign}
            color="emerald"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-8 mb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all outline-none",
                typeFilter === tab
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-hidden">
          <DataTable
            columns={transactionColumns}
            data={filteredTransactions}
            searchPlaceholder="Search transactions..."
            rowActions={[
              {
                label: "Details",
                icon: History,
                onClick: (tx: Transaction) => {
                  setDetailsTitle("Transaction details");
                  setDetailsPayload(tx);
                  setDetailsOpen(true);
                },
              },
            ]}
          />
        </div>
      </div>

      <DetailsDialog
        open={detailsOpen}
        title={detailsTitle}
        onClose={() => setDetailsOpen(false)}
      >
        <div className="mt-2 space-y-3">
          {detailsPayload && (
            <>
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Transaction ID
                  </p>
                  <p className="font-black text-slate-800">
                    {detailsPayload.id}
                  </p>
                </div>
                <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {detailsPayload.type}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Amount
                  </p>
                  <p
                    className={cn(
                      "font-black text-2xl tracking-tight",
                      detailsPayload.amount < 0
                        ? "text-rose-500"
                        : "text-slate-800",
                    )}
                  >
                    {detailsPayload.amount < 0
                      ? `-${formatCurrency(Math.abs(detailsPayload.amount))}`
                      : formatCurrency(detailsPayload.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Platform Fee
                  </p>
                  <p className="font-black text-lg text-slate-600 tracking-tight">
                    ${detailsPayload.platformFee}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="text-sm font-bold text-slate-600">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    User:
                  </span>{" "}
                  <span className="text-slate-800">
                    {detailsPayload.name} ({detailsPayload.email})
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-600">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    Category:
                  </span>{" "}
                  <span className="text-slate-800">
                    {detailsPayload.category}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-600">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    Date:
                  </span>{" "}
                  <span className="text-slate-800">{detailsPayload.date}</span>
                </div>
                <div className="text-sm font-bold text-slate-600 mt-2 flex items-center gap-2">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    Method:
                  </span>{" "}
                  <span className="text-slate-800 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {detailsPayload.method}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </DetailsDialog>
    </>
  );
};

export default FinancePage;
