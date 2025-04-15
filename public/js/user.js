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
            window.location.href = '/user';
        }
        content.appendChild(logOutButton);

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
            // Handle successful login (e.g., redirect to user page)
            localStorage.setItem('mickey_shop_username', username);
            window.location.href = '/user';
        } else {
            // Handle login error (e.g., show error message)
            let errorMessage = document.getElementById('user_error');
            errorMessage.innerText = `Invalid username or password`;
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
            // handle successful registration 
            localStorage.setItem('mickey_shop_username', username);
            window.location.href = '/user';
        } else if (response.status === 400) { 
            //handle username already exists error
            document.getElementById('user_error').innerText = `Username already exists`;
        } else {
            // handle registration error 
            let errorMessage = document.getElementById('user_error');
            errorMessage.innerText = `Registration failed`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        //get error message from response
        
    });

}

window.onload = function() {
    initNavBar();
    initUserPage();
}