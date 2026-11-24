import { MoreVertical, CheckCircle } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-892', patient: 'María López', status: 'pending', rx: '-2.50 / -1.00 x 90' },
  { id: 'ORD-893', patient: 'Carlos Ruiz', status: 'cutting', rx: '+1.00 / -0.50 x 180' },
  { id: 'ORD-894', patient: 'Ana Soto', status: 'assembling', rx: '-4.00 / 0.00' },
];

export default function QueueView() {
  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Columna: Pendientes */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
          <span>Bandeja de Entrada</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">1</span>
        </h4>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Prioridad Alta</span>
            <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <h5 className="font-bold text-gray-900">ORD-892</h5>
          <p className="text-sm text-gray-500 mb-3">Paciente: María López</p>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">RX: -2.50 / -1.00 x 90</div>
        </div>
      </div>

      {/* Columna: En Corte (Tallado) */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
          <span>En Corte (Biselado)</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">1</span>
        </h4>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">En Máquina</span>
          </div>
          <h5 className="font-bold text-gray-900">ORD-893</h5>
          <p className="text-sm text-gray-500 mb-3">Paciente: Carlos Ruiz</p>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">RX: +1.00 / -0.50 x 180</div>
        </div>
      </div>

      {/* Columna: Ensamblaje y Calidad */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
          <span>Ensamblaje & Calidad</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">1</span>
        </h4>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Listo para Revisión
            </span>
          </div>
          <h5 className="font-bold text-gray-900">ORD-894</h5>
          <p className="text-sm text-gray-500 mb-3">Paciente: Ana Soto</p>
          <button className="w-full mt-2 bg-gray-900 text-white py-2 rounded text-sm hover:bg-gray-800 transition">
            Aprobar Envío
          </button>
        </div>
      </div>
    </div>
  );
}