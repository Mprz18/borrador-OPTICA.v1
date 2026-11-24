"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, ScanFace } from "lucide-react";

export function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
      }
    }

    setupCamera();

    // Limpieza al desmontar para no dejar la cámara encendida en segundo plano
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-video bg-brand-dark rounded-3xl overflow-hidden shadow-glass border border-brand-dark/10">
      {hasPermission === false && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-surface text-brand-dark p-6 text-center">
          <CameraOff className="w-12 h-12 text-brand-gold mb-4" />
          <h3 className="font-serif text-2xl mb-2">Acceso a cámara denegado</h3>
          <p className="font-sans text-sm text-brand-dark/70">
            Para realizar la medición de tu distancia pupilar y probar los armazones en 3D, necesitamos acceso a tu cámara.
          </p>
        </div>
      )}

      {hasPermission === null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark text-brand-surface">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Camera className="w-10 h-10 text-brand-gold" />
          </motion.div>
          <p className="mt-4 font-sans text-sm tracking-wider uppercase text-brand-surface/70">
            Iniciando lente biométrico...
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-1000 ${hasPermission ? "opacity-100" : "opacity-0"}`}
      />

      {/* Overlay de interfaz de escaneo */}
      {hasPermission && (
        <div className="absolute inset-0 pointer-events-none border-[8px] border-brand-surface/10 rounded-3xl">
          <div className="absolute top-6 left-6 flex items-center bg-brand-dark/40 backdrop-blur-md px-4 py-2 rounded-full border border-brand-surface/10">
            <ScanFace className="w-4 h-4 text-brand-gold mr-2" />
            <span className="font-sans text-xs tracking-wider text-brand-surface uppercase">Análisis Facial Activo</span>
          </div>
          
          {/* Guías de alineación visuales */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-brand-gold/50 rounded-[40%] animate-pulse-slow" />
        </div>
      )}
    </div>
  );
}