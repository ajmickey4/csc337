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
                productItem.className = 'cart-item';
                productItem.innerHTML = `
                    <div>
                        <h3>${cartItem.name}</h3>
                        <p>${cartItem.description}</p>
                    </div>                
                    <p>Price: <span class="price">$${cartItem.price}</span></p>
                    <p>Quantity: <input class="quantity" type="number" data-id="${cartItem._id}" min="1" max="${cartItem.quantity}" value="${cartItem.cartQuantity}" onchange="updateCartQuantity(event)" /> <br>(max: ${cartItem.quantity})</p>
                    <button class="remove" data-id="${cartItem._id}" onclick="removeFromCart(event)">Remove from Cart</button>`;
                    
                ;
                cartList.appendChild(productItem);
            });

            //attatch event listener to checkout button
                const checkoutButton = document.getElementById('checkout_button');
                checkoutButton.addEventListener('click', function() {
                window.location.href = '/checkout';
            });

        } else {
            cartList.innerHTML = '<p>Your cart is empty.</p>';
            //disable checkout button
            const checkoutButton = document.getElementById('checkout_button');
            checkoutButton.disabled = true;
        }
    })
    .catch(error => {
        console.error('Error fetching cart:', error);
        const cartList = document.getElementById('cart_list');
        cartList.innerHTML = '<p>Error loading cart</p>';
    });
}

window.updateCartQuantity = function(event) {
    //get product id and new quantity from input field
    const productId = event.target.getAttribute('data-id');
    const newQuantity = event.target.value;
    const userId = localStorage.getItem('mickey_shop_user_id');

    //update cart in database
    fetch('/cart/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId, quantity: newQuantity })
    });
}

window.removeFromCart = function(event) {
    console.log('removeFromCart function called');

    //get product id from button
    const productId = event.target.getAttribute('data-id');
    const userId = localStorage.getItem('mickey_shop_user_id');

    //check with user if they want to remove item from cart
    const itemName = event.target.parentElement.querySelector('h3').innerText;
    const confirmRemove = confirm(`Are you sure you want to remove ${itemName} from your cart?`);
    if (!confirmRemove) {
        return;
    }

    //remove item from cart in database
    fetch('/cart/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId })
    })
    .then(response => {
        if (response.ok) {
            //reinit cart page
            initCart();
        } else {
            console.error('Error removing item from cart:', response.statusText);
        }
    });

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