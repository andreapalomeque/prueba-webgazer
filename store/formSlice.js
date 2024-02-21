import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
  name: "form",
  initialState: {
    formData: {
      nombre: "",
      apellido: "",
      email: "",
    },
    isLoading: false,
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetFormData: (state) => {
      state.formData = {
        nombre: "",
        apellido: "",
        email: "",
      };
    },
  },
});

export const { setFormData, setIsLoading, resetFormData } = formSlice.actions;

export default formSlice.reducer;
