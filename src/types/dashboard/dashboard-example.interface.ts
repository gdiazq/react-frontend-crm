export interface DashboardExampleKpiRaw {
  id: string
  label: string
  value: number
  unit: 'currency' | 'number' | 'percent'
  variation: number
}

export interface DashboardExamplePipelineStageRaw {
  id: string
  label: string
  count: number
  amount: number
}

export interface DashboardExampleTaskRaw {
  id: string
  title: string
  dueAt: string
  priority: 'alta' | 'media' | 'baja'
}

export interface DashboardExampleClientRaw {
  id: string
  name: string
  company: string
  amount: number
  status: 'activo' | 'atrasado'
}

export interface DashboardExampleActivityRaw {
  id: string
  text: string
  at: string
}

export interface DashboardExampleRaw {
  seller: {
    name: string
    role: string
    territory: string
  }
  periodLabel: string
  kpis: DashboardExampleKpiRaw[]
  pipeline: DashboardExamplePipelineStageRaw[]
  tasks: DashboardExampleTaskRaw[]
  topClients: DashboardExampleClientRaw[]
  recentActivity: DashboardExampleActivityRaw[]
}

export interface DashboardExampleKpi {
  id: string
  label: string
  displayValue: string
  variationLabel: string
  variationPositive: boolean
}

export interface DashboardExamplePipelineStage {
  id: string
  label: string
  countLabel: string
  amountLabel: string
}

export interface DashboardExampleTask {
  id: string
  title: string
  dueAtLabel: string
  priority: 'alta' | 'media' | 'baja'
}

export interface DashboardExampleClient {
  id: string
  name: string
  company: string
  amountLabel: string
  status: 'activo' | 'atrasado'
}

export interface DashboardExampleActivity {
  id: string
  text: string
  atLabel: string
}

export interface DashboardExample {
  seller: {
    name: string
    role: string
    territory: string
  }
  periodLabel: string
  kpis: DashboardExampleKpi[]
  pipeline: DashboardExamplePipelineStage[]
  tasks: DashboardExampleTask[]
  topClients: DashboardExampleClient[]
  recentActivity: DashboardExampleActivity[]
}
