import { useSelectServiceStore } from './model'
import type { ServiceNode } from '@/entities/service'

export function useSelectedServiceId(): string | null {
  return useSelectServiceStore((state) => state.selectedServiceId)
}

export function useSelectedService(nodes: ServiceNode[]): ServiceNode | null {
  const selectedId = useSelectedServiceId()
  return nodes.find((node) => node.id === selectedId) ?? null
}

export function useSelectServiceActions() {
  const setId = useSelectServiceStore((state) => state.setSelectedServiceId)
  const clear = useSelectServiceStore((state) => state.clearSelection)
  return { setSelectedServiceId: setId, clearSelection: clear }
}
