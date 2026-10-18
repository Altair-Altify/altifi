/* Business finance · B5 — "Opening 10 branches at once: bold or smart?" (design doc 13.2d ②, 6-beat frame 13.2c)
 * Growth, payback period, NPV (deep dive: IRR), disruptive innovation. Trap: "more branches = richer".
 * Projects (million ₫, discount rate 10%/yr, 5 years):
 *  A 10 branches: −1,500 then −100, 200, 400, 500, 500 → payback 5 yrs, PV of flows ≈ 1,027 → NPV ≈ −473
 *  B 2 branches:   −300 then 60, 120, 120, 120, 120   → payback 3 yrs, PV ≈ 400 → NPV ≈ +100
 *  C upgrade + delivery: −100 then 40 × 5               → payback 2.5 yrs, PV ≈ 152 → NPV ≈ +52
 * ⚠️ Draft written with AI help — team review. Verify: Starbucks announced closing ~600 US stores in July 2008
 * (Howard Schultz back as CEO Jan 2008); Kodak engineer Steve Sasson built a digital camera in 1975; Kodak filed for
 * bankruptcy in Jan 2012. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "c-growth",
  domain: "corporate",
  icon: "🚀",
  ic: "rocket",
  minutes: 7,
  title: { vi: "Mở 10 chi nhánh cùng lúc: liều hay khôn?", en: "Opening 10 branches at once: bold or smart?" },
  desc: {
    vi: "Tăng trưởng nhanh có thể giết doanh nghiệp: thời gian hoàn vốn, giá trị hiện tại ròng (NPV), và khi cái mới làm sụp cái cũ.",
    en: "Fast growth can kill a business: payback period, net present value (NPV), and when the new destroys the old.",
  },
  prereq: { vi: "dòng tiền (B3) và vay/gọi vốn (B4).", en: "cash flow (B3) and debt vs equity (B4)." },
  review: {
    title: { vi: "Mở rộng & NPV", en: "Growth & NPV" },
    points: [
      { vi: "Tiền hôm nay đáng hơn tiền ngày mai → phải <b>chiết khấu</b>.", en: "Money today is worth more than money tomorrow → <b>discount</b> it." },
      { vi: "NPV = giá trị hiện tại của dòng tiền tương lai − vốn bỏ ra.", en: "NPV = present value of future cash − money invested." },
      { vi: "NPV &gt; 0: dự án tạo thêm giá trị. NPV &lt; 0: phá giá trị.", en: "NPV &gt; 0: the project creates value. NPV &lt; 0: destroys it." },
      { vi: "To nhất, nhiều chi nhánh nhất ≠ đáng làm nhất.", en: "Biggest, most branches ≠ best." },
    ],
  },
  info: {
    s: { vi: "So dự án bằng NPV (giá trị hiện tại ròng) và thời gian hoàn vốn, không bằng quy mô; tăng trưởng quá nhanh làm loãng chất lượng và cạn tiền.", en: "Compare projects by NPV and payback, not size; growing too fast dilutes quality and drains cash." },
    l: {
      vi: "Một đồng hôm nay đáng hơn một đồng năm sau, vì có thể gửi lấy lãi và vì tương lai không chắc chắn. Vì vậy khi đánh giá dự án mở rộng, ta chiết khấu dòng tiền tương lai về hiện tại rồi trừ vốn bỏ ra: đó là NPV. NPV dương nghĩa là dự án tạo thêm giá trị. Thời gian hoàn vốn cho biết bao lâu thì lấy lại vốn — dễ hiểu nhưng bỏ qua giá trị thời gian của tiền. Mở rộng quá nhanh thường làm chi nhánh mới 'ăn' khách của chi nhánh cũ, khó giữ chất lượng và cạn tiền mặt.",
      en: "A unit of money today is worth more than one next year, because it can earn interest and the future is uncertain. So to judge an expansion we discount future cash flows back to today and subtract what we invest: that's NPV. Positive NPV means the project creates value. Payback period tells how long until the money is back — simple, but it ignores the time value of money. Expanding too fast often makes new branches steal customers from old ones, makes quality hard to keep and drains cash.",
    },
  },
  kb: ["profit", "debt"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "coffee shop chain storefront" }, art: "🏪 → 🏪🏪🏪🏪🏪🏪🏪🏪🏪🏪", cap: { vi: "Lớn nhanh — hay sụp nhanh?", en: "Grow fast — or fall fast?" },
      title: { vi: "Mở 10 chi nhánh cùng lúc: liều hay khôn?", en: "Opening 10 branches at once: bold or smart?" },
      text: {
        vi: "Quán của Linh đông khách. Một nhà đầu tư nói: “Mở luôn 10 chi nhánh, chiếm thị trường trước đối thủ!” Kế toán thì đưa ra 3 phương án: <b>A</b> 10 chi nhánh (1.500 triệu), <b>B</b> 2 chi nhánh (300 triệu), <b>C</b> nâng cấp quầy cũ + giao hàng (100 triệu). Chọn sao cho khôn?",
        en: "Linh's shop is busy. An investor says: “Open 10 branches now and take the market before rivals do!” The accountant offers 3 plans: <b>A</b> 10 branches (1,500 million), <b>B</b> 2 branches (300 million), <b>C</b> upgrade the kiosk + delivery (100 million). What's the smart choice?",
      },
      lion: { vi: "Lớn không phải mục tiêu — tạo ra giá trị mới là mục tiêu 📈", en: "Big isn't the goal — creating value is 📈" },
    },
    /* 2 · Guess first */
    {
      t: "pick", q: { vi: "Đoán trước khi tính: phương án nào làm Linh GIÀU HƠN nhiều nhất (tính cả giá trị thời gian của tiền)?", en: "Guess before calculating: which plan makes Linh RICHEST (counting the time value of money)?" },
      opts: [["🏙️", { vi: "A · 10 chi nhánh", en: "A · 10 branches" }], ["🏪", { vi: "B · 2 chi nhánh", en: "B · 2 branches" }], ["🛵", { vi: "C · nâng cấp + giao hàng", en: "C · upgrade + delivery" }]],
      a: 1,
      why: { vi: "B (NPV ≈ +100 triệu). A to nhất nhưng NPV ≈ −473 triệu: chi nhánh mới lỗ năm đầu, tranh khách lẫn nhau, phải 5 năm mới hoàn vốn. C an toàn nhưng tạo ít giá trị hơn B (≈ +52 triệu). Sẽ tính ở các bước sau.", en: "B (NPV ≈ +100 million). A is biggest but NPV ≈ −473 million: new branches lose money in year one, steal each other's customers and take 5 years to pay back. C is safe but creates less than B (≈ +52 million). You'll compute it next." },
    },
    /* 3 · Mechanism */
    {
      t: "learn", art: "100 hôm nay = 110 năm sau", fs: 24,
      title: { vi: "Tiền hôm nay đáng hơn tiền ngày mai", en: "Money today beats money tomorrow" },
      text: {
        vi: "Có 100 triệu hôm nay, gửi lãi 10% thì năm sau thành 110 triệu. Nên 110 triệu <b>năm sau</b> chỉ đáng 100 triệu <b>hôm nay</b>. Đưa tiền tương lai về hiện tại gọi là <b>chiết khấu</b>: giá trị hiện tại = tiền tương lai ÷ (1 + r)<sup>số năm</sup>. <b>NPV</b> = tổng giá trị hiện tại của các dòng tiền tương lai − vốn bỏ ra hôm nay.",
        en: "With 100 million today at 10%, you'd have 110 million next year. So 110 million <b>next year</b> is worth only 100 million <b>today</b>. Bringing future money back to today is <b>discounting</b>: present value = future money ÷ (1 + r)<sup>years</sup>. <b>NPV</b> = the sum of present values of future cash flows − money invested today.",
      },
    },
    {
      t: "calc", q: { vi: "Lãi suất chiết khấu 10%/năm (đơn vị: triệu ₫):", en: "Discount rate 10% a year (in million ₫):" },
      parts: [
        { label: { vi: "Giá trị hiện tại của 121 triệu nhận sau 2 năm", en: "Present value of 121 million received in 2 years" }, a: 100, tol: 0.5, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Phương án C: bỏ 100, nhận 40/năm trong 5 năm (giá trị hiện tại ≈ 151,6). NPV của C?", en: "Plan C: invest 100, get 40 a year for 5 years (present value ≈ 151.6). C's NPV?" }, a: 51.6, tol: 0.5, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Thời gian hoàn vốn của C (năm)", en: "C's payback period (years)" }, a: 2.5, tol: 0.05, unit: { vi: "năm", en: "years" } },
      ],
      why: { vi: "121 ÷ 1,1² = 100. 151,6 − 100 = 51,6 triệu. 100 ÷ 40 = 2,5 năm.", en: "121 ÷ 1.1² = 100. 151.6 − 100 = 51.6 million. 100 ÷ 40 = 2.5 years." },
      hint: { vi: "NPV = giá trị hiện tại − vốn bỏ ra.", en: "NPV = present value − money invested." },
    },
    {
      t: "statement", q: { vi: "Bảng so sánh 3 phương án (triệu ₫, chiết khấu 10%/năm). Dựa vào NPV, nên chọn phương án nào?", en: "The three plans compared (million ₫, 10%/yr discount rate). By NPV, which plan should Linh pick?" },
      sheets: [
        { title: { vi: "A · 10 chi nhánh", en: "A · 10 branches" }, rows: [
          { l: { vi: "Vốn bỏ ra", en: "Invested" }, v: -1500 },
          { l: { vi: "Dòng tiền năm 1 → 5", en: "Cash flow years 1 → 5" }, v: "−100 · 200 · 400 · 500 · 500" },
          { l: { vi: "Hoàn vốn (năm)", en: "Payback (years)" }, v: "5" },
          { l: { vi: "NPV", en: "NPV" }, v: -473, bold: true },
        ] },
        { title: { vi: "B · 2 chi nhánh", en: "B · 2 branches" }, rows: [
          { l: { vi: "Vốn bỏ ra", en: "Invested" }, v: -300 },
          { l: { vi: "Dòng tiền năm 1 → 5", en: "Cash flow years 1 → 5" }, v: "60 · 120 · 120 · 120 · 120" },
          { l: { vi: "Hoàn vốn (năm)", en: "Payback (years)" }, v: "3" },
          { l: { vi: "NPV", en: "NPV" }, v: 100, bold: true },
        ] },
        { title: { vi: "C · nâng cấp + giao hàng", en: "C · upgrade + delivery" }, rows: [
          { l: { vi: "Vốn bỏ ra", en: "Invested" }, v: -100 },
          { l: { vi: "Dòng tiền năm 1 → 5", en: "Cash flow years 1 → 5" }, v: "40 · 40 · 40 · 40 · 40" },
          { l: { vi: "Hoàn vốn (năm)", en: "Payback (years)" }, v: "2.5" },
          { l: { vi: "NPV", en: "NPV" }, v: 52, bold: true },
        ] },
      ],
      o: [{ vi: "B — NPV cao nhất", en: "B — highest NPV" }, { vi: "A — lớn nhất", en: "A — the biggest" }, { vi: "C — hoàn vốn nhanh nhất", en: "C — fastest payback" }, { vi: "Không làm gì", en: "Do nothing" }],
      a: 0,
      why: { vi: "NPV đo giá trị tạo thêm: B +100 > C +52 > 0 > A −473. C hoàn vốn nhanh nhất nhưng tạo ít giá trị hơn; hoàn vốn chỉ là thước đo rủi ro, không phải lợi ích. (Nếu đủ tiền, làm cả B và C cũng được — cả hai NPV dương.)", en: "NPV measures value created: B +100 > C +52 > 0 > A −473. C pays back fastest but creates less; payback measures risk, not benefit. (With enough money, doing both B and C works — both have positive NPV.)" },
      hint: { vi: "Tìm dòng NPV lớn nhất.", en: "Find the biggest NPV line." },
    },
    /* 4 · The real story */
    {
      t: "mcq", q: { vi: "Đến năm 2007, Starbucks mở hàng nghìn cửa hàng mới mỗi năm. Tháng 7/2008, hãng tuyên bố đóng khoảng 600 cửa hàng ở Mỹ. Lý do hợp lý nhất?", en: "By 2007 Starbucks was opening thousands of stores a year. In July 2008 it announced closing about 600 US stores. Most likely reason?" },
      o: [
        { vi: "Mở quá nhanh: cửa hàng mới gần nhau tranh khách, chất lượng trải nghiệm giảm, đúng lúc suy thoái 2008 làm khách chi tiêu ít đi", en: "Too fast: new stores close together competed for customers, the experience slipped, just as the 2008 recession cut spending" },
        { vi: "Cà phê bị cấm ở Mỹ", en: "Coffee was banned in the US" },
        { vi: "Starbucks hết tiền vì không có khách nào", en: "Starbucks had no customers at all" },
        { vi: "Đối thủ mua lại Starbucks", en: "A rival bought Starbucks" },
      ],
      a: 0,
      why: { vi: "Howard Schultz quay lại làm CEO đầu 2008, đóng các cửa hàng kém, tập trung lại vào chất lượng. Một ví dụ khác về tăng trưởng sai hướng: Kodak — kỹ sư của chính Kodak làm ra máy ảnh số năm 1975, nhưng công ty sợ 'giết' mảng phim đang hái ra tiền, để đối thủ chiếm thị trường; Kodak phá sản năm 2012.", en: "Howard Schultz returned as CEO in early 2008, closed weak stores and refocused on quality. Another growth lesson: Kodak — its own engineer built a digital camera in 1975, but the company feared killing its money-making film business and let rivals take the market; Kodak filed for bankruptcy in 2012." },
      hint: { vi: "Nghĩ tới hai cửa hàng cùng hãng ở hai bên đường.", en: "Think of two stores of the same brand across the street from each other." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Càng nhiều chi nhánh thì càng giàu.” Điều nào BÁC BỎ câu này rõ nhất?", en: "“More branches = richer.” Which point disproves it best?" },
      o: [
        { vi: "Mỗi chi nhánh chỉ đáng mở khi dòng tiền của nó (đã chiết khấu) lớn hơn vốn bỏ ra — chi nhánh có NPV âm làm chủ nghèo đi", en: "A branch is only worth opening if its (discounted) cash flows exceed its cost — a negative-NPV branch makes the owner poorer" },
        { vi: "Chi nhánh nào cũng lỗ", en: "Every branch loses money" },
        { vi: "Nhà nước cấm mở nhiều chi nhánh", en: "The law forbids many branches" },
        { vi: "Doanh thu không bao giờ tăng khi mở thêm", en: "Revenue never grows with new branches" },
      ],
      a: 0,
      why: { vi: "Doanh thu có thể tăng gấp 5 lần mà giá trị vẫn giảm. Thước đo đúng là giá trị tạo thêm (NPV), cộng với việc còn đủ tiền mặt để sống qua giai đoạn đầu (B3).", en: "Revenue can grow 5× while value falls. The right yardstick is value created (NPV), plus enough cash to survive the early stage (B3)." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: nhà đầu tư vẫn nói “Cứ mở 10 chi nhánh, lớn nhanh mới thắng!” Linh nên trả lời thế nào? (1–2 câu)", en: "Final boss: the investor insists “Open 10 branches — only fast growth wins!” How should Linh reply? (1–2 sentences)" },
      keys: [
        { label: { vi: "NPV / giá trị tạo thêm", en: "NPV / value created" }, words: { vi: ["npv", "giá trị", "âm", "dương", "tạo thêm", "lỗ"], en: ["npv", "value", "negative", "positive", "loses"] } },
        { label: { vi: "Dòng tiền / hoàn vốn / rủi ro", en: "Cash flow / payback / risk" }, words: { vi: ["dòng tiền", "tiền mặt", "hoàn vốn", "5 năm", "rủi ro", "cạn tiền"], en: ["cash flow", "cash", "payback", "5 years", "risk", "run out"] } },
        { label: { vi: "Mở từng bước / chất lượng", en: "Step by step / quality" }, words: { vi: ["từng bước", "2 chi nhánh", "thử", "chất lượng", "tranh khách", "từ từ"], en: ["step by step", "2 branches", "test", "quality", "steal customers", "gradually"] } },
      ],
      need: 2,
      model: { vi: "10 chi nhánh có NPV âm và 5 năm mới hoàn vốn, dễ cạn tiền; nên mở 2 chi nhánh trước (NPV dương), giữ chất lượng rồi mới mở tiếp.", en: "Ten branches have a negative NPV and a 5-year payback, so the cash could run out; better to open 2 first (positive NPV), keep quality up, then grow further." },
      why: { vi: "Ý chính: chọn bằng giá trị tạo thêm và sức chịu của dòng tiền, mở rộng từng bước.", en: "Key idea: choose by value created and what cash flow can bear; grow step by step." },
      hint: { vi: "Dùng hai con số: NPV và thời gian hoàn vốn của A.", en: "Use two numbers: A's NPV and payback." },
    },
    {
      t: "learn", art: "⏳ 💵 🧮",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Tư duy NPV dùng được cho cả quyết định của bạn:", en: "NPV thinking works for your own decisions too:" },
      items: [
        ["🎓", { vi: "Khóa học 2 triệu giúp bạn kiếm thêm bao nhiêu, trong bao lâu? Đáng không?", en: "A 2-million course — how much more will it help you earn, and when? Worth it?" }],
        ["⏳", { vi: "“Trả 1 triệu hôm nay hay 1,1 triệu năm sau?” — so với lãi tiết kiệm", en: "“1 million today or 1.1 million next year?” — compare with savings interest" }],
        ["🪜", { vi: "Dự án lớn: thử nhỏ trước, có kết quả rồi mới mở rộng", en: "Big plans: test small first, scale once it works" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: chi nhánh trên các lô đất trống ở Phố kinh doanh (phần chơi sắp có)!", en: "🎮 Unlocked in the game: branches on the empty plots of Business Street (playable part coming soon)!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "NPV(IRR) = 0", fs: 28,
      title: { vi: "Tỷ suất hoàn vốn nội bộ (IRR)", en: "Internal rate of return (IRR)" },
      text: {
        vi: "<b>IRR</b> là mức lãi suất chiết khấu làm NPV đúng bằng 0 — có thể hiểu là 'lãi suất mà dự án tự trả cho bạn'. IRR cao hơn chi phí vốn (lãi vay, hoặc lợi nhuận nhà đầu tư đòi hỏi) thì dự án đáng làm. Nhưng khi so hai dự án quy mô rất khác nhau, hãy tin NPV hơn: một dự án nhỏ có IRR 40% có thể tạo ít tiền hơn dự án lớn IRR 20%.",
        en: "<b>IRR</b> is the discount rate that makes NPV exactly 0 — think of it as 'the interest rate the project pays you'. If IRR beats your cost of capital (the loan rate, or investors' required return), the project is worth doing. But when comparing projects of very different sizes, trust NPV: a small project with a 40% IRR can create less money than a big one at 20%.",
      },
    },
    {
      t: "calc", q: { vi: "Một dự án: bỏ 100 triệu hôm nay, đúng 1 năm sau nhận về 120 triệu.", en: "A project: invest 100 million today, get 120 million back in exactly one year." },
      parts: [
        { label: { vi: "IRR (%)", en: "IRR (%)" }, a: 20, tol: 0.05, unit: "%" },
        { label: { vi: "NPV nếu chiết khấu 10% (triệu ₫, 1 chữ số thập phân)", en: "NPV at a 10% discount rate (million ₫, 1 decimal)" }, a: 9.1, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
      ],
      why: { vi: "120 ÷ 100 − 1 = 20%. 120 ÷ 1,1 − 100 ≈ 9,1 triệu.", en: "120 ÷ 100 − 1 = 20%. 120 ÷ 1.1 − 100 ≈ 9.1 million." },
    },
    {
      t: "mcq", q: { vi: "Vì sao mở chi nhánh mới ngay cạnh chi nhánh cũ có thể làm tổng lợi nhuận GIẢM?", en: "Why can a new branch right next to an old one LOWER total profit?" },
      o: [
        { vi: "Nó lấy khách của chính chi nhánh cũ (tự 'ăn thịt' doanh số) trong khi định phí tăng gấp đôi", en: "It takes customers from the old branch (cannibalisation) while fixed costs double" },
        { vi: "Vì hai chi nhánh phải bán cùng một giá", en: "Because both must charge the same price" },
        { vi: "Vì ngân hàng không cho vay chi nhánh thứ hai", en: "Because banks won't lend for a second branch" },
        { vi: "Vì khách không thích cửa hàng mới", en: "Because customers dislike new shops" },
      ],
      a: 0,
      why: { vi: "Doanh thu tăng thêm thật ra nhỏ hơn doanh thu của chi nhánh mới, vì một phần chỉ là khách chuyển sang. Khi tính dòng tiền dự án, chỉ tính phần TĂNG THÊM cho cả hệ thống.", en: "The real extra revenue is less than the new branch's sales, since some are just customers switching. When estimating a project's cash flow, count only the EXTRA for the whole business." },
    },
  ],
};
export default lesson;
