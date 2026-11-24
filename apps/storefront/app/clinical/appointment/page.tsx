"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, MapPin, Clock, ChevronRight } from "lucide-react";

export default function AppointmentPage() {
  const [serviceType, setServiceType] = useState<"in-person" | "tele">("in-person");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = ["10:00 AM", "11:30 AM", "01:00 PM", "04:00 PM", "05:30 PM"];

  return (
    <div className="min-h-screen bg-brand-bg px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Columna Izquierda: Información Clínica */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col justify-center"
        >
          <span className="text-brand-gold tracking-widest uppercase text-sm font-semibold mb-2">
            Servicios Clínicos
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-dark mb-6">
            Agenda tu valoración visual
          </h1>
          <p className="text-brand-dark/70 font-sans leading-relaxed mb-10">
            Nuestros optometristas certificados utilizan tecnología de vanguardia para garantizar una graduación exacta, ya sea en nuestra boutique o a través de nuestra plataforma de telemetría.
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => setServiceType("in-person")}
              className={`w-full flex items-start p-6 rounded-2xl border transition-all ${serviceType === "in-person" ? "bg-brand-surface border-brand-gold shadow-premium" : "bg-brand-bg border-brand-dark/10 hover:border-brand-dark/30"}`}
            >
              <div className={`p-3 rounded-full mr-4 ${serviceType === "in-person" ? "bg-brand-gold/10 text-brand-gold" : "bg-brand-dark/5 text-brand-dark/50"}`}>
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-serif text-xl text-brand-dark mb-1">Cita Presencial</h3>
                <p className="font-sans text-sm text-brand-dark/60">Examen biométrico completo en nuestra sucursal principal.</p>
              </div>
            </button>

            <button 
              onClick={() => setServiceType("tele")}
              className={`w-full flex items-start p-6 rounded-2xl border transition-all ${serviceType === "tele" ? "bg-brand-surface border-brand-gold shadow-premium" : "bg-brand-bg border-brand-dark/10 hover:border-brand-dark/30"}`}
            >
              <div className={`p-3 rounded-full mr-4 ${serviceType === "tele" ? "bg-brand-gold/10 text-brand-gold" : "bg-brand-dark/5 text-brand-dark/50"}`}>
                <Video className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-serif text-xl text-brand-dark mb-1">Tele-oftalmología</h3>
                <p className="font-sans text-sm text-brand-dark/60">Consulta a distancia para renovar recetas médicas simples.</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Columna Derecha: Calendario y Horarios */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="bg-brand-surface p-8 rounded-3xl shadow-premium border border-brand-dark/5">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-dark/10">
              <h2 className="font-serif text-2xl text-brand-dark flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-brand-gold" />
                Septiembre 2026
              </h2>
            </div>

            {/* Selector de Horarios Simulado */}
            <h3 className="font-sans font-medium text-brand-dark mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-brand-gold" />
              Horarios disponibles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl font-sans text-sm transition-colors border ${selectedTime === time ? "bg-brand-dark text-brand-surface border-brand-dark" : "bg-brand-bg border-brand-dark/10 text-brand-dark hover:border-brand-gold"}`}
                >
                  {time}
                </button>
              ))}
            </div>

            <button 
              disabled={!selectedTime}
              className="w-full group relative flex items-center justify-between px-8 py-4 bg-brand-dark text-brand-surface rounded-xl overflow-hidden transition-all hover:scale-[1.02] shadow-premium disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <span className="font-sans font-medium">Confirmar Cita</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-brand-gold" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}