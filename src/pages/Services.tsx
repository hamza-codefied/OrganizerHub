import React, { useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader, GlassCard } from "../components/UI";
import {
  CATEGORIES as INITIAL_CATEGORIES,
  SERVICES as INITIAL_SERVICES,
} from "../data/mockData";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { cn } from "../lib/utils";
import { 
  Plus, FolderOpen, Tag, Edit3, Trash2,
  Home, Briefcase, Sparkles, Layers, X, Save
} from "lucide-react";
import CustomSelect from "../components/CustomSelect";

type Service = (typeof INITIAL_SERVICES)[0];

const ServicesPage = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    INITIAL_CATEGORIES[0]?.id ?? null,
  );

  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<
    (typeof categories)[0] | null
  >(null);
  const [categoryForm, setCategoryForm] = useState({ name: "" });

  // Category delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<
    (typeof categories)[0] | null
  >(null);

  // Service CRUD modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", category: "" });
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? categories[0];
  const activeCategoryName = activeCategory?.name ?? "";

  const filteredServices = services.filter(
    (service) => service.category === activeCategoryName,
  );

  const handleOpenCategoryModal = (category: any = null) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryForm({ name: category.name });
    } else {
      setCurrentCategory(null);
      setCategoryForm({ name: "" });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) return;

    if (currentCategory) {
      const oldName = currentCategory.name;
      const newName = categoryForm.name;
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === currentCategory.id ? { ...cat, name: newName } : cat,
        ),
      );
      setServices((prev) =>
        prev.map((s) =>
          s.category === oldName ? { ...s, category: newName } : s,
        ),
      );
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        parent: null,
        children: [],
      };
      setCategories([...categories, newCat]);
      setActiveCategoryId(newCat.id);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    const target = categories.find((c) => c.id === id) ?? null;
    setCategoryToDelete(target);
  };

  // Service CRUD handlers
  const categoryNames = categories.map((c) => c.name);
  const handleOpenServiceModal = (service: Service | null = null) => {
    if (service) {
      setCurrentService(service);
      setServiceForm({ name: service.name, category: service.category });
    } else {
      setCurrentService(null);
      setServiceForm({
        name: "",
        category: activeCategoryName || categoryNames[0] || "",
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceForm.name.trim()) return;
    const category =
      serviceForm.category.trim() || categoryNames[0] || "General";
    if (currentService) {
      setServices(
        services.map((s) =>
          s.id === currentService.id
            ? { ...s, name: serviceForm.name.trim(), category }
            : s,
        ),
      );
    } else {
      const newService: Service = {
        id: `s-${Date.now()}`,
        name: serviceForm.name.trim(),
        category,
        tags: [],
      };
      setServices([...services, newService]);
    }
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="Service"
        description="Define and refine the structural backbone of the OrganizeHub marketplace."
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all outline-none"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={() => handleOpenServiceModal()}
            className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Categories Section */}
        <div className="lg:w-1/3 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-primary" />
              Categories
            </h3>
          </div>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 sm:gap-3 scrollbar-none">
            {categories.map((cat) => (
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
                  )}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm border border-slate-100",
                          cat.id === activeCategoryId
                            ? "bg-primary text-white"
                            : "bg-white text-primary",
                        )}
                      >
                        {cat.name.includes("Home") ? (
                          <Home className="w-5 h-5 sm:w-6 h-6" />
                        ) : cat.name.includes("Event") ? (
                          <Sparkles className="w-5 h-5 sm:w-6 h-6" />
                        ) : cat.name.includes("Business") ? (
                          <Briefcase className="w-5 h-5 sm:w-6 h-6" />
                        ) : (
                          <Layers className="w-5 h-5 sm:w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={cn(
                            "font-black text-xs sm:text-sm tracking-tight transition-colors",
                            cat.id === activeCategoryId
                              ? "text-primary"
                              : "text-slate-800",
                          )}
                        >
                          {cat.name}
                        </h4>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCategoryModal(cat);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="lg:flex-1 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-4 h-4 text-secondary" />
              <span>{activeCategoryName || "Category"} Services</span>
            </h3>
          </div>

          <GlassCard className="p-0 overflow-hidden border-white/60 shadow-xl">
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                  <tr>
                    <th className="px-5 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Service
                    </th>
                    <th className="px-5 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50 transition-colors group text-xs sm:text-sm"
                    >
                      <td className="px-5 sm:px-8 py-4">
                        <span className="font-black text-slate-800 tracking-tight">
                          {service.name}
                        </span>
                      </td>
                      <td className="px-5 sm:px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenServiceModal(service);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                            aria-label="Edit service"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400 hover:text-primary transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteService(service);
                            }}
                            className="p-2 hover:bg-rose-50 rounded-lg transition-all"
                            aria-label="Delete service"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600 transition-colors" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100 italic font-black text-slate-200 text-xl">
                            !
                          </div>
                          <p className="font-bold text-slate-400 text-xs">
                            No services found.
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

      {/* Category Modal */}
      {isCategoryModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40"
              aria-hidden
            />
            <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">
                    {currentCategory ? "Edit Category" : "Add Category"}
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Group your services into categories.
                  </p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 sm:p-3 bg-slate-50 hover:bg-slate-100 rounded-xl sm:rounded-2xl text-slate-400 transition-all"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Home Organization"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-5 px-5 sm:px-8 text-xs sm:text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 py-4 primary-gradient text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <Save className="w-4 h-4" /> Save Category
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Service Create/Edit Modal */}
      {isServiceModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40"
              aria-hidden
            />
            <div
              className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">
                    {currentService ? "Edit Service" : "Add Service"}
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Service Listings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-2 sm:p-3 bg-slate-50 hover:bg-slate-100 rounded-xl sm:rounded-2xl text-slate-400 transition-all"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Home Organizing"
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-5 px-5 sm:px-8 text-xs sm:text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <CustomSelect
                    value={serviceForm.category || activeCategoryName}
                    onChange={(val) => setServiceForm({ ...serviceForm, category: val })}
                    options={categories.map(c => ({ value: c.name, label: c.name }))}
                    placeholder="Select Category"
                  />
                </div>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveService}
                  className="flex-1 py-4 primary-gradient text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <Save className="w-4 h-4" />{" "}
                  {currentService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Delete Service Confirmation */}
      {serviceToDelete &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div
              onClick={() => setServiceToDelete(null)}
              className="absolute inset-0 bg-slate-900/40"
              aria-hidden
            />
            <div
              className="relative w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <Trash2 className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  Delete Service
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-700">
                    “{serviceToDelete.name}”
                  </span>
                  ? This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setServiceToDelete(null)}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteService}
                  className="flex-1 py-4 bg-rose-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Delete Category Confirmation */}
      <ConfirmationDialog
        open={!!categoryToDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? All services under this category will be removed."
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (!categoryToDelete) return;
          const deletedId = categoryToDelete.id;
          const deletedName = categoryToDelete.name;
          setCategories((prev) => {
            const next = prev.filter((cat) => cat.id !== deletedId);
            setActiveCategoryId((prevActive) =>
              prevActive === deletedId ? (next[0]?.id ?? null) : prevActive,
            );
            return next;
          });
          setServices((prev) => prev.filter((s) => s.category !== deletedName));
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
};

export default ServicesPage;
