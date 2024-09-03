import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const apiUrl = `${url}/api/order/list`;
      // console.log("Fetching orders from:", apiUrl);
      const response = await axios.get(apiUrl);
      if (response.data.success) {
        setOrders(response.data.data);
        // console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders: " + error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const apiUrl = `${url}/api/order/status`;
      const response = await axios.post(apiUrl, {
        orderId,
        status: event.target.value
      });  
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      
    }
  }


  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  return (
    <div className='order add'>
      <h3>Your Orders</h3>
      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index._id} className='order-item'>
            <img src={assets.parcel_icon} alt="order img" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                    if (index===order.items.length-1) {
                      return item.name + " x " + item.quantity
                    } else {
                      return item.name  + " x " + item.quantity + ", "
                    }
                })}
              </p>
              <p className="order-item-name">
                {
                  order.address.firstName+" "+order.address.lastName
                }
              </p>
              <div className="order-item-address">
                <p>{order.address.street+", "}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>
                {
                  order.address.phone
                }
              </p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;