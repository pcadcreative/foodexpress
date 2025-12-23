const Order = require('../models/Order');

// Status progression timeline (in milliseconds)
const STATUS_TIMELINE = {
  PENDING: { nextStatus: 'CONFIRMED', delay: 2 * 60 * 1000 }, // 2 minutes
  CONFIRMED: { nextStatus: 'PREPARING', delay: 3 * 60 * 1000 }, // 3 minutes
  PREPARING: { nextStatus: 'OUT_FOR_DELIVERY', delay: 10 * 60 * 1000 }, // 10 minutes
  OUT_FOR_DELIVERY: { nextStatus: 'DELIVERED', delay: 10 * 60 * 1000 } // 10 minutes
  // Total: 2 + 3 + 10 + 10 = 25 minutes (within 20-30 min range)
};

// Update order statuses automatically
async function updateOrderStatuses() {
  try {
    const now = new Date();
    
    for (const [currentStatus, config] of Object.entries(STATUS_TIMELINE)) {
      const cutoffTime = new Date(now.getTime() - config.delay);
      
      // Find orders in current status that are older than the delay
      const ordersToUpdate = await Order.find({
        status: currentStatus,
        updatedAt: { $lte: cutoffTime }
      });
      
      // Update each order to next status
      for (const order of ordersToUpdate) {
        order.status = config.nextStatus;
        order.updatedAt = new Date();
        await order.save();
        
        console.log(`Order ${order._id} updated from ${currentStatus} to ${config.nextStatus}`);
      }
    }
  } catch (error) {
    console.error('Error updating order statuses:', error);
  }
}

// Start the automatic status updater
function startOrderStatusUpdater(intervalMinutes = 1) {
  console.log(`Order Status Updater started - checking every ${intervalMinutes} minute(s)`);
  
  // Run immediately on start
  updateOrderStatuses();
  
  // Run at regular intervals
  setInterval(updateOrderStatuses, intervalMinutes * 60 * 1000);
}

module.exports = { startOrderStatusUpdater, updateOrderStatuses };
