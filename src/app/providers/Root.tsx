import { SWRConfig } from 'swr'

interface RootProps {
  children: React.ReactNode
}

export function Root({ children }: RootProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        },
        suspense: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
