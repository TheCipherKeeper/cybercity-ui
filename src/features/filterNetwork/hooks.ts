import { useMemo } from 'react'
import { useFilterNetworkStore } from './model'
import type { ServiceNode } from '@/entities/service'
import type { ServiceLink } from '@/entities/link'

export function useNetworkFilters() {
  const filters = useFilterNetworkStore((state) => ({
    orgIds: state.orgIds,
    kinds: state.kinds,
    exposures: state.exposures,
  }))
  const setOrgIds = useFilterNetworkStore((state) => state.setOrgIds)
  const setKinds = useFilterNetworkStore((state) => state.setKinds)
  const setExposures = useFilterNetworkStore((state) => state.setExposures)
  const reset = useFilterNetworkStore((state) => state.reset)

  return { filters, setOrgIds, setKinds, setExposures, reset }
}

export function useFilteredGraph(
  nodes: ServiceNode[],
  links: ServiceLink[],
): { nodes: ServiceNode[]; links: ServiceLink[] } {
  const filters = useFilterNetworkStore((state) => ({
    orgIds: state.orgIds,
    kinds: state.kinds,
    exposures: state.exposures,
  }))

  return useMemo(() => {
    const activeOrgIds = new Set(filters.orgIds)
    const activeKinds = new Set(filters.kinds)
    const activeExposures = new Set(filters.exposures)

    const hasOrgFilter = activeOrgIds.size > 0
    const hasKindFilter = activeKinds.size > 0
    const hasExposureFilter = activeExposures.size > 0

    const filteredNodes = nodes.filter((node) => {
      if (hasOrgFilter && !activeOrgIds.has(node.orgId)) return false
      if (hasKindFilter && !activeKinds.has(node.kind)) return false
      if (hasExposureFilter && !activeExposures.has(node.exposure)) return false
      return true
    })

    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    const filteredLinks = links.filter(
      (link) => nodeIds.has(link.from) && nodeIds.has(link.to),
    )

    return { nodes: filteredNodes, links: filteredLinks }
  }, [nodes, links, filters])
}
