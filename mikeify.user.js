// ==UserScript==
// @name         Roblox Home Tools - Config Blue Hub
// @namespace    local
// @version      7.2
// @description  Configurable Roblox home tools hub with avatar config preview, detailed status, and GUI color settings
// @match        https://www.roblox.com/home*
// @match        https://roblox.com/home*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_KEY = "config_blue_hub_v7";

    const DEFAULT_THEME = {
        primary: "#1685FF",
        primaryDark: "#0057D9",
        primaryLight: "#69B7FF",
        accent: "#33A3FF",
        bg: "#06111F",
        bgSecondary: "#0A1B31",
        bgTertiary: "#102944",
        panel: "rgba(7, 21, 38, 0.96)",
        border: "#1D4F86",
        borderAccent: "#1685FF",
        text: "#C9E4FF",
        textBright: "#F2F9FF",
        textDim: "#78A7D8",
        danger: "#FF4D5E",
        glow: "rgba(22, 133, 255, 0.24)",
        inputBg: "#08182B",
        inputBorder: "#22588F",
        inputFocus: "#33A3FF"
    };

    const THEME_PRESETS = {
        blue: {
            name: "Blue",
            values: {
                primary: "#1685FF",
                primaryDark: "#0057D9",
                primaryLight: "#69B7FF",
                accent: "#33A3FF",
                bg: "#06111F",
                bgSecondary: "#0A1B31",
                bgTertiary: "#102944",
                panel: "rgba(7, 21, 38, 0.96)",
                border: "#1D4F86",
                borderAccent: "#1685FF",
                text: "#C9E4FF",
                textBright: "#F2F9FF",
                textDim: "#78A7D8",
                danger: "#FF4D5E",
                glow: "rgba(22, 133, 255, 0.24)",
                inputBg: "#08182B",
                inputBorder: "#22588F",
                inputFocus: "#33A3FF"
            }
        },
        cyan: {
            name: "Cyan",
            values: {
                primary: "#00D4FF",
                primaryDark: "#007C99",
                primaryLight: "#73ECFF",
                accent: "#23E8FF",
                bg: "#03161B",
                bgSecondary: "#06252E",
                bgTertiary: "#0B3845",
                panel: "rgba(4, 25, 32, 0.96)",
                border: "#17869B",
                borderAccent: "#00D4FF",
                text: "#C7F7FF",
                textBright: "#F0FDFF",
                textDim: "#7FCFDB",
                danger: "#FF4D5E",
                glow: "rgba(0, 212, 255, 0.24)",
                inputBg: "#06202A",
                inputBorder: "#1B7A90",
                inputFocus: "#00D4FF"
            }
        },
        purple: {
            name: "Purple",
            values: {
                primary: "#9B5CFF",
                primaryDark: "#5E25C9",
                primaryLight: "#C2A0FF",
                accent: "#AD72FF",
                bg: "#120A22",
                bgSecondary: "#1F1238",
                bgTertiary: "#311C54",
                panel: "rgba(22, 12, 40, 0.96)",
                border: "#5B38A0",
                borderAccent: "#9B5CFF",
                text: "#E7D9FF",
                textBright: "#FBF8FF",
                textDim: "#AE95D8",
                danger: "#FF4D5E",
                glow: "rgba(155, 92, 255, 0.24)",
                inputBg: "#1B1030",
                inputBorder: "#5B38A0",
                inputFocus: "#9B5CFF"
            }
        },
        red: {
            name: "Red",
            values: {
                primary: "#FF3E55",
                primaryDark: "#B11227",
                primaryLight: "#FF8A99",
                accent: "#FF5C6E",
                bg: "#1F050A",
                bgSecondary: "#310910",
                bgTertiary: "#49111A",
                panel: "rgba(34, 7, 12, 0.96)",
                border: "#8A2432",
                borderAccent: "#FF3E55",
                text: "#FFD2D8",
                textBright: "#FFF5F6",
                textDim: "#DA8590",
                danger: "#FFB000",
                glow: "rgba(255, 62, 85, 0.24)",
                inputBg: "#2B070D",
                inputBorder: "#8A2432",
                inputFocus: "#FF3E55"
            }
        },
        green: {
            name: "Green",
            values: {
                primary: "#35D96D",
                primaryDark: "#168A3B",
                primaryLight: "#8BFFB2",
                accent: "#4CFF88",
                bg: "#051A0D",
                bgSecondary: "#0A2B16",
                bgTertiary: "#114322",
                panel: "rgba(6, 29, 14, 0.96)",
                border: "#1D8841",
                borderAccent: "#35D96D",
                text: "#D1FFE0",
                textBright: "#F3FFF6",
                textDim: "#84D89E",
                danger: "#FF4D5E",
                glow: "rgba(53, 217, 109, 0.24)",
                inputBg: "#082412",
                inputBorder: "#1D8841",
                inputFocus: "#35D96D"
            }
        }
    };

    const DEFAULT_CONFIG = {
        displayName: "mike",
        bodyColors: {
            headColorId: 23,
            torsoColorId: 1,
            rightArmColorId: 23,
            leftArmColorId: 23,
            rightLegColorId: 23,
            leftLegColorId: 23
        },
        avatarPreview: {
            enabled: true
        },
        guiTheme: { ...DEFAULT_THEME },
        redirectUrl: "https://www.roblox.com/games/5987922834/Transfur-Outbreak"
    };

    let CONFIG = loadConfig();

    function loadConfig() {
        try {
            const saved = GM_getValue(STORAGE_KEY, null);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...DEFAULT_CONFIG,
                    ...parsed,
                    bodyColors: { ...DEFAULT_CONFIG.bodyColors, ...(parsed.bodyColors || {}) },
                    avatarPreview: { ...DEFAULT_CONFIG.avatarPreview, ...(parsed.avatarPreview || {}) },
                    guiTheme: { ...DEFAULT_THEME, ...(parsed.guiTheme || {}) }
                };
            }
        } catch (e) {
            console.error("[ConfigHub] Failed to load config:", e);
        }

        return {
            ...DEFAULT_CONFIG,
            bodyColors: { ...DEFAULT_CONFIG.bodyColors },
            avatarPreview: { ...DEFAULT_CONFIG.avatarPreview },
            guiTheme: { ...DEFAULT_THEME }
        };
    }

    function saveConfig() {
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify(CONFIG));
        } catch (e) {
            console.error("[ConfigHub] Failed to save config:", e);
        }
    }

    const COLOR_PRESETS = {
        1: { name: "Institutional White", hex: "#F2F2F2" },
        0: { name: "Black", hex: "#000000" },
        1020: { name: "Lime Green", hex: "#A3D148" },
        194: { name: "Medium Stone Grey", hex: "#A3A2A5" },
        199: { name: "Dark Stone Grey", hex: "#635F62" },
        23: { name: "Bright Blue", hex: "#0D69AC" },
        21: { name: "Bright Red", hex: "#C4281C" },
        24: { name: "Bright Yellow", hex: "#F5CD30" },
        29: { name: "Lavender", hex: "#6B327C" },
        1010: { name: "Nougat", hex: "#E3AD5C" },
        1001: { name: "Brick Yellow", hex: "#D7C59A" },
        11: { name: "Pastel Blue", hex: "#80BBDC" },
        38: { name: "Pastel Green", hex: "#75C182" },
        101: { name: "Pastel Red", hex: "#E08383" },
        226: { name: "Pastel Yellow", hex: "#F3E48A" }
    };

    const BODY_PARTS = [
        { key: "headColorId", label: "Head" },
        { key: "torsoColorId", label: "Torso" },
        { key: "rightArmColorId", label: "Right Arm" },
        { key: "leftArmColorId", label: "Left Arm" },
        { key: "rightLegColorId", label: "Right Leg" },
        { key: "leftLegColorId", label: "Left Leg" }
    ];

    let currentUserId = null;
    let currentUserData = null;
    let statusEl = null;
    let avatarBtn = null;
    let allBtn = null;
    let nameBtn = null;
    let previewData = null;
    let checkingAvatarState = false;

    function theme(key) {
        return CONFIG.guiTheme[key] || DEFAULT_THEME[key];
    }

    function applyThemeVars(root) {
        const target = root || document.documentElement;
        const map = {
            "--cbh-primary": theme("primary"),
            "--cbh-primary-dark": theme("primaryDark"),
            "--cbh-primary-light": theme("primaryLight"),
            "--cbh-accent": theme("accent"),
            "--cbh-bg": theme("bg"),
            "--cbh-bg-secondary": theme("bgSecondary"),
            "--cbh-bg-tertiary": theme("bgTertiary"),
            "--cbh-panel": theme("panel"),
            "--cbh-border": theme("border"),
            "--cbh-border-accent": theme("borderAccent"),
            "--cbh-text": theme("text"),
            "--cbh-text-bright": theme("textBright"),
            "--cbh-text-dim": theme("textDim"),
            "--cbh-danger": theme("danger"),
            "--cbh-glow": theme("glow"),
            "--cbh-input-bg": theme("inputBg"),
            "--cbh-input-border": theme("inputBorder"),
            "--cbh-input-focus": theme("inputFocus")
        };

        Object.entries(map).forEach(function(entry) {
            target.style.setProperty(entry[0], entry[1]);
        });
    }

    function setStatus(message, type = "info") {
        if (!statusEl) return;

        statusEl.textContent = message;

        const colors = {
            info: "var(--cbh-text-dim)",
            working: "var(--cbh-primary-light)",
            success: "var(--cbh-primary-light)",
            error: "var(--cbh-danger)",
            idle: "var(--cbh-text-dim)"
        };

        statusEl.style.color = colors[type] || "var(--cbh-text-dim)";
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getColorHex(colorId) {
        return COLOR_PRESETS[Number(colorId)]?.hex || "#B8B8B8";
    }

    async function getCsrfToken() {
        const res = await fetch("https://auth.roblox.com/v2/logout", {
            method: "POST",
            credentials: "include"
        });
        const token = res.headers.get("x-csrf-token");
        if (!token) throw new Error("Failed to obtain CSRF token");
        return token;
    }

    async function getAuthenticatedUser() {
        if (currentUserData) return currentUserData;

        const res = await fetch("https://users.roblox.com/v1/users/authenticated", {
            method: "GET",
            credentials: "include"
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Authentication failed\n${text}`);

        currentUserData = JSON.parse(text);
        currentUserId = currentUserData.id;
        return currentUserData;
    }

    async function getAuthenticatedUserId() {
        if (currentUserId) return currentUserId;
        const data = await getAuthenticatedUser();
        currentUserId = data.id;
        return currentUserId;
    }

    async function postRoblox(url, body, csrfToken) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=utf-8",
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(body)
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Request failed (${res.status})\n${text}`);
        return text;
    }

    async function getCurrentAvatar() {
        const res = await fetch("https://avatar.roblox.com/v1/avatar", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json, text/plain, */*" }
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Failed to get current avatar\n${text}`);

        return JSON.parse(text);
    }

    function avatarMatchesConfig(avatarData) {
        const bodyColors = avatarData.bodyColors || {};
        const avatarType = avatarData.playerAvatarType || avatarData.avatarType;
        const assets = avatarData.assets || [];

        const colorsMatch = BODY_PARTS.every(function(part) {
            return Number(bodyColors[part.key]) === Number(CONFIG.bodyColors[part.key]);
        });

        const isR6 = avatarType === "R6";
        const hasNoAssets = assets.length === 0;

        return colorsMatch && isR6 && hasNoAssets;
    }

    function nameMatchesConfig(userData) {
        if (!userData) return false;
        return String(userData.displayName || "").toLowerCase() === String(CONFIG.displayName || "").toLowerCase();
    }

    async function refreshActionAvailability() {
        if (checkingAvatarState) return;
        checkingAvatarState = true;

        try {
            if (avatarBtn) avatarBtn.disabled = true;
            if (allBtn) allBtn.disabled = true;

            setStatus("Checking current account state...", "working");

            currentUserData = null;

            const avatarData = await getCurrentAvatar();
            const userData = await getAuthenticatedUser();

            const sameAvatar = avatarMatchesConfig(avatarData);
            const sameName = nameMatchesConfig(userData);

            if (avatarBtn) {
                avatarBtn.disabled = sameAvatar;
                avatarBtn.title = sameAvatar ? "Avatar already matches this config" : "";
            }

            if (allBtn) {
                allBtn.disabled = sameAvatar && sameName;
                allBtn.title = sameAvatar && sameName ? "Avatar and display name already match this config" : "";
            }

            if (nameBtn) {
                nameBtn.disabled = false;
                nameBtn.title = sameName ? "Display name already matches this config, but you can still try again" : "";
            }

            if (sameAvatar && sameName) {
                setStatus("Avatar and display name already match config", "success");
            } else if (sameAvatar) {
                setStatus("Avatar matches config, name can still be set", "success");
            } else {
                setStatus("Ready", "idle");
            }
        } catch (err) {
            console.error("[ConfigHub] Account state check failed:", err);

            if (avatarBtn) avatarBtn.disabled = false;
            if (allBtn) allBtn.disabled = false;
            if (nameBtn) nameBtn.disabled = false;

            setStatus("Could not check current state", "error");
        }

        checkingAvatarState = false;
    }

    async function validateDisplayName(displayName) {
        const userId = await getAuthenticatedUserId();
        const url = `https://users.roblox.com/v1/users/${userId}/display-names/validate?displayName=${encodeURIComponent(displayName)}`;
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json, text/plain, */*" }
        });

        const text = await res.text();
        if (!res.ok) {
            let message = text;
            try {
                const data = JSON.parse(text);
                message = data.errors?.[0]?.message || text;
            } catch {}
            throw new Error(message);
        }

        return true;
    }

    async function setDisplayName(displayName) {
        const userId = await getAuthenticatedUserId();
        const csrfToken = await getCsrfToken();
        const url = `https://users.roblox.com/v1/users/${userId}/display-names`;

        const res = await fetch(url, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=utf-8",
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify({ newDisplayName: displayName })
        });

        const text = await res.text();
        if (!res.ok) {
            let message = text;
            try {
                const data = JSON.parse(text);
                message = data.errors?.[0]?.message || text;
            } catch {}
            throw new Error(message);
        }

        currentUserData = null;
        return true;
    }

    async function applyAvatarConfig(csrfToken) {
        setStatus("Clearing worn assets...", "working");
        await postRoblox("https://avatar.roblox.com/v2/avatar/set-wearing-assets", { assets: [] }, csrfToken);

        setStatus("Setting avatar type to R6...", "working");
        await postRoblox("https://avatar.roblox.com/v1/avatar/set-player-avatar-type", { playerAvatarType: "R6" }, csrfToken);

        setStatus("Setting body colors...", "working");
        await postRoblox("https://avatar.roblox.com/v1/avatar/set-body-colors", CONFIG.bodyColors, csrfToken);
    }

    function setButtonState(btn, state, customText) {
        const states = {
            default: { text: btn.dataset.defaultText || btn.textContent, style: {} },
            loading: { text: customText || "Processing...", style: { opacity: "0.7", pointerEvents: "none" } },
            success: { text: customText || "Done", style: { borderColor: "var(--cbh-primary)", background: "rgba(22,133,255,0.14)" } },
            error: { text: customText || "Failed", style: { borderColor: "var(--cbh-danger)", background: "rgba(217,54,54,0.1)" } }
        };

        const s = states[state] || states.default;
        btn.textContent = s.text;
        Object.assign(btn.style, s.style);
        btn.disabled = state === "loading";

        if (state === "success" || state === "error") {
            setTimeout(function() {
                btn.textContent = btn.dataset.defaultText || btn.textContent;
                btn.style.opacity = "";
                btn.style.pointerEvents = "";
                btn.style.borderColor = "";
                btn.style.background = "";
                btn.disabled = false;
                refreshActionAvailability();
            }, 2000);
        }
    }

    function notify(message, type = "info") {
        const existing = document.querySelector(".config-hub-notify");
        if (existing) existing.remove();

        const el = document.createElement("div");
        el.className = "config-hub-notify";
        el.textContent = message;

        const accent = type === "error" ? "var(--cbh-danger)" : "var(--cbh-primary)";

        Object.assign(el.style, {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "var(--cbh-bg-secondary)",
            color: "var(--cbh-text-bright)",
            padding: "10px 18px",
            borderLeft: `3px solid ${accent}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Segoe UI, system-ui, sans-serif",
            zIndex: "2147483647",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            letterSpacing: "0.2px"
        });

        document.body.appendChild(el);
        setTimeout(() => {
            el.style.opacity = "0";
            el.style.transition = "opacity 0.2s";
            setTimeout(() => el.remove(), 200);
        }, 2500);
    }

    async function handleApplyAvatar(btn) {
        try {
            setButtonState(btn, "loading", "Checking...");
            setStatus("Checking avatar...", "working");

            const currentAvatar = await getCurrentAvatar();
            if (avatarMatchesConfig(currentAvatar)) {
                setButtonState(btn, "success", "Already Set");
                setStatus("Avatar already matches config", "success");
                return;
            }

            setButtonState(btn, "loading", "Getting Token...");
            setStatus("Getting Roblox token...", "working");

            const csrfToken = await getCsrfToken();

            setButtonState(btn, "loading", "Setting Avatar...");
            await applyAvatarConfig(csrfToken);

            await sleep(700);

            if (previewData) {
                setStatus("Refreshing configured preview...", "working");
                previewData.redraw();
            }

            setButtonState(btn, "success", "Avatar Set");
            setStatus("Avatar setting successful", "success");
            notify("Avatar updated successfully");
        } catch (err) {
            console.error("[ConfigHub]", err);
            setButtonState(btn, "error", "Avatar Failed");
            setStatus("Avatar setting failed", "error");
            notify("Failed to update avatar", "error");
        }
    }

    async function handleSetName(btn) {
        try {
            setButtonState(btn, "loading", "Validating...");
            setStatus("Validating display name...", "working");

            await validateDisplayName(CONFIG.displayName);

            setButtonState(btn, "loading", "Setting Name...");
            setStatus(`Setting display name to "${CONFIG.displayName}"...`, "working");

            await setDisplayName(CONFIG.displayName);

            setButtonState(btn, "success", "Name Set");
            setStatus("Display name setting successful", "success");
            notify(`Display name set to "${CONFIG.displayName}"`);
        } catch (err) {
            console.error("[ConfigHub]", err);
            setButtonState(btn, "error", "Name Failed");
            setStatus("Display name setting failed", "error");
            notify("Failed to set display name", "error");
        }
    }

    async function handleApplyFullConfig(btn) {
        try {
            setButtonState(btn, "loading", "Checking...");
            setStatus("Checking current avatar and display name...", "working");

            const currentAvatar = await getCurrentAvatar();
            const currentUser = await getAuthenticatedUser();
            const sameAvatar = avatarMatchesConfig(currentAvatar);
            const sameName = nameMatchesConfig(currentUser);

            if (sameAvatar && sameName) {
                setButtonState(btn, "success", "Already Set");
                setStatus("Avatar and display name already match config", "success");
                return;
            }

            if (!sameAvatar) {
                setButtonState(btn, "loading", "Getting Token...");
                setStatus("Getting Roblox token...", "working");

                const csrfToken = await getCsrfToken();

                setButtonState(btn, "loading", "Setting Avatar...");
                await applyAvatarConfig(csrfToken);

                await sleep(400);
            } else {
                setStatus("Avatar already matches config, skipping avatar step...", "success");
            }

            if (!sameName) {
                setButtonState(btn, "loading", "Validating Name...");
                setStatus("Validating display name...", "working");
                await validateDisplayName(CONFIG.displayName);

                setButtonState(btn, "loading", "Setting Name...");
                setStatus(`Setting display name to "${CONFIG.displayName}"...`, "working");
                await setDisplayName(CONFIG.displayName);
            } else {
                setStatus("Display name already matches config, skipping name step...", "success");
            }

            await sleep(700);

            if (previewData) {
                setStatus("Refreshing configured preview...", "working");
                previewData.redraw();
            }

            setButtonState(btn, "success", "Complete");
            setStatus("Complete, config applied", "success");
            notify("Full config applied");
        } catch (err) {
            console.error("[ConfigHub]", err);
            setButtonState(btn, "error", "Failed");
            setStatus("Operation failed", "error");
            notify("Operation failed", "error");
        }
    }

    function createConfiguredAvatarPreview() {
        const previewContainer = document.createElement("div");
        previewContainer.className = "config-preview-container";

        const card = document.createElement("div");
        card.className = "config-avatar-card";

        const previewStage = document.createElement("div");
        previewStage.className = "config-avatar-stage";

        const shadow = document.createElement("div");
        shadow.className = "config-avatar-shadow";

        const avatar = document.createElement("div");
        avatar.className = "config-r6-avatar";

        const head = document.createElement("div");
        head.className = "config-r6-part config-r6-head";
        head.dataset.part = "headColorId";

        const torso = document.createElement("div");
        torso.className = "config-r6-part config-r6-torso";
        torso.dataset.part = "torsoColorId";

        const leftArm = document.createElement("div");
        leftArm.className = "config-r6-part config-r6-left-arm";
        leftArm.dataset.part = "leftArmColorId";

        const rightArm = document.createElement("div");
        rightArm.className = "config-r6-part config-r6-right-arm";
        rightArm.dataset.part = "rightArmColorId";

        const leftLeg = document.createElement("div");
        leftLeg.className = "config-r6-part config-r6-left-leg";
        leftLeg.dataset.part = "leftLegColorId";

        const rightLeg = document.createElement("div");
        rightLeg.className = "config-r6-part config-r6-right-leg";
        rightLeg.dataset.part = "rightLegColorId";

        const face = document.createElement("div");
        face.className = "config-r6-face";
        face.innerHTML = '<span class="config-r6-eye config-r6-eye-left"></span><span class="config-r6-eye config-r6-eye-right"></span><span class="config-r6-mouth"></span>';
        head.appendChild(face);

        avatar.appendChild(head);
        avatar.appendChild(leftArm);
        avatar.appendChild(torso);
        avatar.appendChild(rightArm);
        avatar.appendChild(leftLeg);
        avatar.appendChild(rightLeg);

        previewStage.appendChild(shadow);
        previewStage.appendChild(avatar);

        const name = document.createElement("div");
        name.className = "config-avatar-title";

        const sub = document.createElement("div");
        sub.className = "config-avatar-subtitle";
        sub.textContent = "Configured preview. Roblox does not provide a clean public render endpoint for unapplied body-color configs, so this shows the expected R6 color layout before applying.";

        const colorList = document.createElement("div");
        colorList.className = "config-avatar-color-summary";

        function redraw() {
            const parts = avatar.querySelectorAll(".config-r6-part[data-part]");
            parts.forEach(function(partEl) {
                const key = partEl.dataset.part;
                const colorId = CONFIG.bodyColors[key];
                const hex = getColorHex(colorId);
                partEl.style.background = `linear-gradient(135deg, ${hex}, ${hex})`;
            });

            name.textContent = `Preview: ${CONFIG.displayName || "Display Name"}`;

            colorList.innerHTML = "";
            BODY_PARTS.forEach(function(part) {
                const pill = document.createElement("div");
                pill.className = "config-color-pill";
                const swatch = document.createElement("span");
                swatch.style.backgroundColor = getColorHex(CONFIG.bodyColors[part.key]);

                const text = document.createElement("b");
                const preset = COLOR_PRESETS[CONFIG.bodyColors[part.key]];
                text.textContent = `${part.label}: ${preset ? preset.name : CONFIG.bodyColors[part.key]}`;

                pill.appendChild(swatch);
                pill.appendChild(text);
                colorList.appendChild(pill);
            });
        }

        const refreshBtn = document.createElement("button");
        refreshBtn.className = "config-hub-btn config-refresh-btn";
        refreshBtn.textContent = "Refresh Preview";
        refreshBtn.onclick = redraw;

        card.appendChild(previewStage);
        card.appendChild(name);
        card.appendChild(sub);
        card.appendChild(colorList);
        card.appendChild(refreshBtn);
        previewContainer.appendChild(card);

        redraw();

        return {
            container: previewContainer,
            redraw: redraw
        };
    }

    function makeThemeInput(label, key, onChange) {
        const row = document.createElement("div");
        row.className = "config-theme-row";

        const text = document.createElement("div");
        text.className = "config-theme-label";
        text.textContent = label;

        const input = document.createElement("input");
        input.type = "color";
        input.className = "config-theme-color";
        input.value = rgbOrHexToHex(CONFIG.guiTheme[key] || DEFAULT_THEME[key]);

        input.addEventListener("input", function() {
            CONFIG.guiTheme[key] = input.value;
            if (key === "primary") {
                CONFIG.guiTheme.borderAccent = input.value;
                CONFIG.guiTheme.inputFocus = input.value;
                CONFIG.guiTheme.glow = hexToRgba(input.value, 0.24);
            }
            saveConfig();
            applyThemeVars(document.documentElement);
            if (onChange) onChange();
        });

        row.appendChild(text);
        row.appendChild(input);

        return row;
    }

    function hexToRgba(hex, alpha) {
        const clean = hex.replace("#", "");
        const r = parseInt(clean.slice(0, 2), 16);
        const g = parseInt(clean.slice(2, 4), 16);
        const b = parseInt(clean.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function rgbOrHexToHex(value) {
        if (!value) return "#1685FF";
        if (value.startsWith("#")) return value.slice(0, 7);
        return "#1685FF";
    }

    function createSettingsPanel() {
        const container = document.createElement("div");
        container.className = "config-settings-container";

        const nameSection = document.createElement("div");
        nameSection.className = "config-settings-section";
        nameSection.innerHTML = '<div class="config-settings-label">Display Name</div>';

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "config-settings-input";
        nameInput.value = CONFIG.displayName;
        nameInput.maxLength = 20;
        nameInput.addEventListener("input", function() {
            CONFIG.displayName = nameInput.value;
            saveConfig();
            if (previewData) previewData.redraw();
            refreshActionAvailability();
        });
        nameSection.appendChild(nameInput);

        const gameSection = document.createElement("div");
        gameSection.className = "config-settings-section";
        gameSection.innerHTML = '<div class="config-settings-label">Saved Game URL</div>';

        const gameInput = document.createElement("input");
        gameInput.type = "text";
        gameInput.className = "config-settings-input";
        gameInput.value = CONFIG.redirectUrl || DEFAULT_CONFIG.redirectUrl;
        gameInput.placeholder = DEFAULT_CONFIG.redirectUrl;
        gameInput.addEventListener("input", function() {
            CONFIG.redirectUrl = gameInput.value.trim() || DEFAULT_CONFIG.redirectUrl;
            saveConfig();
            setStatus("Saved game URL updated", "success");
        });
        gameSection.appendChild(gameInput);

        const colorsSection = document.createElement("div");
        colorsSection.className = "config-settings-section";
        colorsSection.innerHTML = '<div class="config-settings-label">Body Colors</div>';

        const colorsGrid = document.createElement("div");
        colorsGrid.className = "config-colors-grid";

        BODY_PARTS.forEach(function(part) {
            const colorItem = document.createElement("div");
            colorItem.className = "config-color-item";

            const colorLabel = document.createElement("div");
            colorLabel.className = "config-color-label";
            colorLabel.textContent = part.label;

            const colorSelect = document.createElement("select");
            colorSelect.className = "config-color-select";

            Object.entries(COLOR_PRESETS).forEach(function(entry) {
                const id = entry[0];
                const preset = entry[1];
                const option = document.createElement("option");
                option.value = id;
                option.textContent = preset.name;
                if (parseInt(id) === CONFIG.bodyColors[part.key]) {
                    option.selected = true;
                }
                colorSelect.appendChild(option);
            });

            const colorPreview = document.createElement("div");
            colorPreview.className = "config-color-preview";
            colorPreview.style.backgroundColor = getColorHex(CONFIG.bodyColors[part.key]);

            colorSelect.addEventListener("change", function() {
                CONFIG.bodyColors[part.key] = parseInt(colorSelect.value);
                colorPreview.style.backgroundColor = getColorHex(colorSelect.value);
                saveConfig();
                if (previewData) previewData.redraw();
                refreshActionAvailability();
            });

            colorItem.appendChild(colorPreview);
            colorItem.appendChild(colorLabel);
            colorItem.appendChild(colorSelect);
            colorsGrid.appendChild(colorItem);
        });

        colorsSection.appendChild(colorsGrid);

        const guiSection = document.createElement("div");
        guiSection.className = "config-settings-section";
        guiSection.innerHTML = '<div class="config-settings-label">GUI Colors</div>';

        const presetRow = document.createElement("div");
        presetRow.className = "config-theme-preset-row";

        const presetLabel = document.createElement("div");
        presetLabel.className = "config-theme-label";
        presetLabel.textContent = "Preset";

        const presetSelect = document.createElement("select");
        presetSelect.className = "config-color-select";

        Object.entries(THEME_PRESETS).forEach(function(entry) {
            const key = entry[0];
            const preset = entry[1];
            const option = document.createElement("option");
            option.value = key;
            option.textContent = preset.name;
            presetSelect.appendChild(option);
        });

        presetSelect.addEventListener("change", function() {
            const preset = THEME_PRESETS[presetSelect.value];
            if (!preset) return;

            CONFIG.guiTheme = { ...DEFAULT_THEME, ...preset.values };
            saveConfig();
            applyThemeVars(document.documentElement);
            setStatus(`GUI preset changed to ${preset.name}`, "success");

            const panel = document.querySelector(".config-settings-container");
            if (panel) {
                const activeTab = document.querySelector(".config-hub-tab.active")?.dataset.tab || "settings";
                const settingsContent = document.querySelector('[data-content="settings"]');
                if (settingsContent) {
                    settingsContent.innerHTML = "";
                    settingsContent.appendChild(createSettingsPanel());
                    const tab = document.querySelector(`[data-tab="${activeTab}"]`);
                    const content = document.querySelector(`[data-content="${activeTab}"]`);
                    if (tab && content) {
                        document.querySelectorAll(".config-hub-tab").forEach(t => t.classList.remove("active"));
                        document.querySelectorAll(".config-hub-tab-content").forEach(c => c.classList.remove("active"));
                        tab.classList.add("active");
                        content.classList.add("active");
                    }
                }
            }
        });

        presetRow.appendChild(presetLabel);
        presetRow.appendChild(presetSelect);

        guiSection.appendChild(presetRow);
        guiSection.appendChild(makeThemeInput("Primary", "primary"));
        guiSection.appendChild(makeThemeInput("Accent", "accent"));
        guiSection.appendChild(makeThemeInput("Background", "bg"));
        guiSection.appendChild(makeThemeInput("Panel", "bgSecondary"));
        guiSection.appendChild(makeThemeInput("Text", "textBright"));

        const previewSection = document.createElement("div");
        previewSection.className = "config-settings-section";
        previewSection.innerHTML = '<div class="config-settings-label">Preview Tab</div>';

        const toggleContainer = document.createElement("div");
        toggleContainer.className = "config-toggle-container";

        const toggleLabel = document.createElement("span");
        toggleLabel.textContent = "Show preview tab";
        toggleLabel.className = "config-toggle-label";

        const toggleSwitch = document.createElement("label");
        toggleSwitch.className = "config-switch";

        const toggleInput = document.createElement("input");
        toggleInput.type = "checkbox";
        toggleInput.checked = CONFIG.avatarPreview.enabled;

        const toggleSlider = document.createElement("span");
        toggleSlider.className = "config-slider";

        toggleInput.addEventListener("change", function() {
            CONFIG.avatarPreview.enabled = toggleInput.checked;
            saveConfig();

            const previewTab = document.querySelector('[data-tab="preview"]');
            if (previewTab) {
                previewTab.style.display = CONFIG.avatarPreview.enabled ? "block" : "none";
            }
        });

        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(toggleSlider);
        toggleContainer.appendChild(toggleLabel);
        toggleContainer.appendChild(toggleSwitch);
        previewSection.appendChild(toggleContainer);

        const resetBtn = document.createElement("button");
        resetBtn.className = "config-hub-btn config-reset-btn";
        resetBtn.textContent = "Reset to Default Config";
        resetBtn.onclick = function() {
            if (confirm("Reset all settings to the default config?")) {
                Object.assign(CONFIG, DEFAULT_CONFIG);
                CONFIG.bodyColors = { ...DEFAULT_CONFIG.bodyColors };
                CONFIG.avatarPreview = { ...DEFAULT_CONFIG.avatarPreview };
                CONFIG.guiTheme = { ...DEFAULT_THEME };
                saveConfig();
                location.reload();
            }
        };

        container.appendChild(nameSection);
        container.appendChild(gameSection);
        container.appendChild(colorsSection);
        container.appendChild(guiSection);
        container.appendChild(previewSection);
        container.appendChild(resetBtn);

        return container;
    }

    function createUI() {
        if (document.getElementById("config-hub")) return;

        applyThemeVars(document.documentElement);

        const css = document.createElement("style");
        css.textContent = `
            .config-hub {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 2147483646;
                font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
                font-size: 12px;
                user-select: none;
            }

            .config-hub-panel {
                width: 330px;
                max-height: 84vh;
                background: linear-gradient(180deg, var(--cbh-panel), var(--cbh-bg));
                border: 1px solid var(--cbh-border-accent);
                border-radius: 14px;
                overflow-y: auto;
                overflow-x: hidden;
                box-shadow: 0 18px 50px rgba(0,0,0,0.5), 0 0 36px var(--cbh-glow);
                backdrop-filter: blur(10px);
            }

            .config-hub-panel::-webkit-scrollbar {
                width: 6px;
            }

            .config-hub-panel::-webkit-scrollbar-track {
                background: var(--cbh-primary-dark);
            }

            .config-hub-panel::-webkit-scrollbar-thumb {
                background: var(--cbh-border);
            }

            .config-hub-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 14px;
                background: linear-gradient(135deg, var(--cbh-primary-dark), var(--cbh-bg-secondary));
                border-bottom: 1px solid var(--cbh-border-accent);
                cursor: move;
                gap: 8px;
                position: sticky;
                top: 0;
                z-index: 2;
            }

            .config-hub-title {
                color: var(--cbh-text-bright);
                font-weight: 800;
                font-size: 12px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .config-hub-version {
                color: var(--cbh-text-dim);
                font-size: 10px;
                margin-left: auto;
            }

            .config-hub-toggle {
                width: 22px;
                height: 22px;
                background: transparent;
                border: 1px solid var(--cbh-border);
                border-radius: 6px;
                color: var(--cbh-text-dim);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                line-height: 1;
            }

            .config-hub-toggle:hover {
                border-color: var(--cbh-border-accent);
                color: var(--cbh-text-bright);
            }

            .config-hub-tabs {
                display: flex;
                border-bottom: 1px solid var(--cbh-border);
                background: var(--cbh-bg-secondary);
                position: sticky;
                top: 47px;
                z-index: 2;
            }

            .config-hub-tab {
                flex: 1;
                padding: 9px 8px;
                background: transparent;
                border: none;
                color: var(--cbh-text-dim);
                cursor: pointer;
                font-size: 10px;
                font-family: inherit;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid transparent;
                transition: all 0.15s;
            }

            .config-hub-tab.active {
                color: var(--cbh-primary-light);
                border-bottom-color: var(--cbh-primary-light);
            }

            .config-hub-tab:hover {
                color: var(--cbh-text-bright);
            }

            .config-hub-tab-content {
                display: none;
            }

            .config-hub-tab-content.active {
                display: block;
            }

            .config-hub-body {
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .config-hub-separator {
                height: 1px;
                background: var(--cbh-border);
                margin: 4px 0;
            }

            .config-hub-btn {
                width: 100%;
                padding: 10px 12px;
                background: linear-gradient(180deg, var(--cbh-bg-tertiary), var(--cbh-bg-secondary));
                border: 1px solid var(--cbh-border);
                border-radius: 9px;
                color: var(--cbh-text);
                cursor: pointer;
                text-align: left;
                font-size: 11px;
                font-family: inherit;
                transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s, opacity 0.15s;
                letter-spacing: 0.2px;
            }

            .config-hub-btn:hover:not(:disabled) {
                border-color: var(--cbh-border-accent);
                background: linear-gradient(180deg, var(--cbh-bg-secondary), var(--cbh-bg-tertiary));
                color: var(--cbh-text-bright);
                transform: translateY(-1px);
                box-shadow: 0 0 18px var(--cbh-glow);
            }

            .config-hub-btn:active:not(:disabled) {
                background: var(--cbh-primary-dark);
                transform: translateY(0);
            }

            .config-hub-btn:disabled {
                opacity: 0.45;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .config-hub-btn-accent {
                border-color: var(--cbh-primary-light);
                background: linear-gradient(135deg, var(--cbh-primary-dark), var(--cbh-primary));
                color: var(--cbh-text-bright);
                font-weight: 800;
                box-shadow: 0 0 22px var(--cbh-glow);
            }

            .config-preview-container {
                padding: 14px;
                text-align: center;
            }

            .config-avatar-card {
                background: radial-gradient(circle at top, var(--cbh-glow), rgba(6,17,31,0.85) 55%);
                border: 1px solid var(--cbh-border);
                border-radius: 13px;
                padding: 14px;
                box-shadow: inset 0 0 22px rgba(22,133,255,0.08);
            }

            .config-avatar-stage {
                position: relative;
                height: 255px;
                border: 1px solid var(--cbh-border);
                border-radius: 12px;
                background: linear-gradient(180deg, var(--cbh-bg-secondary), var(--cbh-bg));
                overflow: hidden;
                margin-bottom: 12px;
                perspective: 700px;
            }

            .config-r6-avatar {
                position: absolute;
                left: 50%;
                top: 28px;
                width: 142px;
                height: 190px;
                transform: translateX(-50%) rotateX(0deg) rotateY(-12deg);
                transform-style: preserve-3d;
            }

            .config-r6-part {
                position: absolute;
                border: 2px solid rgba(0,0,0,0.45);
                box-shadow: inset -10px -12px 0 rgba(0,0,0,0.13), inset 6px 6px 0 rgba(255,255,255,0.14), 0 12px 22px rgba(0,0,0,0.2);
            }

            .config-r6-head {
                width: 56px;
                height: 56px;
                left: 43px;
                top: 0;
                border-radius: 5px;
                z-index: 5;
            }

            .config-r6-torso {
                width: 58px;
                height: 72px;
                left: 42px;
                top: 58px;
                border-radius: 5px;
                z-index: 4;
            }

            .config-r6-left-arm {
                width: 28px;
                height: 72px;
                left: 13px;
                top: 58px;
                border-radius: 5px;
                z-index: 3;
            }

            .config-r6-right-arm {
                width: 28px;
                height: 72px;
                left: 101px;
                top: 58px;
                border-radius: 5px;
                z-index: 3;
            }

            .config-r6-left-leg {
                width: 29px;
                height: 70px;
                left: 42px;
                top: 131px;
                border-radius: 5px;
                z-index: 2;
            }

            .config-r6-right-leg {
                width: 29px;
                height: 70px;
                left: 72px;
                top: 131px;
                border-radius: 5px;
                z-index: 2;
            }

            .config-r6-face {
                position: absolute;
                inset: 0;
                pointer-events: none;
                user-select: none;
            }

            .config-r6-eye {
                position: absolute;
                top: 19px;
                width: 5px;
                height: 10px;
                background: #111111;
                border-radius: 50%;
            }

            .config-r6-eye-left {
                left: 15px;
            }

            .config-r6-eye-right {
                right: 15px;
            }

            .config-r6-mouth {
                position: absolute;
                left: 18px;
                top: 34px;
                width: 20px;
                height: 9px;
                border-bottom: 4px solid #111111;
                border-radius: 0 0 999px 999px;
            }

            .config-avatar-shadow {
                position: absolute;
                left: 50%;
                bottom: 25px;
                width: 135px;
                height: 26px;
                transform: translateX(-50%);
                border-radius: 50%;
                background: rgba(0,0,0,0.35);
                filter: blur(4px);
            }

            .config-avatar-title {
                color: var(--cbh-text-bright);
                font-weight: 800;
                font-size: 13px;
                margin-bottom: 4px;
            }

            .config-avatar-subtitle {
                color: var(--cbh-text-dim);
                font-size: 11px;
                line-height: 1.35;
                margin-bottom: 10px;
            }

            .config-avatar-color-summary {
                display: grid;
                grid-template-columns: 1fr;
                gap: 5px;
                margin-bottom: 10px;
            }

            .config-color-pill {
                display: flex;
                align-items: center;
                gap: 7px;
                color: var(--cbh-text);
                font-size: 10px;
                background: rgba(255,255,255,0.035);
                border: 1px solid var(--cbh-border);
                border-radius: 8px;
                padding: 5px 7px;
                text-align: left;
            }

            .config-color-pill span {
                width: 14px;
                height: 14px;
                border-radius: 4px;
                border: 1px solid rgba(255,255,255,0.25);
                flex-shrink: 0;
            }

            .config-color-pill b {
                font-weight: 500;
            }

            .config-refresh-btn {
                text-align: center;
            }

            .config-settings-container {
                padding: 12px;
            }

            .config-settings-section {
                margin-bottom: 16px;
            }

            .config-settings-label {
                color: var(--cbh-text-bright);
                font-size: 11px;
                font-weight: 700;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .config-settings-input {
                width: 100%;
                padding: 8px;
                background: var(--cbh-input-bg);
                border: 1px solid var(--cbh-input-border);
                border-radius: 8px;
                color: var(--cbh-text-bright);
                font-size: 12px;
                font-family: inherit;
                outline: none;
                box-sizing: border-box;
            }

            .config-settings-input:focus {
                border-color: var(--cbh-input-focus);
            }

            .config-colors-grid {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .config-color-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 0;
            }

            .config-color-preview {
                width: 20px;
                height: 20px;
                border: 1px solid var(--cbh-border);
                border-radius: 5px;
                flex-shrink: 0;
            }

            .config-color-label {
                color: var(--cbh-text);
                font-size: 11px;
                width: 65px;
                flex-shrink: 0;
            }

            .config-color-select {
                flex: 1;
                min-width: 0;
                padding: 5px 6px;
                background: var(--cbh-input-bg);
                border: 1px solid var(--cbh-input-border);
                border-radius: 7px;
                color: var(--cbh-text-bright);
                font-size: 11px;
                font-family: inherit;
                outline: none;
                cursor: pointer;
            }

            .config-color-select:focus {
                border-color: var(--cbh-input-focus);
            }

            .config-theme-preset-row,
            .config-theme-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding: 4px 0;
            }

            .config-theme-label {
                color: var(--cbh-text);
                font-size: 11px;
                width: 82px;
                flex-shrink: 0;
                text-align: left;
            }

            .config-theme-color {
                width: 100%;
                height: 28px;
                background: var(--cbh-input-bg);
                border: 1px solid var(--cbh-input-border);
                border-radius: 7px;
                padding: 2px;
                cursor: pointer;
            }

            .config-toggle-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .config-toggle-label {
                color: var(--cbh-text);
                font-size: 11px;
            }

            .config-switch {
                position: relative;
                width: 40px;
                height: 20px;
                display: inline-block;
            }

            .config-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .config-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--cbh-bg-tertiary);
                border: 1px solid var(--cbh-border);
                border-radius: 20px;
                transition: 0.2s;
            }

            .config-slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 2px;
                bottom: 2px;
                border-radius: 50%;
                background: var(--cbh-text-dim);
                transition: 0.2s;
            }

            .config-switch input:checked + .config-slider {
                background: var(--cbh-primary-dark);
                border-color: var(--cbh-border-accent);
            }

            .config-switch input:checked + .config-slider:before {
                transform: translateX(20px);
                background: var(--cbh-primary-light);
            }

            .config-reset-btn {
                width: 100%;
                margin-top: 8px;
                color: var(--cbh-danger) !important;
                border-color: var(--cbh-danger) !important;
                background: rgba(217,54,54,0.05) !important;
            }

            .config-reset-btn:hover:not(:disabled) {
                background: rgba(217,54,54,0.15) !important;
            }

            .config-hub-footer {
                padding: 7px 12px;
                border-top: 1px solid var(--cbh-border);
                display: flex;
                align-items: center;
                gap: 7px;
                position: sticky;
                bottom: 0;
                background: var(--cbh-primary-dark);
                z-index: 2;
            }

            .config-hub-indicator {
                width: 7px;
                height: 7px;
                background: var(--cbh-primary-light);
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 10px var(--cbh-primary-light);
                flex-shrink: 0;
            }

            .config-hub-status {
                color: var(--cbh-text-dim);
                font-size: 10px;
                letter-spacing: 0.3px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
        document.head.appendChild(css);

        const root = document.createElement("div");
        root.id = "config-hub";
        root.className = "config-hub";

        const panel = document.createElement("div");
        panel.className = "config-hub-panel";

        const header = document.createElement("div");
        header.className = "config-hub-header";
        header.innerHTML = '<span class="config-hub-title">Config Hub</span><span class="config-hub-version">v7.2</span><button class="config-hub-toggle" id="config-toggle">_</button>';

        const tabsContainer = document.createElement("div");
        tabsContainer.className = "config-hub-tabs";

        const toolsTab = document.createElement("button");
        toolsTab.className = "config-hub-tab active";
        toolsTab.textContent = "Tools";
        toolsTab.dataset.tab = "tools";

        const previewTab = document.createElement("button");
        previewTab.className = "config-hub-tab";
        previewTab.textContent = "Preview";
        previewTab.dataset.tab = "preview";
        previewTab.style.display = CONFIG.avatarPreview.enabled ? "block" : "none";

        const settingsTab = document.createElement("button");
        settingsTab.className = "config-hub-tab";
        settingsTab.textContent = "Config";
        settingsTab.dataset.tab = "settings";

        tabsContainer.appendChild(toolsTab);
        tabsContainer.appendChild(previewTab);
        tabsContainer.appendChild(settingsTab);

        const toolsContent = document.createElement("div");
        toolsContent.className = "config-hub-tab-content active";
        toolsContent.dataset.content = "tools";

        const previewContent = document.createElement("div");
        previewContent.className = "config-hub-tab-content";
        previewContent.dataset.content = "preview";

        const settingsContent = document.createElement("div");
        settingsContent.className = "config-hub-tab-content";
        settingsContent.dataset.content = "settings";

        const body = document.createElement("div");
        body.className = "config-hub-body";

        function createButton(text, onClick, accent) {
            const btn = document.createElement("button");
            btn.className = "config-hub-btn" + (accent ? " config-hub-btn-accent" : "");
            btn.textContent = text;
            btn.dataset.defaultText = text;
            btn.onclick = function() { onClick(btn); };
            return btn;
        }

        body.appendChild(createButton("Go To Saved Game", function() {
            const url = (CONFIG.redirectUrl || DEFAULT_CONFIG.redirectUrl || "").trim();
            window.location.href = url || "https://www.roblox.com/games/5987922834/Transfur-Outbreak";
        }));

        const sep = document.createElement("div");
        sep.className = "config-hub-separator";
        body.appendChild(sep);

        avatarBtn = createButton("Apply Avatar Config", handleApplyAvatar);
        nameBtn = createButton("Set Display Name", handleSetName);
        allBtn = createButton("Apply Full Config", handleApplyFullConfig, true);

        body.appendChild(avatarBtn);
        body.appendChild(nameBtn);
        body.appendChild(allBtn);

        toolsContent.appendChild(body);

        previewData = createConfiguredAvatarPreview();
        previewContent.appendChild(previewData.container);

        settingsContent.appendChild(createSettingsPanel());

        function switchTab(tabName) {
            var allTabs = document.querySelectorAll(".config-hub-tab");
            var allContents = document.querySelectorAll(".config-hub-tab-content");

            for (var i = 0; i < allTabs.length; i++) {
                allTabs[i].classList.remove("active");
            }
            for (var j = 0; j < allContents.length; j++) {
                allContents[j].classList.remove("active");
            }

            var tab = document.querySelector('[data-tab="' + tabName + '"]');
            var content = document.querySelector('[data-content="' + tabName + '"]');

            if (tab) tab.classList.add("active");
            if (content) content.classList.add("active");
        }

        toolsTab.addEventListener("click", function() { switchTab("tools"); });
        previewTab.addEventListener("click", function() { switchTab("preview"); });
        settingsTab.addEventListener("click", function() { switchTab("settings"); });

        const footer = document.createElement("div");
        footer.className = "config-hub-footer";
        footer.innerHTML = '<span class="config-hub-indicator"></span><span class="config-hub-status">Starting...</span>';
        statusEl = footer.querySelector(".config-hub-status");

        panel.appendChild(header);
        panel.appendChild(tabsContainer);
        panel.appendChild(toolsContent);
        panel.appendChild(previewContent);
        panel.appendChild(settingsContent);
        panel.appendChild(footer);
        root.appendChild(panel);
        document.body.appendChild(root);

        var dragging = false, offsetX, offsetY;

        header.addEventListener("mousedown", function(e) {
            if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
            dragging = true;
            var rect = root.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            root.style.transition = "none";
        });

        document.addEventListener("mousemove", function(e) {
            if (!dragging) return;
            root.style.left = (e.clientX - offsetX) + "px";
            root.style.top = (e.clientY - offsetY) + "px";
            root.style.right = "auto";
            root.style.transform = "none";
        });

        document.addEventListener("mouseup", function() {
            dragging = false;
            root.style.transition = "";
        });

        var collapsed = false;

        document.getElementById("config-toggle").onclick = function () {
            collapsed = !collapsed;

            if (collapsed) {
                tabsContainer.style.display = "none";
                footer.style.display = "none";

                toolsContent.style.display = "none";
                previewContent.style.display = "none";
                settingsContent.style.display = "none";

                panel.style.maxHeight = "47px";
            } else {
                tabsContainer.style.display = "flex";
                footer.style.display = "flex";

                toolsContent.style.display = "";
                previewContent.style.display = "";
                settingsContent.style.display = "";

                panel.style.maxHeight = "84vh";
            }

            this.textContent = collapsed ? "+" : "_";
        };

        setStatus("Starting...", "working");
        refreshActionAvailability();
    }

    if (document.body) {
        createUI();
    } else {
        window.addEventListener("DOMContentLoaded", createUI);
    }
})();
