import { Controller, Get, Query, Param } from '@nestjs/common';

@Controller('catalog')
export class CatalogController {
  
  // Endpoint para la Boutique Virtual (Storefront)
  @Get('products')
  getProducts(@Query('b2b') isB2b: string) {
    // En el futuro, esto llamará a catalog.service.ts para consultar Drizzle ORM
    return [
      { id: "aurum-aviator", name: "Aurum Aviator", price: isB2b === 'true' ? 240 : 320, brand: "Luxe" },
      { id: "onyx-square", name: "Onyx Square", price: isB2b === 'true' ? 210 : 280, brand: "Classic" },
    ];
  }

  // Endpoint para la ficha individual del producto
  @Get('products/:slug')
  getProductBySlug(@Param('slug') slug: string) {
    return {
      id: slug,
      name: slug.replace('-', ' ').toUpperCase(),
      basePrice: 350.00,
      specs: { caliber: "52-18-145", material: "Titanium" }
    };
  }

  // Endpoint exclusivo para el ERP (Inventario)
  @Get('inventory/alerts')
  getLowStockAlerts() {
    return [
      { sku: "LENS-CR39-150", branch: "BODEGA_CENTRAL", currentStock: 12, threshold: 50 },
      { sku: "FRAME-ONYX-SQ", branch: "CLINICA_POLANCO", currentStock: 2, threshold: 5 },
    ];
  }
}