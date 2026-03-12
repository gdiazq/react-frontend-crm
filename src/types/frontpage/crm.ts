export interface CrmStat {
  label: string
  value: string
  trend: string
  trendClass: string
}

export interface CrmStage {
  label: string
  width: string
  barClass: string
}

export interface CrmFeature {
  title: string
  description: string
}

export interface CrmPricingPlan {
  id: string
  name: string
  description: string
  priceMonthly: string
  billingLabel: string
  ctaLabel: string
  highlighted?: boolean
  features: string[]
}
