/* Investing · I1 — "Stocks: investing or gambling?" (design doc 13.2d ④, 6-beat frame 13.2c)
 * Risk & return, diversification, index funds/ETFs, FOMO (deep dive: beta, volatility). Trap: "a rising stock keeps rising".
 * The 10-year paths are illustrative. Index ≈ 7%/yr: 10 → 19.7. Stock X: 10 → 32. Stock Y: 10 → 2.
 * ⚠️ Draft written with AI help — team review. Verify: VN-Index ≈ 1,500 (early 2022) → ≈ 900 (Nov 2022), about −40%.
 * Not investment advice; teens can't open brokerage accounts alone (say so). */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "i-stocks",
  domain: "markets",
  icon: "📈",
  ic: "chart",
  minutes: 7,
  title: { vi: "Chứng khoán: đầu tư hay đánh bạc?", en: "Stocks: investing or gambling?" },
  desc: {
    vi: "Cổ phiếu là gì, rủi ro đi cùng lợi nhuận, vì sao đa dạng hóa và quỹ chỉ số giúp bớt 'đánh bạc', và cái bẫy FOMO.",
    en: "What a share is, risk comes with return, why diversification and index funds make it less of a gamble, and the FOMO trap.",
  },
  prereq: { vi: "lãi kép (P3) và lừa đảo 'cam kết lãi' (P4).", en: "compounding (P3) and 'guaranteed return' scams (P4)." },
  review: {
    title: { vi: "Cổ phiếu & rủi ro", en: "Shares & risk" },
    points: [
      { vi: "Cổ phiếu = một phần nhỏ quyền sở hữu doanh nghiệp.", en: "A share = a small piece of owning a company." },
      { vi: "Lợi nhuận kỳ vọng cao hơn → rủi ro (biến động) cao hơn.", en: "Higher expected return → higher risk (volatility)." },
      { vi: "<b>Đa dạng hóa</b>: không bỏ hết trứng vào một giỏ.", en: "<b>Diversify</b>: don't put all your eggs in one basket." },
      { vi: "Đầu tư dài hạn, đều đặn — không đuổi theo mã 'đang hot'.", en: "Invest long-term and regularly — don't chase 'hot' stocks." },
    ],
  },
  info: {
    s: { vi: "Cổ phiếu là quyền sở hữu một phần doanh nghiệp; lợi nhuận cao đi kèm biến động; đa dạng hóa và giữ dài hạn giảm rủi ro.", en: "A share is part-ownership of a firm; higher returns come with swings; diversifying and holding long-term cut risk." },
    l: {
      vi: "Mua cổ phiếu là mua một phần nhỏ của doanh nghiệp: công ty làm ăn tốt thì giá trị phần đó tăng và có thể được chia cổ tức. Nhưng giá cổ phiếu dao động mạnh, một công ty có thể phá sản. Đầu tư khác đánh bạc ở chỗ: dựa vào giá trị thật của doanh nghiệp, đa dạng hóa nhiều công ty, giữ dài hạn và chỉ dùng tiền không cần đến trong nhiều năm. Quỹ chỉ số (ETF) mua cả rổ cổ phiếu với chi phí thấp. Mua vì sợ bị bỏ lỡ (FOMO) khi giá đã tăng nóng thường là mua đắt. (Người dưới 18 tuổi cần người giám hộ để mở tài khoản chứng khoán.)",
      en: "Buying a share means owning a small piece of a business: if the firm does well, that piece gains value and may pay dividends. But share prices swing a lot, and a company can go bust. Investing differs from gambling by relying on the business's real value, spreading across many companies, holding for years and only using money you won't need for a long time. Index funds (ETFs) buy a whole basket cheaply. Buying out of fear of missing out (FOMO) after a hot run usually means buying expensive. (Under-18s need a guardian to open a brokerage account.)",
    },
  },
  kb: ["stocks", "compound"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "stock market board numbers" }, art: "📈📉📈📉", cap: { vi: "Sòng bạc hay doanh nghiệp?", en: "Casino or company?" },
      title: { vi: "Chứng khoán: đầu tư hay đánh bạc?", en: "Stocks: investing or gambling?" },
      text: {
        vi: "Anh họ bạn khoe: “Tuần trước anh mua mã ABC, lời 30% rồi!” Tuần sau lại im lặng. Có người gọi chứng khoán là 'sòng bạc', có người gọi là cách tốt nhất để tiền lớn lên dài hạn. Ai đúng? Câu trả lời nằm ở <b>cách</b> bạn mua — không ở chính cổ phiếu.",
        en: "Your cousin brags: “I bought ABC last week, already up 30%!” The next week, silence. Some call the stock market a 'casino', others the best way to grow money long-term. Who's right? The answer is in <b>how</b> you buy — not in the shares themselves.",
      },
      lion: { vi: "Bài này không phải lời khuyên mua bán — mà là cách nghĩ cho đúng 🧠", en: "This isn't buy/sell advice — it's how to think about it 🧠" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: VN-Index đầu năm 2022 khoảng 1.500 điểm. Đến tháng 11/2022 nó còn khoảng bao nhiêu điểm?", en: "Guess: early in 2022 the VN-Index was about 1,500 points. Where was it by November 2022?" },
      art: "📊 1.500 → ?", min: 500, max: 1800, step: 10, start: 1450, actual: 900, unit: "num",
      reveal: { vi: "Khoảng <b>900 điểm</b> — giảm khoảng 40% trong chưa tới một năm. Ai vay tiền mua cổ phiếu lúc đỉnh có thể mất gần hết. Thị trường cũng từng hồi phục sau những lần giảm như vậy — nhưng không ai biết trước khi nào.", en: "About <b>900 points</b> — down roughly 40% in under a year. People who borrowed to buy at the top could lose almost everything. Markets have also recovered after drops like this — but nobody knows when in advance." },
    },
    /* 3 · Mechanism */
    {
      t: "chart", q: { vi: "Ba người cùng có 10 triệu, giữ 10 năm. Ở năm 0 họ KHÔNG biết trước tương lai. Cách nào giống 'đánh bạc' nhất?", en: "Three people each have 10 million for 10 years. At year 0 they DON'T know the future. Which looks most like gambling?" },
      chart: {
        kind: "line",
        labels: ["0", "2", "4", "6", "8", "10"],
        series: [
          { name: { vi: "Dồn hết vào cổ phiếu X", en: "All in stock X" }, color: "#2FAE73", data: [10, 16, 9, 21, 27, 32] },
          { name: { vi: "Dồn hết vào cổ phiếu Y", en: "All in stock Y" }, color: "#EF4E4E", data: [10, 14, 11, 6, 3, 2] },
          { name: { vi: "Quỹ chỉ số (cả rổ)", en: "Index fund (whole basket)" }, color: "#3D7BF5", data: [10, 11.4, 12.6, 15.5, 16.6, 19.7] },
        ],
        y: { vi: "triệu ₫", en: "million ₫" },
        source: { vi: "Đường minh họa, không phải dữ liệu thật", en: "Illustrative paths, not real data" },
      },
      o: [
        { vi: "Dồn hết vào một mã — có thể thành 32 triệu hoặc còn 2 triệu, không biết trước", en: "All in one stock — could end at 32 million or 2 million, no way to know" },
        { vi: "Quỹ chỉ số", en: "The index fund" },
        { vi: "Cả ba đều như nhau", en: "All three are the same" },
        { vi: "Không cách nào có rủi ro", en: "None of them has risk" },
      ],
      a: 0,
      why: { vi: "Nhìn lại thì X tuyệt vời, nhưng ở năm 0, X và Y trông như nhau. Dồn hết vào một mã là đặt cược; quỹ chỉ số trải rủi ro ra hàng trăm công ty — lên xuống ít hơn, trung bình khoảng 7%/năm trong ví dụ này.", en: "In hindsight X is great, but at year 0 X and Y looked alike. All-in on one stock is a bet; an index fund spreads risk over hundreds of firms — smaller swings, about 7% a year on average in this example." },
      hint: { vi: "Đường nào có kết cục khó đoán nhất?", en: "Which path has the least predictable ending?" },
    },
    {
      t: "sort", q: { vi: "Hành vi này giống ĐẦU TƯ hay ĐÁNH BẠC?", en: "Does this look like INVESTING or GAMBLING?" },
      buckets: [["🌳", { vi: "Đầu tư", en: "Investing" }], ["🎰", { vi: "Đánh bạc", en: "Gambling" }]],
      items: [
        ["📅", { vi: "Mỗi tháng mua đều một ít quỹ chỉ số, giữ 10 năm", en: "Buy a little index fund every month, hold 10 years" }, 0],
        ["🔥", { vi: "Vay tiền mua mã đang tăng trần 5 phiên liền", en: "Borrow to buy a stock that's hit the limit-up 5 days running" }, 1],
        ["📖", { vi: "Đọc báo cáo tài chính trước khi mua cổ phần một công ty", en: "Read a company's financial reports before buying" }, 0],
        ["💬", { vi: "Mua theo tin 'mã sắp lên' trong nhóm chat", en: "Buy on a 'this one's about to jump' tip in a chat group" }, 1],
        ["🧺", { vi: "Chia tiền vào nhiều ngành khác nhau", en: "Spread money across different industries" }, 0],
        ["⏱️", { vi: "Mua sáng bán chiều, mong lời 10% mỗi ngày", en: "Buy in the morning, sell in the afternoon, hoping for 10% a day" }, 1],
      ],
      why: { vi: "Đầu tư: hiểu mình mua gì, đa dạng hóa, dài hạn, dùng tiền nhàn rỗi. Đánh bạc: theo tin đồn, dùng tiền vay, đặt cược ngắn hạn vào biến động giá.", en: "Investing: know what you buy, diversify, long-term, spare money. Gambling: rumours, borrowed money, short-term bets on price swings." },
      hint: { vi: "Có dựa vào giá trị doanh nghiệp và thời gian dài không?", en: "Is it based on the business's value and a long time horizon?" },
    },
    /* 4 · The real story */
    {
      t: "calc", q: { vi: "Hai bạn cùng có 10 triệu. An mua một quỹ chỉ số ~8%/năm. Bình vay thêm 10 triệu mua một mã 'hot' và mã đó giảm 40%.", en: "Two friends each have 10 million. An buys an index fund at ~8% a year. Bình borrows another 10 million for a 'hot' stock that then falls 40%." },
      parts: [
        { label: { vi: "Tiền của An sau 1 năm (triệu ₫, 1 chữ số thập phân)", en: "An's money after 1 year (million ₫, 1 decimal)" }, a: 10.8, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Bình: 20 triệu cổ phiếu giảm 40% còn bao nhiêu? (triệu ₫)", en: "Bình: 20 million of shares down 40% is worth (million ₫)" }, a: 12, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Trả nợ 10 triệu xong, Bình còn bao nhiêu? (triệu ₫)", en: "After repaying the 10 million, Bình has (million ₫)" }, a: 2, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
      ],
      why: { vi: "An: 10,8 triệu. Bình: 20 × 0,6 = 12 → trả 10 → còn 2 triệu: mất 80% tiền của mình chỉ vì giá giảm 40%. Đòn bẩy nhân đôi cả lời lẫn lỗ — như các nhà đầu tư vay ký quỹ năm 1929 hay VN-Index năm 2022.", en: "An: 10.8 million. Bình: 20 × 0.6 = 12 → repay 10 → 2 million left: 80% of his own money gone from a 40% price drop. Leverage multiplies gains and losses — like margin buyers in 1929 or the VN-Index in 2022." },
      hint: { vi: "Giảm 40% nghĩa là còn 60%.", en: "Down 40% means 60% is left." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Một mã cổ phiếu đã tăng 200% trong 3 tháng, ai cũng bàn tán. Suy nghĩ nào ĐÚNG nhất?", en: "A stock is up 200% in 3 months and everyone's talking about it. Which thought is MOST right?" },
      o: [
        { vi: "Giá đã tăng không cho biết nó sẽ tăng tiếp; có thể nó đã đắt hơn giá trị thật — cần xem doanh nghiệp, không phải xem đám đông", en: "A past rise says nothing about the next one; it may already cost more than it's worth — look at the business, not the crowd" },
        { vi: "Đang lên thì sẽ lên tiếp — mua ngay kẻo lỡ", en: "It's rising, so it'll keep rising — buy before it's too late" },
        { vi: "Ai cũng mua thì chắc chắn an toàn", en: "If everyone's buying it must be safe" },
        { vi: "Vay thêm để mua nhiều hơn", en: "Borrow to buy more" },
      ],
      a: 0,
      why: { vi: "Đó là FOMO — sợ bị bỏ lỡ. Khi ai cũng đã mua, ai còn lại để mua tiếp và đẩy giá lên? Lịch sử đầy những mã 'không thể giảm' rồi giảm 80%.", en: "That's FOMO — fear of missing out. When everyone has already bought, who's left to buy and push the price up? History is full of 'can't-lose' stocks that fell 80%." },
      hint: { vi: "Giá tăng trong quá khứ có đảm bảo tương lai không?", en: "Does a past rise guarantee the future?" },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: bố mẹ có 50 triệu nhàn rỗi trong 10 năm, hỏi bạn: “Mua một mã đang hot hay mua quỹ chỉ số?” Trả lời 1–2 câu, có lý do.", en: "Final boss: your parents have 50 million they won't need for 10 years and ask: “A hot stock or an index fund?” Answer in 1–2 sentences with reasons." },
      keys: [
        { label: { vi: "Đa dạng hóa / cả rổ", en: "Diversify / basket" }, words: { vi: ["đa dạng", "cả rổ", "nhiều công ty", "chỉ số", "một giỏ", "trứng"], en: ["diversif", "basket", "many companies", "index", "eggs"] } },
        { label: { vi: "Rủi ro một mã / FOMO", en: "Single-stock risk / FOMO" }, words: { vi: ["rủi ro", "một mã", "hot", "fomo", "giảm", "mất"], en: ["risk", "one stock", "hot", "fomo", "fall", "lose"] } },
        { label: { vi: "Dài hạn / lãi kép", en: "Long term / compounding" }, words: { vi: ["dài hạn", "10 năm", "lâu dài", "lãi kép", "giữ"], en: ["long", "10 years", "compound", "hold"] } },
      ],
      need: 2,
      model: { vi: "Nên mua quỹ chỉ số vì nó chia rủi ro ra nhiều công ty, còn một mã đang hot có thể giảm mạnh mà mình không đoán trước được; giữ 10 năm để lãi kép làm việc.", en: "The index fund, because it spreads risk across many companies, while a hot stock can crash unpredictably; holding for 10 years lets compounding work." },
      why: { vi: "Ý chính: đa dạng hóa + dài hạn + không chạy theo đám đông.", en: "Key idea: diversify + long-term + don't follow the crowd." },
      hint: { vi: "Nhớ biểu đồ ba đường X, Y và quỹ chỉ số.", en: "Remember the chart with X, Y and the index fund." },
    },
    {
      t: "learn", art: "🧺 ⏳ 🧠",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Chưa cần có tài khoản chứng khoán để luyện tư duy đầu tư:", en: "You don't need a brokerage account to train an investor's mind:" },
      items: [
        ["🧺", { vi: "Chọn 'danh mục ảo' 5 công ty ở 5 ngành khác nhau, theo dõi 3 tháng", en: "Pick a 'paper portfolio' of 5 companies in 5 industries and track it for 3 months" }],
        ["📖", { vi: "Với mỗi công ty, viết 1 câu: họ kiếm tiền bằng cách nào?", en: "For each company, write one sentence: how do they make money?" }],
        ["🛑", { vi: "Thấy ai hô 'mã sắp lên': nhớ bài P4", en: "When someone shouts 'this one's about to jump': remember lesson P4" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Sàn giao dịch ở Khu tài chính — bảng giá chạy suốt ngày (phần chơi đầu tư sắp có)!", en: "🎮 Unlocked in the game: the Stock exchange in the Finance District — its ticker runs all day (investing gameplay coming soon)!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "β = 1,5 → thị trường ±10% ⇒ ±15%", fs: 20,
      title: { vi: "Độ biến động và hệ số Beta", en: "Volatility and beta" },
      text: {
        vi: "<b>Độ biến động</b> đo giá dao động mạnh cỡ nào. <b>Beta (β)</b> đo cổ phiếu nhạy với cả thị trường ra sao: β = 1 đi cùng thị trường; β = 1,5 thì thị trường lên/xuống 10%, cổ phiếu thường lên/xuống khoảng 15%; β = 0,5 thì khoảng 5%. Đa dạng hóa loại bỏ được rủi ro riêng của từng công ty, nhưng không loại bỏ được rủi ro chung của cả thị trường.",
        en: "<b>Volatility</b> measures how wildly a price swings. <b>Beta (β)</b> measures how sensitive a stock is to the whole market: β = 1 moves with the market; β = 1.5 tends to move about 15% when the market moves 10%; β = 0.5 about 5%. Diversification removes each company's own risk, but not the market-wide risk.",
      },
    },
    {
      t: "calc", q: { vi: "Thị trường giảm 20%.", en: "The market falls 20%." },
      parts: [
        { label: { vi: "Cổ phiếu β = 1,5 thường giảm khoảng (%)", en: "A β = 1.5 stock typically falls about (%)" }, a: 30, tol: 0.05, unit: "%" },
        { label: { vi: "Cổ phiếu β = 0,6 thường giảm khoảng (%)", en: "A β = 0.6 stock typically falls about (%)" }, a: 12, tol: 0.05, unit: "%" },
      ],
      why: { vi: "1,5 × 20 = 30%. 0,6 × 20 = 12%. Đây chỉ là xu hướng trung bình, không phải lời hứa.", en: "1.5 × 20 = 30%. 0.6 × 20 = 12%. Only an average tendency, not a promise." },
    },
    {
      t: "mcq", q: { vi: "Vì sao quỹ chỉ số thường có chi phí thấp hơn quỹ 'chủ động' (người quản lý tự chọn mã)?", en: "Why do index funds usually cost less than 'active' funds (where managers pick stocks)?" },
      o: [
        { vi: "Chỉ cần mua theo rổ chỉ số, không cần đội phân tích chọn mã và mua bán liên tục", en: "They just follow the index basket — no analyst team picking and trading constantly" },
        { vi: "Vì quỹ chỉ số không bao giờ lỗ", en: "Because index funds never lose" },
        { vi: "Vì Nhà nước trả phí thay", en: "Because the state pays the fees" },
        { vi: "Vì quỹ chỉ số chỉ mua một mã", en: "Because index funds buy only one stock" },
      ],
      a: 0,
      why: { vi: "Phí thấp cộng dồn qua nhiều năm tạo khác biệt lớn — lãi kép chạy cả với chi phí. Nhiều nghiên cứu cho thấy phần lớn quỹ chủ động không thắng được chỉ số sau khi trừ phí trong dài hạn.", en: "Low fees compound over the years into a big difference — compounding works on costs too. Many studies find most active funds don't beat the index after fees over the long run." },
    },
  ],
};
export default lesson;
