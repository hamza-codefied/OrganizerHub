import { useState } from 'react';
import { PageHeader, GlassCard, PremiumTabs } from '../components/UI';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DetailsDialog from '../components/DetailsDialog';
import CustomSelect from '../components/CustomSelect';
import { 
  FileText, Globe, Layout, 
  Edit3, Eye, Plus, Settings as SettingsIcon,
  Sparkles, Layers, Shield, Bookmark, 
  Smartphone, Newspaper,
  ArrowUpRight, Trash2, CheckCircle2, Zap
} from 'lucide-react';

const CMSPage = () => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'static' | 'articles'>('visuals');

  type HeroSlide = { id: string; title: string; img: string; status: string; type: string };
  type Segment = { id: string; title: string; items: string; status: string; icon: 'Sparkles' | 'Bookmark' | 'Zap' };
  type StaticItem = { id: string; name: string; updated: string; sector: string; icon: 'Shield' | 'FileText' | 'Globe' | 'CheckCircle2' | 'Layers' | 'Smartphone' };
  type Article = { id: string; title: string; author: string; date: string; cat: string };

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: 'slide-1',
      title: 'Spring Harvest Collection',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=200&fit=crop',
      status: 'Live Deployment',
      type: 'Main Banner',
    },
    {
      id: 'slide-2',
      title: 'Global Pro Onboarding',
      img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=200&fit=crop',
      status: 'Scheduled Index',
      type: 'Sub Banner',
    },
  ]);

  const [segments, setSegments] = useState<Segment[]>([
    { id: 'seg-1', title: 'Eco-Friendly Elite', items: '12 Slots', status: 'Active', icon: 'Sparkles' },
    { id: 'seg-2', title: 'Top Global Organizers', items: '8 Slots', status: 'Dynamic', icon: 'Bookmark' },
    { id: 'seg-3', title: 'Limited Time Flash Pro', items: 'Unlimited', status: 'Inactive', icon: 'Zap' },
  ]);

  const [staticRegistry] = useState<StaticItem[]>([
    { id: 'static-1', name: 'Global Terms of Service', updated: '2 Hours Ago', sector: 'Legal', icon: 'Shield' },
    { id: 'static-2', name: 'Privacy Assurance Protocol', updated: '1 Month Ago', sector: 'Privacy', icon: 'FileText' },
    { id: 'static-3', name: 'Strategic Corporate Narrative', updated: '3 Months Ago', sector: 'About', icon: 'Globe' },
    { id: 'static-4', name: 'Pro Verification Guidelines', updated: '1 Week Ago', sector: 'Guidelines', icon: 'CheckCircle2' },
    { id: 'static-5', name: 'Help & Operations Center', updated: 'Today', sector: 'Support', icon: 'Layers' },
    { id: 'static-6', name: 'Community Standards', updated: 'Yesterday', sector: 'Rules', icon: 'Smartphone' },
  ]);

  const [articles, setArticles] = useState<Article[]>([
    { id: 'art-1', title: 'Sustainable Space: The 2024 Index', author: 'Admin Delta', date: 'Mar 12', cat: 'Lifestyle' },
    { id: 'art-2', title: 'Mastering Minimalist Office Flow', author: 'Pro Hub', date: 'Mar 10', cat: 'Business' },
    { id: 'art-3', title: 'The Psychology of Decluttering', author: 'Insight Team', date: 'Mar 08', cat: 'Science' },
  ]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsMode, setDetailsMode] = useState<'view' | 'edit'>('view');
  const [modalKind, setModalKind] = useState<'slide' | 'segment' | 'article' | 'static' | 'config'>('slide');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  // Editing forms (CMS is currently mock/state-based)
  const [slideForm, setSlideForm] = useState<{ title: string; img: string; status: string; type: string }>({
    title: '',
    img: '',
    status: '',
    type: '',
  });
  const [segmentForm, setSegmentForm] = useState<{ title: string; items: string; status: string; icon: Segment['icon'] }>({
    title: '',
    items: '',
    status: '',
    icon: 'Sparkles',
  });
  const [articleForm, setArticleForm] = useState<{ title: string; author: string; date: string; cat: string }>({
    title: '',
    author: '',
    date: '',
    cat: '',
  });

  const [deleteTarget, setDeleteTarget] = useState<null | { kind: 'slide' | 'segment' | 'article'; id: string }>(null);

  const openView = (title: string, payload: any) => {
    setDetailsMode('view');
    setDetailsTitle(title);
    setDetailsPayload(payload);
    // Infer which kind of details we are showing (CMS is mock/state-based).
    let inferredKind: 'slide' | 'segment' | 'article' | 'static' | 'config' = 'config';
    if (payload && typeof payload === 'object') {
      if ('img' in payload && 'type' in payload) inferredKind = 'slide';
      else if ('items' in payload && 'icon' in payload) inferredKind = 'segment';
      else if ('author' in payload && 'cat' in payload) inferredKind = 'article';
      else if ('sector' in payload && 'updated' in payload) inferredKind = 'static';
      else if ('module' in payload) inferredKind = 'config';
    }
    setModalKind(inferredKind);
    setDetailsOpen(true);
  };

  const openEditSlide = (slide: HeroSlide) => {
    setModalKind('slide');
    setDetailsMode('edit');
    setDetailsTitle('Edit Hero Slide');
    setDetailsPayload(slide);
    setSlideForm({ title: slide.title, img: slide.img, status: slide.status, type: slide.type });
    setDetailsOpen(true);
  };

  const openEditSegment = (seg: Segment) => {
    setModalKind('segment');
    setDetailsMode('edit');
    setDetailsTitle('Edit Segment');
    setDetailsPayload(seg);
    setSegmentForm({ title: seg.title, items: seg.items, status: seg.status, icon: seg.icon });
    setDetailsOpen(true);
  };

  const openEditArticle = (post: Article) => {
    setModalKind('article');
    setDetailsMode('edit');
    setDetailsTitle('Edit Article');
    setDetailsPayload(post);
    setArticleForm({ title: post.title, author: post.author, date: post.date, cat: post.cat });
    setDetailsOpen(true);
  };

  const cancelDetails = () => {
    setDetailsOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'slide') setHeroSlides((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    if (deleteTarget.kind === 'segment') setSegments((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    if (deleteTarget.kind === 'article') setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDetailsOpen(false);
    setDeleteTarget(null);
  };

  const saveSlideEdits = () => {
    if (!detailsPayload) return;
    const slide = detailsPayload as HeroSlide;
    setHeroSlides((prev) => prev.map((s) => (s.id === slide.id ? { ...s, ...slideForm } : s)));
    setDetailsOpen(false);
  };

  const saveSegmentEdits = () => {
    if (!detailsPayload) return;
    const seg = detailsPayload as Segment;
    setSegments((prev) => prev.map((s) => (s.id === seg.id ? { ...s, ...segmentForm } : s)));
    setDetailsOpen(false);
  };

  const saveArticleEdits = () => {
    if (!detailsPayload) return;
    const post = detailsPayload as Article;
    setArticles((prev) => prev.map((a) => (a.id === post.id ? { ...a, ...articleForm } : a)));
    setDetailsOpen(false);
  };

  return (
    <div className="space-y-12">
      <PageHeader 
        title="Content Command" 
        description="Strategic oversight of platform narrative. Manage assets, static deployments, and metadata."
      >
        <PremiumTabs 
          tabs={[
            { id: 'visuals', label: 'Interface Visuals' },
            { id: 'static', label: 'Static Registry' },
            { id: 'articles', label: 'Strategic Narrative' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </PageHeader>

        {activeTab === 'visuals' && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10"
          >
            <GlassCard title="Hero Velocity" subtitle="Landing assets.">
              <div className="space-y-4 sm:space-y-6 mt-6">
                 {heroSlides.map((slide, i) => (
                   <div key={slide.id} className="group relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-white shadow-xl">
                      <img src={slide.img} alt="" className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 sm:p-8 flex flex-col justify-end">
                         <div className="flex justify-between items-end">
                            <div className="space-y-0.5 sm:space-y-1">
                               <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                  <span className="px-1.5 py-0.5 bg-primary rounded text-[6px] sm:text-[7px] font-black text-white uppercase tracking-widest">{slide.type}</span>
                                  <span className="text-white/40 text-[6px] sm:text-[7px] font-black uppercase tracking-widest">{slide.status}</span>
                               </div>
                               <p className="text-white font-black text-sm sm:text-xl tracking-tight leading-tight">{slide.title}</p>
                            </div>
                            <div className="flex gap-1.5 sm:gap-2">
                               <button
                                 type="button"
                                 onClick={() => openEditSlide(slide)}
                                 className="p-2 sm:p-3 bg-white/10 hover:bg-primary text-white rounded-lg sm:rounded-xl backdrop-blur-xl transition-all border border-white/20"
                               >
                                 <Edit3 className="w-3.5 h-3.5 sm:w-4 h-4" />
                               </button>
                               <button
                                 type="button"
                                 onClick={() => openView('Hero Details', slide)}
                                 className="p-2 sm:p-3 bg-white/10 hover:bg-white text-slate-800 rounded-lg sm:rounded-xl backdrop-blur-xl transition-all border border-white/20"
                               >
                                 <Eye className="w-3.5 h-3.5 sm:w-4 h-4" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
                 <button
                   type="button"
                   onClick={() => {
                     const newSlide: HeroSlide = {
                       id: `slide-${Date.now()}`,
                       title: 'New Hero Node',
                       img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=200&fit=crop',
                       status: 'Scheduled Index',
                       type: 'Main Banner',
                     };
                     setHeroSlides((prev) => [newSlide, ...prev]);
                   }}
                   className="w-full py-4 sm:py-6 border-2 border-dashed border-slate-200 rounded-3xl sm:rounded-[2.5rem] text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all outline-none"
                 >
                   + Add Hero Node
                 </button>
              </div>
            </GlassCard>

            <GlassCard title="Segments" subtitle="Curated homepage sections.">
               <div className="space-y-3 sm:space-y-4 mt-6">
                  {segments.map((section, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-primary/10">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:rotate-6 shadow-sm border border-slate-100 transition-all">
                             {section.icon === 'Sparkles' ? (
                               <Sparkles className="w-6 h-6" />
                             ) : section.icon === 'Bookmark' ? (
                               <Bookmark className="w-6 h-6" />
                             ) : (
                               <Zap className="w-6 h-6" />
                             )}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-800 tracking-tight">{section.title}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{section.items} Protocol • {section.status}</p>
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            type="button"
                            onClick={() => openEditSegment(section)}
                            className="p-2.5 text-slate-400 hover:text-primary transition-colors"
                            aria-label="Edit segment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ kind: 'segment', id: section.id })}
                            className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors"
                            aria-label="Delete segment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newSeg: Segment = {
                        id: `seg-${Date.now()}`,
                        title: 'New Segment',
                        items: '6 Slots',
                        status: 'Active',
                        icon: 'Sparkles',
                      };
                      setSegments((prev) => [newSeg, ...prev]);
                    }}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" /> Inject New Segment
                  </button>
               </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'static' && (
          <div
            className="grid grid-cols-1 lg:grid-cols-1 gap-10"
          >
            <GlassCard title="Global Static Registry" subtitle="Legal frameworks, corporate narrative, and aid architecture.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 {[
                   { name: 'Global Terms of Service', updated: '2 Hours Ago', icon: Shield, sector: 'Legal' },
                   { name: 'Privacy Assurance Protocol', updated: '1 Month Ago', icon: FileText, sector: 'Privacy' },
                   { name: 'Strategic Corporate Narrative', updated: '3 Months Ago', icon: Globe, sector: 'About' },
                   { name: 'Pro Verification Guidelines', updated: '1 Week Ago', icon: CheckCircle2, sector: 'Guidelines' },
                   { name: 'Help & Operations Center', updated: 'Today', icon: Layers, sector: 'Support' },
                   { name: 'Community Standards', updated: 'Yesterday', icon: Smartphone, sector: 'Rules' },
                 ].map((page, i) => (
                   <div 
                     key={i} 
                     className="flex items-center justify-between p-6 rounded-md bg-slate-50 border border-slate-200 cursor-pointer group hover:bg-white"
                    onClick={() => openView('Static Registry Item (mock)', page)}
                   >
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:-rotate-6 shadow-sm border border-slate-100 transition-all">
                            <page.icon className="w-7 h-7" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{page.sector}</span>
                            </div>
                            <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{page.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Last Sync: {page.updated}</p>
                         </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
                   </div>
                 ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'articles' && (
          <div
            className="space-y-10"
          >
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {articles.map((post) => (
                  <div
                    key={post.id}
                    className="cursor-pointer group"
                    onClick={() => openView('Article Details', post)}
                    role="button"
                    tabIndex={0}
                  >
                    <GlassCard className="hover:-translate-y-2 transition-all cursor-pointer group">
                     <div className="flex items-center justify-between mb-6">
                        <span className="px-3 py-1 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg border border-primary/10">{post.cat}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.date}</span>
                     </div>
                     <h4 className="text-lg font-black text-slate-800 tracking-tight mb-4 leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                     <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 tracking-tighter">AD</div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{post.author}</span>
                        </div>
                        <div className="flex gap-1">
                           <button
                             type="button"
                             className="p-2 text-slate-300 hover:text-primary transition-colors"
                             onClick={(e) => {
                               e.stopPropagation();
                               openEditArticle(post);
                             }}
                             aria-label="Edit article"
                           >
                             <Edit3 className="w-4 h-4" />
                           </button>
                           <button
                             type="button"
                             className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                             onClick={(e) => {
                               e.stopPropagation();
                               setDeleteTarget({ kind: 'article', id: post.id });
                             }}
                             aria-label="Delete article"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                    </GlassCard>
                  </div>
                ))}
             </div>
             <button
               type="button"
               onClick={() => {
                 const newPost = {
                   id: `art-${Date.now()}`,
                   title: 'New Narrative Payload',
                   author: 'Admin Delta',
                   date: 'Today',
                   cat: 'Lifestyle',
                 };
                 setArticles((prev) => [newPost, ...prev]);
               }}
               className="flex items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300 text-[11px] font-black uppercase tracking-[0.3em] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
             >
               <Newspaper className="w-5 h-5" /> Initialize New Narrative Payload
             </button>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-slate-100 pt-12">
         <GlassCard className="p-10 border-blue-500/10 bg-blue-500/[0.02] hover:bg-blue-500/[0.05] transition-all cursor-pointer group">
            <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-2xl shadow-blue-500/5 group-hover:rotate-12 transition-all">
                  <Globe className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 tracking-tight text-xl">SEO Core</h4>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Visibility Optimization</p>
               </div>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-10 leading-relaxed italic">"Calibrate meta-traversal, strategic sitemaps, and search index velocity for maximum global visibility."</p>
            <button
              type="button"
              onClick={() => openView('Configure Meta (mock)', { module: 'SEO Core', updatedAt: new Date().toISOString() })}
              className="w-full py-4 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all outline-none"
            >
              Configure Meta
            </button>
         </GlassCard>
         
         <GlassCard className="p-10 border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.05] transition-all cursor-pointer group">
            <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/5 group-hover:rotate-12 transition-all">
                  <Layout className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 tracking-tight text-xl">App Lexicon</h4>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">Strategic Copy Engine</p>
               </div>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-10 leading-relaxed italic">"Update strategic labels, text modules, and localization vectors across the global application interface."</p>
            <button
              type="button"
              onClick={() => openView('Edit Lexicon (mock)', { module: 'App Lexicon', updatedAt: new Date().toISOString() })}
              className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all outline-none"
            >
              Edit Lexicon
            </button>
         </GlassCard>

         <GlassCard className="p-10 border-slate-200/50 hover:bg-slate-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:rotate-12 transition-all">
                  <SettingsIcon className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 tracking-tight text-xl">System Config</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Identity & Meta</p>
               </div>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-10 leading-relaxed italic">"Modify universal site identity, assets, and strategic social propagation preferences for the platform hub."</p>
            <button
              type="button"
              onClick={() => openView('Site Settings (mock)', { module: 'System Config', updatedAt: new Date().toISOString() })}
              className="w-full py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 outline-none"
            >
              Site Settings
            </button>
         </GlassCard>
      </div>

      <DetailsDialog
        open={detailsOpen}
        title={detailsTitle}
        onClose={cancelDetails}
      >
        {detailsMode === 'view' && (
          <div className="space-y-4 mt-2">
            {!detailsPayload ? (
              <p className="text-sm font-bold text-slate-500">No details available.</p>
            ) : modalKind === 'slide' ? (
              (() => {
                const slide = detailsPayload as HeroSlide;
                return (
                  <>
                    <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50">
                      {slide.img ? (
                        <img src={slide.img} alt="" className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-44 bg-slate-100" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                        {slide.type}
                      </span>
                      <span className="px-3 py-1 bg-slate-900/5 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                        {slide.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{slide.title}</h3>
                  </>
                );
              })()
            ) : modalKind === 'segment' ? (
              (() => {
                const seg = detailsPayload as Segment;
                return (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                        {seg.icon === 'Sparkles' ? (
                          <Sparkles className="w-6 h-6" />
                        ) : seg.icon === 'Bookmark' ? (
                          <Bookmark className="w-6 h-6" />
                        ) : (
                          <Zap className="w-6 h-6" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">{seg.title}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                          {seg.items} Protocol • {seg.status}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Items</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{seg.items}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{seg.status}</p>
                      </div>
                    </div>
                  </>
                );
              })()
            ) : modalKind === 'article' ? (
              (() => {
                const post = detailsPayload as Article;
                return (
                  <>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                        {post.cat}
                      </span>
                      <span className="px-3 py-1 bg-slate-900/5 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{post.title}</h3>
                    <p className="text-sm font-bold text-slate-600">
                      By <span className="text-slate-900 font-black">{post.author}</span>
                    </p>
                    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">
                        Mock strategic narrative for <span className="text-slate-900">{post.cat}</span> with latest indexing context.
                      </p>
                    </div>
                  </>
                );
              })()
            ) : modalKind === 'static' ? (
              (() => {
                const item = detailsPayload as StaticItem;
                const IconComponent =
                  item.icon === 'Shield'
                    ? Shield
                    : item.icon === 'FileText'
                      ? FileText
                      : item.icon === 'Globe'
                        ? Globe
                        : item.icon === 'CheckCircle2'
                          ? CheckCircle2
                          : item.icon === 'Layers'
                            ? Layers
                            : Smartphone;
                return (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">{item.name}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                          {item.sector}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{item.sector}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Sync</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{item.updated}</p>
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              (() => {
                const cfg = detailsPayload as { module?: string; updatedAt?: string };
                return (
                  <>
                    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module</p>
                      <p className="text-sm font-black text-slate-800 mt-1">{cfg.module ?? 'Unknown'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Last Updated</p>
                      <p className="text-sm font-black text-slate-800 mt-1">
                        {cfg.updatedAt ? new Date(cfg.updatedAt).toLocaleString() : 'Not provided'}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      This is a mock CMS configuration preview. Use the <span className="text-slate-900">Edit</span> actions to change fields.
                    </p>
                  </>
                );
              })()
            )}
          </div>
        )}

        {detailsMode === 'edit' && modalKind === 'slide' && (
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
              <input
                value={slideForm.title}
                onChange={(e) => setSlideForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
              <input
                value={slideForm.type}
                onChange={(e) => setSlideForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <input
                value={slideForm.status}
                onChange={(e) => setSlideForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
              <input
                value={slideForm.img}
                onChange={(e) => setSlideForm((p) => ({ ...p, img: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={cancelDetails}
                className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSlideEdits}
                className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {detailsMode === 'edit' && modalKind === 'segment' && (
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
              <input
                value={segmentForm.title}
                onChange={(e) => setSegmentForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Items</label>
              <input
                value={segmentForm.items}
                onChange={(e) => setSegmentForm((p) => ({ ...p, items: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <input
                value={segmentForm.status}
                onChange={(e) => setSegmentForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon</label>
              <CustomSelect
                value={segmentForm.icon}
                onChange={(value) => setSegmentForm((p) => ({ ...p, icon: value as Segment['icon'] }))}
                options={[
                  { value: 'Sparkles', label: 'Sparkles' },
                  { value: 'Bookmark', label: 'Bookmark' },
                  { value: 'Zap', label: 'Zap' },
                ]}
                placeholder="Select icon"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={cancelDetails}
                className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSegmentEdits}
                className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {detailsMode === 'edit' && modalKind === 'article' && (
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
              <input
                value={articleForm.title}
                onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author</label>
              <input
                value={articleForm.author}
                onChange={(e) => setArticleForm((p) => ({ ...p, author: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input
                value={articleForm.date}
                onChange={(e) => setArticleForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <input
                value={articleForm.cat}
                onChange={(e) => setArticleForm((p) => ({ ...p, cat: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={cancelDetails}
                className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveArticleEdits}
                className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </DetailsDialog>

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Confirm Delete"
        description={
          deleteTarget
            ? `Delete this ${deleteTarget.kind}? This action will remove it from the CMS mock state.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CMSPage;
