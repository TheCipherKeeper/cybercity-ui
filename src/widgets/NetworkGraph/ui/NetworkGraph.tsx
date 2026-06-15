import { useEffect, useRef, useMemo, useCallback } from 'react'
import * as d3 from 'd3'
import { useSelectedServiceId, useSelectServiceActions } from '@/features/selectService'
import { createOrgColorScale } from '@/shared/config/colors'
import type { ServiceNode } from '@/entities/service'
import type { ServiceLink } from '@/entities/link'

interface NetworkGraphProps {
  nodes: ServiceNode[]
  links: ServiceLink[]
  width: number
  height: number
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string
  kind: string
  orgId: string
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode
  target: string | SimNode
  kind: string
}

export function NetworkGraph({ nodes, links, width, height }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const selectedId = useSelectedServiceId()
  const { setSelectedServiceId, clearSelection } = useSelectServiceActions()

  const orgs = useMemo(() => Array.from(new Set(nodes.map((n) => n.orgId))), [nodes])

  const neighborIds = useMemo(() => {
    if (!selectedId) return new Set<string>()
    const set = new Set<string>([selectedId])
    for (const link of links) {
      if (link.from === selectedId) set.add(link.to)
      if (link.to === selectedId) set.add(link.from)
    }
    return set
  }, [selectedId, links])

  const centerOnNode = useCallback(
    (nodeId: string) => {
      if (!simulationRef.current || !svgRef.current || !zoomRef.current) return
      const simNode = simulationRef.current.nodes().find((n) => n.id === nodeId)
      if (!simNode || simNode.x == null || simNode.y == null) return

      const svg = d3.select(svgRef.current)
      svg
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1.5)
          .translate(-simNode.x, -simNode.y))
    },
    [width, height],
  )

  useEffect(() => {
    const w = window as unknown as Record<string, (id: string) => void>
    w.__cybercityCenterOnNode = centerOnNode
  }, [centerOnNode])

  useEffect(() => {
    if (!svgRef.current || width === 0 || height === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background-color', '#0b1120')

    const g = svg.append('g')
    gRef.current = g

    const colorScale = createOrgColorScale(orgs)

    const simNodes: SimNode[] = nodes.map((n) => ({
      id: n.id,
      kind: n.kind,
      orgId: n.orgId,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    }))
    const nodeById = new Map(simNodes.map((n) => [n.id, n]))

    const simLinks: SimLink[] = links
      .map((l) => {
        const source = nodeById.get(l.from)
        const target = nodeById.get(l.to)
        if (!source || !target) return null
        return {
          source: source.id,
          target: target.id,
          kind: l.kind,
        } as SimLink
      })
      .filter((l): l is SimLink => l !== null)

    const defs = svg.append('defs')
    const marker = defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
    marker.append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#64748b')

    const linkGroup = g.append('g').attr('class', 'links')
    const nodeGroup = g.append('g').attr('class', 'nodes')
    const labelGroup = g.append('g').attr('class', 'labels')

    const linkElements = linkGroup
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#475569')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1)
      .attr('marker-end', 'url(#arrow)')

    const nodeElements = nodeGroup
      .selectAll('circle')
      .data(simNodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', (d) => colorScale(d.orgId))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')

    const labelElements = labelGroup
      .selectAll('text')
      .data(simNodes)
      .join('text')
      .text((d) => d.id)
      .attr('font-size', 10)
      .attr('fill', '#e2e8f0')
      .attr('dx', 12)
      .attr('dy', 4)
      .style('pointer-events', 'none')
      .style('opacity', 0.7)

    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on('start', (event, d) => {
        if (!event.active && simulationRef.current)
          simulationRef.current.alphaTarget(0.3).restart()
        d.fx = d.x ?? null
        d.fy = d.y ?? null
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active && simulationRef.current)
          simulationRef.current.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeElements.call(drag as unknown as (selection: d3.Selection<SVGCircleElement | d3.BaseType, SimNode, SVGGElement, unknown>) => void)

    nodeElements.on('click', (_event, d) => {
      setSelectedServiceId(d.id)
    })

    svg.on('click', (event) => {
      if (event.target === svgRef.current) {
        clearSelection()
      }
    })

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(180),
      )
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(18))

    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d) => (typeof d.source === 'object' ? d.source.x ?? 0 : 0))
        .attr('y1', (d) => (typeof d.source === 'object' ? d.source.y ?? 0 : 0))
        .attr('x2', (d) => (typeof d.target === 'object' ? d.target.x ?? 0 : 0))
        .attr('y2', (d) => (typeof d.target === 'object' ? d.target.y ?? 0 : 0))

      nodeElements.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0)
      labelElements.attr('x', (d) => d.x ?? 0).attr('y', (d) => d.y ?? 0)
    })

    simulationRef.current = simulation

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString())
      })

    svg.call(zoom)
    zoomRef.current = zoom

    svg.call(zoom.transform, d3.zoomIdentity)

    return () => {
      simulation.stop()
    }
  }, [nodes, links, width, height, orgs, setSelectedServiceId, clearSelection])

  useEffect(() => {
    if (!gRef.current) return

    const colorScale = createOrgColorScale(orgs)

    gRef.current
      .selectAll<SVGCircleElement, SimNode>('circle')
      .attr('fill', (d) => colorScale(d.orgId))
      .attr('stroke-width', (d) => (d.id === selectedId ? 3 : 1.5))
      .attr('r', (d) => (d.id === selectedId ? 12 : 8))
      .attr('stroke', (d) => (d.id === selectedId ? '#facc15' : '#fff'))
      .style('opacity', (d) => {
        if (!selectedId) return 1
        return neighborIds.has(d.id) ? 1 : 0.25
      })

    gRef.current
      .selectAll<SVGTextElement, SimNode>('text')
      .style('opacity', (d) => {
        if (!selectedId) return 0.7
        return neighborIds.has(d.id) ? 1 : 0.2
      })

    gRef.current
      .selectAll<SVGLineElement, SimLink>('line')
      .attr('stroke-opacity', (d) => {
        if (!selectedId) return 0.4
        const sourceId = typeof d.source === 'object' ? d.source.id : d.source
        const targetId = typeof d.target === 'object' ? d.target.id : d.target
        return selectedId === sourceId || selectedId === targetId ? 0.8 : 0.1
      })
      .attr('stroke-width', (d) => {
        if (!selectedId) return 1
        const sourceId = typeof d.source === 'object' ? d.source.id : d.source
        const targetId = typeof d.target === 'object' ? d.target.id : d.target
        return selectedId === sourceId || selectedId === targetId ? 2 : 1
      })
  }, [selectedId, neighborIds, orgs])

  return (
    <svg
      ref={svgRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Network topology graph"
    />
  )
}
