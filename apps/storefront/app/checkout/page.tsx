"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Aquí se integrará Stripe o MercadoPago (Tokenización)
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-bg px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Columna Izquierda: Formulario de Envío y Pago */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="lg:col-span-7 space-y-8"
        >
          <div>
            <h1 className="font-serif text-3xl text-brand-dark mb-2">Finalizar Compra</h1>
            <p className="text-brand-dark/70 font-sans text-sm flex items-center">
              <Lock className="w-4 h-4 mr-2 text-brand-gold" />
              Conexión encriptada AES-256
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-8">
            {/* Sección Envío */}
            <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl shadow-premium border border-brand-dark/5">
              <h2 className="text-lg font-sans font-medium text-brand-dark mb-6 flex items-center">
                <Truck className="w-5 h-5 mr-3 text-brand-gold" />
                Datos de Entrega
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nombre completo" className="col-span-2 px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                <input type="email" placeholder="Correo electrónico" className="col-span-2 px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                <input type="text" placeholder="Dirección de envío" className="col-span-2 px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                <input type="text" placeholder="Ciudad" className="col-span-1 px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                <input type="text" placeholder="Código Postal" className="col-span-1 px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
              </div>
            </div>

            {/* Sección Pago */}
            <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl shadow-premium border border-brand-dark/5">
              <h2 className="text-lg font-sans font-medium text-brand-dark mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-brand-gold" />
                Pago Seguro
              </h2>
              <div className="space-y-4">
                <input type="text" placeholder="Número de tarjeta" className="w-full px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/AA" className="px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                  <input type="text" placeholder="CVC" className="px-4 py-3 bg-brand-bg border border-brand-dark/10 rounded-xl focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" required />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-brand-dark text-brand-surface rounded-xl font-medium font-sans hover:bg-brand-dark/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-premium flex items-center justify-center"
            >
              {isProcessing ? "Procesando de forma segura..." : "Pagar $350.00 USD"}
            </button>
          </form>
        </motion.div>

        {/* Columna Derecha: Resumen de Orden */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="lg:col-span-5"
        >
          <div className="bg-brand-sand/20 p-6 sm:p-8 rounded-3xl sticky top-8 border border-brand-dark/5">
            <h3 className="font-serif text-xl text-brand-dark mb-6">Resumen de Orden</h3>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-dark/10">
              <div className="w-20 h-20 bg-brand-surface rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xs text-brand-dark/40 font-sans">Img</span>
              </div>
              <div>
                <p className="font-sans font-medium text-brand-dark">Aurum Aviator</p>
                <p className="font-sans text-sm text-brand-dark/60">Micas: Alto Índice 1.67</p>
                <p className="font-sans text-sm text-brand-dark/60">Filtro: Anti-reflejante Premium</p>
              </div>
            </div>

            <div className="space-y-3 font-sans text-sm mb-6 pb-6 border-b border-brand-dark/10">
              <div className="flex justify-between text-brand-dark/70">
                <span>Subtotal</span>
                <span>$350.00</span>
              </div>
              <div className="flex justify-between text-brand-dark/70">
                <span>Envío asegurado</span>
                <span>Gratis</span>
              </div>
            </div>

            <div className="flex justify-between font-sans font-medium text-lg text-brand-dark mb-8">
              <span>Total</span>
              <span>$350.00 USD</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-brand-dark/50 text-xs font-sans">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de adaptación óptica por 30 días.</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}