import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import Modal from './Modal';
import { Plus, Save, Calendar, DollarSign, Hash } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  editingProduct: Product | null;
  storeName: string;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSubmit, editingProduct, storeName }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: ProductCategory.OTHER,
    originalPrice: '',
    discountPrice: '',
    expiryDays: 1,
    quantity: 1,
    imageUrl: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        const daysLeft = Math.ceil((new Date(editingProduct.expiryDate).getTime() - Date.now()) / 86400000);
        setFormData({
          name: editingProduct.name,
          category: editingProduct.category,
          originalPrice: editingProduct.originalPrice.toString(),
          discountPrice: editingProduct.discountPrice.toString(),
          expiryDays: daysLeft > 0 ? daysLeft : 1,
          quantity: editingProduct.quantity || 1,
          imageUrl: editingProduct.imageUrl || ''
        });
      } else {
        // Reset for new product
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
    }
  }, [isOpen, editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const original = parseFloat(formData.originalPrice);
    const discount = parseFloat(formData.discountPrice);
    
    const defaultCoords = { lat: 52.2297 + (Math.random() * 0.05), lng: 21.0122 + (Math.random() * 0.05) };

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : '',
      name: formData.name,
      category: formData.category,
      originalPrice: original,
      discountPrice: discount,
      quantity: formData.quantity,
      discountPercentage: Math.round(((original - discount) / original) * 100),
      expiryDate: new Date(Date.now() + (formData.expiryDays * 86400000)).toISOString(),
      storeName: storeName,
      storeLocation: editingProduct ? editingProduct.storeLocation : 'Warszawa (Centrum)',
      imageUrl: formData.imageUrl,
      coordinates: editingProduct ? editingProduct.coordinates : defaultCoords
    };

    onSubmit(productPayload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingProduct ? 'Edytuj Ofertę' : 'Dodaj Produkt'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <ImageUploader 
          initialImageUrl={formData.imageUrl}
          onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
        />

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
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
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
                    onChange={e => setFormData({...formData, expiryDays: parseInt(e.target.value) || 1})}
                    className="w-full bg-white text-ink border-2 border-ink p-3 pl-9 focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-ink text-white font-bold uppercase tracking-widest py-4 mt-6 hover:bg-accent transition-colors flex items-center justify-center gap-2"
        >
          {editingProduct ? <Save size={20} /> : <Plus size={20} />}
          {editingProduct ? 'Zapisz Zmiany' : 'Dodaj do Gazetki'}
        </button>
      </form>
    </Modal>
  );
};

export default ProductFormModal;