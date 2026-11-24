import React, { useState, useMemo, useEffect } from 'react';
import {
  Glasses, Sun, Droplet, Plus, Minus, Trash2, CreditCard, Banknote,
  Search, Sparkles, UserPlus, UserCheck, DollarSign, TrendingUp,
  PackageCheck, LogOut, Edit, X, AlertTriangle, CheckCircle,
  ArrowUpRight, FileSpreadsheet, CalendarDays, Printer, Percent, Barcode,
  Shield, ShieldCheck, Award, Layers, BarChart3, Receipt, Wallet,
  PackagePlus, ShoppingBag, Zap, Eye, EyeOff, RotateCcw
} from 'lucide-react';

// ============================================================================
// INTERFACES Y TIPOS DE DATOS
// ============================================================================

type RoleType = 'Gerente' | 'Venta';
type CategoryType = 'oftalmicos' | 'solares' | 'micas' | 'contacto';
type PaymentMethodType = 'Efectivo' | 'Tarjeta';

interface StaffUser {
  id: string;
  name: string;
  role: RoleType;
  email: string;
  pin: string;
  active: boolean;
  salesCount: number;
  totalRevenue: number;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: CategoryType;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  image?: string;
}

interface CartItem {
  cartId: string;
  product: Product;
  qty: number;
  unitPrice: number;
  lensUpgrade?: {
    name: string;
    extraPrice: number;
  };
}

interface SaleTransaction {
  id: string;
  date: string;
  time: string;
  agentId: string;
  agentName: string;
  customerName: string;
  customerPhone?: string;
  items: {
    sku: string;
    name: string;
    brand: string;
    lensUpgrade?: string;
    qty: number;
    unitPrice: number;
    unitCost: number;
  }[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  netProfit: number;
  paymentMethod: PaymentMethodType;
  amountTendered?: number;
  changeDue?: number;
  status: 'Completada' | 'Cancelada';
}

interface ToastNotification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ============================================================================
// DATOS INICIALES DE PRESENTACIÓN
// ============================================================================

const STORAGE_KEYS = {
  PRODUCTS: 'optica_iv_products_v1',
  STAFF: 'optica_iv_staff_v1',
  SALES: 'optica_iv_sales_v1',
};

const TODAY_ISO = new Date().toISOString().split('T')[0];

const LENS_PACKAGES = [
  { id: 'none', name: 'Solo Armazón / Sin Mica Extra', extraPrice: 0 },
  { id: 'ar', name: 'Mica Monofocal + Antirreflejante HD', extraPrice: 1250 },
  { id: 'blue', name: 'Mica Blue-Block (Protección Digital)', extraPrice: 1690 },
  { id: 'photo', name: 'Mica Fotocromática Transitions Gen S', extraPrice: 2890 },
  { id: 'prog', name: 'Progresivo Digital Zeiss SmartLife', extraPrice: 4450 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1', sku: 'TF-5758', name: 'FT5758 Elegance Acetate', brand: 'Tom Ford',
    category: 'oftalmicos', cost: 3800, price: 8490, stock: 5, minStock: 2,
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&q=80'
  },
  {
    id: '2', sku: 'OP-102', name: 'Riley Vintage Tortoise', brand: 'Oliver Peoples',
    category: 'oftalmicos', cost: 3100, price: 6890, stock: 2, minStock: 3,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80'
  },
  {
    id: '3', sku: 'RB-3016', name: 'Clubmaster Classic Gold', brand: 'Ray-Ban',
    category: 'oftalmicos', cost: 1850, price: 4290, stock: 8, minStock: 3,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&q=80'
  },
  {
    id: '4', sku: 'PR-0714', name: '714 Steve McQueen Folding', brand: 'Persol',
    category: 'solares', cost: 3400, price: 7600, stock: 4, minStock: 2,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'
  },
  {
    id: '5', sku: 'CL-4019', name: 'Triomphe Signature Metal', brand: 'Céline',
    category: 'solares', cost: 4200, price: 9350, stock: 1, minStock: 2,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&q=80'
  },
  {
    id: '6', sku: 'ZS-DRV', name: 'Cristal Zeiss DriveSafe Individual', brand: 'Zeiss',
    category: 'micas', cost: 1600, price: 4350, stock: 40, minStock: 10
  },
  {
    id: '7', sku: 'EZ-BLUE', name: 'Tratamiento Crizal Prevencia AR', brand: 'Essilor',
    category: 'micas', cost: 850, price: 2490, stock: 35, minStock: 8
  },
  {
    id: '8', sku: 'AL-DT1', name: 'Dailies Total 1 (Caja 90 Lentes)', brand: 'Alcon',
    category: 'contacto', cost: 920, price: 1950, stock: 16, minStock: 5,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80'
  },
];

// Ambas cuentas configuradas con PIN 1234
const INITIAL_STAFF: StaffUser[] = [
  { id: 'STF-01', name: 'Carlos Rodríguez', role: 'Gerente', email: 'carlos@optica.com', pin: '1234', active: true, salesCount: 18, totalRevenue: 124500 },
  { id: 'STF-02', name: 'María Gómez', role: 'Venta', email: 'maria@optica.com', pin: '1234', active: true, salesCount: 34, totalRevenue: 198400 },
];

const INITIAL_SALES: SaleTransaction[] = [
  {
    id: 'VTA-9042', date: TODAY_ISO, time: '11:42 AM', agentId: 'STF-02', agentName: 'María Gómez',
    customerName: 'Roberto Alcántara', customerPhone: '55 4821 9012',
    items: [
      { sku: 'TF-5758', name: 'FT5758 Elegance Acetate', brand: 'Tom Ford', lensUpgrade: 'Mica Blue-Block (Protección Digital)', qty: 1, unitPrice: 10180, unitCost: 3800 }
    ],
    subtotal: 10180, discountPercent: 0, discountAmount: 0, total: 10180, netProfit: 6380,
    paymentMethod: 'Tarjeta', status: 'Completada'
  },
  {
    id: 'VTA-9041', date: TODAY_ISO, time: '10:15 AM', agentId: 'STF-02', agentName: 'María Gómez',
    customerName: 'Sofía Mendizábal',
    items: [
      { sku: 'AL-DT1', name: 'Dailies Total 1 (Caja 90 Lentes)', brand: 'Alcon', qty: 2, unitPrice: 1950, unitCost: 920 }
    ],
    subtotal: 3900, discountPercent: 10, discountAmount: 390, total: 3510, netProfit: 1670,
    paymentMethod: 'Efectivo', amountTendered: 4000, changeDue: 490, status: 'Completada'
  },
  {
    id: 'VTA-9040', date: TODAY_ISO, time: '09:30 AM', agentId: 'STF-01', agentName: 'Carlos Rodríguez',
    customerName: 'Alejandro Villalobos', customerPhone: '55 9102 3341',
    items: [
      { sku: 'PR-0714', name: '714 Steve McQueen Folding', brand: 'Persol', qty: 1, unitPrice: 7600, unitCost: 3400 },
      { sku: 'EZ-BLUE', name: 'Tratamiento Crizal Prevencia AR', brand: 'Essilor', qty: 1, unitPrice: 2490, unitCost: 850 }
    ],
    subtotal: 10090, discountPercent: 0, discountAmount: 0, total: 10090, netProfit: 5840,
    paymentMethod: 'Tarjeta', status: 'Completada'
  },
];

const CATEGORIES: { id: CategoryType | 'todos'; name: string; icon: React.ReactNode }[] = [
  { id: 'todos', name: 'Todo', icon: <Layers size={18} /> },
  { id: 'oftalmicos', name: 'Oftálmicos', icon: <Glasses size={18} /> },
  { id: 'solares', name: 'Solares', icon: <Sun size={18} /> },
  { id: 'micas', name: 'Cristales', icon: <Sparkles size={18} /> },
  { id: 'contacto', name: 'Contacto', icon: <Droplet size={18} /> },
];

// ============================================================================
// COMPONENTE DE LOGO CON FALLBACK CORPORATIVO
// ============================================================================
function BrandLogo({ className = 'h-12' }: { className?: string }) {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <div className="flex items-center gap-2.5 select-none">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center font-black text-lg tracking-tighter shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          IV
        </div>
        <div className="text-left">
          <div className="text-xs font-bold tracking-[0.25em] text-zinc-100 uppercase">Imagen Visual</div>
          <div className="text-[9px] font-mono tracking-widest text-amber-500 uppercase">Maison Óptica</div>
        </div>
      </div>
    );
  }
  return (
    <img
      src="/logo.png"
      alt="Óptica Imagen Visual"
      onError={() => setImgError(true)}
      className={`${className} w-auto object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]`}
    />
  );
}

// ============================================================================
// APLICACIÓN PRINCIPAL
// ============================================================================

export default function App() {
  const [currentMode, setCurrentMode] = useState<'AUTH' | 'POS' | 'MANAGER'>('AUTH');
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Estados persistentes en localStorage para que sobrevivan recargas en la demo
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [staffList, setStaffList] = useState<StaffUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [sales, setSales] = useState<SaleTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sincronización automática con localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch {
      // Ignorar si almacenamiento privado bloquea escritura
    }
  }, [products, staffList, sales]);

  // Estados de Autenticación
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showPinText, setShowPinText] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados Modo Venta (POS)
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Tarjeta');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [lensConfigProduct, setLensConfigProduct] = useState<Product | null>(null);
  const [selectedLensId, setSelectedLensId] = useState<string>('none');
  const [receiptModalSale, setReceiptModalSale] = useState<SaleTransaction | null>(null);
  const [showSellerShiftModal, setShowSellerShiftModal] = useState(false);

  // Estados Modo Gerente
  const [managerTab, setManagerTab] = useState<'OVERVIEW' | 'INVENTORY' | 'STAFF' | 'Z_REPORT'>('OVERVIEW');
  const [exportPreset, setExportPreset] = useState<'TODOS' | 'HOY' | 'MES' | 'ANIO' | 'PERSONALIZADO'>('TODOS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modal Producto
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    sku: '', name: '', brand: '', category: 'oftalmicos' as CategoryType,
    cost: '', price: '', stock: '', minStock: '2', image: ''
  });

  // Modal Staff
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: '', email: '', role: 'Venta' as RoleType, pin: ''
  });

  // Reloj en vivo
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const pushToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Restaurar datos de presentación
  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setStaffList(INITIAL_STAFF);
    setSales(INITIAL_SALES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    pushToast('Demo Restaurada', 'Inventario, cuentas y ventas restablecidos a valores iniciales.', 'info');
  };

  // ============================================================================
  // LÓGICA DE ACCESO
  // ============================================================================

  const handlePinPadClick = (digit: string) => {
    if (loginPin.length < 4) {
      setLoginPin(prev => prev + digit);
      setLoginError('');
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const user = staffList.find(
      s => s.email.toLowerCase().trim() === loginEmail.toLowerCase().trim() && s.pin === loginPin
    );

    if (!user) {
      setLoginError('Correo o PIN de seguridad incorrecto.');
      setLoginPin('');
      return;
    }
    if (!user.active) {
      setLoginError('Esta cuenta se encuentra suspendida.');
      return;
    }

    setCurrentUser(user);
    setLoginError('');
    setLoginEmail('');
    setLoginPin('');
    setShowPinText(false);
    setCurrentMode(user.role === 'Gerente' ? 'MANAGER' : 'POS');
    pushToast(`Bienvenido, ${user.name}`, `Sesión iniciada en Modo ${user.role}`, 'info');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentMode('AUTH');
    setCart([]);
    setDiscountPercent(0);
    setCashTendered('');
  };

  // ============================================================================
  // LÓGICA MODO VENTA (POS)
  // ============================================================================

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = activeCategory === 'todos' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [products, activeCategory, searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const exactSku = products.find(p => p.sku.toLowerCase() === searchQuery.trim().toLowerCase());
      if (exactSku) {
        addProductToCart(exactSku);
        setSearchQuery('');
      }
    }
  };

  const addProductToCart = (product: Product, lensPackage = LENS_PACKAGES[0]) => {
    if (product.stock <= 0) {
      pushToast('Sin Existencias', `${product.name} está agotado en almacén.`, 'error');
      return;
    }

    const totalQtyInCart = cart
      .filter(c => c.product.id === product.id)
      .reduce((acc, c) => acc + c.qty, 0);

    if (totalQtyInCart + 1 > product.stock) {
      pushToast('Límite de Stock', `Solo quedan ${product.stock} unidades disponibles.`, 'error');
      return;
    }

    const upgrade = lensPackage.id !== 'none'
      ? { name: lensPackage.name, extraPrice: lensPackage.extraPrice }
      : undefined;

    const unitPrice = product.price + (upgrade ? upgrade.extraPrice : 0);
    const cartKey = `${product.id}-${lensPackage.id}`;

    const existing = cart.find(c => c.cartId === cartKey);
    if (existing) {
      setCart(cart.map(c => c.cartId === cartKey ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { cartId: cartKey, product, qty: 1, unitPrice, lensUpgrade: upgrade }]);
    }

    pushToast('Agregado al Ticket', `${product.brand} ${product.name}`, 'success');
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId !== cartId) return item;
      const newQty = item.qty + delta;
      if (newQty <= 0) return null;

      const otherQtySameProduct = prev
        .filter(c => c.product.id === item.product.id && c.cartId !== cartId)
        .reduce((acc, c) => acc + c.qty, 0);

      if (newQty + otherQtySameProduct > item.product.stock) {
        pushToast('Stock Insuficiente', `Máximo ${item.product.stock} piezas disponibles.`, 'error');
        return item;
      }
      return { ...item, qty: newQty };
    }).filter(Boolean) as CartItem[]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
  const discountAmount = Math.round(cartSubtotal * (discountPercent / 100));
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);
  const numericTendered = parseFloat(cashTendered) || 0;
  const changeDue = paymentMethod === 'Efectivo' && numericTendered >= cartTotal ? numericTendered - cartTotal : 0;

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Efectivo' && numericTendered > 0 && numericTendered < cartTotal) {
      pushToast('Monto Insuficiente', 'El efectivo recibido es menor al total a cobrar.', 'error');
      return;
    }

    setProducts(prev => prev.map(p => {
      const soldQty = cart.filter(c => c.product.id === p.id).reduce((acc, c) => acc + c.qty, 0);
      return soldQty > 0 ? { ...p, stock: Math.max(0, p.stock - soldQty) } : p;
    }));

    const totalCost = cart.reduce((acc, c) => acc + c.product.cost * c.qty, 0);
    const netProfit = cartTotal - totalCost;

    const newSale: SaleTransaction = {
      id: `VTA-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      agentId: currentUser?.id || 'STF-00',
      agentName: currentUser?.name || 'Cajero',
      customerName: customerName.trim() || 'Cliente de Mostrador',
      customerPhone: customerPhone.trim() || undefined,
      items: cart.map(c => ({
        sku: c.product.sku,
        name: c.product.name,
        brand: c.product.brand,
        lensUpgrade: c.lensUpgrade?.name,
        qty: c.qty,
        unitPrice: c.unitPrice,
        unitCost: c.product.cost
      })),
      subtotal: cartSubtotal,
      discountPercent,
      discountAmount,
      total: cartTotal,
      netProfit,
      paymentMethod,
      amountTendered: paymentMethod === 'Efectivo' ? (numericTendered || cartTotal) : undefined,
      changeDue: paymentMethod === 'Efectivo' ? changeDue : undefined,
      status: 'Completada'
    };

    setSales(prev => [newSale, ...prev]);

    if (currentUser) {
      setStaffList(prev => prev.map(s =>
        s.id === currentUser.id
          ? { ...s, salesCount: s.salesCount + 1, totalRevenue: s.totalRevenue + cartTotal }
          : s
      ));
    }

    setReceiptModalSale(newSale);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountPercent(0);
    setCashTendered('');
    pushToast('Venta Completada', `Ticket ${newSale.id} registrado correctamente.`, 'success');
  };

  // ============================================================================
  // LÓGICA MODO GERENTE
  // ============================================================================

  const filteredSales = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

    return sales.filter(s => {
      if (exportPreset === 'HOY') return s.date === today;
      if (exportPreset === 'MES') return s.date.startsWith(`${currentYear}-${currentMonth}`);
      if (exportPreset === 'ANIO') return s.date.startsWith(currentYear);
      if (exportPreset === 'PERSONALIZADO') {
        if (startDate && s.date < startDate) return false;
        if (endDate && s.date > endDate) return false;
        return true;
      }
      return true;
    });
  }, [sales, exportPreset, startDate, endDate]);

  const activeFilteredSales = filteredSales.filter(s => s.status === 'Completada');
  const kpiRevenue = activeFilteredSales.reduce((acc, s) => acc + s.total, 0);
  const kpiProfit = activeFilteredSales.reduce((acc, s) => acc + s.netProfit, 0);
  const kpiCashTotal = activeFilteredSales.filter(s => s.paymentMethod === 'Efectivo').reduce((acc, s) => acc + s.total, 0);
  const kpiCardTotal = activeFilteredSales.filter(s => s.paymentMethod === 'Tarjeta').reduce((acc, s) => acc + s.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const warehouseTotalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const handleDownloadExcel = () => {
    if (filteredSales.length === 0) {
      pushToast('Sin Datos', 'No hay ventas en el rango seleccionado para exportar.', 'error');
      return;
    }

    let csv = '\uFEFF';
    csv += 'Folio Ticket,Fecha,Hora,Estado,Vendedor,Cliente,Telefono,Metodo Pago,Detalle de Productos,Subtotal (MXN),Descuento (%),Total Cobrado (MXN),Utilidad Neta (MXN)\n';

    filteredSales.forEach(s => {
      const detail = s.items
        .map(i => `${i.qty}x [${i.sku}] ${i.brand} ${i.name}${i.lensUpgrade ? ` + ${i.lensUpgrade}` : ''}`)
        .join(' | ');

      csv += [
        s.id,
        s.date,
        s.time,
        s.status,
        `"${s.agentName.replace(/"/g, '""')}"`,
        `"${s.customerName.replace(/"/g, '""')}"`,
        `"${s.customerPhone || 'N/A'}"`,
        s.paymentMethod,
        `"${detail.replace(/"/g, '""')}"`,
        s.subtotal,
        `${s.discountPercent}%`,
        s.total,
        s.status === 'Completada' ? s.netProfit : 0
      ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const rangeTag = exportPreset === 'PERSONALIZADO' ? `${startDate || 'inicio'}_a_${endDate || 'hoy'}` : exportPreset;
    link.href = url;
    link.download = `Reporte_Ventas_OpticaImagenVisual_${rangeTag}_${TODAY_ISO}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    pushToast('Excel Generado', `Se descargó el reporte (${filteredSales.length} registros).`, 'success');
  };

  const handleVoidSale = (saleId: string) => {
    const target = sales.find(s => s.id === saleId);
    if (!target || target.status === 'Cancelada') return;

    setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: 'Cancelada' } : s));
    setProducts(prev => prev.map(p => {
      const returnedItem = target.items.find(i => i.sku === p.sku);
      return returnedItem ? { ...p, stock: p.stock + returnedItem.qty } : p;
    }));
    pushToast('Venta Anulada', `Ticket ${saleId} cancelado y stock restaurado.`, 'info');
  };

  const openProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdForm({
        sku: prod.sku, name: prod.name, brand: prod.brand, category: prod.category,
        cost: prod.cost.toString(), price: prod.price.toString(),
        stock: prod.stock.toString(), minStock: prod.minStock.toString(),
        image: prod.image || ''
      });
    } else {
      setEditingProduct(null);
      setProdForm({
        sku: `OPT-${Math.floor(100 + Math.random() * 899)}`,
        name: '', brand: '', category: 'oftalmicos',
        cost: '', price: '', stock: '5', minStock: '2', image: ''
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseFloat(prodForm.cost) || 0;
    const priceNum = parseFloat(prodForm.price) || 0;
    const stockNum = parseInt(prodForm.stock) || 0;
    const minStockNum = parseInt(prodForm.minStock) || 2;

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p, sku: prodForm.sku, name: prodForm.name, brand: prodForm.brand,
        category: prodForm.category, cost: costNum, price: priceNum,
        stock: stockNum, minStock: minStockNum, image: prodForm.image || undefined
      } : p));
      pushToast('Producto Actualizado', `${prodForm.brand} ${prodForm.name} guardado.`);
    } else {
      const newP: Product = {
        id: Date.now().toString(),
        sku: prodForm.sku, name: prodForm.name, brand: prodForm.brand || 'Maison',
        category: prodForm.category, cost: costNum, price: priceNum,
        stock: stockNum, minStock: minStockNum, image: prodForm.image || undefined
      };
      setProducts(prev => [newP, ...prev]);
      pushToast('Producto Creado', `${newP.brand} ${newP.name} añadido al catálogo.`);
    }
    setShowProductModal(false);
  };

  const openStaffModal = (staff?: StaffUser) => {
    if (staff) {
      setEditingStaff(staff);
      setStaffForm({ name: staff.name, email: staff.email, role: staff.role, pin: '' });
    } else {
      setEditingStaff(null);
      setStaffForm({ name: '', email: '', role: 'Venta', pin: '' });
    }
    setShowStaffModal(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name.trim() || !staffForm.email.trim()) return;

    if (editingStaff) {
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? {
        ...s,
        name: staffForm.name.trim(),
        email: staffForm.email.trim(),
        role: staffForm.role,
        pin: staffForm.pin.length === 4 ? staffForm.pin : s.pin
      } : s));
      pushToast('Personal Actualizado', `Permisos de ${staffForm.name} actualizados.`);
    } else {
      if (staffForm.pin.length !== 4) {
        pushToast('PIN Inválido', 'Asigna un PIN numérico de 4 dígitos.', 'error');
        return;
      }
      const newStaff: StaffUser = {
        id: `STF-${Math.floor(10 + Math.random() * 89)}`,
        name: staffForm.name.trim(),
        email: staffForm.email.trim(),
        role: staffForm.role,
        pin: staffForm.pin,
        active: true,
        salesCount: 0,
        totalRevenue: 0
      };
      setStaffList(prev => [...prev, newStaff]);
      pushToast('Cuenta Creada', `${newStaff.name} registrado como ${newStaff.role}.`);
    }
    setShowStaffModal(false);
  };

  // ============================================================================
  // RENDERIZADO DE INTERFAZ
  // ============================================================================

  return (
    <div className="flex h-screen bg-[#09090B] text-zinc-100 font-sans overflow-hidden selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Estilos de Impresión Limpios */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* NOTIFICACIONES FLOTANTES */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[300px] max-w-sm p-4 border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all ${
              t.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                : t.type === 'info'
                ? 'bg-zinc-900/95 border-amber-500/50 text-zinc-100'
                : 'bg-zinc-900/95 border-emerald-500/50 text-zinc-100'
            }`}
          >
            {t.type === 'error' ? (
              <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">{t.title}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* VISTA 0: PORTAL DE ACCESO (EXCLUSIVO GERENTE Y VENTA - PIN 1234)     */}
      {/* ==================================================================== */}
      {currentMode === 'AUTH' && (
        <div className="flex w-full h-full">
          {/* Panel Editorial Izquierdo */}
          <div className="hidden lg:flex w-7/12 bg-zinc-900 relative items-center justify-center overflow-hidden border-r border-zinc-800/80">
            <img
              src="https://images.unsplash.com/photo-1551829142-d9b8e66c78bc?q=80&w=1400"
              alt="Maison Óptica"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#09090B] via-[#09090B]/70 to-transparent" />

            <div className="relative z-10 max-w-lg px-12 text-center flex flex-col items-center">
              <BrandLogo className="h-28 mb-8" />
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-mono uppercase tracking-[0.25em] mb-6">
                <Shield size={12} /> Retail & Executive Suite
              </div>
              <h1 className="text-4xl font-light text-zinc-100 tracking-[0.2em] uppercase leading-snug">
                Óptica Imagen Visual
              </h1>
              <div className="w-16 h-0.5 bg-amber-500 my-6" />
              <p className="text-xs text-zinc-400 font-mono leading-relaxed uppercase tracking-widest">
                Terminal de Punto de Venta & Control Gerencial Omnisciente
              </p>
            </div>
          </div>

          {/* Panel Derecho de Acceso */}
          <div className="w-full lg:w-5/12 flex items-center justify-center bg-[#09090B] p-6 sm:p-10 overflow-y-auto">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-6">
                  <BrandLogo className="h-16" />
                </div>
                <h2 className="text-2xl font-light text-zinc-100 tracking-widest uppercase">Control de Acceso</h2>
                <p className="text-xs text-zinc-500 font-mono mt-1">Selecciona un perfil de acceso o ingresa credenciales</p>
              </div>

              {/* Selector Rápido de Rol (PIN 1234 en ambas cuentas) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setLoginEmail('carlos@optica.com'); setLoginPin('1234'); setLoginError(''); }}
                  className={`p-3.5 border text-left transition-all ${
                    loginEmail === 'carlos@optica.com'
                      ? 'bg-amber-500/10 border-amber-500 text-zinc-100'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Shield size={16} className="text-amber-400" />
                    <span className="text-[9px] font-mono text-amber-400 uppercase">PIN: 1234</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider">Modo Gerente</div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">carlos@optica.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginEmail('maria@optica.com'); setLoginPin('1234'); setLoginError(''); }}
                  className={`p-3.5 border text-left transition-all ${
                    loginEmail === 'maria@optica.com'
                      ? 'bg-amber-500/10 border-amber-500 text-zinc-100'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <ShoppingBag size={16} className="text-emerald-400" />
                    <span className="text-[9px] font-mono text-emerald-400 uppercase">PIN: 1234</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider">Modo Venta</div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">maria@optica.com</div>
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                    Correo Corporativo
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="usuario@optica.com"
                    className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-100 outline-none focus:border-amber-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Contraseña / PIN (4 Dígitos)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPinText(!showPinText)}
                      className="text-[10px] font-mono text-zinc-500 hover:text-amber-400 flex items-center gap-1"
                    >
                      {showPinText ? <><EyeOff size={12} /> Ocultar</> : <><Eye size={12} /> Mostrar</>}
                    </button>
                  </div>
                  <input
                    type={showPinText ? 'text' : 'password'}
                    maxLength={4}
                    value={loginPin}
                    onChange={e => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ingresa PIN"
                    className="w-full bg-zinc-900 border border-zinc-800 py-3 text-center text-xl font-mono font-bold tracking-[0.4em] text-amber-400 placeholder:text-zinc-600 placeholder:text-xs placeholder:tracking-widest outline-none focus:border-amber-500 transition-all"
                    required
                  />
                </div>

                {/* Teclado Numérico Táctil */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Limpiar', '0', 'Borrar'].map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (key === 'Limpiar') setLoginPin('');
                        else if (key === 'Borrar') setLoginPin(prev => prev.slice(0, -1));
                        else handlePinPadClick(key);
                      }}
                      className={`py-2.5 bg-zinc-900/90 hover:bg-zinc-800 active:bg-amber-500 active:text-zinc-950 border border-zinc-800/90 font-mono font-bold transition-all ${
                        key.length > 1 ? 'text-[10px] uppercase tracking-wider text-zinc-400' : 'text-sm text-zinc-200'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                {loginError && (
                  <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs p-3 font-mono text-center">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 uppercase tracking-[0.2em] text-xs shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all"
                >
                  Ingresar al Sistema
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VISTA 1: MODO VENTA (POS)                                            */}
      {/* ==================================================================== */}
      {currentMode === 'POS' && (
        <div className="flex w-full h-full">
          <aside className="w-24 bg-[#111114] border-r border-zinc-800/80 flex flex-col items-center py-6 justify-between z-20">
            <div className="w-full flex flex-col items-center">
              <div className="mb-8 px-2 flex justify-center">
                <BrandLogo className="h-11" />
              </div>

              <nav className="flex flex-col gap-2.5 w-full px-2.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center justify-center py-3.5 px-1 border transition-all ${
                      activeCategory === cat.id
                        ? 'bg-amber-500 border-amber-400 text-zinc-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'bg-zinc-900/50 border-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100'
                    }`}
                  >
                    <div className="mb-1.5">{cat.icon}</div>
                    <span className="text-[9px] uppercase tracking-widest text-center leading-tight">{cat.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="w-full px-2.5 space-y-2">
              <button
                onClick={() => setShowSellerShiftModal(true)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-400 flex flex-col items-center justify-center transition-all"
                title="Resumen de Mi Turno"
              >
                <Wallet size={16} />
                <span className="text-[8px] font-mono uppercase tracking-wider mt-1">Mi Caja</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-zinc-900 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-500/40 text-zinc-500 hover:text-rose-400 flex flex-col items-center justify-center transition-all"
              >
                <LogOut size={16} />
                <span className="text-[8px] font-mono uppercase tracking-wider mt-1">Salir</span>
              </button>
            </div>
          </aside>

          {/* Catálogo Central */}
          <main className="flex-1 flex flex-col bg-[#09090B] overflow-hidden">
            <header className="bg-[#111114] px-8 py-4 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-light text-zinc-100 tracking-[0.2em] uppercase">Punto de Venta</h1>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase">
                    Caja Activa
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Asesor: <span className="text-amber-400 font-bold">{currentUser?.name}</span> • {currentTime}
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar modelo, marca o SKU..."
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 pl-10 pr-8 py-2.5 text-xs font-mono text-zinc-100 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              {filteredProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-3">
                  <Search size={40} strokeWidth={1} />
                  <p className="text-xs font-mono uppercase tracking-widest">Sin resultados para "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map(product => {
                    const isOut = product.stock <= 0;
                    const isLow = product.stock > 0 && product.stock <= product.minStock;
                    const canAddLens = product.category === 'oftalmicos' || product.category === 'solares';

                    return (
                      <div
                        key={product.id}
                        className={`group bg-[#111114] border transition-all flex flex-col justify-between ${
                          isOut
                            ? 'border-zinc-900 opacity-50'
                            : 'border-zinc-800/90 hover:border-amber-500/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                        }`}
                      >
                        <div className="h-44 bg-zinc-950 relative flex items-center justify-center p-4 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                              <Sparkles size={28} className="text-amber-400" />
                            </div>
                          )}

                          <span className="absolute top-2.5 left-2.5 bg-zinc-900/90 border border-zinc-800 px-2 py-0.5 text-[9px] font-mono text-zinc-400">
                            {product.sku}
                          </span>

                          <span
                            className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-mono font-bold border ${
                              isOut
                                ? 'bg-rose-950/90 border-rose-500/40 text-rose-400'
                                : isLow
                                ? 'bg-amber-950/90 border-amber-500/40 text-amber-400'
                                : 'bg-zinc-900/90 border-zinc-800 text-emerald-400'
                            }`}
                          >
                            {isOut ? 'AGOTADO' : `${product.stock} DISP`}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between border-t border-zinc-800/60">
                          <div>
                            <div className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                              {product.brand}
                            </div>
                            <h3 className="text-xs font-bold text-zinc-100 mt-1 line-clamp-2">{product.name}</h3>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between gap-2">
                            <span className="text-base font-mono font-bold text-zinc-100">
                              ${product.price.toLocaleString('es-MX')}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {canAddLens && !isOut && (
                                <button
                                  onClick={() => { setLensConfigProduct(product); setSelectedLensId('ar'); }}
                                  className="px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-amber-400 uppercase tracking-wider transition-all"
                                  title="Agregar con Micas / Graduación"
                                >
                                  + Mica
                                </button>
                              )}
                              <button
                                onClick={() => addProductToCart(product)}
                                disabled={isOut}
                                className="p-2 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold transition-all"
                                title="Agregar Directo"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>

          {/* Panel Derecho: Orden y Cobro */}
          <aside className="w-[380px] xl:w-[420px] bg-[#111114] border-l border-zinc-800/80 flex flex-col z-10">
            <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-100 flex items-center gap-2">
                  <Receipt size={15} className="text-amber-500" /> Orden en Curso
                </h2>
                <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{cart.reduce((a, b) => a + b.qty, 0)} artículos seleccionados</p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => { setCart([]); setDiscountPercent(0); setCashTendered(''); }}
                  className="text-[10px] font-mono text-rose-400 hover:text-rose-300 uppercase underline"
                >
                  Vaciar
                </button>
              )}
            </div>

            <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre cliente (opcional)"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Teléfono / WhatsApp"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-200 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-3">
                  <Glasses size={42} strokeWidth={1} />
                  <p className="text-xs font-mono uppercase tracking-widest">Toca un artículo para vender</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="bg-zinc-950 border border-zinc-800/90 p-3.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-mono text-amber-500 uppercase">{item.product.brand} • {item.product.sku}</div>
                      <h4 className="text-xs font-bold text-zinc-100 truncate">{item.product.name}</h4>
                      {item.lensUpgrade && (
                        <div className="text-[10px] font-mono text-emerald-400 mt-0.5 truncate">
                          + {item.lensUpgrade.name}
                        </div>
                      )}
                      <div className="text-xs font-mono text-zinc-400 mt-1">
                        ${(item.unitPrice * item.qty).toLocaleString('es-MX')} MXN
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1">
                      <button
                        onClick={() => updateCartQty(item.cartId, -1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                      >
                        {item.qty === 1 ? <Trash2 size={12} className="text-rose-400" /> : <Minus size={12} />}
                      </button>
                      <span className="w-5 text-center text-xs font-mono font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.cartId, 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                  <Percent size={12} className="text-amber-500" /> Cortesía / Desc:
                </span>
                <div className="flex gap-1">
                  {[0, 5, 10, 15].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setDiscountPercent(pct)}
                      className={`px-2 py-1 text-[10px] font-mono font-bold border transition-all ${
                        discountPercent === pct
                          ? 'bg-amber-500 border-amber-500 text-zinc-950'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('Tarjeta')}
                  className={`py-2.5 border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'Tarjeta'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <CreditCard size={15} /> Tarjeta
                </button>
                <button
                  onClick={() => setPaymentMethod('Efectivo')}
                  className={`py-2.5 border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'Efectivo'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Banknote size={15} /> Efectivo
                </button>
              </div>

              {paymentMethod === 'Efectivo' && cart.length > 0 && (
                <div className="bg-zinc-900/90 border border-zinc-800 p-3 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <label className="block text-[9px] font-mono text-zinc-400 uppercase">Recibido ($)</label>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={e => setCashTendered(e.target.value)}
                      placeholder={cartTotal.toString()}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-sm font-mono font-bold text-emerald-400 outline-none focus:border-emerald-500 mt-1"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-mono text-zinc-400 uppercase">Cambio</span>
                    <span className="text-lg font-mono font-bold text-zinc-100">
                      ${changeDue.toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-2 border-t border-zinc-800/80 text-xs font-mono">
                {discountPercent > 0 && (
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal: ${cartSubtotal.toLocaleString('es-MX')}</span>
                    <span className="text-emerald-400">-${discountAmount.toLocaleString('es-MX')}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 uppercase tracking-widest font-sans font-bold">Total a Cobrar</span>
                  <span className="text-2xl font-bold text-zinc-100">${cartTotal.toLocaleString('es-MX')}</span>
                </div>
              </div>

              <button
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-950 font-black py-4 text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all"
              >
                Cobrar y Emitir Ticket
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VISTA 2: MODO GERENTE (CENTRO DE COMANDO EJECUTIVO)                  */}
      {/* ==================================================================== */}
      {currentMode === 'MANAGER' && (
        <div className="flex flex-col w-full h-full bg-[#09090B] overflow-hidden">
          <header className="bg-[#111114] border-b border-zinc-800/80 px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-5">
              <BrandLogo className="h-10" />
              <div className="h-7 w-px bg-zinc-800 hidden sm:block" />
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-base font-light tracking-[0.2em] uppercase text-zinc-100">
                    Comando Gerencial
                  </h1>
                  <span className="bg-amber-500 text-zinc-950 text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
                    Admin Total
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  {currentUser?.name} • {currentTime}
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1">
              {[
                { id: 'OVERVIEW', label: 'Analítica & Ventas', icon: <BarChart3 size={14} /> },
                { id: 'INVENTORY', label: 'Inventario & Márgenes', icon: <PackageCheck size={14} /> },
                { id: 'STAFF', label: 'Equipo & Accesos', icon: <UserCheck size={14} /> },
                { id: 'Z_REPORT', label: 'Corte de Caja Z', icon: <Receipt size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setManagerTab(tab.id as any)}
                  className={`px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                    managerTab === tab.id
                      ? 'bg-amber-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDemoData}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
                title="Restaurar datos originales de presentación"
              >
                <RotateCcw size={13} /> <span className="hidden xl:inline">Reiniciar Demo</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-zinc-900 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <LogOut size={15} /> Salir
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* BARRA DE FILTRO TEMPORAL Y EXPORTACIÓN EXCEL */}
              <div className="bg-[#111114] border border-zinc-800/90 p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-100 flex items-center gap-2">
                    <CalendarDays size={16} className="text-amber-500" /> Auditoría Temporal & Exportación Excel
                  </h2>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1">
                    Filtra por día, mes, año o fechas específicas y descarga el archivo contable en Excel.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex bg-zinc-950 border border-zinc-800 p-1 text-[10px] font-mono">
                    {(['TODOS', 'HOY', 'MES', 'ANIO', 'PERSONALIZADO'] as const).map(preset => (
                      <button
                        key={preset}
                        onClick={() => setExportPreset(preset)}
                        className={`px-3 py-1.5 font-bold uppercase transition-all ${
                          exportPreset === preset
                            ? 'bg-amber-500 text-zinc-950'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {preset === 'ANIO' ? 'AÑO' : preset}
                      </button>
                    ))}
                  </div>

                  {exportPreset === 'PERSONALIZADO' && (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                      />
                      <span className="text-zinc-600">→</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleDownloadExcel}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all ml-auto lg:ml-0"
                  >
                    <FileSpreadsheet size={16} /> Descargar Excel
                  </button>
                </div>
              </div>

              {/* SUB-PESTAÑA 1: ANALÍTICA Y VENTAS */}
              {managerTab === 'OVERVIEW' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-[#111114] border border-zinc-800/90 p-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Ingresos ({exportPreset})</span>
                        <DollarSign size={18} className="text-amber-400" />
                      </div>
                      <div className="text-3xl font-mono font-bold text-zinc-100 mt-3">
                        ${kpiRevenue.toLocaleString('es-MX')}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
                        <TrendingUp size={13} /> {activeFilteredSales.length} tickets cerrados
                      </div>
                    </div>

                    <div className="bg-[#111114] border border-zinc-800/90 p-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Utilidad Neta Real</span>
                        <Award size={18} className="text-emerald-400" />
                      </div>
                      <div className="text-3xl font-mono font-bold text-emerald-400 mt-3">
                        ${kpiProfit.toLocaleString('es-MX')}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-2">
                        Margen: {kpiRevenue > 0 ? Math.round((kpiProfit / kpiRevenue) * 100) : 0}% sobre venta
                      </div>
                    </div>

                    <div
                      onClick={() => setManagerTab('INVENTORY')}
                      className="bg-[#111114] border border-zinc-800/90 hover:border-amber-500/60 p-6 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Valor en Almacén</span>
                        <ArrowUpRight size={18} className="text-amber-400" />
                      </div>
                      <div className="text-3xl font-mono font-bold text-zinc-100 mt-3">
                        ${warehouseTotalValue.toLocaleString('es-MX')}
                      </div>
                      <div className={`text-[11px] font-mono mt-2 ${lowStockProducts.length > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                        {lowStockProducts.length} productos con stock crítico
                      </div>
                    </div>

                    <div
                      onClick={() => setManagerTab('Z_REPORT')}
                      className="bg-[#111114] border border-zinc-800/90 hover:border-amber-500/60 p-6 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Desglose Cobros</span>
                        <CreditCard size={18} className="text-amber-400" />
                      </div>
                      <div className="mt-3 space-y-1 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Tarjeta:</span>
                          <span className="text-zinc-100 font-bold">${kpiCardTotal.toLocaleString('es-MX')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Efectivo:</span>
                          <span className="text-emerald-400 font-bold">${kpiCashTotal.toLocaleString('es-MX')}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-amber-400 mt-2 uppercase">Ver Corte de Caja →</div>
                    </div>
                  </div>

                  {/* Gráfica de Líneas + Ranking de Asesores */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#111114] border border-zinc-800/90 p-6">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-100 mb-6 flex items-center gap-2">
                        <BarChart3 size={16} className="text-amber-500" /> Distribución de Ventas por Línea
                      </h3>
                      <div className="space-y-4">
                        {(['oftalmicos', 'solares', 'micas', 'contacto'] as CategoryType[]).map(cat => {
                          const catRevenue = activeFilteredSales.reduce((sum, s) => {
                            const catItems = s.items.filter(it => {
                              const p = products.find(pr => pr.sku === it.sku);
                              return p?.category === cat;
                            });
                            return sum + catItems.reduce((a, b) => a + b.unitPrice * b.qty, 0);
                          }, 0);
                          const pct = kpiRevenue > 0 ? Math.round((catRevenue / kpiRevenue) * 100) : 0;

                          return (
                            <div key={cat} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="uppercase text-zinc-300 font-bold">{cat}</span>
                                <span className="text-amber-400">${catRevenue.toLocaleString('es-MX')} ({pct}%)</span>
                              </div>
                              <div className="w-full h-2.5 bg-zinc-950 border border-zinc-800 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
                                  style={{ width: `${Math.max(pct, 2)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#111114] border border-zinc-800/90 p-6">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-100 mb-6 flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" /> Rendimiento del Equipo
                      </h3>
                      <div className="space-y-4">
                        {[...staffList]
                          .sort((a, b) => b.totalRevenue - a.totalRevenue)
                          .map((stf, idx) => (
                            <div key={stf.id} className="p-3.5 bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-amber-500 font-bold">#{idx + 1}</span>
                                  <span className="text-xs font-bold text-zinc-100">{stf.name}</span>
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                                  Modo {stf.role} • {stf.salesCount} ventas
                                </div>
                              </div>
                              <div className="text-right font-mono">
                                <div className="text-xs font-bold text-emerald-400">${stf.totalRevenue.toLocaleString('es-MX')}</div>
                                <div className="text-[9px] text-zinc-500">Com: ${Math.round(stf.totalRevenue * 0.05).toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Bitácora Completa de Tickets */}
                  <div className="bg-[#111114] border border-zinc-800/90">
                    <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-100">
                        Auditoría Completa de Tickets ({filteredSales.length})
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px]">
                          <tr>
                            <th className="p-4">Folio / Fecha</th>
                            <th className="p-4">Vendedor</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Artículos</th>
                            <th className="p-4">Método</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Utilidad</th>
                            <th className="p-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                          {filteredSales.map(sale => (
                            <tr key={sale.id} className={`hover:bg-zinc-900/70 ${sale.status === 'Cancelada' ? 'opacity-45' : ''}`}>
                              <td className="p-4">
                                <div className="font-bold text-amber-400">{sale.id}</div>
                                <div className="text-[10px] text-zinc-500">{sale.date} • {sale.time}</div>
                              </td>
                              <td className="p-4 font-sans font-medium text-zinc-200">{sale.agentName}</td>
                              <td className="p-4 font-sans text-zinc-300">{sale.customerName}</td>
                              <td className="p-4 max-w-xs">
                                {sale.items.map((it, i) => (
                                  <div key={i} className="truncate text-[11px]">
                                    {it.qty}x {it.brand} {it.name}
                                  </div>
                                ))}
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 text-[10px] border ${
                                  sale.paymentMethod === 'Tarjeta'
                                    ? 'border-amber-500/30 text-amber-400 bg-amber-500/5'
                                    : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                                }`}>
                                  {sale.paymentMethod}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-zinc-100">${sale.total.toLocaleString('es-MX')}</td>
                              <td className="p-4 text-emerald-400">
                                {sale.status === 'Completada' ? `+$${sale.netProfit.toLocaleString('es-MX')}` : '$0'}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => setReceiptModalSale(sale)}
                                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-200 uppercase"
                                >
                                  Ticket
                                </button>
                                {sale.status === 'Completada' && (
                                  <button
                                    onClick={() => handleVoidSale(sale.id)}
                                    className="px-2.5 py-1 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 text-[10px] text-rose-400 uppercase"
                                  >
                                    Anular
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* SUB-PESTAÑA 2: INVENTARIO Y MÁRGENES */}
              {managerTab === 'INVENTORY' && (
                <div className="bg-[#111114] border border-zinc-800/90">
                  <div className="p-6 border-b border-zinc-800 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-100">
                        Catálogo Maestro & Control de Existencias
                      </h2>
                      <p className="text-xs font-mono text-zinc-500 mt-1">
                        Administra costos, precios al público, márgenes y reposición de mercancía.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={inventorySearch}
                          onChange={e => setInventorySearch(e.target.value)}
                          placeholder="Filtrar SKU o marca..."
                          className="bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        onClick={() => openProductModal()}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                      >
                        <PackagePlus size={16} /> Nuevo Producto
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-4">SKU</th>
                          <th className="p-4">Producto / Marca</th>
                          <th className="p-4">Categoría</th>
                          <th className="p-4">Costo</th>
                          <th className="p-4">PVP Público</th>
                          <th className="p-4">Margen</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4 text-right">Gestión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                        {products
                          .filter(p =>
                            !inventorySearch ||
                            p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                            p.brand.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                            p.sku.toLowerCase().includes(inventorySearch.toLowerCase())
                          )
                          .map(prod => {
                            const marginPct = prod.price > 0 ? Math.round(((prod.price - prod.cost) / prod.price) * 100) : 0;
                            const isLow = prod.stock <= prod.minStock;

                            return (
                              <tr key={prod.id} className="hover:bg-zinc-900/70">
                                <td className="p-4 text-amber-400 font-bold">{prod.sku}</td>
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-zinc-100">{prod.name}</div>
                                  <div className="text-[11px] text-zinc-500">{prod.brand}</div>
                                </td>
                                <td className="p-4 uppercase text-[10px]">{prod.category}</td>
                                <td className="p-4 text-zinc-400">${prod.cost.toLocaleString('es-MX')}</td>
                                <td className="p-4 font-bold text-zinc-100">${prod.price.toLocaleString('es-MX')}</td>
                                <td className="p-4 text-emerald-400 font-bold">{marginPct}%</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p))}
                                      className="w-6 h-6 bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:text-rose-400"
                                    >
                                      -
                                    </button>
                                    <span className={`w-8 text-center font-bold ${isLow ? 'text-rose-400' : 'text-zinc-100'}`}>
                                      {prod.stock}
                                    </span>
                                    <button
                                      onClick={() => setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: p.stock + 1 } : p))}
                                      className="w-6 h-6 bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:text-emerald-400"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => openProductModal(prod)}
                                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-400 text-[10px] uppercase inline-flex items-center gap-1"
                                  >
                                    <Edit size={12} /> Editar
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-PESTAÑA 3: EQUIPO Y ACCESOS (SIN PUNTOS ESTÁTICOS) */}
              {managerTab === 'STAFF' && (
                <div className="bg-[#111114] border border-zinc-800/90">
                  <div className="p-6 border-b border-zinc-800 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-100">
                        Cuentas de Personal (Modo Gerente & Modo Venta)
                      </h2>
                      <p className="text-xs font-mono text-zinc-500 mt-1">
                        Administra accesos, roles operativos y credenciales de seguridad.
                      </p>
                    </div>
                    <button
                      onClick={() => openStaffModal()}
                      className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-2.5 text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                      <UserPlus size={16} /> Crear Cuenta Staff
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-4">ID / Colaborador</th>
                          <th className="p-4">Correo de Acceso</th>
                          <th className="p-4">Modo Asignado</th>
                          <th className="p-4">Credencial</th>
                          <th className="p-4">Ventas Cerradas</th>
                          <th className="p-4">Estado</th>
                          <th className="p-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                        {staffList.map(stf => (
                          <tr key={stf.id} className="hover:bg-zinc-900/70">
                            <td className="p-4">
                              <div className="font-sans font-bold text-zinc-100">{stf.name}</div>
                              <div className="text-[10px] text-zinc-500">{stf.id}</div>
                            </td>
                            <td className="p-4 text-zinc-400">{stf.email}</td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 text-[10px] font-bold uppercase border ${
                                  stf.role === 'Gerente'
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                }`}
                              >
                                Modo {stf.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 uppercase">
                                <ShieldCheck size={12} className="text-emerald-400" /> PIN Activo
                              </span>
                            </td>
                            <td className="p-4 text-zinc-200">
                              {stf.salesCount} (${stf.totalRevenue.toLocaleString('es-MX')})
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => setStaffList(prev => prev.map(s => s.id === stf.id ? { ...s, active: !s.active } : s))}
                                className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
                                  stf.active
                                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                    : 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                                }`}
                              >
                                {stf.active ? 'Activo' : 'Suspendido'}
                              </button>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => openStaffModal(stf)}
                                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-400 text-[10px] uppercase inline-flex items-center gap-1"
                              >
                                <Edit size={12} /> Editar / Cambiar PIN
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-PESTAÑA 4: CORTE DE CAJA Z */}
              {managerTab === 'Z_REPORT' && (
                <div id="printable-area" className="max-w-3xl mx-auto bg-[#111114] border border-zinc-800 p-8 space-y-6">
                  <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
                    <div>
                      <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Documento Contable</span>
                      <h2 className="text-2xl font-light uppercase tracking-widest text-zinc-100 mt-1">
                        Corte de Caja Z ({exportPreset})
                      </h2>
                      <p className="text-xs font-mono text-zinc-500 mt-1">Generado por: {currentUser?.name} • {TODAY_ISO}</p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase tracking-wider text-zinc-200 flex items-center gap-2"
                    >
                      <Printer size={15} /> Imprimir Corte
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div className="p-4 bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase">Fondo Inicial de Caja</span>
                      <div className="text-xl font-bold text-zinc-200 mt-1">$2,500.00 MXN</div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase">Efectivo en Gaveta (Ventas + Fondo)</span>
                      <div className="text-xl font-bold text-emerald-400 mt-1">
                        ${(2500 + kpiCashTotal).toLocaleString('es-MX')}.00 MXN
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase">Terminal Bancaria (Tarjetas)</span>
                      <div className="text-xl font-bold text-amber-400 mt-1">
                        ${kpiCardTotal.toLocaleString('es-MX')}.00 MXN
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase">Descuentos Otorgados</span>
                      <div className="text-xl font-bold text-rose-400 mt-1">
                        -${activeFilteredSales.reduce((a, b) => a + b.discountAmount, 0).toLocaleString('es-MX')}.00 MXN
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-6 flex justify-between items-center font-mono">
                    <span className="text-sm uppercase tracking-widest text-zinc-400">Gran Total Auditado</span>
                    <span className="text-3xl font-bold text-zinc-100">${kpiRevenue.toLocaleString('es-MX')}.00 MXN</span>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: CONFIGURADOR DE MICAS / GRADUACIÓN RÁPIDA EN POS            */}
      {/* ==================================================================== */}
      {lensConfigProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">{lensConfigProduct.brand}</span>
                <h3 className="text-base font-bold text-zinc-100">{lensConfigProduct.name}</h3>
              </div>
              <button onClick={() => setLensConfigProduct(null)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Selecciona Tratamiento Óptico para este Armazón:
              </label>
              {LENS_PACKAGES.map(pkg => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedLensId(pkg.id)}
                  className={`w-full p-3.5 border text-left flex items-center justify-between transition-all ${
                    selectedLensId === pkg.id
                      ? 'bg-amber-500/10 border-amber-500 text-zinc-100'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-medium">{pkg.name}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {pkg.extraPrice === 0 ? 'Incluido' : `+$${pkg.extraPrice.toLocaleString('es-MX')}`}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setLensConfigProduct(null)}
                className="px-4 py-2.5 text-xs font-mono uppercase text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const chosen = LENS_PACKAGES.find(l => l.id === selectedLensId) || LENS_PACKAGES[0];
                  addProductToCart(lensConfigProduct, chosen);
                  setLensConfigProduct(null);
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-widest"
              >
                Agregar al Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: TICKET TÉRMICO IMPRIMIBLE (80MM)                            */}
      {/* ==================================================================== */}
      {receiptModalSale && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 max-w-sm w-full shadow-2xl overflow-hidden">
            <div id="printable-area" className="bg-zinc-100 text-zinc-900 p-6 font-mono text-xs space-y-4">
              <div className="text-center border-b border-dashed border-zinc-400 pb-4">
                <h3 className="font-black text-base tracking-widest uppercase">Óptica Imagen Visual</h3>
                <p className="text-[10px] text-zinc-600 mt-1">Sucursal Central • Salud & Estilo Visual</p>
                <p className="text-[10px] text-zinc-600">{receiptModalSale.date} • {receiptModalSale.time}</p>
                <p className="text-[11px] font-bold mt-1">FOLIO: {receiptModalSale.id}</p>
              </div>

              <div className="text-[11px] space-y-0.5 border-b border-dashed border-zinc-400 pb-3">
                <div><strong>Cliente:</strong> {receiptModalSale.customerName}</div>
                {receiptModalSale.customerPhone && <div><strong>Tel:</strong> {receiptModalSale.customerPhone}</div>}
                <div><strong>Atendió:</strong> {receiptModalSale.agentName}</div>
              </div>

              <div className="space-y-2 border-b border-dashed border-zinc-400 pb-3">
                {receiptModalSale.items.map((it, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>{it.qty}x {it.brand} {it.name}</span>
                      <span>${(it.unitPrice * it.qty).toLocaleString('es-MX')}</span>
                    </div>
                    {it.lensUpgrade && (
                      <div className="text-[10px] text-zinc-600 pl-3">+ {it.lensUpgrade}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${receiptModalSale.subtotal.toLocaleString('es-MX')}</span>
                </div>
                {receiptModalSale.discountPercent > 0 && (
                  <div className="flex justify-between text-zinc-700">
                    <span>Descuento ({receiptModalSale.discountPercent}%):</span>
                    <span>-${receiptModalSale.discountAmount.toLocaleString('es-MX')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black pt-1 border-t border-zinc-400">
                  <span>TOTAL MXN:</span>
                  <span>${receiptModalSale.total.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span>Pago ({receiptModalSale.paymentMethod}):</span>
                  <span>${(receiptModalSale.amountTendered || receiptModalSale.total).toLocaleString('es-MX')}</span>
                </div>
                {receiptModalSale.changeDue !== undefined && receiptModalSale.changeDue > 0 && (
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Cambio Entregado:</span>
                    <span>${receiptModalSale.changeDue.toLocaleString('es-MX')}</span>
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] text-zinc-600 pt-3 border-t border-dashed border-zinc-400">
                Garantía de adaptación de 30 días.<br />
                ¡Gracias por su preferencia!
              </div>
            </div>

            <div className="p-4 bg-zinc-950 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Printer size={15} /> Imprimir
              </button>
              <button
                onClick={() => setReceiptModalSale(null)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: RESUMEN DE TURNO DEL VENDEDOR (MI CAJA)                     */}
      {/* ==================================================================== */}
      {showSellerShiftModal && currentUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-zinc-800 max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Resumen de Mi Turno</h3>
              <button onClick={() => setShowSellerShiftModal(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {(() => {
              const mySales = sales.filter(s => s.agentId === currentUser.id && s.date === TODAY_ISO && s.status === 'Completada');
              const myCash = mySales.filter(s => s.paymentMethod === 'Efectivo').reduce((a, b) => a + b.total, 0);
              const myCard = mySales.filter(s => s.paymentMethod === 'Tarjeta').reduce((a, b) => a + b.total, 0);
              return (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Tickets Cobrados Hoy:</span>
                    <span className="font-bold text-zinc-100">{mySales.length}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Efectivo Recaudado:</span>
                    <span className="font-bold text-emerald-400">${myCash.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Vouchers Tarjeta:</span>
                    <span className="font-bold text-amber-400">${myCard.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/40 flex justify-between text-sm">
                    <span className="font-bold text-amber-400 uppercase">Total Mi Turno:</span>
                    <span className="font-black text-zinc-100">${(myCash + myCard).toLocaleString('es-MX')} MXN</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: CREAR / EDITAR PRODUCTO (GERENTE)                           */}
      {/* ==================================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-[#111114] border border-zinc-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100">
                {editingProduct ? 'Editar Artículo' : 'Registrar Nuevo Artículo'}
              </h3>
              <button type="button" onClick={() => setShowProductModal(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Código SKU</label>
                <input
                  type="text" required value={prodForm.sku}
                  onChange={e => setProdForm({ ...prodForm, sku: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Marca</label>
                <input
                  type="text" required value={prodForm.brand}
                  onChange={e => setProdForm({ ...prodForm, brand: e.target.value })}
                  placeholder="Ej. Ray-Ban"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Nombre / Modelo</label>
              <input
                type="text" required value={prodForm.name}
                onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                placeholder="Ej. Aviator Classic Gold"
                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Categoría</label>
                <select
                  value={prodForm.category}
                  onChange={e => setProdForm({ ...prodForm, category: e.target.value as CategoryType })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                >
                  <option value="oftalmicos">Oftálmicos</option>
                  <option value="solares">Solares</option>
                  <option value="micas">Cristales</option>
                  <option value="contacto">Contacto</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Costo ($)</label>
                <input
                  type="number" required value={prodForm.cost}
                  onChange={e => setProdForm({ ...prodForm, cost: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Precio Venta ($)</label>
                <input
                  type="number" required value={prodForm.price}
                  onChange={e => setProdForm({ ...prodForm, price: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-amber-400 font-bold outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Stock Inicial</label>
                <input
                  type="number" required value={prodForm.stock}
                  onChange={e => setProdForm({ ...prodForm, stock: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Alerta Mínima</label>
                <input
                  type="number" required value={prodForm.minStock}
                  onChange={e => setProdForm({ ...prodForm, minStock: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">URL de Fotografía (Opcional)</label>
              <input
                type="text" value={prodForm.image}
                onChange={e => setProdForm({ ...prodForm, image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-xs text-zinc-300 outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 text-xs uppercase tracking-widest mt-2"
            >
              Guardar en Inventario
            </button>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: CREAR / EDITAR CUENTA STAFF                                 */}
      {/* ==================================================================== */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveStaff} className="bg-[#111114] border border-zinc-800 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100">
                {editingStaff ? 'Editar Cuenta de Personal' : 'Nueva Cuenta de Personal'}
              </h3>
              <button type="button" onClick={() => setShowStaffModal(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Nombre Completo</label>
              <input
                type="text" required value={staffForm.name}
                onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                placeholder="Ej. Sofía Hernández"
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Correo de Acceso</label>
              <input
                type="email" required value={staffForm.email}
                onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                placeholder="sofia@optica.com"
                className="w-full bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-zinc-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Modo Permitido</label>
                <select
                  value={staffForm.role}
                  onChange={e => setStaffForm({ ...staffForm, role: e.target.value as RoleType })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                >
                  <option value="Venta">Modo Venta</option>
                  <option value="Gerente">Modo Gerente</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                  {editingStaff ? 'Nuevo PIN (Opcional)' : 'PIN de 4 Dígitos'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required={!editingStaff}
                  value={staffForm.pin}
                  onChange={e => setStaffForm({ ...staffForm, pin: e.target.value.replace(/\D/g, '') })}
                  placeholder="Ej. 1234"
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 text-center font-mono tracking-[0.3em] text-xs text-amber-400 placeholder:text-zinc-600 placeholder:tracking-normal outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 text-xs uppercase tracking-widest mt-2"
            >
              {editingStaff ? 'Guardar Cambios' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}