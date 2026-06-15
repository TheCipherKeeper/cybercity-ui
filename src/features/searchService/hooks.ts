import { useMemo } from 'react'
import { useSearchServiceStore } from './model'
import { searchServices, type ServiceNode } from '@/entities/service'

export function useSearchQuery(): string {
  return useSearchServiceStore((state) => state.query)
}

export function useSearchActions() {
  const setQuery = useSearchServiceStore((state) => state.setQuery)
  const clear = useSearchServiceStore((state) => state.clear)
  return { setQuery, clear }
}

export function useSearchResults(nodes: ServiceNode[]): ServiceNode[] {
  const query = useSearchQuery()
  return useMemo(() => searchServices(nodes, query), [nodes, query])
}
