'use client';

import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Eye, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'oftalmico' | 'sol' | 'contacto';
  price: number;
  image: string;
  badge?: string;
  features: string[];
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Titanium Edge Pro - Negro MATE',
    category: 'oftalmico',
    price: 2490,
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop',
    badge: 'Más Vendido',
    features: ['Titanio Ultraligero 12g', 'Soporta Dioptrías Altas', 'Flex bisagra 180°'],
    inStock: true,
  },
  {
    id: '2',
    name: 'CyberDrive Polarized v2',
    category: 'sol',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
    badge: 'Protección UV400',
    features: ['Micas Polarizadas TAC', 'Armazón TR90 Antimpactos', 'Filtro Antireflejo Interno'],
    inStock: true,
  },
  {
    id: '3',
    name: 'FlexiKids Ultra-Resistente',
    category: 'oftalmico',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop',
    badge: 'Ideal Niños',
    features: ['Silicona Grado Médico', 'Sin Piezas Metálicas', 'Incluye Banda Elástica'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Lentes de Contacto BioClear (Caja 6 pzs)',
    category: 'contacto',
    price: 950,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
    badge: 'Hidrata 24h',
    features: ['Silicona de Hidrogel', 'Oxigenación Superior', 'Reemplazo Mensual'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Vintage Gold Oval',
    category: 'oftalmico',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop',
    features: ['Acero Inoxidable Dorado', 'Almohadillas de Silicona', 'Diseño Retro'],
    inStock: true,
  },
  {
    id: '6',
    name: 'SportShield Cyclist Mirror',
    category: 'sol',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop',
    badge: 'Deporte',
    features: ['Panorámica 180°', 'Ventilación Antiempañante', 'Micas Intercambiables'],
    inStock: true,
  },
];

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'oftalmico' | 'sol' | 'contacto'>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[#0B0F17] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado Principal */}
        <div className="border-b border-[#1F2937] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#FFE600] font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles size={14} />
              <span>Catálogo Oficial 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Armazones & <span className="text-[#00A3FF]">Lentes Especializados</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Todos nuestros armazones incluyen evaluación digital de graduación en sucursal y garantía de adaptación de 30 días.
            </p>
          </div>

          {/* Filtros rápidos por Categoría */}
          <div className="flex flex-wrap gap-2 bg-[#111827] p-1.5 rounded-xl border border-[#1F2937]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#FFE600] text-[#0B0F17] shadow-[0_0_10px_rgba(255,230,0,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos ({PRODUCTS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('oftalmico')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'oftalmico'
                  ? 'bg-[#00A3FF] text-white shadow-[0_0_10px_rgba(0,163,255,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Oftálmicos
            </button>
            <button
              onClick={() => setSelectedCategory('sol')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'sol'
                  ? 'bg-[#E60000] text-white shadow-[0_0_10px_rgba(230,0,0,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Lentes de Sol
            </button>
            <button
              onClick={() => setSelectedCategory('contacto')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'contacto'
                  ? 'bg-[#FFE600] text-[#0B0F17]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Contacto
            </button>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-[#111827] border border-[#1F2937] hover:border-[#FFE600]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,230,0,0.1)] flex flex-col group"
            >
              {/* Imagen y Badges */}
              <div className="relative h-64 bg-[#1A2234] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60"></div>

                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#FFE600] text-[#0B0F17] font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md font-['Space_Grotesk']">
                    {product.badge}
                  </span>
                )}

                <div className="absolute top-4 right-4 bg-[#0B0F17]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-[#00A3FF] flex items-center gap-1">
                  <Eye size={12} />
                  <span>Configurable</span>
                </div>
              </div>

              {/* Contenido del Producto */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#FFE600] transition-colors mb-2">
                    {product.name}
                  </h3>

                  {/* Lista de características técnicas */}
                  <ul className="space-y-1.5 mb-6">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                        <Check size={13} className="text-[#00A3FF] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Precio y Botón de Acción */}
                <div className="pt-4 border-t border-[#1F2937] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Precio Base</span>
                    <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                      ${product.price.toLocaleString('es-MX')} <span className="text-xs font-normal text-gray-400">MXN</span>
                    </span>
                  </div>

                  <a 
                    href={`/product/${product.id}`}
                    className="bg-[#00A3FF] hover:bg-[#FFE600] hover:text-[#0B0F17] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,163,255,0.2)] flex items-center gap-2"
                  >
                    <span>Configurar</span>
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}