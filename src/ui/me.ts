/* ---------- Me tab + profile editor (from altifi-base.html) ---------- */
import { $, esc, clone, shortVnd } from "../core/util";
import { S, save, resetState, lessonsDone, type Profile } from "../core/state";
import { reg } from "../core/actions";
import { t, lang } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { DOMAINS } from "../content/domains";
import { BN, openO, closeO, render, setOvRerender } from "./shell";
import { sheet, closeSheet } from "./fx";
import { COUNTRIES, country, countryName, wxName, pickWx, updateWeather, wxHTML } from "./weather";
import { curLvl } from "../assistant/assistant";

function profCard(p: Profile) {
  const c = country(p.country), ini = (p.name.trim()[0] || "?").toUpperCase();
  return `<div class="avatar">${esc(ini)}</div><div class="pname">${esc(p.name.trim() || t("me.yourName"))}</div>
    <div class="pbio">${p.bio.trim() ? esc(p.bio.trim()) : `<span class="muted">${t("me.noBio")}</span>`}</div>
    <div class="pchips"><span>${c[0]} ${countryName(p.country)}</span><span>🎂 ${p.age}</span></div>`;
}

export function meView() {
  const time = new Date(S.lastOpen).toLocaleTimeString(lang() === "vi" ? "vi-VN" : "en-US", { hour: "2-digit", minute: "2-digit" });
  const total = DOMAINS.reduce((a, d) => a + d.lessons.length, 0);
  const lv = curLvl();
  return `<div class="card center">${profCard(S.p)}<button class="btn ghost" style="margin-top:14px" onclick="A.openProfile()">${t("me.editProfile")}</button></div>
   <div class="card budcard"><button class="mascotbtn" onclick="A.openCustom()" aria-label="${t("bd.customizeAria")}">${lion(62)}<span class="editdot">✏️</span></button><div style="flex:1;min-width:0"><div class="muted" style="font-size:11px;font-weight:900;letter-spacing:.5px">${t("me.yourBuddy")}</div><h3 style="overflow:hidden;text-overflow:ellipsis">${BN()}</h3><div class="muted" style="font-size:12px;font-weight:800">${t("me.level", { name: BN() })}: ${t("as.lvl." + lv)}</div></div><button class="btn ghost sm" onclick="A.openCustom()">${t("me.customize")}</button></div>
   <div class="grid" style="margin-bottom:14px">
    <div class="card"><b>🔥 ${S.streak}</b><span class="muted">${t("me.streak")}</span></div>
    <div class="card"><b style="color:var(--sun-d)">⭐ ${S.xp}</b><span class="muted">${t("me.xp")}</span></div>
    <div class="card"><b>${lessonsDone()}/${total}</b><span class="muted">${t("me.lessons")}</span></div>
    <div class="card"><b style="font-size:18px">${S.game ? shortVnd(S.game.netWorth, lang()) : "—"}</b><span class="muted">💰 ${t("me.nw")}</span></div></div>
   <div class="card"><h3>${t("me.reminder")}</h3><p class="muted" style="font-weight:700">${t("me.reminderText", { time })}</p><button class="btn ghost" onclick="A.toast()">${t("me.preview")}</button></div>
   <button class="btn bad" onclick="A.askReset()">${t("me.reset")}</button>`;
}

/* ---------- Profile editor ---------- */
let P: Profile | null = null;
const isDirtyP = () => JSON.stringify({ ...P!, name: P!.name.trim(), bio: P!.bio.trim() }) !== JSON.stringify(S.p);
const wxNote = (c: string) => t("pf.wx", { c: countryName(c), w: country(c)[3].map(wxName).join(" · ") });

function openProfile() {
  P = clone(S.p);
  drawProfile();
  setOvRerender(drawProfile);
}
function drawProfile() {
  if (!P) return;
  const opts = Object.keys(COUNTRIES).map((k) => `<option value="${k}" ${P!.country === k ? "selected" : ""}>${COUNTRIES[k][0]} ${countryName(k)}</option>`).join("");
  openO(`<div class="chead"><button class="backbtn" onclick="A.profBack()" aria-label="${t("c.back")}">←</button><b>${t("pf.title")}</b><button class="savebtn${isDirtyP() ? " show" : ""}" id="savebtn" onclick="A.profSave()">${t("c.save")}</button></div>
    <div class="obody">
      <div class="stage pstage" id="pprev">${profCard(P)}</div>
      <label class="flabel" for="pName">${t("me.yourName")}</label>
      <div class="namebox solo"><input id="pName" maxlength="20" autocomplete="off" value="${esc(P.name)}" oninput="A.profSet('name',this.value)" placeholder="${t("pf.namePh")}"></div>
      <label class="flabel" for="pBio"><span>${t("pf.bio")}</span><span id="bioCnt">${P.bio.length}/120</span></label>
      <textarea id="pBio" class="biobox" maxlength="120" placeholder="${t("pf.bioPh")}" oninput="A.profSet('bio',this.value)">${esc(P.bio)}</textarea>
      <div class="prow">
        <div class="pcol wide"><label class="flabel" for="pCountry">${t("pf.country")}</label><select id="pCountry" class="selbox" onchange="A.profSet('country',this.value)">${opts}</select></div>
        <div class="pcol"><span class="flabel" id="ageLbl">${t("pf.age")}</span><div class="stepper" role="group" aria-labelledby="ageLbl"><button onclick="A.ageStep(-1)" aria-label="${t("pf.younger")}">−</button><b id="ageVal" aria-live="polite">${P.age}</b><button onclick="A.ageStep(1)" aria-label="${t("pf.older")}">+</button></div></div>
      </div>
      <p class="muted wxnote" id="wxnote">${wxNote(P.country)}</p>
    </div><div id="cmodal"></div>`);
}
function profRefresh() {
  const pv = $("#pprev");
  if (!pv || !P) return;
  pv.innerHTML = profCard(P);
  $("#wxnote")!.innerHTML = wxNote(P.country);
  $("#savebtn")!.classList.toggle("show", isDirtyP());
}
function savedFx(btn: HTMLElement, msg: string) {
  btn.textContent = t("c.saved"); btn.classList.add("done");
  const m = document.createElement("div"); m.className = "minitoast"; m.textContent = msg; $("#overlay")!.appendChild(m);
  setTimeout(() => m.remove(), 1900);
  setTimeout(() => { btn.classList.remove("show"); setTimeout(() => { btn.textContent = t("c.save"); btn.classList.remove("done"); }, 300); }, 1100);
}
function profSave() {
  if (!P) return;
  P.name = P.name.trim() || t("pf.you"); P.bio = P.bio.trim();
  ($("#pName") as HTMLInputElement).value = P.name; ($("#pBio") as HTMLTextAreaElement).value = P.bio;
  const moved = P.country !== S.p.country;
  S.p = clone(P); save();
  if (moved) { pickWx(); updateWeather(); const ow = document.querySelector("#overlay>.wx"); if (ow && S.set.wx) ow.outerHTML = wxHTML(); }
  $("#pprev")!.innerHTML = profCard(P);
  savedFx($("#savebtn")!, t("pf.saved", { name: P.name }));
}
function profBack() {
  if (!isDirtyP()) { P = null; return closeO(); }
  sheet(`<div style="display:inline-block">${lion(80, "sad")}</div><h2>${t("c.leaveQ")}</h2><p class="muted" style="font-weight:700">${t("pf.lost")}</p>`,
    [[t("c.saveChanges"), "A.closeSheet('#cmodal');A.profSave()", "good"], [t("c.leaveNoSave"), "A.closeSheet('#cmodal');A.closeO()", "ghost"]], "#cmodal");
}

reg({
  openProfile, profSave, profBack,
  profSet(k: "name" | "bio" | "country", v: string) {
    if (!P) return;
    (P as any)[k] = v;
    if (k === "bio") $("#bioCnt")!.textContent = v.length + "/120";
    profRefresh();
  },
  ageStep(d: number) { if (!P) return; P.age = Math.max(6, Math.min(99, P.age + d)); $("#ageVal")!.textContent = String(P.age); profRefresh(); },
  askReset() {
    sheet(`<div style="display:inline-block">${lion(80, "wow")}</div><h2>${t("me.resetQ")}</h2><p class="muted" style="font-weight:700">${t("me.resetSub")}</p>`,
      [[t("me.resetYes"), "A.doReset()", "bad"], [t("me.cancel"), "A.closeSheet()", "ghost"]]);
  },
  doReset() {
    closeSheet();
    resetState();
    (window.A as any).afterReset?.();
    pickWx(); updateWeather(); render();
  },
});
