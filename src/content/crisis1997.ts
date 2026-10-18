/* ---------- Crisis Museum · room 1997 (design doc 6.4, unlocked by lesson X2) ----------
 * One role: the Governor of Thailand's central bank, starting in early 1996 when the boom still looks like a miracle.
 * Each step = one moment; the town follows (red board, queue at the bank, dark shops). The step "index" is the baht
 * per US dollar shown on the stock ticker. Moves are rated like chess; the real story and every side come at the end.
 * ⚠️ Draft written with AI help — team must verify: baht ≈ 25/USD before 2 Jul 1997, ≈ 56 at the worst (Jan 1998);
 * gross reserves ≈ 38 bn USD early 1997, with ≈ 23 bn already promised in forward contracts by mid-1997; 58 finance
 * companies suspended in 1997 and 56 closed in Dec 1997; IMF-led package ≈ 17 bn USD (Aug 1997). */
import type { TL } from "../i18n/i18n";
import type { CrisisStep } from "./crisis1929";

const T = (vi: string, en: string) => ({ vi, en });
export interface Gov97Fx { prevent?: boolean; defend?: boolean; floatEarly?: boolean; split?: boolean; clean?: boolean; print?: boolean; freeze?: boolean }

export const GOV97: CrisisStep<Gov97Fx>[] = [
  {
    id: "t1", date: T("Đầu 1996 · Ngân hàng Trung ương Thái Lan", "Early 1996 · the Bank of Thailand"), scene: "boom", index: 25,
    headline: T("“Kinh tế tăng 8%/năm suốt 10 năm — phép màu châu Á!”", "“8% growth a year for ten years — the Asian miracle!”"),
    text: T("Bạn là Thống đốc. Tỷ giá giữ quanh 25 baht/USD. Lãi suất trong nước cao hơn Mỹ nhiều, nên ngân hàng và công ty tài chính vay USD ngắn hạn giá rẻ rồi cho vay bất động sản bằng baht. Tòa nhà mọc khắp Bangkok, nhiều căn hộ bỏ trống.",
      "You're the Governor. The rate is held near 25 baht per dollar. Local interest rates are far above America's, so banks and finance companies borrow cheap short-term dollars and lend in baht for property. Towers rise across Bangkok; many flats stand empty."),
    opts: [
      { t: T("Giữ nguyên — vốn ngoại vào càng nhiều càng tốt", "Change nothing — the more foreign money the better"), r: "??", fx: {},
        why: T("Chính bẫy của bài X2: nợ USD ngắn hạn chồng chất mà ai cũng tin tỷ giá không bao giờ đổi.", "The very trap of lesson X2: short-term dollar debt piles up while everyone trusts the rate never to move.") },
      { t: T("Nới dần biên độ tỷ giá và hạn chế ngân hàng vay USD ngắn hạn", "Slowly widen the band and limit banks' short-term dollar borrowing"), r: "!!", fx: { prevent: true },
        why: T("Tỷ giá nhúc nhích một chút nhắc mọi người rằng vay USD có rủi ro; hạn chế nợ ngắn hạn làm 'vốn nóng' ít đi. Tăng trưởng chậm hơn một chút — nhưng đỡ một cú sập.", "A rate that wiggles reminds everyone dollar debt is risky; limiting short-term debt shrinks the 'hot money'. Growth slows a little — but you avoid a crash.") },
      { t: T("Tăng lãi suất thêm để hạ nhiệt nhà đất", "Raise interest rates further to cool property"), r: "?!", fx: {},
        why: T("Ý định tốt, nhưng khi tỷ giá cố định, lãi cao hơn lại hút THÊM vốn ngắn hạn từ nước ngoài vào — người vay chỉ chuyển sang vay USD.", "Well meant, but with a fixed rate, higher interest pulls in EVEN MORE short-term foreign money — borrowers just switch to dollar loans.") },
    ],
  },
  {
    id: "t2", date: T("Tháng 5/1997 · đợt tấn công tiền tệ", "May 1997 · the currency attack"), scene: "crash", index: 26,
    headline: T("Các quỹ lớn bán baht ồ ạt, đặt cược rằng bạn không giữ nổi 25 baht/USD.", "Big funds sell baht massively, betting you can't hold 25 per dollar."),
    text: T("Xuất khẩu đã chậm lại, giá nhà đất giảm, vài công ty tài chính gặp khó. Dự trữ ngoại hối trên giấy còn lớn, nhưng mỗi ngày bạn phải bán USD để mua baht. Nếu thả nổi, các công ty nợ USD sẽ lao đao.",
      "Exports have slowed, property prices are falling, some finance companies are in trouble. Reserves look big on paper, but every day you sell dollars to buy baht. If you float, firms with dollar debt will be hit."),
    opts: [
      { t: T("Bảo vệ tỷ giá bằng mọi giá: bán dự trữ, ký thêm hợp đồng bán USD kỳ hạn", "Defend the rate at any cost: sell reserves, sign more forward dollar sales"), r: "??", fx: { defend: true },
        why: T("Đây là điều đã xảy ra thật: dự trữ 'còn dùng được' gần như cạn, rồi vẫn phải thả nổi — lúc đó không còn gì để đỡ.", "This is what really happened: usable reserves were nearly used up, and the float came anyway — with nothing left to cushion it.") },
      { t: T("Thả nổi sớm khi dự trữ còn nhiều, xin IMF hỗ trợ ngay", "Float early while reserves are still large, ask the IMF at once"), r: "!", fx: { floatEarly: true },
        why: T("Đau ngay, nhưng còn dự trữ để làm dịu cú rơi và trả các khoản nợ gấp. Không có lựa chọn nào không đau ở thời điểm này.", "It hurts at once, but you keep reserves to soften the fall and meet urgent debts. No option is painless by now.") },
      { t: T("Tạm chặn người nước ngoài vay baht để bán khống (tách thị trường)", "Temporarily stop foreigners borrowing baht to short it (split the market)"), r: "?!", fx: { split: true },
        why: T("Thái Lan đã thử cách này tháng 5/1997: mua được vài tuần, làm giới đầu cơ thiệt — nhưng không sửa được gốc là nợ USD và dự trữ đang cạn.", "Thailand tried this in May 1997: it bought a few weeks and burned the speculators — but didn't fix the root: dollar debt and draining reserves.") },
    ],
  },
  {
    id: "t3", date: T("Tháng 8/1997 · sau khi thả nổi", "August 1997 · after the float"), scene: "run", index: 40,
    headline: T("Baht đã rơi từ 25 xuống khoảng 40 baht/USD. Người dân xếp hàng rút tiền khỏi các công ty tài chính.", "The baht has fallen from 25 to about 40 per dollar. People queue to pull money out of finance companies."),
    text: T("Hàng chục công ty tài chính đã mất khả năng trả nợ vì cho vay bất động sản. IMF đề nghị gói vay kèm điều kiện. Bạn quyết định gì với các công ty này?",
      "Dozens of finance companies are insolvent from property loans. The IMF offers a loan package with conditions. What do you do about these companies?"),
    opts: [
      { t: T("Đóng các công ty không thể cứu, bảo đảm tiền gửi của người dân, nhận gói IMF", "Close the hopeless companies, guarantee people's deposits, accept the IMF package"), r: "!", fx: { clean: true },
        why: T("Cắt nhanh phần hỏng, giữ niềm tin của người gửi tiền. Điều kiện IMF (lãi cao, cắt chi tiêu) gây tranh cãi — nhưng có tiền đỡ và có kế hoạch.", "Cut the rot fast and keep depositors' trust. The IMF conditions (high rates, spending cuts) are debated — but you get money and a plan.") },
      { t: T("In tiền cho vay để cứu tất cả công ty tài chính", "Print money to keep every finance company alive"), r: "??", fx: { print: true },
        why: T("In thêm baht để trả nợ USD chỉ làm baht mất giá thêm — mà nợ thì tính bằng USD. 'Xác sống' vẫn ăn tiền của nền kinh tế.", "Printing baht to cover dollar debt just weakens the baht more — and the debt is in dollars. 'Zombies' keep eating the economy's money.") },
      { t: T("Phong tỏa mọi khoản rút tiền cho đến khi bình tĩnh lại", "Freeze all withdrawals until things calm down"), r: "?!", fx: { freeze: true },
        why: T("Chặn được hàng người hôm nay, nhưng người dân mất niềm tin vào cả hệ thống — ngày mở lại, hàng còn dài hơn.", "It stops today's queue, but people lose faith in the whole system — the day it reopens, the queue is longer.") },
    ],
  },
];

export const CRISIS_1997 = {
  year: 1997,
  title: T("Khủng hoảng châu Á 1997", "The 1997 Asian crisis"),
  intro: T("Bạn quay về Bangkok đầu năm 1996 — khi ai cũng gọi đây là 'phép màu'. Vai của bạn:", "You go back to Bangkok in early 1996 — when everyone calls it a 'miracle'. Your role:"),
  story: T("Thái Lan đã cố giữ tỷ giá: đến giữa 1997, phần lớn dự trữ ngoại hối đã được hứa bán trước qua hợp đồng kỳ hạn. Ngày 2/7/1997, baht được thả nổi và rơi từ khoảng 25 xuống khoảng 56 baht/USD vào tháng 1/1998. 58 công ty tài chính bị đình chỉ, 56 công ty bị đóng cửa hẳn cuối 1997. IMF dẫn đầu gói hỗ trợ khoảng 17 tỷ USD. Khủng hoảng lan sang Indonesia, Hàn Quốc, Malaysia; kinh tế Thái Lan giảm khoảng 10% năm 1998. Sau đó, các nước châu Á tích dự trữ lớn hơn nhiều và để tỷ giá linh hoạt hơn.",
    "Thailand tried to hold the rate: by mid-1997 most of its reserves were already promised away in forward contracts. On 2 July 1997 the baht was floated and fell from about 25 to about 56 per dollar by January 1998. 58 finance companies were suspended and 56 closed for good in late 1997. The IMF led a package of about $17 bn. The crisis spread to Indonesia, Korea and Malaysia; Thailand's economy shrank about 10% in 1998. Afterwards Asian countries built far bigger reserves and let their currencies move more."),
  views: [
    [T("Chủ công ty nợ USD", "Owner of a firm with dollar debt"), T("“Tôi không vay thêm đồng nào, mà nợ tự nhiên gấp đôi.”", "“I didn't borrow a cent more, yet my debt doubled.”")],
    [T("Quỹ đầu cơ", "Hedge fund"), T("“Chúng tôi chỉ bán thứ bị định giá sai — tỷ giá cố định đó không thể giữ được.”", "“We only sold what was mispriced — that fixed rate couldn't last.”")],
    [T("IMF", "The IMF"), T("“Điều kiện khắt khe để lấy lại niềm tin; không cải tổ thì tiền cứu trợ cũng mất.”", "“Tough conditions to restore trust; without reform, rescue money is lost too.”")],
    [T("Người lao động Thái", "Thai worker"), T("“Công trường dừng, xưởng đóng cửa — tôi về quê làm ruộng.”", "“The building sites stopped, the factory shut — I went back to farm in my village.”")],
  ] as [TL, TL][],
};

/** "What if" for the Governor — illustration only (shown as such on screen): worst baht rate and dollar reserves left. */
export function gov97Result(g: Gov97Fx) {
  let worst = 56, reserves = 3; // the real path: ~56 baht/USD, usable reserves nearly gone (bn USD)
  if (g.prevent) { worst -= 14; reserves += 8; }
  if (g.floatEarly) { worst -= 8; reserves += 20; }
  if (g.split) { worst -= 2; reserves += 4; }
  if (g.clean) worst -= 4;
  if (g.print) worst += 12;
  if (g.freeze) worst += 4;
  return { worst: Math.max(32, worst), reserves };
}
