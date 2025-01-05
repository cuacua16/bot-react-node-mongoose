import cron from 'node-cron';
import Order from '../models/order.model.js';

const updateOrderStatus = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const now = new Date();
      const ordersToUpdate = await Order.find({
        status: 'Pending',
        delivery_at: { $lt: now }
      });

      if (ordersToUpdate.length) {
        for (const order of ordersToUpdate) {
          order.status = 'Delivered';
          await order.save();
        }
      } 
    } catch (error) {
      console.error(error);
    }
  });
};

export default { updateOrderStatus };
