window.initUserPage = function() {
    let content = document.getElementsByClassName('content')[0];
    if(validSession) {
        //if user is logged in, show user page
        document.getElementById('user_title').innerText = 'Hello ' + localStorage.getItem('mickey_shop_username') + '!';
        document.getElementById('login_form').remove();
        document.getElementById('user_message').innerHTML = `
            <p>Welcome back to Mickey's Shop! You can now access your cart.</p>
        `;

        let logOutButton = document.createElement('button');
        logOutButton.innerText = 'Logout';
        logOutButton.onclick = function() {
            localStorage.removeItem('mickey_shop_username');
            localStorage.removeItem('mickey_shop_user_id');
            window.location.href = '/user';
        }
        content.appendChild(logOutButton);
        loadOrders(content);

        content.style.display = '';

    } else {
        //if user is not logged in, show login form
        document.getElementById('register').addEventListener('click', function(event) {
            document.getElementById('user_title').innerText = 'Register';

            document.getElementById('login_form').onsubmit = function(event) {
                register(event);
            }
            
            document.getElementById('login_form').reset();
            document.getElementById('user_message').innerHTML = `
                <p>Please enter your username and password to register.</p>
                <p>Already have an account? <a href="user">Login</a></p>
            `; 
            document.getElementById('user_error').innerHTML = '';  
            document.getElementById('user_submit').innerText = 'Register';
        });

        content.style.display = '';
    }
}

function login(event) {
    console.log('login function called');
    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Perform login logic 
    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Get the user ID from the response
        } else {
            // Handle login error (e.g., show error message)
            let errorMessage = document.getElementById('user_error');
            errorMessage.innerText = `Invalid username or password`;
        }
    })
    .then(userId => {
        if (userId) {
            // Store user ID in local storage
            localStorage.setItem('mickey_shop_username', username);
            localStorage.setItem('mickey_shop_user_id', userId);
            console.log('Login successful');
            window.location.href = '/user'; // Redirect to user page
        }
    })
}
function register(event) {
    console.log('register function called');
    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Perform registration logic
    fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Get the user ID from the response
        } else if (response.status === 400) { 
            //handle username already exists error
            document.getElementById('user_error').innerText = `Username already exists`;
        } else {
            // handle registration error 
            let errorMessage = document.getElementById('user_error');
            errorMessage.innerText = `Registration failed`;
        }
    })
    .then(userId => {
        if (userId) {
            // Store user ID in local storage
            localStorage.setItem('mickey_shop_username', username);
            localStorage.setItem('mickey_shop_user_id', userId);
            console.log('Registration successful');
            window.location.href = '/user'; // Redirect to user page
        }
    })
    .catch(error => {
        console.error('Error:', error);
        //get error message from response
        
    });

}

function loadOrders(content) {
    //get user id from local storage
    const userId = localStorage.getItem('mickey_shop_user_id');
    console.log('loadOrders function called', userId);

    //get orders from database
    fetch('/user/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(orders => {
        console.log('Orders fetched');
        if (orders && orders.length > 0) {
            // Loop through the orders and create list items
            const orderList = document.createElement('div');
            orders.forEach(order => {
                const orderItem = document.createElement('div');
                //add order details to order item including date, total, and first three items in order
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <p><b>Date</b>: ${new Date(order.date).toLocaleDateString()}</p>
                    <p><b>Total</b>: $${order.total}</p>
                    <p><b>Items</b>:
                    ${order.items.slice(0, 3).map(item => `${item.name} (x${item.quantity})`).join(', ')}
                    ${order.items.length > 3 ? `...and ${order.items.length - 3} more` : ''}
                    </p>
                `;
                orderList.appendChild(orderItem);
            });
            //create heading for orders
            const orderHeading = document.createElement('h2');
            orderHeading.innerText = 'Your Orders:';
            content.appendChild(orderHeading);
            content.appendChild(orderList);
        } else {
            content.innerHTML += '<h2>Your Orders</h2><p>You have no orders.</p>';
        }
    })
}

window.onload = function() {
    initNavBar();
    initUserPage();
}