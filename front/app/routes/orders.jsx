import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { ToastConfirm } from '../components';
import api from '../services/api';
import moment from 'moment';

export default () => {
  const [orders, setOrders] = useState([]);
  const tr = {
    Pending: "Pendiente",
    Delivered: "Entregado",
  };

  useEffect(() => {
    api.orders.get().then((res) => {
      setOrders(res.data);
    });
  }, []);

  const handleDelete = async (orderId) => {    
    const confirm = ToastConfirm({
      message: `¿Estás seguro de que deseas eliminar esta orden?`,
      onConfirm: async (isConfirmed) => {
        if (!isConfirmed) return;
        try {
          await api.orders.delete(orderId).then(() => {
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
          });
          toast.success("Orden eliminada exitosamente");
        } catch (error) {
          toast.error("Error al eliminar orden");
        }
      },
    });

    confirm.show();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer autoClose={10000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Pedidos</h1>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Entrega</th>
              <th className="px-6 py-3 text-left">Productos</th>
              <th className="px-6 py-3 text-left">Costo</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orders.map((order, index) => (
              <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">
                  <span 
                    className={`py-1 px-3 rounded-full text-xs font-medium ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {tr[order.status] || ""}
                  </span>
                </td>
                <td className="px-6 py-3">{moment(order.delivery_at).format("YYYY-MM-DD HH:mm")}</td>
                <td className="px-6 py-3">
                  {order.items.map((item, idx) => (
                    <div key={`${order._id}_${item.product._id}` || idx} className="text-gray-600">
                      - {item.product.name} ({item.quantity})
                    </div>
                  ))}
                </td>
                <td className="px-6 py-3">${parseFloat(order.price).toFixed(2)}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
