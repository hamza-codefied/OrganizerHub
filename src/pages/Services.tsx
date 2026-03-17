import React, { useState } from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import { CATEGORIES as INITIAL_CATEGORIES, SERVICES as INITIAL_SERVICES } from '../data/mockData';
import { cn } from '../lib/utils';
import { 
  Plus, FolderOpen, Tag, ChevronRight, Edit3, Trash2,
  Home, Briefcase, Heart, Sparkles, Layers, Search, X, Check, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesPage = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', children: [] as string[] });
  const [newSubCategory, setNewSubCategory] = useState('');

  // Get all unique tags
  const allTags = Array.from(new Set(services.flatMap(s => s.tags)));

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || service.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleOpenCategoryModal = (category: any = null) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryForm({ name: category.name, children: [...category.children] });
    } else {
      setCurrentCategory(null);
      setCategoryForm({ name: '', children: [] });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) return;

    if (currentCategory) {
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id ? { ...cat, name: categoryForm.name, children: categoryForm.children } : cat
      ));
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        parent: null,
        children: categoryForm.children
      };
      setCategories([...categories, newCat]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? All sub-sectors will be removed.')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const addSubcategory = () => {
    if (newSubCategory && !categoryForm.children.includes(newSubCategory)) {
      setCategoryForm({ ...categoryForm, children: [...categoryForm.children, newSubCategory] });
      setNewSubCategory('');
    }
  };

  const removeSubcategory = (sub: string) => {
    setCategoryForm({ ...categoryForm, children: categoryForm.children.filter(s => s !== sub) });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader 
        title="Service Architecture" 
        description="Define and refine the structural backbone of the OrganizeHub marketplace."
      >
        <button 
          onClick={() => handleOpenCategoryModal()}
          className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none"
        >
          <Plus className="w-4 h-4" />
          Blueprint Category
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Categories Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <FolderOpen className="w-4 h-4 text-primary" />
               Global Taxonomies
             </h3>
          </div>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-5 hover:border-primary/20 group border-white/60 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary group-hover:rotate-6 transition-all shadow-sm border border-slate-100">
                        {cat.name.includes('Home') ? <Home className="w-6 h-6" /> : 
                         cat.name.includes('Event') ? <Sparkles className="w-6 h-6" /> : 
                         cat.name.includes('Business') ? <Briefcase className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 tracking-tight">{cat.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{cat.children.length} Sub-Sectors</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenCategoryModal(cat)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1.5 overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500">
                    {cat.children.map((sub, j) => (
                      <span key={j} className="text-[9px] font-bold text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded-full border border-slate-200/50">
                        {sub}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          
          <div className="p-6 bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-white/60">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Coverage Analysis</p>
             <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden border border-white">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(categories.length / 6) * 100}%` }}></div>
             </div>
             <p className="text-[10px] font-bold text-slate-500 mt-2 text-center italic">Marketplace sector distribution is scaling optimally.</p>
          </div>
        </div>

        {/* Services Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag className="w-4 h-4 text-secondary" />
              Strategic Service Listings
            </h3>
            <div className="relative group min-w-[240px] w-full sm:w-auto">
               <input 
                 type="text" 
                 placeholder="Locate entity..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white/40 border border-white/60 rounded-xl py-2 pl-9 pr-3 text-xs font-bold outline-none focus:bg-white transition-all shadow-sm" 
               />
               <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          {/* Tag Filter Bar */}
          <div className="flex flex-wrap gap-2 px-2">
             <button
               onClick={() => setSelectedTag(null)}
               className={cn(
                 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                 !selectedTag ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/40 text-slate-400 border-white/60 hover:bg-white hover:text-slate-600"
               )}
             >
               All Signals
             </button>
             {allTags.map(tag => (
               <button
                 key={tag}
                 onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                 className={cn(
                   "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                   selectedTag === tag ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" : "bg-white/40 text-slate-400 border-white/60 hover:bg-white hover:text-slate-600"
                 )}
               >
                 #{tag}
               </button>
             ))}
          </div>

          <GlassCard className="p-0 overflow-hidden border-white/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Identity</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Sector</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Tags</th>
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
                        <td className="px-8 py-5">
                          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                            {service.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-wrap gap-2">
                            {service.tags.map((tag, i) => (
                              <span key={i} className={cn(
                                "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md",
                                tag === 'eco-friendly' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                tag === 'women-owned' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                'bg-primary/5 text-primary border border-primary/10'
                              )}>#{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all">
                              <Edit3 className="w-4 h-4 text-slate-400 hover:text-primary transition-colors" />
                            </button>
                            <button className="p-2.5 hover:bg-rose-50 rounded-xl transition-all">
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600 transition-colors" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">!</div>
                          <p className="font-bold text-slate-400">No service entities match the current signal filters.</p>
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
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
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
                    {currentCategory ? 'Refine Taxonomy' : 'Blueprint Category'}
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

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector Nodes (Subcategories)</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 min-h-[100px] align-start">
                    {categoryForm.children.map((sub, i) => (
                      <span key={i} className="flex items-center gap-2 bg-white border border-slate-100 pl-3 pr-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 shadow-sm">
                        {sub}
                        <button onClick={() => removeSubcategory(sub)} className="p-0.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-md transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-2 w-full mt-2">
                      <input 
                        type="text" 
                        placeholder="Define new sector..."
                        value={newSubCategory}
                        onKeyDown={(e) => e.key === 'Enter' && addSubcategory()}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold outline-none py-1 px-2 border-b border-dashed border-slate-200 focus:border-primary/40 transition-all placeholder:text-slate-300"
                      />
                      <button 
                        onClick={addSubcategory}
                        className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesPage;
