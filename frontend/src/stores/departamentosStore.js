import { create } from "zustand";
import PocketBase from "pocketbase/cjs";

const pb = new PocketBase("http://127.0.0.1:8090");

export { pb };

const useDepartamentosStore = create((set, get) => ({
  departamentos: [],
  loading: false,
  error: null,

  // Fetch all departamentos
  fetchDepartamentos: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const records = await pb.collection("departamentos").getFullList({
        sort: "-created",
      });
      set({ departamentos: records, loading: false });
    } catch (error) {
      console.error("Error fetching departamentos:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Create a new departamento
  createDepartamento: async (data) => {
    console.log("Creating departamento with data:", data);
    set({ loading: true, error: null });
    try {
      let record;
      if (data.ubicacion_img) {
        // Handle file upload
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key !== "ubicacion_img") {
            formData.append(key, data[key]);
          }
        });
        formData.append("ubicacion_img", data.ubicacion_img);
        record = await pb.collection("departamentos").create(formData);
      } else {
        record = await pb.collection("departamentos").create(data);
      }
      set((state) => ({
        departamentos: [record, ...state.departamentos],
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error creating departamento:", error);
      set({
        error: `Failed to create record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },

  // Update a departamento
  updateDepartamento: async (id, data) => {
    console.log("Updating departamento with data:", data);
    set({ loading: true, error: null });
    try {
      let record;
      if (data.ubicacion_img) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key !== "ubicacion_img") {
            formData.append(key, data[key]);
          }
        });
        formData.append("ubicacion_img", data.ubicacion_img);
        record = await pb.collection("departamentos").update(id, formData);
      } else {
        record = await pb.collection("departamentos").update(id, data);
      }
      set((state) => ({
        departamentos: state.departamentos.map((d) =>
          d.id === id ? record : d,
        ),
        loading: false,
      }));
      return record;
    } catch (error) {
      console.error("Error updating departamento:", error);
      set({
        error: `Failed to update record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },

  // Delete a departamento
  deleteDepartamento: async (id) => {
    set({ loading: true, error: null });
    try {
      await pb.collection("departamentos").delete(id);
      set((state) => ({
        departamentos: state.departamentos.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting departamento:", error);
      set({
        error: `Failed to delete record: ${error.message}`,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useDepartamentosStore;
