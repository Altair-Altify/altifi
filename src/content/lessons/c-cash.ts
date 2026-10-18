/* Business finance · B3 — "Profitable yet bankrupt — how?" (design doc 13.2d ②, 6-beat frame 13.2c)
 * Profit ≠ cash; working capital (receivables, payables, inventory); the three financial statements.
 * Linh's shop (same story as B1). Numbers: normal month = revenue 45M, variable 19.5M, fixed 20.5M → profit & cash +5M.
 * Contract: 800 cups × 30,000₫ = 24M revenue, 12M ingredients paid now, customer pays 60 days later.
 * Cash: start 10M → M1 3M → M2 −4M → M3 25M (first payment in) → M4 54M. Profit: 17M, 17M, 5M, 5M.
 * ⚠️ Draft written with AI help — team review. The "cash-flow problems are a top reason small firms fail" claim is
 * phrased generally on purpose; find a source before quoting a figure. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "c-cash",
  domain: "corporate",
  icon: "💧",
  ic: "drop",
  minutes: 7,
  title: { vi: "Lời mà vẫn phá sản — chuyện gì vậy?", en: "Profitable yet bankrupt — how?" },
  desc: {
    vi: "Lợi nhuận khác tiền mặt: khách nợ, hàng tồn kho, trả trước — và cách đọc báo cáo dòng tiền để quán không 'chết khát' khi đang có lãi.",
    en: "Profit isn't cash: customers who owe you, stock, prepayments — and reading a cash-flow statement so a profitable shop doesn't die of thirst.",
  },
  prereq: { vi: "doanh thu, chi phí cố định/biến đổi và lợi nhuận (bài B1).", en: "revenue, fixed/variable costs and profit (lesson B1)." },
  review: {
    title: { vi: "Lợi nhuận vs tiền mặt", en: "Profit vs cash" },
    points: [
      { vi: "Lợi nhuận ghi khi <b>bán</b>; tiền mặt ghi khi tiền <b>thật sự vào/ra</b>.", en: "Profit is counted when you <b>sell</b>; cash when money <b>actually moves</b>." },
      { vi: "Khách nợ (phải thu), hàng tồn kho, trả trước → 'giam' tiền.", en: "Money owed to you, stock, prepayments → 'lock up' cash." },
      { vi: "Nợ nhà cung cấp (phải trả), đặt cọc của khách → giữ tiền lại.", en: "Paying suppliers later, customer deposits → keep cash in." },
      { vi: "Lương, tiền thuê trả bằng TIỀN MẶT, không bằng lợi nhuận.", en: "Wages and rent are paid in CASH, not in profit." },
    ],
  },
  info: {
    s: { vi: "Lợi nhuận ≠ tiền mặt: bán chịu, tồn kho, trả trước có thể làm quán hết tiền dù đang có lãi.", en: "Profit ≠ cash: selling on credit, stock and prepayments can drain a profitable shop." },
    l: {
      vi: "Báo cáo kết quả kinh doanh ghi doanh thu khi bán hàng, kể cả khi khách chưa trả tiền; báo cáo dòng tiền ghi khi tiền thật sự vào hoặc ra. Khoảng cách giữa hai thứ là vốn lưu động: khoản phải thu (khách nợ), hàng tồn kho và các khoản trả trước làm 'giam' tiền; khoản phải trả (mình nợ nhà cung cấp) và tiền đặt cọc của khách giúp giữ tiền. Một doanh nghiệp có lãi vẫn có thể phá sản nếu hết tiền mặt để trả lương, tiền thuê, nợ đến hạn.",
      en: "The income statement records revenue when you sell, even if the customer hasn't paid; the cash-flow statement records money when it actually comes in or goes out. The gap is working capital: receivables (customers owe you), inventory and prepayments lock cash up; payables (you owe suppliers) and customer deposits keep cash in. A profitable business can still go bankrupt if it runs out of cash for wages, rent and debts that fall due.",
    },
  },
  kb: ["profit", "breakeven", "debt"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "cafe staff counter" }, art: "📈 +17tr · 💸 −4tr", cap: { vi: "Lãi kỷ lục — mà không có tiền trả lương", en: "Record profit — and no money for wages" },
      title: { vi: "Lời mà vẫn phá sản — chuyện gì vậy?", en: "Profitable yet bankrupt — how?" },
      text: {
        vi: "Một công ty gần quán đặt Linh <b>800 ly mỗi tháng trong 2 tháng</b>, giá 30.000₫ — thêm 24 triệu doanh thu mỗi tháng! Họ trả tiền <b>sau 60 ngày</b>. Hai tháng liền, báo cáo của quán ghi lãi kỷ lục. Vậy mà cuối tháng thứ hai, Linh không có tiền trả lương nhân viên. Chuyện gì đã xảy ra?",
        en: "A company near the shop orders <b>800 cups a month for 2 months</b> at 30,000₫ — 24 million extra revenue a month! They pay <b>60 days later</b>. Two months running, the shop's report shows record profit. Yet at the end of month two, Linh can't pay her staff. What happened?",
      },
      lion: { vi: "Lương trả bằng tiền mặt, không trả bằng 'lợi nhuận trên giấy' 💸", en: "Wages are paid in cash, not in 'profit on paper' 💸" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: quán có 10 triệu tiền mặt. Mỗi tháng việc bán lẻ tự lo được và dư 5 triệu. Hợp đồng bắt Linh trả 12 triệu nguyên liệu NGAY mỗi tháng, 2 tháng sau mới thu tiền. Cuối THÁNG 2, quán còn bao nhiêu tiền mặt?", en: "Guess: the shop has 10 million in cash. Each month normal sales pay for themselves and leave 5 million over. The contract makes Linh pay 12 million of ingredients NOW each month, collecting 2 months later. How much cash at the end of MONTH 2?" },
      art: "💰 10tr · +5 −12 · +5 −12", min: -10000000, max: 20000000, step: 500000, start: 15000000, actual: -4000000, unit: "vnd",
      reveal: { vi: "<b>−4 triệu</b> — âm tiền! 10 + 5 − 12 = 3 triệu sau tháng 1; 3 + 5 − 12 = −4 triệu sau tháng 2. Trong khi đó báo cáo lãi lỗ ghi <b>lãi 17 triệu mỗi tháng</b>. Tiền hợp đồng chỉ về từ tháng 3.", en: "<b>−4 million</b> — below zero! 10 + 5 − 12 = 3 million after month 1; 3 + 5 − 12 = −4 million after month 2. Meanwhile the profit report shows <b>17 million profit a month</b>. The contract money only arrives from month 3." },
    },
    /* 3 · Mechanism */
    {
      t: "statement", q: { vi: "Hai báo cáo của quán Linh, tháng 2. Lợi nhuận +17 triệu mà tiền mặt −7 triệu. Khoản nào tạo ra chênh lệch 24 triệu?", en: "Linh's two reports, month 2. Profit +17 million but cash −7 million. What makes the 24-million gap?" },
      sheets: [
        { title: { vi: "Kết quả kinh doanh · tháng 2 (₫)", en: "Profit & loss · month 2 (₫)" }, rows: [
          { l: { vi: "Doanh thu khách lẻ", en: "Walk-in revenue" }, v: 45000000 },
          { l: { vi: "Doanh thu hợp đồng (đã giao hàng)", en: "Contract revenue (delivered)" }, v: 24000000 },
          { l: { vi: "− Chi phí biến đổi", en: "− Variable costs" }, v: -31500000, sub: true },
          { l: { vi: "− Chi phí cố định", en: "− Fixed costs" }, v: -20500000, sub: true },
          { l: { vi: "= Lợi nhuận", en: "= Profit" }, v: 17000000, bold: true },
        ] },
        { title: { vi: "Dòng tiền · tháng 2 (₫)", en: "Cash flow · month 2 (₫)" }, rows: [
          { l: { vi: "Tiền khách lẻ trả", en: "Cash from walk-ins" }, v: 45000000 },
          { l: { vi: "Tiền công ty trả", en: "Cash from the company" }, v: 0 },
          { l: { vi: "− Trả nguyên liệu", en: "− Paid for ingredients" }, v: -31500000, sub: true },
          { l: { vi: "− Trả thuê & lương", en: "− Paid rent & wages" }, v: -20500000, sub: true },
          { l: { vi: "= Tiền mặt tăng/giảm", en: "= Net cash" }, v: -7000000, bold: true },
        ] },
      ],
      o: [
        { vi: "Doanh thu hợp đồng đã ghi nhận nhưng chưa thu tiền (khoản phải thu)", en: "Contract revenue counted but not yet collected (a receivable)" },
        { vi: "Chi phí cố định quá cao", en: "Fixed costs are too high" },
        { vi: "Quán phải nộp thuế", en: "The shop paid tax" },
        { vi: "Linh tiêu tiền của quán", en: "Linh spent the shop's money" },
      ],
      a: 0,
      why: { vi: "Hai báo cáo giống hệt nhau, chỉ khác đúng 1 dòng: 24 triệu hợp đồng nằm trong lợi nhuận nhưng chưa thành tiền. Đó là <b>khoản phải thu</b> — tiền của bạn, nhưng đang nằm trong túi người khác.", en: "The two reports are identical except one line: the 24-million contract is in profit but not yet in cash. That's a <b>receivable</b> — your money, sitting in someone else's pocket." },
      hint: { vi: "So từng dòng của hai bảng — dòng nào khác nhau?", en: "Compare the two tables line by line — which line differs?" },
    },
    {
      t: "sort", q: { vi: "Việc này GIỮ tiền mặt lại hay làm CẠN tiền mặt của quán?", en: "Does this KEEP cash in the shop or DRAIN it?" },
      buckets: [["🫙", { vi: "Giữ tiền lại", en: "Keeps cash" }], ["🕳️", { vi: "Làm cạn tiền", en: "Drains cash" }]],
      items: [
        ["🤝", { vi: "Cho khách công ty nợ 60 ngày", en: "Letting a company client pay in 60 days" }, 1],
        ["📦", { vi: "Nhập nguyên liệu dự trữ cho 3 tháng", en: "Buying 3 months of ingredients up front" }, 1],
        ["🧾", { vi: "Xin nhà cung cấp cho trả sau 30 ngày", en: "Asking your supplier for 30 days to pay" }, 0],
        ["💵", { vi: "Đòi đặt cọc 50% trước khi nhận đơn lớn", en: "Asking for a 50% deposit on a big order" }, 0],
        ["🏠", { vi: "Trả trước tiền thuê cả năm để được giảm 5%", en: "Prepaying a year's rent for a 5% discount" }, 1],
        ["📱", { vi: "Khách lẻ chuyển khoản ngay tại quầy", en: "Walk-ins paying by transfer at the counter" }, 0],
      ],
      why: { vi: "Tiền về sớm, đi muộn → giữ tiền. Tiền đi sớm (tồn kho, trả trước), về muộn (cho nợ) → cạn tiền. Vài việc vẫn đáng làm (giảm 5% tiền thuê) — miễn là còn đủ tiền mặt dự phòng.", en: "Money in early, out late → keeps cash. Money out early (stock, prepaying), in late (credit) → drains it. Some are still worth doing (5% off rent) — as long as you keep a cash buffer." },
      hint: { vi: "Hỏi: tiền rời quán sớm hơn hay về quán sớm hơn?", en: "Ask: does money leave earlier or arrive earlier?" },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Lợi nhuận cộng dồn và tiền mặt của quán Linh qua 4 tháng. Tháng nào quán NGUY HIỂM nhất?", en: "Linh's cumulative profit and cash over 4 months. Which month was the shop in the most DANGER?" },
      chart: {
        kind: "line",
        labels: [{ vi: "Tháng 1", en: "Month 1" }, { vi: "Tháng 2", en: "Month 2" }, { vi: "Tháng 3", en: "Month 3" }, { vi: "Tháng 4", en: "Month 4" }],
        series: [
          { name: { vi: "Lợi nhuận cộng dồn", en: "Cumulative profit" }, color: "#2BB673", data: [17, 34, 39, 44] },
          { name: { vi: "Tiền mặt cuối tháng", en: "Cash at month end" }, color: "#3D7BF5", data: [3, -4, 25, 54] },
        ],
        y: { vi: "triệu ₫", en: "million ₫" },
        source: { vi: "Ví dụ minh họa (quán của Linh)", en: "Illustrative example (Linh's shop)" },
      },
      o: [{ vi: "Tháng 2 — tiền mặt âm dù lợi nhuận đang tăng mạnh", en: "Month 2 — cash below zero while profit soars" }, { vi: "Tháng 4", en: "Month 4" }, { vi: "Tháng 3", en: "Month 3" }, { vi: "Không tháng nào", en: "None" }],
      a: 0,
      why: { vi: "Đường xanh lá đi lên đều — nhìn lợi nhuận thì tưởng quán khỏe nhất. Nhưng đường xanh dương chạm đáy ở tháng 2. Ngoài đời, rất nhiều doanh nghiệp nhỏ phá sản đúng ở 'đáy' như vậy: khách nợ nhiều, hàng tồn lớn, tiền mặt cạn — các khảo sát về doanh nghiệp nhỏ thường xếp vấn đề dòng tiền vào nhóm lý do thất bại hàng đầu.", en: "The green line climbs steadily — judging by profit, the shop looks healthiest. But the blue line hits bottom in month 2. In real life many small firms go under at exactly such a low point: lots owed to them, big stock, no cash — surveys of small firms usually rank cash-flow problems among the top reasons they fail." },
      hint: { vi: "Nhìn đường xanh dương (tiền mặt), không phải đường xanh lá.", en: "Watch the blue (cash) line, not the green one." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Doanh nghiệp đang có lãi thì không thể hết tiền.” Đúng không?", en: "“A profitable business can't run out of money.” True?" },
      o: [
        { vi: "Đúng — có lãi nghĩa là có tiền", en: "True — profit means money" },
        { vi: "Sai — lãi có thể đang nằm ở khách nợ, hàng tồn kho, thiết bị; tiền mặt vẫn có thể cạn", en: "False — profit can sit in money owed, stock, equipment; cash can still run dry" },
        { vi: "Đúng, trừ khi bị phạt thuế", en: "True, unless fined by the tax office" },
        { vi: "Sai — doanh nghiệp có lãi luôn bị lỗ về sau", en: "False — profitable businesses always lose later" },
      ],
      a: 1,
      why: { vi: "Lợi nhuận là thước đo 'kiếm được bao nhiêu'; tiền mặt là 'đang cầm bao nhiêu'. Doanh nghiệp chết vì hết tiền mặt, không phải vì hết lợi nhuận.", en: "Profit measures 'how much you earned'; cash is 'how much you hold'. Businesses die from running out of cash, not out of profit." },
      hint: { vi: "Nhớ lại tháng 2 của Linh.", en: "Remember Linh's month 2." },
    },
    {
      t: "learn", art: "📄 📄 📄",
      title: { vi: "Ba bản báo cáo của mọi doanh nghiệp", en: "The three reports every business has" },
      text: {
        vi: "<b>Kết quả kinh doanh</b>: trong một khoảng thời gian, kiếm được bao nhiêu (doanh thu − chi phí = lợi nhuận). <b>Bảng cân đối</b>: tại một thời điểm, có gì (tiền, hàng tồn, khoản phải thu, thiết bị) và nợ ai. <b>Dòng tiền</b>: tiền thật vào ra bao nhiêu. Chủ quán giỏi đọc cả ba — nhất là bản thứ ba.",
        en: "<b>Profit & loss</b>: over a period, how much you earned (revenue − costs = profit). <b>Balance sheet</b>: at a moment, what you own (cash, stock, receivables, equipment) and whom you owe. <b>Cash flow</b>: how much real money came in and went out. Good owners read all three — especially the third.",
      },
      items: [["📈", { vi: "Kết quả KD: kiếm được bao nhiêu", en: "P&L: what you earned" }], ["⚖️", { vi: "Cân đối: có gì, nợ ai", en: "Balance sheet: own & owe" }], ["💧", { vi: "Dòng tiền: tiền thật", en: "Cash flow: real money" }]],
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: công ty kia muốn đặt tiếp 1.000 ly/tháng nhưng trả sau 90 ngày. Linh hỏi bạn: nhận không? Khuyên 1–2 câu.", en: "Final boss: the company wants 1,000 cups a month, paying in 90 days. Linh asks: take it? Advise in 1–2 sentences." },
      keys: [
        { label: { vi: "Dòng tiền / tiền mặt", en: "Cash flow / cash" }, words: { vi: ["dòng tiền", "tiền mặt", "hết tiền", "cạn tiền", "trả lương"], en: ["cash flow", "cash", "run out", "wages"] } },
        { label: { vi: "Đặt cọc / đàm phán điều khoản", en: "Deposit / negotiate terms" }, words: { vi: ["đặt cọc", "cọc", "trả trước", "đàm phán", "thương lượng", "rút ngắn", "điều khoản", "30 ngày"], en: ["deposit", "upfront", "negotiate", "terms", "shorter", "30 days"] } },
        { label: { vi: "Dự phòng / vay ngắn hạn", en: "Buffer / short-term loan" }, words: { vi: ["dự phòng", "quỹ", "vay", "thấu chi", "đủ tiền"], en: ["buffer", "reserve", "loan", "overdraft", "enough cash"] } },
      ],
      need: 2,
      model: { vi: "Chỉ nhận nếu dòng tiền chịu được: đòi đặt cọc hoặc rút ngắn thời hạn trả, và tính trước xem quán có đủ tiền mặt trả lương, nguyên liệu trong 3 tháng chờ không.", en: "Only take it if cash flow can cope: ask for a deposit or shorter payment terms, and check first that the shop has enough cash for wages and ingredients during the 3-month wait." },
      why: { vi: "Ý chính: một đơn hàng tốt có thể giết quán nếu tiền về quá muộn — hãy quản lý KHI NÀO tiền vào và ra.", en: "Key idea: a good order can kill a shop if the money comes too late — manage WHEN money comes in and goes out." },
      hint: { vi: "90 ngày nghĩa là bao nhiêu tháng phải ứng tiền nguyên liệu?", en: "90 days means fronting ingredients for how many months?" },
    },
    {
      t: "learn", art: "💧 📅 🫙",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Áp dụng cho cả tiền của chính bạn:", en: "It works for your own money too:" },
      items: [
        ["📅", { vi: "Ghi lại NGÀY tiền về (tiền tiêu vặt, lương làm thêm) và ngày phải trả — không chỉ số tiền", en: "Write down the DATES money arrives and bills are due — not just amounts" }],
        ["🤝", { vi: "Cho bạn mượn tiền = 'khoản phải thu': chỉ cho mượn số bạn chịu được nếu về muộn", en: "Lending to a friend = a 'receivable': only lend what you can live without if it comes back late" }],
        ["🫙", { vi: "Luôn giữ một ít tiền mặt dự phòng cho tuần xui", en: "Always keep a little cash for a bad week" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Báo cáo dòng tiền của quán — xem tháng nào quán có lãi mà tiền mặt lại giảm!", en: "🎮 Unlocked in the game: your shop's cash-flow report — spot the months you're profitable but losing cash!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "CCC = DIO + DSO − DPO", fs: 24,
      title: { vi: "Chu kỳ chuyển đổi tiền mặt (CCC)", en: "The cash conversion cycle (CCC)" },
      text: {
        vi: "Mất bao nhiêu ngày từ lúc bạn trả tiền nguyên liệu đến lúc thu được tiền bán hàng? <b>CCC = số ngày tồn kho (DIO) + số ngày thu tiền (DSO) − số ngày được nợ nhà cung cấp (DPO)</b>. CCC càng ngắn, doanh nghiệp càng ít cần vốn lưu động. Một số chuỗi bán lẻ lớn có CCC âm: bán hàng thu tiền trước khi phải trả nhà cung cấp.",
        en: "How many days from paying for ingredients to collecting the cash from sales? <b>CCC = days of inventory (DIO) + days to collect (DSO) − days you get to pay suppliers (DPO)</b>. The shorter the CCC, the less working capital you need. Some big retailers have a negative CCC: they collect from customers before paying suppliers.",
      },
    },
    {
      t: "calc", q: { vi: "Quán Linh: nguyên liệu nằm trong kho 10 ngày; khách hợp đồng trả sau 60 ngày; nhà cung cấp cho nợ 15 ngày.", en: "Linh's shop: ingredients sit in stock 10 days; the contract client pays in 60 days; the supplier gives 15 days." },
      parts: [
        { label: { vi: "CCC với khách hợp đồng (ngày)", en: "CCC for the contract client (days)" }, a: 55, tol: 0, unit: { vi: "ngày", en: "days" } },
        { label: { vi: "Nếu đàm phán khách trả sau 20 ngày, CCC còn (ngày)", en: "If the client agrees to pay in 20 days, CCC becomes (days)" }, a: 15, tol: 0, unit: { vi: "ngày", en: "days" } },
      ],
      why: { vi: "10 + 60 − 15 = 55 ngày. 10 + 20 − 15 = 15 ngày — bớt 40 ngày phải 'ứng' tiền.", en: "10 + 60 − 15 = 55 days. 10 + 20 − 15 = 15 days — 40 fewer days of fronting cash." },
      hint: { vi: "Cộng tồn kho và thu tiền, trừ số ngày được nợ.", en: "Add stock days and collection days, subtract the days you may owe." },
    },
    {
      t: "mcq", q: { vi: "Vì sao một doanh nghiệp tăng trưởng RẤT nhanh lại dễ hết tiền?", en: "Why can a business that grows VERY fast run out of cash?" },
      o: [
        { vi: "Đơn hàng tăng → phải ứng trước nhiều nguyên liệu, lương, hàng tồn trước khi thu được tiền", en: "More orders → it must front more ingredients, wages and stock before the cash comes in" },
        { vi: "Vì tăng trưởng làm giảm doanh thu", en: "Because growth lowers revenue" },
        { vi: "Vì ngân hàng cấm doanh nghiệp tăng trưởng", en: "Because banks forbid growth" },
        { vi: "Vì lợi nhuận luôn âm khi tăng trưởng", en: "Because profit is always negative during growth" },
      ],
      a: 0,
      why: { vi: "Gọi là 'tăng trưởng quá nóng' (overtrading): càng bán nhiều, vốn lưu động bị giam càng lớn. Tăng trưởng cần được tài trợ — bằng lợi nhuận giữ lại, vay ngắn hạn hoặc vốn góp.", en: "This is 'overtrading': the more you sell, the more working capital gets locked up. Growth needs funding — retained profit, short-term loans or equity." },
    },
  ],
};
export default lesson;
