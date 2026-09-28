// js/ui.js

// ---------- Theme (dark only) ----------
const Theme = {
  init() { document.documentElement.setAttribute('data-theme', 'dark'); },
  current() { return 'dark'; },
};
Theme.init();

// ---------- Toast ----------
const Toast = {
  wrap: null,
  ensure() {
    if (!this.wrap) {
      this.wrap = document.createElement('div');
      this.wrap.className = 'toast-wrap';
      document.body.appendChild(this.wrap);
    }
  },
  show(message, type = 'info', title = '') {
    this.ensure();
    const icons = { success: '✅', error: '⚠️', warning: '⚠️', info: 'ℹ️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<div class="ico">${icons[type] || 'ℹ️'}</div><div class="msg">${title ? `<b>${title}</b>` : ''}${message}</div>`;
    this.wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 250);
    }, 3800);
  },
  success(msg, title = 'Успешно') { this.show(msg, 'success', title); },
  error(msg, title = 'Ошибка') { this.show(msg, 'error', title); },
  info(msg, title = '') { this.show(msg, 'info', title); },
};

// ---------- Avatar ----------
const PALETTE = ['#7c5cff','#a78bfa','#f472b6','#4fd1ff','#22d3ee','#34d399','#fbbf24','#60a5fa'];
function avatarColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}
function avatarHTML(user, extraClass = '') {
  if (!user) return '';
  const color = avatarColor(user.email || user.name);
  return `<div class="avatar ${extraClass}" style="background:${color}">${initials(user.name)}</div>`;
}

// ---------- Modal ----------
const Modal = {
  open(html, opts = {}) {
    const el = document.createElement('div');
    el.className = 'modal active';
    el.innerHTML = `<div class="modal-content ${opts.large ? 'lg' : ''}">${html}</div>`;
    el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
    return el;
  },
  close(el) { if (el) el.remove(); },
};

// ---------- Helpers ----------
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function or(v, fallback = '') {
  return (v === undefined || v === null || v === '') ? fallback : v;
}

// ---------- Telegram float button ----------
function mountTelegramButton() {
  if (document.getElementById('tg-float')) return;
  const settings = DB.getSettings();
  const bot = settings.telegram || 'cobra_shop_support_bot';
  const a = document.createElement('a');
  a.id = 'tg-float';
  a.className = 'tg-float';
  a.href = `https://t.me/${bot}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = 'Написать в Telegram';
  a.innerHTML = `<span class="tg-ico">✈️</span><span>Написать в Telegram</span>`;
  document.body.appendChild(a);
}