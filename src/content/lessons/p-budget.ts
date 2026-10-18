/* Personal finance · P1 — "Where does my pocket money disappear to?" (design doc 13.2d, 6-beat frame 13.2c)
 * Hook → guess → mechanism (live a week of Lan's money, find the leaks, split into jars) → real story (Madrian & Shea)
 * → traps ("too little money to need a budget", buying because friends did) → boss + "use it today" + game unlock.
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
  title: { vi: "Tiền tiêu vặt của mình biến đi đâu hết?", en: "Where does my pocket money disappear to?" },
  desc: {
    vi: "Sống thử một tuần tiền tiêu vặt, tìm chỗ rò rỉ, chia tiền thành Cần · Muốn · Tương lai, và vì sao 'tự động để dành' thắng ý chí.",
    en: "Live a week of pocket money, find the leaks, split money into Need · Want · Future, and why automatic saving beats willpower.",
  },
  review: {
    title: { vi: "Ngân sách", en: "Budgeting" },
    points: [
      { vi: "Ngân sách = kế hoạch cho tiền <b>trước khi</b> tiêu.", en: "A budget = a plan for money <b>before</b> you spend it." },
      { vi: "Cần 50% · Muốn 30% · Tương lai 20% (điểm khởi đầu, chỉnh được).", en: "Need 50% · Want 30% · Future 20% (a starting point you can adjust)." },
      { vi: "Khoản nhỏ lặp lại = <b>rò rỉ tiền</b>, thường lớn nhất tuần.", en: "Small repeated spends = <b>money leaks</b>, often the biggest item of the week." },
      { vi: "'Trả cho mình trước': để dành ngay khi nhận tiền — tự động thì càng tốt.", en: "'Pay yourself first': save the moment money arrives — automatically if you can." },
    ],
  },
  info: {
    s: { vi: "Ghi chép để thấy tiền đi đâu; chia Cần/Muốn/Tương lai (50/30/20); để dành trước khi tiêu.", en: "Track to see where money goes; split Need/Want/Future (50/30/20); save before you spend." },
    l: {
      vi: "Tiền 'biến mất' thường không vì một món đắt mà vì hàng chục khoản nhỏ lặp lại không ai ghi lại. Ngân sách là kế hoạch cho tiền trước khi tiêu: chia Cần (50%) · Muốn (30%) · Tương lai (20%) là điểm khởi đầu dễ nhớ. Ít tiền càng cần ngân sách, vì mỗi khoản rò rỉ chiếm phần lớn hơn. Thói quen mạnh nhất là 'trả cho mình trước' — chuyển tiền để dành ngay khi nhận, tốt nhất là tự động.",
      en: "Money 'vanishes' not because of one big purchase but because of dozens of small repeated ones nobody writes down. A budget is a plan before you spend: Need (50%) · Want (30%) · Future (20%) is an easy start. Less money means you need a budget more, because each leak takes a bigger share. The strongest habit is 'pay yourself first' — save the moment money arrives, ideally automatically.",
    },
  },
  kb: ["budget", "leaks", "debt", "emergency"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Vietnamese dong banknotes" }, art: "💰 500k → 🫙 20k", cap: { vi: "Không mua món gì lớn… vậy tiền đi đâu?", en: "No big purchase… so where did it go?" },
      title: { vi: "Tiền tiêu vặt của mình biến đi đâu hết?", en: "Where does my pocket money disappear to?" },
      text: {
        vi: "Chủ nhật, Lan (lớp 10) nhận <b>500.000₫</b> tiêu cả tuần. Thứ Sáu ví còn <b>20.000₫</b> — và Lan thề là không mua gì lớn. Trong bài này bạn sẽ <b>sống thử tuần của Lan</b>, tự tìm ra tiền đã 'rò' qua đâu, rồi lập kế hoạch để chuyện này không lặp lại.",
        en: "On Sunday Lan (grade 10) gets <b>500,000₫</b> for the week. By Friday there's <b>20,000₫</b> left — and Lan swears nothing big was bought. In this lesson you'll <b>live Lan's week</b>, find where the money leaked, then make a plan so it doesn't happen again.",
      },
      lion: { vi: "Không phải cấm tiêu — mà là tiêu có chủ đích 🎯", en: "It's not about never spending — it's spending on purpose 🎯" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: bao nhiêu % tiền tuần của Lan đã đi vào trà sữa, nạp game, phí ship và đồ ăn vặt?", en: "Guess: what share of Lan's week went on milk tea, game top-ups, delivery fees and snacks?" },
      art: "🧋 🎮 📦 🍡", min: 0, max: 100, step: 1, start: 20, actual: 54, unit: "pct",
      reveal: { vi: "54% — hơn một nửa! 270.000₫ trên 500.000₫. Mỗi khoản chỉ 15–35k nên chẳng ai nhớ, nhưng cộng lại thành khoản <b>lớn nhất</b> trong tuần. Phần lớn mọi người đoán 20–30%.", en: "54% — more than half! 270,000₫ of 500,000₫. Each spend was only 15–35k so nobody remembers them, but together they're the <b>biggest</b> item of the week. Most people guess 20–30%." },
    },
    /* 3 · Mechanism: live the week, find the leaks */
    {
      t: "tap", q: { vi: "Đây là sổ chi tiêu tuần của Lan. Bấm vào các khoản 'rò rỉ tiền'.", en: "Here's Lan's spending log for the week. Tap the money leaks." },
      head: { vi: "Tuần của Lan · 500.000₫", en: "Lan's week · 500,000₫" },
      items: [
        ["🍱", { vi: "Cơm trưa căng tin ×5", en: "School lunch ×5" }, "125.000₫", false],
        ["🛵", { vi: "Gửi xe ×5", en: "Bike parking ×5" }, "25.000₫", false],
        ["🧋", { vi: "Trà sữa ×4", en: "Milk tea ×4" }, "140.000₫", true],
        ["🎮", { vi: "Nạp game ×2 (20k/lần)", en: "Game top-ups ×2 (20k each)" }, "40.000₫", true],
        ["📗", { vi: "Sách tham khảo", en: "Study book" }, "60.000₫", false],
        ["📦", { vi: "Phí ship 3 đơn Shopee lẻ", en: "Delivery fees on 3 separate orders" }, "45.000₫", true],
        ["🍡", { vi: "Đồ ăn vặt cổng trường ×3", en: "Snacks at the school gate ×3" }, "45.000₫", true],
      ],
      why: { vi: "Rò rỉ = nhỏ, lặp lại, không thật sự cần (hoặc có cách rẻ hơn: gộp đơn để 1 lần ship, trà sữa 1 lần/tuần). Bốn khoản này = 270.000₫.", en: "A leak = small, repeated, not really needed (or there's a cheaper way: one combined order, milk tea once a week). These four = 270,000₫." },
      hint: { vi: "Bỏ khoản đó thì việc ăn, học, đi lại có bị ảnh hưởng không? Không → có thể là rò rỉ.", en: "Without it, would eating, school or getting around suffer? No → probably a leak." },
    },
    {
      t: "learn", art: SPLIT,
      title: { vi: "Cần · Muốn · Tương lai", en: "Need · Want · Future" },
      text: {
        vi: "Một cách chia dễ nhớ cho mọi khoản tiền bạn nhận: <b>50% Cần</b> (ăn trưa, đi lại, đồ học), <b>30% Muốn</b> (trà sữa, game, đi chơi), <b>20% Tương lai</b> (quỹ khẩn cấp, mục tiêu lớn như laptop). Đây là phiên bản cho teen của quy tắc 50/30/20 — một <b>quy tắc kinh nghiệm</b>, không phải luật.",
        en: "An easy split for any money you get: <b>50% Need</b> (lunch, transport, school things), <b>30% Want</b> (milk tea, games, going out), <b>20% Future</b> (emergency fund, big goals like a laptop). It's the teen version of the 50/30/20 rule — a <b>rule of thumb</b>, not a law.",
      },
      items: [["🧱", { vi: "Cần 50%", en: "Need 50%" }], ["✨", { vi: "Muốn 30%", en: "Want 30%" }], ["🚀", { vi: "Tương lai 20%", en: "Future 20%" }]],
    },
    {
      t: "jars", q: { vi: "Tuần sau Lan lại có 500.000₫. Chia vào 3 hũ theo 50/30/20.", en: "Next week Lan has 500,000₫ again. Split it into the 3 jars, 50/30/20." },
      total: 500000, step: 10000,
      jars: [[{ vi: "🧱 Cần", en: "🧱 Need" }, "#5B5BD6", 250000], [{ vi: "✨ Muốn", en: "✨ Want" }, "#F28C28", 150000], [{ vi: "🚀 Tương lai", en: "🚀 Future" }, "#2BB673", 100000]],
      why: { vi: "250.000₫ Cần · 150.000₫ Muốn · 100.000₫ Tương lai. Với 150k cho 'Muốn', Lan vẫn uống được trà sữa — nhưng chọn có chủ đích.", en: "250,000₫ Need · 150,000₫ Want · 100,000₫ Future. With 150k for 'Want', Lan can still have milk tea — on purpose." },
      hint: { vi: "10% của 500k là 50k. 50% = 5 lần như vậy.", en: "10% of 500k is 50k. 50% is five of those." },
    },
    {
      t: "slider", q: { vi: "Trà sữa 35.000₫, 4 ly mỗi tuần. Một năm (52 tuần) tốn khoảng bao nhiêu?", en: "Milk tea at 35,000₫, 4 a week. Roughly how much is that in a year (52 weeks)?" },
      art: "🧋 × 4 × 52", min: 0, max: 15000000, step: 100000, start: 2000000, a: 7300000, tol: 300000,
      why: { vi: "35.000₫ × 4 × 52 = 7.280.000₫ — gần bằng một chiếc điện thoại tốt. Không cần bỏ hẳn: giảm còn 1 ly/tuần là để dành được ~5,5 triệu/năm.", en: "35,000₫ × 4 × 52 = 7,280,000₫ — about a good phone. No need to quit: one a week saves ~5.5 million a year." },
      hint: { vi: "Tính tiền một tuần trước (35.000 × 4), rồi nhân 52.", en: "Work out one week first (35,000 × 4), then multiply by 52." },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Một công ty Mỹ chỉ đổi một điều: nhân viên mới được <b>tự động</b> đăng ký tiết kiệm (ai không muốn thì tự hủy). Tỷ lệ tham gia thay đổi thế nào?", en: "A US company changed just one thing: new staff were enrolled in saving <b>automatically</b> (they could opt out). What happened to participation?" },
      chart: {
        kind: "bar",
        labels: [{ vi: "Phải tự đăng ký", en: "Had to sign up" }, { vi: "Tự động đăng ký", en: "Enrolled automatically" }],
        series: [{ name: { vi: "% nhân viên mới tham gia", en: "% of new staff saving" }, color: "#2BB673", data: [37, 86] }],
        y: "%",
        source: { vi: "Madrian & Shea (2001), Quarterly Journal of Economics", en: "Madrian & Shea (2001), Quarterly Journal of Economics" },
      },
      o: [{ vi: "Tăng hơn gấp đôi", en: "More than doubled" }, { vi: "Gần như không đổi", en: "Barely changed" }, { vi: "Giảm vì bị ép", en: "Fell because people felt forced" }, { vi: "Tăng chút ít", en: "Rose a little" }],
      a: 0,
      why: { vi: "Từ khoảng 37% lên 86% — chỉ vì đổi lựa chọn <b>mặc định</b>. Con người hiếm khi đổi thứ đã được cài sẵn. Bài học: đừng dựa vào ý chí, hãy <b>tự động</b> để dành ngay ngày nhận tiền.", en: "From about 37% to 86% — just by changing the <b>default</b>. People rarely change what's already set up. Lesson: don't rely on willpower — save <b>automatically</b> on the day money arrives." },
      hint: { vi: "So chiều cao hai cột.", en: "Compare the two bars." },
    },
    /* 5 · Traps */
    {
      t: "mcq", q: { vi: "Huy nói: “Mình chỉ có 300k một tuần, ít thế thì lập ngân sách làm gì.” Bạn nghĩ sao?", en: "Huy says: “I only get 300k a week — too little to bother with a budget.” What do you think?" },
      o: [
        { vi: "Đúng — ngân sách là chuyện của người nhiều tiền", en: "True — budgets are for people with lots of money" },
        { vi: "Sai — tiền càng ít, mỗi khoản rò rỉ càng chiếm phần lớn, nên càng cần kế hoạch", en: "False — the less money, the bigger the share each leak takes, so a plan matters more" },
        { vi: "Chỉ cần khi đi làm có lương", en: "Only once you have a salary" },
        { vi: "Nhớ trong đầu là đủ, không cần ghi", en: "Remembering it is enough, no need to write it down" },
      ],
      a: 1,
      why: { vi: "Với 300k, một ly trà sữa 35k đã là 12% cả tuần. Ít tiền thì sai một lần là hết tiền cho bữa trưa. Và 'nhớ trong đầu' chính là lý do Lan không biết 270k đi đâu.", en: "With 300k, one 35k milk tea is 12% of the week. With little money, one slip means no lunch money. And 'just remembering' is exactly why Lan lost track of 270k." },
      hint: { vi: "Một ly trà sữa chiếm bao nhiêu % của 300k?", en: "What share of 300k is one milk tea?" },
    },
    {
      t: "spot", q: { vi: "Bạn thân gửi bài đăng này. Bấm vào những chỗ đang 'đẩy' bạn mua.", en: "Your best friend sends you this post. Tap the parts that are pushing you to buy." },
      post: {
        user: "@sneaker.hub.vn", av: "👟",
        parts: [
          [{ vi: "Đôi sneaker phiên bản giới hạn 🔥", en: "Limited-edition sneakers 🔥" }, false],
          [{ vi: "Cả lớp có hết rồi, còn mỗi bạn thôi 👀", en: "Your whole class has them — except you 👀" }, true],
          [{ vi: "Mua trước trả sau 0₫ hôm nay!", en: "Buy now, pay later — 0₫ today!" }, true],
          [{ vi: "Chỉ còn 2 tiếng, chốt nhanh kẻo lỡ ⏰", en: "Only 2 hours left — grab it now ⏰" }, true],
          [{ vi: "Size 36–43, giao toàn quốc", en: "Sizes 36–43, nationwide delivery" }, false],
        ],
      },
      why: { vi: "Áp lực bạn bè, 'mua trước trả sau' (vẫn là nợ!) và sự gấp gáp giả tạo khiến người ta mua theo cảm xúc. Trong khảo sát của nhóm, 20/46 bạn từng mua vì bạn bè có. Mẹo: món trên 100k thì đợi 24 giờ.", en: "Peer pressure, 'buy now, pay later' (still debt!) and fake urgency drive impulse buys. In our survey, 20 of 46 teens had bought something because friends had it. Tip: anything over 100k, wait 24 hours." },
      hint: { vi: "Tìm câu đánh vào cảm xúc: sợ bị bỏ lại, sợ lỡ, hoặc làm bạn quên rằng mình đang vay.", en: "Look for lines that play on feelings: fear of being left out, fear of missing out, or hiding that you're borrowing." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: em của bạn được 300k/tuần nhưng thứ Tư đã hết sạch. Khuyên em 1–2 câu: từ tuần sau nên làm gì?", en: "Final boss: your younger sibling gets 300k a week but is broke by Wednesday. Advise them in 1–2 sentences: what to do from next week?" },
      keys: [
        { label: { vi: "Ghi chép / theo dõi", en: "Track spending" }, words: { vi: ["ghi chép", "ghi lại", "ghi", "theo dõi", "sổ", "biết tiền đi đâu", "đi đâu"], en: ["track", "write", "log", "note", "record", "where"] } },
        { label: { vi: "Chia hũ / lập kế hoạch", en: "Split / plan" }, words: { vi: ["chia", "hũ", "kế hoạch", "ngân sách", "50/30/20", "cần", "muốn"], en: ["split", "jar", "plan", "budget", "50/30/20", "need", "want"] } },
        { label: { vi: "Để dành trước / cắt rò rỉ", en: "Save first / cut leaks" }, words: { vi: ["để dành trước", "tiết kiệm trước", "trả cho mình", "để dành", "tiết kiệm", "rò rỉ", "bớt", "giảm"], en: ["save first", "pay yourself", "save", "leak", "cut", "less"] } },
      ],
      need: 2,
      model: { vi: "Ghi lại mọi khoản chi trong một tuần để thấy tiền đi đâu, rồi chia 300k thành Cần · Muốn · Tương lai ngay khi nhận và bớt các khoản rò rỉ như trà sữa, phí ship lẻ.", en: "Write down every spend for a week to see where the money goes, then split the 300k into Need · Want · Future the moment you get it, and cut leaks like milk tea and separate delivery fees." },
      why: { vi: "Ý chính: thấy rõ tiền đi đâu → chia trước khi tiêu → cắt rò rỉ.", en: "Key idea: see where money goes → split before spending → cut the leaks." },
      hint: { vi: "Nhớ lại tuần của Lan: Lan thiếu điều gì?", en: "Think back to Lan's week: what was missing?" },
    },
    {
      t: "learn", art: "📝 → 🫙🫙🫙 → ⏳24h",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: {
        vi: "Ba việc nhỏ làm được ngay, không cần app nào:",
        en: "Three small things you can do right now, no app needed:",
      },
      items: [
        ["📝", { vi: "Ghi lại MỌI khoản chi trong 3 ngày (ghi chú điện thoại là đủ)", en: "Write down EVERY spend for 3 days (your phone's notes app is enough)" }],
        ["🚀", { vi: "Khi nhận tiền tiêu vặt, bỏ 20% vào hũ 'Tương lai' TRƯỚC khi tiêu", en: "When pocket money arrives, put 20% in the 'Future' jar BEFORE spending" }],
        ["⏳", { vi: "Món trên 100k: đợi 24 giờ rồi mới quyết", en: "Anything over 100k: wait 24 hours before deciding" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Sổ chi tiêu — báo cáo cuối tháng ở Nhà tách rõ Nhu cầu và Mong muốn!", en: "🎮 Unlocked in the game: the Spending log — your end-of-month report at Home splits Needs and Wants!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "🫙🫙🫙 🧠",
      title: { vi: "Kế toán tinh thần & phương pháp 'hũ'", en: "Mental accounting & the jar method" },
      text: {
        vi: "Nhà kinh tế học Richard Thaler (Nobel 2017) chỉ ra con người chia tiền vào các 'tài khoản trong đầu' và đối xử với chúng khác nhau — tiền lì xì thì dễ tiêu hơn tiền làm thêm, dù cùng là tiền. Phương pháp <b>hũ/phong bì</b> dùng chính thiên kiến này một cách có chủ đích. Một cách chặt hơn là <b>ngân sách cơ sở 0</b>: mọi đồng đều được giao 'nhiệm vụ' trước khi tháng bắt đầu.",
        en: "Economist Richard Thaler (Nobel 2017) showed people sort money into 'mental accounts' and treat them differently — lucky money feels easier to spend than money you earned, though it's the same money. The <b>jar/envelope</b> method uses that bias on purpose. A stricter option is <b>zero-based budgeting</b>: every unit of money gets a 'job' before the month starts.",
      },
    },
    {
      t: "calc", q: { vi: "Chị Mai mới đi làm, lương 9.000.000₫/tháng, theo 50/30/20. Tính từng bước:", en: "Mai just started work: 9,000,000₫ a month, using 50/30/20. Work it out step by step:" },
      art: "💼 9.000.000₫",
      parts: [
        { label: { vi: "Tiền để dành mỗi tháng (₫)", en: "Savings per month (₫)" }, a: 1800000, tol: 0, unit: "₫" },
        { label: { vi: "Quỹ khẩn cấp mục tiêu = 3 tháng tiền 'nhu cầu' (₫)", en: "Emergency-fund target = 3 months of 'needs' (₫)" }, a: 13500000, tol: 0, unit: "₫" },
        { label: { vi: "Cần bao nhiêu tháng để đủ quỹ? (làm tròn 1 chữ số thập phân)", en: "Months needed to reach it? (1 decimal place)" }, a: 7.5, tol: 0.05, unit: { vi: "tháng", en: "months" } },
      ],
      why: { vi: "20% × 9 triệu = 1,8 triệu. Nhu cầu = 50% = 4,5 triệu → 3 tháng = 13,5 triệu. 13,5 ÷ 1,8 = 7,5 tháng.", en: "20% × 9M = 1.8M. Needs = 50% = 4.5M → 3 months = 13.5M. 13.5 ÷ 1.8 = 7.5 months." },
      hint: { vi: "Bước 2 dùng tiền 'nhu cầu' (50%), không phải toàn bộ lương.", en: "Step 2 uses 'needs' money (50%), not the whole salary." },
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
      why: { vi: "Tỷ lệ là điểm khởi đầu, không phải luật. Thói quen 'trả cho mình trước' — dù chỉ 5% — quan trọng hơn con số chính xác.", en: "The split is a starting point, not a law. The 'pay yourself first' habit — even at 5% — matters more than the exact numbers." },
    },
  ],
};
export default lesson;
