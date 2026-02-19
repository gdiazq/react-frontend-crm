import type { CrmFeature, CrmPricingPlan, CrmStage, CrmStat } from '@/types'

export const CRM_STATS: CrmStat[] = [
  { label: 'Leads activos', value: '1,284', trend: '+12% esta semana', trendClass: 'text-emerald-400' },
  { label: 'Conversion', value: '34.8%', trend: '+3.2 puntos', trendClass: 'text-emerald-400' },
  { label: 'Tickets SLA', value: '96%', trend: 'Objetivo 98%', trendClass: 'text-amber-400' },
]

export const CRM_STAGES: CrmStage[] = [
  { label: 'Prospectos', width: '85%', barClass: 'bg-cyan-400' },
  { label: 'Calificados', width: '62%', barClass: 'bg-sky-400' },
  { label: 'Negociacion', width: '45%', barClass: 'bg-indigo-400' },
  { label: 'Cierre', width: '28%', barClass: 'bg-emerald-400' },
]

export const CRM_FEATURES: CrmFeature[] = [
  {
    title: 'Automatizaciones',
    description: 'Flujos para asignar leads, disparar correos y generar tareas de seguimiento.',
  },
  {
    title: 'Vista 360 del cliente',
    description: 'Historial comercial, soporte y facturacion en una sola ficha unificada.',
  },
  {
    title: 'Reportes en tiempo real',
    description: 'KPIs de ventas y atencion con filtros por equipo, canal y etapa del pipeline.',
  },
]

export const CRM_PRICING_PLANS: CrmPricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Para equipos pequenos que necesitan orden comercial rapido.',
    priceMonthly: '$29',
    billingLabel: 'por usuario/mes',
    ctaLabel: 'Empezar ahora',
    features: [
      'Hasta 3 usuarios',
      'Pipeline de ventas basico',
      'Recordatorios y tareas',
      'Soporte por correo',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Escala operaciones de ventas y soporte con automatizaciones.',
    priceMonthly: '$79',
    billingLabel: 'por usuario/mes',
    ctaLabel: 'Probar Growth',
    highlighted: true,
    features: [
      'Hasta 25 usuarios',
      'Automatizaciones avanzadas',
      'Reportes en tiempo real',
      'Integraciones con email y WhatsApp',
      'Soporte prioritario',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Control, seguridad y personalizacion para operaciones complejas.',
    priceMonthly: 'Custom',
    billingLabel: 'precio a medida',
    ctaLabel: 'Hablar con ventas',
    features: [
      'Usuarios ilimitados',
      'SSO y politicas de seguridad',
      'Entornos y flujos personalizados',
      'SLA dedicado',
    ],
  },
]
