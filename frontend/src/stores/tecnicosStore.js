import { create } from "zustand";
import PocketBase from "pocketbase/cjs";

const pb = new PocketBase("http://127.0.0.1:8090");

const useTecnicosStore = create((set, get) => ({
  tecnicos: [],
  loading: false,
  error: null,

  // Fetch all técnicos
  fetchTecnicos: async () => {
    if (get().loading) return; // Prevent concurrent requests
    set({ loading: true, error: null });
    try {
      const records = await pb.collection("tecnicos").getFullList({
        sort: "-created",
      });
      set({ tecnicos: records, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create a new técnico
  createTecnico: async (data) => {
    console.log("Creating tecnico with data:", data);
    set({ loading: true, error: null });
    try {
      const record = await pb.collection("tecnicos").create(data);
      set((state) => ({
        tecnicos: [record, ...state.tecnicos],
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error creating tecnico:", error);
      set({
        error: `Failed to create record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },

  // Update a técnico
  updateTecnico: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const record = await pb.collection("tecnicos").update(id, data);
      set((state) => ({
        tecnicos: state.tecnicos.map((t) => (t.id === id ? record : t)),
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error updating tecnico:", error);
      set({
        error: `Failed to update record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },

  // Delete a técnico
  deleteTecnico: async (id) => {
    set({ loading: true, error: null });
    try {
      await pb.collection("tecnicos").delete(id);
      set((state) => ({
        tecnicos: state.tecnicos.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting tecnico:", error);
      set({
        error: `Failed to delete record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useTecnicosStore;
