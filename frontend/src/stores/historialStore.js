import { create } from "zustand";
import pb from "../lib/pb";

pb.autoCancellation(false); // Disable auto-cancellation to prevent race conditions

const useHistorialStore = create((set, get) => ({
  historial: [],
  loading: false,
  error: null,
  topTecnico: null,
  topDepartamento: null,

  // Fetch all historial
  fetchHistorial: async () => {
    // Removed loading check to force refresh if needed or handle race conditions better externally
    // if (get().loading) return; 
    set({ loading: true, error: null });
    try {
      const records = await pb.collection("historial").getFullList({
        sort: "-fecha_soporte",
        expand: "departamento,tecnicos_asociados",
        requestKey: null // Explicitly disable request cancellation for this call too
      });

      // Calcular el técnico con más soportes
      const tecnicoCounts = {};
      records.forEach((record) => {
        if (record.expand?.tecnicos_asociados) {
          record.expand.tecnicos_asociados
            .filter(tecnico => !tecnico.cargo?.toUpperCase().includes('JEFE'))
            .forEach((tecnico) => {
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
        let depts = [];
        const expandDept = record.expand?.departamento;
        if (expandDept) {
           if (Array.isArray(expandDept)) {
             depts = expandDept;
           } else {
             depts = [expandDept];
           }
        }
        
        depts.forEach(dept => {
           departamentoCounts[dept.id] = (departamentoCounts[dept.id] || 0) + 1;
        });
      });

      let topDepartamento = null;
      let maxDeptCount = 0;
      for (const [id, count] of Object.entries(departamentoCounts)) {
        if (count > maxDeptCount) {
          maxDeptCount = count;
          // Encontrar el objeto departamento completo para guardarlo en el store
          // Buscamos en TODOS los records hasta encontrar el ID
           for (const record of records) {
             let depts = [];
             const expandDept = record.expand?.departamento;
             if (expandDept) {
                if (Array.isArray(expandDept)) {
                  depts = expandDept;
                } else {
                  depts = [expandDept];
                }
             }
             
             const found = depts.find(d => d.id === id);
             if (found) {
               topDepartamento = found;
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
      let payload = data;
      const hasFile = Object.values(data).some(v => v instanceof File);
      if (hasFile) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') return;
          if (value instanceof File) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        payload = formData;
      }

      const record = await pb.collection("historial").create(payload, {
        expand: "departamento,tecnicos_asociados",
      });
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
      let payload = data;
      const hasFile = Object.values(data).some(v => v instanceof File);
      if (hasFile) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          if (value instanceof File) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        payload = formData;
      }

      const record = await pb.collection("historial").update(id, payload, {
        expand: "departamento,tecnicos_asociados",
      });
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
