import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const useCart = (user) => {
    const [cartData, setCartData] = useState({ items: [], total_cart_amount: 0 });

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartData({ items: [], total_cart_amount: 0 });
            return;
        }
        try {
            const { data } = await api.get('/cart/');
            setCartData(data);
        } catch (e) {
            console.error('Failed to fetch cart', e);
        }
    }, [user]);

    const addToCart = async (item) => {
        if (!user) return toast.error("Please login first!");

        try {
            await api.post('/cart/add_item/', { menu_item_id: item.id, quantity: 1 });
            toast.success("Item added to cart!");
            await fetchCart();
        } catch (e) {
            toast.error(e.response?.data?.error || "Failed to add item to cart");
        }
    };

    const updateQuantity = async (menu_item_id, delta) => {
        if (!user) return;
        const existingItem = cartData.items.find(i => i.menu_item === menu_item_id);
        if (!existingItem) return;
        
        const newQuantity = existingItem.quantity + delta;
        
        try {
            if (newQuantity <= 0) {
                await api.post('/cart/remove_item/', { cart_item_id: existingItem.id });
            } else {
                await api.post('/cart/update_item/', { cart_item_id: existingItem.id, quantity: newQuantity });
            }
            await fetchCart();
        } catch (e) {
            toast.error(e.response?.data?.error || "Failed to update item quantity");
        }
    };

    useEffect(() => { fetchCart(); }, [fetchCart]);
    
    // Listen for cart clearing events (like after successful payment)
    useEffect(() => {
        const handleClearCart = () => fetchCart();
        window.addEventListener('clearCart', handleClearCart);
        return () => window.removeEventListener('clearCart', handleClearCart);
    }, [fetchCart]);

    // Map backend response so the UI code doesn't break
    const cartItems = (cartData.items || []).map(i => ({
        ...i.menu_item_detail,
        cart_item_id: i.id,
        quantity: i.quantity
    }));

    return { cart: cartItems, cartTotal: cartData.total_amount || 0, addToCart, updateQuantity, fetchCart };
};
