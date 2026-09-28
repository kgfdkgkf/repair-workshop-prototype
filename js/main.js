// js/main.js

// ---------- Formatting ----------
function formatPrice(v) { return new Intl.NumberFormat('ru-RU').format(v || 0) + ' ₽'; }
function formatDate(iso, withTime = true) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  const opts = { day: '2-digit', month: 'short', year: 'numeric' };
  if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
  return d.toLocaleString('ru-RU', opts);
}
function formatDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });
}

const STATUS_LABELS = {
  new: 'Новая', accepted: 'Принята', diagnostics: 'Диагностика',
  waiting_parts: 'Ожидание запчастей', in_progress: 'В ремонте',
  ready: 'Готова к выдаче', completed: 'Завершена', canceled: 'Отменена',
};
const STATUS_ORDER = ['new','accepted','diagnostics','waiting_parts','in_progress','ready','completed','canceled'];

function statusLabel(code) { return STATUS_LABELS[code] || code; }
function statusBadge(code) {
  return `<span class="badge badge-${code}"><span class="dot"></span>${statusLabel(code)}</span>`;
}

// ---------- Header ----------
function renderHeader() {
  const el = document.getElementById('header-actions');
  if (!el) return;
  const user = Auth.current();

  if (!user) {
    el.innerHTML = `
      <a href="login.html" class="btn btn-ghost btn-sm">Войти</a>
      <a href="register.html" class="btn btn-primary btn-sm">Регистрация</a>
    `;
    return;
  }
  const home = Auth.homeFor(user);
  el.innerHTML = `
    <div class="user-menu-wrap">
      <button class="avatar-btn" onclick="toggleUserMenu(event)">
        ${avatarHTML(user)}
        <span>${escapeHtml(user.name.split(' ')[0])}</span>
      </button>
      <div class="user-menu" id="user-menu">
        <div class="menu-head">
          <b>${escapeHtml(user.name)}</b>
          <span>${escapeHtml(user.email)}</span>
        </div>
        <a href="${home}">📊 Личный кабинет</a>
        ${user.role === 'client' ? `<a href="booking.html">➕ Новая заявка</a>` : ''}
        <div class="divider"></div>
        <button onclick="handleLogout()">🚪 Выйти</button>
      </div>
    </div>
  `;
}

function toggleUserMenu(e) {
  e.stopPropagation();
  const m = document.getElementById('user-menu');
  if (m) m.classList.toggle('open');
}

function handleLogout() {
  Auth.logout();
  Toast.info('Вы вышли из аккаунта');
  setTimeout(() => window.location.href = 'index.html', 400);
}

function toggleMenu() {
  const m = document.getElementById('main-menu');
  if (m) m.classList.toggle('open');
}

document.addEventListener('click', () => {
  const m = document.getElementById('user-menu');
  if (m) m.classList.remove('open');
});

// ---------- Footer contacts ----------
function renderFooter() {
  const el = document.getElementById('footer-contacts');
  if (el) {
    const s = DB.getSettings();
    const phone = s.phone || '';
    const email = s.email || '';
    const tg = s.telegram || 'cobra_shop_support_bot';
    el.innerHTML = `
      <a class="footer-contact" href="tel:${phone.replace(/[^\d+]/g,'')}">
        <span class="ico">📞</span><span>${escapeHtml(phone)}</span>
      </a>
      <a class="footer-contact" href="mailto:${escapeHtml(email)}">
        <span class="ico">✉️</span><span>${escapeHtml(email)}</span>
      </a>
      <a class="footer-contact tg" href="https://t.me/${escapeHtml(tg)}" target="_blank" rel="noopener">
        <span class="ico">✈️</span><span>@${escapeHtml(tg)}</span>
      </a>
    `;
  }
  const about = document.getElementById('footer-about');
  if (about) {
    const s = DB.getSettings();
    about.textContent = s.about || '';
  }
}

// ---------- Callback modal ----------
function openCallbackModal() {
  const html = `
    <div class="modal-header">
      <div>
        <h2>Заказать звонок</h2>
        <div class="sub">Перезвоним в течение 15 минут</div>
      </div>
      <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
    </div>
    <form id="callback-form">
      <div class="form-group">
        <label>Ваше имя *</label>
        <input type="text" name="name" class="form-control" placeholder="Иван" required>
      </div>
      <div class="form-group">
        <label>Телефон *</label>
        <input type="tel" name="phone" class="form-control" placeholder="+7 (___) ___-__-__" required>
      </div>
      <div class="form-group">
        <label>Комментарий</label>
        <textarea name="comment" class="form-control" rows="3" placeholder="Опишите проблему"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-block btn-lg">Отправить заявку</button>
    </form>
  `;
  const modal = Modal.open(html);
  modal.querySelector('#callback-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const data = {
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      comment: f.comment.value.trim(),
    };
    if (!data.name || !data.phone) { Toast.error('Заполните имя и телефон'); return; }
    DB.createLead(data);
    Modal.close(modal);
    Toast.success('Мы перезвоним вам в ближайшее время!', 'Заявка отправлена');
  });
}

// ---------- Scroll ----------
function initScrollEffects() {
  const h = document.querySelector('.site-header');
  if (h) {
    const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const els = document.querySelectorAll('.reveal');
  if (els.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }
}

// ---------- Page init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  mountTelegramButton();
  initScrollEffects();

  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open'));
  });

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});