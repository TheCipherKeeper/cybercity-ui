import { useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/shared/api/fetcher'
import { API_CONFIG } from '@/shared/config/api'
import {
  type TopologyPayload,
  buildNetworkGraph,
} from '@/entities/service'
import { buildOrganizations } from '@/entities/organization'
import { useFilteredGraph } from '@/features/filterNetwork'
import { useSelectedService } from '@/features/selectService'
import { NetworkGraph } from '@/widgets/NetworkGraph'
import { NetworkFilters } from '@/widgets/NetworkFilters'
import { NetworkSummary } from '@/widgets/NetworkSummary'
import { SearchBox } from '@/widgets/SearchBox'
import { ServiceSidebar } from '@/widgets/ServiceSidebar'

export function CityMapPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    window.addEventListener('resize', updateSize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  const { data, error, isLoading } = useSWR<TopologyPayload, Error>(
    API_CONFIG.topologyUrl,
    fetcher,
    { revalidateOnFocus: false },
  )

  const graph = data ? buildNetworkGraph(data) : { nodes: [], links: [] }
  const filtered = useFilteredGraph(graph.nodes, graph.links)
  const selectedService = useSelectedService(graph.nodes)
  const organizations = buildOrganizations(graph.nodes)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-cc-bg text-cc-text">
      <header className="flex items-center justify-between border-b border-cc-border px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">CyberCity Map</h1>
          <NetworkSummary
            nodeCount={filtered.nodes.length}
            linkCount={filtered.links.length}
            orgCount={organizations.length}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <SearchBox nodes={graph.nodes} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex flex-col gap-2 overflow-y-auto border-r border-cc-border bg-cc-bg p-2">
          <NetworkFilters nodes={graph.nodes} />
        </aside>

        <main
          ref={containerRef}
          className="relative flex-1 overflow-hidden"
        >
          {size.width > 0 && size.height > 0 && (
            <NetworkGraph
              nodes={filtered.nodes}
              links={filtered.links}
              width={size.width}
              height={size.height}
            />
          )}
        </main>

        {selectedService && (
          <aside className="border-l border-cc-border bg-cc-bg">
            <ServiceSidebar service={selectedService} links={filtered.links} />
          </aside>
        )}
      </div>
    </div>
  )
}
