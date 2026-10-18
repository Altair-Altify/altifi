/* Investing · I2 — "Gold, land, crypto: why do prices swing so wildly?" (design doc 13.2d ④, 6-beat frame 13.2c)
 * Intrinsic value vs market price, bubbles, safe-haven assets (deep dive: hedging with derivatives — airlines & fuel).
 * Trap: "a high price = worth a lot".
 * ⚠️ Draft written with AI help — team review. Verify: Nasdaq ≈ 5,048 (10 Mar 2000) → ≈ 1,114 (Oct 2002), about −78%;
 * Bitcoin ≈ $69,000 (Nov 2021) → ≈ $16,000 (Nov 2022); tulip mania, Netherlands 1636–37; gold tends to rise in crises
 * (e.g. 2008–2011, 2020). Not investment advice. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "i-bubbles",
  domain: "markets",
  icon: "🫧",
  ic: "coin",
  minutes: 6,
  title: { vi: "Vàng, đất, tiền ảo: vì sao giá lên xuống điên cuồng?", en: "Gold, land, crypto: why do prices swing so wildly?" },
  desc: {
    vi: "Giá trị thật và giá thị trường, bong bóng hình thành và vỡ ra sao, tài sản 'trú ẩn' khi bất ổn — và vì sao giá cao chưa chắc đáng giá.",
    en: "Real value vs market price, how bubbles inflate and burst, 'safe-haven' assets in uncertain times — and why a high price isn't proof of worth.",
  },
  prereq: { vi: "rủi ro và đa dạng hóa (bài I1).", en: "risk and diversification (lesson I1)." },
  review: {
    title: { vi: "Bong bóng", en: "Bubbles" },
    points: [
      { vi: "<b>Giá trị thật</b> đến từ thứ tài sản tạo ra (lợi nhuận, tiền thuê, công dụng).", en: "<b>Real value</b> comes from what an asset produces (profits, rent, use)." },
      { vi: "<b>Giá thị trường</b> = điều người ta sẵn sàng trả hôm nay — có thể xa giá trị thật.", en: "<b>Market price</b> = what people will pay today — it can drift far from real value." },
      { vi: "Bong bóng: mua vì nghĩ 'sẽ có người mua lại giá cao hơn'.", en: "Bubble: buying because 'someone will pay more later'." },
      { vi: "Giá cao ≠ đáng giá. Đừng dùng tiền vay hay tiền cần dùng.", en: "High price ≠ high worth. Never use borrowed or needed money." },
    ],
  },
  info: {
    s: { vi: "Bong bóng là khi giá vượt xa giá trị thật vì người ta mua chỉ để bán lại giá cao hơn; khi niềm tin mất, giá sụp.", en: "A bubble is when prices run far above real value because people buy only to resell higher; when belief fades, prices crash." },
    l: {
      vi: "Một tài sản có giá trị thật nhờ thứ nó tạo ra: doanh nghiệp tạo lợi nhuận, căn nhà cho thuê được, vàng có công dụng và được tin dùng lâu đời. Giá thị trường là mức người mua và người bán gặp nhau hôm nay — có thể cao hơn nhiều nếu ai cũng tin giá sẽ còn tăng. Khi người ta mua chủ yếu để bán lại cho người khác giá cao hơn, đó là bong bóng. Bong bóng vỡ khi không còn người mua mới. Vàng thường được coi là tài sản 'trú ẩn' khi bất ổn, nhưng giá vàng cũng có thể giảm nhiều năm liền. Tiền ảo biến động cực mạnh vì khó xác định giá trị thật.",
      en: "An asset has real value from what it produces: a business makes profit, a home can be rented, gold has uses and long-standing trust. Market price is where buyers and sellers meet today — it can be far higher if everyone believes prices will keep rising. When people buy mainly to resell to someone else at a higher price, that's a bubble. It bursts when new buyers run out. Gold is often seen as a 'safe haven' in uncertain times, but its price can also fall for years. Crypto swings extremely because its real value is hard to pin down.",
    },
  },
  kb: ["stocks", "inflation"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "tulip field Netherlands" }, art: "🌷 = 🏠 ?", cap: { vi: "Năm 1637, một củ hoa đắt ngang một căn nhà", en: "In 1637, a flower bulb cost as much as a house" },
      title: { vi: "Vàng, đất, tiền ảo: vì sao giá lên xuống điên cuồng?", en: "Gold, land, crypto: why do prices swing so wildly?" },
      text: {
        vi: "Ở Hà Lan khoảng năm 1636–1637, người ta tranh nhau mua củ hoa tulip; vài củ hiếm được rao giá ngang một căn nhà. Rồi chỉ trong vài tuần, giá sụp. Gần 400 năm sau, chuyện tương tự vẫn lặp lại với cổ phiếu công nghệ, đất 'sốt', tiền ảo. Vì sao người thông minh vẫn trả giá điên rồ — và làm sao nhận ra?",
        en: "In the Netherlands around 1636–37, people scrambled for tulip bulbs; a few rare bulbs were offered at the price of a house. Then within weeks, prices collapsed. Almost 400 years later the same story repeats with tech stocks, 'hot' land and crypto. Why do smart people pay crazy prices — and how can you spot it?",
      },
      lion: { vi: "Câu hỏi thần kỳ: “Thứ này tự tạo ra được gì?” 🫧", en: "The magic question: “What does this thing produce?” 🫧" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: chỉ số Nasdaq (cổ phiếu công nghệ Mỹ) đạt đỉnh tháng 3/2000. Đến tháng 10/2002 nó mất bao nhiêu %?", en: "Guess: the Nasdaq (US tech stocks) peaked in March 2000. By October 2002, how much had it lost?" },
      art: "💻📈 → 💻📉", min: 0, max: 100, step: 1, start: 20, actual: 78, unit: "pct",
      reveal: { vi: "Khoảng <b>78%</b> — từ ~5.048 xuống ~1.114 điểm. Nhiều công ty '.com' chưa từng có lợi nhuận nhưng được định giá hàng tỷ đô chỉ vì có chữ 'Internet'. Internet đúng là tương lai — nhưng giá đã chạy trước giá trị quá xa.", en: "About <b>78%</b> — from ~5,048 to ~1,114. Many '.com' firms had never made a profit but were valued in billions just for saying 'Internet'. The internet really was the future — but prices had run far ahead of value." },
    },
    /* 3 · Mechanism */
    {
      t: "order", q: { vi: "Sắp xếp các giai đoạn của một bong bóng", en: "Put the stages of a bubble in order" },
      items: [
        ["💡", { vi: "Có một câu chuyện mới hấp dẫn (công nghệ, quy hoạch, đồng tiền mới)", en: "An exciting new story appears (technology, zoning plans, a new coin)" }],
        ["📈", { vi: "Giá tăng, người mua sớm lời to, báo chí đưa tin", en: "Prices rise, early buyers make big gains, the news picks it up" }],
        ["🏃", { vi: "Đám đông đổ vào vì sợ lỡ, nhiều người vay tiền để mua", en: "The crowd rushes in out of FOMO, many borrow to buy" }],
        ["🫧", { vi: "Giá vượt xa giá trị thật — mua chỉ để bán lại giá cao hơn", en: "Prices far above real value — buying only to resell higher" }],
        ["💥", { vi: "Hết người mua mới, giá sụp, người vay nợ bị bán tháo", en: "New buyers run out, prices crash, borrowers are sold out" }],
      ],
      why: { vi: "Mẫu hình này lặp lại từ hoa tulip 1637 tới dot-com 2000, nhà đất Mỹ 2006, tiền ảo 2021. Nhận ra mình đang ở giai đoạn 'đám đông đổ vào' là tín hiệu nên cẩn thận.", en: "The pattern repeats from tulips in 1637 to dot-com in 2000, US housing in 2006 and crypto in 2021. Noticing you're in the 'crowd rushes in' stage is the signal to be careful." },
    },
    {
      t: "sort", q: { vi: "Đây là giá trị THẬT hay chỉ là kỳ vọng giá?", en: "Is this REAL value or just price hopes?" },
      buckets: [["🌱", { vi: "Giá trị thật", en: "Real value" }], ["🫧", { vi: "Chỉ là kỳ vọng giá", en: "Just price hopes" }]],
      items: [
        ["🏠", { vi: "Căn nhà cho thuê được 8 triệu/tháng", en: "A house that rents for 8 million a month" }, 0],
        ["📣", { vi: "“Đất này sắp lên giá vì có tin đồn làm sân bay”", en: "“This land will soar — there's a rumour of an airport”" }, 1],
        ["🏭", { vi: "Doanh nghiệp lãi đều 100 tỷ/năm", en: "A business earning a steady 100 billion a year" }, 0],
        ["🪙", { vi: "Đồng tiền ảo mới, “sẽ lên x100” theo hội nhóm", en: "A new coin that 'will go 100×', says a chat group" }, 1],
        ["🌾", { vi: "Mảnh ruộng thu hoạch lúa mỗi năm", en: "A field that yields a rice harvest every year" }, 0],
        ["🖼️", { vi: "Ảnh số mua 1 tỷ “vì người sau sẽ trả 2 tỷ”", en: "A digital picture bought for 1 billion 'because the next buyer will pay 2'" }, 1],
      ],
      why: { vi: "Giá trị thật có dòng tiền hoặc công dụng: tiền thuê, lợi nhuận, lúa gạo. Kỳ vọng giá chỉ dựa vào việc người khác sẽ trả cao hơn.", en: "Real value has cash flow or use: rent, profit, rice. Price hope relies only on someone else paying more." },
      hint: { vi: "Hỏi: nếu không ai mua lại, tài sản này còn mang lại gì cho mình?", en: "Ask: if nobody bought it from you, what would it still give you?" },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Giá Bitcoin (USD, làm tròn) 2020–2022. Điều gì xảy ra sau đỉnh cuối 2021?", en: "Bitcoin price (USD, rounded) 2020–2022. What happened after the late-2021 peak?" },
      chart: {
        kind: "line",
        labels: ["3/2020", "12/2020", "4/2021", "7/2021", "11/2021", "6/2022", "11/2022"],
        series: [{ name: { vi: "Giá (nghìn USD)", en: "Price (thousand USD)" }, color: "#F5A524", data: [6, 29, 63, 33, 69, 20, 16] }],
        y: { vi: "nghìn USD", en: "thousand USD" },
        source: { vi: "Giá tham khảo, làm tròn — cần kiểm chứng", en: "Indicative prices, rounded — to be verified" },
      },
      o: [{ vi: "Giảm hơn 75% trong một năm", en: "Fell more than 75% within a year" }, { vi: "Tăng gấp đôi", en: "Doubled" }, { vi: "Đứng yên", en: "Stayed flat" }, { vi: "Giảm 5%", en: "Fell 5%" }],
      a: 0,
      why: { vi: "Từ ~69 nghìn xuống ~16 nghìn USD (−77%). Trước đó cũng có những lần giảm một nửa rồi tăng lại. Biến động cực mạnh khiến tiền ảo không phải nơi cất tiền cần dùng. Ngược lại, vàng thường tăng khi thế giới bất ổn (2008–2011, 2020) — nhưng cũng có thể giảm nhiều năm.", en: "From ~69 thousand to ~16 thousand USD (−77%). Earlier it had also halved and recovered. Such extreme swings make crypto no place for money you need. Gold, by contrast, often rises in turbulent times (2008–2011, 2020) — but it can also fall for years." },
      hint: { vi: "So điểm 11/2021 với 11/2022.", en: "Compare Nov 2021 with Nov 2022." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Đất ở đây giá 100 triệu/m² rồi, chắc chắn đáng giá vì ai cũng mua.” Sai ở đâu?", en: "“Land here is already 100 million per m², so it must be worth it — everyone's buying.” What's wrong?" },
      o: [
        { vi: "Giá cao chỉ cho biết người ta ĐANG trả bao nhiêu, không cho biết nó tạo ra bao nhiêu (tiền thuê, sử dụng); đám đông có thể sai", en: "A high price only shows what people ARE paying, not what it produces (rent, use); the crowd can be wrong" },
        { vi: "Không sai — giá cao luôn đúng", en: "Nothing — high prices are always right" },
        { vi: "Sai vì đất không bao giờ tăng giá", en: "Wrong because land never rises" },
        { vi: "Sai vì phải mua ở nơi giá cao hơn nữa", en: "Wrong because you should buy somewhere even pricier" },
      ],
      a: 0,
      why: { vi: "Bẫy 'giá cao = đáng giá'. Thử tính: nếu cho thuê được bao nhiêu mỗi năm so với giá mua? Nếu tiền thuê chỉ bằng 1–2% giá mua, thấp hơn cả lãi tiết kiệm, người mua đang đặt cược vào việc giá tăng tiếp.", en: "The 'high price = high worth' trap. Try it: how much rent per year versus the price? If rent is only 1–2% of the price — less than savings interest — buyers are betting on prices rising further." },
      hint: { vi: "Thứ quyết định giá trị: ai cũng mua, hay nó tạo ra gì?", en: "What decides value: that everyone buys, or what it produces?" },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: chú bạn định vay ngân hàng mua đất ở nơi “sắp có quy hoạch, giá tăng gấp ba trong một năm”. Khuyên chú 1–2 câu.", en: "Final boss: your uncle plans to borrow to buy land where “a big project is coming, prices tripled in a year”. Advise him in 1–2 sentences." },
      keys: [
        { label: { vi: "Bong bóng / tin đồn / đám đông", en: "Bubble / rumour / crowd" }, words: { vi: ["bong bóng", "tin đồn", "đám đông", "sốt", "gấp ba", "fomo"], en: ["bubble", "rumour", "rumor", "crowd", "hype", "tripled", "fomo"] } },
        { label: { vi: "Giá trị thật / tiền thuê", en: "Real value / rent" }, words: { vi: ["giá trị thật", "tiền thuê", "cho thuê", "tạo ra", "sử dụng"], en: ["real value", "rent", "produce", "use"] } },
        { label: { vi: "Rủi ro vay nợ", en: "Borrowing risk" }, words: { vi: ["vay", "nợ", "lãi", "mất", "rủi ro"], en: ["borrow", "debt", "loan", "interest", "risk", "lose"] } },
      ],
      need: 2,
      model: { vi: "Giá tăng gấp ba nhờ tin đồn có thể là bong bóng — hãy xem mảnh đất cho thuê hay sử dụng được bao nhiêu; và đừng vay nợ, vì nếu giá sụp thì vẫn phải trả nợ lẫn lãi.", en: "Tripling on a rumour may be a bubble — check what the land could earn or be used for; and don't borrow, because if prices crash you still owe the loan and interest." },
      why: { vi: "Ý chính: hỏi giá trị thật, nhận ra dấu hiệu bong bóng, tránh dùng tiền vay.", en: "Key idea: ask about real value, spot bubble signs, avoid borrowed money." },
      hint: { vi: "Ba ý: tin đồn, giá trị thật, tiền vay.", en: "Three ideas: rumour, real value, borrowed money." },
    },
    {
      t: "learn", art: "🫧 🔎 🧺",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Lần tới nghe 'sắp lên giá' (đất, coin, vàng, thẻ game hiếm…):", en: "Next time you hear 'about to go up' (land, coins, gold, rare game cards…):" },
      items: [
        ["🔎", { vi: "Hỏi: nó tạo ra gì? Nếu không ai mua lại thì sao?", en: "Ask: what does it produce? What if nobody buys it from me?" }],
        ["📰", { vi: "Ai cũng đang bàn tán và vay tiền mua? → dấu hiệu giai đoạn cuối", en: "Is everyone talking about it and borrowing to buy? → a late-stage sign" }],
        ["🧺", { vi: "Vàng, đất, coin chỉ nên là một phần nhỏ — không bao giờ là tiền cần dùng", en: "Gold, land, coins should be a small slice — never money you need" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Tiệm vàng & đổi ngoại tệ ở Khu tài chính (phần chơi sắp có)!", en: "🎮 Unlocked in the game: the Gold & currency shop in the Finance District (gameplay coming soon)!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "✈️ ⛽ 🔒", fs: 30,
      title: { vi: "Phái sinh để phòng ngừa rủi ro: hãng bay và giá dầu", en: "Hedging with derivatives: airlines and oil" },
      text: {
        vi: "Nhiên liệu là chi phí lớn của hãng bay; giá dầu lên xuống thất thường. Để yên tâm, hãng bay có thể ký <b>hợp đồng tương lai</b> mua nhiên liệu giá cố định cho năm sau. Giá dầu tăng → hãng được lợi nhờ đã khóa giá; giá dầu giảm → hãng 'thiệt' so với mua giá chợ, nhưng đổi lại có chi phí ổn định để định giá vé. Đây là phái sinh dùng để <b>giảm</b> rủi ro — ngược với dùng phái sinh để đặt cược.",
        en: "Fuel is a huge cost for airlines, and oil prices swing. To sleep at night, an airline can sign a <b>futures contract</b> to buy next year's fuel at a fixed price. If oil rises, it gains from having locked in; if oil falls, it 'loses' versus the market price but gets stable costs to price tickets. That's derivatives used to <b>reduce</b> risk — the opposite of using them to bet.",
      },
    },
    {
      t: "calc", q: { vi: "Hãng bay khóa giá nhiên liệu 80 USD/thùng cho 1 triệu thùng.", en: "An airline locks fuel at $80 a barrel for 1 million barrels." },
      parts: [
        { label: { vi: "Giá thị trường lên 100: hãng tiết kiệm được (triệu USD)", en: "Market rises to 100: the airline saves (million USD)" }, a: 20, tol: 0.05, unit: { vi: "triệu USD", en: "million USD" } },
        { label: { vi: "Giá thị trường xuống 60: hãng trả cao hơn giá chợ (triệu USD)", en: "Market falls to 60: the airline pays more than market (million USD)" }, a: 20, tol: 0.05, unit: { vi: "triệu USD", en: "million USD" } },
      ],
      why: { vi: "(100 − 80) × 1 triệu = 20 triệu USD tiết kiệm; (80 − 60) × 1 triệu = 20 triệu USD 'thiệt'. Cái hãng mua là sự chắc chắn, không phải lợi nhuận.", en: "(100 − 80) × 1 million = $20 million saved; (80 − 60) × 1 million = $20 million 'lost'. What the airline buys is certainty, not profit." },
    },
  ],
};
export default lesson;
