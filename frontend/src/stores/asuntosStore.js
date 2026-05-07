import { create } from "zustand";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://150.187.4.230:8090");

const useAsuntosStore = create((set) => ({
  asuntos: [],
  loading: false,
  error: null,

  fetchAsuntos: async () => {
    set({ loading: true, error: null });
    try {
      // Intentamos obtener la colección 'asuntos_historial'
      // Si no existe, el usuario verá un error, pero es el camino correcto para datos dinámicos
      const records = await pb.collection("asuntos_historial").getFullList({
        sort: "-created",
      });
      set({ asuntos: records, loading: false });
    } catch (error) {
      console.error("Error fetching asuntos:", error);
      set({ error: error.message, loading: false });
    }
  },

  createAsunto: async (nombre) => {
    set({ loading: true, error: null });
    try {
      const record = await pb.collection("asuntos_historial").create({ nombre });
      set((state) => ({
        asuntos: [record, ...state.asuntos],
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error creating asunto:", error);
      set({ error: error.message, loading: false });
    }
  }
}));

export default useAsuntosStore;
