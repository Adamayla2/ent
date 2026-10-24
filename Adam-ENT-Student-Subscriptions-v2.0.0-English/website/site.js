'use strict';

(() => {
  const DEVICE_KEY = 'adam_paid_device_id';
  const SESSION_KEY = 'adam_paid_session';
  const $ = id => document.getElementById(id);
  let config = null;
  let session = null;
  let deviceId = '';
  let chosenPlan = null;
  let checkoutOrder = null;
  const messages = {
    invalid_credentials: 'Incorrect email address or password.',
    email_exists: 'This email address is already registered. Sign in instead.',
    device_limit: 'Your account has reached its two-device limit. Sign in on a registered device to remove an old one, or contact the administrator.',
    device_limit_reached: 'Your account has reached its two-device limit. Remove an old device from a registered device, or contact the administrator.',
    payment_not_configured: 'Live payments are disabled. Merchant approval and payment gateway integration are still required.',
    unauthorized: 'Your session has expired. Please sign in again.',
    session_revoked: 'This device session has been revoked. Please sign in again.',
    rate_limited: 'Too many requests. Wait a moment and try again.',
    sandbox_disabled: 'Payment simulation is unavailable in the current service mode.',
    order_not_found: 'This order was not found or does not belong to your account.'
  };

  function status(id, message, kind = '') {
    const el = $(id);
    if (!el) return;
    el.textContent = message;
    el.className = kind;
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  }
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function saveSession(data) {
    session = { ...session, ...data };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function clearSession() {
    session = null;
    localStorage.removeItem(SESSION_KEY);
  }
  async function api(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const headers = { 'X-Device-Id': deviceId, ...options.headers };
      if (session?.token) headers.Authorization = 'Bearer ' + session.token;
      if (options.body) headers['Content-Type'] = 'application/json';
      const response = await fetch(path, { ...options, headers, cache: 'no-store', credentials: 'omit', signal: controller.signal });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(messages[data.error?.code] || data.error?.message || 'Unable to complete the request. Please try again.');
        error.code = data.error?.code;
        error.status = response.status;
        if (response.status === 401 && !path.startsWith('/api/auth/')) clearSession();
        throw error;
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('The connection timed out. Check your network and try again.');
      if (error instanceof TypeError) throw new Error('Unable to reach the server. Check your internet connection.');
      throw error;
    } finally { clearTimeout(timeout); }
  }
  async function busy(button, task) {
    button.disabled = true;
    try { await task(); } finally { button.disabled = false; }
  }
  function date(epoch) {
    return epoch ? new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(epoch * 1000)) : '—';
  }
  function price(plan) {
    return new Intl.NumberFormat('en-GB').format(plan.amount) + ' ' + (plan.currency === 'IQD' ? 'IQD' : plan.currency);
  }
  function planName(plan) {
    if (plan.id === 'quarterly' && plan.months === 3) return 'Three-month plan';
    if (plan.id === 'annual' && plan.months === 12) return 'Annual plan';
    return plan.name || (plan.months + ' months');
  }
  function modeBanner() {
    const banner = $('mode-banner');
    banner.textContent = config.paymentMode === 'sandbox'
      ? 'SANDBOX ONLY — Payments are simulated. No money is charged and no real cards are processed.'
      : 'Payments disabled — Merchant approval and payment gateway integration are required. Do not enter card details.';
  }
  function renderPlans() {
    const list = $('plan-list');
    if (!list) return;
    list.replaceChildren();
    if (!Array.isArray(config.plans) || !config.plans.length) {
      status('plans-status', 'No plans are currently available.', 'error');
      return;
    }
    for (const plan of config.plans) {
      if (!Number.isFinite(plan.amount) || !Number.isInteger(plan.months) || plan.amount <= 0 || plan.months <= 0) continue;
      const card = node('article', undefined, 'plan' + (plan.id === 'annual' ? ' recommended' : ''));
      if (plan.id === 'annual') card.append(node('span', 'Longer access', 'pill'));
      card.append(node('h3', planName(plan)));
      const amount = node('div', new Intl.NumberFormat('en-GB').format(plan.amount), 'price');
      amount.append(node('small', ' ' + (plan.currency === 'IQD' ? 'IQD' : plan.currency)));
      card.append(amount, node('p', 'For ' + plan.months + ' months from activation', 'muted'));
      const features = node('ul');
      ['Access to the published question bank', 'Bank updates during your subscription', 'Offline study with license renewal every ' + config.offlineDays + ' days', 'Two devices per account — manual renewal'].forEach(text => features.append(node('li', text)));
      const button = node('button', config.paymentMode === 'sandbox' ? 'Try an order — no real payment' : 'Payments currently disabled', 'button full');
      button.type = 'button';
      button.disabled = config.paymentMode !== 'sandbox';
      button.addEventListener('click', () => busy(button, () => createOrder(plan.id)).catch(error => status('plans-status', error.message, 'error')));
      card.append(features, button);
      list.append(card);
    }
    status('plans-status', config.paymentMode === 'sandbox' ? 'These plans are for testing only. Live activation requires an approved payment gateway.' : 'You can create an account. Purchases remain unavailable until payment integration is complete.');
  }
  async function createOrder(planId) {
    if (!session?.token) {
      chosenPlan = planId;
      status('auth-status', 'Sign in or create an account to continue with your subscription order.');
      $('account').scrollIntoView({ behavior: 'smooth' });
      $('login-email').focus({ preventScroll: true });
      return;
    }
    status('plans-status', 'Creating your order…');
    const data = await api('/api/orders', { method: 'POST', body: JSON.stringify({ planId }) });
    if (!data.order?.id) throw new Error('The order response was incomplete.');
    // Only a local known checkout page is ever navigated to; provider URLs need an approved adapter.
    location.assign('/checkout.html?order=' + encodeURIComponent(data.order.id));
  }
  function chooseTab(register) {
    $('login-form').hidden = register;
    $('register-form').hidden = !register;
    $('login-tab').classList.toggle('active', !register);
    $('register-tab').classList.toggle('active', register);
    $('login-tab').setAttribute('aria-pressed', String(!register));
    $('register-tab').setAttribute('aria-pressed', String(register));
    status('auth-status', '');
  }
  async function renderAccount() {
    if (!$('auth-panel')) return;
    const loggedIn = Boolean(session?.token && session?.user);
    $('auth-panel').hidden = loggedIn;
    $('signed-panel').hidden = !loggedIn;
    if (!loggedIn) return;
    $('user-name').textContent = session.user.name;
    $('user-email').textContent = session.user.email;
    $('subscription-status').textContent = session.subscription?.active ? 'Subscription active' : 'No active subscription';
    $('subscription-expiry').textContent = session.subscription?.expiresAt ? 'Expires: ' + date(session.subscription.expiresAt) : 'Choose a plan above when payments become available.';
    await renderDevices();
  }
  async function renderDevices() {
    const list = $('devices');
    if (!list) return;
    list.replaceChildren(node('li', 'Loading devices…'));
    try {
      const data = await api('/api/devices');
      list.replaceChildren();
      for (const device of data.devices || []) {
        const item = node('li');
        const label = node('span', device.name || 'Device');
        label.append(node('small', device.current ? 'This device' : 'Last seen: ' + date(device.lastSeen)));
        const remove = node('button', 'Remove device');
        remove.type = 'button';
        remove.addEventListener('click', () => {
          if (!confirm('Removing this device revokes its sessions and licenses when it next connects. Continue?')) return;
          busy(remove, async () => {
            await api('/api/devices/' + encodeURIComponent(device.id), { method: 'DELETE' });
            if (device.current) { clearSession(); await renderAccount(); }
            else await renderDevices();
            status('auth-status', 'Device removed.', 'success');
          }).catch(error => status('auth-status', error.message, 'error'));
        });
        item.append(label, remove);
        list.append(item);
      }
    } catch (error) { list.replaceChildren(node('li', error.message, 'error')); }
  }
  async function refreshAccount() {
    const data = await api('/api/me');
    saveSession(data);
    await renderAccount();
  }
  function bindAuth() {
    $('login-tab').addEventListener('click', () => chooseTab(false));
    $('register-tab').addEventListener('click', () => chooseTab(true));
    for (const type of ['login', 'register']) {
      const form = $(type + '-form');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const values = new FormData(form);
        const body = { email: String(values.get('email')).trim(), password: String(values.get('password')), deviceId, deviceName: 'Website browser — ' + (navigator.userAgentData?.platform || navigator.platform || 'Device') };
        if (type === 'register') body.name = String(values.get('name')).trim();
        status('auth-status', 'Checking…');
        busy(form.querySelector('button[type=submit]'), async () => {
          const data = await api('/api/auth/' + type, { method: 'POST', body: JSON.stringify(body) });
          if (!data.token || !data.user) throw new Error('The sign-in response was incomplete.');
          saveSession(data);
          form.reset();
          await renderAccount();
          status('auth-status', 'Signed in.', 'success');
          if (chosenPlan) { const plan = chosenPlan; chosenPlan = null; await createOrder(plan); }
        }).catch(error => { status('auth-status', error.message, 'error'); renderAccount(); });
      });
    }
    $('refresh-account').addEventListener('click', event => busy(event.currentTarget, async () => { await refreshAccount(); status('auth-status', 'Subscription refreshed.', 'success'); }).catch(error => { status('auth-status', error.message, 'error'); renderAccount(); }));
    $('logout').addEventListener('click', event => busy(event.currentTarget, async () => {
      // Do not report a server logout if the network request failed.
      await api('/api/auth/logout', { method: 'POST' });
      clearSession();
      await renderAccount();
      status('auth-status', 'Signed out.');
    }).catch(error => status('auth-status', error.message, 'error')));
  }
  function renderOrder(order) {
    const list = $('order-details');
    list.replaceChildren();
    const plan = config.plans.find(item => item.id === order.planId);
    const labels = { pending: 'Pending', paid: 'Paid — simulated', failed: 'Failed — simulated', created: 'Order created' };
    const entries = [['Order ID', order.id], ['Plan', plan ? planName(plan) : order.planId], ['Duration', plan ? plan.months + ' months' : '—'], ['Amount', price(order)], ['Status', labels[order.status] || order.status]];
    for (const [key, value] of entries) { const row = node('div'); row.append(node('dt', key), node('dd', value)); list.append(row); }
    $('sandbox-controls').hidden = config.paymentMode !== 'sandbox' || ['paid', 'failed'].includes(order.status);
  }
  async function loadCheckout() {
    if (config.paymentMode !== 'sandbox') { status('checkout-status', 'Live payments are disabled. Merchant approval and payment gateway integration are required. Purchases are unavailable in this version.', 'error'); return; }
    if (!session?.token) { status('checkout-status', 'Sign in on the account page first, then choose a plan.', 'error'); return; }
    const params = new URLSearchParams(location.search);
    const id = params.get('order') || params.get('orderId');
    if (!id || id.length > 160) { status('checkout-status', 'The order ID is missing or invalid.', 'error'); return; }
    const data = await api('/api/orders/' + encodeURIComponent(id));
    checkoutOrder = data.order;
    renderOrder(checkoutOrder);
    status('checkout-status', 'This is a sandbox order only. No cards are processed and no money is collected.');
    for (const button of document.querySelectorAll('[data-outcome]')) {
      button.addEventListener('click', () => {
        const buttons = [...document.querySelectorAll('[data-outcome]')];
        buttons.forEach(el => { el.disabled = true; });
        api('/api/orders/' + encodeURIComponent(checkoutOrder.id) + '/sandbox-confirm', { method: 'POST', body: JSON.stringify({ outcome: button.dataset.outcome }) }).then(data => {
          checkoutOrder = data.order;
          if (data.subscription) saveSession({ subscription: data.subscription, license: data.license, ...(data.user ? { user: data.user } : {}) });
          renderOrder(checkoutOrder);
          const result = $('checkout-result');
          result.replaceChildren();
          if (checkoutOrder.status === 'paid') {
            status('checkout-status', 'Payment simulation succeeded. A test subscription was activated for this account. No money was charged.', 'success');
            const link = node('a', 'Open the student app to download the bank', 'button full'); link.href = '/student/'; result.append(link);
            result.append(node('p', 'Subscription expires: ' + date(data.subscription?.expiresAt), 'fine'));
          } else status('checkout-status', checkoutOrder.status === 'failed' ? 'A failed payment was simulated. No subscription was activated. You can create a new order on the account page.' : 'The order is pending. No subscription was activated.');
        }).catch(error => status('checkout-status', error.message, 'error')).finally(() => buttons.forEach(el => { el.disabled = false; }));
      });
    }
  }
  async function init() {
    try {
      const storedDevice = localStorage.getItem(DEVICE_KEY);
      try { deviceId = JSON.parse(storedDevice); } catch { deviceId = storedDevice; }
      if (!deviceId || typeof deviceId !== 'string') { deviceId = crypto.randomUUID(); localStorage.setItem(DEVICE_KEY, JSON.stringify(deviceId)); }
      try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { clearSession(); }
      config = await api('/api/config');
      modeBanner();
      if (document.body.dataset.page === 'checkout') await loadCheckout();
      else {
        bindAuth(); renderPlans();
        if (session?.token) {
          try { await refreshAccount(); } catch (error) { await renderAccount(); status('auth-status', error.message, 'error'); }
        } else await renderAccount();
      }
    } catch (error) {
      $('mode-banner').textContent = 'Service unavailable — Payments cannot be made at this time.';
      status(document.body.dataset.page === 'checkout' ? 'checkout-status' : 'plans-status', error.message, 'error');
    }
  }
  window.addEventListener('storage', event => { if (event.key === SESSION_KEY) location.reload(); });
  init();
})();
