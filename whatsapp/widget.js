/**
 * Clari5 WhatsApp Alert Widget  —  v1.0
 * Self-contained. Zero external dependencies.
 * Loaded by the demo HTML from http://localhost:3001/widget.js
 *
 * Architecture:
 *   - Injects a fixed FAB (bottom-right) into the outer demo shell
 *   - Opens a slide-in drawer for contact selection, message preset, preview
 *   - POSTs to the local proxy which calls Twilio
 */
(function (global) {
  'use strict';

  // HTTPS pages (Vercel) use their own /api routes to avoid mixed-content blocks.
  // HTTP pages (local demo) use the Flask proxy on server 4.
  var PROXY = (typeof window !== 'undefined' && window.location.protocol === 'https:')
    ? '/api'
    : 'http://192.168.5.219:3001';
  var LS_KEY = 'clari5_wa_v1';

  var DEFAULT_CONTACTS = [
    { id: 'c1', label: 'Demo Phone (You)',  number: '' },
    { id: 'c2', label: 'Prospect',          number: '' },
    { id: 'c3', label: 'Colleague',         number: '' },
  ];

  var ACTION_MENU = [
    '',
    '*Reply to act:*',
    '1️⃣ ESCALATE to investigation team',
    '2️⃣ FREEZE account',
    '3️⃣ APPROVE transaction',
    '4️⃣ HOLD for 4-hour review',
    '5️⃣ Request INFO',
  ].join('\n');

  var PRESETS = [
    {
      id: 'm1',
      label: '🚨 BEC Critical Alert',
      tag: 'FBN-ML-2291',
      text: [
        '🚨 *CRITICAL ALERT — First Bank of Nigeria*',
        '',
        'Business Email Compromise (BEC) detected:',
        '📋 *Case:* FBN-ML-2291',
        '🏢 *Entity:* Prestige Foods Ltd',
        '💰 *At Risk:* ₦47.2M outward wire',
        '📊 *RTSE Score:* 0.97 / 1.00  ←  Out-of-pattern',
        ACTION_MENU,
        '_— Clari5 EFRM Platform, First Bank of Nigeria_',
      ].join('\n'),
    },
    {
      id: 'm2',
      label: '⚠️ ATO High Priority',
      tag: 'FBN-TM-0047',
      text: [
        '⚠️ *HIGH PRIORITY — Account Takeover Detected*',
        '',
        '📋 *Case:* FBN-TM-0047',
        '👤 *Account:* Adaeze Okafor (Retail)',
        '📱 *Trigger:* New device (Device-X9)',
        '💸 *Attempted transfer:* ₦8.5M outward',
        '🔐 *ATO confidence:* 94%',
        '',
        ACTION_MENU,
        '_— Clari5 EFRM Platform_',
      ].join('\n'),
    },
    {
      id: 'm3',
      label: '📊 FRAML Executive Brief',
      tag: 'BOARD',
      text: [
        '📊 *FBN FRAML INTELLIGENCE BRIEF*',
        '*June 18, 2026  ·  MTD Summary*',
        '',
        '🔴 Open FRAML Alerts: *4,817*  (↑12% MoM)',
        '💰 Fraud Loss Exposure: *₦3.8B* MTD',
        '📄 STRs Filed: *143*  |  Pending NFIU: *87*',
        '⚡ CEO decisions required: *3*',
        ACTION_MENU,
        '_Full dashboard: Clari5 EFRM Platform._',
      ].join('\n'),
    },
  ];

  // ── CSS ────────────────────────────────────────────────────────────────────
  var CSS = [
    '#cwa-fab{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;',
    'background:#25D366;box-shadow:0 4px 18px rgba(37,211,102,.45),0 2px 6px rgba(0,0,0,.2);',
    'cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:99999;',
    'border:none;transition:transform .2s,box-shadow .2s;outline:none;padding:0}',
    '#cwa-fab:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(37,211,102,.55),0 3px 8px rgba(0,0,0,.25)}',
    '#cwa-fab:active{transform:scale(.96)}',
    '#cwa-badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;background:#DC2626;',
    'border-radius:50%;border:2px solid #0D1B2A;font-size:10px;font-weight:700;color:#fff;',
    'display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;pointer-events:none}',
    '#cwa-overlay{position:fixed;inset:0;background:rgba(0,0,0,.38);z-index:99998;',
    'opacity:0;pointer-events:none;transition:opacity .25s}',
    '#cwa-overlay.cwa-open{opacity:1;pointer-events:all}',
    '#cwa-drawer{position:fixed;top:0;right:0;bottom:0;width:400px;background:#fff;z-index:99999;',
    'box-shadow:-4px 0 28px rgba(0,0,0,.18);display:flex;flex-direction:column;',
    'transform:translateX(100%);transition:transform .28s cubic-bezier(.32,0,.67,0);',
    "font-family:'Inter',system-ui,sans-serif;font-size:13px}",
    '#cwa-drawer.cwa-open{transform:translateX(0);transition:transform .28s cubic-bezier(.33,1,.68,1)}',
    '.cwa-hdr{background:#075E54;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}',
    '.cwa-hdr-ic{width:38px;height:38px;background:rgba(255,255,255,.14);border-radius:50%;',
    'display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '.cwa-hdr-t{flex:1}.cwa-hdr-t b{font-size:15px;font-weight:600;color:#fff;display:block}',
    '.cwa-hdr-t span{font-size:11px;color:rgba(255,255,255,.6)}',
    '.cwa-close{background:none;border:none;color:rgba(255,255,255,.65);font-size:22px;',
    'cursor:pointer;padding:4px;line-height:1;transition:color .15s}',
    '.cwa-close:hover{color:#fff}',
    '.cwa-sbar{background:#F0F4F8;padding:7px 18px;display:flex;align-items:center;gap:7px;',
    'border-bottom:1px solid #E2E8F0;flex-shrink:0}',
    '.cwa-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;transition:background .3s}',
    '.cwa-dot.on{background:#25D366;box-shadow:0 0 7px rgba(37,211,102,.65)}',
    '.cwa-dot.off{background:#DC2626}.cwa-dot.chk{background:#D97706;animation:cwa-pulse 1s infinite}',
    '@keyframes cwa-pulse{0%,100%{opacity:1}50%{opacity:.35}}',
    '.cwa-sbar-txt{font-size:11px;color:#64748B;flex:1}',
    '.cwa-rechk{margin-left:auto;background:none;border:1px solid #CBD5E1;border-radius:4px;',
    'padding:2px 8px;font-size:10px;color:#64748B;cursor:pointer;transition:border-color .15s}',
    '.cwa-rechk:hover{border-color:#25D366;color:#059669}',
    '.cwa-body{flex:1;overflow-y:auto;padding:14px 18px}',
    '.cwa-body::-webkit-scrollbar{width:4px}',
    '.cwa-body::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}',
    '.cwa-lbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;',
    'color:#94A3B8;margin:0 0 7px}',
    '.cwa-sec{margin-bottom:16px}',
    '.cwa-clist{display:flex;flex-direction:column;gap:5px}',
    '.cwa-ci{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:8px;',
    'border:1.5px solid #E2E8F0;cursor:pointer;transition:border-color .15s,background .15s}',
    '.cwa-ci.sel{border-color:#25D366;background:rgba(37,211,102,.04)}',
    '.cwa-ci:hover:not(.sel){background:#F8FAFC}',
    '.cwa-rd{width:15px;height:15px;border-radius:50%;border:2px solid #CBD5E1;flex-shrink:0;',
    'display:flex;align-items:center;justify-content:center;transition:border-color .15s}',
    '.cwa-ci.sel .cwa-rd{border-color:#25D366}',
    '.cwa-rdi{width:7px;height:7px;border-radius:50%;background:#25D366;',
    'transform:scale(0);transition:transform .15s}',
    '.cwa-ci.sel .cwa-rdi{transform:scale(1)}',
    '.cwa-av{width:31px;height:31px;border-radius:50%;background:#E2E8F0;',
    'display:flex;align-items:center;justify-content:center;font-size:12px;',
    'font-weight:600;color:#475569;flex-shrink:0}',
    '.cwa-cn{flex:1;min-width:0}',
    '.cwa-cname{font-size:12px;font-weight:500;color:#1E293B}',
    '.cwa-cnum{font-size:11px;color:#94A3B8;font-family:monospace}',
    '.cwa-cnum.empty{font-style:italic}',
    '.cwa-edit{background:none;border:none;cursor:pointer;padding:2px 4px;color:#94A3B8;',
    'font-size:13px;transition:color .15s;flex-shrink:0}',
    '.cwa-edit:hover{color:#25D366}',
    '.cwa-edit-wrap{background:#F0FFF4;border:1px solid #86EFAC;border-radius:7px;',
    'padding:7px 10px;display:flex;gap:6px;align-items:center;margin-top:4px}',
    '.cwa-ninput{flex:1;border:none;background:transparent;font-size:13px;',
    'font-family:monospace;color:#1E293B;outline:none}',
    '.cwa-ninput::placeholder{color:#94A3B8;font-family:system-ui}',
    '.cwa-nsave{background:#25D366;color:#fff;border:none;border-radius:5px;',
    'padding:4px 10px;font-size:11px;cursor:pointer;font-weight:500;white-space:nowrap}',
    '.cwa-custw{margin-top:5px}',
    '.cwa-custnum{width:100%;padding:8px 11px;border:1.5px solid #E2E8F0;border-radius:8px;',
    'font-size:13px;font-family:monospace;color:#1E293B;outline:none;',
    'box-sizing:border-box;transition:border-color .15s}',
    '.cwa-custnum:focus{border-color:#25D366}',
    '.cwa-mlist{display:flex;flex-direction:column;gap:5px}',
    '.cwa-mi{padding:9px 11px;border-radius:8px;border:1.5px solid #E2E8F0;',
    'cursor:pointer;transition:border-color .15s,background .15s}',
    '.cwa-mi.sel{border-color:#25D366;background:rgba(37,211,102,.04)}',
    '.cwa-mi:hover:not(.sel){background:#F8FAFC}',
    '.cwa-mh{display:flex;align-items:center;gap:7px}',
    '.cwa-mrd{width:13px;height:13px;border-radius:50%;border:2px solid #CBD5E1;flex-shrink:0;',
    'display:flex;align-items:center;justify-content:center;transition:border-color .15s}',
    '.cwa-mi.sel .cwa-mrd{border-color:#25D366}',
    '.cwa-mrdi{width:5px;height:5px;border-radius:50%;background:#25D366;',
    'transform:scale(0);transition:transform .15s}',
    '.cwa-mi.sel .cwa-mrdi{transform:scale(1)}',
    '.cwa-mlbl{font-size:12px;font-weight:500;color:#1E293B;flex:1}',
    '.cwa-mtag{font-size:9px;padding:2px 6px;border-radius:3px;background:#F1F5F9;',
    'color:#64748B;font-family:monospace;flex-shrink:0}',
    '.cwa-mprev{font-size:11px;color:#94A3B8;margin-top:3px;',
    'overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.cwa-custarea{width:100%;margin-top:5px;padding:8px 11px;border:1.5px solid #E2E8F0;',
    'border-radius:8px;font-size:12px;font-family:system-ui;color:#1E293B;',
    'resize:vertical;min-height:75px;outline:none;box-sizing:border-box;',
    'transition:border-color .15s}',
    '.cwa-custarea:focus{border-color:#25D366}',
    '.cwa-bubble{background:#DCF8C6;border-radius:0 8px 8px 8px;padding:9px 12px;',
    'font-size:11.5px;color:#1E293B;white-space:pre-wrap;line-height:1.55;',
    'max-height:110px;overflow-y:auto;border:1px solid #B7E4A0;word-break:break-word}',
    '.cwa-foot{padding:13px 18px;border-top:1px solid #E2E8F0;flex-shrink:0}',
    '.cwa-warn{text-align:center;font-size:11px;color:#DC2626;margin-bottom:9px}',
    '.cwa-warn code{font-size:11px}',
    '.cwa-sendbtn{width:100%;padding:12px;background:#25D366;color:#fff;border:none;',
    'border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;gap:8px;',
    'transition:background .15s,transform .1s;font-family:system-ui}',
    '.cwa-sendbtn:hover:not(:disabled){background:#20BD5C}',
    '.cwa-sendbtn:active:not(:disabled){transform:scale(.98)}',
    '.cwa-sendbtn:disabled{background:#94A3B8;cursor:not-allowed}',
    '.cwa-sendbtn.err{background:#DC2626}',
    '.cwa-spin{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.35);',
    'border-top-color:#fff;animation:cwa-spin .7s linear infinite}',
    '@keyframes cwa-spin{to{transform:rotate(360deg)}}',
    '.cwa-toast{position:fixed;bottom:100px;right:28px;background:#1E293B;color:#fff;',
    'padding:10px 15px;border-radius:8px;font-size:12px;font-family:system-ui;z-index:999999;',
    'transform:translateY(16px);opacity:0;transition:all .25s;max-width:270px;',
    'box-shadow:0 4px 14px rgba(0,0,0,.28)}',
    '.cwa-toast.show{transform:translateY(0);opacity:1}',
    '.cwa-toast.ok{border-left:3px solid #25D366}.cwa-toast.err{border-left:3px solid #DC2626}',
    '.cwa-succ{position:absolute;inset:0;background:#075E54;display:flex;flex-direction:column;',
    'align-items:center;justify-content:center;gap:10px;z-index:10;',
    'opacity:0;pointer-events:none;transition:opacity .3s}',
    '.cwa-succ.show{opacity:1;pointer-events:all}',
    '.cwa-schk{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.15);',
    'display:flex;align-items:center;justify-content:center;font-size:38px}',
    '.cwa-stitle{font-size:18px;font-weight:600;color:#fff}',
    '.cwa-ssub{font-size:12px;color:rgba(255,255,255,.7);text-align:center;',
    'padding:0 28px;line-height:1.5}',
    '.cwa-dsteps{display:flex;gap:20px;margin-top:6px}',
    '.cwa-ds{display:flex;flex-direction:column;align-items:center;gap:4px}',
    '.cwa-dsic{font-size:22px}.cwa-dslbl{font-size:9px;color:rgba(255,255,255,.55);',
    'text-transform:uppercase;letter-spacing:.5px}',
    '.cwa-dsval{font-size:12px;font-weight:600}',
    '.cwa-dsval.done{color:#25D366}.cwa-dsval.wait{color:rgba(255,255,255,.3)}',
    '.cwa-newbtn{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.3);',
    'border-radius:8px;padding:10px 24px;font-size:13px;cursor:pointer;',
    'margin-top:6px;transition:background .15s;font-family:system-ui}',
    '.cwa-newbtn:hover{background:rgba(255,255,255,.24)}',
    // ── Sent toast (slides in at top of drawer body) ──
    '.cwa-sent-toast{position:absolute;left:0;right:0;top:0;z-index:10;',
    'background:#059669;color:#fff;padding:9px 18px;',
    'display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:500;',
    'transform:translateY(-100%);transition:transform .22s cubic-bezier(.32,0,.67,0);pointer-events:none}',
    '.cwa-sent-toast.show{transform:translateY(0);transition:transform .22s cubic-bezier(.33,1,.68,1)}',
    '.cwa-sent-ic{font-size:15px}',
    // ── Activity log ──
    '.cwa-log-wrap{margin-top:16px}',
    '.cwa-log-hdr{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;',
    'color:#94A3B8;margin-bottom:8px;display:flex;align-items:center;gap:6px}',
    '.cwa-log-hdr-line{flex:1;height:1px;background:#E2E8F0}',
    '.cwa-log-entry{display:flex;align-items:flex-start;gap:9px;padding:7px 0;',
    'border-bottom:1px solid #F8FAFC;animation:cwa-ein .3s ease}',
    '.cwa-log-entry:last-child{border-bottom:none}',
    '@keyframes cwa-ein{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}',
    '.cwa-log-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}',
    '.cwa-log-dot.sent{background:#00A99D}.cwa-log-dot.waiting{background:#D97706;',
    'animation:cwa-pulse 1.2s infinite}.cwa-log-dot.escalate{background:#DC2626}',
    '.cwa-log-dot.freeze{background:#1D4ED8}.cwa-log-dot.approve{background:#059669}',
    '.cwa-log-dot.hold{background:#D97706}.cwa-log-dot.info{background:#7C3AED}',
    '.cwa-log-dot.reply{background:#475569}',
    '.cwa-log-right{flex:1;min-width:0}',
    '.cwa-log-line{font-size:11.5px;color:#1E293B;line-height:1.4}',
    '.cwa-log-time{font-size:10px;color:#94A3B8;font-family:monospace;margin-top:1px}',
    '.cwa-log-badge{display:inline-block;font-size:9px;font-weight:700;padding:1px 6px;',
    'border-radius:3px;text-transform:uppercase;letter-spacing:.4px;margin-right:5px}',
    '.cwa-log-badge.escalate{background:#FEE2E2;color:#DC2626}',
    '.cwa-log-badge.freeze{background:#DBEAFE;color:#1D4ED8}',
    '.cwa-log-badge.approve{background:#D1FAE5;color:#059669}',
    '.cwa-log-badge.hold{background:#FEF3C7;color:#D97706}',
    '.cwa-log-badge.info{background:#EDE9FE;color:#7C3AED}',
    // ── Send button sent state ──
    '.cwa-sendbtn.sent-flash{background:#059669;border-color:#059669}',
  ].join('');

  // ── WhatsApp SVG icon ──────────────────────────────────────────────────────
  function waIcon(sz) {
    return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M24 4C13 4 4 13 4 24c0 3.6.97 7 2.66 9.9L4 44l10.38-2.62A20 20 0 0024 44c11 0 20-9 20-20S35 4 24 4z" fill="white" opacity=".95"/>'
      + '<path d="M34.5 29.1c-.5-.3-3-1.5-3.5-1.6-.5-.2-.8-.3-1.1.2-.3.5-1.2 1.6-1.5 1.9-.3.3-.5.3-1 .1-2.7-1.4-4.5-2.4-6.3-5.5-.5-.8.5-.8 1.4-2.4.2-.3.1-.6-.1-.8-.2-.2-1.1-2.7-1.5-3.7-.4-.9-.8-.8-1.1-.8h-1c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.8s1.7 4.4 1.9 4.7c.2.3 3.3 5.1 8 7.1 3 1.2 4.1 1.3 5.6 1.1.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.2-.2-.5-.4-1-.6z" fill="#075E54"/>'
      + '</svg>';
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Widget class ───────────────────────────────────────────────────────────
  function Widget() {
    this.contacts = this._load();
    this.state = {
      open: false, online: false, editing: -1, editVal: '',
      selContact: 0, custNum: '',
      selMsg: 0, custMsg: '',
      status: 'idle',        // idle | sending | error
      btnSent: false,        // brief green flash on send button
      waitingReply: false,
      pollTs: 0,
    };
    this._pollTimer  = null;
    this._btnTimer   = null;
    this._toastTimer = null;
    this.log = [];           // activity log — persists across renders
    this._boot();
  }

  Widget.prototype._load = function () {
    try { var s = localStorage.getItem(LS_KEY); if (s) return JSON.parse(s); } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_CONTACTS));
  };

  Widget.prototype._save = function () {
    try { localStorage.setItem(LS_KEY, JSON.stringify(this.contacts)); } catch(e) {}
  };

  Widget.prototype._boot = function () {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    this.overlay = document.createElement('div');
    this.overlay.id = 'cwa-overlay';
    document.body.appendChild(this.overlay);

    this.drawer = document.createElement('div');
    this.drawer.id = 'cwa-drawer';
    document.body.appendChild(this.drawer);

    this.fab = document.createElement('button');
    this.fab.id = 'cwa-fab';
    this.fab.title = 'Send WhatsApp Alert';
    this.fab.innerHTML = waIcon(26) + '<span id="cwa-badge">!</span>';
    document.body.appendChild(this.fab);

    this.toast = document.createElement('div');
    this.toast.className = 'cwa-toast';
    document.body.appendChild(this.toast);

    // Sent toast lives inside the drawer (position:absolute relative to drawer)
    this.sentToast = document.createElement('div');
    this.sentToast.className = 'cwa-sent-toast';
    this.sentToast.innerHTML = '<span class="cwa-sent-ic">✓</span><span class="cwa-sent-msg"></span>';
    this.drawer.appendChild(this.sentToast);

    var self = this;
    this.fab.addEventListener('click', function () { self._set({ open: true }); });
    this.overlay.addEventListener('click', function () { self._close(); });

    this._checkServer();
    setInterval(function () { self._checkServer(); }, 30000);
    this._render();
  };

  Widget.prototype._set = function (patch) {
    for (var k in patch) this.state[k] = patch[k];
    this._render();
  };

  Widget.prototype._close = function () {
    this._stopPolling();
    this._set({ open: false, status: 'idle', editing: -1, waitingReply: false, pollTs: 0 });
  };

  Widget.prototype._startPolling = function () {
    this._stopPolling();
    var self = this;
    var ts   = Date.now() / 1000;
    this._set({ waitingReply: true, reply: null, pollTs: ts });
    this._pollTimer = setInterval(function () {
      fetch(PROXY + '/replies?since=' + self.state.pollTs)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var replies = (data && data.replies) || [];
          if (replies.length > 0) {
            self._stopPolling();
            self._set({ waitingReply: false });
            replies.forEach(function (r) {
              var badge  = r.action ? r.action.toLowerCase() : 'reply';
              var label  = r.label  || r.body;
              self._addLog(badge, label, badge);
            });
          }
        })
        .catch(function () { /* ignore poll errors silently */ });
    }, 3000);
    // Auto-stop polling after 10 minutes
    setTimeout(function () { self._stopPolling(); self._set({ waitingReply: false }); }, 600000);
  };

  Widget.prototype._stopPolling = function () {
    if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null; }
  };

  Widget.prototype._addLog = function (type, text, badge) {
    var now = new Date();
    var hh  = String(now.getHours()).padStart(2, '0');
    var mm  = String(now.getMinutes()).padStart(2, '0');
    var ss  = String(now.getSeconds()).padStart(2, '0');
    this.log.push({ type: type, text: text, badge: badge || null, time: hh + ':' + mm + ':' + ss });
    this._render();
  };

  Widget.prototype._showToast = function (msg) {
    var self  = this;
    var toast = this.sentToast;
    toast.querySelector('.cwa-sent-msg').textContent = msg;
    toast.classList.add('show');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  };

  Widget.prototype._checkServer = function () {
    var self = this;
    fetch(PROXY + '/health', { signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined })
      .then(function (r) { self._set({ online: r.ok }); })
      .catch(function () { self._set({ online: false }); });
  };

  Widget.prototype._currentMsg = function () {
    if (this.state.selMsg < PRESETS.length) return PRESETS[this.state.selMsg].text;
    return this.state.custMsg;
  };

  Widget.prototype._currentTo = function () {
    if (this.state.selContact < this.contacts.length) return this.contacts[this.state.selContact].number;
    return this.state.custNum;
  };

  Widget.prototype._send = function () {
    var to = this._currentTo();
    var msg = this._currentMsg();
    if (!to)  { this._toast('Enter a phone number first', 'err'); return; }
    if (!msg) { this._toast('Select or write a message', 'err'); return; }
    if (!this.state.online) { this._toast('Proxy offline — run start.bat', 'err'); return; }

    var self = this;
    this._set({ status: 'sending' });

    fetch(PROXY + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to, message: msg }),
    })
    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
    .then(function (res) {
      if (res.ok && res.d.success) {
        var sendTs = Date.now() / 1000;
        self._set({ status: 'idle', btnSent: true, waitingReply: true, pollTs: sendTs });
        self._showToast('Alert sent to ' + self._currentTo());
        self._addLog('sent', 'Alert sent to ' + self._currentTo());
        self._addLog('waiting', 'Waiting for reply on WhatsApp…');
        if (self._btnTimer) clearTimeout(self._btnTimer);
        self._btnTimer = setTimeout(function () { self._set({ btnSent: false }); }, 2500);
        self._startPolling();
      } else {
        var err = (res.d && res.d.error) || 'Send failed';
        self._set({ status: 'error' });
        self._toast(err, 'err');
      }
    })
    .catch(function (e) {
      self._set({ status: 'error' });
      self._toast('Network error — check proxy server', 'err');
    });
  };

  Widget.prototype._toast = function (msg, type) {
    var t = this.toast;
    t.textContent = msg;
    t.className = 'cwa-toast ' + (type || 'ok') + ' show';
    setTimeout(function () { t.classList.remove('show'); }, 3600);
  };

  Widget.prototype._render = function () {
    var s = this.state;
    var contacts = this.contacts;

    // Toggle overlay + drawer
    this.overlay.classList.toggle('cwa-open', s.open);
    this.drawer.classList.toggle('cwa-open', s.open);
    if (!s.open) { this.drawer.innerHTML = ''; return; }

    var to = this._currentTo() || 'recipient';
    var previewMsg = this._currentMsg() || '— select a message above —';

    // Build contact rows
    var contactsHtml = contacts.map(function (c, i) {
      var isSel = s.selContact === i;
      var isEditing = s.editing === i;
      var numDisp = c.number ? esc(c.number) : '<em>tap ✏️ to set number</em>';
      var editRow = isEditing
        ? '<div class="cwa-edit-wrap">'
          + '<input id="cwa-ni" class="cwa-ninput" placeholder="+234 xxx xxxx xxx" value="' + esc(s.editVal) + '">'
          + '<button class="cwa-nsave" data-save="' + i + '">Save</button>'
          + '</div>'
        : '';
      return '<div class="cwa-ci' + (isSel ? ' sel' : '') + '" data-ci="' + i + '">'
        + '<div class="cwa-rd"><div class="cwa-rdi"></div></div>'
        + '<div class="cwa-av">' + esc(c.label.charAt(0).toUpperCase()) + '</div>'
        + '<div class="cwa-cn">'
        + '<div class="cwa-cname">' + esc(c.label) + '</div>'
        + '<div class="cwa-cnum' + (!c.number ? ' empty' : '') + '">' + numDisp + '</div>'
        + '</div>'
        + '<button class="cwa-edit" data-edit="' + i + '" title="Edit number">✏️</button>'
        + '</div>' + editRow;
    }).join('');

    // Custom number option
    var custSel = s.selContact === contacts.length;
    contactsHtml += '<div class="cwa-ci' + (custSel ? ' sel' : '') + '" data-ci="' + contacts.length + '">'
      + '<div class="cwa-rd"><div class="cwa-rdi"></div></div>'
      + '<div class="cwa-av" style="background:#E0F2FE;color:#0369A1">+</div>'
      + '<div class="cwa-cn"><div class="cwa-cname">Custom number</div>'
      + '<div class="cwa-cnum empty">type any number</div></div>'
      + '</div>'
      + (custSel ? '<div class="cwa-custw"><input id="cwa-custnum" class="cwa-custnum" placeholder="+234 xxx xxxx xxx (with country code)" value="' + esc(s.custNum) + '"></div>' : '');

    // Build message rows
    var msgsHtml = PRESETS.map(function (p, i) {
      var isSel = s.selMsg === i;
      var firstLine = p.text.split('\n')[0].replace(/\*/g, '');
      return '<div class="cwa-mi' + (isSel ? ' sel' : '') + '" data-mi="' + i + '">'
        + '<div class="cwa-mh"><div class="cwa-mrd"><div class="cwa-mrdi"></div></div>'
        + '<span class="cwa-mlbl">' + esc(p.label) + '</span>'
        + '<span class="cwa-mtag">' + esc(p.tag) + '</span></div>'
        + '<div class="cwa-mprev">' + esc(firstLine) + '</div>'
        + '</div>';
    }).join('');

    var custMsgSel = s.selMsg === PRESETS.length;
    msgsHtml += '<div class="cwa-mi' + (custMsgSel ? ' sel' : '') + '" data-mi="' + PRESETS.length + '">'
      + '<div class="cwa-mh"><div class="cwa-mrd"><div class="cwa-mrdi"></div></div>'
      + '<span class="cwa-mlbl">✏️ Custom message</span></div>'
      + '</div>'
      + (custMsgSel ? '<textarea id="cwa-custmsg" class="cwa-custarea" placeholder="Type your custom WhatsApp alert...">' + esc(s.custMsg) + '</textarea>' : '');

    // Send button
    var btnClass    = 'cwa-sendbtn' + (s.status === 'error' ? ' err' : '') + (s.btnSent ? ' sent-flash' : '');
    var btnDisabled = (s.status === 'sending' || !s.online) ? 'disabled' : '';
    var btnContent  = s.status === 'sending'
      ? '<div class="cwa-spin"></div> Sending…'
      : (s.btnSent ? '✓ Sent' : waIcon(17) + ' Send via WhatsApp');

    this.drawer.innerHTML = ''
      // Header
      + '<div class="cwa-hdr">'
      + '<div class="cwa-hdr-ic">' + waIcon(22) + '</div>'
      + '<div class="cwa-hdr-t"><b>Send WhatsApp Alert</b><span>Clari5 EFRM &nbsp;·&nbsp; First Bank of Nigeria</span></div>'
      + '<button class="cwa-close" id="cwa-x">&times;</button>'
      + '</div>'
      // Status bar
      + '<div class="cwa-sbar">'
      + '<div class="cwa-dot ' + (s.online ? 'on' : 'off') + '"></div>'
      + '<span class="cwa-sbar-txt">' + (s.online ? 'Proxy connected — ready to send' : 'Proxy offline — run start.bat') + '</span>'
      + '<button class="cwa-rechk" id="cwa-rc">Recheck</button>'
      + '</div>'
      // Body
      + '<div class="cwa-body">'
      // Send To
      + '<div class="cwa-sec"><div class="cwa-lbl">Send to</div>'
      + '<div class="cwa-clist">' + contactsHtml + '</div></div>'
      // Message
      + '<div class="cwa-sec"><div class="cwa-lbl">Alert message</div>'
      + '<div class="cwa-mlist">' + msgsHtml + '</div></div>'
      // Preview
      + '<div class="cwa-sec"><div class="cwa-lbl">Preview</div>'
      + '<div class="cwa-bubble">' + esc(previewMsg) + '</div></div>'
      // Activity log
      + (this.log.length > 0
          ? '<div class="cwa-log-wrap">'
            + '<div class="cwa-log-hdr"><span>Activity</span><span class="cwa-log-hdr-line"></span></div>'
            + this.log.map(function (e) {
                var badge = e.badge
                  ? '<span class="cwa-log-badge ' + e.badge + '">' + e.badge.toUpperCase() + '</span>'
                  : '';
                var dotCls = e.type === 'waiting'
                  ? 'cwa-log-dot waiting'
                  : 'cwa-log-dot ' + (e.badge || e.type);
                return '<div class="cwa-log-entry">'
                  + '<div class="' + dotCls + '"></div>'
                  + '<div class="cwa-log-right">'
                  + '<div class="cwa-log-line">' + badge + esc(e.text) + '</div>'
                  + '<div class="cwa-log-time">' + e.time + '</div>'
                  + '</div></div>';
              }).join('')
            + '<div style="text-align:right;margin-top:6px">'
            + '<button id="cwa-clrlog" style="background:none;border:none;font-size:10px;color:#CBD5E1;cursor:pointer;padding:0">Clear log</button>'
            + '</div>'
            + '</div>'
          : '')
      + '</div>'
      // Footer
      + '<div class="cwa-foot">'
      + (!s.online ? '<div class="cwa-warn">⚠️ Start <code>whatsapp/server.py</code> to enable live delivery</div>' : '')
      + '<button id="cwa-send" class="' + btnClass + '" ' + btnDisabled + '>' + btnContent + '</button>'
      + '</div>';

    // Re-attach sentToast (drawer.innerHTML wipes it)
    this.drawer.appendChild(this.sentToast);
    this._bind();
  };

  Widget.prototype._bind = function () {
    var self = this;
    var d = this.drawer;

    function on(id, ev, fn) { var el = d.querySelector('#' + id); if (el) el.addEventListener(ev, fn); }
    function all(sel, ev, fn) { d.querySelectorAll(sel).forEach(function(el) { el.addEventListener(ev, fn); }); }

    on('cwa-x',    'click', function () { self._close(); });
    on('cwa-send', 'click', function () { self._send(); });
    on('cwa-clrlog', 'click', function () {
      self._stopPolling();
      self.log = [];
      self._set({ status: 'idle', btnSent: false, waitingReply: false, pollTs: 0 });
    });
    on('cwa-rc',   'click', function () {
      self._set({ online: false });
      var dot = d.querySelector('.cwa-dot');
      if (dot) { dot.className = 'cwa-dot chk'; }
      self._checkServer();
    });

    // Contact rows
    all('[data-ci]', 'click', function (e) {
      if (e.target.closest('[data-edit]')) return;
      var idx = parseInt(this.getAttribute('data-ci'));
      self._set({ selContact: idx, editing: -1 });
    });

    // Edit buttons
    all('[data-edit]', 'click', function (e) {
      e.stopPropagation();
      var idx = parseInt(this.getAttribute('data-edit'));
      var next = self.state.editing === idx ? -1 : idx;
      self._set({ editing: next, editVal: self.contacts[idx].number || '' });
    });

    // Save button
    all('[data-save]', 'click', function (e) {
      e.stopPropagation();
      var idx = parseInt(this.getAttribute('data-save'));
      var inp = d.querySelector('#cwa-ni');
      if (inp) {
        self.contacts[idx].number = inp.value.trim();
        self._save();
        self._set({ editing: -1, selContact: idx });
      }
    });

    // Edit input live
    on('cwa-ni', 'input', function () { self.state.editVal = this.value; });

    // Custom number
    on('cwa-custnum', 'input', function () {
      self.state.custNum = this.value;
      var prev = d.querySelector('.cwa-bubble');
      if (prev && !prev.closest('.cwa-succ')) { /* preview unchanged */ }
    });

    // Message rows
    all('[data-mi]', 'click', function () {
      self._set({ selMsg: parseInt(this.getAttribute('data-mi')) });
    });

    // Custom message textarea
    on('cwa-custmsg', 'input', function () {
      self.state.custMsg = this.value;
      var bub = d.querySelector('.cwa-bubble');
      if (bub) bub.textContent = this.value || '— type your message above —';
    });

    // Auto-focus edit input
    var ni = d.querySelector('#cwa-ni');
    if (ni) { ni.focus(); ni.select(); }
  };

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('cwa-fab')) return; // already mounted
    new Widget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}(window));
