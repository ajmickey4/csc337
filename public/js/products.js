window.initProducts = function() {
    //get search term from url
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search') || '';

    //set search term in input field
    document.getElementById('search_input').value = searchTerm;

    //get products from database
    fetch('/products/get-items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: searchTerm })
    })
    .then(response => response.json())
    .then(products => {
        const productList = document.getElementById('product_list');
        productList.innerHTML = ''; // Clear existing products

        if (products.length === 0) {
            productList.innerHTML = '<p>There are no products that match your search.</p>';
            return;
        }

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>                
                <p>Price: <span class="price">$${product.price}</span></p>
                <p>Quantity: <input class="quantity" type="number" data-id="${product._id}" min="1" max="${product.quantity}" value="1" /> <br>(max: ${product.quantity})</p>`;
                
                if(validSession) {
                    productItem.innerHTML += `<button class="add-to-cart" data-id="${product._id}">Add to Cart</button>`;
                } else {
                    productItem.innerHTML += `<button class="add-to-cart" data-id="${product._id}" disabled>Sign In to add to Cart</button>`;
                }
                
            ;
            productList.appendChild(productItem);
        });

        // Add event listeners to "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        const productList = document.getElementById('product_list');
        productList.innerHTML = '<p>Error loading products</p>';
    });

}

window.addToCart = function(productId) {
    //get quantity from input field, if less than 1, set to 1, if more than max, set to max
    const quantityInput = document.querySelector(`input[data-id="${productId}"]`);
    let quantity = parseInt(quantityInput.value, 10);
    const maxQuantity = parseInt(quantityInput.max, 10);
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        quantityInput.value = 1; // Reset the input value to 1
    } else if (quantity > maxQuantity) {
        quantity = maxQuantity;
        quantityInput.value = maxQuantity; // Reset the input value to max
    }

    //confirm with user
    //get product name from product list
    const productName = document.querySelector(`.product-item h3`).innerText;
    if (!confirm(`Are you sure you want to add ${quantity} of ${productName} to your cart?`)) {
        return; // User canceled the action
    }   

    console.log('Product added to cart:', productId);
    // You can implement the actual add to cart functionality here
}

window.onload = function() {
    initNavBar();
    initProducts();
    //initCart();
    //initUserPage();
    //initProductPage();
    //initCheckoutPage();
    //initOrderPage();
    //initAdminPage();
}