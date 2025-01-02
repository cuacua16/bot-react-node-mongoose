import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ProductForm, ToastConfirm } from "../components";
import { useCart } from "../context/CartContext";
import { FaEdit, FaTrashAlt, FaCartPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default () => {
  const isAdmin = import.meta.env.VITE_IS_ADMIN === "true";
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
          console.error("Error deleting product:", error);
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
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`, { position: "bottom-center",  autoClose: 2000 });
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
          className="my-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Crear Producto
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product, idx) => (
          <div key={product.id || idx} className="border p-4 rounded-xl shadow-xl">
            {isAdmin && (<div className="flex justify-end gap-1 mb-1 -mt-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaTrashAlt />
                </button>
              </div>
            )}
            <img
              src={product.image_url || "/img/not_available.png"}
              alt={product.name || "Imagen no disponible"}
              className="w-full h-40 object-contain mb-4"
              onError={(e) => (e.target.src = "/img/not_available.png")}
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-700">Precio: ${product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <FaCartPlus /> Agregar al carrito
            </button>
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
