window.initCheckout = function() {
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
        const checkoutList = document.getElementById('checkout_list');
        console.log('Cart fetched:', cart);
        if (cart && cart.length > 0) {

            // Loop through the cart items and create list items
            cart.forEach(cartItem => {
                checkoutList.innerHTML += `
                <tr>
                    <td>${cartItem.name}</td>
                    <td>$${cartItem.price}</td>
                    <td>${cartItem.cartQuantity}</td>
                    <td>$${Number(cartItem.price) * Number(cartItem.cartQuantity)}</td>
                </tr>`;
            });

            // Add total price row
            const totalPrice = cart.reduce((total, item) => total + (Number(item.price) * Number(item.cartQuantity)), 0);
            checkoutList.innerHTML += `
                <tr>
                    <td colspan="3"><b>Total<b></td>
                    <td>$${totalPrice}</td>
                </tr>`;

        } else {
            cartList.innerHTML = '<tr><td colspan="4">Your cart is empty.<td></tr>';
        }
    })
    .catch(error => {
        console.error('Error fetching cart:', error);
        const cartList = document.getElementById('cart_list');
        cartList.innerHTML = '<p>Error loading cart</p>';
    });

    //attatch event listener to order button
    const orderButton = document.getElementById('order_button');
    orderButton.addEventListener('click', function() {
        const userId = localStorage.getItem('mickey_shop_user_id');
        //get cart from database
        fetch('/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
        .then(response => {
            if (response.ok) {
                alert('Order placed successfully!');
                window.location.href = '/user'; // Redirect to user page to see orders
            } else {
                alert('Error placing order. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        });
    });

}

window.onload = function() {
    initNavBar();
    initCheckout();
}