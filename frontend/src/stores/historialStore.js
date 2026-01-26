import { create } from "zustand";
import PocketBase from "pocketbase/cjs";

const pb = new PocketBase("http://127.0.0.1:8090");

const useHistorialStore = create((set, get) => ({
  historial: [],
  loading: false,
  error: null,
  topTecnico: null,
  topDepartamento: null,

  // Fetch all historial
  fetchHistorial: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const records = await pb.collection("historial").getFullList({
        sort: "-created",
        expand: "departamento,tecnicos_asociados",
      });

      // Calcular el técnico con más soportes
      const tecnicoCounts = {};
      records.forEach((record) => {
        if (record.expand?.tecnicos_asociados) {
          record.expand.tecnicos_asociados.forEach((tecnico) => {
            tecnicoCounts[tecnico.id] = (tecnicoCounts[tecnico.id] || 0) + 1;
          });
        }
      });

      let topTecnico = null;
      let maxCount = 0;
      for (const [id, count] of Object.entries(tecnicoCounts)) {
        if (count > maxCount) {
          maxCount = count;
          // Encontrar el técnico en los registros expandidos
          for (const record of records) {
            if (record.expand?.tecnicos_asociados) {
              const tecnico = record.expand.tecnicos_asociados.find(
                (t) => t.id === id,
              );
              if (tecnico) {
                topTecnico = tecnico;
                break;
              }
            }
          }
        }
      }

      // Calcular el departamento con más soportes
      const departamentoCounts = {};
      records.forEach((record) => {
        if (record.expand?.departamento) {
          const deptId = record.expand.departamento.id;
          departamentoCounts[deptId] = (departamentoCounts[deptId] || 0) + 1;
        }
      });

      let topDepartamento = null;
      let maxDeptCount = 0;
      for (const [id, count] of Object.entries(departamentoCounts)) {
        if (count > maxDeptCount) {
          maxDeptCount = count;
          // Encontrar el departamento en los registros expandidos
          for (const record of records) {
            if (record.expand?.departamento?.id === id) {
              topDepartamento = record.expand.departamento;
              break;
            }
          }
        }
      }

      set({ historial: records, topTecnico, topDepartamento, loading: false });
    } catch (error) {
      console.error("Error fetching historial:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Create a new historial
  createHistorial: async (data) => {
    console.log("Creating historial with data:", data);
    set({ loading: true, error: null });
    try {
      const record = await pb.collection("historial").create(data);
      set((state) => ({
        historial: [record, ...state.historial],
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error creating historial:", error);
      set({
        error: `Failed to create record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },

  // Update a historial
  updateHistorial: async (id, data) => {
    console.log("Updating historial with data:", data);
    set({ loading: true, error: null });
    try {
      const record = await pb.collection("historial").update(id, data);
      set((state) => ({
        historial: state.historial.map((h) => (h.id === id ? record : h)),
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error updating historial:", error);
      set({
        error: `Failed to update record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },

  // Delete a historial
  deleteHistorial: async (id) => {
    set({ loading: true, error: null });
    try {
      await pb.collection("historial").delete(id);
      set((state) => ({
        historial: state.historial.filter((h) => h.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting historial:", error);
      set({
        error: `Failed to delete record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useHistorialStore;
