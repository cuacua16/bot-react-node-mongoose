import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ProductForm, ToastConfirm } from "../components";
import { useCart } from "../context/CartContext";
import { FaEdit, FaTrashAlt, FaCartPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default () => {
  const isAdmin = import.meta.env.VITE_IS_ADMIN === "true";
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const tr = {
    "drink": "Bebida",
    "sushi": "Sushi"
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.get();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error al cargar los productos");
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (product) => {
    const confirm = ToastConfirm({
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`,
      onConfirm: async (isConfirmed) => {
        if (!isConfirmed) return;

        try {
          await api.products.delete(product._id);
          setProducts((prevProducts) =>
            prevProducts.filter((p) => p._id !== product._id)
          );
          toast.success("Producto eliminado exitosamente");
        } catch (error) {
          toast.error("Error al eliminar el producto");
        }
      },
    });

    confirm.show();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`Se ha agregado 1 unidad de ${product.name} al carrito`, {
      position: "bottom-center",
      autoClose: 2000,
      style: { width: 440 },
    });
  };

  return (
    <div>
      <ToastContainer autoClose={9000} />

      {isAdmin && (
        <button
          onClick={() => {
            setSelectedProduct(null);
            setModalOpen(true);
          }}
          className="my-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          Crear Producto
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <div
            key={product._id || idx}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {isAdmin && (
              <div className="flex justify-end gap-2 p-2 bg-gray-100">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 text-gray-800 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt />
                </button>
              </div>
            )}
            <img
              src={product.image_url || "/img/not_available.png"}
              alt={product.name || "Imagen no disponible"}
              className="w-full h-48 object-contain bg-gray-50"
              onError={(e) => (e.target.src = "/img/not_available.png")}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}{" "}
                <span className="text-sm text-gray-500">
                  ({tr[product.type] || ""})
                </span>
              </h3>
              <p className="text-gray-700 mb-4">Precio: <b>${product.price}</b></p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <FaCartPlus /> Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onProductAdded={(newProduct) => {
          if (selectedProduct) {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product._id === newProduct._id ? newProduct : product
              )
            );
            toast.success("Producto actualizado exitosamente");
          } else {
            setProducts((prevProducts) => [...prevProducts, newProduct]);
            toast.success("Producto creado exitosamente");
          }
          setSelectedProduct(null);
        }}
        existingProduct={selectedProduct}
      />
    </div>
  );
};
