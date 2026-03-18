import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader, GlassCard } from '../components/UI';
import { CATEGORIES as INITIAL_CATEGORIES, SERVICES as INITIAL_SERVICES } from '../data/mockData';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { cn } from '../lib/utils';
import { 
  Plus, FolderOpen, Tag, Edit3, Trash2,
  Home, Briefcase, Sparkles, Layers, X, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Service = typeof INITIAL_SERVICES[0];

const ServicesPage = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(INITIAL_CATEGORIES[0]?.id ?? null);
  
  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<typeof categories[0] | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // Category delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<typeof categories[0] | null>(null);

  // Service CRUD modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', category: '' });
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0];
  const activeCategoryName = activeCategory?.name ?? '';

  const filteredServices = services.filter((service) => service.category === activeCategoryName);

  const handleOpenCategoryModal = (category: any = null) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryForm({ name: category.name });
    } else {
      setCurrentCategory(null);
      setCategoryForm({ name: '' });
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
          cat.id === currentCategory.id ? { ...cat, name: newName } : cat
        )
      );
      setServices((prev) => prev.map((s) => (s.category === oldName ? { ...s, category: newName } : s)));
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        parent: null,
        children: []
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
  const categoryNames = categories.map(c => c.name);
  const handleOpenServiceModal = (service: Service | null = null) => {
    if (service) {
      setCurrentService(service);
      setServiceForm({ name: service.name, category: service.category });
    } else {
      setCurrentService(null);
      setServiceForm({ name: '', category: activeCategoryName || categoryNames[0] || '' });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceForm.name.trim()) return;
    const category = serviceForm.category.trim() || categoryNames[0] || 'General';
    if (currentService) {
      setServices(services.map(s =>
        s.id === currentService.id
          ? { ...s, name: serviceForm.name.trim(), category }
          : s
      ));
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
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader 
        title="Service" 
        description="Define and refine the structural backbone of the OrganizeHub marketplace."
      >
        <button 
          onClick={() => handleOpenCategoryModal()}
          className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Categories Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <FolderOpen className="w-4 h-4 text-primary" />
               Categories
             </h3>
          </div>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="cursor-pointer"
                onClick={() => setActiveCategoryId(cat.id)}
              >
                <GlassCard
                  className={cn(
                    "p-5 hover:border-primary/20 group border-white/60 relative overflow-hidden transition-colors",
                    cat.id === activeCategoryId && "border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary group-hover:rotate-6 transition-all shadow-sm border border-slate-100">
                        {cat.name.includes('Home') ? <Home className="w-6 h-6" /> : 
                         cat.name.includes('Event') ? <Sparkles className="w-6 h-6" /> : 
                         cat.name.includes('Business') ? <Briefcase className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 tracking-tight">{cat.name}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenCategoryModal(cat); }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                        className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sidebar categories are intentionally simple (no sub-sectors). */}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag className="w-4 h-4 text-secondary" />
              Services in {activeCategoryName || 'Category'}
            </h3>
            <button
              type="button"
              onClick={() => handleOpenServiceModal()}
              className="flex items-center gap-2 primary-gradient text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>

          <GlassCard className="p-0 overflow-hidden border-white/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Name</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode='popLayout'>
                    {filteredServices.map((service, idx) => (
                      <motion.tr 
                        key={service.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        layout
                        className="hover:bg-white/60 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <span className="font-black text-slate-800 text-sm tracking-tight">{service.name}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleOpenServiceModal(service); }}
                              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                              aria-label="Edit service"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400 hover:text-primary transition-colors" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeleteService(service); }}
                              className="p-2.5 hover:bg-rose-50 rounded-xl transition-all"
                              aria-label="Delete service"
                            >
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600 transition-colors" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">!</div>
                          <p className="font-bold text-slate-400">No services found in this category.</p>
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
      {isCategoryModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
                    {currentCategory ? 'Rename Category' : 'Blueprint Category'}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Marketplace Governance</p>
                </div>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Designation</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Home Organization"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

              </div>

              <div className="mt-10 flex gap-3">
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Abort Protocol
                </button>
                <button 
                  onClick={handleSaveCategory}
                  className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Configuration
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* Service Create/Edit Modal */}
      {isServiceModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
                    {currentService ? 'Edit Service' : 'Add Service'}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Service Listings</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Home Organizing"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="bg-slate-100 text-slate-600 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200">
                    {serviceForm.category || activeCategoryName}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveService}
                  className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {currentService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* Delete Service Confirmation */}
      {serviceToDelete && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setServiceToDelete(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <Trash2 className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Delete Service</h2>
                <p className="text-sm font-medium text-slate-500 mt-2">
                  Are you sure you want to delete <span className="font-bold text-slate-700">“{serviceToDelete.name}”</span>? This cannot be undone.
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
            </motion.div>
          </div>,
          document.body
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
            setActiveCategoryId((prevActive) => (prevActive === deletedId ? next[0]?.id ?? null : prevActive));
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
