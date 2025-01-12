// import mongoose from "mongoose";
import { connectMongoDB } from "../config/db.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const productsData = [
  { type: "sushi", name: "Sushi de Salmón", price: 120, image_url: "https://cdn.pixabay.com/photo/2015/02/02/19/31/sushi-621415_640.jpg" },
  { type: "sushi", name: "Sushi de Atún", price: 130, image_url: "https://cdn.pixabay.com/photo/2020/05/15/10/59/sushi-5173229_640.jpg" },
  { type: "sushi", name: "Sushi de Camarón", price: 110, image_url: "https://cdn.pixabay.com/photo/2017/06/01/12/39/sushi-2363418_640.jpg" },
  { type: "sushi", name: "Sushi Vegetariano", price: 90, image_url: "https://cdn.pixabay.com/photo/2017/03/02/20/53/sushi-2112350_640.jpg" },
  { type: "sushi", name: "Sushi Especial", price: 150, image_url: "https://cdn.pixabay.com/photo/2021/01/01/15/31/sushi-balls-5878892_1280.jpg" },
  
  { type: "drink", name: "Té Verde", price: 30, image_url: "https://cdn.pixabay.com/photo/2015/11/12/17/20/tea-1040653_640.jpg" },
  { type: "drink", name: "Agua Mineral", price: 20, image_url: "https://cdn.pixabay.com/photo/2016/11/19/11/34/bottle-1838772_640.jpg" },
  { type: "drink", name: "Cerveza Japonesa", price: 50, image_url: "https://cdn.pixabay.com/photo/2018/05/06/08/49/beer-3378136_640.jpg" },
  { type: "drink", name: "Sake", price: 80, image_url: "https://cdn.pixabay.com/photo/2020/02/16/16/01/sake-4853987_640.jpg" },
  { type: "drink", name: "Refresco de Lata", price: 25, image_url: "https://cdn.pixabay.com/photo/2019/04/28/12/26/cans-4163012_640.jpg" },
];

const createSeedData = async () => {
  try {
    await connectMongoDB();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Datos existentes eliminados");

    const products = await Product.insertMany(productsData);
    console.log("Productos insertados correctamente:");
    console.table(products.map(x => x._doc))

    const ordersData = [
      {
        price: 300,
        delivery_at: new Date(Date.now() + 1800000),
        items: [
          { product: products[0]._id, quantity: 2 },
          { product: products[5]._id, quantity: 2 },
        ],
      },
      {
        price: 190,
        delivery_at: new Date(Date.now() + 900000),
        items: [
          { product: products[2]._id, quantity: 1 },
          { product: products[6]._id, quantity: 3 },
        ],
      },
    ];

    const orders = await Order.insertMany(ordersData);
    console.info("Órdenes insertadas correctamente:");
    console.table(orders.map(x => x._doc))
    console.log("Base de datos cargada con datos iniciales correctamente")
  } catch (error) {
    console.error("Error creando los datos:", error);
  }
};

export { createSeedData };