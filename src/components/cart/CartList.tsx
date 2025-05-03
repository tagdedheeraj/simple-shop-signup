
import React from 'react';
import { motion } from 'framer-motion';
import CartItem from './CartItem';
import { useCart } from '@/contexts/CartContext';

const CartList: React.FC = () => {
  const { items, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {items.map((item) => (
        <CartItem
          key={item.product.id}
          id={item.product.id}
          name={item.product.name}
          price={item.product.price}
          quantity={item.quantity}
          image={item.product.image}
          stock={item.product.stock}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      ))}
    </div>
  );
};

export default CartList;
