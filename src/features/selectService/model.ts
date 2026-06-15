import { create } from 'zustand'

interface SelectServiceState {
  selectedServiceId: string | null
  setSelectedServiceId: (id: string | null) => void
  clearSelection: () => void
}

export const useSelectServiceStore = create<SelectServiceState>((set) => ({
  selectedServiceId: null,
  setSelectedServiceId: (id) => set({ selectedServiceId: id }),
  clearSelection: () => set({ selectedServiceId: null }),
}))
