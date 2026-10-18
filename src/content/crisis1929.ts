/* ---------- Crisis Museum · room 1929 (design doc 6.4) ----------
 * You start BEFORE the crash (Sep 1929, "stocks doubled, everyone's rich") — no headline gives the ending away.
 * Each step = one moment in time; the town changes with it (stock board turns red, a queue in front of the bank,
 * shops go dark). Two roles: an ordinary saver/investor, and the Governor of the US central bank (role swap, 6.4).
 * At the end: "What really happened" + every side's view + your moves rated like chess.
 * ⚠️ Draft written with AI help — team must verify: Dow ≈ 381 (3 Sep 1929) → ≈ 230 (13 Nov 1929) → ≈ 41 (8 Jul 1932),
 * i.e. ≈ −89%; Black Thursday 24 Oct / Black Tuesday 29 Oct 1929; Bank of United States failed Dec 1930;
 * ~9,000 US banks failed 1930–33; unemployment ≈ 25% in 1933; money supply fell about a third; Fed raised its
 * discount rate in Oct 1931; FDIC deposit insurance 1933; Bernanke's 2002 remark "we did it. We're very sorry". */
import type { TL } from "../i18n/i18n";
import type { Rating } from "./cases";

const T = (vi: string, en: string) => ({ vi, en });
export type Scene = "boom" | "crash" | "run" | "slump";
/** Effects on the saver's portfolio ($). */
export interface SaverFx { buyStock?: number; margin?: number; sellStock?: number; toBank?: number; withdraw?: number; job?: "keep" | "cut" | "wait" }
export interface CrisisOpt<F> { t: TL; r: Rating; why: TL; fx: F }
export interface CrisisStep<F> { id: string; date: TL; scene: Scene; index: number; headline: TL; text: TL; opts: CrisisOpt<F>[] }
export interface GovFx { lend?: boolean; rateUp?: boolean; pump?: boolean; insure?: boolean }

/* Market index (Dow ≈ 381 on 3 Sep 1929 = 100) at each step. */
export const SAVER: CrisisStep<SaverFx>[] = [
  {
    id: "s1", date: T("Tháng 9/1929 · New York", "September 1929 · New York"), scene: "boom", index: 100,
    headline: T("“Cổ phiếu đã tăng gấp đôi trong 2 năm — ai cũng đang giàu lên!”", "“Stocks have doubled in two years — everyone's getting rich!”"),
    text: T("Bạn có $1.000 tiền mặt và $1.000 cổ phiếu. Người môi giới nói: “Chỉ cần bỏ 10%, phần còn lại tôi cho vay (mua ký quỹ). Ai cũng làm vậy cả.” Hàng xóm vừa mua xe mới nhờ cổ phiếu.",
      "You have $1,000 in cash and $1,000 in shares. Your broker says: “Put down just 10% and I'll lend you the rest (buying on margin). Everybody's doing it.” Your neighbour just bought a new car with stock profits."),
    opts: [
      { t: T("Vay ký quỹ $2.000 để mua thêm cổ phiếu", "Borrow $2,000 on margin to buy more shares"), r: "??", fx: { margin: 2000 },
        why: T("Đòn bẩy gấp 3 lần trên một thị trường đã tăng gấp đôi rất nhanh. Chỉ cần giảm 1/3 là mất trắng phần vốn của bạn, và môi giới sẽ bán ép cổ phiếu để thu nợ.", "Three-times leverage on a market that doubled very fast. A one-third drop wipes out your own money, and the broker will force-sell to get repaid.") },
      { t: T("Giữ nguyên: $1.000 cổ phiếu, $1.000 tiền mặt", "Stay as you are: $1,000 shares, $1,000 cash"), r: "★", fx: {},
        why: T("Không tham thêm, không nợ. Nhưng một nửa tài sản vẫn nằm trong một thị trường đang 'sốt'.", "No extra greed, no debt. But half your wealth still sits in an overheated market.") },
      { t: T("Bán bớt một nửa cổ phiếu, gửi ngân hàng $1.500", "Sell half your shares and put $1,500 in the bank"), r: "!", fx: { sellStock: 500, toBank: 1500 },
        why: T("Chốt lời một phần khi giá tăng quá nhanh và đa dạng hóa. Nhưng lưu ý: năm 1929 tiền gửi ngân hàng ở Mỹ CHƯA có bảo hiểm.", "Take some profit after a very fast rise and diversify. But note: in 1929 US bank deposits were NOT insured yet.") },
    ],
  },
  {
    id: "s2", date: T("30/10/1929 · sau “Thứ Ba Đen tối”", "30 Oct 1929 · after “Black Tuesday”"), scene: "crash", index: 60,
    headline: T("Trong vài ngày, bảng giá đỏ rực. Nhiều người bị gọi ký quỹ, phải bán tháo.", "Within days the board is all red. Many get margin calls and must dump shares."),
    text: T("Giá cổ phiếu đã mất khoảng 40% so với tháng 9. Báo chí chia rẽ: “Đáy rồi, mua vào!” — “Còn rơi nữa!”. Tổng thống nói nền kinh tế “về cơ bản vững chắc”.", "Shares are down about 40% from September. Newspapers are split: “It's the bottom, buy!” — “More to fall!”. The President says business is “fundamentally sound”."),
    opts: [
      { t: T("Vay thêm để 'bắt đáy'", "Borrow more to 'buy the dip'"), r: "??", fx: { margin: 1000 },
        why: T("Dùng nợ để đoán đáy giữa lúc hoảng loạn là đánh bạc: nếu giá rơi tiếp, bạn mất cả vốn lẫn nợ.", "Using debt to guess the bottom in a panic is gambling: if prices keep falling you lose your money and still owe the loan.") },
      { t: T("Giữ nguyên, chờ hồi phục", "Hold and wait for a recovery"), r: "!?", fx: {},
        why: T("Không bán tháo theo đám đông là điều tốt — nhưng nếu đang vay ký quỹ thì bạn không có quyền chờ.", "Not panic-selling with the crowd is good — but if you're on margin you can't afford to wait.") },
      { t: T("Bán bớt để trả hết nợ, giữ phần còn lại bằng tiền mặt", "Sell enough to clear any debt, keep the rest in cash"), r: "!", fx: { sellStock: 99999 },
        why: T("Hết nợ thì không ai bán ép được bạn nữa. Mất một phần, nhưng bạn còn sống để quyết định tiếp.", "No debt means no one can force-sell you. You lose some, but you survive to decide again.") },
    ],
  },
  {
    id: "s3", date: T("Tháng 12/1930 · cuối năm thứ nhất", "December 1930 · end of year one"), scene: "run", index: 45,
    headline: T("Bank of United States ở New York đóng cửa. Trước ngân hàng của bạn, người ta bắt đầu xếp hàng.", "The Bank of United States in New York closes. People start queueing outside YOUR bank."),
    text: T("Tin đồn lan nhanh: ngân hàng của bạn cho vay nhiều người mua cổ phiếu. Không có bảo hiểm tiền gửi — ngân hàng đổ là có thể mất tiền. Nhưng nếu ai cũng rút, chính việc rút sẽ làm ngân hàng đổ.", "Rumours spread: your bank lent to lots of stock buyers. There's no deposit insurance — if it fails, you can lose your money. But if everyone withdraws, the withdrawals themselves will sink it."),
    opts: [
      { t: T("Xếp hàng rút hết tiền ngay", "Queue up and take everything out now"), r: "★", fx: { withdraw: 1 },
        why: T("Với một người, rút tiền là hợp lý khi không có bảo hiểm. Nhưng khi tất cả cùng làm, một ngân hàng còn khỏe cũng sụp — 'hoảng loạn tự thành hiện thực'.", "For one person, withdrawing is rational with no insurance. But when everyone does it, even a sound bank collapses — a self-fulfilling panic.") },
      { t: T("Rút một nửa", "Take out half"), r: "!?", fx: { withdraw: 0.5 },
        why: T("Giảm rủi ro mà không bỏ chạy hoàn toàn — một thỏa hiệp.", "Cuts your risk without running entirely — a compromise.") },
      { t: T("Giữ nguyên, tin ngân hàng", "Leave it, trust the bank"), r: "?!", fx: {},
        why: T("Giúp ngân hàng đứng vững nếu nhiều người làm như bạn — nhưng nếu ngân hàng đổ, bạn chịu thiệt.", "Helps the bank survive if many do the same — but if it fails, you pay.") },
    ],
  },
  {
    id: "s4", date: T("Mùa hè 1932 · đáy sâu nhất", "Summer 1932 · the deepest point"), scene: "slump", index: 11,
    headline: T("Cứ 4 người thì gần 1 người mất việc. Cửa hàng trên phố lần lượt tắt đèn.", "Nearly 1 in 4 workers is jobless. Shops on the street go dark one by one."),
    text: T("Xưởng của bạn cắt 30% lương; quản đốc nói ai không chịu thì nghỉ. Một người bạn rủ: “Cổ phiếu giờ rẻ như cho — mua đi!”", "Your factory cuts pay by 30%; the foreman says take it or leave. A friend says: “Shares are dirt cheap now — buy!”"),
    opts: [
      { t: T("Chấp nhận giảm lương, giữ việc, để dành từng đồng", "Accept the pay cut, keep the job, save every cent"), r: "!", fx: { job: "keep" },
        why: T("Giữ thu nhập trong lúc 1/4 người mất việc là ưu tiên số một. Tiền mặt lúc này mua được nhiều hơn vì giá cả đang giảm (giảm phát).", "Keeping an income while a quarter of workers are jobless comes first. Cash buys more now because prices are falling (deflation).") },
      { t: T("Nghỉ, chờ việc lương cũ", "Quit and wait for a job at the old pay"), r: "??", fx: { job: "wait" },
        why: T("Lúc thất nghiệp 25%, một việc làm khác gần như không có. Chờ lương cũ có thể là chờ nhiều năm.", "At 25% unemployment there are hardly any other jobs. Waiting for the old pay could mean waiting for years.") },
      { t: T("Giữ việc VÀ dùng một phần tiền mặt mua cổ phiếu giá rẻ", "Keep the job AND put some cash into cheap shares"), r: "!!", fx: { job: "keep", buyStock: 0.5 },
        why: T("Chỉ dùng tiền không cần đến trong vài năm, không vay. Mua khi ai cũng sợ là rất khó — nhưng chỉ an toàn khi bạn vẫn có thu nhập.", "Only money you won't need for years, no borrowing. Buying when everyone's afraid is hard — and only safe while you still have an income.") },
    ],
  },
];

export const GOVERNOR: CrisisStep<GovFx>[] = [
  {
    id: "g1", date: T("Cuối 1930 · Cục Dự trữ Liên bang (Fed)", "Late 1930 · the Federal Reserve"), scene: "run", index: 45,
    headline: T("Hàng trăm ngân hàng nhỏ đang bị rút tiền ồ ạt. Họ xin Fed cho vay khẩn cấp.", "Hundreds of small banks face runs. They ask the Fed for emergency loans."),
    text: T("Bạn là Thống đốc. Một số đồng nghiệp nói: “Ngân hàng yếu cứ để nó đổ — thị trường tự thanh lọc.” Số khác: “Ngân hàng đổ thì tiền gửi biến mất, người dân càng sợ, càng nhiều ngân hàng đổ.”", "You're the Governor. Some colleagues say: “Let weak banks fail — the market cleans itself up.” Others: “When banks fail, deposits vanish, people panic more, more banks fail.”"),
    opts: [
      { t: T("Để ngân hàng yếu tự đổ", "Let weak banks fail"), r: "??", fx: {},
        why: T("Một ngân hàng đổ làm người gửi ở ngân hàng khác hoảng sợ — 'thanh lọc' biến thành dây chuyền sụp đổ.", "One failure scares depositors elsewhere — 'cleaning up' turns into a chain of collapses.") },
      { t: T("Cho mọi ngân hàng còn khả năng trả nợ vay khẩn cấp, có tài sản đảm bảo", "Lend to every bank that's still solvent, against good collateral"), r: "!!", fx: { lend: true },
        why: T("Đây là vai trò 'người cho vay cuối cùng' (Bagehot, 1873): cho vay mạnh tay, có đảm bảo, để hoảng loạn không giết những ngân hàng còn khỏe.", "This is the 'lender of last resort' role (Bagehot, 1873): lend freely against good collateral so panic doesn't kill sound banks.") },
      { t: T("Chỉ cứu vài ngân hàng lớn ở New York", "Only rescue a few big New York banks"), r: "?!", fx: {},
        why: T("Giữ được trung tâm nhưng bỏ mặc hàng nghìn ngân hàng nhỏ ở nông thôn — nơi người dân mất tiền và ngừng chi tiêu.", "Protects the centre but abandons thousands of small country banks — where people lose their money and stop spending.") },
    ],
  },
  {
    id: "g2", date: T("Tháng 9–10/1931", "September–October 1931"), scene: "slump", index: 30,
    headline: T("Anh bỏ chế độ bản vị vàng. Vàng bắt đầu chảy khỏi nước Mỹ.", "Britain leaves the gold standard. Gold starts flowing out of the US."),
    text: T("Để giữ vàng, nhiều người khuyên bạn TĂNG mạnh lãi suất. Nhưng giá cả đang giảm, doanh nghiệp đang đóng cửa, thất nghiệp đang tăng.", "To keep gold, many advise you to RAISE rates sharply. But prices are falling, firms are closing and unemployment is rising."),
    opts: [
      { t: T("Tăng mạnh lãi suất để giữ vàng", "Raise rates sharply to keep the gold"), r: "??", fx: { rateUp: true },
        why: T("Giữ được vàng nhưng làm vay đắt hơn giữa lúc kinh tế đang rơi tự do — đổ thêm nước lạnh vào người đang chết cóng.", "Keeps the gold but makes borrowing dearer while the economy is in free fall — cold water on someone already freezing.") },
      { t: T("Giữ lãi suất thấp và tiếp tục cho ngân hàng vay", "Keep rates low and keep lending to banks"), r: "!", fx: {},
        why: T("Ưu tiên việc làm và hệ thống ngân hàng trong nước. Có thể mất một phần vàng, nhưng kinh tế bớt bị siết.", "Puts jobs and the banking system first. You may lose some gold, but the economy isn't squeezed further.") },
      { t: T("Tăng nhẹ một chút cho “an toàn”", "Raise a little, to be “safe”"), r: "?!", fx: {},
        why: T("Nửa vời: vẫn siết nền kinh tế mà chưa chắc giữ được vàng.", "Half-hearted: still squeezes the economy and may not save the gold.") },
    ],
  },
  {
    id: "g3", date: T("1932", "1932"), scene: "slump", index: 11,
    headline: T("Lượng tiền trong nền kinh tế đã giảm khoảng 1/3. Giá cả rơi, nợ càng nặng.", "The money supply has shrunk by about a third. Prices fall, debts feel heavier."),
    text: T("Bạn còn một quyết định lớn.", "You have one big decision left."),
    opts: [
      { t: T("Mua mạnh trái phiếu chính phủ để bơm tiền vào ngân hàng", "Buy government bonds on a large scale to pump money into banks"), r: "!!", fx: { pump: true },
        why: T("Đưa tiền trở lại hệ thống, chặn giảm phát. Gần 80 năm sau, năm 2008, Fed làm đúng điều này (nới lỏng định lượng).", "Puts money back into the system and stops deflation. Almost 80 years later, in 2008, the Fed did exactly this (quantitative easing).") },
      { t: T("Đề xuất Quốc hội lập bảo hiểm tiền gửi", "Propose deposit insurance to Congress"), r: "!", fx: { insure: true },
        why: T("Khi tiền gửi được bảo đảm, người dân không còn lý do xếp hàng rút tiền — chặn hoảng loạn từ gốc. Mỹ lập FDIC năm 1933.", "With deposits guaranteed, people have no reason to run — panic is stopped at the root. The US created the FDIC in 1933.") },
      { t: T("Giữ nguyên, chờ kinh tế tự hồi phục", "Do nothing, wait for the economy to heal itself"), r: "??", fx: {},
        why: T("Trong giảm phát, chờ đợi nghĩa là nợ thật nặng thêm, thêm doanh nghiệp và ngân hàng đổ.", "In deflation, waiting means debts grow heavier in real terms and more firms and banks fail.") },
    ],
  },
];

export const CRISIS_1929 = {
  year: 1929,
  title: T("Đại khủng hoảng 1929", "The Great Crash of 1929"),
  intro: T("Bạn sẽ quay về tháng 9/1929 — khi chưa ai biết chuyện gì sắp xảy ra. Chọn vai:", "You'll go back to September 1929 — when nobody knew what was coming. Pick a role:"),
  story: T("Chỉ số Dow Jones đạt đỉnh khoảng 381 điểm (3/9/1929), sụp mạnh vào “Thứ Năm Đen tối” 24/10 và “Thứ Ba Đen tối” 29/10, rồi rơi suốt 3 năm xuống khoảng 41 điểm (7/1932) — mất gần 90%. Khoảng 9.000 ngân hàng Mỹ đổ trong 1930–1933; khi đó tiền gửi chưa được bảo hiểm. Lượng tiền giảm khoảng 1/3, giá cả giảm, thất nghiệp lên khoảng 25% năm 1933. Năm 1931 Fed còn tăng lãi suất để giữ vàng. Mỹ lập bảo hiểm tiền gửi (FDIC) năm 1933. Năm 2002, Ben Bernanke (sau này là Chủ tịch Fed) nói với Milton Friedman về vai trò của Fed trong Đại suy thoái: “Ông nói đúng, chúng tôi đã gây ra nó. Chúng tôi rất xin lỗi.” Năm 2008, chính Bernanke cho các ngân hàng vay khẩn cấp và bơm tiền — làm điều ngược lại.",
    "The Dow peaked around 381 (3 Sep 1929), crashed on “Black Thursday” 24 Oct and “Black Tuesday” 29 Oct, then kept falling for three years to about 41 (Jul 1932) — almost 90% gone. Around 9,000 US banks failed in 1930–33, when deposits weren't insured. The money supply shrank about a third, prices fell and unemployment reached about 25% in 1933. In 1931 the Fed even raised rates to keep gold. The US created deposit insurance (FDIC) in 1933. In 2002 Ben Bernanke (later Fed chair) told Milton Friedman about the Fed's role in the Depression: “You're right, we did it. We're very sorry.” In 2008 that same Bernanke lent to banks and pumped in money — the opposite."),
  views: [
    [T("Người gửi tiền", "Depositor"), T("“Tôi không làm gì sai — chỉ gửi tiền vào ngân hàng — và mất gần hết.”", "“I did nothing wrong — I just kept money in a bank — and lost almost all of it.”")],
    [T("Chủ ngân hàng nhỏ", "Small-town banker"), T("“Ngân hàng tôi còn khỏe, nhưng không ai cho vay khi mọi người cùng rút.”", "“My bank was sound, but nobody would lend to me when everyone withdrew at once.”")],
    [T("Nhà đầu tư vay ký quỹ", "Margin investor"), T("“Đòn bẩy làm tôi giàu nhanh rồi phá sản còn nhanh hơn.”", "“Leverage made me rich fast and broke even faster.”")],
    [T("Nhà kinh tế (Friedman & Schwartz, 1963)", "Economists (Friedman & Schwartz, 1963)"), T("Fed để lượng tiền co lại khoảng 1/3 — biến một cuộc suy thoái thành Đại suy thoái.", "The Fed let the money supply shrink by a third — turning a recession into the Great Depression.")],
  ] as [TL, TL][],
};
