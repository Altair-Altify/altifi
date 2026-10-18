/* Business finance · B4 — "A bank loan or a Shark Tank pitch?" (design doc 13.2d ②, 6-beat frame 13.2c)
 * Debt vs equity, valuation & dilution, leverage, fixed/floating business loans. Trap: "raising money is free money".
 * Linh needs 600M for two more shops. Loan: 600M, 11%/yr, 60 months → 13.05M/month, total interest ≈ 183M.
 * Investor: 600M for 30% → post-money 2,000M, pre-money 1,400M. If worth 10 billion in 5 years, 30% = 3,000M.
 * ⚠️ Draft written with AI help — team review. Verify: Steve Jobs left Apple in 1985 after losing a boardroom
 * struggle (returned 1997). Rates are illustrative. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "c-funding",
  domain: "corporate",
  icon: "🦈",
  ic: "scale",
  minutes: 7,
  title: { vi: "Vay ngân hàng hay gọi vốn kiểu Shark Tank?", en: "A bank loan or a Shark Tank pitch?" },
  desc: {
    vi: "Nợ hay vốn góp: định giá, pha loãng cổ phần, đòn bẩy, và lãi cố định/thả nổi khi doanh nghiệp đi vay.",
    en: "Debt or equity: valuation, dilution, leverage, and fixed vs floating rates when a business borrows.",
  },
  prereq: { vi: "lợi nhuận và dòng tiền của quán (B1, B3); lãi suất cố định/thả nổi.", en: "a shop's profit and cash flow (B1, B3); fixed vs floating rates." },
  review: {
    title: { vi: "Nợ & vốn góp", en: "Debt & equity" },
    points: [
      { vi: "<b>Vay</b>: trả gốc + lãi đúng hạn dù lời hay lỗ, nhưng giữ 100% công ty.", en: "<b>Debt</b>: repay principal + interest on time, profit or not — but keep 100% of the company." },
      { vi: "<b>Gọi vốn</b>: không trả góp, nhưng chia sở hữu, lợi nhuận và quyền quyết định mãi mãi.", en: "<b>Equity</b>: no repayments, but you share ownership, profits and control forever." },
      { vi: "Định giá sau gọi vốn = tiền góp ÷ % nhượng.", en: "Post-money valuation = amount invested ÷ % sold." },
      { vi: "Dòng tiền ổn định → vay hợp lý; rủi ro cao, chưa có lãi → vốn góp hợp hơn.", en: "Steady cash flow → borrowing fits; risky, no profit yet → equity fits better." },
    ],
  },
  info: {
    s: { vi: "Vay: trả nợ đều nhưng giữ quyền sở hữu; gọi vốn: không trả nợ nhưng chia phần công ty. Định giá = tiền góp ÷ % nhượng.", en: "Debt: regular repayments but you keep ownership; equity: no repayments but you share the company. Valuation = investment ÷ % sold." },
    l: {
      vi: "Doanh nghiệp có hai nguồn tiền chính từ bên ngoài. Vay nợ: ngân hàng không sở hữu công ty, nhưng bạn phải trả gốc và lãi đúng hạn dù kinh doanh lời hay lỗ; lãi có thể cố định hoặc thả nổi theo lãi suất NHTW. Vốn góp (cổ phần): nhà đầu tư không đòi trả hàng tháng, nhưng sở hữu một phần công ty, nhận phần lợi nhuận tương ứng mãi mãi và có tiếng nói trong các quyết định. Nếu nhà đầu tư trả X cho Y%, họ đang định giá công ty X ÷ Y (sau khi góp). Vay hợp với doanh nghiệp có dòng tiền ổn định; vốn góp hợp với dự án rủi ro, chưa có lãi nhưng có thể tăng trưởng mạnh.",
      en: "A business has two main outside sources of money. Debt: the bank doesn't own the company, but you must repay principal and interest on time whether you profit or not; the rate can be fixed or float with the central bank. Equity (shares): the investor doesn't want monthly payments, but owns part of the company, gets that share of profits forever and has a say in decisions. If an investor pays X for Y%, they value the company at X ÷ Y (after the investment). Debt suits businesses with steady cash flow; equity suits risky, not-yet-profitable projects that could grow fast.",
    },
  },
  kb: ["debt", "fixedfloat", "profit"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "business meeting handshake" }, art: "🏦 600tr vay · 🦈 600tr = 30%", cap: { vi: "Cùng 600 triệu, hai cái giá rất khác nhau", en: "The same 600 million, two very different prices" },
      title: { vi: "Vay ngân hàng hay gọi vốn kiểu Shark Tank?", en: "A bank loan or a Shark Tank pitch?" },
      text: {
        vi: "Quán của Linh lời đều. Linh muốn mở thêm 2 cửa hàng, cần <b>600 triệu</b>. Ngân hàng: “Cho vay 600 triệu, lãi 11%/năm, trả trong 5 năm.” Một nhà đầu tư trên truyền hình: “Tôi đưa 600 triệu, đổi lấy <b>30%</b> công ty.” Không phải trả lãi nghe hấp dẫn — nhưng 30% công ty đáng giá bao nhiêu?",
        en: "Linh's shop makes a steady profit. She wants two more shops and needs <b>600 million</b>. The bank: “We'll lend 600 million at 11% a year over 5 years.” An investor on TV: “I'll give you 600 million for <b>30%</b> of the company.” No interest sounds great — but what is 30% of the company worth?",
      },
      lion: { vi: "Tiền nào cũng có giá — chỉ là trả bằng thứ khác nhau 🦈", en: "All money has a price — you just pay it in different ways 🦈" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: nhà đầu tư trả 600 triệu để lấy 30%. Theo họ, cả công ty của Linh (sau khi có 600 triệu) đáng giá bao nhiêu?", en: "Guess: the investor pays 600 million for 30%. By their numbers, what is Linh's whole company worth (with the 600 million in)?" },
      art: "🦈 600tr ÷ 30% = ?", min: 600000000, max: 4000000000, step: 50000000, start: 1000000000, actual: 2000000000, unit: "mvnd",
      reveal: { vi: "<b>2 tỷ</b> (600 triệu ÷ 30%). Trừ 600 triệu vừa góp, họ định giá quán của Linh <b>trước</b> khi góp là 1,4 tỷ. Nếu 5 năm sau công ty đáng 10 tỷ, 30% của họ đáng <b>3 tỷ</b> — so với 183 triệu tiền lãi nếu đi vay.", en: "<b>2 billion</b> (600 million ÷ 30%). Minus the 600 million they put in, they value Linh's shop <b>before</b> the deal at 1.4 billion. If the company is worth 10 billion in 5 years, their 30% is worth <b>3 billion</b> — versus 183 million of interest on the loan." },
    },
    /* 3 · Mechanism */
    {
      t: "learn", art: "🏦 = 📅💸 · 🦈 = 🍰",
      title: { vi: "Nợ và vốn góp", en: "Debt and equity" },
      text: {
        vi: "<b>Vay nợ</b>: mỗi tháng trả gốc + lãi, dù quán lời hay lỗ; ngân hàng có thể đòi tài sản thế chấp. Bù lại, bạn giữ <b>100%</b> công ty và mọi lợi nhuận sau khi trả nợ. <b>Vốn góp</b>: không trả góp; nếu quán lỗ, nhà đầu tư cùng chịu. Bù lại, họ sở hữu một miếng bánh — <b>mãi mãi</b> — và có tiếng nói khi bạn ra quyết định lớn.",
        en: "<b>Debt</b>: pay principal + interest every month, profit or loss; the bank may want collateral. In return you keep <b>100%</b> of the company and all profit after repayments. <b>Equity</b>: no repayments; if the shop loses money, the investor shares the loss. In return they own a slice of the cake — <b>forever</b> — and have a say in big decisions.",
      },
      items: [["🏦", { vi: "Vay: trả đều, giữ 100%", en: "Debt: repay, keep 100%" }], ["🦈", { vi: "Góp vốn: không trả góp, chia phần", en: "Equity: no repayments, share it" }], ["⚖️", { vi: "Chọn theo dòng tiền & rủi ro", en: "Choose by cash flow & risk" }]],
    },
    {
      t: "calc", q: { vi: "So hai lời đề nghị (đơn vị: triệu ₫):", en: "Compare the two offers (in million ₫):" },
      art: "🏦 600 · 11% · 60 tháng · 🦈 600 = 30%",
      parts: [
        { label: { vi: "Vay: trả góp mỗi tháng (triệu ₫, 2 chữ số thập phân)", en: "Loan: monthly payment (million ₫, 2 decimals)" }, a: 13.05, tol: 0.06, unit: { vi: "triệu ₫", en: "million ₫" }, hint: { vi: "Công thức trả góp đều, hoặc ước: 600/60 + lãi bình quân", en: "Annuity formula, or estimate: 600/60 + average interest" } },
        { label: { vi: "Vay: tổng tiền lãi sau 5 năm (triệu ₫, làm tròn)", en: "Loan: total interest over 5 years (million ₫, rounded)" }, a: 183, tol: 3, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Gọi vốn: nếu 5 năm sau công ty đáng 10.000 triệu, phần 30% của nhà đầu tư đáng (triệu ₫)", en: "Equity: if the company is worth 10,000 million in 5 years, the investor's 30% is worth (million ₫)" }, a: 3000, tol: 0, unit: { vi: "triệu ₫", en: "million ₫" } },
      ],
      why: { vi: "Trả góp ≈ 13,05 triệu/tháng; 13,05 × 60 = 783 → lãi ≈ 183 triệu. Phần 30% có thể đáng 3.000 triệu. Nếu quán thành công, vốn góp 'đắt' hơn nhiều; nếu quán thất bại, khoản vay vẫn phải trả còn nhà đầu tư cùng mất.", en: "Payment ≈ 13.05 million a month; 13.05 × 60 = 783 → interest ≈ 183 million. The 30% could be worth 3,000 million. If the shop succeeds, equity is far 'dearer'; if it fails, the loan must still be repaid while the investor loses too." },
      hint: { vi: "Bước 3: 30% × 10.000.", en: "Step 3: 30% × 10,000." },
    },
    {
      t: "sort", q: { vi: "Đặc điểm này thuộc VAY NỢ hay VỐN GÓP?", en: "Is this DEBT or EQUITY?" },
      buckets: [["🏦", { vi: "Vay nợ", en: "Debt" }], ["🦈", { vi: "Vốn góp", en: "Equity" }]],
      items: [
        ["📅", { vi: "Phải trả đều mỗi tháng, kể cả tháng lỗ", en: "Must pay every month, even in a loss-making month" }, 0],
        ["🍰", { vi: "Chia phần sở hữu công ty", en: "You share ownership of the company" }, 1],
        ["🏠", { vi: "Có thể bị đòi tài sản thế chấp", en: "Collateral can be taken" }, 0],
        ["🤝", { vi: "Bên cấp tiền cùng chịu lỗ nếu thất bại", en: "The funder shares the loss if it fails" }, 1],
        ["🎛️", { vi: "Chi phí có thể tăng khi NHTW tăng lãi suất (thả nổi)", en: "Cost can rise when the central bank raises rates (floating)" }, 0],
        ["🗳️", { vi: "Bên cấp tiền có tiếng nói trong quyết định lớn", en: "The funder gets a say in big decisions" }, 1],
      ],
      why: { vi: "Nợ: nghĩa vụ trả cố định, rủi ro lãi suất, thế chấp. Vốn góp: chia sở hữu, chia lỗ, chia quyền.", en: "Debt: fixed obligations, interest-rate risk, collateral. Equity: shared ownership, shared losses, shared control." },
      hint: { vi: "Ngân hàng không muốn làm chủ quán — nhà đầu tư thì có.", en: "A bank doesn't want to own your shop — an investor does." },
    },
    /* 4 · The real story */
    {
      t: "mcq", q: { vi: "Năm 1985, Steve Jobs phải rời Apple — công ty do chính ông đồng sáng lập. Vì sao chuyện này có thể xảy ra?", en: "In 1985 Steve Jobs had to leave Apple — the company he co-founded. How could that happen?" },
      o: [
        { vi: "Sau nhiều vòng gọi vốn và lên sàn, ông không còn nắm quyền quyết định; hội đồng quản trị đại diện cổ đông đứng về phía CEO khác", en: "After many funding rounds and going public he no longer had control; the board, representing shareholders, backed another CEO" },
        { vi: "Ngân hàng đòi nợ nên tịch thu công ty", en: "The bank called in a loan and seized the company" },
        { vi: "Nhà nước quốc hữu hóa Apple", en: "The government nationalised Apple" },
        { vi: "Ông bán hết cổ phần từ trước khi thành lập", en: "He'd sold all his shares before founding it" },
      ],
      a: 0,
      why: { vi: "Vốn góp mang theo quyền: nhà sáng lập bị pha loãng tới mức không còn quyết định một mình. Jobs quay lại Apple năm 1997. Còn với vay nợ: năm 2022–23, khi lãi suất tăng, nhiều chủ doanh nghiệp vay thả nổi thấy chi phí lãi tăng mạnh — mỗi nguồn tiền có một kiểu rủi ro riêng.", en: "Equity comes with power: founders get diluted until they can't decide alone. Jobs returned to Apple in 1997. And debt: in 2022–23, as rates rose, many owners with floating loans saw their interest costs jump — each source of money has its own kind of risk." },
      hint: { vi: "Ai bầu ra người điều hành công ty?", en: "Who chooses who runs a company?" },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Gọi vốn là tiền miễn phí vì không phải trả lãi.” Bạn nghĩ sao?", en: "“Raising equity is free money because there's no interest.” What do you think?" },
      o: [
        { vi: "Đúng — không lãi thì không mất gì", en: "True — no interest, nothing to lose" },
        { vi: "Sai — bạn trả bằng phần sở hữu, phần lợi nhuận mãi mãi và một phần quyền quyết định", en: "False — you pay with ownership, a share of profits forever and some control" },
        { vi: "Đúng, nếu nhà đầu tư là người quen", en: "True, if the investor is someone you know" },
        { vi: "Sai — vì nhà đầu tư luôn đòi lãi 20%/năm", en: "False — because investors always charge 20% a year" },
      ],
      a: 1,
      why: { vi: "Với công ty thành công, vốn góp thường là nguồn tiền ĐẮT nhất (30% của 10 tỷ = 3 tỷ so với 183 triệu lãi). Nó rẻ khi công ty thất bại — vì nhà đầu tư mất cùng bạn.", en: "For a successful company, equity is often the MOST expensive money (30% of 10 billion = 3 billion vs 183 million of interest). It's cheap only if the company fails — because the investor loses with you." },
      hint: { vi: "Nhớ phép tính 30% × 10 tỷ.", en: "Remember 30% × 10 billion." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: quán Linh lời đều 25 triệu/tháng, đã 2 năm. Linh nên vay hay gọi vốn để mở 2 cửa hàng? Khuyên 1–2 câu, nêu lý do.", en: "Final boss: Linh's shop has made a steady 25 million a month for 2 years. Should she borrow or raise equity for two more shops? Advise in 1–2 sentences, with reasons." },
      keys: [
        { label: { vi: "Dòng tiền ổn định trả được nợ", en: "Steady cash flow can repay" }, words: { vi: ["dòng tiền", "ổn định", "lời đều", "trả được", "đủ trả", "25 triệu", "13"], en: ["cash flow", "steady", "stable", "afford", "repay", "25 million", "13"] } },
        { label: { vi: "Giữ quyền sở hữu / tránh pha loãng", en: "Keep ownership / avoid dilution" }, words: { vi: ["sở hữu", "giữ", "pha loãng", "100%", "30%", "quyền"], en: ["ownership", "keep", "dilution", "dilute", "100%", "30%", "control"] } },
        { label: { vi: "Rủi ro lãi suất / chọn cố định", en: "Rate risk / choose fixed" }, words: { vi: ["cố định", "thả nổi", "lãi suất", "rủi ro", "dự phòng"], en: ["fixed", "floating", "interest", "risk", "buffer"] } },
      ],
      need: 2,
      model: { vi: "Nên vay, vì quán lời đều 25 triệu/tháng đủ trả khoản góp ~13 triệu, và Linh giữ được 100% sở hữu thay vì nhường 30%; nên chọn lãi cố định để khỏi bị bất ngờ khi lãi suất tăng.", en: "Borrow: the shop's steady 25 million a month can cover the ~13 million payment, and Linh keeps 100% ownership instead of giving up 30%; choose a fixed rate so a rate hike can't surprise her." },
      why: { vi: "Ý chính: dòng tiền ổn định → vay hợp lý và giữ quyền sở hữu; nhưng phải tính khoản trả cao nhất (lãi thả nổi có thể tăng).", en: "Key idea: steady cash flow → borrowing makes sense and keeps ownership; but plan for the highest payment (floating rates can rise)." },
      hint: { vi: "So 25 triệu lời mỗi tháng với khoản trả góp 13 triệu.", en: "Compare 25 million monthly profit with the 13 million payment." },
    },
    {
      t: "learn", art: "📺 🦈 🧮",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Xem một tập Shark Tank (hoặc tin gọi vốn bất kỳ) và thử:", en: "Watch a Shark Tank episode (or any funding news) and try:" },
      items: [
        ["🧮", { vi: "Chia số tiền cho % cổ phần → định giá mà nhà đầu tư đưa ra", en: "Divide the money by the % → the valuation the investor proposes" }],
        ["🤔", { vi: "Doanh nghiệp đó có dòng tiền ổn định để vay thay vì gọi vốn không?", en: "Does the business have steady cash flow to borrow instead?" }],
        ["🗳️", { vi: "Sau thương vụ, nhà sáng lập còn nắm bao nhiêu % — còn quyết định một mình được không?", en: "After the deal, how much does the founder keep — can they still decide alone?" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: vay vốn hoặc gọi vốn khi mở quán và khi mua thiết bị!", en: "🎮 Unlocked in the game: loans or investors when you open your shop and buy equipment!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "ROE = lợi nhuận ÷ vốn chủ", fs: 22,
      title: { vi: "Đòn bẩy tài chính — con dao hai lưỡi", en: "Financial leverage — a double-edged sword" },
      text: {
        vi: "Dùng nợ để đầu tư làm <b>lợi nhuận trên vốn chủ (ROE)</b> tăng khi kinh doanh tốt — vì phần lời vượt quá lãi vay thuộc về chủ. Nhưng khi kinh doanh xấu, tiền lãi vẫn phải trả nên ROE rơi mạnh, thậm chí âm. Nợ không xấu; nợ quá sức mới nguy hiểm.",
        en: "Using debt to invest raises <b>return on equity (ROE)</b> in good times — profit above the interest cost goes to the owner. But in bad times interest must still be paid, so ROE falls hard, even below zero. Debt isn't bad; debt you can't carry is.",
      },
    },
    {
      t: "calc", q: { vi: "Dự án cần 1.000 triệu. Cách A: toàn vốn chủ. Cách B: 400 vốn chủ + 600 vay lãi 11%/năm. Lợi nhuận trước lãi vay mỗi năm: 200 triệu.", en: "A project needs 1,000 million. Plan A: all equity. Plan B: 400 equity + 600 borrowed at 11% a year. Profit before interest: 200 million a year." },
      parts: [
        { label: { vi: "ROE cách A (%)", en: "ROE, plan A (%)" }, a: 20, tol: 0.1, unit: "%" },
        { label: { vi: "ROE cách B (%, 1 chữ số thập phân)", en: "ROE, plan B (%, 1 decimal)" }, a: 33.5, tol: 0.1, unit: "%" },
        { label: { vi: "Năm xấu lợi nhuận trước lãi chỉ 50 triệu: ROE cách B (%, 1 chữ số thập phân)", en: "Bad year, profit before interest just 50 million: ROE plan B (%, 1 decimal)" }, a: -4, tol: 0.1, unit: "%" },
      ],
      why: { vi: "A: 200 ÷ 1.000 = 20%. B: lãi 66 → (200 − 66) ÷ 400 = 33,5%. Năm xấu: (50 − 66) ÷ 400 = −4% — trong khi cách A vẫn +5%.", en: "A: 200 ÷ 1,000 = 20%. B: interest 66 → (200 − 66) ÷ 400 = 33.5%. Bad year: (50 − 66) ÷ 400 = −4% — while plan A still makes +5%." },
      hint: { vi: "Tiền lãi = 600 × 11% = 66 triệu; ROE = (lợi nhuận − lãi) ÷ vốn chủ.", en: "Interest = 600 × 11% = 66 million; ROE = (profit − interest) ÷ equity." },
    },
    {
      t: "mcq", q: { vi: "Một startup công nghệ chưa có doanh thu nhưng có thể tăng trưởng rất nhanh. Nguồn tiền nào hợp hơn?", en: "A tech startup with no revenue yet but huge growth potential. Which funding fits better?" },
      o: [
        { vi: "Vốn góp — vì chưa có dòng tiền để trả nợ, và nhà đầu tư chấp nhận rủi ro đổi lấy phần tăng trưởng", en: "Equity — no cash flow to service debt, and investors accept the risk for a share of the growth" },
        { vi: "Vay ngân hàng 5 năm trả góp đều", en: "A 5-year bank loan with equal payments" },
        { vi: "Thẻ tín dụng của nhà sáng lập", en: "The founder's credit card" },
        { vi: "Mua trước trả sau", en: "Buy now, pay later" },
      ],
      a: 0,
      why: { vi: "Không có dòng tiền thì khoản trả góp đầu tiên đã là gánh nặng. Vốn góp chia rủi ro với người chấp nhận nó.", en: "With no cash flow, the very first loan payment is a burden. Equity shares the risk with people willing to take it." },
    },
  ],
};
export default lesson;
