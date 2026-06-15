import { ServiceNode } from '@/entities/service/types'

export interface Organization {
  id: string
  name: string
  serviceIds: string[]
}

export function buildOrganizations(nodes: ServiceNode[]): Organization[] {
  const map = new Map<string, Organization>()

  for (const node of nodes) {
    const existing = map.get(node.orgId)
    if (existing) {
      existing.serviceIds.push(node.id)
    } else {
      map.set(node.orgId, {
        id: node.orgId,
        name: node.orgName,
        serviceIds: [node.id],
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}
