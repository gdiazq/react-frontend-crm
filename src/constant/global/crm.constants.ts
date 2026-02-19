import type { CrmFeature, CrmStage, CrmStat } from '@/types'

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
