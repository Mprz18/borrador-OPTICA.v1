import { useState } from 'react';
import { Check, AlertTriangle, X, ShieldCheck, FileText } from 'lucide-react';

// Simulamos una receta pendiente de validación que llega desde el backend (clinical.controller.ts)
const mockPendingRx = {
  id: 'RX-9942',
  patientName: 'Roberto Gómez',
  dateUploaded: '2026-09-18',
  imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop', // Imagen de referencia médica
  extractedData: {
    od: { sphere: -1.25, cylinder: -0.50, axis: 10 },
    oi: { sphere: -1.50, cylinder: 0.00, axis: 0 },
  },
  aiConfidence: 0.88, // 88% requiere revisión humana obligatoria
};

export default function OCRValidator() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = () => {
    // Aquí llamaríamos a PATCH /clinical/prescriptions/:id/verify
    setStatus('approved');
  };

  if (status === 'approved') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-green-600">
        <ShieldCheck className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Expediente Validado</h3>
        <p className="text-gray-500 mt-2">La receta ha sido sellada y enviada a la cola del laboratorio.</p>
        <button onClick={() => setStatus('pending')} className="mt-6 text-sm underline text-gray-400 hover:text-gray-900">
          Cargar siguiente expediente
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-full">
      {/* Columna Izquierda: Visor del Documento Original */}
      <div className="w-1/2 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-500" />
            Documento Original
          </h3>
          <span className="text-sm text-gray-500">ID: {mockPendingRx.id}</span>
        </div>
        <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative group">
          {/* En un entorno real, aquí va el visor de PDF o imagen de la receta subida por el cliente */}
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
            <p className="text-gray-500 font-medium">Renderizado de Receta Subida</p>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Datos Extraídos por IA y Controles */}
      <div className="w-1/2 flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Lectura del Algoritmo (OCR)</h3>
          {mockPendingRx.aiConfidence < 0.95 && (
            <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>El nivel de confianza de la IA es del <strong>{mockPendingRx.aiConfidence * 100}%</strong>. Se requiere validación manual obligatoria por un optometrista antes de liberar la orden.</p>
            </div>
          )}
        </div>

        {/* Tabla Comparativa de Graduación */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Ojo</th>
                <th className="px-4 py-3 font-semibold">Esfera (ESF)</th>
                <th className="px-4 py-3 font-semibold">Cilindro (CIL)</th>
                <th className="px-4 py-3 font-semibold">Eje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-4 font-bold text-gray-900">Derecho (OD)</td>
                <td className="px-4 py-4">
                  <input type="number" defaultValue={mockPendingRx.extractedData.od.sphere} className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900" step="0.25" />
                </td>
                <td className="px-4 py-4">
                  <input type="number" defaultValue={mockPendingRx.extractedData.od.cylinder} className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900" step="0.25" />
                </td>
                <td className="px-4 py-4">
                  <input type="number" defaultValue={mockPendingRx.extractedData.od.axis} className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-bold text-gray-900">Izquierdo (OI)</td>
                <td className="px-4 py-4">
                  <input type="number" defaultValue={mockPendingRx.extractedData.oi.sphere} className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900" step="0.25" />
                </td>
                <td className="px-4 py-4">
                  <input type="number" defaultValue={mockPendingRx.extractedData.oi.cylinder} className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900" step="0.25" />
                </td>
                <td className="px-4 py-4">
                  <input type="number" defaultValue={mockPendingRx.extractedData.oi.axis} className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Acciones de Validación */}
        <div className="mt-auto flex gap-4">
          <button className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
            <X className="w-5 h-5 mr-2" />
            Rechazar e Informar al Cliente
          </button>
          <button onClick={handleApprove} className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium">
            <Check className="w-5 h-5 mr-2" />
            Sellar y Aprobar
          </button>
        </div>
      </div>
    </div>
  );
}