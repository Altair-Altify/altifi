/* Achievement badges (design doc 10c.3 & 10c.5): earned ones are kept in S.badges forever. */
import type { T } from "../i18n/i18n";
import type { State } from "../core/state";
import { DOMAINS } from "./domains";

export interface Badge { id: string; ic: string; color: string; name: T; how: T; test: (S: State) => boolean }

const done = (S: State) => Object.keys(S.lessons).length;
/** An area is complete when EVERY lesson of it is done — "coming soon" ones included (design doc 13.1b-1). */
export const domainDone = (S: State, id: string) => DOMAINS.find((d) => d.id === id)!.nodes.every((n) => S.lessons[n.id]);

export const BADGES: Badge[] = [
  { id: "first", ic: "sparkle", color: "#5B5BD6", name: { vi: "Bước đầu tiên", en: "First step" }, how: { vi: "Học xong 1 bài bất kỳ.", en: "Finish any lesson." }, test: (S) => done(S) >= 1 },
  { id: "three", ic: "learn", color: "#2BB673", name: { vi: "Mọt sách nhí", en: "Bookworm" }, how: { vi: "Học xong 3 bài.", en: "Finish 3 lessons." }, test: (S) => done(S) >= 3 },
  { id: "perfect", ic: "star", color: "#E8A700", name: { vi: "Hoàn hảo", en: "Flawless" }, how: { vi: "Đạt 3 sao trong một bài.", en: "Get 3 stars in a lesson." }, test: (S) => Object.values(S.lessons).some((r) => r.stars >= 3) },
  { id: "deep", ic: "deep", color: "#7E5BE0", name: { vi: "Thợ lặn kiến thức", en: "Deep diver" }, how: { vi: "Hoàn thành một phần Đào sâu.", en: "Finish a Deep dive." }, test: (S) => Object.values(S.lessons).some((r) => r.deep) },
  { id: "streak3", ic: "flame", color: "#F2762E", name: { vi: "Lửa nhỏ", en: "Spark" }, how: { vi: "Học 3 ngày liên tiếp.", en: "Learn 3 days in a row." }, test: (S) => S.streak >= 3 },
  { id: "streak7", ic: "flame", color: "#EF4E4E", name: { vi: "Lửa bền", en: "On fire" }, how: { vi: "Học 7 ngày liên tiếp.", en: "Learn 7 days in a row." }, test: (S) => S.streak >= 7 },
  { id: "xp100", ic: "trophy", color: "#E0A800", name: { vi: "100 XP", en: "100 XP" }, how: { vi: "Tích lũy 100 XP.", en: "Earn 100 XP." }, test: (S) => S.xp >= 100 },
  { id: "chest", ic: "chestOpen", color: "#C97A06", name: { vi: "Săn sao chổi", en: "Comet catcher" }, how: { vi: "Nhặt một sao chổi thưởng trong dải ngân hà.", en: "Catch a reward comet in the galaxy." }, test: (S) => S.chests.length > 0 },
  { id: "placement", ic: "target", color: "#0E9F9A", name: { vi: "Biết mình ở đâu", en: "Know thyself" }, how: { vi: "Làm bài test xếp lớp.", en: "Take the placement test." }, test: (S) => !!S.placement },
  ...DOMAINS.map((d): Badge => { const n = d.title as T; return { id: "dom-" + d.id, ic: d.ic, color: d.color, name: n, how: { vi: `Học xong cả ${DOMAINS.find((x) => x.id === d.id)!.nodes.length} bài của mảng "${n.vi}" để chòm sao hoàn chỉnh.`, en: `Finish all ${DOMAINS.find((x) => x.id === d.id)!.nodes.length} lessons of "${n.en}" to complete its constellation.` }, test: (S) => domainDone(S, d.id) }; }),
];

/** Adds newly earned badges to S.badges; returns them (for a toast). */
export function checkBadges(S: State): Badge[] {
  const fresh = BADGES.filter((b) => !S.badges.includes(b.id) && b.test(S));
  fresh.forEach((b) => S.badges.push(b.id));
  return fresh;
}
