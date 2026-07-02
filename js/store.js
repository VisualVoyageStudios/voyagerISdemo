'use strict';

const CONFIG = {
    email:    'visualvoyagebsn@gmail.com',
    whatsapp: '27814758138',
};

// ── Product catalogue ────────────────────────────────────────────────────────
// cardUrl  → Lemon Squeezy hosted checkout link (card payment)
// eftUrl   → Ozow payment link (instant EFT)
// Leave either empty ('') to fall back to the manual order modal.
const PRODUCTS = [
    {
        id:          'momentum-pulse',
        name:        'Momentum Pulse',
        type:        'indicator',
        tagline:     'Trend strength, without the lag',
        description: 'Cuts through market noise to surface genuine momentum build-up before the obvious move happens — not after.',
        features:    ['Filters chop and low-conviction ranges', 'Clear chart overlay', 'Works across timeframes'],
        price:       450,
        billing:     'once-off',
        cardUrl:     '', // paste Lemon Squeezy checkout URL here
        eftUrl:      '', // paste Ozow payment link here
    },
    {
        id:          'liquidity-zones-pro',
        name:        'Liquidity Zones Pro',
        type:        'indicator',
        tagline:     'See where price is likely to react before it gets there',
        description: 'Maps high-probability reaction areas using volume and price-action behaviour — so you have context, not just a line.',
        features:    ['Dynamic zone detection', 'Adjustable sensitivity', 'Works on any liquid market'],
        price:       650,
        billing:     'once-off',
        cardUrl:     '',
        eftUrl:      '',
    },
    {
        id:          'smart-trend-filter',
        name:        'Smart Trend Filter',
        type:        'strategy',
        tagline:     'A full trend-following system you can backtest',
        description: 'Entry, exit, and risk logic built into one strategy — backtest it on your own markets and timeframes before committing capital.',
        features:    ['Entry and exit logic included', 'Risk-rule structure', 'Backtest-ready on TradingView'],
        price:       120,
        billing:     'month',
        cardUrl:     '',
        eftUrl:      '',
    },
];

const FAQS = [
    {
        q: 'Do I need a paid TradingView plan?',
        a: 'No. Invite-only scripts work on TradingView\'s free plan. The practical difference is how many indicators you can run on a chart at the same time.',
    },
    {
        q: 'How long does access take after purchase?',
        a: 'Access is granted manually to your TradingView username, usually within a few hours. You\'ll see the script appear under your "Invite-only scripts" tab once it\'s added.',
    },
    {
        q: 'What payment methods are accepted?',
        a: 'Card payments (Visa, Mastercard) are handled by Lemon Squeezy. South African instant EFT payments are handled by Ozow — pay directly from your bank account, no card needed.',
    },
    {
        q: 'What if I entered the wrong TradingView username?',
        a: 'Just get in touch with the correct one. Access is tied to the username — it\'s an easy fix before it\'s been granted.',
    },
    {
        q: 'Is there a guarantee of profit?',
        a: 'No. No indicator or strategy can guarantee results. These are analysis tools — they support decisions; they don\'t make them.',
    },
    {
        q: 'How do refunds work?',
        a: 'Reach out before access is granted and it\'ll be handled quickly. Once access is active, refunds are handled case-by-case.',
    },
];

const ICONS = {
    'momentum-pulse':      `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,13 6,8 10,15 14,5 18,11 20,11"/></svg>`,
    'liquidity-zones-pro': `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="18" height="3" rx="1"/><rect x="2" y="10" width="18" height="2" rx="1" opacity=".5"/><rect x="2" y="16" width="18" height="3" rx="1"/></svg>`,
    'smart-trend-filter':  `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,17 8,11 12,14 19,5"/><polyline points="15,5 19,5 19,9"/></svg>`,
};

// ── State ────────────────────────────────────────────────────────────────────
let activeFilter  = 'all';
let activeProduct = null;
let activeMethod  = null; // 'card' | 'eft'
let returnFocus   = null;

// ── Helpers ──────────────────────────────────────────────────────────────────
function esc(str) {
    return String(str).replace(/[&<>"']/g, c => (
        {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]
    ));
}

function formatPrice(p) {
    const r = `R${p.price.toLocaleString('en-ZA')}`;
    return p.billing === 'once-off'
        ? `${r}<span class="product-price-note">once-off</span>`
        : `${r}<span class="product-price-note">per month</span>`;
}

// ── Render products ──────────────────────────────────────────────────────────
function renderProducts() {
    const grid  = document.getElementById('productGrid');
    const count = document.getElementById('libraryCount');
    const empty = document.getElementById('emptyState');

    const filtered = PRODUCTS.filter(p =>
        activeFilter === 'all' || p.type === activeFilter
    );

    count.textContent = PRODUCTS.length;

    if (!filtered.length) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    grid.innerHTML = filtered.map(p => `
        <article class="product-card">
            <div class="product-icon">${ICONS[p.id] || ICONS['momentum-pulse']}</div>
            <span class="product-type-tag ${esc(p.type)}">${esc(p.type)}</span>
            <h3 class="product-name">${esc(p.name)}</h3>
            <p class="product-tagline">${esc(p.tagline)}</p>
            <p class="product-desc">${esc(p.description)}</p>
            <ul class="product-features">
                ${p.features.map(f => `<li>${esc(f)}</li>`).join('')}
            </ul>
            <div class="product-footer">
                <div class="product-price">${formatPrice(p)}</div>
                <div class="product-buy-group">
                    <button
                        class="btn btn-gold btn-buy"
                        type="button"
                        data-product-id="${esc(p.id)}"
                        data-method="card"
                        title="Pay by card via Lemon Squeezy"
                    >
                        <svg width="14" height="14" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="18" height="14" rx="2"/><path d="M2 10h18"/></svg>
                        Card
                    </button>
                    <button
                        class="btn btn-eft btn-buy"
                        type="button"
                        data-product-id="${esc(p.id)}"
                        data-method="eft"
                        title="Pay by instant EFT via Ozow"
                    >
                        <svg width="14" height="14" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h18M3 11l4-4M3 11l4 4M19 7v8"/></svg>
                        EFT
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// ── Render FAQ ───────────────────────────────────────────────────────────────
function renderFAQs() {
    const list = document.getElementById('faqList');
    list.innerHTML = FAQS.map((item, i) => `
        <div class="faq-item" id="faq-${i}">
            <button class="faq-trigger" type="button" aria-expanded="false" aria-controls="faq-body-${i}">
                <span>${esc(item.q)}</span>
                <span class="faq-trigger-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-body" id="faq-body-${i}" role="region">
                <div class="faq-body-inner">
                    <p>${esc(item.a)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ── Modal ────────────────────────────────────────────────────────────────────
function openModal(product, method) {
    activeProduct = product;
    activeMethod  = method;
    returnFocus   = document.activeElement;

    const methodLabel = method === 'eft' ? 'Instant EFT (Ozow)' : 'Card (Lemon Squeezy)';
    const billing     = product.billing === 'once-off' ? 'once-off' : 'per month';

    document.getElementById('modalProductName').textContent =
        `${product.name} — R${product.price.toLocaleString('en-ZA')} ${billing}`;

    document.getElementById('modalPaymentMethod').textContent =
        `Payment method: ${methodLabel}`;

    const modal = document.getElementById('orderModal');
    modal.hidden = false;
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
        document.getElementById('fieldUsername').focus();
    });
}

function closeModal() {
    document.getElementById('orderModal').hidden = true;
    document.body.classList.remove('no-scroll');
    document.getElementById('orderForm').reset();
    activeProduct = null;
    activeMethod  = null;
    if (returnFocus) returnFocus.focus();
}

function buildMessage(username, email) {
    const methodLabel = activeMethod === 'eft'
        ? 'Instant EFT (Ozow)'
        : 'Card (Lemon Squeezy)';
    const billing = activeProduct.billing === 'once-off' ? 'once-off' : 'per month';

    return [
        'Hi,',
        '',
        `I would like access to: ${activeProduct.name}`,
        `Price: R${activeProduct.price.toLocaleString('en-ZA')} (${billing})`,
        `Preferred payment method: ${methodLabel}`,
        `TradingView username: ${username}`,
        `Email: ${email}`,
        '',
        'Please send payment and access details.',
    ].join('\n');
}

function handleOrderSubmit(e) {
    e.preventDefault();
    if (!activeProduct) return;

    const username = document.getElementById('fieldUsername').value.trim();
    const email    = document.getElementById('fieldEmail').value.trim();
    const subject  = encodeURIComponent(`Order: ${activeProduct.name}`);
    const body     = encodeURIComponent(buildMessage(username, email));

    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
}

function handleWhatsapp() {
    if (!activeProduct) return;
    const usernameEl = document.getElementById('fieldUsername');
    const emailEl    = document.getElementById('fieldEmail');
    if (!usernameEl.reportValidity() || !emailEl.reportValidity()) return;

    const msg = encodeURIComponent(
        buildMessage(usernameEl.value.trim(), emailEl.value.trim())
    );
    window.open(
        `https://wa.me/${CONFIG.whatsapp}?text=${msg}`,
        '_blank',
        'noopener,noreferrer'
    );
}

// ── Buy handler ──────────────────────────────────────────────────────────────
function handleBuy(productId, method) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (method === 'card' && product.cardUrl) {
        window.location.href = product.cardUrl;
        return;
    }
    if (method === 'eft' && product.eftUrl) {
        window.location.href = product.eftUrl;
        return;
    }

    // No URL yet — open manual order modal
    openModal(product, method);
}

// ── Events ───────────────────────────────────────────────────────────────────
function setupEvents() {
    // Mobile nav
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu   = document.querySelector('[data-nav-menu]');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
        menu.addEventListener('click', e => {
            if (e.target.closest('a')) {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(b =>
                b.classList.remove('active')
            );
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    // Buy buttons (delegated — both card and EFT)
    document.getElementById('productGrid').addEventListener('click', e => {
        const btn = e.target.closest('[data-product-id]');
        if (btn) handleBuy(btn.dataset.productId, btn.dataset.method);
    });

    // FAQ accordion (delegated)
    document.getElementById('faqList').addEventListener('click', e => {
        const trigger = e.target.closest('.faq-trigger');
        if (!trigger) return;
        const item = trigger.closest('.faq-item');
        const open = item.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(open));
    });

    // Modal
    document.querySelector('[data-modal-close]')
        .addEventListener('click', closeModal);
    document.querySelector('[data-modal-backdrop]')
        .addEventListener('click', closeModal);
    document.getElementById('orderForm')
        .addEventListener('submit', handleOrderSubmit);
    document.getElementById('btnWhatsapp')
        .addEventListener('click', handleWhatsapp);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !document.getElementById('orderModal').hidden) {
            closeModal();
        }
    });
}

// ── Init ─────────────────────────────────────────────────────────────────────
renderProducts();
renderFAQs();
setupEvents();
