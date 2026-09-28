// js/storage.js

const DB = {
  KEYS: {
    users: 'rw_users',
    requests: 'rw_requests',
    services: 'rw_services',
    reviews: 'rw_reviews',
    leads: 'rw_leads',
    portfolio: 'rw_portfolio',
    settings: 'rw_settings',
    currentUser: 'rw_current_user',
    nextId: 'rw_next_id',
  },

  SCHEMA_VERSION: '3',

  init() {
    if (localStorage.getItem('rw_schema') !== this.SCHEMA_VERSION) {
      localStorage.removeItem(this.KEYS.services);
      localStorage.removeItem(this.KEYS.users);
      localStorage.removeItem(this.KEYS.portfolio);
      localStorage.removeItem(this.KEYS.reviews);
      localStorage.removeItem(this.KEYS.settings);
      localStorage.setItem('rw_schema', this.SCHEMA_VERSION);
    }
    if (!localStorage.getItem(this.KEYS.services)) this.seedServices();
    if (!localStorage.getItem(this.KEYS.users)) this.seedUsers();
    if (!localStorage.getItem(this.KEYS.portfolio)) this.seedPortfolio();
    if (!localStorage.getItem(this.KEYS.reviews)) this.seedReviews();
    if (!localStorage.getItem(this.KEYS.settings)) this.seedSettings();
    if (!localStorage.getItem(this.KEYS.requests)) localStorage.setItem(this.KEYS.requests, '[]');
    if (!localStorage.getItem(this.KEYS.leads)) localStorage.setItem(this.KEYS.leads, '[]');
    if (!localStorage.getItem(this.KEYS.nextId)) localStorage.setItem(this.KEYS.nextId, '1000');
  },

  nextId() {
    const id = parseInt(localStorage.getItem(this.KEYS.nextId), 10) + 1;
    localStorage.setItem(this.KEYS.nextId, id.toString());
    return id;
  },
  get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },

  // ---------- Services ----------
  seedServices() {
    const services = [
      { id: 1, title: 'Ремонт ноутбуков', category: 'computers', price: 1500, duration: 60, description: 'Диагностика, замена матриц, клавиатур, чистка системы охлаждения.', icon: '💻', popular: true },
      { id: 2, title: 'Ремонт смартфонов', category: 'mobile', price: 1000, duration: 45, description: 'Замена экранов, батарей, разъёмов, восстановление после воды.', icon: '📱', popular: true },
      { id: 3, title: 'Ремонт компьютеров', category: 'computers', price: 1200, duration: 90, description: 'Апгрейд, замена комплектующих, установка ПО, чистка от пыли.', icon: '🖥️', popular: true },
      { id: 4, title: 'Ремонт телевизоров', category: 'appliances', price: 2000, duration: 120, description: 'Диагностика и ремонт ЖК и LED телевизоров любых марок.', icon: '📺', popular: false },
      { id: 5, title: 'Ремонт планшетов', category: 'mobile', price: 1300, duration: 60, description: 'Замена стёкол, аккумуляторов, ремонт материнских плат.', icon: '📲', popular: false },
      { id: 6, title: 'Восстановление данных', category: 'data', price: 2500, duration: 180, description: 'Восстановление информации с HDD, SSD, флешек и карт памяти.', icon: '💾', popular: true },
      { id: 7, title: 'Ремонт стиральных машин', category: 'appliances', price: 2200, duration: 90, description: 'Замена подшипников, насосов, электроники, диагностика.', icon: '🧺', popular: false },
      { id: 8, title: 'Ремонт игровых консолей', category: 'gaming', price: 1800, duration: 75, description: 'Чистка, замена термопасты, ремонт контроллеров, HDMI-портов.', icon: '🎮', popular: true },
    ];
    this.set(this.KEYS.services, services);
  },
  getServices() {
    return this.get(this.KEYS.services).map(s => ({
      ...s,
      icon: s.icon || s.image || '🔧',
      category: s.category || 'other',
      popular: !!s.popular,
    }));
  },
  findServiceById(id) { return this.getServices().find(s => s.id === id); },
  saveServices(list) { this.set(this.KEYS.services, list); },
  createService(data) {
    const list = this.get(this.KEYS.services);
    const item = { id: this.nextId(), ...data, popular: !!data.popular };
    list.push(item);
    this.saveServices(list);
    return item;
  },
  updateService(id, patch) {
    const list = this.get(this.KEYS.services);
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch };
    this.saveServices(list);
    return list[idx];
  },
  deleteService(id) {
    const list = this.get(this.KEYS.services).filter(s => s.id !== id);
    this.saveServices(list);
  },

  // ---------- Users ----------
  seedUsers() {
    const users = [
      { id: 1, name: 'Александр Админов', email: 'admin@repair.local', phone: '+7 900 000-00-01', password: 'admin123', role: 'admin', createdAt: '2025-01-10T10:00:00Z' },
      { id: 2, name: 'Иван Мастеров', email: 'master@repair.local', phone: '+7 900 000-00-02', password: 'master123', role: 'employee', createdAt: '2025-01-12T10:00:00Z', specialization: 'Ноутбуки, ПК' },
      { id: 3, name: 'Пётр Ремонтов', email: 'master2@repair.local', phone: '+7 900 000-00-03', password: 'master123', role: 'employee', createdAt: '2025-02-01T10:00:00Z', specialization: 'Смартфоны, планшеты' },
      { id: 4, name: 'Анна Клиентова', email: 'client@repair.local', phone: '+7 900 000-00-04', password: 'client123', role: 'client', createdAt: '2025-03-01T10:00:00Z' },
    ];
    this.set(this.KEYS.users, users);
  },
  getUsers() { return this.get(this.KEYS.users); },
  saveUsers(users) { this.set(this.KEYS.users, users); },
  findUserByEmail(email) { return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()); },
  findUserById(id) { return this.getUsers().find(u => u.id === id); },
  createUser({ name, email, phone, password, role = 'client' }) {
    const users = this.getUsers();
    if (this.findUserByEmail(email)) return { error: 'Пользователь с таким email уже существует' };
    const user = { id: this.nextId(), name, email, phone, password, role, createdAt: new Date().toISOString() };
    users.push(user); this.saveUsers(users);
    return { user };
  },
  updateUser(id, patch) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...patch };
    this.saveUsers(users);
    return users[idx];
  },

  // ---------- Session ----------
  getCurrentUser() {
    const id = localStorage.getItem(this.KEYS.currentUser);
    if (!id) return null;
    return this.findUserById(parseInt(id, 10)) || null;
  },
  setCurrentUser(user) {
    if (user) localStorage.setItem(this.KEYS.currentUser, user.id.toString());
    else localStorage.removeItem(this.KEYS.currentUser);
  },

  // ---------- Requests ----------
  getRequests() { return this.get(this.KEYS.requests); },
  saveRequests(r) { this.set(this.KEYS.requests, r); },
  createRequest(data) {
    const reqs = this.getRequests();
    const req = {
      id: this.nextId(),
      ...data,
      status: 'new',
      employeeId: data.employeeId || null,
      diagnosis: '',
      adminComment: '',
      finalCost: null,
      createdAt: new Date().toISOString(),
      history: [{ status: 'new', comment: 'Заявка создана', at: new Date().toISOString(), by: data.clientId }],
    };
    reqs.push(req); this.saveRequests(reqs);
    return req;
  },
  updateRequest(id, patch, byUserId, statusComment = '') {
    const reqs = this.getRequests();
    const idx = reqs.findIndex(r => r.id === id);
    if (idx === -1) return null;
    const old = reqs[idx];
    const updated = { ...old, ...patch };
    if (patch.status && patch.status !== old.status) {
      updated.history = [...(old.history || []), { status: patch.status, comment: statusComment, at: new Date().toISOString(), by: byUserId }];
    }
    reqs[idx] = updated; this.saveRequests(reqs);
    return updated;
  },
  getRequestsByClient(clientId) { return this.getRequests().filter(r => r.clientId === clientId); },
  getRequestsByEmployee(employeeId) { return this.getRequests().filter(r => r.employeeId === employeeId); },

  // ---------- Reviews ----------
  seedReviews() {
    const reviews = [
      { id: 501, clientId: 4, requestId: null, rating: 5, text: 'Быстро починили ноутбук, заменили матрицу. Приятные мастера, всё объяснили.', isPublished: true, createdAt: '2025-11-20T10:00:00Z' },
      { id: 502, clientId: 4, requestId: null, rating: 5, text: 'Восстановили данные с флешки, которую считал безнадёжной. Спасибо!', isPublished: true, createdAt: '2025-11-10T10:00:00Z' },
      { id: 503, clientId: 4, requestId: null, rating: 4, text: 'Хорошая мастерская. Ремонт сделали качественно, но пришлось подождать запчасть.', isPublished: true, createdAt: '2025-10-28T10:00:00Z' },
    ];
    this.set(this.KEYS.reviews, reviews);
  },
  getReviews() { return this.get(this.KEYS.reviews); },
  createReview({ clientId, requestId, rating, text }) {
    const reviews = this.getReviews();
    const review = { id: this.nextId(), clientId, requestId, rating, text, isPublished: false, createdAt: new Date().toISOString() };
    reviews.push(review); this.set(this.KEYS.reviews, reviews);
    return review;
  },
  updateReview(id, patch) {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reviews[idx] = { ...reviews[idx], ...patch };
    this.set(this.KEYS.reviews, reviews);
    return reviews[idx];
  },
  deleteReview(id) {
    this.set(this.KEYS.reviews, this.getReviews().filter(r => r.id !== id));
  },
  getPublishedReviews() { return this.getReviews().filter(r => r.isPublished); },

  // ---------- Leads ----------
  getLeads() { return this.get(this.KEYS.leads); },
  createLead({ name, phone, comment }) {
    const leads = this.getLeads();
    const lead = { id: this.nextId(), name, phone, comment, status: 'new', createdAt: new Date().toISOString() };
    leads.push(lead); this.set(this.KEYS.leads, leads);
    return lead;
  },

  // ---------- Portfolio ----------
  seedPortfolio() {
    const items = [
      { id: 601, title: 'Замена матрицы MacBook Pro', category: 'laptops', description: 'Установили новую Retina-матрицу, откалибровали цвет.', icon: '💻', serviceId: 1, createdAt: '2025-11-01T10:00:00Z' },
      { id: 602, title: 'Ремонт iPhone 13 после падения', category: 'phones', description: 'Замена стекла и дисплейного модуля.', icon: '📱', serviceId: 2, createdAt: '2025-11-05T10:00:00Z' },
      { id: 603, title: 'Восстановление данных с HDD', category: 'data', description: 'Считали 98% данных с повреждённого сектора.', icon: '💾', serviceId: 6, createdAt: '2025-11-08T10:00:00Z' },
      { id: 604, title: 'Ремонт PS5 после перегрева', category: 'gaming', description: 'Чистка, замена термопасты, замена вентилятора.', icon: '🎮', serviceId: 8, createdAt: '2025-11-12T10:00:00Z' },
      { id: 605, title: 'Апгрейд игрового ПК', category: 'computers', description: 'Установили RTX 4070 и 32 ГБ RAM.', icon: '🖥️', serviceId: 3, createdAt: '2025-11-15T10:00:00Z' },
      { id: 606, title: 'Ремонт Samsung TV 55"', category: 'tv', description: 'Замена подсветки и блока питания.', icon: '📺', serviceId: 4, createdAt: '2025-11-18T10:00:00Z' },
    ];
    this.set(this.KEYS.portfolio, items);
  },
  getPortfolio() { return this.get(this.KEYS.portfolio); },

  // ---------- Settings ----------
  seedSettings() {
    const s = {
      phone: '+7 (900) 000-00-00',
      email: 'repair@example.com',
      address: 'г. Москва, ул. Примерная, 1',
      hours: 'Пн–Вс: 9:00 — 21:00',
      telegram: 'cobra_shop_support_bot',
      about: 'Мастерская по ремонту бытовой и компьютерной техники. Работаем с 2015 года.',
      heroTitle: 'Ремонт техники быстро и с гарантией',
      heroSubtitle: 'Диагностика, ремонт и восстановление данных. Онлайн-запись за 1 минуту.',
    };
    this.set(this.KEYS.settings, s);
  },
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.settings) || '{}') || {};
    } catch (e) {
      return {};
    }
  },
  updateSettings(patch) {
    const s = { ...this.getSettings(), ...patch };
    this.set(this.KEYS.settings, s);
    return s;
  },

  // ---------- Slots ----------
  getAvailableSlots(dateStr, employeeId, durationMinutes = 60) {
    const allSlots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
    const busy = this.getRequests().filter(r => {
      if (r.status === 'canceled' || r.status === 'completed') return false;
      if (employeeId && r.employeeId && r.employeeId !== employeeId) return false;
      return r.scheduledAt && r.scheduledAt.startsWith(dateStr);
    });
    return allSlots.map(time => {
      const [h, m] = time.split(':').map(Number);
      const slotMins = h * 60 + m;
      const busyHere = busy.some(r => {
        const parts = r.scheduledAt.split('T');
        if (parts.length < 2) return false;
        const [bh, bm] = parts[1].split(':').map(Number);
        const bMins = bh * 60 + bm;
        return slotMins >= bMins && slotMins < bMins + (r.duration || 60);
      });
      const isPast = new Date(`${dateStr}T${time}`) < new Date();
      return { time, disabled: busyHere || isPast };
    });
  },
};

DB.init();