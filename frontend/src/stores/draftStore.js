import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useDraftStore = create(
  persist(
    (set, get) => ({
      drafts: {},
      setDraft: (key, data) => set((state) => ({ drafts: { ...state.drafts, [key]: data } })),
      getDraft: (key) => get().drafts[key],
      clearDraft: (key) => set((state) => {
        const newDrafts = { ...state.drafts }
        delete newDrafts[key]
        return { drafts: newDrafts }
      }),
      hasDraft: (key) => {
        const draft = get().drafts[key]
        return draft && Object.keys(draft).length > 0
      }
    }),
    {
      name: 'form-drafts-storage',
    }
  )
)

export default useDraftStore
