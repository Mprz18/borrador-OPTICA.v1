import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';

@Controller('clinical')
export class ClinicalController {
  
  // Endpoint usado por el Storefront cuando el cliente sube su receta
  @Post('prescriptions/upload')
  async uploadPrescription(@Body() body: any) {
    // Aquí se llamaría al OCRService para extraer los datos de la imagen
    const mockOcrResult = {
      sphereOd: -1.25,
      cylinderOd: -0.50,
      axisOd: 10,
      sphereOi: -1.50,
      cylinderOi: 0,
      axisOi: 0,
      confidenceScore: 0.92 // Confianza del algoritmo de IA
    };

    return {
      message: "Receta procesada con éxito por la IA.",
      needsHumanValidation: mockOcrResult.confidenceScore < 0.95,
      extractedData: mockOcrResult
    };
  }

  // Endpoint usado por el ERP para listar recetas pendientes de validar
  @Get('prescriptions/pending')
  getPendingPrescriptions() {
    return [
      { id: "rx-123", patientId: "user-88", status: "PENDING_DOCTOR_REVIEW" }
    ];
  }

  // Endpoint usado por el Optometrista en el ERP para sellar la receta
  @Patch('prescriptions/:id/verify')
  verifyPrescription(@Param('id') id: string, @Body() doctorModifications: any) {
    // Aquí actualizaríamos el registro en Drizzle ORM (verifiedByDoctor: true)
    return {
      success: true,
      message: `Receta ${id} verificada exitosamente y liberada para el laboratorio.`,
      finalData: doctorModifications
    };
  }
}