window.initCart = function() {
    const userId = localStorage.getItem('mickey_shop_user_id');

    //get cart from database
    fetch('/cart/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(cart => {
        const cartList = document.getElementById('cart_list');
        console.log('Cart fetched:', cart);
        if (cart && cart.length > 0) {
            cartList.innerHTML = ''; // Clear the cart list

            // Loop through the cart items and create list items
            cart.forEach(cartItem => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <div>
                        <h3>${cartItem.name}</h3>
                        <p>${cartItem.description}</p>
                    </div>                
                    <p>Price: <span class="price">$${cartItem.price}</span></p>
                    <p>Quantity: <input class="quantity" type="number" data-id="${cartItem._id}" min="1" max="${cartItem.quantity}" value="${cartItem.cartQuantity}" onchange="updateCartQuantity()" /> <br>(max: ${cartItem.quantity})</p>`;
                    
                ;
                cartList.appendChild(productItem);
            });

        } else {
            cartList.innerHTML = '<p>Your cart is empty.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching cart:', error);
        const cartList = document.getElementById('cart_list');
        cartList.innerHTML = '<p>Error loading cart</p>';
    });

}

window.updateCartQuantity = function(event) {
    console.log('updateCartQuantity function called', event.target);
}

window.onload = function() {
    initNavBar();
    initCart();
    //initUserPage();
    //initProductPage();
    //initCheckoutPage();
    //initOrderPage();
    //initAdminPage();
}