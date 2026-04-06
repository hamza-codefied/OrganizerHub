import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { PageHeader, GlassCard } from "../components/UI";
import { cn } from "../lib/utils";
import { useAdminServices } from "../hooks/useAdminServices";
import {
  adminCreateCategory,
  adminCreateService,
  adminDeleteCategory,
  adminDeleteService,
} from "../lib/adminServicesApi";
import type { AdminServiceCategory } from "../lib/adminServicesApi";
import {
  FolderOpen,
  Tag,
  Home,
  Briefcase,
  Sparkles,
  Layers,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";

function sortCategories(cats: AdminServiceCategory[]): AdminServiceCategory[] {
  return [...cats].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.name.localeCompare(b.name);
  });
}

const ServicesPage = () => {
  const { data, error, isLoading, refetch } = useAdminServices();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [categoryModalError, setCategoryModalError] = useState<string | null>(null);
  const [serviceModalError, setServiceModalError] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingService, setCreatingService] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<AdminServiceCategory | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<{
    id: number;
    categoryId: number;
    name: string;
  } | null>(null);
  const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(null);
  const [deleteServiceError, setDeleteServiceError] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [deletingService, setDeletingService] = useState(false);
  const [catalogNotice, setCatalogNotice] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const closeCategoryModal = () => {
    if (creatingCategory) return;
    setCategoryModalOpen(false);
    setNewCategoryName("");
    setCategoryModalError(null);
  };

  const closeServiceModal = () => {
    if (creatingService) return;
    setServiceModalOpen(false);
    setNewServiceName("");
    setNewServiceDescription("");
    setServiceModalError(null);
  };

  const submitCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryModalError("Name is required.");
      return;
    }
    setCategoryModalError(null);
    setCreatingCategory(true);
    try {
      const res = await adminCreateCategory({ name });
      await refetch();
      setActiveCategoryId(res.cat_id);
      setCategoryModalOpen(false);
      setNewCategoryName("");
    } catch (e) {
      setCategoryModalError(e instanceof Error ? e.message : "Could not create category.");
    } finally {
      setCreatingCategory(false);
    }
  };

  const submitCreateService = async () => {
    if (!activeCategory) {
      setServiceModalError("Select a category first.");
      return;
    }
    const service_name = newServiceName.trim();
    if (!service_name) {
      setServiceModalError("Service name is required.");
      return;
    }
    setServiceModalError(null);
    setCreatingService(true);
    try {
      await adminCreateService({
        cat_id: activeCategory.id,
        service_name,
        service_description: newServiceDescription.trim(),
      });
      await refetch();
      setServiceModalOpen(false);
      setNewServiceName("");
      setNewServiceDescription("");
    } catch (e) {
      setServiceModalError(e instanceof Error ? e.message : "Could not create service.");
    } finally {
      setCreatingService(false);
    }
  };

  const closeDeleteCategoryModal = () => {
    if (deletingCategory) return;
    setCategoryToDelete(null);
    setDeleteCategoryError(null);
  };

  const closeDeleteServiceModal = () => {
    if (deletingService) return;
    setServiceToDelete(null);
    setDeleteServiceError(null);
  };

  const requestDeleteCategory = (cat: AdminServiceCategory, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (cat.services.length > 0) {
      setCatalogNotice({
        type: "error",
        text: `This category has ${cat.services.length} service${cat.services.length === 1 ? "" : "s"}. Remove them before deleting the category.`,
      });
      return;
    }
    setDeleteCategoryError(null);
    setCategoryToDelete(cat);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete || categoryToDelete.services.length > 0) {
      setDeleteCategoryError(
        categoryToDelete && categoryToDelete.services.length > 0
          ? "Remove all services in this category before deleting it."
          : "No category selected.",
      );
      return;
    }
    setDeleteCategoryError(null);
    setDeletingCategory(true);
    try {
      await adminDeleteCategory({ category_id: categoryToDelete.id });
      await refetch();
      setCatalogNotice({ type: "success", text: "Category deleted." });
      setCategoryToDelete(null);
    } catch (err) {
      setDeleteCategoryError(err instanceof Error ? err.message : "Could not delete category.");
    } finally {
      setDeletingCategory(false);
    }
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    setDeleteServiceError(null);
    setDeletingService(true);
    try {
      const res = await adminDeleteService({
        service_id: serviceToDelete.id,
        category_id: serviceToDelete.categoryId,
      });
      await refetch();
      const usage = res.active_usage_count;
      setCatalogNotice({
        type: "success",
        text:
          usage > 0
            ? `Service deleted. It had ${usage} active usage record${usage === 1 ? "" : "s"} on the platform.`
            : "Service deleted.",
      });
      setServiceToDelete(null);
    } catch (err) {
      setDeleteServiceError(err instanceof Error ? err.message : "Could not delete service.");
    } finally {
      setDeletingService(false);
    }
  };

  const sortedCategories = useMemo(
    () => sortCategories(data?.categories ?? []),
    [data?.categories],
  );

  useEffect(() => {
    if (!sortedCategories.length) return;
    const exists = activeCategoryId != null && sortedCategories.some((c) => c.id === activeCategoryId);
    if (activeCategoryId == null || !exists) {
      setActiveCategoryId(sortedCategories[0].id);
    }
  }, [sortedCategories, activeCategoryId]);

  const activeCategory = sortedCategories.find((c) => c.id === activeCategoryId) ?? null;
  const activeServices = useMemo(() => {
    const list = activeCategory?.services ?? [];
    return [...list].sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return a.name.localeCompare(b.name);
    });
  }, [activeCategory]);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Services"
        description="Categories and services available on the marketplace."
      >
        <button
          type="button"
          onClick={() => setCategoryModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-primary/30 bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add category
        </button>
        <button
          type="button"
          onClick={() => setServiceModalOpen(true)}
          disabled={!activeCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-secondary/30 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-secondary/20"
        >
          <Plus className="w-4 h-4" />
          Add service
        </button>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </PageHeader>

      {catalogNotice ? (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border text-sm",
            catalogNotice.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-900",
          )}
        >
          <p className="flex-1 font-medium">{catalogNotice.text}</p>
          <button
            type="button"
            onClick={() => setCatalogNotice(null)}
            className="text-xs font-bold uppercase tracking-wide underline-offset-2 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      ) : null}

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

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-lg border border-slate-200 min-h-[320px]">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Loading catalog…</span>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="lg:w-1/3 space-y-4 sm:space-y-6">
          <div className="px-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 min-w-0">
              <FolderOpen className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">
                Categories
                <span className="text-slate-300 font-bold normal-case">
                  {" "}
                  ({sortedCategories.length})
                </span>
              </span>
            </h3>
          </div>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 sm:gap-3 scrollbar-none">
            {sortedCategories.map((cat) => (
              <div
                key={cat.id}
                className="cursor-pointer shrink-0 lg:shrink"
                onClick={() => setActiveCategoryId(cat.id)}
              >
                <GlassCard
                  className={cn(
                    "p-3 sm:p-5 hover:border-primary/20 group border-white/60 relative overflow-hidden transition-all",
                    cat.id === activeCategoryId
                      ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
                      : "bg-white/40",
                    !cat.is_active && "opacity-70",
                  )}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm border border-slate-100 shrink-0",
                          cat.id === activeCategoryId
                            ? "bg-primary text-white"
                            : "bg-white text-primary",
                        )}
                      >
                        {cat.name.includes("Home") ? (
                          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : cat.name.includes("Event") ? (
                          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : cat.name.includes("Business") ? (
                          <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={cn(
                            "font-black text-xs sm:text-sm tracking-tight transition-colors truncate",
                            cat.id === activeCategoryId ? "text-primary" : "text-slate-800",
                          )}
                        >
                          {cat.name}
                        </h4>
                        {cat.description ? (
                          <p className="text-[10px] font-medium text-slate-500 line-clamp-2 mt-0.5">
                            {cat.description}
                          </p>
                        ) : null}
                        <p className="text-[9px] font-bold text-slate-400 mt-1">
                          {cat.services.length} service{cat.services.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => requestDeleteCategory(cat, e)}
                      disabled={cat.services.length > 0}
                      title={
                        cat.services.length > 0
                          ? "Remove all services before deleting this category"
                          : "Delete category"
                      }
                      className={cn(
                        "shrink-0 p-2 rounded-xl border transition-colors",
                        cat.services.length > 0
                          ? "border-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-100",
                      )}
                      aria-label={cat.services.length > 0 ? "Cannot delete: category has services" : "Delete category"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
          {!isLoading && sortedCategories.length === 0 && !error && (
            <p className="text-sm font-medium text-slate-500 px-2">No categories returned.</p>
          )}
        </div>

        {/* Services table */}
        <div className="lg:flex-1 space-y-4 sm:space-y-6 min-w-0">
          <div className="px-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 min-w-0">
              <Tag className="w-4 h-4 text-secondary shrink-0" />
              <span className="truncate">{activeCategory?.name ?? "Category"} — services</span>
            </h3>
          </div>

          <GlassCard className="p-0 overflow-hidden border-white/60 shadow-xl">
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left min-w-[480px]">
                <thead className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                  <tr>
                    <th className="px-5 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Service
                    </th>
                    <th className="px-5 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
                      Description
                    </th>
                    <th className="px-5 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest text-right w-28">
                      Status
                    </th>
                    <th className="px-5 sm:px-4 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest text-right w-24">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeServices.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                    >
                      <td className="px-5 sm:px-8 py-4 align-top">
                        <span className="font-black text-slate-800 tracking-tight block">
                          {service.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1 block truncate max-w-xs">
                          {service.slug}
                        </span>
                      </td>
                      <td className="px-5 sm:px-8 py-4 align-top hidden md:table-cell">
                        <span className="text-slate-600 font-medium text-[11px] sm:text-xs leading-relaxed line-clamp-3">
                          {service.description ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 sm:px-8 py-4 text-right align-top">
                        <span
                          className={cn(
                            "inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                            service.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200",
                          )}
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right align-top">
                        <button
                          type="button"
                          onClick={() =>
                            setServiceToDelete({
                              id: service.id,
                              categoryId: service.category_id,
                              name: service.name,
                            })
                          }
                          className="inline-flex p-2 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors"
                          title="Delete service"
                          aria-label={`Delete ${service.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && activeCategory && activeServices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100 italic font-black text-slate-200 text-xl">
                            !
                          </div>
                          <p className="font-bold text-slate-400 text-xs">
                            No services in this category.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>

      {categoryModalOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="services-add-category-title"
            >
              <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => {
                  if (!creatingCategory) closeCategoryModal();
                }}
                aria-hidden
              />
              <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2
                  id="services-add-category-title"
                  className="text-lg font-black text-slate-800"
                >
                  Add category
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  New categories appear in the catalog immediately after they are created.
                </p>
                {categoryModalError ? (
                  <p className="mt-3 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    {categoryModalError}
                  </p>
                ) : null}
                <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={creatingCategory}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="e.g. Home repairs"
                  autoFocus
                />
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    disabled={creatingCategory}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void submitCreateCategory()}
                    disabled={creatingCategory}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                  >
                    {creatingCategory ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Save
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {serviceModalOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="services-add-service-title"
            >
              <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => {
                  if (!creatingService) closeServiceModal();
                }}
                aria-hidden
              />
              <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2 id="services-add-service-title" className="text-lg font-black text-slate-800">
                  Add service
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {activeCategory ? (
                    <>
                      Adding to{" "}
                      <span className="font-semibold text-slate-800">{activeCategory.name}</span>.
                    </>
                  ) : (
                    "Select a category first."
                  )}
                </p>
                {serviceModalError ? (
                  <p className="mt-3 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    {serviceModalError}
                  </p>
                ) : null}
                <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  disabled={!activeCategory || creatingService}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="e.g. Emergency call-out"
                  autoFocus={!!activeCategory}
                />
                <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-500">
                  Description <span className="font-medium normal-case text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  disabled={!activeCategory || creatingService}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="What this service includes"
                />
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeServiceModal}
                    disabled={creatingService}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void submitCreateService()}
                    disabled={!activeCategory || creatingService}
                    className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creatingService ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Save
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {categoryToDelete && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="services-delete-category-title"
            >
              <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => {
                  if (!deletingCategory) closeDeleteCategoryModal();
                }}
                aria-hidden
              />
              <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2
                  id="services-delete-category-title"
                  className="text-lg font-black text-slate-800"
                >
                  Delete category?
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  This will permanently remove{" "}
                  <span className="font-semibold text-slate-800">{categoryToDelete.name}</span>. This
                  cannot be undone.
                </p>
                {deleteCategoryError ? (
                  <p className="mt-3 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    {deleteCategoryError}
                  </p>
                ) : null}
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDeleteCategoryModal}
                    disabled={deletingCategory}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void confirmDeleteCategory()}
                    disabled={deletingCategory}
                    className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {deletingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Delete
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {serviceToDelete && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="services-delete-service-title"
            >
              <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => {
                  if (!deletingService) closeDeleteServiceModal();
                }}
                aria-hidden
              />
              <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2 id="services-delete-service-title" className="text-lg font-black text-slate-800">
                  Delete service?
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  This will permanently remove{" "}
                  <span className="font-semibold text-slate-800">{serviceToDelete.name}</span> from
                  the catalog.
                </p>
                {deleteServiceError ? (
                  <p className="mt-3 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    {deleteServiceError}
                  </p>
                ) : null}
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDeleteServiceModal}
                    disabled={deletingService}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void confirmDeleteService()}
                    disabled={deletingService}
                    className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {deletingService ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Delete
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

export default ServicesPage;
