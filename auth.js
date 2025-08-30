document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('greanixUserId');
    const navbarRight = document.getElementById('navbar-right');

    if (userId && navbarRight) {
        // User is logged in, show profile and logout buttons
        navbarRight.innerHTML = `
            <span id="nav-username" style="margin-right: 15px; font-weight: 500; color: #333;"></span>
            <button class="login" style="padding: 8px 15px;" onclick="window.location.href='profile.html'">Profile</button>
            <button class="signup" style="padding: 8px 15px;" onclick="logout()">Logout</button>
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
    // Redirect to homepage after logout
    window.location.href = '/'; 
}

async function fetchUsername(userId) {
    try {
        const response = await fetch(`/api/user-data/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            const usernameElement = document.getElementById('nav-username');
            if (usernameElement) {
                usernameElement.textContent = `Welcome, ${userData.username}`;
            }
        }
    } catch (error) {
        console.error('Failed to fetch username:', error);
    }
}