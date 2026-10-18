/* Personal finance · P5 — "A 10-million salary — how much do I take home?" (design doc 13.2d ①, 6-beat frame 13.2c)
 * Gross vs net, compulsory insurance (employee: 8% social, 1.5% health, 1% unemployment = 10.5%), personal income tax
 * after deductions, when insurance is worth it, emergency fund of 3–6 months. Trap: "contract salary = money in account".
 * ⚠️ Draft written with AI help — team review. VERIFY before submission: the 10.5% employee insurance rates; the personal
 * and dependant deductions and PIT brackets — Vietnam's PIT rules were being changed in 2025–26, so the lesson avoids
 * quoting a specific deduction amount and only shows that a 10M salary pays no PIT after deductions. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "p-salary",
  domain: "personal",
  icon: "💼",
  ic: "banknote",
  minutes: 6,
  title: { vi: "Lương 10 triệu, cầm về được bao nhiêu?", en: "A 10-million salary — how much do I take home?" },
  desc: {
    vi: "Lương gộp và thực nhận, bảo hiểm bắt buộc, thuế thu nhập cá nhân, khi nào nên mua bảo hiểm, và quỹ khẩn cấp 3–6 tháng.",
    en: "Gross vs take-home pay, compulsory insurance, personal income tax, when insurance is worth it, and a 3–6-month emergency fund.",
  },
  prereq: { vi: "ngân sách Cần · Muốn · Tương lai (bài P1).", en: "the Need · Want · Future budget (lesson P1)." },
  review: {
    title: { vi: "Lương & bảo hiểm", en: "Pay & insurance" },
    points: [
      { vi: "Lương <b>gộp</b> (trên hợp đồng) − bảo hiểm bắt buộc − thuế = <b>thực nhận</b>.", en: "<b>Gross</b> pay (in the contract) − compulsory insurance − tax = <b>take-home</b>." },
      { vi: "Người lao động đóng ~10,5%: BHXH 8%, BHYT 1,5%, BHTN 1%.", en: "Employees pay ~10.5%: social 8%, health 1.5%, unemployment 1%." },
      { vi: "Thuế TNCN chỉ tính trên phần thu nhập vượt các khoản giảm trừ.", en: "Income tax only applies to income above the deductions." },
      { vi: "Bảo hiểm là để chuyện xấu hiếm mà lớn không xóa sạch tiền của bạn.", en: "Insurance stops rare-but-big bad events from wiping you out." },
    ],
  },
  info: {
    s: { vi: "Thực nhận = lương gộp − bảo hiểm bắt buộc (~10,5%) − thuế TNCN (nếu thu nhập vượt mức giảm trừ).", en: "Take-home = gross − compulsory insurance (~10.5%) − income tax (if income exceeds the deductions)." },
    l: {
      vi: "Con số trên hợp đồng là lương gộp. Mỗi tháng người lao động đóng bảo hiểm bắt buộc khoảng 10,5% (bảo hiểm xã hội 8% cho lương hưu và ốm đau, bảo hiểm y tế 1,5%, bảo hiểm thất nghiệp 1%); doanh nghiệp còn đóng thêm phần của họ. Thuế thu nhập cá nhân chỉ tính trên phần thu nhập còn lại sau khi trừ bảo hiểm và các khoản giảm trừ gia cảnh, theo biểu thuế lũy tiến — người lương thấp thường không phải nộp. Bảo hiểm tự nguyện đáng mua khi rủi ro hiếm nhưng thiệt hại lớn (ốm nặng, tai nạn); quỹ khẩn cấp 3–6 tháng chi tiêu lo những chuyện nhỏ hơn.",
      en: "The number in your contract is gross pay. Each month employees pay about 10.5% in compulsory insurance (8% social insurance for pensions and sick pay, 1.5% health, 1% unemployment); the employer pays its own share on top. Personal income tax only applies to what's left after insurance and family deductions, on a progressive scale — low earners usually pay none. Voluntary insurance is worth it for rare but costly risks (serious illness, accidents); an emergency fund of 3–6 months of spending covers smaller shocks.",
    },
  },
  kb: ["budget", "emergency"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "office worker salary payslip" }, art: "📄 10.000.000₫ → 🏦 ?", cap: { vi: "Hợp đồng nói 10 triệu. Tài khoản nói…?", en: "The contract says 10 million. The bank account says…?" },
      title: { vi: "Lương 10 triệu, cầm về được bao nhiêu?", en: "A 10-million salary — how much do I take home?" },
      text: {
        vi: "Anh Tuấn vừa ký hợp đồng việc đầu tiên: <b>lương 10.000.000₫/tháng</b>. Anh tính ngay: thuê trọ 3 triệu, ăn 3 triệu, còn 4 triệu để dành. Ngày lương về, tài khoản báo một con số khác. Hụt bao nhiêu, đi đâu — và có phải tiền 'mất' không?",
        en: "Tuấn just signed his first job contract: <b>10,000,000₫ a month</b>. He plans right away: rent 3 million, food 3 million, save 4 million. On payday, his account shows a different number. How much is missing, where did it go — and is it really 'lost'?",
      },
      lion: { vi: "Đọc kỹ chữ “lương gộp” và “thực nhận” trên mọi lời mời làm việc nhé 🧾", en: "Look for “gross” and “take-home” in every job offer 🧾" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: lương gộp 10 triệu. Sau bảo hiểm bắt buộc và thuế, anh Tuấn thực nhận bao nhiêu?", en: "Guess: 10 million gross. After compulsory insurance and tax, what does Tuấn actually receive?" },
      art: "📄 10tr → 🏦 ?", min: 7000000, max: 10000000, step: 50000, start: 10000000, actual: 8950000, unit: "vnd",
      reveal: { vi: "<b>8.950.000₫</b>. Bảo hiểm bắt buộc 10,5% = 1.050.000₫; với mức lương này, sau các khoản giảm trừ anh chưa phải nộp thuế thu nhập cá nhân. Kế hoạch 'để dành 4 triệu' thật ra chỉ còn gần 3 triệu.", en: "<b>8,950,000₫</b>. Compulsory insurance of 10.5% = 1,050,000₫; at this pay, after deductions, he owes no income tax yet. His 'save 4 million' plan is really closer to 3 million." },
    },
    /* 3 · Mechanism */
    {
      t: "statement", q: { vi: "Phiếu lương tháng đầu của anh Tuấn. Khoản trừ nào lớn nhất?", en: "Tuấn's first payslip. Which deduction is the biggest?" },
      sheets: [{ title: { vi: "Phiếu lương · tháng 1 (₫)", en: "Payslip · month 1 (₫)" }, rows: [
        { l: { vi: "Lương gộp (theo hợp đồng)", en: "Gross pay (per contract)" }, v: 10000000, bold: true },
        { l: { vi: "− Bảo hiểm xã hội 8%", en: "− Social insurance 8%" }, v: -800000, sub: true },
        { l: { vi: "− Bảo hiểm y tế 1,5%", en: "− Health insurance 1.5%" }, v: -150000, sub: true },
        { l: { vi: "− Bảo hiểm thất nghiệp 1%", en: "− Unemployment insurance 1%" }, v: -100000, sub: true },
        { l: { vi: "− Thuế thu nhập cá nhân", en: "− Personal income tax" }, v: 0, sub: true },
        { l: { vi: "= Thực nhận", en: "= Take-home pay" }, v: 8950000, bold: true },
      ], note: { vi: "Doanh nghiệp còn tự đóng thêm phần bảo hiểm của họ — không trừ vào lương bạn.", en: "The employer also pays its own insurance share — not taken from your pay." } }],
      o: [{ vi: "Bảo hiểm xã hội", en: "Social insurance" }, { vi: "Bảo hiểm y tế", en: "Health insurance" }, { vi: "Thuế thu nhập cá nhân", en: "Income tax" }, { vi: "Bảo hiểm thất nghiệp", en: "Unemployment insurance" }],
      a: 0,
      why: { vi: "Bảo hiểm xã hội 8% (800k) — nhưng đó không phải tiền mất: nó là lương hưu sau này, tiền ốm đau, thai sản. Bảo hiểm thất nghiệp trả trợ cấp nếu bạn mất việc; bảo hiểm y tế chi trả khám chữa bệnh.", en: "Social insurance at 8% (800k) — but it isn't lost: it's your future pension, sick pay and maternity pay. Unemployment insurance pays out if you lose your job; health insurance covers medical care." },
      hint: { vi: "So các dòng có dấu trừ.", en: "Compare the lines with a minus sign." },
    },
    {
      t: "calc", q: { vi: "Chị Mai được mời làm với lương gộp 15.000.000₫ (giả sử chưa phải nộp thuế).", en: "Mai is offered 15,000,000₫ gross (assume no income tax yet)." },
      parts: [
        { label: { vi: "Bảo hiểm bắt buộc chị đóng mỗi tháng (₫)", en: "Compulsory insurance she pays per month (₫)" }, a: 1575000, tol: 0, unit: "₫" },
        { label: { vi: "Thực nhận mỗi tháng (₫)", en: "Take-home per month (₫)" }, a: 13425000, tol: 0, unit: "₫" },
        { label: { vi: "Quỹ khẩn cấp 3 tháng nếu chi tiêu 9 triệu/tháng (₫)", en: "3-month emergency fund if she spends 9 million a month (₫)" }, a: 27000000, tol: 0, unit: "₫" },
      ],
      why: { vi: "15 triệu × 10,5% = 1.575.000₫. 15.000.000 − 1.575.000 = 13.425.000₫. Quỹ khẩn cấp tính theo CHI TIÊU, không theo lương: 9 × 3 = 27 triệu.", en: "15M × 10.5% = 1,575,000₫. 15,000,000 − 1,575,000 = 13,425,000₫. An emergency fund is based on SPENDING, not pay: 9 × 3 = 27 million." },
      hint: { vi: "10,5% = 10% + 0,5%.", en: "10.5% = 10% + 0.5%." },
    },
    {
      t: "learn", art: "📊 0% → 5% → 10% → …",
      title: { vi: "Thuế thu nhập cá nhân: chỉ tính trên phần vượt", en: "Income tax: only on the part above" },
      text: {
        vi: "Thuế TNCN ở Việt Nam là <b>lũy tiến từng phần</b>: lấy thu nhập trừ bảo hiểm bắt buộc, trừ <b>giảm trừ gia cảnh</b> (cho bản thân và mỗi người phụ thuộc như con nhỏ), phần còn lại mới chia thành các bậc với thuế suất tăng dần. Thu nhập tăng lên bậc mới thì chỉ <b>phần vượt</b> chịu thuế suất cao hơn — không có chuyện 'tăng lương mà cầm về ít hơn'. (Mức giảm trừ và biểu thuế được Nhà nước điều chỉnh theo thời gian — hãy tra mức hiện hành.)",
        en: "Vietnam's personal income tax is <b>progressive by slice</b>: take income, subtract compulsory insurance and the <b>family deductions</b> (for yourself and each dependant such as a child); only what's left is split into brackets with rising rates. Moving into a higher bracket taxes only the <b>part above</b> it at the higher rate — a raise never shrinks your take-home pay. (Deduction amounts and brackets are updated over time — check the current ones.)",
      },
    },
    /* 4 · The real story */
    {
      t: "pick", q: { vi: "Anh Tuấn 23 tuổi, khỏe mạnh, có bảo hiểm y tế bắt buộc. Nên ưu tiên MUA THÊM bảo hiểm nào trước?", en: "Tuấn is 23, healthy, with compulsory health insurance. Which extra insurance should he buy first?" },
      opts: [["📱", { vi: "Bảo hiểm màn hình điện thoại 100k/tháng", en: "Phone-screen insurance, 100k a month" }], ["🚑", { vi: "Bảo hiểm tai nạn & bệnh hiểm nghèo (phí thấp, chi trả lớn)", en: "Accident & critical-illness cover (low premium, big payout)" }], ["💎", { vi: "Bảo hiểm 'tiết kiệm' 2 triệu/tháng, cam kết lãi cao", en: "A 2-million-a-month 'savings' policy with high promised returns" }], ["🙅", { vi: "Không cần gì, còn trẻ mà", en: "Nothing, he's young" }]],
      a: 1,
      why: { vi: "Bảo hiểm đáng nhất cho rủi ro <b>hiếm nhưng thiệt hại lớn</b> mà quỹ khẩn cấp không gánh nổi. Màn hình vỡ là rủi ro nhỏ — tự gánh bằng quỹ khẩn cấp rẻ hơn. Gói 'tiết kiệm' phí cao thường khó rút và lợi nhuận thấp hơn quảng cáo — đọc kỹ trước khi ký (nhớ chuyện 'sản phẩm tiết kiệm tại quầy' 2022).", en: "Insurance is best for <b>rare but costly</b> risks your emergency fund can't cover. A cracked screen is small — cheaper to cover from your own fund. Expensive 'savings' policies are often hard to exit and return less than advertised — read carefully before signing (remember the 2022 'savings product at the counter')." },
      hint: { vi: "Chuyện nào hiếm xảy ra nhưng nếu xảy ra thì bạn không tự trả nổi?", en: "Which event is rare but, if it happens, you couldn't pay for yourself?" },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Hai lời mời làm việc: A “lương 12 triệu (gộp)”, B “lương 11 triệu thực nhận, công ty đóng đủ bảo hiểm”. Cái nào cầm về nhiều hơn?", en: "Two job offers: A “12 million (gross)”, B “11 million take-home, company pays all insurance properly”. Which puts more in your account?" },
      o: [
        { vi: "B — vì A sau 10,5% bảo hiểm chỉ còn khoảng 10,74 triệu", en: "B — A is only about 10.74 million after 10.5% insurance" },
        { vi: "A — vì 12 lớn hơn 11", en: "A — because 12 is bigger than 11" },
        { vi: "Bằng nhau", en: "The same" },
        { vi: "Không so được", en: "Can't compare" },
      ],
      a: 0,
      why: { vi: "Bẫy 'lương trên hợp đồng = tiền về tài khoản'. 12 × (1 − 10,5%) = 10,74 triệu < 11 triệu. Luôn hỏi: con số này là gộp hay thực nhận? Có đóng bảo hiểm không?", en: "The 'contract salary = money in account' trap. 12 × (1 − 10.5%) = 10.74 million < 11 million. Always ask: is this gross or take-home? Is insurance paid?" },
      hint: { vi: "Tính thực nhận của A trước.", en: "Work out A's take-home first." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: bạn của bạn sắp đi làm thêm, chủ quán nói “trả 4 triệu, không đóng bảo hiểm gì cho gọn”. Khuyên bạn ấy 1–2 câu cần hỏi/cân nhắc gì.", en: "Final boss: a friend is starting a part-time job; the boss says “4 million, no insurance, keeps it simple”. Advise them in 1–2 sentences on what to ask or weigh." },
      keys: [
        { label: { vi: "Gộp hay thực nhận / hợp đồng", en: "Gross or net / contract" }, words: { vi: ["gộp", "thực nhận", "hợp đồng", "giấy tờ", "ghi rõ"], en: ["gross", "take-home", "net", "contract", "in writing"] } },
        { label: { vi: "Bảo hiểm / quyền lợi", en: "Insurance / benefits" }, words: { vi: ["bảo hiểm", "ốm", "tai nạn", "quyền lợi", "y tế"], en: ["insurance", "sick", "accident", "benefits", "health"] } },
        { label: { vi: "Rủi ro / quỹ khẩn cấp", en: "Risk / emergency fund" }, words: { vi: ["rủi ro", "quỹ khẩn cấp", "để dành", "dự phòng", "thiệt"], en: ["risk", "emergency fund", "save", "buffer", "lose"] } },
      ],
      need: 2,
      model: { vi: "Hỏi rõ 4 triệu là gộp hay thực nhận và xin ghi vào hợp đồng; không có bảo hiểm thì nếu ốm hay tai nạn bạn tự chịu hết, nên tự để dành quỹ khẩn cấp hoặc cân nhắc bảo hiểm tai nạn.", en: "Ask whether the 4 million is gross or take-home and get it in writing; with no insurance you bear the full cost of illness or accidents, so build your own emergency fund or consider accident cover." },
      why: { vi: "Ý chính: con số trên lời mời chưa phải tiền về tay; bảo hiểm là quyền lợi, thiếu nó thì rủi ro dồn về bạn.", en: "Key idea: the number in an offer isn't money in hand; insurance is a benefit — without it, the risk falls on you." },
      hint: { vi: "Hai câu hỏi: con số đó là gì? nếu có chuyện thì ai trả?", en: "Two questions: what is that number? if something happens, who pays?" },
    },
    {
      t: "learn", art: "📄 🔎 🧮",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Lần đầu xem một lời mời làm việc (kể cả làm thêm):", en: "The first time you read a job offer (even part-time):" },
      items: [
        ["🔎", { vi: "Tìm chữ 'gộp' hay 'thực nhận' — không có thì hỏi", en: "Look for 'gross' or 'take-home' — if missing, ask" }],
        ["🧮", { vi: "Lập ngân sách bằng tiền THỰC NHẬN, không bằng con số trên hợp đồng", en: "Budget with TAKE-HOME pay, not the contract number" }],
        ["☂️", { vi: "Đặt mục tiêu quỹ khẩn cấp = 3 tháng chi tiêu", en: "Set an emergency-fund goal = 3 months of spending" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: việc làm có lương ở Công ty và bảo hiểm ở Phòng khám — lương trong game cũng là thực nhận sau 10,5% bảo hiểm!", en: "🎮 Unlocked in the game: a paid job at the Office and insurance at the Clinic — in-game pay is take-home after 10.5% insurance too!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "🏢 + 👤 = 💰 lương hưu", fs: 26,
      title: { vi: "Chi phí thật của một nhân viên", en: "What an employee really costs" },
      text: {
        vi: "Ngoài phần 10,5% của người lao động, doanh nghiệp còn đóng thêm khoảng <b>21,5%</b> trên lương cho bảo hiểm xã hội, y tế, thất nghiệp (tỷ lệ cụ thể theo quy định hiện hành ⚠️). Vì vậy một nhân viên lương gộp 10 triệu thực ra tốn của công ty hơn 12 triệu. Đó là lý do một số nơi rủ người lao động 'không đóng bảo hiểm cho cả hai bên đỡ tốn' — và người lao động mất quyền lợi lâu dài.",
        en: "On top of the employee's 10.5%, the employer pays roughly another <b>21.5%</b> of salary for social, health and unemployment insurance (exact rates per current rules ⚠️). So an employee on 10 million gross really costs the company over 12 million. That's why some employers suggest 'skip insurance, save us both money' — and the worker loses long-term benefits.",
      },
    },
    {
      t: "calc", q: { vi: "Lương gộp 10.000.000₫; người lao động đóng 10,5%, doanh nghiệp đóng thêm 21,5% (giả định).", en: "Gross 10,000,000₫; employee pays 10.5%, employer adds 21.5% (assumed)." },
      parts: [
        { label: { vi: "Tổng chi phí doanh nghiệp bỏ ra cho nhân viên này (₫)", en: "Total the company spends on this employee (₫)" }, a: 12150000, tol: 0, unit: "₫" },
        { label: { vi: "Tổng tiền đóng vào các quỹ bảo hiểm mỗi tháng (₫)", en: "Total paid into the insurance funds per month (₫)" }, a: 3200000, tol: 0, unit: "₫" },
      ],
      why: { vi: "10 + 2,15 = 12,15 triệu. Vào quỹ: 1,05 + 2,15 = 3,2 triệu/tháng — đây là 'khoản tiết kiệm bắt buộc' cho lương hưu và rủi ro của bạn.", en: "10 + 2.15 = 12.15 million. Into the funds: 1.05 + 2.15 = 3.2 million a month — a 'compulsory saving' for your pension and risks." },
    },
    {
      t: "mcq", q: { vi: "Vì sao bảo hiểm có thể có lời cho công ty bảo hiểm mà vẫn có ích cho người mua?", en: "How can insurance be profitable for the insurer and still useful for buyers?" },
      o: [
        { vi: "Nhiều người cùng góp phí nhỏ; chỉ số ít gặp chuyện được chi trả lớn — rủi ro được chia sẻ", en: "Many people pay small premiums; only the few who suffer get big payouts — the risk is pooled" },
        { vi: "Vì ai mua bảo hiểm cũng chắc chắn được lời", en: "Because every buyer is guaranteed a profit" },
        { vi: "Vì Nhà nước trả hết phí", en: "Because the government pays every premium" },
        { vi: "Vì không ai bao giờ gặp tai nạn", en: "Because nobody ever has accidents" },
      ],
      a: 0,
      why: { vi: "Bảo hiểm là chia sẻ rủi ro: trung bình người mua trả nhiều hơn nhận lại (đó là lời của công ty), nhưng đổi lại không ai phải gánh một mình một tai họa lớn.", en: "Insurance pools risk: on average buyers pay more than they get back (that's the insurer's profit), but in return no one faces a big disaster alone." },
    },
  ],
};
export default lesson;
