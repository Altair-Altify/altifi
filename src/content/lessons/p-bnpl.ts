/* Personal finance · P2 — "Is “0% pay later” really free?" (design doc 13.2d, 6-beat frame 13.2c)
 * BNPL, late fees, credit cards, minimum payments, credit score (CIC), collateral.
 * Survey facts used (design doc 1.3 / 13.2d): 6/46 had used buy-now-pay-later; 7/46 thought a credit score = savings.
 * ⚠️ Draft written with AI help — team review. Fees are illustrative (each wallet differs; check a real one's terms);
 * card rate 30%/yr is a typical order of magnitude in Vietnam — verify. All other numbers are computed here. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "p-bnpl",
  domain: "personal",
  icon: "💳",
  ic: "card",
  minutes: 6,
  title: { vi: "“Trả sau 0%” có thật sự 0 đồng?", en: "Is “0% pay later” really free?" },
  desc: {
    vi: "Mua trước trả sau, phí trễ hạn, thẻ tín dụng và cái bẫy 'trả tối thiểu', điểm tín dụng là gì (không phải tiền tiết kiệm!), tài sản thế chấp.",
    en: "Buy now pay later, late fees, credit cards and the 'minimum payment' trap, what a credit score really is (not your savings!), collateral.",
  },
  prereq: { vi: "lãi suất là 'giá' của việc dùng tiền; lãi kép chạy cả với nợ.", en: "interest is the 'price' of using money; compounding works on debt too." },
  review: {
    title: { vi: "Vay & tín dụng", en: "Borrowing & credit" },
    points: [
      { vi: "'Trả sau' và thẻ tín dụng đều là <b>vay</b>.", en: "'Pay later' and credit cards are both <b>borrowing</b>." },
      { vi: "0% chỉ khi trả <b>đúng hạn mọi kỳ</b>; trễ là phí + ghi nợ quá hạn.", en: "0% only if <b>every</b> payment is on time; late means fees + a late record." },
      { vi: "Trả tối thiểu → nợ kéo dài nhiều năm, lãi chồng lãi.", en: "Minimum payments → years of debt, interest on interest." },
      { vi: "Điểm tín dụng = lịch sử vay & trả, KHÔNG phải tiền tiết kiệm.", en: "Credit score = your borrowing & repayment history, NOT your savings." },
    ],
  },
  info: {
    s: { vi: "'Trả sau 0%' là vay: miễn phí chỉ khi trả đúng hạn mọi kỳ. Điểm tín dụng đo lịch sử trả nợ, không đo tiền tiết kiệm.", en: "'0% pay later' is borrowing: free only if every payment is on time. A credit score measures repayment history, not savings." },
    l: {
      vi: "Mua trước trả sau (BNPL) và thẻ tín dụng là hai dạng vay. BNPL thường 0% nếu trả đúng hạn mọi kỳ; công ty kiếm tiền từ phí người bán và phí trễ hạn. Thẻ tín dụng không trả hết dư nợ thì chịu lãi rất cao (khoảng 25–35%/năm); chỉ trả tối thiểu khiến khoản nợ nhỏ kéo dài nhiều năm. Điểm tín dụng (ở Việt Nam do CIC tổng hợp) phản ánh lịch sử vay và trả nợ — trả đúng hạn thì tăng, trễ hạn thì giảm — nó không đo bạn có bao nhiêu tiền tiết kiệm. Khoản vay lớn (nhà, xe) thường cần tài sản thế chấp: không trả được, ngân hàng có quyền lấy tài sản đó.",
      en: "Buy now pay later (BNPL) and credit cards are two kinds of borrowing. BNPL is usually 0% if every instalment is on time; the company earns from shop fees and late fees. A credit card balance you don't pay in full costs a lot (around 25–35% a year); paying only the minimum makes a small debt last for years. A credit score (in Vietnam compiled by the CIC) reflects your borrowing and repayment history — on time pushes it up, late pulls it down — it doesn't measure how much you've saved. Big loans (homes, cars) usually need collateral: if you can't pay, the lender can take it.",
    },
  },
  kb: ["score", "debt", "compound"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "online shopping smartphone payment" }, art: "🎧 1,2tr → 4 × 300k", cap: { vi: "Một nút bấm, không mất đồng nào hôm nay…", en: "One tap, nothing to pay today…" },
      title: { vi: "“Trả sau 0%” có thật sự 0 đồng?", en: "Is “0% pay later” really free?" },
      text: {
        vi: "Tai nghe 1.200.000₫. Ngay dưới nút Mua có dòng: <b>“Mua trước trả sau 0% — chia 4 kỳ, mỗi kỳ 300.000₫”</b>. Không lãi, không mất gì hôm nay. Vậy ai trả tiền cho sự 'miễn phí' này — và khi nào nó hết miễn phí?",
        en: "Headphones: 1,200,000₫. Right under the Buy button: <b>“Buy now, pay later 0% — 4 payments of 300,000₫”</b>. No interest, nothing today. So who pays for this 'free' deal — and when does it stop being free?",
      },
      lion: { vi: "Gợi ý: 'trả sau' nghĩa là bạn đang VAY tiền đấy 🧐", en: "Hint: 'pay later' means you're BORROWING 🧐" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: nợ thẻ tín dụng 5 triệu, lãi 30%/năm, mỗi tháng chỉ trả tối thiểu 200.000₫. Bao nhiêu THÁNG thì hết nợ?", en: "Guess: 5 million of card debt at 30% a year, paying only a 200,000₫ minimum each month. How many MONTHS until it's paid off?" },
      art: "💳 5.000.000₫ · −200k/tháng", min: 1, max: 60, step: 1, start: 25, actual: 40, unit: "num",
      reveal: { vi: "Khoảng <b>40 tháng</b> — hơn 3 năm — và bạn trả tổng ~7,9 triệu: gần 3 triệu tiền lãi cho khoản nợ 5 triệu. Nhiều người đoán 25 tháng (5tr ÷ 200k) vì quên rằng mỗi tháng lãi ăn mất 125k trong 200k bạn trả.", en: "About <b>40 months</b> — over 3 years — and you pay ~7.9 million in total: almost 3 million of interest on a 5-million debt. Many guess 25 months (5M ÷ 200k), forgetting that interest eats 125k of every 200k you pay." },
    },
    /* 3 · Mechanism */
    {
      t: "learn", art: "🛍️ BNPL · 💳 Thẻ · = VAY",
      title: { vi: "Hai kiểu vay trong túi bạn", en: "Two kinds of borrowing in your pocket" },
      text: {
        vi: "<b>Mua trước trả sau (BNPL):</b> chia món hàng thành vài kỳ. 0% <b>chỉ khi</b> mọi kỳ đúng hạn; trễ là phí trễ hạn và bị ghi nhận nợ quá hạn. Công ty kiếm tiền từ phí người bán (vì bạn mua nhiều hơn) và phí trễ hạn.<br><b>Thẻ tín dụng:</b> trả hết dư nợ trong hạn thì không lãi; còn nợ thì chịu lãi rất cao, khoảng <b>25–35%/năm</b>, và lãi chồng lên lãi mỗi tháng.",
        en: "<b>Buy now, pay later (BNPL):</b> split a purchase into a few payments. 0% <b>only if</b> every payment is on time; late means a fee and a late-payment record. The company earns from shop fees (you buy more) and late fees.<br><b>Credit card:</b> pay the full balance on time and there's no interest; leave a balance and you pay a lot, around <b>25–35% a year</b>, with interest on interest every month.",
      },
    },
    {
      t: "slider", q: { vi: "Vẫn nợ thẻ 5 triệu, lãi 30%/năm (2,5%/tháng). Mỗi tháng phải trả khoảng bao nhiêu để hết nợ trong <b>12 tháng</b>?", en: "Same 5-million card debt at 30% a year (2.5% a month). About how much a month to clear it in <b>12 months</b>?" },
      art: "💳 → 0 trong 12 tháng", min: 100000, max: 1000000, step: 10000, start: 200000, a: 490000, tol: 20000,
      why: { vi: "Khoảng 487.000₫/tháng, tổng ~5,85 triệu (lãi ~850k). So với trả tối thiểu 200k: 40 tháng và ~2,9 triệu lãi. Trả nhiều hơn mức tối thiểu là cách 'đầu tư' lãi cao nhất bạn có.", en: "About 487,000₫ a month, ~5.85 million in total (~850k interest). Versus the 200k minimum: 40 months and ~2.9 million of interest. Paying more than the minimum is the best-returning 'investment' you have." },
      hint: { vi: "5 triệu ÷ 12 ≈ 417k mới chỉ là gốc — còn phải cộng lãi mỗi tháng.", en: "5M ÷ 12 ≈ 417k is just the principal — add each month's interest on top." },
    },
    {
      t: "calc", q: { vi: "Tai nghe 1.200.000₫ chia 4 kỳ, mỗi kỳ 300.000₫. Bạn trễ hạn 2 kỳ, phí trễ 60.000₫ mỗi lần (giả định).", en: "1,200,000₫ headphones in 4 payments of 300,000₫. You're late twice, with a 60,000₫ fee each time (assumed)." },
      art: "🎧 4 × 300k + ⏰⏰",
      parts: [
        { label: { vi: "Tổng số tiền bạn đã trả (₫)", en: "Total you paid (₫)" }, a: 1320000, tol: 0, unit: "₫" },
        { label: { vi: "Phí trễ bằng bao nhiêu % giá tai nghe?", en: "Late fees as a % of the price?" }, a: 10, tol: 0.1, unit: "%" },
      ],
      why: { vi: "1.200.000 + 2 × 60.000 = 1.320.000₫ → thêm 10%, chỉ trong vài tháng. 'Miễn phí' biến thành một khoản vay đắt — và lịch sử trễ hạn còn theo bạn.", en: "1,200,000 + 2 × 60,000 = 1,320,000₫ → 10% extra in just a few months. 'Free' became an expensive loan — and the late record stays with you." },
      hint: { vi: "Bước 2: 120.000 ÷ 1.200.000.", en: "Step 2: 120,000 ÷ 1,200,000." },
    },
    {
      t: "sort", q: { vi: "Điều này làm điểm tín dụng của bạn thế nào?", en: "What does this do to your credit score?" },
      buckets: [["⬆️", { vi: "Tăng", en: "Up" }], ["⬇️", { vi: "Giảm", en: "Down" }], ["➖", { vi: "Không liên quan", en: "Not related" }]],
      items: [
        ["✅", { vi: "Trả đúng hạn mọi kỳ trong 1 năm", en: "Paying every instalment on time for a year" }, 0],
        ["⏰", { vi: "Trễ hạn 2 kỳ 'trả sau'", en: "Two late 'pay later' payments" }, 1],
        ["🐷", { vi: "Có 50 triệu trong sổ tiết kiệm", en: "Having 50 million in savings" }, 2],
        ["📄", { vi: "Mở 5 khoản vay mới trong 1 tháng", en: "Opening 5 new loans in one month" }, 1],
        ["🎓", { vi: "Điểm thi học kỳ cao", en: "Great exam results" }, 2],
        ["💳", { vi: "Dùng thẻ ít so với hạn mức và trả hết mỗi tháng", en: "Using little of your card limit and paying it off each month" }, 0],
      ],
      why: { vi: "Điểm tín dụng đo <b>cách bạn vay và trả</b>: đúng hạn, dùng ít so với hạn mức → tăng; trễ hạn, vay dồn dập → giảm. Tiền tiết kiệm hay điểm thi không nằm trong đó.", en: "A credit score measures <b>how you borrow and repay</b>: on time, low use of your limit → up; late payments, lots of new loans at once → down. Savings and exam marks aren't part of it." },
      hint: { vi: "Hỏi: điều này có nói gì về việc bạn trả nợ đúng hạn không?", en: "Ask: does it say anything about paying debts on time?" },
    },
    /* 4 · The real story (team survey) */
    {
      t: "chart", q: { vi: "Khảo sát của nhóm với 46 bạn 14–17 tuổi. Khoảng bao nhiêu bạn đã từng dùng 'mua trước trả sau'?", en: "Our team surveyed 46 teens aged 14–17. Roughly how many had already used 'buy now, pay later'?" },
      chart: {
        kind: "bar",
        labels: [{ vi: "Đã dùng 'trả sau'", en: "Used 'pay later'" }, { vi: "Nhầm điểm tín dụng", en: "Got credit score wrong" }],
        series: [{ name: { vi: "số bạn (trên 46)", en: "teens (out of 46)" }, color: "#F7867A", data: [6, 7] }],
        source: { vi: "Khảo sát của nhóm Altair (46 học sinh)", en: "Team Altair survey (46 students)" },
      },
      o: [{ vi: "Khoảng 1 trên 8 bạn", en: "About 1 in 8" }, { vi: "Gần như không ai", en: "Almost nobody" }, { vi: "Một nửa", en: "Half" }, { vi: "Hầu hết", en: "Most" }],
      a: 0,
      why: { vi: "6/46 ≈ 13% — dù chưa có thu nhập. Và 7 bạn nghĩ điểm tín dụng là số tiền mình đang có. 'Trả sau' đã đến với teen trước khi kiến thức về nợ kịp đến.", en: "6/46 ≈ 13% — before they even have an income. And 7 thought a credit score is how much money you have. 'Pay later' reaches teens before knowledge about debt does." },
      hint: { vi: "6 chia 46 là bao nhiêu?", en: "What is 6 divided by 46?" },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Điểm tín dụng là gì?", en: "What is a credit score?" },
      o: [
        { vi: "Số tiền bạn đang có trong tài khoản tiết kiệm", en: "How much money you have in savings" },
        { vi: "Đánh giá lịch sử vay và trả nợ của bạn", en: "A rating of your borrowing and repayment history" },
        { vi: "Mức lương của bạn", en: "Your salary" },
        { vi: "Số thẻ ngân hàng bạn có", en: "How many bank cards you have" },
      ],
      a: 1,
      why: { vi: "Bẫy phổ biến — 7/46 bạn trong khảo sát chọn 'tiền tiết kiệm'. Một người rất giàu nhưng hay trễ hạn vẫn có điểm thấp; một người ít tiền nhưng luôn trả đúng hạn có điểm tốt. Ở Việt Nam, Trung tâm Thông tin Tín dụng (CIC) lưu lịch sử này nhiều năm.", en: "Classic trap — 7 of 46 teens in our survey picked 'savings'. A rich person who pays late can have a low score; someone with little money who always pays on time can have a good one. In Vietnam the Credit Information Centre (CIC) keeps this history for years." },
      hint: { vi: "Tên gọi có chữ 'tín' — tin tưởng rằng bạn sẽ trả.", en: "'Credit' comes from 'trust' — trust that you'll pay back." },
    },
    {
      t: "learn", art: "🏠🔑 → 🏦",
      title: { vi: "Tài sản thế chấp", en: "Collateral" },
      text: {
        vi: "Khi vay lớn — mua nhà, mua xe — ngân hàng thường yêu cầu <b>tài sản thế chấp</b>: chính căn nhà, chiếc xe (hoặc tài sản khác). Nếu bạn không trả được, ngân hàng có quyền lấy tài sản đó để thu hồi nợ. Vì vậy vay mua nhà có lãi thấp hơn thẻ tín dụng: rủi ro của ngân hàng thấp hơn. Còn 'trả sau' và thẻ tín dụng thì không có gì đảm bảo — nên phí và lãi cao.",
        en: "For big loans — a home, a car — the bank usually asks for <b>collateral</b>: the home or car itself (or another asset). If you can't pay, the bank can take it to get its money back. That's why a mortgage has a lower rate than a credit card: less risk for the bank. 'Pay later' and cards have nothing behind them — so fees and rates are high.",
      },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: bạn thân muốn mua điện thoại 9 triệu bằng 'trả sau 0%' chia 4 tháng, dù tiền tiêu vặt chỉ 1,5 triệu/tháng. Khuyên bạn ấy 1–2 câu.", en: "Final boss: your best friend wants a 9-million phone with '0% pay later' over 4 months, though their pocket money is 1.5 million a month. Advise them in 1–2 sentences." },
      keys: [
        { label: { vi: "Không trả nổi mỗi kỳ", en: "Can't afford each payment" }, words: { vi: ["2,25", "2.25", "không đủ", "không trả nổi", "trả không nổi", "nhiều hơn", "vượt", "1,5"], en: ["2.25", "can't afford", "not enough", "more than", "1.5"] } },
        { label: { vi: "Trễ hạn → phí / nợ", en: "Late → fees / debt" }, words: { vi: ["trễ", "phí", "nợ", "vay", "quá hạn"], en: ["late", "fee", "debt", "borrow", "overdue"] } },
        { label: { vi: "Điểm tín dụng / lịch sử", en: "Credit score / history" }, words: { vi: ["điểm tín dụng", "tín dụng", "lịch sử", "cic"], en: ["credit score", "credit", "history", "cic"] } },
        { label: { vi: "Để dành / mua rẻ hơn", en: "Save up / cheaper" }, words: { vi: ["để dành", "tiết kiệm", "rẻ hơn", "đợi", "chờ"], en: ["save", "cheaper", "wait"] } },
      ],
      need: 2,
      model: { vi: "Mỗi kỳ 2,25 triệu mà tiền tiêu vặt chỉ 1,5 triệu nên gần như chắc chắn sẽ trễ hạn — mất phí và xấu điểm tín dụng; tốt hơn là để dành vài tháng hoặc mua máy rẻ hơn.", en: "Each payment is 2.25 million but pocket money is only 1.5 million, so being late is almost certain — fees and a damaged credit score; better to save up for a few months or buy a cheaper phone." },
      why: { vi: "Ý chính: tính khoản trả mỗi kỳ so với thu nhập → trễ hạn có giá → có lựa chọn khác.", en: "Key idea: compare each payment with income → being late has a cost → there are other options." },
      hint: { vi: "9 triệu ÷ 4 kỳ = bao nhiêu mỗi tháng? So với 1,5 triệu.", en: "9 million ÷ 4 = how much a month? Compare with 1.5 million." },
    },
    {
      t: "learn", art: "🧮 📅 🧠",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Trước khi bấm 'trả sau' hay quẹt thẻ:", en: "Before tapping 'pay later' or using a card:" },
      items: [
        ["🧮", { vi: "Cộng mọi kỳ trả góp vào ngân sách tháng — vẫn đủ cho phần 'Cần' không?", en: "Add every instalment to your monthly budget — is 'Need' still covered?" }],
        ["📅", { vi: "Đặt nhắc lịch trước hạn trả 2 ngày", en: "Set a reminder 2 days before each due date" }],
        ["🧠", { vi: "Chỉ trả sau cho thứ thật sự cần — không cho món 'cả lớp có'", en: "Only pay later for real needs — not for 'everyone has one'" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Thẻ tín dụng & điểm tín dụng ở Ngân hàng — trễ hạn là điểm tụt thật!", en: "🎮 Unlocked in the game: credit card & credit score at the Bank — pay late and your score really drops!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "(1 + 2,5%)¹² − 1 ≈ 34,5%", fs: 24,
      title: { vi: "Lãi danh nghĩa và lãi thực trả (APR vs EAR)", en: "Stated vs effective rates (APR vs EAR)" },
      text: {
        vi: "Thẻ ghi '30%/năm' thường nghĩa là <b>2,5% mỗi tháng</b>. Nhưng vì lãi tháng này cộng vào nợ và tháng sau lại bị tính lãi, mức lãi <b>thực trả</b> sau một năm là (1 + 0,025)¹² − 1 ≈ <b>34,5%</b>. Luôn hỏi: lãi tính theo kỳ nào, có ghép lãi không, và có phí nào khác (phí thường niên, phí rút tiền mặt)?",
        en: "A card that says '30% a year' usually means <b>2.5% a month</b>. Because this month's interest joins the debt and gets charged interest next month, the <b>effective</b> rate over a year is (1 + 0.025)¹² − 1 ≈ <b>34.5%</b>. Always ask: per what period, is it compounded, and what other fees are there (annual fee, cash-withdrawal fee)?",
      },
    },
    {
      t: "calc", q: { vi: "Tính theo lãi ghép hằng tháng:", en: "Using monthly compounding:" },
      parts: [
        { label: { vi: "Lãi mỗi tháng khi thẻ ghi 24%/năm (%)", en: "Monthly rate when the card says 24% a year (%)" }, a: 2, tol: 0, unit: "%" },
        { label: { vi: "Lãi thực trả sau 1 năm (%, 1 chữ số thập phân)", en: "Effective annual rate (%, 1 decimal)" }, a: 26.8, tol: 0.1, unit: "%" },
        { label: { vi: "Theo quy tắc 72, nợ 24%/năm không trả gấp đôi sau bao nhiêu năm?", en: "Rule of 72: unpaid debt at 24% a year doubles in how many years?" }, a: 3, tol: 0, unit: { vi: "năm", en: "years" } },
      ],
      why: { vi: "24 ÷ 12 = 2%/tháng. 1,02¹² − 1 = 26,8%. 72 ÷ 24 = 3 năm.", en: "24 ÷ 12 = 2% a month. 1.02¹² − 1 = 26.8%. 72 ÷ 24 = 3 years." },
      hint: { vi: "Bước 2: (1 + 0,02) mũ 12, trừ 1.", en: "Step 2: (1 + 0.02) to the 12th power, minus 1." },
    },
    {
      t: "mcq", q: { vi: "Một ví điện tử cho 'trả sau 0%' mà vẫn có lời. Chủ yếu nhờ đâu?", en: "A wallet offers '0% pay later' and still makes money. Mainly how?" },
      o: [
        { vi: "Người bán trả phí (vì khách mua nhiều hơn) + phí trễ hạn của người dùng", en: "Shops pay a fee (customers buy more) + users' late fees" },
        { vi: "Nhà nước trả tiền lãi thay người mua", en: "The government pays the interest for buyers" },
        { vi: "Nó chịu lỗ mãi mãi để làm từ thiện", en: "It loses money forever as charity" },
        { vi: "Lãi được giấu trong giá điện thoại của mọi cửa hàng", en: "The interest is hidden in every shop's phone prices" },
      ],
      a: 0,
      why: { vi: "Mô hình BNPL: người bán chấp nhận trả phí vì 'trả sau' làm khách mua nhiều và đắt hơn; người dùng trễ hạn trả phí. Càng nhiều người mua quá sức, công ty càng có lời.", en: "The BNPL model: shops accept a fee because 'pay later' makes people buy more and pricier things; late users pay fees. The more people over-buy, the more the company earns." },
    },
  ],
};
export default lesson;
