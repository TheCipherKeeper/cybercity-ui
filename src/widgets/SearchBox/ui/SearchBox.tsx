import { useState, useEffect, useRef } from 'react'
import { useSearchActions, useSearchResults, useSearchQuery } from '@/features/searchService'
import { useSelectServiceActions } from '@/features/selectService'
import type { ServiceNode } from '@/entities/service'
import { Input, Panel } from '@/shared/ui'

interface SearchBoxProps {
  nodes: ServiceNode[]
}

export function SearchBox({ nodes }: SearchBoxProps) {
  const query = useSearchQuery()
  const { setQuery, clear } = useSearchActions()
  const { setSelectedServiceId } = useSelectServiceActions()
  const results = useSearchResults(nodes)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleSelect = (node: ServiceNode) => {
    setSelectedServiceId(node.id)
    const center = (window as unknown as Record<string, (id: string) => void>)
      .__cybercityCenterOnNode
    if (center) center(node.id)
    setOpen(false)
    clear()
  }

  return (
    <div ref={containerRef} className="relative w-72">
      <Input
        placeholder="Поиск сервиса…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(e.target.value.trim().length > 0)
        }}
        onFocus={() => query.trim().length > 0 && setOpen(true)}
        aria-autocomplete="list"
        aria-controls="search-results"
      />

      {open && results.length > 0 && (
        <Panel className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto">
          <ul id="search-results" role="listbox">
            {results.slice(0, 50).map((node) => (
              <li key={node.id}>
                <button
                  role="option"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-cc-bg"
                  onClick={() => handleSelect(node)}
                >
                  <div className="font-medium">{node.id}</div>
                  <div className="text-xs text-cc-muted">
                    {node.orgName} · {node.kind}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}
