import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { createRequire } from 'node:module';
import { createServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
  try { ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
  catch { /* The test reports its unavailable browser prerequisite explicitly. */ }
}
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(file => file && existsSync(file));
const skip = !chromium ? 'Install Playwright or set PLAYWRIGHT_MODULE to its local module path.' : !executablePath ? 'Set CHROME_PATH to an installed Chrome/Chromium/Edge executable; this test never downloads a browser.' : false;

async function freePort() {
  const probe = net.createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  return port;
}
async function runSite(mode, run) {
  const data = await mkdtemp(path.join(tmpdir(), 'adam-website-e2e-'));
  let server;
  let browser;
  try {
    const port = await freePort();
    const origin = 'http://127.0.0.1:' + port;
    server = await createServer({ dataDir: data, paymentMode: mode, publicUrl: origin, env: { NODE_ENV: 'development' } });
    await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
    browser = await chromium.launch({ headless: true, executablePath });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await run(page, origin);
    assert.deepEqual(errors, [], 'No uncaught page errors');
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
    const safe = path.resolve(data);
    assert.ok(safe.startsWith(path.resolve(tmpdir()) + path.sep) && path.basename(safe).startsWith('adam-website-e2e-'), 'Temporary cleanup path is bounded');
    await rm(safe, { recursive: true, force: true });
  }
}

test('website: real auth, server-priced checkout, sandbox outcomes, account restoration and mobile layout', { skip, timeout: 90000 }, async () => {
  await runSite('sandbox', async (page, origin) => {
    await page.goto(origin);
    await page.waitForSelector('.plan');
    assert.equal(await page.locator('.plan').count(), 2);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
    assert.equal(await page.locator('a[href="/account-delete.html"]').count(), 1);
    assert.equal(await page.locator('a[href="/student/privacy.html"]').count(), 1);
    assert.match(await page.locator('#mode-banner').textContent(), /SANDBOX/);
    assert.equal(await page.locator('input[autocomplete="cc-number"]').count(), 0);
    await page.getByRole('button', { name: 'Try an order — no real payment' }).first().click();
    await page.locator('#register-tab').click();
    await page.locator('#register-name').fill('Test Student');
    await page.locator('#register-email').fill('website-e2e@example.test');
    await page.locator('#register-password').fill('short');
    assert.equal(await page.locator('#register-form').evaluate(form => form.checkValidity()), false);
    await page.locator('#register-password').fill('Strong-password-123!');
    await page.locator('#register-form button[type=submit]').click();
    await page.waitForURL('**/checkout.html?order=*');
    await page.getByRole('button', { name: 'Simulate pending payment' }).click();
    await page.waitForFunction(() => document.querySelector('#checkout-status').textContent.includes('No subscription was activated'));
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('adam_paid_session')).subscription.active), false);
    await page.getByRole('button', { name: 'Simulate failed payment' }).click();
    await page.waitForFunction(() => document.querySelector('#checkout-status').textContent.includes('failed payment'));
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('adam_paid_session')).subscription.active), false);
    assert.equal(await page.locator('#sandbox-controls').isVisible(), false);
    await page.goto(origin);
    await page.getByRole('button', { name: 'Try an order — no real payment' }).first().click();
    await page.waitForURL('**/checkout.html?order=*');
    await page.getByRole('button', { name: 'Simulate successful payment' }).click();
    await page.waitForFunction(() => document.querySelector('#checkout-status').textContent.includes('simulation succeeded'));
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('adam_paid_session')).subscription.active), true);
    assert.equal(await page.locator('#sandbox-controls').isVisible(), false);
    await page.goto(origin);
    await page.waitForSelector('#signed-panel:not([hidden])');
    await page.waitForSelector('#devices button');
    assert.match(await page.locator('#subscription-status').textContent(), /active/);
    assert.equal(await page.locator('#devices li').count(), 1);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await page.waitForSelector('#auth-panel:not([hidden])');
    assert.equal(await page.evaluate(() => localStorage.getItem('adam_paid_session')), null);
    await page.locator('#login-email').fill('website-e2e@example.test');
    await page.locator('#login-password').fill('Strong-password-123!');
    await page.locator('#login-form button[type=submit]').click();
    await page.waitForSelector('#signed-panel:not([hidden])');
    assert.match(await page.locator('#subscription-status').textContent(), /active/);
  });
});

test('website: disabled mode exposes no payment simulation or card form', { skip, timeout: 45000 }, async () => {
  await runSite('disabled', async (page, origin) => {
    await page.goto(origin);
    await page.waitForSelector('.plan');
    assert.match(await page.locator('#mode-banner').textContent(), /disabled/);
    assert.equal(await page.locator('#plan-list button:disabled').count(), 2);
    await page.goto(origin + '/checkout.html?order=invalid');
    await page.waitForFunction(() => document.querySelector('#checkout-status').textContent.includes('Live payments are disabled'));
    assert.equal(await page.locator('#sandbox-controls').isVisible(), false);
    assert.equal(await page.locator('input').count(), 0);
  });
});
