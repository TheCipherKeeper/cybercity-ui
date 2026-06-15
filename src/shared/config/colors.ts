import { scaleOrdinal, schemeTableau10 } from 'd3'

export const ORG_COLORS = schemeTableau10

export function createOrgColorScale(orgs: string[]) {
  return scaleOrdinal(ORG_COLORS).domain(orgs)
}

export const CRITICALITY_COLORS: Record<
  'critical' | 'high' | 'medium' | 'low',
  string
> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#22c55e',
}

export const EXPOSURE_COLORS: Record<'public' | 'intranet' | 'ot' | 'mgmt', string> = {
  public: '#ef4444',
  intranet: '#3b82f6',
  ot: '#f59e0b',
  mgmt: '#a855f7',
}
