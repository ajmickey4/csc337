window.validSession = false; 

window.initNavBar = function() {
    // get username from local storage
    const username = localStorage.getItem('mickey_shop_username');

    // get nav bar element
    const navBar = document.getElementById('main_nav');

    //remove cart if not logged in
    const cart = document.getElementById('nav_cart');
    let user = document.getElementById('user_link');
    if (!username) {
        //if url is /cart, redirect to home page
        if (window.location.pathname === '/cart') {
            window.location.href = '/';
        }
        //remove cart from nav bar
        const cart = document.getElementById('nav_cart');
        navBar.removeChild(cart);
        user.style.visibility = "";
    } else {
        cart.style.display = '';

        //set username in nav bar
        user.innerHTML = username + `<span class="user-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 8 8"><path fill="currentColor" d="M4 0C2.9 0 2 1.12 2 2.5S2.9 5 4 5s2-1.12 2-2.5S5.1 0 4 0M1.91 5C.85 5.05 0 5.92 0 7v1h8V7c0-1.08-.84-1.95-1.91-2c-.54.61-1.28 1-2.09 1s-1.55-.39-2.09-1"/></svg></span>`;
        user.style.visibility = "";

        //set valid session to true
        window.validSession = true;
    }
}

window.onload = function() {
    initNavBar();
}