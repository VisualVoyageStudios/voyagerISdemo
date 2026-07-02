'use strict';

const CONFIG = {
    email:     'visualvoyagebsn@gmail.com',
    whatsapp:  '27814758138',   // digits only, international format
};

// ── Product catalogue ───────────────────────────────────────────────────────
// Set checkoutUrl to your Lemon Squeezy hosted checkout link once ready.
// Leave it empty ('') to fall back to the manual order modal.
const PRODUCTS = [
    {
        id: 'momentum-pulse',
        name: 'Momentum Pulse',
        type: 'indicator',
        tagline: 'Trend strength, without the lag',
        description: 'Cuts through market noise to surface genuine momentum build-up before the obvious move happens — not after.',
        features: ['Filters chop and low-conviction ranges', 'Clear chart overlay', 'Works across timeframes'],
        price: 450,
        billing: 'once-off',
        checkoutUrl: '',
    },
    {
        id: 'liquidity-zones-pro',
        name: 'Liquidity Zones Pro',
        type: 'indicator',
        tagline: 'See where price is likely to react before it gets there',
        description: 'Maps high-probability reaction areas using volume and price-action behaviour — so you have context, not just a line.',
        features: ['Dynamic zone detection', 'Adjustable sensitivity', 'Works on any liquid market'],
        price: 650,
        billing: 'once-off',
        checkoutUrl: '',
    },
    {
        id: 'smart-trend-filter',
        name: 'Smart Trend Filter',
        type: 'strategy',
        tagline: 'A full trend-following system you can backtest',
        description: 'Entry, exit, and risk logic built into one strategy — so you can run it against your own markets and timeframes before committing any real capital.',
        features: ['Entry and exit logic included', 'Risk-rule structure', 'Backtest-ready on TradingView'],
        price: 120,
        billing: 'month',
        checkoutUrl: '',
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
    {
        q: 'Can I use these alongside my existing indicators?',
        a: 'Yes. Each script is a standalone TradingView tool — add it to any chart alongside whatever else you already use.',
    },
];

// ── SVG icons (keyed to product id) ─────────────────────────────────────────
const ICONS = {
    'momentum-pulse': `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,13 6,8 10,15 14,5 18,11 20,11"/></svg>`,
    'liquidity-zones-pro': `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="18" height="3" rx="1"/><rect x="2" y="10" width="18" height="2" rx="1" opacity=".5"/><rect x="2" y="16" width="18" height="3" rx="1"/></svg>`,
    'smart-trend-filter': `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,17 8,11 12,14 19,5"/><polyline points="15,5 19,5 19,9"/></svg>`,
};

// ── State ────────────────────────────────────────────────────────────────────
let activeFilter   = 'all';
let activeProduct  = null;
let returnFocus    = null;

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(product) {
    const r = `R${product.price.toLocaleString('en-ZA')}`;
    return product.billing === 'once-off' ? r : `${r}<span class="product-price-note">per month</span>`;
}

function esc(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

// ── Render product grid ──────────────────────────────────────────────────────
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const count = document.getElementById('libraryCount');
    const empty = document.getElementById('emptyState');

    const filtered = PRODUCTS.filter(p => activeFilter === 'all' || p.type === activeFilter);

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
                <div>
                    <div class="product-price">${formatPrice(p)}</div>
                </div>
                <button class="btn btn-gold" type="button" data-product-id="${esc(p.id)}">
                    Buy Now
                </button>
            </div>
        </article>
    `).join('');
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
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
function openModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (product.checkoutUrl) {
        window.location.href = product.checkoutUrl;
        return;
    }

    activeProduct = product;
    returnFocus = document.activeElement;

    document.getElementById('modalProductName').textContent =
        `${product.name} — R${product.price.toLocaleString('en-ZA')} ${product.billing === 'once-off' ? 'once-off' : 'per month'}`;

    const modal = document.getElementById('orderModal');
    modal.hidden = false;
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
        document.getElementById('fieldUsername').focus();
    });
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    document.getElementById('orderForm').reset();
    activeProduct = null;
    if (returnFocus) returnFocus.focus();
}

function buildMessage(username, email) {
    const p = activeProduct;
    return [
        'Hi,',
        '',
        `I would like access to: ${p.name}`,
        `Price: R${p.price.toLocaleString('en-ZA')} (${p.billing})`,
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
    const username = document.getElementById('fieldUsername').value.trim();
    const email    = document.getElementById('fieldEmail').value.trim();

    if (!document.getElementById('fieldUsername').reportValidity()) return;
    if (!document.getElementById('fieldEmail').reportValidity()) return;

    const msg = encodeURIComponent(buildMessage(username, email));
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer');
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
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    // Buy buttons (delegated)
    document.getElementById('productGrid').addEventListener('click', e => {
        const btn = e.target.closest('[data-product-id]');
        if (btn) openModal(btn.dataset.productId);
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
    document.querySelector('[data-modal-close]').addEventListener('click', closeModal);
    document.querySelector('[data-modal-backdrop]').addEventListener('click', closeModal);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
    document.getElementById('btnWhatsapp').addEventListener('click', handleWhatsapp);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !document.getElementById('orderModal').hidden) closeModal();
    });
}

// ── Init ─────────────────────────────────────────────────────────────────────
renderProducts();
renderFAQs();
setupEvents();