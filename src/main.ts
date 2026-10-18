/* ---------- Altifi entry point ---------- */
import "./styles/base.css";
import "./styles/lesson.css";
import "./styles/app.css";
import "./styles/ui2.css";
import "./styles/galaxy.css";
import "./core/actions";
import { S } from "./core/state";
import { onLangChange } from "./i18n/i18n";
import { setBuddySource } from "./mascot/lion";
import { render, applyTheme, rerenderAll } from "./ui/shell";
import { pickWx } from "./ui/weather";
import { prewarmSky } from "./ui/skybg";
import { minitoast } from "./ui/fx";
import { t } from "./i18n/i18n";
import { clearChats, closeAssistant, assistantOpen, openAssistant } from "./assistant/assistant";
// modules that only register actions
import "./ui/buddy";
import "./ui/me";
import "./ui/settings";
import "./lesson/player";
import { reg } from "./core/actions";

setBuddySource(() => S.m);

onLangChange(() => {
  const wasOpen = assistantOpen();
  closeAssistant();
  rerenderAll();
  if (wasOpen) openAssistant();
});
reg({ afterReset: () => { clearChats(); closeAssistant(); applyTheme(); } });

// Same safety net as the prototype: show a toast instead of failing silently.
window.addEventListener("error", (e) => { try { minitoast("⚠️ " + (e.message || t("c.error"))); } catch { /* */ } });
window.addEventListener("unhandledrejection", () => { try { minitoast("⚠️ " + t("c.error")); } catch { /* */ } });

pickWx();
applyTheme();
render();
// paint the light-galaxy background while the app is idle, so the first switch to Explore/Me/Settings/Play is instant
const idle = (window as any).requestIdleCallback || ((f: () => void) => setTimeout(f, 600));
idle(() => prewarmSky());

// PWA: offline cache + "Add to Home Screen" (production builds only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => { /* file:// or blocked */ }));
}
