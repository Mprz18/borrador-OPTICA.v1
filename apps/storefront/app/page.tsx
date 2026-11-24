import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Star, 
  ShoppingBag,
  Calendar
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. HERO SECTION (Estilo E-commerce Premium - Split Screen) */}
      <section className="relative w-full bg-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Texto y Llamados a la acción */}
          <div className="relative z-10 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 w-fit mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Colección Primavera 2026
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
              Tu visión, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                tu mejor estilo.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Diseño premium y tecnología óptica de punta. Descubre armazones que resaltan tu personalidad con envío gratis a todo el país.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="/catalog" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                <ShoppingBag size={20} />
                Comprar Ahora
              </a>
              <a href="/clinical/appointment" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                <Calendar size={20} />
                Examen Visual
              </a>
            </div>
            
            {/* Prueba social rápida */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Cliente" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" alt="Cliente" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Cliente" />
              </div>
              <div className="text-sm">
                <div className="flex text-amber-400">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <span className="font-medium text-slate-600">+2,000 clientes felices</span>
              </div>
            </div>
          </div>

          {/* Imagen Hero Destacada */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop" 
              alt="Mujer con lentes de sol de diseño" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
            {/* Tarjeta flotante de producto */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow hidden md:flex">
              <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=100&q=80" alt="Lentes" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Más vendido</p>
                <p className="font-bold text-slate-900">Modelo Titanium</p>
                <p className="text-blue-600 font-black">$2,490</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. BARRA DE BENEFICIOS (Trust Bar) */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex flex-col items-center text-center md:px-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Truck size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Envío Gratis</h3>
            <p className="text-sm text-slate-500">A todo México en compras mayores a $999</p>
          </div>
          <div className="flex flex-col items-center text-center md:px-6 pt-6 md:pt-0">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Garantía Total</h3>
            <p className="text-sm text-slate-500">1 año de garantía en defectos de fábrica</p>
          </div>
          <div className="flex flex-col items-center text-center md:px-6 pt-6 md:pt-0">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Ajuste en Tienda</h3>
            <p className="text-sm text-slate-500">Limpieza y ajuste gratis de por vida</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORÍAS (Visuales, limpias e incitando al clic) */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Descubre tu estilo</h2>
            <p className="text-slate-500 text-lg">Encuentra la categoría perfecta para ti.</p>
          </div>
          <a href="/catalog" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Ver todo el catálogo <ArrowRight size={20} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Categoría Oftálmicos */}
          <a href="/catalog?category=oftalmico" className="group block relative rounded-3xl overflow-hidden bg-slate-100 aspect-[4/5]">
            <img src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop" alt="Oftálmicos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">Diario</span>
              <h3 className="text-2xl font-black text-white flex justify-between items-center">
                Oftálmicos
                <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </span>
              </h3>
            </div>
          </a>

          {/* Categoría Solares */}
          <a href="/catalog?category=sol" className="group block relative rounded-3xl overflow-hidden bg-slate-100 aspect-[4/5]">
            <img src="https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop" alt="Solares" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">Protección UV</span>
              <h3 className="text-2xl font-black text-white flex justify-between items-center">
                Solares
                <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </span>
              </h3>
            </div>
          </a>

          {/* Categoría Contacto */}
          <a href="/catalog?category=contacto" className="group block relative rounded-3xl overflow-hidden bg-slate-100 aspect-[4/5] lg:col-span-1 md:col-span-2">
            <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop" alt="Lentes de Contacto" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">Comodidad</span>
              <h3 className="text-2xl font-black text-white flex justify-between items-center">
                Lentes de Contacto
                <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </span>
              </h3>
            </div>
          </a>
        </div>
      </section>

      {/* 4. BANNER CITA EN SUCURSAL (Diseño editorial) */}
      <section className="px-6 py-12 mb-20 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              ¿Hace cuánto no revisas tu vista?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Agenda tu examen visual integral sin costo. Nuestros especialistas te guiarán con la graduación exacta y el mejor armazón para la forma de tu rostro.
            </p>
            <a href="/clinical/appointment" className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 w-fit transition-all active:scale-95">
              <MapPin size={20} />
              Encontrar Sucursal y Agendar
            </a>
          </div>
          <div className="w-full md:w-1/2 h-[400px] md:h-auto self-stretch">
            <img 
              src="https://images.unsplash.com/photo-1589826359595-36473138b700?q=80&w=1000&auto=format&fit=crop" 
              alt="Examen de la vista" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}