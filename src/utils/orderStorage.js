// Order functions
export const saveOrder = (orderData) => {
  try {
    console.log('💾 SAVE ORDER STARTED:', orderData);
    
    const { userId, orderNumber } = orderData;

    // Validate required fields
    if (!userId) {
      console.error('❌ Missing userId in order data');
      return false;
    }
    
    if (!orderNumber) {
      console.error('❌ Missing orderNumber in order data');
      return false;
    }

    // Ensure order has all required fields with proper data types
    const completeOrder = {
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString(),
      status: orderData.status || 'processing',
      items: orderData.items || [],
      subtotal: parseFloat(orderData.subtotal || 0),
      tax: parseFloat(orderData.tax || 0),
      shipping: parseFloat(orderData.shipping || 0),
      total: parseFloat(orderData.total || 0)
    };

    // Save to user's orders
    const userOrdersKey = `user_orders_${userId}`;
    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
    
    console.log('📋 Current user orders before save:', userOrders.length);

    // Check if order already exists
    const existingOrderIndex = userOrders.findIndex(order => order.orderNumber === orderNumber);
    
    if (existingOrderIndex > -1) {
      // Update existing order
      userOrders[existingOrderIndex] = completeOrder;
      console.log('✅ Updated existing order');
    } else {
      // Add new order to the beginning
      userOrders.unshift(completeOrder);
      console.log('✅ Added new order');
    }
    
    // Save to localStorage
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
    console.log('✅ Order saved to user storage! Order count:', userOrders.length);

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('localStorageChange'));
    
    console.log('💾 SAVE ORDER COMPLETED SUCCESSFULLY');
    return true;
  } catch (error) {
    console.error('❌ Error saving order:', error);
    return false;
  }
};

export const getUserOrders = (userId) => {
  try {
    if (!userId) {
      console.log('❌ No userId provided to getUserOrders');
      return [];
    }
    
    const userOrdersKey = `user_orders_${userId}`;
    const rawData = localStorage.getItem(userOrdersKey);
    
    console.log('🔍 GET USER ORDERS:', {
      userId,
      storageKey: userOrdersKey,
      hasData: !!rawData
    });
    
    if (!rawData) {
      console.log('📦 No orders found for user');
      return [];
    }
    
    const orders = JSON.parse(rawData);
    console.log('✅ Retrieved', orders.length, 'orders from user storage');
    
    // Sort by date (newest first) and ensure valid data
    const validOrders = orders
      .filter(order => order && order.orderNumber && order.userId)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    console.log('✅ Returning', validOrders.length, 'valid orders');
    return validOrders;
  } catch (error) {
    console.error('❌ Error in getUserOrders:', error);
    return [];
  }
};

// Alias for compatibility
export const saveUserOrder = (userId, orderData) => {
  return saveOrder({
    ...orderData,
    userId: userId
  });
};

// Cart functions
export const addToCart = (userId, product) => {
  try {
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.productId === product.id.toString());
    
    if (existingIndex > -1) {
      // Update quantity if exists
      cart[existingIndex].quantity += 1;
    } else {
      // Add new item
      cart.push({
        productId: product.id.toString(),
        name: product.title || product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: product.image,
        timestamp: new Date().toISOString()
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    return false;
  }
};

export const getCart = (userId) => {
  try {
    if (!userId) return [];
    
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    return cart;
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    return [];
  }
};

export const updateCartQuantity = (userId, productId, newQuantity) => {
  try {
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0);
    
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    return true;
  } catch (error) {
    console.error('❌ Error updating cart:', error);
    return false;
  }
};

export const removeFromCart = (userId, productId) => {
  try {
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    return true;
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    return false;
  }
};

export const clearCart = (userId) => {
  try {
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    return false;
  }
};

// Wishlist functions
export const addToWishlist = (userId, product) => {
  try {
    const wishlistKey = `wishlist_${userId}`;
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    
    // Check if already in wishlist
    const exists = wishlist.some(item => item.productId === product.id.toString());
    
    if (!exists) {
      wishlist.push({
        productId: product.id.toString(),
        name: product.title || product.name,
        price: parseFloat(product.price),
        image: product.image,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    return false;
  }
};

export const getWishlist = (userId) => {
  try {
    if (!userId) return [];
    
    const wishlistKey = `wishlist_${userId}`;
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    return wishlist;
  } catch (error) {
    console.error('❌ Error getting wishlist:', error);
    return [];
  }
};

export const removeFromWishlist = (userId, productId) => {
  try {
    const wishlistKey = `wishlist_${userId}`;
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    return true;
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error);
    return false;
  }
};