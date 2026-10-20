/* Personal finance · P1 — "First paycheck: where does the money go in 30 days?" (design doc 13.2d, 6-beat frame 13.2c)
 * Hook → guess → mechanism (a month of Minh's first salary, find the leaks, split into jars) → real story (Madrian & Shea)
 * → traps ("too little money to need a budget", buying because others did) → boss + "use it today" + game unlock.
 * Lesson 1 of the domain: few terms (budget, take-home pay, 50/30/20 rule, default option); the deep dive adds more.
 * Minh's month (made-up example): take-home 9,000,000₫; room + utilities 2.9M, lunch 1.1M, groceries 1.2M, fuel & phone 0.55M,
 * leaks: takeaway coffee 0.7M, delivery fees 0.36M, unused subscriptions 0.3M, small online orders 0.96M = 2.32M ≈ 26%.
 * Spent 8.07M → 930k left. Coffee 35k × 20 × 12 = 8.4M/yr. Jars 4.5M / 2.7M / 1.8M.
 * ⚠️ Draft written with AI help — the team reviews wording and adds examples from the survey before submission.
 * ⚠️ Facts to verify: Madrian & Shea 2001 (≈37% → 86%); Warren & Tyagi 2005 (50/30/20); survey 20/46 bought because friends had it. */
import type { Lesson } from "../../lesson/types";

const SPLIT = `<div class="split"><i style="flex:50;background:#5B5BD6">50%<br>🧱</i><i style="flex:30;background:#F28C28">30%<br>✨</i><i style="flex:20;background:#2BB673">20%<br>🚀</i></div>`;

const lesson: Lesson = {
  id: "p-budget",
  domain: "personal",
  icon: "📊",
  ic: "pie",
  minutes: 6,
  title: { vi: "Tháng lương đầu tiên: tiền đi đâu trong 30 ngày?", en: "First paycheck: where does the money go in 30 days?" },
  desc: {
    vi: "Một tháng lương của người mới đi làm: tìm chỗ rò rỉ, chia lương thành Cần · Muốn · Tương lai, và vì sao 'tự động để dành' thắng ý chí.",
    en: "One month of a first salary: find the leaks, split pay into Need · Want · Future, and why automatic saving beats willpower.",
  },
  review: {
    title: { vi: "Ngân sách", en: "Budgeting" },
    points: [
      { vi: "Ngân sách = kế hoạch cho tiền <b>trước khi</b> tiêu.", en: "A budget = a plan for money <b>before</b> you spend it." },
      { vi: "Cần 50% · Muốn 30% · Tương lai 20% (điểm khởi đầu, chỉnh được).", en: "Need 50% · Want 30% · Future 20% (a starting point you can adjust)." },
      { vi: "Khoản nhỏ lặp lại = <b>rò rỉ tiền</b>; cộng cả tháng có thể ngang tiền nhà.", en: "Small repeated spends = <b>money leaks</b>; over a month they can add up to the rent." },
      { vi: "'Trả cho mình trước': để dành ngay khi lương về — tự động thì càng tốt.", en: "'Pay yourself first': save the moment pay arrives — automatically if you can." },
    ],
  },
  info: {
    s: { vi: "Ghi chép để thấy tiền đi đâu; chia Cần/Muốn/Tương lai (50/30/20); để dành trước khi tiêu.", en: "Track to see where money goes; split Need/Want/Future (50/30/20); save before you spend." },
    l: {
      vi: "Tiền lương 'biến mất' thường không vì một món đắt mà vì hàng chục khoản nhỏ lặp lại không ai ghi lại: cà phê mang đi, phí giao đồ ăn, gói đăng ký, đơn hàng lẻ. Ngân sách là kế hoạch cho tiền trước khi tiêu: chia Cần (50%) · Muốn (30%) · Tương lai (20%) là điểm khởi đầu dễ nhớ. Thu nhập càng thấp càng cần ngân sách, vì mỗi khoản rò rỉ chiếm phần lớn hơn. Thói quen mạnh nhất là 'trả cho mình trước' — chuyển tiền để dành ngay ngày lương về, tốt nhất là tự động.",
      en: "A salary 'vanishes' not because of one big purchase but because of dozens of small repeated ones nobody writes down: takeaway coffee, delivery fees, subscriptions, small online orders. A budget is a plan before you spend: Need (50%) · Want (30%) · Future (20%) is an easy start. The lower your income, the more you need a budget, because each leak takes a bigger share. The strongest habit is 'pay yourself first' — move savings out on payday, ideally automatically.",
    },
  },
  kb: ["budget", "leaks", "debt", "emergency"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Vietnamese dong banknotes" }, art: "💰 9tr → 🫙 930k", cap: { vi: "Không mua món gì lớn… vậy tiền đi đâu?", en: "No big purchase… so where did it go?" },
      title: { vi: "Tháng lương đầu tiên: tiền đi đâu trong 30 ngày?", en: "First paycheck: where does the money go in 30 days?" },
      text: {
        vi: "Minh, 23 tuổi, vừa đi làm nhân viên văn phòng ở TP.HCM. Ngày 1, <b>lương thực nhận</b> (take-home pay) — số tiền thật sự về tài khoản sau khi trừ bảo hiểm và thuế — là <b>9.000.000₫</b>. Ngày 25, tài khoản còn <b>930.000₫</b>, dù tháng này Minh không mua món gì lớn. Trong bài này bạn sẽ xem sổ chi tiêu tháng của Minh, tìm chỗ tiền 'rò' ra, rồi lập <b>ngân sách</b> (budget) — kế hoạch chia thu nhập cho từng khoản trước khi tiêu.",
        en: "Minh, 23, has just started an office job in Ho Chi Minh City. On day 1 his <b>take-home pay</b> — what actually lands in the account after insurance and tax — is <b>9,000,000₫</b>. By day 25 there's <b>930,000₫</b> left, though he bought nothing big this month. In this lesson you'll go through Minh's spending log, find where the money leaked, then build a <b>budget</b> — a plan that assigns income to each purpose before it's spent.",
      },
      lion: { vi: "Không phải cấm tiêu — mà là tiêu có chủ đích 🎯", en: "It's not about never spending — it's spending on purpose 🎯" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: bao nhiêu % lương tháng của Minh đã đi vào cà phê mang đi, phí giao đồ ăn, gói đăng ký và các đơn hàng lẻ?", en: "Guess: what share of Minh's monthly pay went on takeaway coffee, delivery fees, subscriptions and small online orders?" },
      art: "☕ 🛵 🎬 📦", min: 0, max: 100, step: 1, start: 10, actual: 26, unit: "pct",
      reveal: { vi: "Khoảng 26% — hơn một phần tư lương: 2.320.000₫ trên 9.000.000₫, gần bằng tiền phòng. Mỗi khoản chỉ 25–160k nên không ai nhớ, nhưng cộng cả tháng lại là một khoản lớn.", en: "About 26% — over a quarter of the pay: 2,320,000₫ of 9,000,000₫, close to the rent. Each spend was only 25–160k so nobody remembers them, but over a month they add up to a big item." },
    },
    /* 3 · Mechanism: the month, find the leaks */
    {
      t: "tap", q: { vi: "Đây là sổ chi tiêu tháng của Minh. Bấm vào các khoản 'rò rỉ tiền'.", en: "Here's Minh's spending log for the month. Tap the money leaks." },
      head: { vi: "Tháng của Minh · 9.000.000₫", en: "Minh's month · 9,000,000₫" },
      items: [
        ["🏠", { vi: "Phòng ở ghép + điện, nước, internet", en: "Shared room + power, water, internet" }, "2.900.000₫", false],
        ["🍱", { vi: "Ăn trưa ở công ty ×22", en: "Lunch near the office ×22" }, "1.100.000₫", false],
        ["🛒", { vi: "Đi chợ, nấu ăn tối", en: "Groceries, cooking dinner" }, "1.200.000₫", false],
        ["⛽", { vi: "Xăng, gửi xe, cước điện thoại", en: "Fuel, parking, phone plan" }, "550.000₫", false],
        ["☕", { vi: "Cà phê mang đi ×20", en: "Takeaway coffee ×20" }, "700.000₫", true],
        ["🛵", { vi: "Phí giao + phí dịch vụ, 12 đơn đồ ăn", en: "Delivery + service fees, 12 food orders" }, "360.000₫", true],
        ["🎬", { vi: "3 gói đăng ký ít dùng (phim, nhạc, app)", en: "3 barely used subscriptions (film, music, apps)" }, "300.000₫", true],
        ["📦", { vi: "6 đơn hàng lẻ trên sàn thương mại điện tử", en: "6 small online-shop orders" }, "960.000₫", true],
      ],
      why: { vi: "Rò rỉ = nhỏ, lặp lại, không thiết yếu (hoặc có cách rẻ hơn: pha cà phê ở công ty, gộp đơn, hủy gói không dùng). Bốn khoản này = 2.320.000₫ — gần bằng tiền phòng.", en: "A leak = small, repeated, not essential (or there's a cheaper way: coffee at the office, combined orders, cancelling unused plans). These four = 2,320,000₫ — nearly the rent." },
      hint: { vi: "Bỏ khoản đó thì việc ở, ăn, đi làm có bị ảnh hưởng không? Không → có thể là rò rỉ.", en: "Without it, would housing, food or getting to work suffer? No → probably a leak." },
    },
    {
      t: "learn", art: SPLIT,
      title: { vi: "Cần · Muốn · Tương lai", en: "Need · Want · Future" },
      text: {
        vi: "Một cách chia dễ nhớ cho lương thực nhận: <b>50% Cần</b> (nhà, ăn, đi lại, điện nước), <b>30% Muốn</b> (cà phê, đi chơi, mua sắm), <b>20% Tương lai</b> (quỹ dự phòng, mục tiêu lớn như laptop, học thêm). Đây là <b>quy tắc 50/30/20</b> (50/30/20 rule) — một quy tắc kinh nghiệm để bắt đầu, không phải luật.",
        en: "An easy split for take-home pay: <b>50% Need</b> (housing, food, transport, utilities), <b>30% Want</b> (coffee, going out, shopping), <b>20% Future</b> (a safety buffer, big goals like a laptop or a course). This is the <b>50/30/20 rule</b> — a rule of thumb to start from, not a law.",
      },
      items: [["🧱", { vi: "Cần 50%", en: "Need 50%" }], ["✨", { vi: "Muốn 30%", en: "Want 30%" }], ["🚀", { vi: "Tương lai 20%", en: "Future 20%" }]],
    },
    {
      t: "jars", q: { vi: "Tháng sau Minh lại nhận 9.000.000₫. Chia vào 3 hũ theo 50/30/20.", en: "Next month Minh gets 9,000,000₫ again. Split it into the 3 jars, 50/30/20." },
      total: 9000000, step: 300000,
      jars: [[{ vi: "🧱 Cần", en: "🧱 Need" }, "#5B5BD6", 4500000], [{ vi: "✨ Muốn", en: "✨ Want" }, "#F28C28", 2700000], [{ vi: "🚀 Tương lai", en: "🚀 Future" }, "#2BB673", 1800000]],
      why: { vi: "4,5tr Cần · 2,7tr Muốn · 1,8tr Tương lai. Minh vẫn uống cà phê được — nhưng có chủ đích. Ở thành phố lớn, nhà + ăn có thể vượt 50%; khi đó bớt phần Muốn trước, đừng bớt phần Tương lai.", en: "4.5M Need · 2.7M Want · 1.8M Future. Minh can still buy coffee — on purpose. In a big city housing + food can pass 50%; then trim Want first, not Future." },
      hint: { vi: "10% của 9 triệu là 900k. 50% = 5 lần như vậy.", en: "10% of 9 million is 900k. 50% is five of those." },
    },
    {
      t: "slider", q: { vi: "Cà phê mang đi 35.000₫, mỗi ngày làm việc 1 ly (khoảng 20 ly/tháng). Một năm tốn khoảng bao nhiêu?", en: "Takeaway coffee at 35,000₫, one per working day (about 20 a month). Roughly how much is that in a year?" },
      art: "☕ × 20 × 12", min: 0, max: 15000000, step: 100000, start: 2000000, a: 8400000, tol: 300000,
      why: { vi: "35.000₫ × 20 × 12 = 8.400.000₫ — gần một tháng lương của Minh. Không cần bỏ hẳn: mua 8 ly/tháng, còn lại pha ở công ty, là bớt được khoảng 5 triệu/năm.", en: "35,000₫ × 20 × 12 = 8,400,000₫ — almost a month of Minh's pay. No need to quit: buy 8 a month and make the rest at the office, and you keep about 5 million a year." },
      hint: { vi: "Tính một tháng trước (35.000 × 20), rồi nhân 12.", en: "Work out one month first (35,000 × 20), then multiply by 12." },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Một công ty Mỹ chỉ đổi một điều: nhân viên mới được <b>tự động</b> đăng ký tiết kiệm hưu trí (ai không muốn thì tự hủy). Tỷ lệ tham gia thay đổi thế nào?", en: "A US company changed just one thing: new staff were enrolled in retirement saving <b>automatically</b> (they could opt out). What happened to participation?" },
      chart: {
        kind: "bar",
        labels: [{ vi: "Phải tự đăng ký", en: "Had to sign up" }, { vi: "Tự động đăng ký", en: "Enrolled automatically" }],
        series: [{ name: { vi: "% nhân viên mới tham gia", en: "% of new staff saving" }, color: "#2BB673", data: [37, 86] }],
        y: "%",
        source: { vi: "Madrian & Shea (2001), Quarterly Journal of Economics", en: "Madrian & Shea (2001), Quarterly Journal of Economics" },
      },
      o: [{ vi: "Tăng hơn gấp đôi", en: "More than doubled" }, { vi: "Gần như không đổi", en: "Barely changed" }, { vi: "Giảm vì bị ép", en: "Fell because people felt forced" }, { vi: "Tăng chút ít", en: "Rose a little" }],
      a: 0,
      why: { vi: "Từ khoảng 37% lên 86% — chỉ vì đổi <b>lựa chọn mặc định</b> (default option): phương án tự áp dụng khi bạn không làm gì. Con người hiếm khi đổi thứ đã được cài sẵn. Bài học: đừng dựa vào ý chí, hãy <b>tự động</b> để dành ngay ngày lương về.", en: "From about 37% to 86% — just by changing the <b>default option</b>: what happens when you do nothing. People rarely change what's already set up. Lesson: don't rely on willpower — save <b>automatically</b> on payday." },
      hint: { vi: "So chiều cao hai cột.", en: "Compare the two bars." },
    },
    /* 5 · Traps */
    {
      t: "mcq", q: { vi: "Một đồng nghiệp nói: “Lương mình 7 triệu, trừ tiền phòng với ăn uống là gần hết, lập ngân sách làm gì.” Bạn nghĩ sao?", en: "A colleague says: “I take home 7 million — after rent and food there's almost nothing left, so why bother with a budget?” What do you think?" },
      o: [
        { vi: "Đúng — ngân sách là chuyện của người lương cao", en: "True — budgets are for people on high pay" },
        { vi: "Sai — thu nhập càng thấp, mỗi khoản rò rỉ càng chiếm phần lớn, nên càng cần kế hoạch", en: "False — the lower the income, the bigger the share each leak takes, so a plan matters more" },
        { vi: "Chỉ cần khi lương trên 15 triệu", en: "Only once you earn over 15 million" },
        { vi: "Nhớ trong đầu là đủ, không cần ghi", en: "Remembering it is enough, no need to write it down" },
      ],
      a: 1,
      why: { vi: "Với 7 triệu, 20 ly cà phê 700k đã là 10% lương. Thu nhập thấp thì một tháng chi lố là phải quẹt thẻ hoặc vay. Và 'nhớ trong đầu' chính là lý do Minh không biết 2,3 triệu đi đâu.", en: "On 7 million, 20 coffees at 700k are already 10% of pay. On a low income, one month of overspending means a credit card or a loan. And 'just remembering' is exactly why Minh lost track of 2.3 million." },
      hint: { vi: "700k cà phê chiếm bao nhiêu % của 7 triệu?", en: "What share of 7 million is 700k of coffee?" },
    },
    {
      t: "spot", q: { vi: "Một đồng nghiệp gửi bài đăng này. Bấm vào những chỗ đang 'đẩy' bạn mua.", en: "A colleague sends you this post. Tap the parts that are pushing you to buy." },
      post: {
        user: "@deal.congnghe.vn", av: "🎧",
        parts: [
          [{ vi: "Tai nghe chống ồn bản mới 🔥", en: "New noise-cancelling headphones 🔥" }, false],
          [{ vi: "Cả văn phòng dùng hết rồi, còn mỗi bạn thôi 👀", en: "The whole office has them — except you 👀" }, true],
          [{ vi: "Trả sau 0₫ hôm nay, chia 4 kỳ!", en: "Pay later — 0₫ today, 4 instalments!" }, true],
          [{ vi: "Flash sale chỉ còn 2 tiếng ⏰", en: "Flash sale — only 2 hours left ⏰" }, true],
          [{ vi: "Bảo hành 12 tháng, giao toàn quốc", en: "12-month warranty, nationwide delivery" }, false],
        ],
      },
      why: { vi: "Áp lực từ người xung quanh, 'trả sau' (vẫn là nợ!) và sự gấp gáp giả tạo khiến người ta mua theo cảm xúc. Trong khảo sát của nhóm, 20/46 bạn từng mua vì bạn bè có. Mẹo: món trên 500k thì đợi 24 giờ.", en: "Pressure from people around you, 'pay later' (still debt!) and fake urgency drive impulse buys. In our survey, 20 of 46 teens had bought something because friends had it. Tip: anything over 500k, wait 24 hours." },
      hint: { vi: "Tìm câu đánh vào cảm xúc: sợ bị bỏ lại, sợ lỡ, hoặc làm bạn quên rằng mình đang vay.", en: "Look for lines that play on feelings: fear of being left out, fear of missing out, or hiding that you're borrowing." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: bạn cùng phòng mới đi làm, lương thực nhận 8 triệu, nhưng ngày 20 đã hết tiền. Khuyên 1–2 câu: từ tháng sau nên làm gì?", en: "Final boss: your flatmate has just started work, takes home 8 million, but is broke by the 20th. Advise them in 1–2 sentences: what to do from next month?" },
      keys: [
        { label: { vi: "Ghi chép / theo dõi", en: "Track spending" }, words: { vi: ["ghi chép", "ghi lại", "ghi", "theo dõi", "sổ", "biết tiền đi đâu", "đi đâu"], en: ["track", "write", "log", "note", "record", "where"] } },
        { label: { vi: "Chia hũ / lập kế hoạch", en: "Split / plan" }, words: { vi: ["chia", "hũ", "kế hoạch", "ngân sách", "50/30/20", "cần", "muốn"], en: ["split", "jar", "plan", "budget", "50/30/20", "need", "want"] } },
        { label: { vi: "Để dành trước / cắt rò rỉ", en: "Save first / cut leaks" }, words: { vi: ["để dành trước", "tiết kiệm trước", "trả cho mình", "để dành", "tiết kiệm", "rò rỉ", "bớt", "giảm"], en: ["save first", "pay yourself", "save", "leak", "cut", "less"] } },
      ],
      need: 2,
      model: { vi: "Ghi lại mọi khoản chi trong một tháng để thấy tiền đi đâu, rồi chia 8 triệu thành Cần · Muốn · Tương lai ngay ngày nhận lương, chuyển phần tiết kiệm đi trước và cắt các khoản rò rỉ như cà phê mang đi, phí giao đồ ăn.", en: "Write down every spend for a month to see where the money goes, then split the 8 million into Need · Want · Future on payday, move the savings out first, and cut leaks like takeaway coffee and delivery fees." },
      why: { vi: "Ý chính: thấy rõ tiền đi đâu → chia trước khi tiêu → cắt rò rỉ.", en: "Key idea: see where money goes → split before spending → cut the leaks." },
      hint: { vi: "Nhớ lại tháng của Minh: Minh thiếu điều gì?", en: "Think back to Minh's month: what was missing?" },
    },
    {
      t: "learn", art: "📝 → 🫙🫙🫙 → ⏳24h",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: {
        vi: "Ba việc nhỏ làm được ngay, không cần app nào:",
        en: "Three small things you can do right now, no app needed:",
      },
      items: [
        ["📝", { vi: "Ghi lại MỌI khoản chi trong 7 ngày (ghi chú điện thoại là đủ)", en: "Write down EVERY spend for 7 days (your phone's notes app is enough)" }],
        ["🚀", { vi: "Ngày lương về: chuyển 20% sang tài khoản tiết kiệm riêng TRƯỚC khi tiêu — đặt lệnh chuyển tự động nếu ngân hàng có", en: "On payday, move 20% to a separate savings account BEFORE spending — set up an automatic transfer if your bank offers one" }],
        ["⏳", { vi: "Món trên 500k: đợi 24 giờ rồi mới quyết", en: "Anything over 500k: wait 24 hours before deciding" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Sổ chi tiêu — báo cáo cuối tháng ở Nhà tách rõ Nhu cầu và Mong muốn!", en: "🎮 Unlocked in the game: the Spending log — your end-of-month report at Home splits Needs and Wants!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "🫙🫙🫙 🧠",
      title: { vi: "Kế toán tinh thần & phương pháp 'hũ'", en: "Mental accounting & the jar method" },
      text: {
        vi: "Nhà kinh tế học Richard Thaler (Nobel 2017) chỉ ra con người chia tiền vào các 'tài khoản trong đầu' và đối xử với chúng khác nhau — gọi là <b>kế toán tinh thần</b> (mental accounting): tiền thưởng Tết thì dễ tiêu hơn tiền lương, dù cùng là tiền. Phương pháp <b>hũ/phong bì</b> dùng chính thiên kiến này một cách có chủ đích. Một cách chặt hơn là <b>ngân sách cơ sở 0</b> (zero-based budgeting): mọi đồng đều được giao 'nhiệm vụ' trước khi tháng bắt đầu.",
        en: "Economist Richard Thaler (Nobel 2017) showed people sort money into 'accounts in their head' and treat them differently — <b>mental accounting</b>: a Tết bonus feels easier to spend than salary, though it's the same money. The <b>jar/envelope</b> method uses that bias on purpose. A stricter option is <b>zero-based budgeting</b>: every unit of money gets a 'job' before the month starts.",
      },
    },
    {
      t: "calc", q: { vi: "Chị Mai, 27 tuổi, thực nhận 12.000.000₫/tháng, theo 50/30/20. Chị muốn có <b>quỹ khẩn cấp</b> (emergency fund) — tiền dự phòng cho mất việc, ốm đau — bằng 3 tháng tiền 'Cần'. Tính từng bước:", en: "Mai, 27, takes home 12,000,000₫ a month and follows 50/30/20. She wants an <b>emergency fund</b> — money set aside for job loss or illness — worth 3 months of 'Need'. Work it out step by step:" },
      art: "💼 12.000.000₫",
      parts: [
        { label: { vi: "Tiền để dành mỗi tháng (₫)", en: "Savings per month (₫)" }, a: 2400000, tol: 0, unit: "₫" },
        { label: { vi: "Quỹ khẩn cấp mục tiêu = 3 tháng tiền 'Cần' (₫)", en: "Emergency-fund target = 3 months of 'Need' (₫)" }, a: 18000000, tol: 0, unit: "₫" },
        { label: { vi: "Cần bao nhiêu tháng để đủ quỹ? (làm tròn 1 chữ số thập phân)", en: "Months needed to reach it? (1 decimal place)" }, a: 7.5, tol: 0.05, unit: { vi: "tháng", en: "months" } },
      ],
      why: { vi: "20% × 12 triệu = 2,4 triệu. Cần = 50% = 6 triệu → 3 tháng = 18 triệu. 18 ÷ 2,4 = 7,5 tháng.", en: "20% × 12M = 2.4M. Need = 50% = 6M → 3 months = 18M. 18 ÷ 2.4 = 7.5 months." },
      hint: { vi: "Bước 2 dùng tiền 'Cần' (50%), không phải toàn bộ lương.", en: "Step 2 uses 'Need' money (50%), not the whole salary." },
    },
    {
      t: "mcq", q: { vi: "'Ngân sách cơ sở 0' nghĩa là…", en: "'Zero-based budgeting' means…" },
      o: [
        { vi: "Thu nhập − các khoản đã phân bổ = 0: mọi đồng đều có mục đích", en: "Income − everything allocated = 0: every unit has a purpose" },
        { vi: "Cuối tháng phải tiêu hết về 0", en: "You must spend down to zero by month-end" },
        { vi: "Không được tiết kiệm đồng nào", en: "You save nothing at all" },
        { vi: "Bắt đầu tháng với 0₫ trong tài khoản", en: "You start each month with 0₫ in the bank" },
      ],
      a: 0,
      why: { vi: "Tiết kiệm cũng là một 'nhiệm vụ'. Cơ sở 0 nghĩa là không có đồng nào 'vô chủ' — không phải tiêu hết.", en: "Savings is also a 'job'. Zero-based means no money is left unassigned — not that you spend it all." },
    },
    {
      t: "mcq", q: { vi: "Vì sao quy tắc 50/30/20 có thể KHÔNG hợp với một người thuê nhà ở thành phố lớn, lương thấp?", en: "Why might 50/30/20 NOT fit someone renting in a big city on a low wage?" },
      o: [
        { vi: "Riêng tiền thuê nhà và ăn uống có thể đã vượt 50% — phải bớt phần 'Muốn' và giữ 'Tương lai' dù nhỏ", en: "Rent and food alone may exceed 50% — cut 'Want' and keep 'Future' even if small" },
        { vi: "Vì 50/30/20 là luật bắt buộc nên phải tìm việc khác", en: "Because 50/30/20 is a mandatory law, they must change jobs" },
        { vi: "Vì người lương thấp không cần tiết kiệm", en: "Because low earners don't need to save" },
        { vi: "Vì tiền thuê nhà được tính vào 'Muốn'", en: "Because rent counts as a 'Want'" },
      ],
      a: 0,
      why: { vi: "Ở thành phố lớn, <b>chi phí sinh hoạt</b> (cost of living) — tiền nhà, ăn, đi lại tối thiểu — cao hơn hẳn, nên tỷ lệ chỉ là điểm khởi đầu, không phải luật. Thói quen 'trả cho mình trước' — dù chỉ 5% — quan trọng hơn con số chính xác.", en: "In a big city the <b>cost of living</b> — minimum housing, food and transport — is much higher, so the split is a starting point, not a law. The 'pay yourself first' habit — even at 5% — matters more than the exact numbers." },
    },
  ],
};
export default lesson;
