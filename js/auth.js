// js/auth.js

const Auth = {
  register({ name, email, phone, password, passwordConfirm }) {
    if (!name || !email || !phone || !password) return { error: 'Заполните все поля' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Некорректный email' };
    if (password.length < 6) return { error: 'Пароль должен быть не короче 6 символов' };
    if (password !== passwordConfirm) return { error: 'Пароли не совпадают' };
    const res = DB.createUser({ name, email, phone, password, role: 'client' });
    if (res.error) return res;
    DB.setCurrentUser(res.user);
    return { user: res.user };
  },
  login({ email, password }) {
    const user = DB.findUserByEmail(email);
    if (!user || user.password !== password) return { error: 'Неверный email или пароль' };
    DB.setCurrentUser(user);
    return { user };
  },
  logout() { DB.setCurrentUser(null); },
  current() { return DB.getCurrentUser(); },
  isLoggedIn() { return !!this.current(); },
  isAdmin() { const u = this.current(); return u && u.role === 'admin'; },
  isEmployee() { const u = this.current(); return u && u.role === 'employee'; },
  isClient() { const u = this.current(); return u && u.role === 'client'; },
  requireAuth(redirect = 'login.html') {
    if (!this.isLoggedIn()) { window.location.href = redirect; return false; }
    return true;
  },
  requireRole(roles, redirect = 'login.html') {
    if (!this.requireAuth(redirect)) return false;
    const u = this.current();
    const ok = Array.isArray(roles) ? roles.includes(u.role) : u.role === roles;
    if (!ok) {
      Toast.error('Недостаточно прав доступа');
      setTimeout(() => window.location.href = 'index.html', 800);
      return false;
    }
    return true;
  },
  homeFor(user) {
    if (!user) return 'index.html';
    if (user.role === 'admin') return 'admin.html';
    if (user.role === 'employee') return 'employee.html';
    return 'cabinet.html';
  },
};