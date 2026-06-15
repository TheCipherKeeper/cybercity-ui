import { create } from 'zustand'

export interface NetworkFilters {
  orgIds: string[]
  kinds: string[]
  exposures: string[]
}

interface FilterNetworkState extends NetworkFilters {
  setOrgIds: (orgIds: string[]) => void
  setKinds: (kinds: string[]) => void
  setExposures: (exposures: string[]) => void
  reset: () => void
}

const initial: NetworkFilters = {
  orgIds: [],
  kinds: [],
  exposures: [],
}

export const useFilterNetworkStore = create<FilterNetworkState>((set) => ({
  ...initial,
  setOrgIds: (orgIds) => set({ orgIds }),
  setKinds: (kinds) => set({ kinds }),
  setExposures: (exposures) => set({ exposures }),
  reset: () => set(initial),
}))
