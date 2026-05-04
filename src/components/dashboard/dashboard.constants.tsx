import {
  AUTH_ROUTE_ANNEXES,
  AUTH_ROUTE_CONTRACTS,
  AUTH_ROUTE_EMPLOYEES,
  AUTH_ROUTE_LEAVES,
  AUTH_ROUTE_PROJECTS,
  AUTH_ROUTE_REQUESTS,
  AUTH_ROUTE_ROLES,
  AUTH_ROUTE_SETTLEMENTS,
  AUTH_ROUTE_TRANSFERS,
  AUTH_ROUTE_USERS,
} from '@/constant'
import type { DashboardModule } from './dashboard.types'

const baseIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-5 w-5',
}

export const dashboardModules: DashboardModule[] = [
  {
    label: 'Solicitudes',
    eyebrow: 'Aprobación',
    description: 'Revisa flujos pendientes, operaciones solicitadas y trazabilidad RRHH.',
    route: AUTH_ROUTE_REQUESTS,
    permissionModules: ['HR_REQUEST'],
    accent: 'from-cyan-500 to-sky-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M9 5h10M9 9h10M9 13h10M9 17h10" />
        <rect x="3" y="3" width="3.5" height="3.5" rx="1" />
        <rect x="3" y="8" width="3.5" height="3.5" rx="1" />
        <rect x="3" y="13" width="3.5" height="3.5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Trabajadores',
    eyebrow: 'Personas',
    description: 'Accede a expedientes, datos laborales, usuarios vinculados y estado de alta.',
    route: AUTH_ROUTE_EMPLOYEES,
    permissionModules: ['EMPLOYEE'],
    accent: 'from-emerald-500 to-lime-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Contratos',
    eyebrow: 'Documentos',
    description: 'Gestiona vínculos contractuales, vigencias y movimientos asociados.',
    route: AUTH_ROUTE_CONTRACTS,
    permissionModules: ['CONTRACT'],
    accent: 'from-amber-500 to-orange-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M8 3h8l5 5v13H3V3z" />
        <path d="M16 3v5h5M8 13h8M8 17h8" />
      </svg>
    ),
  },
  {
    label: 'Permisos',
    eyebrow: 'Ausencias',
    description: 'Centraliza permisos, adjuntos, fechas y estado de revisión.',
    route: AUTH_ROUTE_LEAVES,
    permissionModules: ['LEAVE'],
    accent: 'from-sky-500 to-cyan-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M8 3h8l4 4v14H4V3z" />
        <path d="M16 3v4h4M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    label: 'Anexos',
    eyebrow: 'Cambios',
    description: 'Consulta anexos contractuales, documentos y actualizaciones del registro.',
    route: AUTH_ROUTE_ANNEXES,
    permissionModules: ['ANNEX'],
    accent: 'from-teal-500 to-emerald-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M21 11.5l-8.8 8.8a5.5 5.5 0 0 1-7.8-7.8l8.8-8.8a3.6 3.6 0 0 1 5.1 5.1l-8.8 8.8a1.8 1.8 0 1 1-2.5-2.5l8.1-8.1" />
      </svg>
    ),
  },
  {
    label: 'Traspasos',
    eyebrow: 'Movilidad',
    description: 'Controla cambios de proyecto, contrato y asignación operacional.',
    route: AUTH_ROUTE_TRANSFERS,
    permissionModules: ['TRANSFER'],
    accent: 'from-blue-500 to-indigo-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M8 7h9a2 2 0 0 1 2 2v8M16 4l3 3-3 3" />
        <path d="M16 17H7a2 2 0 0 1-2-2V7M8 20l-3-3 3-3" />
      </svg>
    ),
  },
  {
    label: 'Finiquitos',
    eyebrow: 'Cierre',
    description: 'Revisa causales, calidad, seguridad y registros de salida.',
    route: AUTH_ROUTE_SETTLEMENTS,
    permissionModules: [
      'LEGAL_TERMINATION_CAUSE',
      'QUALITY_OF_WORK',
      'SAFETY_COMPLIANCE',
      'NO_REHIRE_CAUSE',
      'TERMINATION_QUIZ_QUESTION',
    ],
    accent: 'from-rose-500 to-orange-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    label: 'Proyectos',
    eyebrow: 'Operación',
    description: 'Entra a proyectos, tipos, especialidades y vigencias del servicio.',
    route: AUTH_ROUTE_PROJECTS,
    permissionModules: ['PROJECT', 'PROJECT_TYPE', 'PROJECT_SPECIALTY', 'PROJECT_STATUS'],
    accent: 'from-cyan-500 to-emerald-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
  },
  {
    label: 'Usuarios',
    eyebrow: 'Accesos',
    description: 'Administra cuentas, perfiles, sesiones y relación con trabajadores.',
    route: AUTH_ROUTE_USERS,
    permissionModules: ['USER'],
    accent: 'from-slate-600 to-cyan-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    label: 'Roles',
    eyebrow: 'Permisos',
    description: 'Define roles y capacidades para cada módulo del sistema.',
    route: AUTH_ROUTE_ROLES,
    permissionModules: ['ROLE'],
    accent: 'from-zinc-700 to-sky-500',
    icon: (
      <svg {...baseIconProps}>
        <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
]
