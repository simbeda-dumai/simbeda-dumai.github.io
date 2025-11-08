
    // Simple login/logout and session handling
    function login(username, password) {
        if (username && password) {
            sessionStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
            alert('Login successful');
        } else {
            alert('Login failed');
        }
    }

    function logout() {
        sessionStorage.removeItem('user');
        alert('Logged out');
    }

    function checkLogin() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            document.getElementById('user-info').innerHTML = `Welcome, ${user.username}`;
        }
    }
    checkLogin();
    