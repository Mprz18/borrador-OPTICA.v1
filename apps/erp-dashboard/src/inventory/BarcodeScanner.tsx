import { useState } from 'react';
import { Camera, Search, PlusCircle } from 'lucide-react';

export default function BarcodeScanner() {
  const [sku, setSku] = useState('');

  // Simulamos la búsqueda de un producto tras escanear
  const handleScan = () => {
    if (!sku) return;
    alert(`Buscando producto con SKU: ${sku} en la base de datos central...`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Lector de Inventario</h3>
        <button className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
          <Camera className="w-4 h-4 mr-2" />
          Activar Cámara
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Escanea o ingresa el SKU del producto..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <button 
          onClick={handleScan}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Consultar
        </button>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Acciones Rápidas</h4>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition">
            <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Registrar Nueva Entrada</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition">
            <Search className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Traspaso de Sucursal</span>
          </button>
        </div>
      </div>
    </div>
  );
}