import { useState } from "react";
import { useRouter } from "next/router";
import SubmitButton from "../components/SubmitButton";
//react-redux
import { useSelector, useDispatch } from "react-redux";
import { setFormData, setIsLoading, resetFormData } from "../store/formSlice";

export default function Form() {
  const router = useRouter();

  const dispatch = useDispatch();
  const { formData, isLoading } = useSelector((state) => state.form);

  const handleChange = (e) => {
    dispatch(setFormData({ ...formData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setIsLoading(true));
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        dispatch(setIsLoading(false));
        console.log("Document successfully written!");
        const { id } = await response.json();
        console.log("Document ID: ", id);
        dispatch(resetFormData());
        router.push("/");
      } else {
        dispatch(setIsLoading(false));
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-hablalo_black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white shadow-md rounded-lg w-full max-w-sm"
      >
        {/* Form fields */}
        <label htmlFor="nombre" className="font-semibold text-black">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded text-black"
        />
        <label htmlFor="apellido" className="font-semibold text-black">
          Apellido
        </label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded text-black"
        />
        <label htmlFor="email" className="font-semibold text-black">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded text-black"
        />
        <SubmitButton
          isLoading={isLoading}
          text={"Guardar"}
          loadingText={"Processing..."}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
