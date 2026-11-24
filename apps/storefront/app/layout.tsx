import type { Metadata } from 'next';
import './globals.css';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Calendar, 
  Lock, 
  Phone, 
  Eye, 
  ShieldCheck, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Óptica Imagen Visual | Exámenes de la Vista & Alta Optometría',
  description: 'Salud visual integral, armazones de catálogo, lentes de contacto y micas de alta tecnología.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#0B0F17] text-[#F3F4F6] font-sans antialiased selection:bg-[#FFE600] selection:text-[#0B0F17] flex flex-col min-h-screen">
        
        {/* 1. BARRA SUPERIOR DE ANUNCIOS Y CONTACTO */}
        <div className="bg-[#111827] text-[#9CA3AF] text-xs py-2 px-6 border-b border-[#1F2937] flex justify-between items-center z-50 font-medium">
          <div className="hidden md:flex items-center gap-2 text-[#00A3FF]">
            <Eye size={14} />
            <span>Examen de la vista digital en sucursal bajo cita previa</span>
          </div>
          <div className="mx-auto md:mx-0 text-[#FFE600] font-bold tracking-wide flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>3 y 6 Meses Sin Intereses en Armazones Seleccionados</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <a href="tel:+525500000000" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone size={12} className="text-[#00A3FF]" /> Citas: (55) 0000-0000
            </a>
            <span className="text-[#1F2937]">|</span>
            <span className="flex items-center gap-1 text-gray-400">
              <MapPin size={12} className="text-[#E60000]" /> Sucursal Central
            </span>
          </div>
        </div>

        {/* 2. NAVEGACIÓN PRINCIPAL (HEADER CON LOGO OFICIAL) */}
        <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1F2937] shadow-xl">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            
            {/* LOGOTIPO OFICIAL DE LA ÓPTICA */}
            <a href="/" className="flex items-center group py-2">
              <div className="bg-[#111827] px-4 py-2 rounded-xl border border-[#FFE600]/30 group-hover:border-[#FFE600] transition-all flex items-center gap-3 shadow-[0_0_15px_rgba(255,230,0,0.12)]">
                <img 
                  src="/logo.png" 
                  alt="Óptica Imagen Visual" 
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
            </a>

            {/* MENÚ DE CATEGORÍAS */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold tracking-wide uppercase">
              <a href="/catalog" className="text-white hover:text-[#FFE600] transition-colors py-2 border-b-2 border-transparent hover:border-[#FFE600]">
                Oftálmicos
              </a>
              <a href="/catalog" className="text-white hover:text-[#00A3FF] transition-colors py-2 border-b-2 border-transparent hover:border-[#00A3FF]">
                Lentes de Sol
              </a>
              <a href="/catalog" className="text-white hover:text-[#FFE600] transition-colors py-2 border-b-2 border-transparent hover:border-[#FFE600]">
                Lentes de Contacto
              </a>
              <a href="/clinical/appointment" className="text-[#00A3FF] hover:text-white transition-colors py-2 flex items-center gap-1.5 font-extrabold">
                <Calendar size={16} />
                <span>Agendar Cita</span>
              </a>
            </nav>

            {/* ACCIONES Y CARRITO */}
            <div className="flex items-center gap-4">
              <button 
                aria-label="Buscar" 
                className="text-gray-300 hover:text-[#FFE600] transition-colors p-2.5 bg-[#111827] rounded-xl border border-[#1F2937]"
              >
                <Search size={18} />
              </button>

              <a 
                href="/b2b/portal" 
                aria-label="Perfil de Cliente" 
                className="hidden sm:flex text-gray-300 hover:text-[#00A3FF] transition-colors p-2.5 bg-[#111827] rounded-xl border border-[#1F2937]"
              >
                <User size={18} />
              </a>

              <button 
                aria-label="Carrito de Compras" 
                className="relative text-gray-300 hover:text-[#FFE600] transition-colors p-2.5 bg-[#111827] rounded-xl border border-[#1F2937] flex items-center"
              >
                <ShoppingBag size={18} />
                <span className="absolute -top-1.5 -right-1.5 bg-[#E60000] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B0F17]">
                  0
                </span>
              </button>
            </div>

          </div>
        </header>

        {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 3. PIE DE PÁGINA (FOOTER CORPORATIVO) */}
        <footer className="bg-[#070A0F] text-[#9CA3AF] pt-16 pb-8 px-6 border-t border-[#1F2937]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1F2937] text-sm">
            
            {/* Columna 1: Información de Marca */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Óptica Imagen Visual" className="h-8 w-auto" />
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                Tu salud visual en manos de expertos. Especialistas en gradaciones complejas, micas progresivas digitales y armazones de alta resistencia.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#00A3FF] font-medium">
                <ShieldCheck size={16} />
                <span>Garantía de Graduación 100% Precisa</span>
              </div>
            </div>

            {/* Columna 2: Catálogo de Productos */}
            <div className="flex flex-col gap-2.5 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-white text-sm mb-2 font-['Space_Grotesk']">Catálogo</h5>
              <a href="/catalog" className="hover:text-[#FFE600] transition-colors">Armazones de Titanio</a>
              <a href="/catalog" className="hover:text-[#FFE600] transition-colors">Lentes de Sol Polarizados</a>
              <a href="/catalog" className="hover:text-[#FFE600] transition-colors">Lentes de Contacto</a>
              <a href="/catalog" className="hover:text-[#FFE600] transition-colors">Micas Antirreflejantes y Blue Free</a>
            </div>

            {/* Columna 3: Servicios Clínicos */}
            <div className="flex flex-col gap-2.5 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-white text-sm mb-2 font-['Space_Grotesk']">Servicios Clínicos</h5>
              <a href="/clinical/appointment" className="hover:text-[#00A3FF] transition-colors">Examen de la Vista Digital</a>
              <a href="/clinical/prescription" className="hover:text-[#00A3FF] transition-colors">Carga e Interpretación de Receta</a>
              <a href="/clinical/appointment" className="hover:text-[#00A3FF] transition-colors">Adaptación de Lentes de Contacto</a>
            </div>

            {/* Columna 4: Enlace al Portal de Empleados / ERP */}
            <div className="flex flex-col gap-3 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-white text-sm mb-2 font-['Space_Grotesk']">Acceso Restringido</h5>
              <p className="text-gray-400 text-xs">Portal exclusivo para personal de mostrador, optometristas y laboratorio.</p>
              
              <a 
                href="http://localhost:5173" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs text-[#FFE600] hover:bg-[#FFE600] hover:text-[#0B0F17] transition-all font-bold uppercase bg-[#111827] px-4 py-3 rounded-xl border border-[#FFE600]/40 mt-1 shadow-md group"
              >
                <Lock size={14} className="text-[#FFE600] group-hover:text-[#0B0F17]" />
                <span>Portal Staff & Punto de Venta</span>
              </a>
            </div>

          </div>

          {/* Copyright y marca */}
          <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Óptica Imagen Visual. Todos los derechos reservados.</p>
            <p className="mt-2 md:mt-0 font-mono text-[11px] text-gray-400">
              Sistema Óptico Digital v2.0
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}