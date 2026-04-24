import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useCart = (user) => {
    const [cartData, setCartData] = useState({ items: [], total_cart_amount: 0 });

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartData({ items: [], total_cart_amount: 0 });
            return;
        }
        try {
            const { data } = await api.get('/orders/cart/');
            setCartData(data);
        } catch (e) {
            console.error('Failed to fetch cart', e);
        }
    }, [user]);

    const addToCart = async (item) => {
        if (!user) return alert("Please login first!");
        await api.post('/orders/cart/', { menu_item_id: item.id, quantity: 1 });
        fetchCart();
    };

    const updateQuantity = async (menu_item_id, delta) => {
        if (!user) return;
        const existingItem = cartData.items.find(i => i.menu_item === menu_item_id);
        if (!existingItem) return;
        
        const newQuantity = existingItem.quantity + delta;
        
        if (newQuantity <= 0) {
            await api.delete(`/orders/cart/?menu_item_id=${menu_item_id}`);
        } else {
            await api.put('/orders/cart/', { menu_item_id, quantity: newQuantity });
        }
        fetchCart();
    };

    useEffect(() => { fetchCart(); }, [fetchCart]);
    
    // Map backend response so the UI code doesn't break
    const cartItems = (cartData.items || []).map(i => ({
        ...i.menu_item_detail,
        cart_item_id: i.id,
        quantity: i.quantity
    }));

    return { cart: cartItems, cartTotal: cartData.total_cart_amount, addToCart, updateQuantity, fetchCart };
};
