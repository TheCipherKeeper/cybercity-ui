import { type ServiceNode, normalizeServiceNode, type RawServiceNode } from './types'
import { type ServiceLink, normalizeServiceLink, type RawServiceLink } from '@/entities/link/types'

export interface TopologyPayload {
  schema_version: number
  meta: { source_version: string }
  summary: {
    organizations: number
    networks: number
    services: number
    links: number
    honeypot_services: number
  }
  nodes: RawServiceNode[]
  edges: RawServiceLink[]
}

export interface NetworkGraph {
  nodes: ServiceNode[]
  links: ServiceLink[]
}

export function buildNetworkGraph(payload: TopologyPayload): NetworkGraph {
  const nodes = payload.nodes.map(normalizeServiceNode)
  const nodeIds = new Set(nodes.map((n) => n.id))
  const links = payload.edges
    .map((edge, index) => normalizeServiceLink(edge, index))
    .filter((link) => nodeIds.has(link.from) && nodeIds.has(link.to))

  return { nodes, links }
}

export function getNodeNeighbors(
  nodeId: string,
  links: ServiceLink[],
): { incoming: ServiceLink[]; outgoing: ServiceLink[] } {
  const incoming: ServiceLink[] = []
  const outgoing: ServiceLink[] = []

  for (const link of links) {
    if (link.from === nodeId) outgoing.push(link)
    if (link.to === nodeId) incoming.push(link)
  }

  return { incoming, outgoing }
}

export function searchServices(
  nodes: ServiceNode[],
  query: string,
): ServiceNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return nodes.filter(
    (node) =>
      node.id.toLowerCase().includes(q) ||
      (node.host && node.host.toLowerCase().includes(q)) ||
      node.orgName.toLowerCase().includes(q) ||
      node.kind.toLowerCase().includes(q),
  )
}
