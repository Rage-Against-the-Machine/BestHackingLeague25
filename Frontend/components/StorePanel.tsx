
import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { Plus, Package, Calendar, DollarSign, Image as ImageIcon, Edit2, Trash2, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Save, Filter, ArrowUpDown, Hash } from 'lucide-react';

interface StorePanelProps {
  storeName: string;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

type Mode = 'DASHBOARD' | 'FORM';
type SortMode = 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'EXPIRY_SOON' | 'QTY_ASC' | 'QTY_DESC';

const StorePanel: React.FC<StorePanelProps> = ({ storeName, products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [mode, setMode] = useState<Mode>('DASHBOARD');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filtering & Sorting State
  const [filterCategory, setFilterCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('DEFAULT');

  // Stats Calculation
  const stats = useMemo(() => {
    const total = products.length;
    const now = new Date();
    const expiringSoon = products.filter(p => {
        const diff = new Date(p.expiryDate).getTime() - now.getTime();
        return diff > 0 && diff < 48 * 60 * 60 * 1000; // 48h
    }).length;
    const potentialValue = products.reduce((acc, curr) => acc + curr.discountPrice, 0);

    return { total, expiringSoon, potentialValue };
  }, [products]);

  // Filtered & Sorted Products
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Filter
    if (filterCategory !== 'ALL') {
      result = result.filter(p => p.category === filterCategory);
    }

    // Sort
    switch (sortMode) {
      case 'PRICE_ASC':
        result.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'PRICE_DESC':
        result.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case 'EXPIRY_SOON':
        result.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        break;
      case 'QTY_ASC':
        result.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
        break;
      case 'QTY_DESC':
        result.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
        break;
      default:
        // Default: Newest added (assuming ID correlates roughly to time or reverse list)
        result.reverse(); 
        break;
    }

    return result;
  }, [products, filterCategory, sortMode]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: ProductCategory.OTHER,
    originalPrice: '',
    discountPrice: '',
    expiryDays: 1,
    quantity: 1,
    imageUrl: ''
  });

  // Init Form (Add or Edit)
  const initForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // Calculate remaining days roughly
      const daysLeft = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (86400000));
      
      setFormData({
        name: product.name,
        category: product.category,
        originalPrice: product.originalPrice.toString(),
        discountPrice: product.discountPrice.toString(),
        expiryDays: daysLeft > 0 ? daysLeft : 1,
        quantity: product.quantity || 1,
        imageUrl: product.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: ProductCategory.OTHER,
        originalPrice: '',
        discountPrice: '',
        expiryDays: 1,
        quantity: 1,
        imageUrl: ''
      });
    }
    setMode('FORM');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const original = parseFloat(formData.originalPrice);
    const discount = parseFloat(formData.discountPrice);
    
    // Default coords for Warsaw center if none exist, with slight randomization for demo
    const defaultCoords = { lat: 52.2297 + (Math.random() * 0.05), lng: 21.0122 + (Math.random() * 0.05) };

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : '', // ID is handled by service if empty
      name: formData.name,
      category: formData.category,
      originalPrice: original,
      discountPrice: discount,
      quantity: formData.quantity,
      discountPercentage: Math.round(((original - discount) / original) * 100),
      expiryDate: new Date(Date.now() + (formData.expiryDays * 86400000)).toISOString(),
      storeName: storeName || 'Twój Sklep',
      storeLocation: editingProduct ? editingProduct.storeLocation : 'Warszawa (Centrum)', 
      imageUrl: formData.imageUrl || `https://picsum.photos/600/400?random=${Date.now()}`,
      coordinates: editingProduct ? editingProduct.coordinates : defaultCoords
    };

    if (editingProduct) {
      onUpdateProduct(productPayload);
    } else {
      onAddProduct(productPayload);
    }

    setMode('DASHBOARD');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    // Critical: Stop propagation so it doesn't trigger row clicks if any
    e.stopPropagation();
    if (confirm('Czy na pewno chcesz usunąć ten produkt z gazetki?')) {
      onDeleteProduct(id);
    }
  };

  if (mode === 'FORM') {
    return (
      <div className="max-w-2xl mx-auto pt-8 pb-12 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={() => setMode('DASHBOARD')} 
          className="flex items-center gap-2 mb-6 text-ink hover:text-accent transition-colors font-bold text-sm uppercase tracking-wider group"
        >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
           Powrót do listy produktów
        </button>
        
        <div className="bg-paper border-2 border-ink shadow-paper p-8 relative">
          
          <div className="flex items-center gap-4 mb-8 border-b-2 border-ink pb-6">
            <div className="bg-ink text-white p-3 shadow-sm">
              {editingProduct ? <Edit2 size={24} /> : <Plus size={24} />}
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-ink">
                {editingProduct ? 'Edytuj Ofertę' : 'Dodaj Produkt'}
              </h2>
              <p className="text-sm text-ink-light mt-1">
                {editingProduct ? 'Zaktualizuj szczegóły produktu w gazetce.' : 'Uratuj jedzenie przed zmarnowaniem.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Nazwa Produktu</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white text-ink border-2 border-ink p-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-serif text-lg placeholder:text-gray-300"
                placeholder="np. Jogurt Naturalny"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Cena Oryginalna (zł)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-4 text-ink-light" />
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full bg-white text-ink border-2 border-ink p-3 pl-9 focus:outline-none focus:border-accent font-bold"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-accent">Cena Promocyjna (zł)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-4 text-accent" />
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                      className="w-full bg-white text-accent border-2 border-accent p-3 pl-9 focus:outline-none ring-1 ring-accent/20 font-black"
                    />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Kategoria</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})}
                  className="w-full bg-white text-ink border-2 border-ink p-3 focus:outline-none focus:border-accent appearance-none"
                >
                  {Object.values(ProductCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Ilość (szt.)</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-4 text-ink-light" />
                    <input 
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        className="w-full bg-white text-ink border-2 border-ink p-3 pl-9 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Ważne (dni)</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-4 text-ink-light" />
                    <input 
                        type="number"
                        min="1"
                        max="30"
                        value={formData.expiryDays}
                        onChange={e => setFormData({...formData, expiryDays: parseInt(e.target.value)})}
                        className="w-full bg-white text-ink border-2 border-ink p-3 pl-9 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Zdjęcie (URL)</label>
              <div className="relative">
                 <ImageIcon size={16} className="absolute left-3 top-4 text-ink-light" />
                 <input 
                   type="url"
                   value={formData.imageUrl}
                   onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                   className="w-full bg-white text-ink border-2 border-ink p-3 pl-9 focus:outline-none focus:border-accent placeholder:text-gray-300 text-sm"
                   placeholder="https://example.com/image.jpg"
                 />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-ink text-white font-bold uppercase tracking-widest py-4 mt-6 hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-paper hover:shadow-paper-hover hover:-translate-y-1 text-sm"
            >
              {editingProduct ? <Save size={20} /> : <Plus size={20} />}
              {editingProduct ? 'Zapisz Zmiany' : 'Dodaj do Gazetki'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pt-4 pb-12">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-ink text-paper p-6 flex flex-col justify-center border-2 border-ink shadow-paper relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Package size={64} />
             </div>
             <h2 className="font-serif font-black text-2xl mb-1 leading-none">{storeName}</h2>
             <p className="text-[10px] uppercase tracking-widest opacity-70 mt-2">Panel Zarządzania</p>
          </div>
          
          <div className="bg-white border-2 border-ink p-4 shadow-paper flex items-center gap-4">
             <div className="bg-highlight p-3 border border-ink"><Package size={24}/></div>
             <div>
                <div className="text-3xl font-black font-serif text-ink">{stats.total}</div>
                <div className="text-[10px] uppercase font-bold text-ink-light">Ofert</div>
             </div>
          </div>

          <div className="bg-white border-2 border-ink p-4 shadow-paper flex items-center gap-4">
             <div className="bg-red-50 text-red-600 p-3 border border-ink"><AlertTriangle size={24}/></div>
             <div>
                <div className="text-3xl font-black font-serif text-ink">{stats.expiringSoon}</div>
                <div className="text-[10px] uppercase font-bold text-ink-light">Pilne (&lt;48h)</div>
             </div>
          </div>

          <div className="bg-white border-2 border-ink p-4 shadow-paper flex items-center gap-4">
             <div className="bg-green-50 text-green-700 p-3 border border-ink"><TrendingUp size={24}/></div>
             <div>
                <div className="text-3xl font-black font-serif text-ink">{stats.potentialValue.toFixed(0)} zł</div>
                <div className="text-[10px] uppercase font-bold text-ink-light">Wartość</div>
             </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="border-2 border-ink shadow-paper bg-white relative">
         
         {/* Toolbar */}
         <div className="bg-ink p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-serif font-bold text-xl flex items-center gap-2 text-white">
               <Package size={20} /> Lista Produktów
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
               {/* Category Filter */}
               <div className="flex items-center gap-2 bg-ink-light/20 px-3 py-1.5 rounded border border-white/20">
                  <Filter size={14} className="text-white/70" />
                  <select 
                     value={filterCategory} 
                     onChange={(e) => setFilterCategory(e.target.value as any)}
                     className="bg-transparent text-white text-xs font-bold uppercase focus:outline-none"
                  >
                     <option value="ALL" className="text-ink">Wszystkie Kategorie</option>
                     {Object.values(ProductCategory).map(cat => (
                        <option key={cat} value={cat} className="text-ink">{cat}</option>
                     ))}
                  </select>
               </div>

               {/* Sort Filter */}
               <div className="flex items-center gap-2 bg-ink-light/20 px-3 py-1.5 rounded border border-white/20">
                  <ArrowUpDown size={14} className="text-white/70" />
                  <select 
                     value={sortMode} 
                     onChange={(e) => setSortMode(e.target.value as SortMode)}
                     className="bg-transparent text-white text-xs font-bold uppercase focus:outline-none"
                  >
                     <option value="DEFAULT" className="text-ink">Domyślne</option>
                     <option value="PRICE_ASC" className="text-ink">Cena: Rosnąco</option>
                     <option value="PRICE_DESC" className="text-ink">Cena: Malejąco</option>
                     <option value="QTY_ASC" className="text-ink">Ilość: Rosnąco</option>
                     <option value="QTY_DESC" className="text-ink">Ilość: Malejąco</option>
                     <option value="EXPIRY_SOON" className="text-ink">Ważność: Najkrótsza</option>
                  </select>
               </div>

               <button 
                 onClick={() => initForm()}
                 className="ml-auto bg-accent text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-accent transition-colors border-2 border-transparent hover:border-accent flex items-center gap-2 shadow-sm"
               >
                  <Plus size={16} /> Dodaj Nowy
               </button>
            </div>
         </div>

         {/* Product Ledger (Table) */}
         <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-highlight border-b-2 border-ink text-xs uppercase tracking-widest text-ink font-black">
                     <th className="p-4 w-1/3 border-r border-ink/10">Produkt</th>
                     <th className="p-4 border-r border-ink/10">Kategoria</th>
                     <th className="p-4 whitespace-nowrap border-r border-ink/10">Ważność</th>
                     <th className="p-4 whitespace-nowrap border-r border-ink/10">Ilość</th>
                     <th className="p-4 whitespace-nowrap border-r border-ink/10">Cena</th>
                     <th className="p-4 text-center">Akcje</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-ink/10">
                  {displayedProducts.length === 0 ? (
                     <tr>
                        <td colSpan={6} className="p-12 text-center text-ink-light italic bg-white">
                           {products.length === 0 
                             ? 'Twój magazyn jest pusty. Dodaj pierwszy produkt.' 
                             : 'Brak wyników dla wybranych filtrów.'}
                        </td>
                     </tr>
                  ) : displayedProducts.map(product => {
                     const isUrgent = new Date(product.expiryDate).getTime() - Date.now() < 48 * 3600 * 1000;
                     return (
                        <tr key={product.id} className="group hover:bg-highlight/20 transition-colors bg-white">
                           <td className="p-4 border-r border-ink/5">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 border border-ink bg-gray-100 shrink-0 relative overflow-hidden">
                                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <div className="font-bold font-serif text-lg text-ink leading-tight">{product.name}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4 font-sans text-sm font-medium text-ink border-r border-ink/5">
                              {product.category}
                           </td>
                           <td className="p-4 whitespace-nowrap border-r border-ink/5">
                              <div className={`flex items-center gap-2 text-sm font-bold ${isUrgent ? 'text-red-600' : 'text-green-700'}`}>
                                 {isUrgent ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                                 {new Date(product.expiryDate).toLocaleDateString()}
                              </div>
                           </td>
                           <td className="p-4 font-sans text-sm font-medium text-ink border-r border-ink/5 text-center">
                              {product.quantity} szt.
                           </td>
                           <td className="p-4 whitespace-nowrap border-r border-ink/5">
                              <div className="flex flex-col">
                                 <span className="font-black text-accent text-lg">{product.discountPrice.toFixed(2)} zł</span>
                                 <span className="text-xs line-through text-ink-light decoration-1 opacity-60">{product.originalPrice.toFixed(2)} zł</span>
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                 <button 
                                    onClick={() => initForm(product)}
                                    className="p-2 hover:bg-ink hover:text-white border border-ink/20 hover:border-ink transition-all rounded-sm text-ink" 
                                    title="Edytuj"
                                 >
                                    <Edit2 size={16} />
                                 </button>
                                 <button 
                                    type="button" 
                                    onClick={(e) => handleDelete(e, product.id)}
                                    className="p-2 hover:bg-red-600 hover:text-white border border-ink/20 hover:border-red-600 text-red-600 transition-all rounded-sm" 
                                    title="Usuń"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default StorePanel;
