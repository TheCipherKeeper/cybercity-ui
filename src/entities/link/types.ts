export interface ServiceLink {
  id: string
  from: string
  to: string
  kind: string
  protocol: string | null
  encryption: string | null
  label: string | null
}

export interface RawServiceLink {
  from: string
  to: string
  kind: string
  protocol: string | null
  encryption: string | null
  label: string | null
}

export function normalizeServiceLink(raw: RawServiceLink, index: number): ServiceLink {
  return {
    id: `${raw.from}→${raw.to}:${raw.kind}:${index}`,
    from: raw.from,
    to: raw.to,
    kind: raw.kind,
    protocol: raw.protocol,
    encryption: raw.encryption,
    label: raw.label,
  }
}
