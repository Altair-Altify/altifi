/* ---------- Me tab + profile editor (from altifi-base.html) ---------- */
import { $, esc, clone, shortVnd } from "../core/util";
import { S, save, resetState, lessonsDone, type Profile } from "../core/state";
import { reg } from "../core/actions";
import { t, tx, lang } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { DOMAINS } from "../content/domains";
import { BN, openO, closeO, render, setOvRerender } from "./shell";
import { sheet, closeSheet } from "./fx";
import { COUNTRIES, country, countryName, wxName, pickWx, updateWeather, wxHTML } from "./weather";
import { curLvl } from "../assistant/assistant";
import { icon, IC } from "./icons";
import { coverScene, COVERS, areaChart } from "./scenes";
import { getCoverImg } from "./settings";
import { BADGES, checkBadges } from "../content/badges";

function profCard(p: Profile) {
  const c = country(p.country), ini = (p.name.trim()[0] || "?").toUpperCase();
  return `<div class="avatar">${esc(ini)}</div><div class="pname">${esc(p.name.trim() || t("me.yourName"))}</div>
    <div class="pbio">${p.bio.trim() ? esc(p.bio.trim()) : `<span class="muted">${t("me.noBio")}</span>`}</div>
    <div class="pchips"><span>${c[0]} ${countryName(p.country)}</span><span>🎂 ${p.age}</span></div>`;
}

function coverHTML() {
  const img = S.p.cover === "photo" ? getCoverImg() : null;
  return img ? `<div class="mecover-img" style="background-image:url('${img}')"></div>` : coverScene(S.p.cover || "town", document.body.classList.contains("night"));
}
function badgeShelf() {
  const got = new Set(S.badges);
  return `<div class="card shelf"><div class="shelf-h"><h3>${icon("medal", { size: 22, color: "var(--pri)" })} ${t("me.badges")}</h3><span class="muted">${t("me.badgesCount", { n: BADGES.filter((b) => got.has(b.id)).length, m: BADGES.length })}</span></div>
    <div class="shelf-grid">${BADGES.map((b) => {
      const on = got.has(b.id);
      return `<button class="medal ${on ? "on" : "off"}" onclick="A.badgeInfo('${b.id}')" aria-label="${esc(tx(b.name))} — ${on ? t("me.badgeGot") : t("me.badgeLocked")}"><span class="mdisc" style="${on ? `background:${b.color}` : ""}">${icon(b.ic, { size: 26, color: on ? "#fff" : "var(--lockd)", tint: on ? 0.35 : 0.2 })}${on ? "" : `<span class="mlock">${icon("lock", { size: 12, color: "var(--muted)" })}</span>`}</span><span class="mname">${esc(tx(b.name))}</span></button>`;
    }).join("")}</div></div>`;
}
function nwCard() {
  const hist = Array.isArray((S.game as any)?.history) ? ((S.game as any).history as number[]) : [];
  const body = hist.length >= 2 ? areaChart(hist)
    : `<div class="nwempty">${lion(52, "wow")}<p class="muted">${t("me.nwEmpty")}</p></div>`;
  return `<div class="card nwchart"><div class="shelf-h"><h3>${icon("wallet", { size: 22, color: IC.wallet })} ${t("me.nwChart")}</h3><b class="nwnow">${S.game ? `<span data-ck="nw2" data-to="${S.game.netWorth}" data-fmt="vnd">${shortVnd(S.game.netWorth, lang())}</span>` : "—"}</b></div>${body}</div>`;
}

export function meView() {
  if (checkBadges(S).length) save();
  const time = new Date(S.lastOpen).toLocaleTimeString(lang() === "vi" ? "vi-VN" : "en-US", { hour: "2-digit", minute: "2-digit" });
  const total = DOMAINS.reduce((a, d) => a + d.lessons.length, 0);
  const lv = curLvl(), p = S.p, c = country(p.country), ini = (p.name.trim()[0] || "?").toUpperCase();
  const stat = (ic: string, color: string, key: string, val: number, label: string, extra = "") => `<div class="mestat">${icon(ic, { size: 26, color, tint: 0.3 })}<b data-ck="${key}" data-to="${val}">${val}</b>${extra}<span>${label}</span></div>`;
  return `<section class="mehead">
      <div class="mecover">${coverHTML()}<button class="covbtn" onclick="A.pickCover()" aria-label="${t("me.cover")}">${icon("camera", { size: 18 })}</button></div>
      <div class="meid"><div class="avatar big">${esc(ini)}</div><div class="pname">${esc(p.name.trim() || t("me.yourName"))}</div>
      <div class="pbio">${p.bio.trim() ? esc(p.bio.trim()) : `<span class="muted">${t("me.noBio")}</span>`}</div>
      <div class="pchips"><span>${c[0]} ${countryName(p.country)}</span><span>${p.age} ${lang() === "vi" ? "tuổi" : "yrs"}</span></div>
      <button class="btn ghost sm editp" onclick="A.openProfile()">${icon("pencil", { size: 16 })} ${t("me.editProfile").replace("✏️ ", "")}</button></div>
    </section>
    <div class="mestats">
      ${stat("flame", IC.flame, "ms-streak", S.streak, t("me.streak"))}
      ${stat("star", IC.star, "ms-xp", S.xp, t("me.xp"))}
      ${stat("learn", "#5B5BD6", "ms-les", lessonsDone(), t("me.lessons"), `<small>/${total}</small>`)}
      ${stat("trophy", "#8E44AD", "ms-cases", Array.isArray((S.game as any)?.cases) ? (S.game as any).cases.length : 0, t("me.cases"))}
    </div>
    ${nwCard()}
    ${badgeShelf()}
    <div class="card budcard"><button class="mascotbtn" onclick="A.openCustom()" aria-label="${t("bd.customizeAria")}">${lion(62)}<span class="editdot">${icon("pencil", { size: 14, color: "var(--pri)" })}</span></button><div style="flex:1;min-width:0"><div class="muted" style="font-size:11px;font-weight:900;letter-spacing:.5px">${t("me.yourBuddy")}</div><h3 style="overflow:hidden;text-overflow:ellipsis">${BN()}</h3><div class="muted" style="font-size:12px;font-weight:800">${t("me.level", { name: BN() })}: ${t("as.lvl." + lv)}</div></div><button class="btn ghost sm" onclick="A.openCustom()">${icon("palette", { size: 16 })} ${t("me.customize").replace("🎨 ", "")}</button></div>
    <div class="card"><h3>${icon("bell", { size: 20, color: "#F2A33A" })} ${t("me.reminder").replace("🔔 ", "")}</h3><p class="muted" style="font-weight:700">${t("me.reminderText", { time })}</p><button class="btn ghost" onclick="A.toast()">${t("me.preview")}</button></div>
    <button class="btn bad" onclick="A.askReset()">${icon("refresh", { size: 18, color: "#fff" })} ${t("me.reset")}</button>`;
}

function pickCover() {
  const names = t("me.coverNames").split("|");
  const night = document.body.classList.contains("night");
  sheet(`<h2>${t("me.coverPick")}</h2><div class="covgrid">${COVERS.map((id, i) => `<button class="covtile ${S.p.cover === id ? "on" : ""}" onclick="A.setCover('${id}')"><span>${coverScene(id, night)}</span>${names[i]}</button>`).join("")}
    <button class="covtile ${S.p.cover === "photo" ? "on" : ""}" onclick="A.askPhotos('cover')"><span class="covup">${getCoverImg() ? `<i style="background-image:url('${getCoverImg()}')"></i>` : icon("camera", { size: 30, color: "var(--pri)" })}</span>${t("me.coverPhoto")}</button></div>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
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
  openO(`<div class="chead"><button class="backbtn" onclick="A.profBack()" aria-label="${t("c.back")}">${icon("back", { size: 22 })}</button><b>${t("pf.title")}</b><button class="savebtn${isDirtyP() ? " show" : ""}" id="savebtn" onclick="A.profSave()">${t("c.save")}</button></div>
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
  openProfile, profSave, profBack, pickCover,
  setCover(id: string) { S.p.cover = id; save(); closeSheet(); render(); },
  badgeInfo(id: string) {
    const b = BADGES.find((x) => x.id === id);
    if (!b) return;
    const on = S.badges.includes(id);
    sheet(`<div class="badgebig" style="background:${on ? b.color : "var(--lock)"}">${icon(b.ic, { size: 60, color: "#fff", tint: 0.35 })}</div><h2>${esc(tx(b.name))}</h2><p class="muted" style="font-weight:800">${on ? t("me.badgeGot") + " · " : ""}${esc(tx(b.how))}</p>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
  },
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
