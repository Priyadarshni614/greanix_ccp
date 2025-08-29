document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('greanixUserId');
    const navbarRight = document.getElementById('navbar-right');

    if (userId && navbarRight) {
        // User is logged in, show profile and logout buttons
        navbarRight.innerHTML = `
            <span id="nav-username" style="margin-right: 15px; font-weight: bold;"></span>
            <button class="login" onclick="window.location.href='/profile.html'">Profile</button>
            <button class="signup" onclick="logout()">Logout</button>
        `;
        // Fetch and display username
        fetchUsername(userId);
    } else if (navbarRight) {
        // User is not logged in, show login and signup buttons
        navbarRight.innerHTML = `
            <button class="login" onclick="window.location.href='login.html'">Login</button>
            <button class="signup" onclick="window.location.href='signup.html'">Sign Up</button>
        `;
    }
});

function logout() {
    sessionStorage.removeItem('greanixUserId');
    window.location.href = '/login.html';
}

async function fetchUsername(userId) {
    try {
        const response = await fetch(`/api/user-data/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            document.getElementById('nav-username').textContent = `Welcome, ${userData.username}`;
        }
    } catch (error) {
        console.error('Failed to fetch username:', error);
    }
}