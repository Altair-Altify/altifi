/* ---------- Buddy customization page (base demo's page, tiles switched to Alti Lion's eyes/mouths/colors) ---------- */
import { $, esc, clone } from "../core/util";
import { S, save, defaultM, DEFAULT_BUDDY_NAME, type Buddy } from "../core/state";
import { reg } from "../core/actions";
import { t } from "../i18n/i18n";
import { lion, LION_EYES, LION_MOUTHS, LION_COLORS, ACC } from "../mascot/lion";
import { openO, closeO, setOvRerender } from "./shell";
import { sheet } from "./fx";
import { icon } from "./icons";

let D: Buddy | null = null;
let cTab = "face";
const NAMES = ["Alti Lion", "Leo", "Mochi", "Bơ", "Xu", "Coco", "Lucky", "Bún", "Nugget", "Sunny", "Mít", "Kem"];
const CTABS: [string, string, string][] = [["face", "😊", "bd.face"], ["color", "🎨", "bd.color"], ["hat", "🎩", "bd.hats"], ["glasses", "👓", "bd.glasses"], ["extra", "🎀", "bd.extras"]];
const isDirty = () => JSON.stringify({ ...D!, name: D!.name.trim() }) !== JSON.stringify(S.m);
// Vietnamese names for the tiles (English names live in mascot/lion.ts)
const VI: Record<string, string> = {
  Amber: "Hổ phách", Sparkly: "Long lanh", Happy: "Vui", Sleepy: "Buồn ngủ", Wink: "Nháy mắt", Cool: "Ngầu",
  Kitty: "Mèo :3", Smile: "Cười", "Big grin": "Cười toe", Silly: "Lè lưỡi", Ooh: "Ồ", Calm: "Bình thản",
  Rose: "Hồng", Gold: "Vàng", Coral: "San hô", Grape: "Nho", Mint: "Bạc hà", Sky: "Trời xanh",
  "Party hat": "Mũ tiệc", Crown: "Vương miện", Cap: "Mũ lưỡi trai", Beanie: "Mũ len", Graduate: "Mũ tốt nghiệp",
  Round: "Kính tròn", Shades: "Kính râm", Hearts: "Kính tim", "Bow tie": "Nơ", Flower: "Hoa", Headphones: "Tai nghe", Sparkles: "Lấp lánh",
};
const nm = (n: string) => (S.set.lang === "vi" ? VI[n] || n : n);

function openCustom() {
  D = clone(S.m); cTab = "face";
  draw();
  setOvRerender(draw);
}
function draw() {
  if (!D) return;
  openO(`<div class="chead"><button class="backbtn" onclick="A.custBack()" aria-label="${t("c.back")}">${icon("back", { size: 22 })}</button><b>${t("bd.title")}</b><button class="savebtn${isDirty() ? " show" : ""}" id="savebtn" onclick="A.custSave()">${t("c.save")}</button></div>
    <div class="obody">
      <div class="stage"><div class="cprev" id="cprev">${lion(170, "happy", D)}</div><div><span class="nametag" id="cname">${esc(D.name)}</span></div></div>
      <div class="namebox"><label for="nameIn">${t("bd.name")}</label><input id="nameIn" maxlength="12" autocomplete="off" value="${esc(D.name)}" oninput="A.budName(this.value)" placeholder="${t("bd.namePh")}"><button class="dice" onclick="A.randName()" aria-label="${t("bd.random")}">🎲</button></div>
      <div class="ctabs" id="ctabs"></div>
      <div id="ctiles"></div>
      <button class="linkbtn" onclick="A.resetBuddy()">${t("bd.reset")}</button>
    </div><div id="cmodal"></div>`);
  drawTabs(); drawTiles();
}
function drawTabs() {
  $("#ctabs")!.innerHTML = CTABS.map(([k, e, n]) => `<button class="ctab ${cTab === k ? "on" : ""}" onclick="A.budTab('${k}')"><span class="e">${e}</span>${t(n)}</button>`).join("");
}
const tile = (on: boolean, img: string, label: string, click: string) => `<button class="tile ${on ? "on" : ""}" onclick="${click}"><div class="timg">${img}</div>${label}</button>`;
function drawTiles() {
  if (!D) return;
  let h = "";
  const bare = { hat: null, glasses: null, extra: null };
  if (cTab === "face") {
    h += `<div class="sub">${t("bd.eyes")}</div><div class="tilegrid">` + Object.entries(LION_EYES).map(([k, v]) => tile(D!.eyes === k, lion(66, "happy", { ...D!, eyes: k, ...bare }), nm(v.n), `A.setPart('eyes','${k}')`)).join("") + `</div>`;
    h += `<div class="sub">${t("bd.mouth")}</div><div class="tilegrid">` + Object.entries(LION_MOUTHS).map(([k, v]) => tile(D!.mouth === k, lion(66, "happy", { ...D!, mouth: k, ...bare }), nm(v.n), `A.setPart('mouth','${k}')`)).join("") + `</div>`;
  } else if (cTab === "color") {
    h += `<div class="sub">${t("bd.pickColor")}</div><div class="tilegrid">` + Object.entries(LION_COLORS).map(([k, v]) => tile(D!.color === k, lion(66, "happy", { ...D!, color: k }), nm(v.n), `A.setPart('color','${k}')`)).join("") + `</div>`;
  } else {
    const part = cTab as "hat" | "glasses" | "extra";
    const label = { hat: t("bd.tapHat"), glasses: t("bd.tapGlasses"), extra: t("bd.tapExtra") }[part];
    h += `<div class="sub">${label}</div><div class="tilegrid">` + tile(!D[part], `<span class="none">${icon("close", { size: 30 })}</span>`, t("bd.none"), `A.setPart('${part}',null)`)
      + ACC[part].map((a) => tile(D![part] === a.id, `<svg width="70" height="58" viewBox="${a.vb}" aria-hidden="true">${a.tile || a.svg}</svg>`, nm(a.n), `A.setPart('${part}','${a.id}')`)).join("") + `</div>`;
  }
  $("#ctiles")!.innerHTML = h;
}
function refresh(bump: boolean) {
  const p = $("#cprev");
  if (!p || !D) return;
  p.innerHTML = lion(170, "happy", D);
  $("#cname")!.textContent = D.name.trim() || "…";
  if (bump) { p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump"); }
  $("#savebtn")!.classList.toggle("show", isDirty());
}
function custSave() {
  if (!D) return;
  D.name = D.name.trim() || DEFAULT_BUDDY_NAME;
  ($("#nameIn") as HTMLInputElement).value = D.name;
  S.m = clone(D); save();
  const b = $("#savebtn")!; b.textContent = t("c.saved"); b.classList.add("done");
  const p = $("#cprev")!; p.innerHTML = lion(170, "wow", D); p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump");
  const m = document.createElement("div"); m.className = "minitoast"; m.textContent = t("bd.saved", { name: D.name }); $("#overlay")!.appendChild(m);
  setTimeout(() => m.remove(), 1900);
  const keep = clone(D);
  setTimeout(() => { b.classList.remove("show"); setTimeout(() => { b.textContent = t("c.save"); b.classList.remove("done"); if (p.isConnected) p.innerHTML = lion(170, "happy", keep); }, 300); }, 1100);
}
function custBack() {
  if (!D || !isDirty()) { D = null; return closeO(); }
  sheet(`<div style="display:inline-block">${lion(80, "sad", D)}</div><h2>${t("c.leaveQ")}</h2><p class="muted" style="font-weight:700">${t("bd.lost", { name: esc(D.name.trim() || "Alti Lion") })}</p>`,
    [[t("c.saveChanges"), "A.closeSheet('#cmodal');A.custSave()", "good"], [t("c.leaveNoSave"), "A.closeSheet('#cmodal');A.closeO()", "ghost"]], "#cmodal");
}

reg({
  openCustom, custSave, custBack,
  budTab(k: string) { cTab = k; drawTabs(); drawTiles(); },
  budName(v: string) { if (D) { D.name = v; refresh(false); } },
  setPart(part: keyof Buddy, val: string | null) {
    if (!D) return;
    if (["hat", "glasses", "extra"].includes(part) && val && D[part] === val) val = null; // tap again to take it off
    (D as any)[part] = val; drawTiles(); refresh(true);
  },
  randName() {
    if (!D) return;
    let n: string;
    do { n = NAMES[Math.floor(Math.random() * NAMES.length)]; } while (n === D.name && NAMES.length > 1);
    D.name = n; ($("#nameIn") as HTMLInputElement).value = n; refresh(true);
  },
  resetBuddy() { D = defaultM(); ($("#nameIn") as HTMLInputElement).value = D.name; drawTiles(); refresh(true); },
});
