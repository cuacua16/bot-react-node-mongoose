import React, { useEffect, useState } from "react";
import api from "../../services/api";

const defaultProduct = {
  name: "",
  price: "",
  image_url: "",
};

export const ProductForm = ({ isOpen, onClose, onProductAdded, existingProduct }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
    } else {
      setFormData({ ...defaultProduct });
    }
  }, [existingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingProduct) {
        const response = await api.products.updateById(existingProduct._id, formData);
        onProductAdded(response.data);
      } else {
        const response = await api.products.create(formData);
        onProductAdded(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <h2 className="text-lg font-bold mb-4">
          {existingProduct ? "Editar Producto" : "Crear Producto"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              URL de la imagen
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {existingProduct ? "Guardar Cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
