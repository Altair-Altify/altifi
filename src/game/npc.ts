/* ---------- Classmate NPCs walking around the town (design doc 13.3 "Sự sống" + 13.4 leaderboard) ----------
 * 7 chibi classmates, each with a different money style (spender, saver, gambler, shop owner…). They walk from road
 * point to road point, stop and turn to you when you come close, and say one line about how they handle money.
 * The same 7 people become the net-worth leaderboard of the Personal mode (21/10). */
import * as THREE from "three";
import { makeAvatar, SKINS, HAIRS, TOPS, BOTTOMS, type Avatar, type Look, type Stage } from "./avatar";
import { seeded } from "../galaxy/planet";
import type { T } from "../i18n/i18n";

export interface Persona { id: string; name: string; style: T; line: T; stage: Stage; hair: number; top: number; long: 0 | 1 | 2 }
const T2 = (vi: string, en: string) => ({ vi, en });
export const PERSONAS: Persona[] = [
  { id: "bao-anh", name: "Bảo Anh", stage: "student", hair: 4, top: 0, long: 1, style: T2("Người tiêu xài", "The spender"),
    line: T2("Tháng này mình săn sale 11.11 hết sạch tiền tiêu vặt rồi… mà mấy món đó giờ nằm trong tủ chưa bóc 😅", "I blew all my pocket money in the 11.11 sale… and half of it is still unopened in my closet 😅") },
  { id: "minh-khang", name: "Minh Khang", stage: "student", hair: 0, top: 1, long: 0, style: T2("Người tiết kiệm", "The saver"),
    line: T2("Mình tự động bỏ 20% tiền lì xì vào sổ tiết kiệm trước khi tiêu. Không thấy thì không tiêu!", "I put 20% of my lucky money into savings before I spend anything. Out of sight, out of mind!") },
  { id: "gia-huy", name: "Gia Huy", stage: "staff", hair: 1, top: 4, long: 0, style: T2("Người liều", "The gambler"),
    line: T2("Có nhóm hứa lãi 5%/tuần, cam kết không lỗ! …Khoan, 5% một tuần là bao nhiêu một năm nhỉ?", "A group promised 5% a week, guaranteed! …Wait, how much is 5% a week over a year?") },
  { id: "thao-vy", name: "Thảo Vy", stage: "owner", hair: 2, top: 2, long: 2, style: T2("Chủ quán giỏi", "The shop owner"),
    line: T2("Quán mình lời trên giấy mà suýt hết tiền trả lương vì khách trả chậm. Giờ mình theo dõi dòng tiền mỗi tuần.", "My shop was profitable on paper but nearly couldn't pay wages because customers paid late. Now I check cash flow every week.") },
  { id: "duc-tri", name: "Đức Trí", stage: "staff", hair: 0, top: 5, long: 0, style: T2("Nhà đầu tư kiên nhẫn", "The patient investor"),
    line: T2("Mình không đoán cổ phiếu nào lên. Mình chia đều, giữ lâu, để lãi kép làm việc.", "I don't guess which stock goes up. I spread my money out, hold for years and let compounding work.") },
  { id: "ngoc-ha", name: "Ngọc Hà", stage: "student", hair: 3, top: 3, long: 1, style: T2("Người cẩn thận", "The careful one"),
    line: T2("Trước khi mua gì trên 200k mình đợi 3 ngày. Qua 3 ngày mà vẫn muốn thì mới mua.", "Before buying anything over 200k I wait 3 days. If I still want it after that, I buy it.") },
  { id: "quoc-bao", name: "Quốc Bảo", stage: "student", hair: 5, top: 1, long: 0, style: T2("Mê nạp game", "The gamer"),
    line: T2("Mỗi lần nạp có 20–50k thôi mà cộng lại cả tháng gần bằng tiền ăn sáng… Mình đang ghi sổ chi tiêu thử.", "Each top-up is only 20–50k, but over a month it's almost my breakfast money… I'm trying a spending log.") },
];

export interface Npc { p: Persona; av: Avatar; pos: THREE.Vector2; target: THREE.Vector2; heading: number; wait: number; stuck: number; talking: boolean; queue?: [number, number] }

export function makeNpcs(nodes: [number, number][], count: number): Npc[] {
  const rnd = seeded(77);
  return PERSONAS.slice(0, count).map((p, i) => {
    const look: Look = { skin: SKINS[(i * 2 + 1) % SKINS.length], hair: HAIRS[p.hair], style: p.long, top: TOPS[p.top], bottom: BOTTOMS[i % BOTTOMS.length], shoes: i % 2 ? "#FFFFFF" : "#5B4636" };
    const n = nodes[Math.floor(rnd() * nodes.length)];
    const av = makeAvatar(look, p.stage, 0.94);
    return { p, av, pos: new THREE.Vector2(n[0] + (rnd() - 0.5) * 2, n[1] + (rnd() - 0.5) * 2), target: new THREE.Vector2(...n), heading: rnd() * 6, wait: rnd() * 3, stuck: 0, talking: false };
  });
}

/** Neighbouring road points (same road line, nearest in each direction). */
export function graph(nodes: [number, number][]) {
  return nodes.map(([x, z]) => {
    const best: Record<string, [number, number] | null> = { e: null, w: null, n: null, s: null };
    for (const [a, b] of nodes) {
      if (a === x && b === z) continue;
      if (Math.abs(b - z) < 0.6) { const k = a > x ? "e" : "w"; if (!best[k] || Math.abs(a - x) < Math.abs(best[k]![0] - x)) best[k] = [a, b]; }
      else if (Math.abs(a - x) < 0.6) { const k = b > z ? "s" : "n"; if (!best[k] || Math.abs(b - z) < Math.abs(best[k]![1] - z)) best[k] = [a, b]; }
    }
    return Object.values(best).filter(Boolean) as [number, number][];
  });
}
