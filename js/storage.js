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
    deviceTypes: 'rw_device_types',
    deviceBrands: 'rw_device_brands',
    deviceModels: 'rw_device_models',
    commonProblems: 'rw_common_problems',
    currentUser: 'rw_current_user',
    nextId: 'rw_next_id',
  },

  SCHEMA_VERSION: '5',

  init() {
    if (localStorage.getItem('rw_schema') !== this.SCHEMA_VERSION) {
      localStorage.removeItem(this.KEYS.services);
      localStorage.removeItem(this.KEYS.users);
      localStorage.removeItem(this.KEYS.portfolio);
      localStorage.removeItem(this.KEYS.reviews);
      localStorage.removeItem(this.KEYS.settings);
      localStorage.removeItem(this.KEYS.deviceTypes);
      localStorage.removeItem(this.KEYS.deviceBrands);
      localStorage.removeItem(this.KEYS.deviceModels);
      localStorage.removeItem(this.KEYS.commonProblems);
      localStorage.setItem('rw_schema', this.SCHEMA_VERSION);
    }
    if (!localStorage.getItem(this.KEYS.services)) this.seedServices();
    if (!localStorage.getItem(this.KEYS.users)) this.seedUsers();
    if (!localStorage.getItem(this.KEYS.portfolio)) this.seedPortfolio();
    if (!localStorage.getItem(this.KEYS.reviews)) this.seedReviews();
    if (!localStorage.getItem(this.KEYS.settings)) this.seedSettings();
    if (!localStorage.getItem(this.KEYS.deviceTypes)) this.seedDeviceTypes();
    if (!localStorage.getItem(this.KEYS.deviceBrands)) this.seedDeviceBrands();
    if (!localStorage.getItem(this.KEYS.deviceModels)) this.seedDeviceModels();
    if (!localStorage.getItem(this.KEYS.commonProblems)) this.seedCommonProblems();
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

  // ============================================================
  // SERVICES
  // device_types — массив id типов устройств, к которым применима услуга.
  // [] — значит применима ко всем типам.
  // ============================================================
  seedServices() {
    const services = [
      { id: 1, title: 'Ремонт ноутбуков', category: 'computers', price: 1500, duration: 60, description: 'Диагностика, замена матриц, клавиатур, чистка системы охлаждения.', icon: '💻', popular: true, device_types: [1] },
      { id: 2, title: 'Ремонт смартфонов', category: 'mobile', price: 1000, duration: 45, description: 'Замена экранов, батарей, разъёмов, восстановление после воды.', icon: '📱', popular: true, device_types: [2] },
      { id: 3, title: 'Ремонт компьютеров', category: 'computers', price: 1200, duration: 90, description: 'Апгрейд, замена комплектующих, установка ПО, чистка от пыли.', icon: '🖥️', popular: true, device_types: [3] },
      { id: 4, title: 'Ремонт телевизоров', category: 'appliances', price: 2000, duration: 120, description: 'Диагностика и ремонт ЖК и LED телевизоров любых марок.', icon: '📺', popular: false, device_types: [5] },
      { id: 5, title: 'Ремонт планшетов', category: 'mobile', price: 1300, duration: 60, description: 'Замена стёкол, аккумуляторов, ремонт материнских плат.', icon: '📲', popular: false, device_types: [4] },
      { id: 6, title: 'Восстановление данных', category: 'data', price: 2500, duration: 180, description: 'Восстановление информации с HDD, SSD, флешек и карт памяти.', icon: '💾', popular: true, device_types: [1, 2, 3, 4] },
      { id: 7, title: 'Ремонт стиральных машин', category: 'appliances', price: 2200, duration: 90, description: 'Замена подшипников, насосов, электроники, диагностика.', icon: '🧺', popular: false, device_types: [7] },
      { id: 8, title: 'Ремонт игровых консолей', category: 'gaming', price: 1800, duration: 75, description: 'Чистка, замена термопасты, ремонт контроллеров, HDMI-портов.', icon: '🎮', popular: true, device_types: [6] },
    ];
    this.set(this.KEYS.services, services);
  },
  getServices() {
    return this.get(this.KEYS.services).map(s => ({
      ...s,
      icon: s.icon || s.image || '🔧',
      category: s.category || 'other',
      popular: !!s.popular,
      device_types: Array.isArray(s.device_types) ? s.device_types : [],
    }));
  },
  findServiceById(id) { return this.getServices().find(s => s.id === id); },
  saveServices(list) { this.set(this.KEYS.services, list); },
  createService(data) {
    const list = this.get(this.KEYS.services);
    const item = {
      id: this.nextId(),
      ...data,
      popular: !!data.popular,
      device_types: Array.isArray(data.device_types) ? data.device_types : [],
    };
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
    this.saveServices(this.get(this.KEYS.services).filter(s => s.id !== id));
  },

  // ============================================================
  // USERS
  // ============================================================
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

  // ============================================================
  // SESSION
  // ============================================================
  getCurrentUser() {
    const id = localStorage.getItem(this.KEYS.currentUser);
    if (!id) return null;
    return this.findUserById(parseInt(id, 10)) || null;
  },
  setCurrentUser(user) {
    if (user) localStorage.setItem(this.KEYS.currentUser, user.id.toString());
    else localStorage.removeItem(this.KEYS.currentUser);
  },

  // ============================================================
  // REQUESTS
  // ============================================================
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

    // Считаем популярность
    if (data.deviceBrandId) this.incrementPopularity(this.KEYS.deviceBrands, data.deviceBrandId);
    if (data.deviceModelId) this.incrementPopularity(this.KEYS.deviceModels, data.deviceModelId);
    if (Array.isArray(data.problemTagIds)) {
      data.problemTagIds.forEach(id => this.incrementPopularity(this.KEYS.commonProblems, id));
    }
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

  // ============================================================
  // REVIEWS
  // ============================================================
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

  // ============================================================
  // LEADS
  // ============================================================
  getLeads() { return this.get(this.KEYS.leads); },
  createLead({ name, phone, comment }) {
    const leads = this.getLeads();
    const lead = { id: this.nextId(), name, phone, comment, status: 'new', createdAt: new Date().toISOString() };
    leads.push(lead); this.set(this.KEYS.leads, leads);
    return lead;
  },

  // ============================================================
  // PORTFOLIO
  // ============================================================
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

  // ============================================================
  // SETTINGS
  // ============================================================
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

  // ============================================================
  // DEVICE TYPES
  // ============================================================
  seedDeviceTypes() {
    this.set(this.KEYS.deviceTypes, [
      { id: 1, code: 'laptop', title: 'Ноутбук', icon: '💻', sort_order: 1 },
      { id: 2, code: 'phone', title: 'Смартфон', icon: '📱', sort_order: 2 },
      { id: 3, code: 'pc', title: 'Компьютер', icon: '🖥️', sort_order: 3 },
      { id: 4, code: 'tablet', title: 'Планшет', icon: '📲', sort_order: 4 },
      { id: 5, code: 'tv', title: 'Телевизор', icon: '📺', sort_order: 5 },
      { id: 6, code: 'console', title: 'Игровая консоль', icon: '🎮', sort_order: 6 },
      { id: 7, code: 'washer', title: 'Стиральная машина', icon: '🧺', sort_order: 7 },
    ]);
  },
  getDeviceTypes() {
    return this.get(this.KEYS.deviceTypes).sort((a,b) => a.sort_order - b.sort_order);
  },
  findDeviceTypeByCode(code) {
    return this.getDeviceTypes().find(t => t.code === code);
  },

  // ============================================================
  // DEVICE BRANDS
  // ============================================================
  seedDeviceBrands() {
    this.set(this.KEYS.deviceBrands, [
      // Ноутбуки (type 1)
      { id: 1, device_type_id: 1, title: 'Apple', popularity: 50 },
      { id: 2, device_type_id: 1, title: 'Lenovo', popularity: 40 },
      { id: 3, device_type_id: 1, title: 'HP', popularity: 35 },
      { id: 4, device_type_id: 1, title: 'Asus', popularity: 30 },
      { id: 5, device_type_id: 1, title: 'Acer', popularity: 25 },
      { id: 6, device_type_id: 1, title: 'Dell', popularity: 20 },
      { id: 7, device_type_id: 1, title: 'MSI', popularity: 15 },
      // Смартфоны (type 2)
      { id: 8, device_type_id: 2, title: 'Apple', popularity: 60 },
      { id: 9, device_type_id: 2, title: 'Samsung', popularity: 50 },
      { id: 10, device_type_id: 2, title: 'Xiaomi', popularity: 45 },
      { id: 11, device_type_id: 2, title: 'Huawei', popularity: 25 },
      { id: 12, device_type_id: 2, title: 'Google', popularity: 20 },
      // ПК (type 3)
      { id: 13, device_type_id: 3, title: 'Собственная сборка', popularity: 40 },
      { id: 14, device_type_id: 3, title: 'HP', popularity: 25 },
      { id: 15, device_type_id: 3, title: 'Dell', popularity: 20 },
      { id: 16, device_type_id: 3, title: 'Lenovo', popularity: 20 },
      // Планшеты (type 4)
      { id: 17, device_type_id: 4, title: 'Apple', popularity: 35 },
      { id: 18, device_type_id: 4, title: 'Samsung', popularity: 25 },
      { id: 19, device_type_id: 4, title: 'Huawei', popularity: 15 },
      // ТВ (type 5)
      { id: 20, device_type_id: 5, title: 'Samsung', popularity: 30 },
      { id: 21, device_type_id: 5, title: 'LG', popularity: 28 },
      { id: 22, device_type_id: 5, title: 'Sony', popularity: 18 },
      // Консоли (type 6)
      { id: 23, device_type_id: 6, title: 'Sony', popularity: 25 },
      { id: 24, device_type_id: 6, title: 'Microsoft', popularity: 20 },
      { id: 25, device_type_id: 6, title: 'Nintendo', popularity: 15 },
      // Стиральные машины (type 7)
      { id: 26, device_type_id: 7, title: 'Bosch', popularity: 20 },
      { id: 27, device_type_id: 7, title: 'LG', popularity: 18 },
      { id: 28, device_type_id: 7, title: 'Samsung', popularity: 15 },
    ]);
  },
  getDeviceBrands(deviceTypeId) {
    return this.get(this.KEYS.deviceBrands)
      .filter(b => b.device_type_id === deviceTypeId)
      .sort((a,b) => b.popularity - a.popularity);
  },

  // ============================================================
  // DEVICE MODELS
  // ============================================================
  seedDeviceModels() {
    this.set(this.KEYS.deviceModels, [
      { id: 1, brand_id: 1, title: 'MacBook Pro 14 M2', popularity: 30 },
      { id: 2, brand_id: 1, title: 'MacBook Air M1', popularity: 25 },
      { id: 3, brand_id: 1, title: 'MacBook Pro 16 M1 Pro', popularity: 20 },
      { id: 4, brand_id: 2, title: 'IdeaPad 3', popularity: 20 },
      { id: 5, brand_id: 2, title: 'ThinkPad T14', popularity: 15 },
      { id: 6, brand_id: 3, title: 'Pavilion 15', popularity: 18 },
      { id: 7, brand_id: 4, title: 'VivoBook 15', popularity: 15 },
      { id: 8, brand_id: 8, title: 'iPhone 13', popularity: 40 },
      { id: 9, brand_id: 8, title: 'iPhone 14 Pro', popularity: 35 },
      { id: 10, brand_id: 8, title: 'iPhone 12', popularity: 30 },
      { id: 11, brand_id: 8, title: 'iPhone SE 2022', popularity: 15 },
      { id: 12, brand_id: 9, title: 'Galaxy S22', popularity: 25 },
      { id: 13, brand_id: 9, title: 'Galaxy A53', popularity: 22 },
      { id: 14, brand_id: 9, title: 'Galaxy S21', popularity: 18 },
      { id: 15, brand_id: 10, title: 'Redmi Note 11', popularity: 22 },
      { id: 16, brand_id: 10, title: 'Mi 11 Lite', popularity: 15 },
      { id: 17, brand_id: 17, title: 'iPad 9', popularity: 20 },
      { id: 18, brand_id: 17, title: 'iPad Air 5', popularity: 15 },
      { id: 19, brand_id: 20, title: 'UE55AU7100', popularity: 15 },
      { id: 20, brand_id: 21, title: '55UP75006LF', popularity: 12 },
    ]);
  },
  getDeviceModels(brandId) {
    return this.get(this.KEYS.deviceModels)
      .filter(m => m.brand_id === brandId)
      .sort((a,b) => b.popularity - a.popularity);
  },

  // ============================================================
  // COMMON PROBLEMS
  // ============================================================
  seedCommonProblems() {
    this.set(this.KEYS.commonProblems, [
      { id: 1, device_type_id: 1, title: 'Не включается', icon: '🔌', popularity: 45 },
      { id: 2, device_type_id: 1, title: 'Перегрев и шум', icon: '🔥', popularity: 38 },
      { id: 3, device_type_id: 1, title: 'Разбит экран', icon: '💔', popularity: 35 },
      { id: 4, device_type_id: 1, title: 'Не заряжается', icon: '🔋', popularity: 30 },
      { id: 5, device_type_id: 1, title: 'Залили жидкостью', icon: '💧', popularity: 25 },
      { id: 6, device_type_id: 1, title: 'Не работает клавиатура', icon: '⌨️', popularity: 20 },
      { id: 7, device_type_id: 1, title: 'Проблемы с Wi-Fi', icon: '📡', popularity: 15 },
      { id: 8, device_type_id: 2, title: 'Разбит экран', icon: '💔', popularity: 55 },
      { id: 9, device_type_id: 2, title: 'Быстро разряжается', icon: '🔋', popularity: 40 },
      { id: 10, device_type_id: 2, title: 'Не заряжается', icon: '🔌', popularity: 35 },
      { id: 11, device_type_id: 2, title: 'Попала вода', icon: '💧', popularity: 25 },
      { id: 12, device_type_id: 2, title: 'Не работает камера', icon: '📷', popularity: 15 },
      { id: 13, device_type_id: 3, title: 'Не включается', icon: '🔌', popularity: 30 },
      { id: 14, device_type_id: 3, title: 'Синий экран', icon: '⚠️', popularity: 25 },
      { id: 15, device_type_id: 3, title: 'Тормозит', icon: '🐢', popularity: 20 },
      { id: 16, device_type_id: 3, title: 'Шумит кулер', icon: '🔊', popularity: 15 },
      { id: 17, device_type_id: 4, title: 'Разбит экран', icon: '💔', popularity: 30 },
      { id: 18, device_type_id: 4, title: 'Не заряжается', icon: '🔋', popularity: 20 },
      { id: 19, device_type_id: 5, title: 'Нет изображения', icon: '📺', popularity: 25 },
      { id: 20, device_type_id: 5, title: 'Полосы на экране', icon: '📊', popularity: 20 },
      { id: 21, device_type_id: 6, title: 'Перегрев', icon: '🔥', popularity: 20 },
      { id: 22, device_type_id: 6, title: 'Не читает диски', icon: '💿', popularity: 15 },
      { id: 23, device_type_id: 7, title: 'Не сливает воду', icon: '💧', popularity: 20 },
      { id: 24, device_type_id: 7, title: 'Не отжимает', icon: '🌀', popularity: 18 },
    ]);
  },
  getCommonProblems(deviceTypeId) {
    return this.get(this.KEYS.commonProblems)
      .filter(p => p.device_type_id === deviceTypeId)
      .sort((a,b) => b.popularity - a.popularity);
  },

  incrementPopularity(collectionKey, id) {
    const list = this.get(collectionKey);
    const idx = list.findIndex(x => x.id === id);
    if (idx === -1) return;
    list[idx].popularity = (list[idx].popularity || 0) + 1;
    this.set(collectionKey, list);
  },

  // ============================================================
  // SLOTS
  // ============================================================
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