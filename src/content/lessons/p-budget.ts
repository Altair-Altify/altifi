/* Personal finance · Lesson 1 — Budget & 50/30/20, money leaks, tracking (design doc 3.4)
 * ⚠️ Facts to verify before submission: Warren & Tyagi 2005 (50/30/20); Madrian & Shea 2001 (37% → 86%). */
import type { Lesson } from "../../lesson/types";

const SPLIT = `<div class="split"><i style="flex:50;background:#5B5BD6">50%<br>🧱</i><i style="flex:30;background:#F28C28">30%<br>✨</i><i style="flex:20;background:#2BB673">20%<br>🐷</i></div>`;

const lesson: Lesson = {
  id: "p-budget",
  domain: "personal",
  icon: "📊",
  ic: "pie",
  minutes: 6,
  title: { vi: "Ngân sách & quy tắc 50/30/20", en: "Budgets & the 50/30/20 rule" },
  desc: {
    vi: "Vì sao tiền 'bốc hơi' giữa tháng, chia tiền theo 50/30/20, tìm chỗ rò rỉ và nhận ra chiêu 'mua theo bạn bè'.",
    en: "Why money 'evaporates' mid-month, splitting it 50/30/20, finding leaks, and spotting 'buy it because friends did' traps.",
  },
  review: {
    title: { vi: "Ngân sách", en: "Budgeting" },
    points: [
      { vi: "Ngân sách = kế hoạch cho tiền <b>trước khi</b> tiêu.", en: "A budget = a plan for money <b>before</b> you spend it." },
      { vi: "50/30/20: 50% nhu cầu · 30% mong muốn · 20% tiết kiệm.", en: "50/30/20: 50% needs · 30% wants · 20% savings." },
      { vi: "Khoản nhỏ lặp lại mỗi ngày = <b>rò rỉ tiền</b>.", en: "Small repeated spends = <b>money leaks</b>." },
      { vi: "'Trả cho mình trước': để dành ngay khi nhận tiền.", en: "'Pay yourself first': save the moment money arrives." },
    ],
  },
  info: {
    s: { vi: "50/30/20: 50% nhu cầu, 30% mong muốn, 20% tiết kiệm — và ghi chép để thấy tiền đi đâu.", en: "50/30/20: 50% needs, 30% wants, 20% savings — and track spending to see where money goes." },
    l: {
      vi: "Ngân sách là kế hoạch cho tiền trước khi tiêu. Quy tắc 50/30/20 là điểm khởi đầu dễ nhớ: một nửa cho nhu cầu, 30% cho mong muốn, 20% để dành. Bước quan trọng nhất là ghi chép chi tiêu thật — vì những khoản nhỏ lặp lại (trà sữa, phí giao hàng, gói đăng ký quên hủy) thường là chỗ rò rỉ lớn nhất.",
      en: "A budget is a plan for your money before you spend it. The 50/30/20 rule is an easy starting point: half for needs, 30% for wants, 20% for savings. The most important step is tracking what you really spend — small repeated purchases (bubble tea, delivery fees, forgotten subscriptions) are usually the biggest leaks.",
    },
  },
  kb: ["budget", "leaks", "debt", "emergency"],
  steps: [
    {
      t: "learn", photo: { query: "Vietnamese dong banknotes" }, art: "📅 1 → 15 → 30<br>💰 → 💸 → 🫙", cap: { vi: "Đầu tháng nhiều tiền · giữa tháng… đâu mất rồi?", en: "Start of month: plenty · mid-month: where did it go?" },
      title: { vi: "Tiền 'bốc hơi' giữa tháng", en: "The mid-month vanishing act" },
      text: {
        vi: "Rất nhiều người nhận tiền đầu tháng và tới giữa tháng đã cạn — dù không nhớ mình mua gì lớn. Thủ phạm thường không phải một món đắt, mà là <b>hàng chục khoản nhỏ</b> không ai ghi lại. Ngân sách giúp bạn quyết định tiền đi đâu <b>trước</b>, thay vì ngạc nhiên <b>sau</b>.",
        en: "Lots of people get paid at the start of the month and are broke by the middle — without remembering any big purchase. The culprit is rarely one expensive thing; it's <b>dozens of small spends</b> nobody wrote down. A budget lets you decide where money goes <b>before</b>, instead of being surprised <b>after</b>.",
      },
      lion: { vi: "Không phải cấm tiêu — mà là tiêu có chủ đích 🎯", en: "It's not about never spending — it's spending on purpose 🎯" },
    },
    {
      t: "learn", art: SPLIT,
      title: { vi: "Quy tắc 50/30/20", en: "The 50/30/20 rule" },
      text: {
        vi: "Một điểm khởi đầu dễ nhớ cho mọi khoản tiền bạn nhận: <b>50%</b> cho nhu cầu (ăn, đi lại, học), <b>30%</b> cho mong muốn (giải trí, đồ thích), <b>20%</b> để dành. Đây là <b>quy tắc kinh nghiệm</b>, không phải luật — bạn có thể chỉnh theo hoàn cảnh.",
        en: "An easy starting split for any money you get: <b>50%</b> for needs (food, transport, school), <b>30%</b> for wants (fun, nice-to-haves), <b>20%</b> for savings. It's a <b>rule of thumb</b>, not a law — adjust it to your situation.",
      },
      items: [["🧱", { vi: "Nhu cầu 50%", en: "Needs 50%" }], ["✨", { vi: "Mong muốn 30%", en: "Wants 30%" }], ["🐷", { vi: "Tiết kiệm 20%", en: "Savings 20%" }]],
    },
    {
      t: "jars", q: { vi: "Tháng này bạn có 2.000.000₫ (tiền tiêu vặt + dạy kèm). Chia theo 50/30/20.", en: "This month you have 2,000,000₫ (allowance + tutoring). Split it 50/30/20." },
      total: 2000000, step: 100000,
      jars: [[{ vi: "🧱 Nhu cầu", en: "🧱 Needs" }, "#5B5BD6", 1000000], [{ vi: "✨ Mong muốn", en: "✨ Wants" }, "#F28C28", 600000], [{ vi: "🐷 Tiết kiệm", en: "🐷 Savings" }, "#2BB673", 400000]],
      why: { vi: "1.000.000₫ nhu cầu · 600.000₫ mong muốn · 400.000₫ tiết kiệm.", en: "1,000,000₫ needs · 600,000₫ wants · 400,000₫ savings." },
      hint: { vi: "Tìm 50%, 30% và 20% của 2 triệu. 10% của 2 triệu là 200.000₫.", en: "Find 50%, 30% and 20% of 2 million. 10% of 2 million is 200,000₫." },
    },
    {
      t: "sort", q: { vi: "Khoản này vào hũ nào?", en: "Which jar does it go in?" },
      buckets: [["🧱", { vi: "Nhu cầu", en: "Needs" }], ["✨", { vi: "Mong muốn", en: "Wants" }], ["🐷", { vi: "Tiết kiệm", en: "Savings" }]],
      items: [
        ["🛵", { vi: "Tiền gửi xe ở trường", en: "School parking fee" }, 0],
        ["🎮", { vi: "Gói nạp game", en: "Game top-up" }, 1],
        ["☂️", { vi: "Quỹ khẩn cấp", en: "Emergency fund" }, 2],
        ["📚", { vi: "Sách tham khảo cho kỳ thi", en: "Exam prep book" }, 0],
        ["🧋", { vi: "Trà sữa cuối tuần với bạn", en: "Weekend bubble tea with friends" }, 1],
        ["💻", { vi: "Để dành mua laptop học tập", en: "Saving for a study laptop" }, 2],
      ],
      why: { vi: "Mục tiêu và quỹ khẩn cấp là tiết kiệm, dù sau này bạn sẽ tiêu chúng. Thứ giúp đời sống và việc học chạy được là nhu cầu.", en: "Goals and emergency funds count as savings, even if you'll spend them one day. Things that keep daily life and school running are needs." },
      hint: { vi: "Hỏi: không có nó thì việc học/đi lại có bị ảnh hưởng không? Có → nhu cầu.", en: "Ask: without it, would school or getting around suffer? Yes → need." },
    },
    {
      t: "tap", q: { vi: "Đây là chi tiêu tuần này của Minh. Bấm vào các khoản 'rò rỉ tiền'.", en: "Here's Minh's spending this week. Tap the money leaks." },
      head: { vi: "Tuần của Minh", en: "Minh's week" },
      items: [
        ["🛵", { vi: "Gửi xe", en: "Parking" }, "35.000₫", false],
        ["🧋", { vi: "Trà sữa ×5", en: "Bubble tea ×5" }, "175.000₫", true],
        ["🎧", { vi: "App nghe nhạc trả phí — không mở lần nào", en: "Paid music app — never opened" }, "59.000₫", true],
        ["📗", { vi: "Sách tham khảo", en: "Study book" }, "85.000₫", false],
        ["🛍️", { vi: "Phí giao hàng của 4 đơn lẻ", en: "Delivery fees on 4 separate orders" }, "60.000₫", true],
        ["🍱", { vi: "Cơm trưa", en: "Lunch" }, "175.000₫", false],
      ],
      why: { vi: "Trà sữa mỗi ngày, gói đăng ký không dùng và phí giao hàng lẻ 'âm thầm' lấy đi gần 300.000₫ mỗi tuần.", en: "Daily bubble tea, an unused subscription and separate delivery fees quietly drain nearly 300,000₫ a week." },
      hint: { vi: "Rò rỉ = nhỏ, lặp lại, và không thật sự cần (hoặc có cách rẻ hơn).", en: "A leak = small, repeated, and not really needed (or there's a cheaper way)." },
    },
    {
      t: "slider", q: { vi: "Một ly trà sữa 35.000₫, 5 ngày mỗi tuần. Một năm (52 tuần) tốn khoảng bao nhiêu?", en: "One 35,000₫ bubble tea, 5 days a week. Roughly how much is that in a year (52 weeks)?" },
      art: "🧋 × 5 × 52", min: 0, max: 15000000, step: 100000, start: 2000000, a: 9100000, tol: 300000,
      why: { vi: "35.000₫ × 5 × 52 = 9.100.000₫ — gần bằng một chiếc điện thoại tốt!", en: "35,000₫ × 5 × 52 = 9,100,000₫ — about the price of a good phone!" },
      hint: { vi: "Tính tiền một tuần trước (35.000 × 5), rồi nhân 52.", en: "Work out one week first (35,000 × 5), then multiply by 52." },
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
      why: { vi: "Áp lực bạn bè, 'mua trước trả sau' (vẫn là nợ!) và sự gấp gáp giả tạo là ba chiêu khiến người ta mua theo cảm xúc. Mẹo: đợi 24 giờ.", en: "Peer pressure, 'buy now, pay later' (still debt!) and fake urgency are the three tricks behind impulse buys. Tip: wait 24 hours." },
      hint: { vi: "Tìm câu nào đánh vào cảm xúc: sợ bị bỏ lại, sợ lỡ, hoặc làm bạn quên rằng mình đang vay.", en: "Look for lines that play on feelings: fear of being left out, fear of missing out, or hiding that you're borrowing." },
    },
    {
      t: "mcq", q: { vi: "Tháng này tiền học thêm tăng, 'nhu cầu' chiếm tới 70%. Cách xử lý hợp lý nhất?", en: "Extra-class fees went up this month and 'needs' now take 70%. Most sensible move?" },
      o: [
        { vi: "Giảm phần mong muốn trước, vẫn giữ để dành ít nhất một chút", en: "Cut wants first, and still save at least a little" },
        { vi: "Bỏ hẳn tiết kiệm cho tới khi giàu", en: "Stop saving entirely until you're rich" },
        { vi: "Vay bạn bè cho đủ 30% mong muốn", en: "Borrow from friends to keep wants at 30%" },
        { vi: "Bỏ ngân sách vì nó 'không hợp'", en: "Drop the budget because it 'doesn't fit'" },
      ],
      a: 0,
      why: { vi: "50/30/20 là điểm khởi đầu. Khi nhu cầu tăng, cắt mong muốn trước và giữ thói quen 'trả cho mình trước' — dù chỉ 5–10% — vì thói quen quan trọng hơn con số.", en: "50/30/20 is a starting point. When needs rise, trim wants first and keep the 'pay yourself first' habit — even at 5–10% — because the habit matters more than the exact number." },
      hint: { vi: "Phương án nào vẫn giữ được thói quen tốt mà không tạo nợ mới?", en: "Which option keeps the good habit without creating new debt?" },
    },
    {
      t: "explain", q: { vi: "Giải thích cho em của bạn (1–2 câu): vì sao nên ghi chép chi tiêu, dù chỉ trong 1 tuần?", en: "Explain to a younger sibling (1–2 sentences): why track your spending, even for just one week?" },
      keys: [
        { label: { vi: "Thấy tiền đi đâu", en: "See where money goes" }, words: { vi: ["tiền đi đâu", "đi đâu", "biết mình", "biết được", "thấy rõ", "nắm được", "kiểm soát"], en: ["where", "see", "know", "aware", "control"] } },
        { label: { vi: "Khoản nhỏ cộng dồn / rò rỉ", en: "Small spends add up / leaks" }, words: { vi: ["rò rỉ", "khoản nhỏ", "cộng dồn", "cộng lại", "lặt vặt", "tích tiểu", "nhỏ nhặt"], en: ["leak", "leaks", "small", "add up", "adds up", "little"] } },
        { label: { vi: "Lập kế hoạch / mục tiêu", en: "Plan / goal" }, words: { vi: ["kế hoạch", "mục tiêu", "ngân sách", "tiết kiệm", "để dành"], en: ["plan", "goal", "budget", "save"] } },
      ],
      need: 2,
      model: { vi: "Ghi chép giúp mình thấy tiền thật sự đi đâu — những khoản nhỏ cộng dồn lại thường là chỗ rò rỉ lớn nhất — rồi từ đó lập ngân sách và để dành cho mục tiêu.", en: "Tracking shows where your money really goes — small spends add up to the biggest leaks — so you can make a budget and save for your goals." },
      why: { vi: "Ý chính: thấy rõ dòng tiền → phát hiện rò rỉ → lập kế hoạch tốt hơn.", en: "Key idea: see your cash flow → spot leaks → plan better." },
      hint: { vi: "Nghĩ về: bạn có biết chính xác tuần trước mình tiêu gì không?", en: "Think: do you know exactly what you spent last week?" },
    },
  ],
  deep: [
    {
      t: "learn", art: "🫙🫙🫙 🧠",
      title: { vi: "Kế toán tinh thần & phương pháp 'hũ'", en: "Mental accounting & the jar method" },
      text: {
        vi: "Nhà kinh tế học Richard Thaler (Nobel 2017) chỉ ra con người chia tiền vào các 'tài khoản trong đầu' và đối xử với chúng khác nhau — tiền thưởng thì dễ tiêu hơn tiền lương, dù cùng là tiền. Phương pháp <b>hũ/phong bì</b> dùng chính thiên kiến này một cách có chủ đích. Một cách chặt hơn là <b>ngân sách cơ sở 0</b>: mọi đồng đều được giao 'nhiệm vụ' trước khi tháng bắt đầu.",
        en: "Economist Richard Thaler (Nobel 2017) showed people sort money into 'mental accounts' and treat them differently — bonus money feels easier to spend than salary, though it's the same money. The <b>jar/envelope</b> method uses that bias on purpose. A stricter option is <b>zero-based budgeting</b>: every unit of money gets a 'job' before the month starts.",
      },
    },
    {
      t: "learn", art: "⚙️ → 🐷",
      title: { vi: "Sức mạnh của 'mặc định'", en: "The power of defaults" },
      text: {
        vi: "Nghiên cứu nổi tiếng của Madrian & Shea (2001): khi một công ty Mỹ chuyển sang <b>tự động</b> đăng ký nhân viên mới vào quỹ hưu trí (ai không muốn thì tự rút ra), tỷ lệ tham gia tăng từ khoảng <b>37% lên 86%</b>. Bài học cho bạn: hãy <b>tự động hóa</b> việc để dành ngay ngày nhận tiền, đừng dựa vào ý chí.",
        en: "A famous study by Madrian & Shea (2001): when a US company switched to <b>automatically</b> enrolling new staff in its retirement plan (they could opt out), participation jumped from about <b>37% to 86%</b>. Lesson: <b>automate</b> saving on payday instead of relying on willpower.",
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
  ],
};
export default lesson;
