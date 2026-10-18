/* International finance · X1 — "Why does a stronger dollar make studying abroad and iPhones dearer?" (13.2d ⑥, frame 13.2c)
 * Exchange rates, supply & demand for foreign currency, who wins (exporters) and who loses (importers, students abroad).
 * Trap: "the rate went up = Vietnam's economy is collapsing".
 * iPhone $1,000; tuition $30,000/yr; a garment exporter sells $100,000/month with costs of 2.2 billion ₫/month.
 * ⚠️ Draft written with AI help — team review. Verify: USD/VND ≈ 23,100 (2020) → ≈ 25,400 (end 2024), rounded.
 * Exchange rates in the exercises are illustrative. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "x-fx",
  domain: "intl",
  icon: "💱",
  ic: "swap",
  minutes: 6,
  title: { vi: "Vì sao USD tăng thì du học & iPhone đắt hơn?", en: "Why does a stronger dollar make studying abroad and iPhones dearer?" },
  desc: {
    vi: "Tỷ giá là gì, vì sao nó lên xuống (cung – cầu ngoại tệ), và ai được – ai thiệt khi đồng đô la mạnh lên.",
    en: "What an exchange rate is, why it moves (supply and demand for foreign currency), and who wins and loses when the dollar strengthens.",
  },
  prereq: { vi: "lạm phát khác tỷ giá (bài M1).", en: "inflation isn't the exchange rate (lesson M1)." },
  review: {
    title: { vi: "Tỷ giá", en: "Exchange rates" },
    points: [
      { vi: "Tỷ giá USD/VND = cần bao nhiêu đồng để mua 1 đô la.", en: "USD/VND = how many dong buy one dollar." },
      { vi: "Nhiều người cần USD (nhập khẩu, du học) → USD lên giá.", en: "More demand for dollars (imports, study abroad) → the dollar rises." },
      { vi: "USD tăng: <b>nhà nhập khẩu, du học sinh thiệt</b>; <b>nhà xuất khẩu lợi</b>.", en: "Stronger USD: <b>importers and students abroad lose</b>; <b>exporters gain</b>." },
      { vi: "Tỷ giá tăng ≠ kinh tế sụp đổ.", en: "A higher rate ≠ an economic collapse." },
    ],
  },
  info: {
    s: { vi: "Tỷ giá là giá của một đồng tiền tính bằng đồng tiền khác; USD tăng làm hàng nhập khẩu, du học đắt hơn nhưng giúp hàng xuất khẩu.", en: "An exchange rate is one currency's price in another; a stronger dollar makes imports and study abroad dearer but helps exporters." },
    l: {
      vi: "Tỷ giá USD/VND cho biết cần bao nhiêu đồng để mua một đô la. Nó lên xuống theo cung và cầu ngoại tệ: doanh nghiệp nhập khẩu, du học sinh, người trả nợ nước ngoài cần mua USD; doanh nghiệp xuất khẩu, khách du lịch, kiều hối, nhà đầu tư nước ngoài mang USD vào và bán ra. Lãi suất của Mỹ cũng quan trọng: khi Fed tăng lãi, tiền chảy về Mỹ, USD mạnh lên khắp thế giới. Ngân hàng Nhà nước điều hành tỷ giá trung tâm và có thể bán dự trữ ngoại hối để giảm biến động. USD tăng làm iPhone, học phí nước ngoài đắt hơn, nhưng giúp nhà xuất khẩu thu về nhiều đồng hơn.",
      en: "USD/VND tells you how many dong buy one dollar. It moves with supply and demand for foreign currency: importers, students abroad and people repaying foreign loans buy dollars; exporters, tourists, remittances and foreign investors bring dollars in and sell them. US interest rates matter too: when the Fed raises rates, money flows to the US and the dollar strengthens worldwide. The State Bank of Vietnam manages a central rate and can sell foreign reserves to calm swings. A stronger dollar makes iPhones and foreign tuition dearer, but lets exporters earn more dong.",
    },
  },
  kb: ["fx"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "currency exchange counter dollar" }, art: "💵 1 USD = 23.000₫ → 25.000₫", cap: { vi: "Cùng một chiếc iPhone, giá khác", en: "Same iPhone, different price" },
      title: { vi: "Vì sao USD tăng thì du học & iPhone đắt hơn?", en: "Why does a stronger dollar make studying abroad and iPhones dearer?" },
      text: {
        vi: "Chị bạn đang lo: học phí ở Mỹ vẫn 30.000 USD/năm như năm ngoái, nhưng gia đình phải chuẩn bị nhiều tiền đồng hơn hẳn. Cùng lúc đó, một xưởng may gần nhà lại tuyển thêm người vì 'đơn hàng xuất khẩu lời hơn'. Cùng một chuyện — đô la tăng giá — mà người lo, người vui. Vì sao?",
        en: "Your older sister is worried: US tuition is still $30,000 a year, but the family needs much more dong. Meanwhile a garment factory nearby is hiring because 'export orders pay better'. One event — a stronger dollar — makes some worried and some happy. Why?",
      },
      lion: { vi: "Tỷ giá là 'giá' của một đồng tiền — và nó cũng có cung, có cầu 💱", en: "An exchange rate is a currency's 'price' — with supply and demand like anything else 💱" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: một năm học phí 30.000 USD. Tỷ giá từ 23.000 lên 25.000 ₫/USD. Gia đình phải chuẩn bị thêm bao nhiêu tiền đồng mỗi năm?", en: "Guess: a year's tuition is $30,000. The rate rises from 23,000 to 25,000 ₫ per dollar. How many extra dong per year?" },
      art: "🎓 30.000 USD × (25k − 23k)", min: 0, max: 200000000, step: 1000000, start: 10000000, actual: 60000000, unit: "mvnd",
      reveal: { vi: "<b>60 triệu đồng</b> mỗi năm (30.000 × 2.000₫) — học phí bằng USD không đổi, nhưng tính ra đồng thì tăng gần 9%. Với 4 năm đại học là 240 triệu.", en: "<b>60 million dong</b> a year (30,000 × 2,000₫) — the dollar tuition didn't change, but in dong it rose almost 9%. Over a 4-year degree, 240 million." },
    },
    /* 3 · Mechanism */
    {
      t: "sort", q: { vi: "Việc này làm tăng CẦU mua USD hay tăng CUNG USD (mang USD vào bán)?", en: "Does this raise DEMAND for dollars or SUPPLY of dollars (bringing them in to sell)?" },
      buckets: [["🛒", { vi: "Cầu USD (cần mua)", en: "Demand (buying USD)" }], ["📦", { vi: "Cung USD (bán ra)", en: "Supply (selling USD)" }]],
      items: [
        ["📱", { vi: "Công ty nhập khẩu điện thoại trả tiền cho nhà cung cấp Mỹ", en: "A phone importer pays its US supplier" }, 0],
        ["👕", { vi: "Xưởng may xuất khẩu nhận tiền hàng bằng USD", en: "A garment exporter is paid in dollars" }, 1],
        ["🎓", { vi: "Gia đình gửi học phí cho con du học", en: "A family sends tuition abroad" }, 0],
        ["🏖️", { vi: "Khách du lịch nước ngoài đổi tiền tiêu ở Đà Nẵng", en: "Foreign tourists change money to spend in Da Nang" }, 1],
        ["🏭", { vi: "Tập đoàn nước ngoài xây nhà máy ở Bắc Ninh", en: "A foreign group builds a factory in Bac Ninh" }, 1],
        ["💳", { vi: "Doanh nghiệp trả nợ vay nước ngoài", en: "A firm repays a foreign loan" }, 0],
      ],
      why: { vi: "Ai cần trả tiền ra nước ngoài thì mua USD (cầu). Ai mang tiền từ nước ngoài vào thì bán USD (cung). Cầu > cung → USD lên giá.", en: "Anyone paying abroad buys dollars (demand). Anyone bringing money in sells dollars (supply). Demand > supply → the dollar rises." },
      hint: { vi: "Tiền đi ra hay đi vào Việt Nam?", en: "Is money leaving or entering Vietnam?" },
    },
    {
      t: "calc", q: { vi: "Tỷ giá tăng từ 23.000 lên 25.000 ₫/USD.", en: "The rate rises from 23,000 to 25,000 ₫ per dollar." },
      parts: [
        { label: { vi: "iPhone giá 1.000 USD: tính ra đồng tăng thêm (₫)", en: "A $1,000 iPhone: extra cost in dong (₫)" }, a: 2000000, tol: 0, unit: "₫" },
        { label: { vi: "Xưởng may bán 100.000 USD/tháng, chi phí 2,2 tỷ₫/tháng. Lợi nhuận ở tỷ giá 23.000 (triệu ₫)", en: "Factory sells $100,000/month, costs 2.2 billion ₫/month. Profit at 23,000 (million ₫)" }, a: 100, tol: 0, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Lợi nhuận đó ở tỷ giá 25.000 (triệu ₫)", en: "That profit at 25,000 (million ₫)" }, a: 300, tol: 0, unit: { vi: "triệu ₫", en: "million ₫" } },
      ],
      why: { vi: "iPhone: 1.000 × 2.000 = 2 triệu đắt hơn. Xưởng may: 2,3 tỷ − 2,2 tỷ = 100 triệu → 2,5 tỷ − 2,2 tỷ = 300 triệu: lời gấp ba! Cùng tỷ giá, người nhập khẩu thiệt, người xuất khẩu lợi.", en: "iPhone: 1,000 × 2,000 = 2 million dearer. Factory: 2.3 bn − 2.2 bn = 100 million → 2.5 bn − 2.2 bn = 300 million: triple! The same rate hurts importers and helps exporters." },
      hint: { vi: "Doanh thu bằng đồng = 100.000 × tỷ giá.", en: "Revenue in dong = 100,000 × the rate." },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Tỷ giá USD/VND (làm tròn) 2020–2024. Năm nào tăng mạnh nhất, và vì sao?", en: "USD/VND (rounded) 2020–2024. Which year rose the most, and why?" },
      chart: {
        kind: "line",
        labels: ["2020", "2021", "2022", "2023", "2024"],
        series: [{ name: { vi: "₫ cho 1 USD (cuối năm, nghìn)", en: "₫ per USD (year-end, thousands)" }, color: "#2FAE73", data: [23.1, 22.8, 23.6, 24.3, 25.4] }],
        y: { vi: "nghìn ₫", en: "thousand ₫" },
        source: { vi: "Số làm tròn — cần kiểm chứng với Ngân hàng Nhà nước", en: "Rounded figures — to be verified with the State Bank of Vietnam" },
      },
      o: [
        { vi: "2022 trở đi — Fed tăng lãi suất mạnh, tiền chảy về Mỹ, USD mạnh lên khắp thế giới", en: "From 2022 — the Fed raised rates sharply, money flowed to the US, the dollar rose worldwide" },
        { vi: "2021 — vì VND mạnh lên quá nhanh", en: "2021 — because the dong strengthened too fast" },
        { vi: "Không có năm nào thay đổi", en: "No year changed" },
        { vi: "2020 — vì Việt Nam ngừng xuất khẩu", en: "2020 — because Vietnam stopped exporting" },
      ],
      a: 0,
      why: { vi: "Khi Fed tăng lãi suất (bài M2), giữ USD có lời hơn, nên USD tăng giá so với hầu hết các đồng tiền — đồng yên, đồng euro còn giảm mạnh hơn VND. NHNN đã bán dự trữ ngoại hối và tăng lãi suất cuối 2022 để giảm áp lực.", en: "When the Fed raised rates (lesson M2), holding dollars paid more, so the dollar rose against most currencies — the yen and euro fell even more than the dong. The State Bank sold reserves and raised rates in late 2022 to ease the pressure." },
      hint: { vi: "Nhớ bài M2: năm 2022 Fed làm gì?", en: "Remember M2: what did the Fed do in 2022?" },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Tin: “Tỷ giá USD/VND tăng 3% năm nay.” Ý nào ĐÚNG nhất?", en: "News: “USD/VND up 3% this year.” Which is MOST right?" },
      o: [
        { vi: "Đồng đô la mạnh lên; có thể do lãi suất Mỹ cao — không có nghĩa kinh tế Việt Nam sụp đổ, nhà xuất khẩu còn được lợi", en: "The dollar got stronger, maybe due to high US rates — it doesn't mean Vietnam's economy is collapsing; exporters even gain" },
        { vi: "Kinh tế Việt Nam đang sụp đổ", en: "Vietnam's economy is collapsing" },
        { vi: "Giá mọi thứ ở Việt Nam tăng 3% (lạm phát 3%)", en: "Everything in Vietnam got 3% dearer (3% inflation)" },
        { vi: "Nên đổi hết tiền tiết kiệm sang USD ngay", en: "Swap all your savings into dollars right now" },
      ],
      a: 0,
      why: { vi: "Bẫy 'tỷ giá tăng = kinh tế sụp'. Tỷ giá phản ánh nhiều thứ, kể cả chuyện ở Mỹ. Và nó không phải lạm phát (M1): hàng nhập khẩu đắt hơn, nhưng phần lớn hàng trong nước không đổi giá ngay. Đổi hết sang USD theo tin tức là đặt cược tỷ giá — có thể thua.", en: "The 'rate up = economy down' trap. Exchange rates reflect many things, including events in the US. And it isn't inflation (M1): imports get dearer, but most domestic prices don't jump at once. Swapping everything into dollars on a headline is a currency bet — you can lose." },
      hint: { vi: "Tỷ giá tăng thì ai được lợi?", en: "Who benefits when the rate rises?" },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: gia đình bạn định cho bạn du học sau 3 năm nữa (học phí bằng USD). Bố mẹ lo tỷ giá. Gợi ý 1–2 cách giảm rủi ro.", en: "Final boss: your family plans to send you abroad in 3 years (tuition in USD). Your parents worry about the exchange rate. Suggest 1–2 ways to reduce the risk." },
      keys: [
        { label: { vi: "Mua/để dành USD dần dần", en: "Buy/save USD gradually" }, words: { vi: ["dần dần", "từng đợt", "mỗi tháng", "mua dần", "tích lũy", "để dành usd", "đổi dần"], en: ["gradually", "bit by bit", "every month", "over time", "save dollars"] } },
        { label: { vi: "Dự phòng / tính dư", en: "Buffer / plan extra" }, words: { vi: ["dự phòng", "tính dư", "thêm", "biên", "an toàn", "10%"], en: ["buffer", "extra", "margin", "safety", "10%"] } },
        { label: { vi: "Học bổng / lựa chọn khác", en: "Scholarship / alternatives" }, words: { vi: ["học bổng", "chi phí thấp", "trường khác", "vừa học vừa làm", "nước khác"], en: ["scholarship", "cheaper", "another school", "part-time", "another country"] } },
      ],
      need: 2,
      model: { vi: "Đổi và để dành USD dần dần mỗi tháng thay vì đổi một lần lúc sát ngày, và tính dư khoảng 10% phòng tỷ giá tăng; song song tìm học bổng để giảm số tiền cần đổi.", en: "Buy and save dollars gradually each month instead of all at once at the last minute, and budget about 10% extra in case the rate rises; also look for scholarships to cut the amount needed." },
      why: { vi: "Ý chính: chia nhỏ thời điểm đổi tiền và có biên an toàn — không đoán tỷ giá.", en: "Key idea: spread out when you change money and keep a safety margin — don't try to guess the rate." },
      hint: { vi: "Không đoán được tỷ giá thì làm sao để không bị 'đổi đúng lúc đắt nhất'?", en: "If you can't predict the rate, how do you avoid changing at the worst moment?" },
    },
    {
      t: "learn", art: "💱 🔎 📦",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Tập nhìn tỷ giá quanh mình:", en: "Notice exchange rates around you:" },
      items: [
        ["🔎", { vi: "Tra tỷ giá USD/VND hôm nay ở trang ngân hàng — giá mua và giá bán khác nhau bao nhiêu?", en: "Look up today's USD/VND at a bank's site — how far apart are the buy and sell prices?" }],
        ["📦", { vi: "Đồ bạn dùng: món nào nhập khẩu (sẽ đắt lên khi USD tăng), món nào làm trong nước?", en: "Your stuff: what's imported (dearer when the dollar rises), what's made locally?" }],
        ["🧠", { vi: "Đọc tin tỷ giá: hỏi 'ai được, ai thiệt?'", en: "Reading FX news: ask 'who wins, who loses?'" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Cảng biển & quầy đổi tiền (phần chơi xuất nhập khẩu sắp có)!", en: "🎮 Unlocked in the game: the Harbour & exchange desk (import–export gameplay coming soon)!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "🍔 = 🍔", fs: 32,
      title: { vi: "Ngang giá sức mua (PPP)", en: "Purchasing power parity (PPP)" },
      text: {
        vi: "Ý tưởng: về lâu dài, cùng một món hàng nên có giá tương đương ở mọi nước khi quy đổi. Nếu lạm phát Việt Nam cao hơn Mỹ 2%/năm, đồng có xu hướng mất giá khoảng 2%/năm so với USD. Tạp chí The Economist làm 'chỉ số Big Mac' để minh họa vui ý tưởng này. Trong ngắn hạn, tỷ giá lệch khỏi PPP rất nhiều vì dòng vốn, lãi suất, tâm lý.",
        en: "The idea: in the long run, the same item should cost about the same everywhere once converted. If Vietnam's inflation is 2% a year above America's, the dong tends to lose about 2% a year against the dollar. The Economist's 'Big Mac index' illustrates this playfully. In the short run, rates stray far from PPP because of capital flows, interest rates and mood.",
      },
    },
    {
      t: "calc", q: { vi: "Lạm phát Việt Nam 4%/năm, Mỹ 2%/năm, tỷ giá hiện 25.000 (theo PPP, gần đúng).", en: "Vietnam's inflation 4% a year, the US 2%, rate now 25,000 (by PPP, approximately)." },
      parts: [
        { label: { vi: "Đồng mất giá khoảng bao nhiêu %/năm?", en: "About how many % a year does the dong weaken?" }, a: 2, tol: 0.05, unit: "%" },
        { label: { vi: "Tỷ giá sau 1 năm khoảng (₫/USD)", en: "The rate after a year, about (₫/USD)" }, a: 25500, tol: 10, unit: "₫" },
      ],
      why: { vi: "4 − 2 = 2%. 25.000 × 1,02 = 25.500. Đây là xu hướng dài hạn, không phải dự báo cho từng năm.", en: "4 − 2 = 2%. 25,000 × 1.02 = 25,500. A long-run tendency, not a forecast for any given year." },
    },
  ],
};
export default lesson;
