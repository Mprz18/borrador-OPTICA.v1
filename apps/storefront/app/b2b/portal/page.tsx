"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function B2BPortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Aquí se conectará el sistema de autenticación JWT del backend (api-core)
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Mitad Izquierda: Propuesta de Valor Corporativa */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 xl:p-24 bg-brand-surface border-r border-brand-dark/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-sand/20 -z-10 blur-3xl rounded-full scale-150 transform translate-x-1/3 -translate-y-1/3" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="text-brand-gold tracking-widest uppercase text-sm font-semibold mb-4 block">
            Portal para Mayoristas
          </span>
          <h1 className="font-serif text-5xl text-brand-dark mb-6 leading-tight">
            Eleva el estándar de tu propia óptica.
          </h1>
          <p className="text-brand-dark/70 font-sans text-lg mb-12 max-w-md">
            Accede a listas de precios preferenciales, gestión de inventario multi-sucursal y prioridad en nuestro laboratorio óptico de alta tecnología.
          </p>

          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mr-4 shadow-sm border border-brand-dark/5">
                <Building2 className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-brand-dark">Abastecimiento por Volumen</h3>
                <p className="font-sans text-sm text-brand-dark/60">Catálogo completo sin restricciones de stock.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mr-4 shadow-sm border border-brand-dark/5">
                <Briefcase className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-brand-dark">Facturación Automatizada</h3>
                <p className="font-sans text-sm text-brand-dark/60">Integración directa con tu sistema contable.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mitad Derecha: Formulario de Acceso Seguro */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-10">
            <h2 className="font-serif text-3xl text-brand-dark mb-2">Acceso Corporativo</h2>
            <p className="font-sans text-brand-dark/60 text-sm">
              Ingresa con tus credenciales de distribuidor autorizado.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-sans text-sm font-medium text-brand-dark mb-2">Correo Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@tuoptica.com" 
                className="w-full px-4 py-3 bg-brand-surface border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm shadow-sm" 
                required 
              />
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-brand-dark mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-brand-surface border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm shadow-sm" 
                required 
              />
            </div>

            <div className="flex items-center justify-between font-sans text-sm">
              <label className="flex items-center text-brand-dark/70 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-brand-gold" />
                Recordar sesión
              </label>
              <Link href="#" className="text-brand-gold hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center py-4 bg-brand-dark text-brand-surface rounded-xl overflow-hidden transition-all hover:bg-brand-dark/90 shadow-premium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="font-sans font-medium mr-2">
                {isLoading ? "Verificando credenciales..." : "Iniciar Sesión"}
              </span>
              {!isLoading && <KeyRound className="w-4 h-4 text-brand-gold" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-brand-dark/10 text-center">
            <p className="font-sans text-sm text-brand-dark/70 mb-4">¿Aún no eres distribuidor autorizado?</p>
            <Link 
              href="#"
              className="inline-flex items-center font-sans text-sm font-medium text-brand-dark hover:text-brand-gold transition-colors group"
            >
              Solicitar apertura de cuenta
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-brand-dark/40">
            <ShieldCheck className="w-4 h-4 mr-1" />
            <span className="font-sans text-xs">Acceso monitoreado y seguro</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}