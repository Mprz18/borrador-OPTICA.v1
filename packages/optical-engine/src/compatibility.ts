export interface Prescription {
  sphere: number;
  cylinder: number;
}

export type FrameType = 'full-rim' | 'semi-rimless' | 'rimless';

export function isCompatible(rx: Prescription, frame: FrameType): { valid: boolean; reason?: string } {
  const maxPower = Math.abs(rx.sphere) + Math.abs(rx.cylinder);

  if (frame === 'rimless' || frame === 'semi-rimless') {
    if (maxPower > 6.0) {
      return {
        valid: false,
        reason: "Graduaciones mayores a 6.00 dioptrías requieren armazones de aro completo (full-rim) para ocultar el grosor del borde y garantizar la estabilidad estructural."
      };
    }
  }

  return { valid: true };
}