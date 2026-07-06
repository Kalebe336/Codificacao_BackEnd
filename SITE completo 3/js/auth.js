const auth = {
    login() {
        const u = document.getElementById('user-login').value;
        const p = document.getElementById('pass-login').value;
        const user = DB.get('users').find(x => x.user === u && x.pass === p);
        if (user) {
            sessionStorage.setItem('session_user', u);
            location.reload();
        } else {
            alert("Credenciais inválidas! (admin / 123)");
        }
    },
    logout() {
        sessionStorage.removeItem('session_user');
        location.reload();
    },
    check() {
        const user = sessionStorage.getItem('session_user');
        const section = document.getElementById('auth-section');
        if (user) {
            section.innerHTML = `<span class="text-white me-2 small">Olá, <b>${user}</b></span><button class="btn btn-sm btn-danger" onclick="auth.logout()">Sair</button>`;
        } else {
            section.innerHTML = `<button class="btn btn-sm btn-outline-light" onclick="auth.toggleLoginForm()">Login</button>`;
        }
    },
    toggleLoginForm() {
        const el = document.getElementById('login-container');
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
};
document.addEventListener('DOMContentLoaded', () => auth.check());