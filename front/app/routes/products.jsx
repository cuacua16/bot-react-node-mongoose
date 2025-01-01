import React, {useEffect, useState} from 'react'
import api from "../services/api"

export default () => {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    api.products.get().then((res) => {
      setProducts(res.data)
    })
  }, [])
  
  return (
    <div>
      {products.map((product, index) => (
        <div key={index} className={`flex justify-start`}>
          <div className={`p-3 rounded-lg max-w-xs`}>
            {product.name}
          </div>
        </div>
      ))}
      <p>Puedes hablar con el Chatbot saber más de productos</p>
    </div>
  )
}