import { create } from 'zustand'

interface SearchServiceState {
  query: string
  setQuery: (query: string) => void
  clear: () => void
}

export const useSearchServiceStore = create<SearchServiceState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  clear: () => set({ query: '' }),
}))
