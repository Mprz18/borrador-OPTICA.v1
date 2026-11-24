import { Module } from '@nestjs/common';

// Módulos de dominio (Listos para descomentar conforme se vayan creando)
// import { CatalogModule } from './catalog/catalog.module';
// import { ClinicalModule } from './clinical/clinical.module';
// import { PricingModule } from './pricing/pricing.module';
// import { SupplyChainModule } from './supply-chain/supply-chain.module';

@Module({
  imports: [
    // El orquestador inyectará los microservicios aquí:
    // CatalogModule,
    // ClinicalModule,
    // PricingModule,
    // SupplyChainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}