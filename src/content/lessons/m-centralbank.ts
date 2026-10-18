/* Macroeconomics · M2 — "The central bank — who holds the tap?" (design doc 13.2d ③, 6-beat frame 13.2c)
 * Policy rate → bank rates → borrowing & spending → prices; the inflation–unemployment trade-off; your own loan.
 * Survey trap (13.2e): only 13% knew a floating-rate loan costs MORE when rates rise.
 * ⚠️ Draft written with AI help — team review. Verify: Fed funds target 2022–23 (near 0% → 5.25–5.5% by Jul 2023);
 * US CPI peak ~9.1% (Jun 2022); State Bank of Vietnam refinancing rate 4% → 5% (Sep 2022) → 6% (Oct 2022).
 * The dial's economy is a deliberately simple linear model (stated on screen as a model). Mortgage payments computed here. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "m-centralbank",
  domain: "macro",
  icon: "🎛️",
  ic: "bank",
  minutes: 7,
  title: { vi: "Ngân hàng trung ương — người cầm vòi nước", en: "The central bank — who holds the tap?" },
  desc: {
    vi: "Lãi suất điều hành lan sang lãi vay, lãi gửi, chi tiêu và giá cả ra sao; vì sao hạ lạm phát phải đánh đổi việc làm; và vì sao khoản vay thả nổi của nhà bạn tăng theo.",
    en: "How the policy rate flows into loan and deposit rates, spending and prices; why taming inflation trades off jobs; and why your family's floating loan goes up with it.",
  },
  prereq: { vi: "lạm phát là giá cả nói chung tăng; vay thả nổi thì lãi đổi theo thị trường.", en: "inflation is prices rising in general; a floating loan's rate follows the market." },
  review: {
    title: { vi: "NHTW & lãi suất", en: "Central bank & rates" },
    points: [
      { vi: "NHTW đặt <b>lãi suất điều hành</b> — 'giá gốc' của tiền trong nền kinh tế.", en: "The central bank sets the <b>policy rate</b> — the base 'price' of money in the economy." },
      { vi: "Tăng lãi → vay đắt, gửi lợi → chi tiêu giảm → lạm phát hạ (sau vài tháng).", en: "Raise rates → borrowing dearer, saving better → spending falls → inflation eases (after months)." },
      { vi: "Đánh đổi: hạ nhiệt quá mạnh → thất nghiệp tăng.", en: "Trade-off: cool too hard → unemployment rises." },
      { vi: "Vay <b>thả nổi</b> khi lãi suất tăng → trả <b>nhiều hơn</b>.", en: "A <b>floating</b> loan when rates rise → you pay <b>more</b>." },
    ],
  },
  info: {
    s: { vi: "NHTW tăng lãi suất để hạ lạm phát: vay đắt hơn, chi tiêu chậm lại — đổi lại việc làm có thể giảm; vay thả nổi trả nhiều hơn.", en: "Central banks raise rates to fight inflation: borrowing gets dearer, spending slows — jobs may suffer; floating loans cost more." },
    l: {
      vi: "Ngân hàng trung ương (ở Việt Nam là Ngân hàng Nhà nước) đặt lãi suất điều hành — mức lãi khi các ngân hàng vay của NHTW. Khi nó tăng, ngân hàng thương mại tăng lãi cho vay và lãi tiền gửi; người dân và doanh nghiệp vay ít hơn, gửi nhiều hơn, chi tiêu chậm lại, nên giá cả tăng chậm lại — nhưng phải mất 6–18 tháng, và nếu hãm quá mạnh thì doanh nghiệp cắt giảm, thất nghiệp tăng. Vì vậy NHTW luôn cân bằng giữa lạm phát và việc làm. Người vay lãi thả nổi cảm nhận đầu tiên: khoản trả hằng tháng tăng.",
      en: "The central bank (in Vietnam, the State Bank of Vietnam) sets the policy rate — what banks pay to borrow from it. When it rises, commercial banks raise loan and deposit rates; people and firms borrow less, save more and spend more slowly, so prices rise more slowly — but it takes 6–18 months, and braking too hard makes firms cut back and unemployment rise. So the central bank always balances inflation against jobs. Floating-rate borrowers feel it first: their monthly payment goes up.",
    },
  },
  kb: ["fixedfloat", "inflation", "realrate"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Federal Reserve Board building Washington" }, art: "🎛️ → 🏦 → 🏠💸", cap: { vi: "Một con số, hàng triệu khoản trả góp", en: "One number, millions of loan payments" },
      title: { vi: "Ngân hàng trung ương — người cầm vòi nước", en: "The central bank — who holds the tap?" },
      text: {
        vi: "Năm 2022, giá cả ở Mỹ tăng nhanh nhất 40 năm. Một nhóm người họp vài lần mỗi năm, quyết định <b>một con số</b> — lãi suất điều hành — và con số đó làm thay đổi khoản trả góp của hàng triệu gia đình, kể cả ở Việt Nam. Hôm nay <b>bạn</b> ngồi vào ghế Thống đốc.",
        en: "In 2022, US prices rose at the fastest pace in 40 years. A small group meets a few times a year, decides <b>one number</b> — the policy rate — and that number changes the loan payments of millions of families, in Vietnam too. Today <b>you</b> take the Governor's chair.",
      },
      lion: { vi: "Hình dung NHTW cầm vòi nước: mở to → tiền chảy mạnh, kinh tế nóng; vặn nhỏ → tiền chảy chậm, giá cả nguội lại 🚰", en: "Picture the central bank holding a tap: open wide → money gushes, the economy heats up; turn it down → money slows, prices cool 🚰" },
    },
    /* 2 · Guess first (survey trap: 13% knew this) */
    {
      t: "predict", q: { vi: "Đoán thử: nhà bạn vay 1 tỷ mua nhà, 20 năm, lãi THẢ NỔI 8% → trả 8,36 triệu/tháng. NHTW tăng lãi suất, lãi vay lên 10%. Khoản trả mới mỗi tháng là bao nhiêu?", en: "Guess: your family borrowed 1 billion for a home over 20 years at a FLOATING 8% → 8.36 million a month. The central bank raises rates and the loan goes to 10%. What's the new monthly payment?" },
      art: "🏠 1 tỷ · 8% → 10%", min: 8000000, max: 12000000, step: 50000, start: 8350000, actual: 9650000, unit: "vnd",
      reveal: { vi: "Khoảng <b>9,65 triệu</b> — thêm gần 1,3 triệu mỗi tháng (+15%), chỉ vì một quyết định ở NHTW. Trong khảo sát của nhóm, chỉ 13% bạn biết vay thả nổi sẽ trả NHIỀU hơn khi lãi suất tăng; nhiều bạn nghĩ khoản trả giữ nguyên.", en: "About <b>9.65 million</b> — nearly 1.3 million more a month (+15%), from one central-bank decision. In our survey only 13% knew a floating loan costs MORE when rates rise; many thought it stays the same." },
    },
    /* 3 · Mechanism */
    {
      t: "order", q: { vi: "NHTW tăng lãi suất để hạ lạm phát. Sắp xếp chuỗi tác động theo đúng thứ tự.", en: "The central bank raises rates to cut inflation. Put the chain of effects in order." },
      items: [
        ["🎛️", { vi: "NHTW tăng lãi suất điều hành", en: "The central bank raises its policy rate" }],
        ["🏦", { vi: "Ngân hàng tăng lãi cho vay và lãi tiền gửi", en: "Banks raise loan and deposit rates" }],
        ["💳", { vi: "Người dân, doanh nghiệp vay ít đi, gửi nhiều hơn", en: "People and firms borrow less and save more" }],
        ["🛒", { vi: "Chi tiêu và đầu tư chậm lại", en: "Spending and investment slow down" }],
        ["📉", { vi: "Giá cả tăng chậm lại — lạm phát giảm", en: "Prices rise more slowly — inflation falls" }],
      ],
      why: { vi: "Đây gọi là cơ chế truyền dẫn. Mỗi mắt xích cần thời gian — thường 6–18 tháng mới thấy lạm phát giảm rõ.", en: "This is the transmission mechanism. Each link takes time — it usually takes 6–18 months to see inflation clearly fall." },
      hint: { vi: "Bắt đầu từ NHTW, kết thúc ở giá cả.", en: "Start at the central bank, end with prices." },
    },
    {
      t: "dial", q: { vi: "Bạn là Thống đốc. Lạm phát đang <b>7%</b> — quá cao. Mục tiêu năm sau: lạm phát ≤ 4,5%, nhưng thất nghiệp không được vượt 5%. Xoay núm lãi suất rồi bấm Kiểm tra.", en: "You're the Governor. Inflation is <b>7%</b> — too high. Next year's goal: inflation ≤ 4.5%, without unemployment going over 5%. Turn the rate dial, then press Check." },
      dial: { min: 2, max: 10, step: 0.25, start: 4, r0: 4, pi0: 7, kPi: 0.8, u0: 2.4, kU: 0.6, goalPi: 4.5, goalU: 5, loan: 1_000_000_000, months: 240, spread: 4 },
      a: 7.75,
      why: { vi: "Khoảng 7,25–8,25% thì đạt cả hai mục tiêu. Thấp hơn: lạm phát vẫn cao, ai cũng mất sức mua. Cao hơn: hãm quá tay, doanh nghiệp cắt giảm, thất nghiệp vượt 5%. Và để ý ô thứ ba: chính khoản vay nhà bạn tăng theo mỗi nấc. (Đây là mô hình đơn giản để minh họa — nền kinh tế thật phức tạp và có độ trễ.)", en: "Roughly 7.25–8.25% meets both goals. Lower: inflation stays high and everyone loses buying power. Higher: you brake too hard, firms cut back and unemployment passes 5%. And watch the third box: your family's own loan rises with every notch. (A simple model for illustration — the real economy is more complex and slower.)" },
      hint: { vi: "Tìm vùng mà cả hai ô đầu cùng xanh.", en: "Find the zone where the first two boxes are both green." },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Năm 2022 Fed (NHTW Mỹ) tăng lãi suất nhanh nhất nhiều thập kỷ. Lạm phát Mỹ diễn biến thế nào sau đó?", en: "In 2022 the Fed (the US central bank) raised rates faster than in decades. What happened to US inflation afterwards?" },
      chart: {
        kind: "line",
        labels: [{ vi: "1/22", en: "Jan 22" }, { vi: "6/22", en: "Jun 22" }, { vi: "9/22", en: "Sep 22" }, { vi: "12/22", en: "Dec 22" }, { vi: "3/23", en: "Mar 23" }, { vi: "7/23", en: "Jul 23" }],
        series: [
          { name: { vi: "Lãi suất Fed (%)", en: "Fed rate (%)" }, color: "#8B6CF0", data: [0.1, 1.6, 3.1, 4.4, 4.9, 5.4] },
          { name: { vi: "Lạm phát Mỹ (%/năm)", en: "US inflation (%/yr)" }, color: "#EF4E4E", data: [7.5, 9.1, 8.2, 6.5, 5.0, 3.2] },
        ],
        y: "%",
        source: { vi: "Fed, Cục Thống kê Lao động Mỹ (số làm tròn)", en: "Federal Reserve, US Bureau of Labor Statistics (rounded)" },
      },
      o: [
        { vi: "Đạt đỉnh giữa 2022 rồi giảm dần khi lãi suất ở mức cao", en: "Peaked in mid-2022, then fell while rates stayed high" },
        { vi: "Giảm ngay tháng sau khi tăng lãi suất", en: "Fell the very next month" },
        { vi: "Tăng mãi không dừng", en: "Kept rising non-stop" },
        { vi: "Không liên quan gì đến lãi suất", en: "Had nothing to do with rates" },
      ],
      a: 0,
      why: { vi: "Lạm phát đỉnh ~9,1% (6/2022) rồi giảm còn ~3% giữa 2023 — chậm hơn nhiều so với tốc độ tăng lãi suất. Ở Việt Nam, NHNN tăng lãi suất tái cấp vốn từ 4% lên 5% (9/2022) rồi 6% (10/2022).", en: "Inflation peaked at ~9.1% (Jun 2022) and fell to ~3% by mid-2023 — much more slowly than rates rose. In Vietnam, the State Bank raised its refinancing rate from 4% to 5% (Sep 2022) and 6% (Oct 2022)." },
      hint: { vi: "Theo dõi đường đỏ từ trái sang phải.", en: "Follow the red line from left to right." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Bạn đang vay lãi THẢ NỔI. NHTW tăng lãi suất. Khoản trả hằng tháng của bạn…", en: "You have a FLOATING-rate loan. The central bank raises rates. Your monthly payment…" },
      o: [
        { vi: "Giữ nguyên, vì hợp đồng đã ký rồi", en: "Stays the same, the contract is signed" },
        { vi: "Tăng lên ở kỳ điều chỉnh lãi tiếp theo", en: "Goes up at the next rate reset" },
        { vi: "Giảm xuống", en: "Goes down" },
        { vi: "Ngân hàng phải hủy hợp đồng", en: "The bank has to cancel the contract" },
      ],
      a: 1,
      why: { vi: "'Thả nổi' nghĩa là lãi suất đi theo thị trường (thường = lãi cơ sở + biên độ cố định). Hợp đồng đã ký chính là điều khoản cho phép lãi thay đổi. Chỉ vay <b>cố định</b> mới giữ nguyên.", en: "'Floating' means the rate follows the market (usually a base rate + a fixed margin). The signed contract is exactly what lets it change. Only a <b>fixed</b> loan stays the same." },
      hint: { vi: "'Thả nổi' — nổi theo cái gì?", en: "'Floating' — floating with what?" },
    },
    {
      t: "sort", q: { vi: "NHTW vừa TĂNG lãi suất. Ai vui hơn, ai lo hơn?", en: "The central bank just RAISED rates. Who's happier, who's more worried?" },
      buckets: [["😊", { vi: "Vui hơn", en: "Happier" }], ["😟", { vi: "Lo hơn", en: "More worried" }]],
      items: [
        ["🐷", { vi: "Người đang gửi tiết kiệm", en: "Someone with savings" }, 0],
        ["🏠", { vi: "Gia đình vay mua nhà lãi thả nổi", en: "A family with a floating mortgage" }, 1],
        ["🏭", { vi: "Doanh nghiệp định vay để mở xưởng", en: "A firm planning to borrow for a factory" }, 1],
        ["👵", { vi: "Người về hưu sống bằng lãi tiết kiệm", en: "A retiree living on savings interest" }, 0],
        ["🧋", { vi: "Chủ quán vừa vay thả nổi mua máy", en: "A shop owner with a new floating loan" }, 1],
        ["🛒", { vi: "Người lo giá cả tăng quá nhanh", en: "Someone worried prices rise too fast" }, 0],
      ],
      why: { vi: "Lãi suất cao thưởng cho người gửi tiền và (về lâu dài) người lo lạm phát; người vay — nhất là vay thả nổi — chịu thiệt. Không có quyết định nào làm vui tất cả.", en: "High rates reward savers and (in time) anyone worried about inflation; borrowers — especially floating — lose out. No decision pleases everyone." },
      hint: { vi: "Hỏi: người này đang gửi tiền hay đang vay tiền?", en: "Ask: is this person saving or borrowing?" },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: bạn của bạn hỏi “Sao NHTW lại cố tình làm vay tiền đắt hơn, để nhiều người khổ?” Giải thích 1–2 câu.", en: "Final boss: a friend asks “Why would the central bank make borrowing dearer on purpose and hurt people?” Explain in 1–2 sentences." },
      keys: [
        { label: { vi: "Hạ lạm phát / giữ giá", en: "Cut inflation / steady prices" }, words: { vi: ["lạm phát", "giá cả", "giá tăng", "sức mua", "ổn định giá"], en: ["inflation", "prices", "buying power", "purchasing power", "stable"] } },
        { label: { vi: "Giảm vay & chi tiêu", en: "Less borrowing & spending" }, words: { vi: ["chi tiêu", "vay ít", "bớt vay", "giảm vay", "tiêu ít", "hạ nhiệt", "nguội", "cầu"], en: ["spending", "borrow less", "less borrowing", "cool", "demand"] } },
        { label: { vi: "Đánh đổi / ai cũng thiệt nếu không làm", en: "Trade-off / worse if not done" }, words: { vi: ["đánh đổi", "thiệt", "tất cả", "mọi người", "lâu dài", "thất nghiệp", "cân bằng"], en: ["trade-off", "tradeoff", "everyone", "long run", "unemployment", "balance", "worse"] } },
      ],
      need: 2,
      model: { vi: "Vì lạm phát cao làm mọi người mất sức mua, nên NHTW tăng lãi để mọi người bớt vay và chi tiêu, giá cả hạ nhiệt — đó là đánh đổi: khổ một chút bây giờ để tránh giá cả tăng vọt lâu dài.", en: "High inflation makes everyone lose buying power, so the central bank raises rates to make people borrow and spend less and cool prices — a trade-off: some pain now to avoid prices running away for years." },
      why: { vi: "Ý chính: mục tiêu là ổn định giá cả cho tất cả mọi người; công cụ là làm vay và chi tiêu chậm lại; cái giá là có người thiệt và việc làm có thể giảm.", en: "Key idea: the goal is stable prices for everyone; the tool is slowing borrowing and spending; the price is that some people lose and jobs may suffer." },
      hint: { vi: "Nếu NHTW không làm gì khi giá cả tăng 9%/năm thì ai bị thiệt?", en: "If the central bank did nothing while prices rose 9% a year, who would lose?" },
    },
    {
      t: "learn", art: "📰 🎛️ 🏠",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Lần tới đọc tin “NHNN tăng/giảm lãi suất điều hành”:", en: "Next time you see “the State Bank raises/cuts its policy rate”:" },
      items: [
        ["🏠", { vi: "Hỏi bố mẹ: nhà mình có khoản vay thả nổi nào không? Kỳ điều chỉnh lãi là khi nào?", en: "Ask your parents: do we have a floating loan? When does its rate reset?" }],
        ["🐷", { vi: "Lãi tiết kiệm sắp tăng/giảm — sổ tiết kiệm sắp đáo hạn có nên gửi kỳ dài hơn?", en: "Savings rates will follow — should a maturing deposit go for a longer term?" }],
        ["🔎", { vi: "Đọc tiếp: lạm phát tháng gần nhất là bao nhiêu? NHTW đang hãm hay đang bơm?", en: "Read on: what was last month's inflation? Is the central bank braking or pumping?" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: lãi suất ở Ngân hàng và Quán do NHTW mô phỏng điều chỉnh — và vai Thống đốc trong chế độ Khủng hoảng!", en: "🎮 Unlocked in the game: rates at the Bank and your Shop follow the simulated central bank — and the Governor role in Crisis mode!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "i = r* + π + ½(π − π*) + ½·gap", fs: 20,
      title: { vi: "Quy tắc Taylor — 'công thức' tham khảo của NHTW", en: "The Taylor rule — a central bank's reference formula" },
      text: {
        vi: "Năm 1993, nhà kinh tế John Taylor đề xuất một quy tắc đơn giản: lãi suất điều hành <b>i</b> = lãi suất thực trung lập <b>r*</b> + lạm phát hiện tại <b>π</b> + ½ × (lạm phát − mục tiêu) + ½ × (độ chênh sản lượng). Lạm phát vượt mục tiêu 1 điểm → lãi suất nên tăng <b>hơn</b> 1 điểm, để lãi suất <b>thực</b> thật sự tăng. Không NHTW nào làm theo máy móc, nhưng họ dùng nó để đối chiếu.",
        en: "In 1993 economist John Taylor proposed a simple rule: policy rate <b>i</b> = neutral real rate <b>r*</b> + current inflation <b>π</b> + ½ × (inflation − target) + ½ × (output gap). Inflation 1 point over target → rates should rise by <b>more</b> than 1 point, so the <b>real</b> rate actually goes up. No central bank follows it mechanically, but they use it as a cross-check.",
      },
    },
    {
      t: "calc", q: { vi: "Dùng quy tắc Taylor: r* = 2%, mục tiêu lạm phát π* = 4%, độ chênh sản lượng +1%.", en: "Use the Taylor rule: r* = 2%, inflation target π* = 4%, output gap +1%." },
      parts: [
        { label: { vi: "Lạm phát π = 7%: lãi suất điều hành gợi ý (%)", en: "Inflation π = 7%: suggested policy rate (%)" }, a: 11, tol: 0.05, unit: "%" },
        { label: { vi: "Lạm phát π = 4% (đúng mục tiêu), độ chênh 0: lãi suất gợi ý (%)", en: "Inflation π = 4% (on target), gap 0: suggested rate (%)" }, a: 6, tol: 0.05, unit: "%" },
      ],
      why: { vi: "2 + 7 + ½·3 + ½·1 = 11%. Khi đúng mục tiêu: 2 + 4 + 0 + 0 = 6% — lãi suất 'trung lập'.", en: "2 + 7 + ½·3 + ½·1 = 11%. On target: 2 + 4 + 0 + 0 = 6% — the 'neutral' rate." },
      hint: { vi: "Thay số vào từng phần: r* + π + ½(π − π*) + ½·gap.", en: "Plug into each part: r* + π + ½(π − π*) + ½·gap." },
    },
    {
      t: "mcq", q: { vi: "NHTW tăng lãi suất từ tháng 3 mà đến tháng 9 lạm phát vẫn cao. Giải thích hợp lý nhất?", en: "The central bank raised rates in March, yet inflation is still high in September. Best explanation?" },
      o: [
        { vi: "Chính sách tiền tệ có độ trễ — thường 6–18 tháng mới tác động đầy đủ", en: "Monetary policy works with a lag — often 6–18 months to have its full effect" },
        { vi: "Tăng lãi suất không bao giờ ảnh hưởng tới giá cả", en: "Rate rises never affect prices" },
        { vi: "Ngân hàng thương mại không được phép đổi lãi suất", en: "Commercial banks aren't allowed to change their rates" },
        { vi: "Lạm phát chỉ phụ thuộc vào tỷ giá", en: "Inflation depends only on the exchange rate" },
      ],
      a: 0,
      why: { vi: "Hợp đồng vay cũ, giá đã niêm yết, kỳ vọng của người dân… đều cần thời gian điều chỉnh. Vì thế NHTW phải nhìn trước và không nên 'đạp phanh' quá mạnh chỉ vì số liệu tháng này.", en: "Existing loans, posted prices and people's expectations all take time to adjust. So central banks must look ahead and not slam the brakes because of a single month's data." },
    },
  ],
};
export default lesson;
