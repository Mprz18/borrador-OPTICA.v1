/**
 * Motor de Cálculo Óptico
 * Estima el grosor del borde o centro de la mica basado en la refracción y el diámetro del armazón.
 */

export interface LensParams {
  sphere: number;
  cylinder?: number;
  axis?: number;
  index: number; // Índice de refracción (ej. 1.50, 1.60, 1.67, 1.74)
  diameter: number; // Diámetro efectivo del armazón en mm
  centerThickness?: number; // Grosor mínimo al centro para lentes negativos (usualmente 1.5mm)
}

export function calculateLensThickness(params: LensParams): number {
  const { sphere, cylinder = 0, index, diameter, centerThickness = 1.5 } = params;

  // Calculamos el poder máximo en el meridiano principal
  const maxPower = Math.abs(sphere) > Math.abs(sphere + cylinder) 
    ? sphere 
    : sphere + cylinder;

  // Radio de curvatura aproximado
  // r = (n - 1) / P
  const radius = ((index - 1) * 1000) / Math.abs(maxPower || 0.1); // Evitar división por 0

  // Semidiámetro
  const y = diameter / 2;

  // Cálculo de la Sagita (Profundidad de la curva)
  // s = r - sqrt(r^2 - y^2)
  const radicand = Math.pow(radius, 2) - Math.pow(y, 2);
  
  // Si el radicando es negativo, el diámetro es demasiado grande para esta curva
  if (radicand < 0) {
    throw new Error("El diámetro del armazón excede el límite físico para esta graduación y material.");
  }

  const sagitta = radius - Math.sqrt(radicand);

  // Para lentes negativos (miopía), el grosor del borde es Sagita + Grosor Central
  // Para lentes positivos (hipermetropía), el grosor central es Sagita + Grosor del Borde (asumido 1mm)
  if (maxPower < 0) {
    return Number((sagitta + centerThickness).toFixed(2));
  } else {
    return Number((sagitta + 1.0).toFixed(2)); 
  }
}