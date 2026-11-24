'use client';

import React, { useState } from 'react';
import { Eye, ShieldCheck, Check, Upload, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Estado del configurador óptico
  const [lensType, setLensType] = useState<'solares' | 'monofocal' | 'progresivo'>('monofocal');
  const [treatment, setTreatment] = useState<'basico' | 'antirreflejante' | 'bluefree' | 'fotocromatico'>('bluefree');
  
  // Precios adicionales
  const treatmentPrices = {
    basico: 0,
    antirreflejante: 450,
    bluefree: 850,
    fotocromatico: 1400,
  };

  const basePrice = 2490;
  const totalPrice = basePrice + treatmentPrices[treatment];

  return (
    <div className="bg-[#0B0F17] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Botón de regreso */}
        <a href="/catalog" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#FFE600] mb-8 transition-colors">
          <ArrowLeft size={16} />
          <span>Volver al Catálogo</span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Galería de Producto */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[480px] bg-[#111827] rounded-2xl overflow-hidden border border-[#1F2937]">
              <img 
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1000&auto=format&fit=crop" 
                alt="Titanium Edge Pro"
                className="w-full h-full object-cover" 
              />
              <span className="absolute top-4 left-4 bg-[#FFE600] text-[#0B0F17] font-black text-xs uppercase px-3 py-1 rounded-full shadow-md font-['Space_Grotesk']">
                Garantía Titanio 2 Años
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-[#111827] rounded-xl border border-[#FFE600] overflow-hidden cursor-pointer">
                <img src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover" alt="Vista 1" />
              </div>
              <div className="h-24 bg-[#111827] rounded-xl border border-[#1F2937] overflow-hidden cursor-pointer opacity-70 hover:opacity-100">
                <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover" alt="Vista 2" />
              </div>
              <div className="h-24 bg-[#111827] rounded-xl border border-[#1F2937] overflow-hidden cursor-pointer opacity-70 hover:opacity-100">
                <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover" alt="Vista 3" />
              </div>
            </div>
          </div>

          {/* Panel de Configuración Óptica */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#00A3FF] text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles size={14} />
                <span>Armazón + Micas Personalizadas</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] mb-3">
                Titanium Edge Pro - Negro MATE
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-black text-[#FFE600] font-['Space_Grotesk']">
                  ${totalPrice.toLocaleString('es-MX')} MXN
                </span>
                <span className="text-xs text-gray-400">Incluye armazón y tratamiento elegido</span>
              </div>

              <div className="w-full h-px bg-[#1F2937] mb-6"></div>

              {/* Paso 1: Tipo de Mica */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-gray-300 mb-3 tracking-wider">
                  1. Selecciona el Tipo de Lente:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'monofocal', label: 'Monofocal', desc: 'Ver de cerca o lejos' },
                    { id: 'progresivo', label: 'Progresivo Digital', desc: 'Todas las distancias' },
                    { id: 'solares', label: 'Sin Graduación', desc: 'Solo armazón' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setLensType(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        lensType === item.id 
                          ? 'border-[#00A3FF] bg-[#00A3FF]/10 text-white' 
                          : 'border-[#1F2937] bg-[#111827] text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">{item.label}</div>
                      <div className="text-[10px] text-gray-400 leading-tight">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 2: Tratamiento del Cristal */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase text-gray-300 mb-3 tracking-wider">
                  2. Tratamiento / Recubrimiento Especial:
                </label>
                <div className="space-y-2.5">
                  {[
                    { id: 'basico', label: 'Mica Blanca Básica (CR-39)', price: '+$0 MXN' },
                    { id: 'antirreflejante', label: 'Antirreflejante AR Premium', price: '+$450 MXN' },
                    { id: 'bluefree', label: 'Filtro Blue Free (Protección Pantallas)', price: '+$850 MXN' },
                    { id: 'fotocromatico', label: 'Transitions / Fotocromático (Oscurece al Sol)', price: '+$1,400 MXN' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTreatment(item.id as any)}
                      className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        treatment === item.id 
                          ? 'border-[#FFE600] bg-[#FFE600]/10 text-white font-bold' 
                          : 'border-[#1F2937] bg-[#111827] text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          treatment === item.id ? 'border-[#FFE600] bg-[#FFE600]' : 'border-gray-600'
                        }`}>
                          {treatment === item.id && <Check size={10} className="text-[#0B0F17]" />}
                        </div>
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono text-[#FFE600]">{item.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 3: Adjuntar Receta */}
              {lensType !== 'solares' && (
                <div className="mb-8 p-4 rounded-xl border border-dashed border-[#00A3FF]/50 bg-[#00A3FF]/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Upload size={18} className="text-[#00A3FF]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Adjuntar Receta de Óptica</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3">
                    Sube una foto de tu receta o envíala por WhatsApp después de hacer tu pedido.
                  </p>
                  <input type="file" className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00A3FF] file:text-white hover:file:bg-[#FFE600] hover:file:text-[#0B0F17] cursor-pointer" />
                </div>
              )}

            </div>

            {/* Agregar al Carrito */}
            <div className="pt-6 border-t border-[#1F2937] space-y-3">
              <button className="w-full bg-[#FFE600] hover:bg-white text-[#0B0F17] font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,230,0,0.2)] flex items-center justify-center gap-3 font-['Space_Grotesk']">
                <ShoppingBag size={18} />
                <span>Agregar al Carrito - ${totalPrice.toLocaleString('es-MX')} MXN</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-2">
                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-[#00A3FF]" /> Envío Gratis</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye size={14} className="text-[#FFE600]" /> Ajuste sin costo en sucursal</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}