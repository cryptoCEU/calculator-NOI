# Activum — Flex Living Yield Calculator

Calculadora de rentabilidad para inversiones en Flex Living. Calcula NOI, Yield on Cost, Spread, IRR (Unlevered y Levered), MOIC y genera tablas de cash flows con amortización francesa.

## Stack

- React 18 + Vite 5 + TypeScript
- CSS Modules (sin UI library externa)
- Deploy: GitHub + Vercel

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # previsualiza dist/
```

## Despliegue en Vercel

1. Conecta el repo en [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. El archivo `vercel.json` ya configura el rewrite SPA

## Fórmulas

### Total Basis
```
Total Basis = Asking Price + CapEx
```

### Gross Revenue Estabilizado
```
Gross Revenue = Renta mensual × 12 × N.º unidades × (Ocupación / 100)
```

### Net Operating Income (NOI)
```
NOI = Gross Revenue − (Management Fee % × Gross Revenue)
          − (Mantenimiento × Unidades)
          − Seguros − Impuestos − Otros
```

### Yield on Cost (YoC)
```
YoC = NOI estabilizado / Total Basis × 100  [%]
```

### Spread
```
Spread = YoC − YoE  [puntos básicos = × 100]
```

### Valor de Salida
```
Exit Value = NOI en año de venta / (YoE / 100)
```

### Préstamo Francés (cuota mensual constante)
```
r  = tipo_anual / 12 / 100
n  = plazo_años × 12
PMT = P × r × (1+r)^n / ((1+r)^n − 1)
```

### Deuda pendiente en año k
```
D_k = P × ((1+r)^n − (1+r)^k) / ((1+r)^n − 1)
```

### IRR (Bisección + Newton-Raphson)
Resuelve `NPV(irr, CFs) = 0` sobre la serie de cash flows anuales:

- **Unlevered** — Año 0: −Total Basis | Años 1–N: NOI anual | Año N: NOI + Exit Value neto
- **Levered** — Año 0: −Equity | Años 1–N: NOI − Debt Service | Año N: NOI − DS + Exit Value − Deuda pendiente

### MOIC
```
MOIC = (Equity Invertido + Σ Cash Flows netos) / Equity Invertido
```

## Escenarios de ejemplo

| Escenario         | Basis    | Unidades | Renta/ud | Ocupación | LTV |
|-------------------|----------|----------|----------|-----------|-----|
| Activo Estabilizado | €3.0M  | 25       | €1.100   | 92%       | 55% |
| Repositioning     | €2.3M    | 18       | €950     | 85%       | 65% |
| Value-Add         | €2.6M    | 22       | €850     | 80%       | 60% |

## Estructura del proyecto

```
src/
├── types/calculator.ts        # tipos e inputs por defecto
├── utils/
│   ├── calculations.ts        # motor de cálculo (NOI, IRR, MOIC)
│   └── formatters.ts          # formateo locale español
└── components/
    ├── Header.tsx
    ├── TabNav.tsx
    ├── Parametros/            # panel de inputs
    ├── Resultados/            # dashboard de outputs
    ├── Glosario/              # definiciones
    └── inputs/                # componentes reutilizables
```
