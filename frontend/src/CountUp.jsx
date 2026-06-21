@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

/* Prevent legacy scaffold branding from obscuring product controls. */
#emergent-badge,
a[href*="app.emergent.sh"] {
    display: none !important;
}

:root {
    /* BEDROCK palette — refined, Linear/Vercel-grade */
    --bg: #08080A;
    --bg-2: #0B0B0F;
    --surface: rgba(20, 20, 26, 0.55);
    --surface-solid: #12121A;
    --surface-2: rgba(28, 28, 36, 0.50);
    --surface-3: rgba(34, 34, 44, 0.65);
    --border: rgba(255, 255, 255, 0.06);
    --border-strong: rgba(255, 255, 255, 0.10);
    --border-soft: rgba(255, 255, 255, 0.04);
    --gold: #F0B90B;
    --gold-bright: #FCD535;
    --gold-soft: #FFE074;
    --gold-dim: #9C7A0A;
    --gold-glow: rgba(240, 185, 11, 0.18);
    --text: #F4F4F6;
    --text-muted: #8A8A95;
    --text-faint: #54545E;
    --green: #14CC8C;
    --red: #F6465D;
    --amber: #FAB23E;
    --chassis-black: #090b0e;
    --panel-slate: #13171e;
    --titanium-seam: rgba(255, 255, 255, 0.06);
    --tactical-amber: #f59e0b;
    --aviation-orange: #f97316;
    --text-dim: #64748b;
    --bybit-yellow: #f7a600;
    --bybit-yellow-bright: #ffb800;
    --bybit-panel: #121214;
    --bybit-panel-hover: #1c1c20;

    --background: 240 8% 4%;
    --foreground: 240 5% 96%;
    --card: 240 12% 8%;
    --card-foreground: 240 5% 96%;
    --popover: 240 12% 8%;
    --popover-foreground: 240 5% 96%;
    --primary: 45 94% 49%;
    --primary-foreground: 240 10% 4%;
    --secondary: 240 6% 14%;
    --secondary-foreground: 240 5% 96%;
    --muted: 240 6% 14%;
    --muted-foreground: 240 4% 58%;
    --accent: 45 94% 49%;
    --accent-foreground: 240 10% 4%;
    --destructive: 350 92% 62%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 7% 14%;
    --input: 240 7% 14%;
    --ring: 45 94% 49%;
    --radius: 1rem;
}

.tp-codex * {
    border-color: var(--border);
}

.tp-codex {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Manrope', system-ui, sans-serif;
    overflow-x: hidden;
}

.tp-codex {
    background:
        radial-gradient(800px 500px at 100% -10%, rgba(240,185,11,0.07), transparent 55%),
        radial-gradient(700px 500px at -10% 60%, rgba(240,185,11,0.035), transparent 60%),
        radial-gradient(600px 400px at 50% 110%, rgba(150, 110, 0, 0.04), transparent 55%),
        var(--bg);
}

/* Soften grain overlay */
.tp-codex::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.035 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.6;
    mix-blend-mode: overlay;
}

.font-display { font-family: 'Sora', sans-serif; letter-spacing: -0.025em; }
.font-body { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
.font-mono { font-family: 'Bahnschrift', 'Arial Narrow', Arial, sans-serif; font-variant-numeric: tabular-nums; letter-spacing: 0; }
.font-oswald { font-family: 'Oswald', 'Arial Narrow', Arial, sans-serif; letter-spacing: 0; }

::selection { background: var(--gold); color: #000; }

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--surface-3); }

/* Reusable utilities — Glass cards with gradient hairline borders (Linear/Vercel-grade) */
.bedrock-card {
    position: relative;
    background:
        linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%),
        rgba(18, 18, 24, 0.55);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border-radius: 18px;
    transition: transform 0.25s cubic-bezier(0.2,0.7,0.2,1), background 0.2s ease;
    isolation: isolate;
}
/* Gradient hairline border via mask trick */
.bedrock-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(160deg,
        rgba(255,255,255,0.10) 0%,
        rgba(255,255,255,0.04) 30%,
        rgba(255,255,255,0.01) 60%,
        rgba(255,255,255,0.06) 100%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
}
.bedrock-card:hover {
    background:
        linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.005) 100%),
        rgba(22, 22, 28, 0.65);
}

.bedrock-card-elev {
    position: relative;
    background:
        linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%),
        rgba(24, 24, 30, 0.7);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border-radius: 14px;
    isolation: isolate;
}
.bedrock-card-elev::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.04) 100%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
}

/* Active state with gold gradient glow */
.bedrock-card-active::before {
    background: linear-gradient(160deg,
        rgba(252,213,53,0.55) 0%,
        rgba(240,185,11,0.18) 35%,
        rgba(240,185,11,0.05) 70%,
        rgba(252,213,53,0.30) 100%);
}
.bedrock-card-active {
    box-shadow: 0 0 0 0 transparent, 0 18px 50px -20px rgba(240,185,11,0.35);
}

.gold-btn {
    background:
        radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.30), transparent 55%),
        linear-gradient(180deg, #FFE074 0%, #FCD535 35%, #F0B90B 100%);
    color: #0A0A0B;
    font-weight: 700;
    letter-spacing: -0.01em;
    box-shadow:
        0 0 0 1px rgba(252, 213, 53, 0.4),
        0 1px 0 rgba(255,255,255,0.35) inset,
        0 -1px 0 rgba(0,0,0,0.15) inset,
        0 12px 32px -10px rgba(240, 185, 11, 0.55);
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}
.gold-btn:hover { filter: brightness(1.04); transform: translateY(-1px); }
.gold-btn:active { transform: translateY(0); filter: brightness(0.96); }

.ghost-btn {
    background: rgba(255,255,255,0.04);
    color: var(--text);
    border: 1px solid var(--border-strong);
    transition: all 0.15s ease;
    backdrop-filter: blur(10px);
}
.ghost-btn:hover { border-color: rgba(252,213,53,0.45); color: var(--gold-bright); background: rgba(240,185,11,0.05); }

.tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3.5px 9px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: 'Bahnschrift', 'Arial Narrow', Arial, sans-serif;
    backdrop-filter: blur(8px);
}
.tag-gold { background: rgba(240,185,11,0.10); color: var(--gold-bright); border: 1px solid rgba(240,185,11,0.22); }
.tag-green { background: rgba(20,204,140,0.08); color: var(--green); border: 1px solid rgba(20,204,140,0.20); }
.tag-red { background: rgba(246,70,93,0.08); color: var(--red); border: 1px solid rgba(246,70,93,0.20); }
.tag-amber { background: rgba(250,178,62,0.08); color: var(--amber); border: 1px solid rgba(250,178,62,0.20); }
.tag-mute { background: rgba(255,255,255,0.04); color: var(--text-muted); border: 1px solid var(--border-strong); }

.tp-auto-header {
    max-width: 1400px;
    margin: 0 auto 32px auto;
    padding: 14px 24px 24px;
    background: var(--panel-slate);
    border: 1px solid var(--titanium-seam);
    border-radius: 12px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.tp-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.tp-page-brand {
    display: flex;
    align-items: center;
    width: fit-content;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 800;
    letter-spacing: -0.03em;
    font-size: 1.15rem;
    line-height: 1;
}

.brand-primary { color: #ffffff; }
.brand-secondary { color: var(--bybit-yellow); margin-left: 1px; }

.tp-top-actions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.tp-top-action {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #73737b;
    transition: color 0.16s ease, background 0.16s ease;
}

.tp-top-action:hover,
.tp-top-action:focus-visible {
    color: var(--bybit-yellow);
    background: rgba(247, 166, 0, 0.08);
    outline: none;
}

.tp-logout-notice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: -6px 0 12px;
    padding: 8px 10px;
    border: 1px solid rgba(247, 166, 0, 0.22);
    border-radius: 6px;
    background: rgba(247, 166, 0, 0.06);
    color: var(--text-muted);
    font-size: 11px;
}

.tp-logout-notice button {
    flex: 0 0 auto;
    border: 0;
    background: transparent;
    color: var(--bybit-yellow);
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
}

.tp-console-display-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
}

.console-title-primary {
    margin: 0;
    color: #ffffff;
    font-family: 'Oswald', 'Arial Narrow', Arial, sans-serif;
    font-size: 18px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
}

.tp-location-telemetry {
    text-align: right;
    min-width: 0;
}

.location-badge-wrap {
    display: inline-block;
    max-width: 100%;
    padding: 8px 16px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--titanium-seam);
}

.location-main-text {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ffffff;
    font-family: 'Oswald', 'Arial Narrow', Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
}

.postal-code {
    margin-left: 4px;
    color: var(--tactical-amber);
    font-family: 'Oswald', 'Arial Narrow', Arial, sans-serif;
    font-size: 0.9rem;
}

.tp-console-navigation {
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0;
    padding: 8px 8px 14px;
    background: rgba(8, 8, 9, 0.97);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0;
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    box-shadow:
        0 -18px 36px rgba(0, 0, 0, 0.34),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.console-nav-item {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    min-height: 54px;
    padding: 4px 2px 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #73737b;
    cursor: pointer;
    box-shadow: none;
    transition: color 0.16s ease, transform 0.16s ease;
}

.nav-icon-wrap {
    width: 34px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    transition: color 0.16s ease, transform 0.16s ease, background 0.16s ease;
}

.nav-text-label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'Manrope', sans-serif;
    font-size: 0.64rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
}

.console-nav-item:hover {
    color: #d7d7dc;
    background: transparent;
}

.console-nav-item.active {
    background: transparent;
    color: var(--bybit-yellow);
    box-shadow: none;
}

.console-nav-item.active .nav-icon-wrap {
    transform: translateY(-1px);
}

.console-nav-item.primary {
    color: #b6b6bd;
}

.console-nav-item.primary .nav-icon-wrap {
    width: 46px;
    height: 46px;
    margin-top: -18px;
    border-radius: 50%;
    color: #09090a;
    background: linear-gradient(180deg, var(--bybit-yellow-bright), var(--bybit-yellow));
    border: 1px solid rgba(255, 205, 74, 0.9);
    box-shadow:
        0 8px 22px rgba(247, 166, 0, 0.28),
        0 0 0 5px #080809,
        inset 0 1px 0 rgba(255, 255, 255, 0.42);
}

.console-nav-item.primary:hover .nav-icon-wrap {
    transform: translateY(-1px);
    filter: brightness(1.05);
}

.console-nav-item.primary .nav-text-label {
    color: var(--bybit-yellow);
    font-weight: 700;
}

@media (max-width: 390px) {
    .tp-auto-header {
        padding: 14px 18px 18px;
    }

    .tp-console-display-grid {
        flex-direction: column;
        align-items: stretch;
    }

    .console-title-primary { font-size: 17.5px; }

    .tp-location-telemetry {
        text-align: left;
    }

    .location-badge-wrap {
        width: 100%;
    }

    .console-nav-item {
        padding-left: 1px;
        padding-right: 1px;
    }

    .nav-text-label {
        font-size: 0.58rem;
    }
}

.divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border-strong) 20%, var(--border-strong) 80%, transparent); }

.input-field {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    color: var(--text);
    padding-top: 14px;
    padding-right: 14px;
    padding-bottom: 14px;
    padding-left: 14px;
    width: 100%;
    font-family: 'Manrope', sans-serif;
    font-size: 14.5px;
    letter-spacing: -0.005em;
    transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
    backdrop-filter: blur(10px);
}
.input-field.pl-11,
.pl-11.input-field { padding-left: 2.75rem; }
.input-field::placeholder { color: rgba(255, 255, 255, 0.42); font-weight: 500; }
.input-field:focus {
    outline: none;
    border-color: rgba(252, 213, 53, 0.45);
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px rgba(240, 185, 11, 0.10);
}

/* Apply same treatment to bare input + textarea elements as a safety net */
textarea.input-field { resize: vertical; }

.estimate-label {
    display: block;
    margin-bottom: 6px;
    color: rgba(255, 255, 255, 0.48);
    font-family: 'Bahnschrift', 'Arial Narrow', Arial, sans-serif;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    line-height: 1.35;
    text-transform: uppercase;
}

.estimate-input {
    min-height: 42px;
    padding: 10px 11px;
    font-family: 'Bahnschrift', 'Arial Narrow', Arial, sans-serif;
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
}

select.estimate-input {
    appearance: none;
    background-image: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.45) 50%),
        linear-gradient(135deg, rgba(255,255,255,0.45) 50%, transparent 50%);
    background-position: calc(100% - 15px) 17px, calc(100% - 11px) 17px;
    background-repeat: no-repeat;
    background-size: 4px 4px, 4px 4px;
    padding-right: 25px;
}

select.estimate-input option {
    background: #121218;
    color: var(--text);
}

/* ====== Premium segmented control (Access type, MPa, etc.) ====== */
.bedrock-segmented {
    display: inline-flex;
    background: rgba(0, 0, 0, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 3px;
    border-radius: 11px;
    gap: 2px;
    width: 100%;
}
.bedrock-segment {
    flex: 1;
    background: transparent;
    color: var(--text-muted);
    font-family: 'Manrope', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: -0.005em;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition:
        background 220ms cubic-bezier(0.16, 1, 0.3, 1),
        color 180ms ease,
        box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
}
.bedrock-segment:hover { color: var(--text); }
.bedrock-segment.active {
    background: linear-gradient(180deg, #FCD535 0%, #F0B90B 100%);
    color: #0A0A0B;
    font-weight: 700;
    box-shadow:
        0 1px 0 rgba(255,255,255,0.35) inset,
        0 -1px 0 rgba(0,0,0,0.15) inset,
        0 4px 12px -2px rgba(240,185,11,0.45),
        0 0 0 1px rgba(252,213,53,0.4);
}
/* Wrap mode for long option lists (Mesh, Finish, etc.) */
.bedrock-segmented.wrap { flex-wrap: wrap; }
.bedrock-segmented.wrap .bedrock-segment { flex: 0 0 auto; }

/* ====== Premium toggle switch (dark track, glowing gold knob when on) ====== */
.bedrock-toggle {
    position: relative;
    width: 46px;
    height: 26px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.40);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
        background 280ms cubic-bezier(0.16, 1, 0.3, 1),
        border-color 280ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 280ms cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    flex-shrink: 0;
}
.bedrock-toggle:hover { border-color: rgba(255,255,255,0.14); }
.bedrock-toggle.on {
    background: rgba(240, 185, 11, 0.07);
    border-color: rgba(252, 213, 53, 0.30);
    box-shadow: inset 0 0 12px rgba(240,185,11,0.10);
}
.bedrock-toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: linear-gradient(180deg, #6A6A74 0%, #3A3A42 100%);
    box-shadow:
        0 1px 0 rgba(255,255,255,0.10) inset,
        0 2px 4px rgba(0,0,0,0.5);
    transition:
        left 280ms cubic-bezier(0.16, 1, 0.3, 1),
        background 280ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
.bedrock-toggle.on .bedrock-toggle-knob {
    left: 22px;
    background: linear-gradient(180deg, #FFE074 0%, #F0B90B 100%);
    box-shadow:
        0 1px 0 rgba(255,255,255,0.45) inset,
        0 -1px 0 rgba(0,0,0,0.15) inset,
        0 0 12px rgba(240,185,11,0.65),
        0 0 0 1px rgba(252,213,53,0.35);
}

/* Glowing accent */
.gold-glow {
    box-shadow:
        0 0 40px -8px rgba(240,185,11,0.42),
        0 0 0 1px rgba(252,213,53,0.20);
}

/* Hairline accent on top of cards (Linear-style) */
.top-hairline::before {
    content: '';
    position: absolute;
    inset: 0 20px auto 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(252,213,53,0.55) 50%, transparent);
    opacity: 0.8;
    z-index: 1;
}

/* Premium micro-interactions — hover lift with diffused shadow */
.hover-lift {
    will-change: transform, box-shadow;
    transition:
        transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1),
        background 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow:
        0 1px 0 rgba(255,255,255,0.04) inset,
        0 24px 60px -24px rgba(0,0,0,0.7),
        0 0 0 1px rgba(255,255,255,0.04);
}
.hover-lift::before {
    transition: background 320ms cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-lift:hover::before {
    background: linear-gradient(160deg,
        rgba(255,255,255,0.16) 0%,
        rgba(255,255,255,0.04) 35%,
        rgba(255,255,255,0.02) 65%,
        rgba(255,255,255,0.10) 100%) !important;
}

/* Gold hover lift — for primary CTAs */
.hover-lift-gold {
    will-change: transform, box-shadow, filter;
    transition:
        transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1),
        filter 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-lift-gold:hover {
    transform: translateY(-2px);
    filter: brightness(1.04);
    box-shadow:
        0 1px 0 rgba(255,255,255,0.4) inset,
        0 -1px 0 rgba(0,0,0,0.18) inset,
        0 0 0 1px rgba(252,213,53,0.5),
        0 24px 50px -16px rgba(240,185,11,0.6);
}
.hover-lift-gold:active { transform: translateY(0); filter: brightness(0.96); }

/* Pressable rows (pipeline, activity) */
.press-row {
    will-change: background, transform;
    transition:
        background 220ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.press-row:hover { background: rgba(255,255,255,0.025); }
.press-row:active { transform: scale(0.997); }

/* SUBGRADE AI — Elite hero card: ambient glow + animated border + accordion */
.subgrade-card {
    position: relative;
    border-radius: 22px;
    padding: 1.5px;
    isolation: isolate;
    cursor: pointer;
    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}
.subgrade-card:active { transform: scale(0.995); }

/* Static gradient border (no rotation) */
.subgrade-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
        135deg,
        rgba(252,213,53,0.55) 0%,
        rgba(240,185,11,0.20) 25%,
        rgba(255,255,255,0.04) 50%,
        rgba(240,185,11,0.20) 75%,
        rgba(252,213,53,0.55) 100%
    );
    z-index: -1;
    animation: none;
}

/* Ambient glow under the card */
.subgrade-card::after {
    content: '';
    position: absolute;
    inset: -8px -8px -20px -8px;
    border-radius: inherit;
    background: radial-gradient(60% 80% at 50% 100%, rgba(240,185,11,0.30), transparent 70%);
    filter: blur(20px);
    animation: subgradePulse 4.5s ease-in-out infinite;
    z-index: -2;
    pointer-events: none;
}

@keyframes subgradePulse {
    0%, 100% { opacity: 0.45; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.04); }
}

/* Inner card surface */
.subgrade-inner {
    position: relative;
    border-radius: 20px;
    background:
        radial-gradient(140% 100% at 0% 0%, rgba(240,185,11,0.12) 0%, transparent 50%),
        radial-gradient(120% 100% at 100% 100%, rgba(240,185,11,0.06) 0%, transparent 50%),
        linear-gradient(180deg, #15151B 0%, #0E0E13 100%);
    padding: 22px;
    overflow: hidden;
}

/* Subtle scanning sweep across the inner surface */
.subgrade-inner::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0;
    width: 30%;
    background: linear-gradient(90deg, transparent, rgba(252,213,53,0.06), transparent);
    transform: translateX(-100%);
    animation: subgradeSweep 6s ease-in-out infinite;
    pointer-events: none;
    will-change: transform, opacity;
}
@keyframes subgradeSweep {
    0%, 100% { transform: translateX(-100%); opacity: 0; }
    40% { opacity: 1; }
    80% { transform: translateX(380%); opacity: 0; }
}

/* Expand accordion */
.subgrade-expand {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 460ms cubic-bezier(0.16, 1, 0.3, 1);
}
.subgrade-expand.open { grid-template-rows: 1fr; }
.subgrade-expand > .inner { overflow: hidden; min-height: 0; }

/* Staggered children reveal on expand */
.subgrade-stagger {
    opacity: 0;
    transform: translateY(8px);
    transition:
        opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 70ms);
}
.subgrade-expand.open .subgrade-stagger {
    opacity: 1;
    transform: translateY(0);
}

/* Contrast bars (before/after) */
.contrast-bar {
    position: relative;
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    overflow: hidden;
}
.contrast-bar > span {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: inherit;
    transition: width 900ms cubic-bezier(0.16, 1, 0.3, 1) 250ms;
}
.contrast-bar-red > span { background: linear-gradient(90deg, #F6465D, #FAB23E); }
.contrast-bar-gold > span { background: linear-gradient(90deg, #FFE074, #FCD535, #F0B90B); box-shadow: 0 0 10px rgba(240,185,11,0.4); }

@media (prefers-reduced-motion: reduce) {
    .subgrade-card::before, .subgrade-card::after, .subgrade-inner::before { animation: none; }
    .subgrade-stagger { transition: none; }
}

/* Generic smooth collapsible — uses CSS grid 0fr → 1fr trick */
.collapse-grid {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 380ms cubic-bezier(0.16, 1, 0.3, 1);
}
.collapse-grid.open { grid-template-rows: 1fr; }
.collapse-grid > .inner { overflow: hidden; min-height: 0; }
.collapse-grid > .inner > * {
    opacity: 0;
    transform: translateY(-4px);
    transition:
        opacity 320ms cubic-bezier(0.16, 1, 0.3, 1) 60ms,
        transform 320ms cubic-bezier(0.16, 1, 0.3, 1) 60ms;
}
.collapse-grid.open > .inner > * {
    opacity: 1;
    transform: translateY(0);
}

/* ====== Mobile fluidity ====== */

/* Haptic-like nav button scale-down on press */
.nav-btn {
    position: relative;
    transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), color 180ms ease;
    will-change: transform;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
.nav-btn:active { transform: scale(0.86); }
.nav-btn .nav-pill {
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, #FFE074, #F0B90B);
    box-shadow: 0 0 10px rgba(240,185,11,0.55);
    opacity: 0;
    transition: opacity 220ms ease, transform 220ms ease;
}
.nav-btn.active .nav-pill { opacity: 1; }

/* Swipe-to-reveal */
.swipe-wrap {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    isolation: isolate;
}
.swipe-actions {
    position: absolute;
    top: 0; bottom: 0; right: 0;
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    gap: 6px;
    padding: 6px 6px 6px 4px;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.swipe-wrap[data-open="true"] .swipe-actions {
    opacity: 1;
    pointer-events: auto;
}
.swipe-content {
    position: relative;
    z-index: 2;
    touch-action: pan-y;
    will-change: transform;
}
.swipe-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 60px;
    border-radius: 14px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: 'Bahnschrift', 'Arial Narrow', Arial, sans-serif;
    color: white;
    transition: filter 0.15s ease, transform 0.15s ease;
    cursor: pointer;
}
.swipe-action-btn:active { transform: scale(0.92); filter: brightness(0.9); }
.swipe-action-btn.gold { background: linear-gradient(180deg, #FFE074, #F0B90B); color: #0A0A0B; }
.swipe-action-btn.amber { background: linear-gradient(180deg, #FBC562, #E89A28); color: #1A0F00; }
.swipe-action-btn.red { background: linear-gradient(180deg, #FF6B7E, #DC2E45); color: white; }
.swipe-action-btn.mute { background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid var(--border-strong); }

/* ====== Skeleton shimmer ====== */
.skeleton {
    position: relative;
    overflow: hidden;
    background: rgba(255,255,255,0.04);
    isolation: isolate;
}
.skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg,
        transparent 0%,
        rgba(255,255,255,0.04) 30%,
        rgba(252,213,53,0.10) 50%,
        rgba(255,255,255,0.04) 70%,
        transparent 100%);
    animation: shimmer 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform;
}
@keyframes shimmer {
    100% { transform: translateX(100%); }
}
@media (prefers-reduced-motion: reduce) {
    .skeleton::after { animation: none; opacity: 0.4; }
}
@keyframes goldSweep {
    0%, 70%, 100% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
    80% { opacity: 0.9; }
    95% { transform: translateX(220%) skewX(-12deg); opacity: 0; }
}
.gold-sweep { position: relative; overflow: hidden; }
.gold-sweep::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 30%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
    animation: goldSweep 7s ease-in-out infinite;
    animation-delay: 2s;
    pointer-events: none;
}

/* Number ticker fade in */
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
.anim-fade-up { animation: fadeUp 0.4s ease forwards; }

/* Pulse */
@keyframes pulseDot {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
    50% { opacity: 0.6; box-shadow: 0 0 0 4px transparent; }
}
.pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

/* Ticker marquee */
@keyframes tickerScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.ticker-track {
    animation: tickerScroll 38s linear infinite;
    will-change: transform;
}

/* Staggered card reveals on dashboard */
@keyframes revealUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}
.reveal {
    opacity: 0;
    animation: revealUp 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}
.reveal-1 { animation-delay: 40ms; }
.reveal-2 { animation-delay: 100ms; }
.reveal-3 { animation-delay: 160ms; }
.reveal-4 { animation-delay: 220ms; }
.reveal-5 { animation-delay: 280ms; }
.reveal-6 { animation-delay: 340ms; }
.reveal-7 { animation-delay: 400ms; }
.reveal-8 { animation-delay: 460ms; }

@media (prefers-reduced-motion: reduce) {
    .reveal, .ticker-track, .pulse-dot { animation: none; }
    .reveal { opacity: 1; transform: none; }
}

/* Hide app scrollbar on mobile, keep functional */
.mobile-shell {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    background:
        radial-gradient(700px 400px at 50% -10%, rgba(240,185,11,0.06), transparent 55%),
        radial-gradient(500px 400px at 100% 50%, rgba(240,185,11,0.025), transparent 60%),
        var(--bg);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
}

@media (max-width: 480px) {
    .mobile-shell { border: none; }
}

/* Floating Action Button — STEADY: no rotation, no lift, only scale + glow on interaction */
.fab {
    position: fixed;
    bottom: 26px;
    left: 50%;
    transform: translateX(-50%) scale(1);
    width: 58px;
    height: 58px;
    border-radius: 999px;
    background:
        radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.32), transparent 55%),
        linear-gradient(180deg, #FFE074 0%, #FCD535 40%, #F0B90B 100%);
    color: #0A0A0B;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    box-shadow:
        0 0 0 5px rgba(8, 8, 10, 0.95),
        0 0 0 6px rgba(252,213,53,0.30),
        0 1px 0 rgba(255,255,255,0.45) inset,
        0 -1px 0 rgba(0,0,0,0.18) inset,
        0 14px 36px -10px rgba(240,185,11,0.65);
    transition:
        transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1),
        filter 180ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, box-shadow;
    cursor: pointer;
    /* Lock against any inherited rotation */
    animation: none !important;
    transform-origin: center center;
}
.fab > * { animation: none !important; }
.fab:hover {
    transform: translateX(-50%) scale(1.05);
    filter: brightness(1.04);
    box-shadow:
        0 0 0 5px rgba(8, 8, 10, 0.95),
        0 0 0 6px rgba(252,213,53,0.55),
        0 1px 0 rgba(255,255,255,0.55) inset,
        0 -1px 0 rgba(0,0,0,0.18) inset,
        0 18px 48px -8px rgba(240,185,11,0.90),
        0 0 40px -4px rgba(252,213,53,0.55);
}
.fab:active {
    transform: translateX(-50%) scale(1.02);
    filter: brightness(0.98);
    box-shadow:
        0 0 0 5px rgba(8, 8, 10, 0.95),
        0 0 0 6px rgba(252,213,53,0.65),
        0 1px 0 rgba(255,255,255,0.55) inset,
        0 -1px 0 rgba(0,0,0,0.22) inset,
        0 22px 56px -8px rgba(240,185,11,1),
        0 0 60px -4px rgba(252,213,53,0.7);
}

/* Step indicator */
.step-bar {
    height: 3px;
    border-radius: 2px;
    background: var(--surface-3);
    overflow: hidden;
}
.step-bar > span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, var(--gold-bright), var(--gold));
    transition: width 0.4s ease;
}

/* Checkbox-like selection card — glassmorphic */
.select-card {
    position: relative;
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    padding: 14px 14px;
    cursor: pointer;
    transition: all 0.18s cubic-bezier(0.2,0.7,0.2,1);
}
.select-card:hover { border-color: rgba(252,213,53,0.30); background: rgba(255,255,255,0.04); }
.select-card.active {
    border-color: rgba(252,213,53,0.55);
    background: linear-gradient(180deg, rgba(240,185,11,0.10) 0%, rgba(240,185,11,0.02) 100%);
    box-shadow: 0 0 0 1px rgba(252,213,53,0.25), 0 8px 24px -10px rgba(240,185,11,0.35);
}
.select-card.active::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--gold-bright);
    box-shadow: 0 0 12px var(--gold);
}

/* Spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }

/* SVG icon stroke uniform */
.lucide { stroke-width: 1.75; }

/* Make sure content sits above the grain overlay */
#root { position: relative; z-index: 2; }
