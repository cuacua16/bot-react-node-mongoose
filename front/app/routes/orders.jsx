import React, {useEffect, useState} from 'react'
import api from "../services/api"

export default () => {
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    api.orders.get().then((res) => {
      setOrders(res.data)
    })
  }, [])
  
  return (
    <div>
      {orders.map((order, index) => (
        <div key={index} className={`flex justify-start`}>
          <div className={`p-3 rounded-lg max-w-xs`}>
            {order.status}
            {(
              <div className="mt-2">
                {order.products.map((product, idx) => (
                  <button key={idx}>
                    {product.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <p>Puedes hablar con el Chatbot para crear un nuevo Pedido</p>
    </div>
  )
}