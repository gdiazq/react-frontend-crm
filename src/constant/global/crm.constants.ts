import type { CrmFeature, CrmPricingPlan, CrmStage, CrmStat } from '@/types'

export const CRM_STATS: CrmStat[] = [
  { label: 'Modulos RRHH', value: '8', trend: 'Trabajadores a finiquitos', trendClass: 'text-cyan-200' },
  { label: 'Flujos clave', value: '5', trend: 'Contratos, permisos y anexos', trendClass: 'text-emerald-200' },
  { label: 'Control acceso', value: '100%', trend: 'Roles y permisos', trendClass: 'text-amber-200' },
]

export const CRM_STAGES: CrmStage[] = [
  { label: 'Ingreso', width: '90%', barClass: 'bg-cyan-400' },
  { label: 'Contrato', width: '76%', barClass: 'bg-emerald-400' },
  { label: 'Operacion', width: '64%', barClass: 'bg-sky-400' },
  { label: 'Cierre', width: '42%', barClass: 'bg-amber-400' },
]

export const CRM_FEATURES: CrmFeature[] = [
  {
    title: 'RRHH conectado',
    description: 'Trabajadores, contratos, anexos, permisos, traspasos y finiquitos comparten una misma estructura visual y operativa.',
  },
  {
    title: 'Proyectos con contexto',
    description: 'Tipos, especialidades, vigencias y proyectos se consultan desde el mismo sistema sin romper el flujo de trabajo.',
  },
  {
    title: 'Acceso gobernado',
    description: 'Usuarios, roles, permisos y sesiones quedan ordenados para administrar seguridad sin perder trazabilidad.',
  },
]

export const CRM_PRICING_PLANS: CrmPricingPlan[] = [
  {
    id: 'starter',
    name: 'Crear acceso',
    description: 'Para usuarios nuevos que necesitan registrar su cuenta y entrar al sistema.',
    priceMonthly: 'Cuenta',
    billingLabel: 'Registro inicial',
    ctaLabel: 'Registrarme',
    features: [
      'Registro con validacion de correo',
      'Ingreso protegido al sistema',
      'Perfil listo para asignacion de permisos',
    ],
  },
  {
    id: 'growth',
    name: 'Ingresar al sistema',
    description: 'Acceso directo para equipos que ya tienen usuario activo y permisos configurados.',
    priceMonthly: 'Sistema',
    billingLabel: 'Acceso operativo',
    ctaLabel: 'Iniciar sesion',
    highlighted: true,
    features: [
      'Panel privado con navegacion por modulos',
      'Sesion identificada por dispositivo',
      'Experiencia adaptada a roles y permisos',
    ],
  },
  {
    id: 'enterprise',
    name: 'Coordinar implementacion',
    description: 'Para preparar roles, modulos y reglas internas antes de operar con el equipo completo.',
    priceMonthly: 'Setup',
    billingLabel: 'Configuracion guiada',
    ctaLabel: 'Contactar equipo',
    features: [
      'Revision de estructura operativa',
      'Asignacion inicial de permisos',
      'Acompanamiento en adopcion del flujo',
    ],
  },
]
