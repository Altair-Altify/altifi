/* ---------- Monthly decisions of the Personal mode (design doc 6.5 case library, 6.1 rating) ----------
 * One case per month at work. Each option has a chess-style rating, why, and an effect on your life; after you
 * choose: the views of 2–3 sides + what really happened. Personal stage: a "good" move (★) is enough (6.1).
 * No option is written to sound obviously right; the trade-offs are real (6.1 💡).
 * ⚠️ Draft written with AI help — the team must review the wording, numbers and sources before submission.
 * The 2022 bank/bond case is ANONYMISED on purpose (6.5): never name the group, the bank or any person. */
import type { TL } from "../i18n/i18n";

export type Rating = "!!" | "!" | "★" | "!?" | "?!" | "??";
export const GOOD: Rating[] = ["!!", "!", "★"];
export interface Fx { autoSave?: number; cash?: number; mood?: number; scam?: number; bond?: number; buy?: string; loan?: "fixed" | "float"; bnpl?: number }
export interface CaseOpt { t: TL; r: Rating; why: TL; fx: Fx }
export interface Case { id: string; year: string; title: TL; lesson?: string; setup: TL; opts: CaseOpt[]; views: [TL, TL][]; story: TL }
const T = (vi: string, en: string) => ({ vi, en });

export const CASES: Case[] = [
  {
    id: "first-pay", year: "2001", lesson: "p-budget", title: T("Lương đầu tiên", "Your first pay"),
    setup: T("Tháng lương đầu tiên: 8.950.000₫ vừa về tài khoản. Phòng nhân sự hỏi bạn có muốn TỰ ĐỘNG chuyển một phần lương vào sổ tiết kiệm mỗi tháng không.",
      "Your first pay: 8,950,000₫ just arrived. HR asks whether you want part of your pay moved AUTOMATICALLY into a savings account every month."),
    opts: [
      { t: T("Tự động chuyển 20% mỗi tháng (≈ 1,8 triệu)", "Move 20% automatically (≈ 1.8M)"), r: "!", fx: { autoSave: 0.2 },
        why: T("“Trả cho mình trước”: tiền vào tiết kiệm trước khi kịp tiêu. Bạn vẫn còn ~7,1 triệu cho chi tiêu — chỉ cần chọn mức chi tiêu vừa phải.", "“Pay yourself first”: the money is saved before you can spend it. You still have ~7.1M to live on — just pick a sensible spending plan.") },
      { t: T("Chuyển 10% — thử trước đã", "Move 10% — try it first"), r: "★", fx: { autoSave: 0.1 },
        why: T("Bắt đầu nhỏ vẫn hơn không bắt đầu. Quỹ khẩn cấp lớn chậm hơn, nhưng bạn có thể tăng dần ở ngân hàng.", "Starting small beats not starting. Your emergency fund grows more slowly, but you can raise it later at the bank.") },
      { t: T("Không cần — cuối tháng dư bao nhiêu thì gửi bấy nhiêu", "No thanks — I'll save whatever is left at the end of the month"), r: "?!", fx: { autoSave: 0 },
        why: T("Nghe hợp lý, nhưng hiếm khi cuối tháng còn dư: chi tiêu tự phình ra lấp đầy số tiền đang có trong ví.", "Sounds fine, but there is rarely anything left: spending quietly grows to fill whatever is in your wallet.") },
    ],
    views: [
      [T("Bạn hôm nay", "You today"), T("Ít tiền tiêu hơn một chút — hơi tiếc.", "A little less to spend — a bit annoying.")],
      [T("Bạn 5 năm sau", "You in 5 years"), T("Cảm ơn vì đã có quỹ khẩn cấp khi điện thoại hỏng và khi mình ốm.", "Thanks for the emergency fund when my phone broke and when I got sick.")],
      [T("Nhà kinh tế học hành vi", "Behavioural economist"), T("Lựa chọn MẶC ĐỊNH quyết định rất nhiều — người ta hiếm khi đổi thứ đã được cài sẵn.", "DEFAULTS matter a lot — people rarely change what is already set up for them.")],
    ],
    story: T("Madrian & Shea (2001) nghiên cứu một công ty ở Mỹ: khi chuyển sang TỰ ĐỘNG đăng ký tiết kiệm hưu trí cho nhân viên mới, tỷ lệ tham gia tăng từ khoảng 37% lên 86%.",
      "Madrian & Shea (2001) studied a US company: when new staff were enrolled in retirement saving AUTOMATICALLY, participation jumped from about 37% to 86%."),
  },
  {
    id: "never-lose", year: "2008", lesson: "p-scam", title: T("Quỹ “không bao giờ lỗ”", "The fund that “never loses”"),
    setup: T("Một anh trong nhóm “Đầu tư thông minh” mời bạn vào quỹ “lãi 5%/tuần, cam kết không lỗ, rút lúc nào cũng được”. Bạn thân của bạn đã nhận lãi 2 tuần liền và đang rủ thêm người.",
      "Someone in a “Smart Investing” group invites you into a fund: “5% a week, guaranteed no loss, withdraw any time”. Your best friend has been paid two weeks in a row and is inviting others."),
    opts: [
      { t: T("Bỏ vào 5 triệu — bạn mình nhận lãi thật mà", "Put in 5M — my friend really got paid"), r: "??", fx: { scam: 5_000_000, mood: 3 },
        why: T("5%/tuần ≈ 1.160%/năm khi tính lãi kép. Không việc kinh doanh hợp pháp nào trả nổi; người cũ được trả bằng tiền của người mới — mô hình Ponzi. Nó sụp khi tiền mới ngừng chảy vào.", "5% a week compounds to ≈ 1,160% a year. No legal business pays that; early members are paid with newcomers' money — a Ponzi scheme. It collapses when new money stops.") },
      { t: T("Thử 1 triệu thôi cho biết", "Just try 1M to see"), r: "?!", fx: { scam: 1_000_000, mood: 1 },
        why: T("Mất ít hơn, nhưng vẫn là đưa tiền cho một mô hình lừa đảo — và giúp nó có thêm “bằng chứng” để rủ người khác.", "You lose less, but you still feed a scam — and become more “proof” it uses to pull others in.") },
      { t: T("Hỏi: giấy phép đâu, tiền lãi từ đâu ra? — rồi từ chối", "Ask: where's the licence, where does the profit come from? — then say no"), r: "!!", fx: { mood: -1 },
        why: T("Lãi rất cao + cam kết không lỗ + giục nhanh là ba cờ đỏ lớn nhất. “Tiền lãi từ đâu ra?” là câu hỏi đúng nhất.", "Very high returns + “no risk” + “hurry” are the three biggest red flags. “Where does the profit come from?” is exactly the right question.") },
    ],
    views: [
      [T("Người mời", "The recruiter"), T("“Suất có hạn, quyết nhanh!” — áp lực thời gian cũng là cờ đỏ.", "“Limited spots, decide now!” — time pressure is a red flag too.")],
      [T("Người đã nhận lãi", "Someone already paid"), T("“Mình rút được thật!” — vì tiền của người mới vẫn đang chảy vào.", "“I really got my money!” — because newcomers' money is still flowing in.")],
      [T("Cơ quan quản lý", "The regulator"), T("Huy động tiền của công chúng phải có giấy phép; hứa “không lỗ” là dấu hiệu lừa đảo.", "Taking money from the public needs a licence; promising “no loss” is a sign of fraud.")],
    ],
    story: T("Bernard Madoff điều hành mô hình Ponzi lớn nhất từng bị phát hiện; nó sụp năm 2008 với khoảng 65 tỷ USD trên giấy tờ. Ông nhận án 150 năm tù. Nhà phân tích Harry Markopolos đã cảnh báo cơ quan quản lý Mỹ (SEC) từ nhiều năm trước.",
      "Bernard Madoff ran the biggest Ponzi scheme ever uncovered; it collapsed in 2008 with about $65 billion on paper. He was sentenced to 150 years. Analyst Harry Markopolos had warned the SEC years earlier."),
  },
  {
    id: "counter-bond", year: "2022", lesson: "p-inflation", title: T("“Sản phẩm tiết kiệm” tại quầy", "The “savings product” at the counter"),
    setup: T("Bạn ra ngân hàng để gửi 5 triệu. Nhân viên giới thiệu: “Có sản phẩm lãi 9%/năm, cao hơn gửi tiết kiệm nhiều, của một tập đoàn lớn, ngân hàng mình phân phối nên an toàn lắm.” Hợp đồng dày 20 trang chữ nhỏ.",
      "You go to the bank to deposit 5M. The teller says: “There's a product paying 9% a year, much more than savings, from a big group, sold by our bank so it's very safe.” The contract is 20 pages of small print."),
    opts: [
      { t: T("Ký luôn — ngân hàng giới thiệu thì chắc an toàn", "Sign it — the bank recommends it, so it's safe"), r: "??", fx: { bond: 5_000_000 },
        why: T("Đó là TRÁI PHIẾU doanh nghiệp, không phải tiền gửi: không có bảo hiểm tiền gửi, và nếu tập đoàn gặp khó thì có thể không trả được cả gốc lẫn lãi.", "It's a corporate BOND, not a deposit: no deposit insurance, and if the group gets into trouble it may not pay back interest or principal.") },
      { t: T("Hỏi thẳng: “Đây có phải tiền gửi không? Ai trả lãi? Nếu họ không trả thì sao?” — rồi gửi tiết kiệm", "Ask: “Is this a deposit? Who pays the interest? What if they don't?” — then open a normal savings account"), r: "!!", fx: {},
        why: T("Lãi cao hơn luôn đi kèm rủi ro cao hơn. Đọc kỹ ai là người vay tiền của bạn — ở đây là tập đoàn, không phải ngân hàng.", "Higher interest always comes with higher risk. Check who is really borrowing your money — here, the group, not the bank.") },
      { t: T("Chia đôi: 2,5 triệu mỗi bên", "Split it: 2.5M each"), r: "?!", fx: { bond: 2_500_000 },
        why: T("Chia rủi ro là ý hay — nhưng chỉ khi bạn hiểu mình đang mua gì. Ở đây một nửa số tiền vẫn nằm trong sản phẩm bạn chưa hiểu.", "Spreading risk is smart — but only when you understand what you buy. Half your money is still in something you don't understand.") },
    ],
    views: [
      [T("Người mua", "The buyer"), T("“Tôi tưởng đó là sổ tiết kiệm.”", "“I thought it was a savings account.”")],
      [T("Nhân viên ngân hàng", "The bank teller"), T("Được thưởng theo doanh số bán sản phẩm — nên có động cơ nói giảm rủi ro.", "Paid bonuses for selling the product — so tempted to play down the risk.")],
      [T("Cơ quan quản lý", "The regulator"), T("Ngân hàng phải nói rõ sản phẩm không phải tiền gửi; người mua nên đọc phần “rủi ro”.", "Banks must say clearly it isn't a deposit; buyers should read the “risks” section.")],
    ],
    story: T("Năm 2022 ở Việt Nam, nhiều người đến một ngân hàng thương mại để gửi tiết kiệm nhưng được tư vấn mua trái phiếu của một tập đoàn bất động sản lớn như thể đó là sản phẩm tiết kiệm. Khi tập đoàn gặp vấn đề, họ không lấy lại được tiền đúng hạn; ngân hàng nhà nước sau đó đặt ngân hàng này vào diện kiểm soát đặc biệt.",
      "In Vietnam in 2022, many people who came to a commercial bank to save were sold bonds of a large real-estate group as if they were savings products. When the group got into trouble they couldn't get their money back on time; the central bank later put that bank under special control."),
  },
  {
    id: "fixed-float", year: "2022", lesson: "m-centralbank", title: T("Trả góp xe máy: cố định hay thả nổi?", "A scooter on instalments: fixed or floating?"),
    setup: T("Đi xe buýt mất 2 tiếng mỗi ngày. Đại lý cho trả góp xe máy 35 triệu trong 24 tháng: lãi CỐ ĐỊNH 12,5%/năm suốt kỳ, hoặc THẢ NỔI (bây giờ 10,5%/năm, đổi theo lãi suất của ngân hàng trung ương). Tin tức: lạm phát thế giới đang tăng.",
      "The bus takes 2 hours a day. A dealer offers a 35M scooter over 24 months: FIXED 12.5% a year for the whole term, or FLOATING (10.5% now, moving with the central bank's rate). In the news: inflation is rising around the world."),
    opts: [
      { t: T("Vay lãi cố định 12,5%", "Borrow at a fixed 12.5%"), r: "!", fx: { buy: "scooter", loan: "fixed" },
        why: T("Đắt hơn lúc đầu nhưng biết chắc khoản trả mỗi tháng. Khi lạm phát tăng, NHTW thường tăng lãi suất — lãi cố định là tấm khiên.", "Dearer at first, but your payment is certain. When inflation rises, central banks usually raise rates — fixed is your shield.") },
      { t: T("Vay thả nổi — đang rẻ hơn 2%", "Borrow floating — 2% cheaper now"), r: "?!", fx: { buy: "scooter", loan: "float" },
        why: T("Rẻ hôm nay, nhưng khi NHTW tăng lãi suất thì khoản trả của bạn tăng theo. Bạn đang đặt cược rằng lãi suất sẽ không tăng.", "Cheaper today, but when the central bank raises rates, your payment rises too. You're betting rates won't go up.") },
      { t: T("Chưa vay — mua xe đạp 3 triệu bằng tiền mặt trước", "No loan — buy a 3M bicycle with cash for now"), r: "★", fx: { buy: "bike" },
        why: T("Không nợ, không lãi, xe đạp còn rẻ để nuôi; đổi lại đi xa hơi mệt. Một tài sản nhỏ mất giá ít hơn.", "No debt, no interest and cheap to run; a bit tiring for long trips. A small thing that loses less value.") },
    ],
    views: [
      [T("Người vay", "The borrower"), T("Cần biết mình chịu được khoản trả cao nhất là bao nhiêu, không chỉ khoản trả hôm nay.", "Needs to know the HIGHEST payment they can afford, not just today's.")],
      [T("Ngân hàng", "The bank"), T("Thả nổi chuyển rủi ro lãi suất sang người vay — nên lúc đầu có thể cho lãi thấp hơn.", "Floating shifts interest-rate risk onto the borrower — that's why it can start cheaper.")],
      [T("Ngân hàng trung ương", "The central bank"), T("Tăng lãi suất để hạ nhiệt lạm phát; người vay thả nổi cảm nhận đầu tiên.", "Raises rates to cool inflation; floating-rate borrowers feel it first.")],
    ],
    story: T("Năm 2022, Cục Dự trữ Liên bang Mỹ (Fed) tăng lãi suất từ gần 0% lên hơn 4% chỉ trong 9 tháng, rồi trên 5% năm 2023. Cuối 2022 Ngân hàng Nhà nước Việt Nam cũng tăng lãi suất điều hành hai lần. Người vay thả nổi thấy khoản trả hằng tháng tăng rõ.",
      "In 2022 the US Federal Reserve raised rates from near 0% to over 4% in just 9 months, then above 5% in 2023. In late 2022 the State Bank of Vietnam also raised its policy rate twice. Floating-rate borrowers saw their monthly payments jump."),
  },
  {
    id: "bnpl", year: "2024", lesson: "p-bnpl", title: T("“Mua trước trả sau 0%”", "“Buy now, pay later — 0%”"),
    setup: T("Điện thoại mới 9 triệu. Ví điện tử mời “Mua trước trả sau 0%”, chia 4 kỳ mỗi tháng 2,25 triệu. Trễ một kỳ: phí 300.000₫ và bị ghi nhận nợ quá hạn.",
      "A new 9M phone. Your e-wallet offers “Buy now, pay later 0%”: 4 monthly payments of 2.25M. Miss one: a 300,000₫ fee and a late-payment record."),
    opts: [
      { t: T("Mua luôn, chia 4 kỳ", "Buy it now in 4 payments"), r: "?!", fx: { bnpl: 9_000_000, mood: 6 },
        why: T("0% chỉ khi trả đúng hạn MỌI kỳ. 2,25 triệu/tháng cộng vào chi tiêu cố định — gặp một tháng xui là trễ hạn, mất phí và xấu lịch sử tín dụng.", "0% only if EVERY payment is on time. 2.25M a month joins your fixed costs — one bad month and you're late, paying fees and hurting your credit history.") },
      { t: T("Để dành 3–4 tháng rồi mua bằng tiền mặt", "Save for 3–4 months, then pay cash"), r: "!", fx: { mood: -2 },
        why: T("Chờ đợi giúp bạn biết mình có thật sự cần không, và không thêm khoản nợ nào.", "Waiting tells you whether you really need it, and adds no debt.") },
      { t: T("Mua máy rẻ hơn, 4 triệu tiền mặt", "Buy a cheaper 4M phone with cash"), r: "★", fx: { cash: -4_000_000, mood: 3 },
        why: T("Đáp ứng nhu cầu với giá vừa sức — nhưng nhớ kiểm tra quỹ khẩn cấp còn đủ không.", "Meets the need at a price you can afford — just check your emergency fund is still enough.") },
    ],
    views: [
      [T("Bạn", "You"), T("“0% thì có mất gì đâu?”", "“0% — what's to lose?”")],
      [T("Ví điện tử", "The e-wallet"), T("Kiếm tiền từ phí người bán và phí trễ hạn — càng nhiều người trễ càng có lời.", "Earns from shop fees and late fees — more late payers, more profit.")],
      [T("Trung tâm thông tin tín dụng (CIC)", "Credit bureau (CIC)"), T("Lịch sử trả nợ đi theo bạn nhiều năm, ảnh hưởng khi vay mua xe, mua nhà.", "Your repayment history follows you for years and matters when you borrow for a car or a home.")],
    ],
    story: T("Trong khảo sát của nhóm (46 bạn 14–17 tuổi), 6 bạn đã dùng “mua trước trả sau” và 7 bạn nghĩ điểm tín dụng là số tiền mình đang tiết kiệm.",
      "In our team's survey (46 teens aged 14–17), 6 had used “buy now, pay later” and 7 thought a credit score is how much money you have saved."),
  },
];

/* ---------- Business-mode decisions at the shop (design doc 13.2d ②: each lesson is one real crisis of the shop) ----------
 * Business stage: aim for "!" or "!!" (6.1: higher up you need brilliant moves). */
export interface BizFx { contract?: { cups: number; price: number; months: number }; cash?: number; love?: number; varCost?: number; price?: number; loan?: { amount: number; kind: "fixed" | "float" }; equip?: number }
export interface BizOpt { t: TL; r: Rating; why: TL; fx: BizFx }
export interface BizCase { id: string; title: TL; lesson?: string; setup: TL; opts: BizOpt[]; views: [TL, TL][]; story: TL }
export const BIZ_CASES: BizCase[] = [
  {
    id: "big-order", lesson: "c-cash", title: T("Hợp đồng lớn, trả sau 60 ngày", "A big order, paid in 60 days"),
    setup: T("Một công ty gần quán đặt 800 ly/tháng trong 2 tháng cho nhân viên, giá 30.000₫/ly — doanh thu thêm 24 triệu mỗi tháng! Nhưng họ chỉ thanh toán sau 60 ngày. Nguyên liệu và lương thì bạn phải trả ngay.",
      "A company nearby orders 800 cups a month for 2 months for its staff, at 30,000₫ a cup — 24 million extra revenue a month! But they only pay after 60 days. Ingredients and wages you pay now."),
    opts: [
      { t: T("Nhận ngay — doanh thu lớn thế không thể bỏ", "Take it — you can't turn down revenue like that"), r: "?!", fx: { contract: { cups: 800, price: 30_000, months: 2 } },
        why: T("Lợi nhuận trên giấy tăng, nhưng mỗi tháng bạn phải ứng trước ~12 triệu nguyên liệu mà 2 tháng sau mới thu tiền. Quán nhỏ ít tiền mặt rất dễ hết tiền trả lương — 'lời mà vẫn phá sản'.", "Profit on paper goes up, but each month you front ~12 million of ingredients and get paid two months later. A small shop with little cash can easily run out of money for wages — 'profitable yet broke'.") },
      { t: T("Nhận, nhưng đàm phán đặt cọc 50% trước", "Take it, but negotiate a 50% deposit up front"), r: "!!", fx: { contract: { cups: 800, price: 30_000, months: 2 }, cash: 12_000_000 },
        why: T("Bạn giữ được đơn hàng mà không để quán cạn tiền: tiền cọc trả cho nguyên liệu. Quản lý vốn lưu động chính là quản lý KHI NÀO tiền vào và ra.", "You keep the order without draining the shop: the deposit pays for ingredients. Managing working capital is managing WHEN money comes in and goes out.") },
      { t: T("Từ chối — quán chưa đủ sức", "Decline — the shop isn't ready"), r: "★", fx: { love: 1 },
        why: T("An toàn cho dòng tiền, nhưng bỏ lỡ một khách lớn. Đôi khi có cách giữ cả hai (hỏi điều kiện thanh toán).", "Safe for cash flow, but you miss a big customer. Sometimes there's a way to keep both (ask about payment terms).") },
    ],
    views: [
      [T("Bạn — chủ quán", "You — the owner"), T("Doanh thu đẹp, nhưng thứ trả lương là TIỀN MẶT, không phải doanh thu.", "Great revenue, but wages are paid with CASH, not revenue.")],
      [T("Công ty đặt hàng", "The client company"), T("Trả chậm giúp họ giữ tiền lâu hơn — họ cũng đang quản lý dòng tiền.", "Paying late lets them keep their cash longer — they're managing cash flow too.")],
      [T("Nhân viên quán", "Your staff"), T("Chỉ quan tâm lương có về đúng ngày không.", "Only care whether wages arrive on time.")],
    ],
    story: T("Rất nhiều doanh nghiệp nhỏ phá sản dù đang có lãi trên giấy: khách nợ nhiều, hàng tồn kho lớn, tiền mặt cạn. Các khảo sát về doanh nghiệp nhỏ thường xếp 'vấn đề dòng tiền' vào nhóm lý do thất bại hàng đầu.",
      "Many small businesses fail while profitable on paper: customers owe them a lot, stock piles up, cash runs out. Surveys of small firms usually rank 'cash-flow problems' among the top reasons they fail."),
  },
  {
    id: "costs-up", lesson: "m-inflation", title: T("Giá nguyên liệu tăng 20%", "Ingredient prices up 20%"),
    setup: T("Giá sữa, đường và trà tăng mạnh: chi phí mỗi ly từ 15.000₫ lên 18.000₫. Khách quen rất nhạy với giá.",
      "Milk, sugar and tea prices jump: each cup now costs 18,000₫ to make instead of 15,000₫. Your regulars are price-sensitive."),
    opts: [
      { t: T("Tăng giá bán thêm 5.000₫ ngay", "Raise your price by 5,000₫ at once"), r: "!?", fx: { varCost: 18_000, love: -6 },
        why: T("Bù được chi phí, nhưng tăng giá đột ngột làm mất khách. Khi cả thị trường đều tăng giá (chi phí đẩy), khách dễ chấp nhận hơn nếu bạn giải thích.", "Covers the cost, but a sudden jump loses customers. When everyone's costs rise (cost-push inflation), customers accept it more if you explain.") },
      { t: T("Giữ giá, đổi công thức: ly nhỏ hơn một chút, thêm topping bán riêng", "Keep the price, adjust: slightly smaller cup, sell toppings separately"), r: "!", fx: { varCost: 16_500, love: -1 },
        why: T("Bớt một phần chi phí mà khách ít cảm thấy. Nhiều hãng làm vậy khi lạm phát ('shrinkflation') — nhưng làm quá thì mất lòng tin.", "Trims costs in a way customers barely notice. Many brands do this in inflation ('shrinkflation') — overdo it and you lose trust.") },
      { t: T("Đổi sang nhà cung cấp rẻ, chất lượng kém hơn", "Switch to a cheaper, lower-quality supplier"), r: "?!", fx: { varCost: 15_000, love: -10 },
        why: T("Giữ được biên lợi nhuận tháng này nhưng 'độ yêu thích' của khách tụt — doanh số những tháng sau sẽ giảm.", "Saves this month's margin but customer love drops — sales will fall in the months after.") },
    ],
    views: [
      [T("Khách hàng", "Customers"), T("Ai cũng thấy giá tăng ở mọi nơi; điều họ ghét là bị 'lừa' về chất lượng.", "Everyone sees prices rising everywhere; what they hate is being cheated on quality.")],
      [T("Nhà cung cấp", "Suppliers"), T("Họ cũng bị chi phí đẩy lên: điện, xăng, vận chuyển.", "Their costs went up too: power, fuel, transport.")],
      [T("Nhà kinh tế", "Economist"), T("Đây là lạm phát do chi phí đẩy — khác với lạm phát do cầu kéo.", "This is cost-push inflation — different from demand-pull.")],
    ],
    story: T("Năm 1973, giá dầu tăng khoảng 4 lần chỉ trong vài tháng. Chi phí vận chuyển và sản xuất tăng vọt khắp nơi, doanh nghiệp buộc phải tăng giá, lạm phát lan rộng trong khi kinh tế chững lại — gọi là 'đình lạm'.",
      "In 1973 oil prices roughly quadrupled within months. Transport and production costs soared everywhere, firms had to raise prices, and inflation spread while the economy stalled — 'stagflation'."),
  },
  {
    id: "price-war", lesson: "c-price", title: T("Đối thủ mở ngay cạnh, giảm giá 30%", "A rival opens next door at 30% off"),
    setup: T("Một chuỗi lớn mở cửa hàng cạnh quán bạn và bán trà sữa giảm 30% trong tháng khai trương. Hàng của bạn vắng hơn hẳn.",
      "A big chain opens next to your kiosk with 30% off milk tea for its opening month. Your queue is noticeably shorter."),
    opts: [
      { t: T("Giảm giá theo, còn 25.000₫", "Match them: drop to 25,000₫"), r: "??", fx: { price: 25_000 },
        why: T("Ở 25.000₫, mỗi ly chỉ góp 10.000₫ để trả chi phí cố định — bạn phải bán gần gấp đôi mới hòa vốn. Chuỗi lớn chịu lỗ được lâu hơn bạn.", "At 25,000₫ each cup contributes only 10,000₫ to fixed costs — you'd need almost double the sales to break even. A big chain can lose money longer than you.") },
      { t: T("Giữ giá, tặng thẻ tích điểm cho khách quen", "Keep the price, give regulars a loyalty card"), r: "!", fx: { love: 6, cash: -1_500_000 },
        why: T("Khuyến mãi khai trương sẽ hết; khách quen ở lại vì mối quan hệ. Chi phí nhỏ, giữ được lãi góp mỗi ly.", "Opening deals end; regulars stay for the relationship. Small cost, and you keep your margin per cup.") },
      { t: T("Không làm gì, chờ họ hết khuyến mãi", "Do nothing and wait it out"), r: "★", fx: { love: -2 },
        why: T("Không tốn tiền, và thường khuyến mãi khai trương chỉ kéo dài vài tuần — nhưng bạn mất một ít khách.", "Costs nothing, and opening promotions usually last only weeks — but you lose some customers.") },
    ],
    views: [
      [T("Chuỗi lớn", "The chain"), T("Chấp nhận lỗ lúc đầu để giành khách — họ có nhiều vốn hơn.", "Accepts early losses to win customers — it has deeper pockets.")],
      [T("Khách hàng", "Customers"), T("Thích rẻ, nhưng cũng thích quán quen nhớ tên mình.", "Like cheap, but also like a shop that knows their name.")],
      [T("Bạn", "You"), T("Câu hỏi đúng: giảm giá thì bán thêm được bao nhiêu ly — có đủ bù không?", "The right question: how many more cups would a price cut sell — enough to make up for it?")],
    ],
    story: T("Các cuộc 'chiến tranh voucher' của sàn thương mại điện tử và chuỗi đồ uống cho thấy giảm giá giúp tăng doanh số nhanh nhưng thường làm mỏng lợi nhuận; người thắng thường là bên có nhiều vốn hoặc có khách hàng trung thành.",
      "E-commerce and drink-chain 'voucher wars' show that discounts lift sales quickly but usually thin out profits; winners tend to be the ones with deeper pockets or loyal customers."),
  },
  {
    id: "new-machine", lesson: "c-funding", title: T("Máy pha mới 20 triệu: vay hay tiền mặt?", "A 20-million machine: borrow or pay cash?"),
    setup: T("Máy pha cũ hay hỏng giờ cao điểm. Máy mới 20 triệu giúp phục vụ nhanh hơn (khách vui hơn). Bạn có thể trả bằng tiền của quán hoặc vay ngân hàng 24 tháng.",
      "Your old machine keeps breaking at rush hour. A new 20-million one serves faster (happier customers). You can pay with the shop's cash or borrow over 24 months."),
    opts: [
      { t: T("Vay 20 triệu lãi cố định", "Borrow 20 million at a fixed rate"), r: "!", fx: { loan: { amount: 20_000_000, kind: "fixed" }, love: 5, equip: 20_000_000 },
        why: T("Giữ tiền mặt cho vốn lưu động, khoản trả mỗi tháng biết trước. Một khoản đầu tư giúp tăng doanh thu thì vay là hợp lý — nếu dòng tiền trả nổi.", "Keeps cash for working capital and fixes your monthly payment. Borrowing for something that raises revenue makes sense — if cash flow can carry it.") },
      { t: T("Vay lãi thả nổi — đang rẻ hơn", "Borrow floating — cheaper right now"), r: "!?", fx: { loan: { amount: 20_000_000, kind: "float" }, love: 5, equip: 20_000_000 },
        why: T("Rẻ lúc này, nhưng nếu NHTW tăng lãi suất thì khoản trả tăng. Hãy tự hỏi: quán chịu được khoản trả cao nhất là bao nhiêu?", "Cheap now, but if the central bank raises rates, payments rise. Ask: what's the highest payment the shop could handle?") },
      { t: T("Trả tiền mặt từ quỹ của quán", "Pay cash from the shop's money"), r: "?!", fx: { cash: -20_000_000, love: 5, equip: 20_000_000 },
        why: T("Không nợ, nhưng quỹ quán cạn: một tháng xui là phải thấu chi lãi 20%/năm — đắt hơn nhiều khoản vay.", "No debt, but the shop's cash runs dry: one bad month and you're on a 20%-a-year overdraft — far dearer than the loan.") },
    ],
    views: [
      [T("Ngân hàng", "The bank"), T("Cho vay thiết bị dễ hơn vì có thể dùng chính máy làm tài sản bảo đảm.", "Equipment loans are easier: the machine itself can be collateral.")],
      [T("Nhà đầu tư (nếu có)", "Your investor (if any)"), T("Muốn tiền được dùng vào thứ tạo ra doanh thu.", "Wants money spent on things that generate revenue.")],
      [T("Bạn", "You"), T("Nợ không xấu — nợ để mua thứ tạo ra tiền, trả được, thì là đòn bẩy.", "Debt isn't bad — debt for something that earns money, and that you can repay, is leverage.")],
    ],
    story: T("Doanh nghiệp nhỏ thường vay để mua thiết bị (thế chấp bằng chính thiết bị) và giữ tiền mặt cho hoạt động hằng ngày. Năm 2022–23, khi lãi suất tăng, nhiều chủ cửa hàng vay thả nổi thấy chi phí lãi tăng mạnh.",
      "Small firms often borrow to buy equipment (secured on the equipment) and keep cash for day-to-day running. In 2022–23, as rates rose, many shop owners with floating loans saw interest costs jump."),
  },
];
