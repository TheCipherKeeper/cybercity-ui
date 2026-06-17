export type Exposure = 'public' | 'intranet' | 'ot' | 'mgmt'
export type Criticality = 'critical' | 'high' | 'medium' | 'low'

export interface ServiceNode {
  id: string
  kind: string
  description: string | null
  orgId: string
  orgName: string
  networkIndex: number
  networkId: string | null
  bindIp: string | null
  exposure: Exposure
  auth: string
  dataClassification: string
  criticality: Criticality
  ports: string[]
  osHint: string | null
  isHoneypot: boolean
  host: string | null
}

export interface RawServiceNode {
  id: string
  kind: string
  description: string | null
  org_id: string
  org_name: string
  network_index: number
  network_id: string | null
  bind_ip: string | null
  exposure: string
  auth: string
  data_classification: string
  criticality: string
  ports: string[]
  os_hint: string | null
  is_honeypot: boolean
  host: string | null
}

export function normalizeServiceNode(raw: RawServiceNode): ServiceNode {
  return {
    id: raw.id,
    kind: raw.kind,
    description: raw.description,
    orgId: raw.org_id,
    orgName: raw.org_name,
    networkIndex: raw.network_index,
    networkId: raw.network_id,
    bindIp: raw.bind_ip,
    exposure: asExposure(raw.exposure),
    auth: raw.auth,
    dataClassification: raw.data_classification,
    criticality: asCriticality(raw.criticality),
    ports: raw.ports,
    osHint: raw.os_hint,
    isHoneypot: raw.is_honeypot,
    host: raw.host,
  }
}

function asExposure(value: string): Exposure {
  switch (value) {
    case 'public':
    case 'intranet':
    case 'ot':
    case 'mgmt':
      return value
    default:
      return 'intranet'
  }
}

function asCriticality(value: string): Criticality {
  switch (value) {
    case 'critical':
    case 'high':
    case 'medium':
    case 'low':
      return value
    default:
      return 'low'
  }
}
