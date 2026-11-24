"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Shield, CheckCircle2, Loader2 } from "lucide-react";

export default function PrescriptionUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileState, setFileState] = useState<"idle" | "scanning" | "success">("idle");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateOCRProcessing();
    }
  };

  const simulateOCRProcessing = () => {
    setFileState("scanning");
    // Aquí se conectará el endpoint de NestJS para procesar la imagen con OCR
    setTimeout(() => setFileState("success"), 3500);
  };

  return (
    <div className="min-h-screen bg-brand-bg px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-2xl w-full bg-brand-surface p-8 sm:p-12 rounded-3xl shadow-premium border border-brand-dark/5"
      >
        <div className="text-center mb-10">
          <span className="text-brand-gold tracking-widest uppercase text-sm font-semibold mb-2 block">
            Tecnología Clínica
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-dark mb-4">
            Análisis Inteligente de Receta
          </h1>
          <p className="text-brand-dark/70 font-sans text-sm md:text-base">
            Sube una fotografía de tu prescripción médica. Nuestro sistema de visión artificial extraerá tu graduación automáticamente con precisión clínica.
          </p>
        </div>

        {/* Zona de Carga (Drag & Drop) */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
            dragActive ? "border-brand-gold bg-brand-gold/5" : "border-brand-dark/20 bg-brand-bg/50 hover:border-brand-gold/50 hover:bg-brand-sand/10"
          } ${fileState !== "idle" ? "pointer-events-none opacity-90" : "cursor-pointer"}`}
        >
          {fileState === "idle" && (
            <>
              <UploadCloud className="w-12 h-12 text-brand-gold mb-4" />
              <p className="font-sans font-medium text-brand-dark mb-1">Arrastra tu fotografía aquí</p>
              <p className="font-sans text-xs text-brand-dark/50 mb-6">Formatos soportados: JPG, PNG, PDF (Máx. 5MB)</p>
              <button className="px-6 py-2.5 bg-brand-dark text-brand-surface rounded-full text-sm font-medium hover:bg-brand-dark/90 transition-colors shadow-premium">
                Seleccionar Archivo
              </button>
            </>
          )}

          {fileState === "scanning" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center"
            >
              <Loader2 className="w-12 h-12 text-brand-gold animate-spin mb-4" />
              <p className="font-sans font-medium text-brand-dark">Analizando graduación...</p>
              <p className="font-sans text-xs text-brand-dark/60 mt-2">Extrayendo esfera, cilindro y eje mediante IA</p>
            </motion.div>
          )}

          {fileState === "success" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-sans font-medium text-brand-dark">Receta digitalizada con éxito</p>
              <p className="font-sans text-xs text-brand-dark/60 mt-2">Los valores se han añadido a tu expediente seguro.</p>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex items-start p-4 bg-brand-sand/30 rounded-xl border border-brand-sand">
          <Shield className="w-5 h-5 text-brand-gold mr-3 shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-brand-dark/70 leading-relaxed">
            Tus datos médicos están protegidos bajo estándares de encriptación AES-256. Ningún operador humano tendrá acceso a tus documentos sin tu consentimiento previo.
          </p>
        </div>
      </motion.div>
    </div>
  );
}