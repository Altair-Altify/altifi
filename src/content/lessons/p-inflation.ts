/* Personal finance · Lesson 2 — Emergency fund, inflation & compound interest (with animated video)
 * Survey misconceptions targeted (design doc 1.3): compound vs simple interest; inflation ≠ the dong falling vs the dollar.
 * ⚠️ Verify before submission: Vietnam's 2008 average CPI inflation ≈ 23% (GSO). All other numbers are computed here. */
import type { Lesson } from "../../lesson/types";
import type { VideoDef } from "../../lesson/video";

const BG1 = "linear-gradient(160deg,#E8E9FF,#FFF1C7)";
const BG2 = "linear-gradient(160deg,#D9F7E7,#E8F4FF)";
const BG3 = "linear-gradient(160deg,#FFE1E1,#FFF1C7)";

export const compoundVideo: VideoDef = {
  id: "v-compound",
  title: { vi: "Lãi kép: quả cầu tuyết của tiền", en: "Compound interest: money's snowball" },
  scenes: [
    {
      dur: 4200, bg: BG1,
      say: { vi: "Đây là câu chuyện về một quả cầu tuyết… làm bằng tiền.", en: "This is the story of a snowball… made of money." },
      els: [{ k: "emoji", e: "⛄", size: 84, anim: "pop" }, { k: "h", text: { vi: "Lãi kép", en: "Compound interest" }, at: 500 }, { k: "p", text: { vi: "quả cầu tuyết của tiền", en: "money's snowball" }, at: 900 }],
    },
    {
      dur: 6500, bg: BG1,
      say: { vi: "Bạn gửi 10 triệu đồng, lãi 8 phần trăm một năm. Với lãi đơn, năm nào bạn cũng chỉ nhận 800 nghìn — vì lãi chỉ tính trên tiền gốc.", en: "You deposit 10 million dong at 8 percent a year. With simple interest, you get 800 thousand every year — interest only on the original money." },
      els: [
        { k: "tag", text: { vi: "LÃI ĐƠN", en: "SIMPLE INTEREST" }, color: "#8E8DAF", anim: "fade" },
        { k: "big", text: "10.000.000₫ × 8%", at: 300 },
        { k: "bars", at: 900, max: 1000000, bars: [
          { label: { vi: "Năm 1", en: "Year 1" }, v: 800000, color: "#B3B2CC", txt: "800k" },
          { label: { vi: "Năm 2", en: "Year 2" }, v: 800000, color: "#B3B2CC", txt: "800k" },
          { label: { vi: "Năm 3", en: "Year 3" }, v: 800000, color: "#B3B2CC", txt: "800k" },
        ] },
      ],
    },
    {
      dur: 7000, bg: BG2,
      say: { vi: "Với lãi kép, tiền lãi được cộng vào gốc, rồi lại sinh lãi. Năm hai bạn nhận 864 nghìn, năm ba 933 nghìn. Lãi sinh ra lãi!", en: "With compound interest, interest is added to your money and earns interest too. Year two pays 864 thousand, year three 933 thousand. Interest on interest!" },
      els: [
        { k: "tag", text: { vi: "LÃI KÉP", en: "COMPOUND INTEREST" }, color: "#2BB673", anim: "fade" },
        { k: "bars", at: 400, max: 1000000, bars: [
          { label: { vi: "Năm 1", en: "Year 1" }, v: 800000, color: "#2BB673", txt: "800k" },
          { label: { vi: "Năm 2", en: "Year 2" }, v: 864000, color: "#2BB673", txt: "864k" },
          { label: { vi: "Năm 3", en: "Year 3" }, v: 933120, color: "#2BB673", txt: "933k" },
        ] },
        { k: "p", text: { vi: "💡 lãi được cộng vào gốc → năm sau lãi trên số lớn hơn", en: "💡 interest joins the pile → next year's interest is on a bigger pile" }, at: 1600 },
      ],
    },
    {
      dur: 7000, bg: BG2,
      say: { vi: "Sau 30 năm, lãi đơn cho bạn 34 triệu. Lãi kép cho khoảng 100 triệu — gần gấp ba!", en: "After 30 years, simple interest gives you 34 million. Compound interest gives about 100 million — nearly three times as much!" },
      els: [
        { k: "h", text: { vi: "Sau 30 năm", en: "After 30 years" } },
        { k: "row", at: 300, els: [
          { k: "counter", from: 10000000, to: 34000000, unit: "mvnd", color: "#8E8DAF", label: { vi: "lãi đơn", en: "simple" }, at: 400 },
          { k: "counter", from: 10000000, to: 100626569, unit: "mvnd", color: "#1E8E58", label: { vi: "lãi kép", en: "compound" }, at: 400, ms: 2600 },
        ] },
        { k: "emoji", e: "⛄➡️☃️", size: 44, at: 2600 },
      ],
    },
    {
      dur: 7500, bg: BG1,
      say: { vi: "Thời gian là siêu năng lực. Gửi 10 triệu lúc 15 tuổi, đến 60 tuổi thành khoảng 319 triệu. Đợi tới 25 tuổi mới gửi: chỉ khoảng 148 triệu.", en: "Time is the superpower. Put 10 million in at age 15 and by 60 it's about 319 million. Wait until 25: only about 148 million." },
      els: [
        { k: "h", text: { vi: "⏳ Bắt đầu sớm", en: "⏳ Start early" } },
        { k: "bars", at: 400, bars: [
          { label: { vi: "Bắt đầu lúc 15", en: "Start at 15" }, v: 319204494, color: "#5B5BD6", txt: { vi: "~319 tr", en: "~319M" } },
          { label: { vi: "Bắt đầu lúc 25", en: "Start at 25" }, v: 147853443, color: "#B3B2CC", txt: { vi: "~148 tr", en: "~148M" } },
        ] },
        { k: "p", text: { vi: "cùng 10 triệu, cùng 8%/năm, rút ra lúc 60 tuổi", en: "same 10 million, same 8% a year, cashed out at 60" }, at: 1400 },
      ],
    },
    {
      dur: 7500, bg: BG3,
      say: { vi: "Quy tắc 72: lấy 72 chia cho lãi suất để biết bao lâu thì tiền gấp đôi. Nhưng nó chạy cả chiều ngược lại: nợ thẻ 24 phần trăm một năm, chỉ khoảng 3 năm là nợ gấp đôi!", en: "The rule of 72: divide 72 by the interest rate to see how long money takes to double. But it works backwards too: card debt at 24 percent a year doubles in about 3 years!" },
      els: [
        { k: "tag", text: { vi: "QUY TẮC 72", en: "RULE OF 72" }, color: "#5B5BD6", anim: "fade" },
        { k: "big", text: { vi: "72 ÷ lãi suất = số năm gấp đôi", en: "72 ÷ rate = years to double" }, at: 300 },
        { k: "row", at: 900, els: [
          { k: "html", html: `<div class="v-mini good">🐷 8% → ~9 ${"⏳"}</div>` },
          { k: "html", html: `<div class="v-mini bad">💳 24% → ~3 ⚠️</div>`, at: 600 },
        ] },
      ],
    },
    {
      dur: 5200, bg: BG1,
      say: { vi: "Nhớ ba điều: bắt đầu sớm, để yên cho tiền lớn lên, và tránh nợ lãi cao.", en: "Remember three things: start early, leave it alone to grow, and avoid high-interest debt." },
      els: [
        { k: "emoji", e: "🦁", size: 64, anim: "pop" },
        { k: "p", text: { vi: "1️⃣ Bắt đầu sớm", en: "1️⃣ Start early" }, at: 400, anim: "left" },
        { k: "p", text: { vi: "2️⃣ Để yên cho tiền lớn", en: "2️⃣ Let it grow" }, at: 900, anim: "left" },
        { k: "p", text: { vi: "3️⃣ Tránh nợ lãi cao", en: "3️⃣ Avoid high-interest debt" }, at: 1400, anim: "left" },
      ],
    },
  ],
};

const lesson: Lesson = {
  id: "p-inflation",
  domain: "personal",
  icon: "⛄",
  ic: "percent",
  minutes: 8,
  title: { vi: "Lạm phát, lãi kép & quỹ khẩn cấp", en: "Inflation, compounding & emergency funds" },
  desc: {
    vi: "Vì sao tiền để yên lại 'teo' đi, lạm phát khác tỷ giá ra sao, lãi suất thực, quy tắc 72 và nên cất quỹ khẩn cấp ở đâu.",
    en: "Why idle cash 'shrinks', how inflation differs from the exchange rate, real interest, the rule of 72, and where an emergency fund belongs.",
  },
  prereq: { vi: "lãi suất là 'giá' của việc dùng tiền: gửi thì được trả lãi, vay thì phải trả lãi.", en: "interest is the 'price' of using money: savers get paid interest, borrowers pay it." },
  review: {
    title: { vi: "Lãi suất & lạm phát", en: "Interest & inflation" },
    points: [
      { vi: "Gửi tiền → ngân hàng trả lãi cho bạn. Vay tiền → bạn trả lãi.", en: "Save → the bank pays you interest. Borrow → you pay interest." },
      { vi: "Lãi kép = lãi trên cả tiền lãi cũ ⛄.", en: "Compound interest = interest on past interest ⛄." },
      { vi: "Lạm phát = giá cả <b>nói chung</b> tăng (đo bằng CPI).", en: "Inflation = prices <b>in general</b> rise (measured by CPI)." },
      { vi: "Lãi suất thực ≈ lãi suất − lạm phát.", en: "Real interest ≈ interest rate − inflation." },
    ],
  },
  info: {
    s: { vi: "Lạm phát làm tiền mất sức mua; lãi kép giúp tiền lớn nhanh — lãi suất thực ≈ lãi − lạm phát.", en: "Inflation erodes buying power; compounding grows money fast — real rate ≈ interest − inflation." },
    l: {
      vi: "Lạm phát là khi mặt bằng giá chung tăng (đo bằng CPI), nên tiền để yên mua được ít hơn. Nó khác với việc VND mất giá so với USD (đó là tỷ giá). Lãi kép là lãi sinh ra trên cả tiền lãi cũ — càng để lâu càng lớn; quy tắc 72 ước lượng thời gian gấp đôi. Thứ thật sự quan trọng là lãi suất thực ≈ lãi suất − lạm phát. Quỹ khẩn cấp (3–6 tháng chi phí thiết yếu) nên để ở nơi an toàn, rút nhanh.",
      en: "Inflation is a rise in the general price level (measured by CPI), so idle money buys less. It's different from the dong weakening against the dollar (that's the exchange rate). Compound interest is interest earned on past interest — the longer, the bigger; the rule of 72 estimates doubling time. What really matters is the real rate ≈ interest − inflation. An emergency fund (3–6 months of essentials) belongs somewhere safe and quick to access.",
    },
  },
  kb: ["inflation", "realrate", "compound", "emergency", "fx"],
  steps: [
    { t: "video", video: compoundVideo },
    {
      t: "learn", photo: { query: "Ben Thanh Market Ho Chi Minh City" }, art: "🧋 30.000₫ → 🧋 33.000₫", cap: { vi: "Cùng một ly, giá cao hơn", en: "Same drink, higher price" },
      title: { vi: "Lạm phát: tiền 'teo' trong ngăn kéo", en: "Inflation: money shrinking in the drawer" },
      text: {
        vi: "Lạm phát là khi <b>mặt bằng giá chung</b> tăng lên — không chỉ một món. Ở Việt Nam, Cục Thống kê đo nó bằng <b>chỉ số giá tiêu dùng (CPI)</b>: giá của một 'giỏ' hàng hóa, dịch vụ mà gia đình hay mua. Năm 2008, lạm phát bình quân ở Việt Nam lên tới khoảng <b>23%</b> — tiền tiết kiệm mất gần một phần tư sức mua chỉ trong một năm.",
        en: "Inflation is when the <b>general price level</b> rises — not just one item. Vietnam's statistics office measures it with the <b>consumer price index (CPI)</b>: the price of a 'basket' of goods and services households typically buy. In 2008, Vietnam's average inflation reached about <b>23%</b> — savings lost nearly a quarter of their buying power in one year.",
      },
    },
    {
      t: "mcq", q: { vi: "Câu nào mô tả ĐÚNG lạm phát?", en: "Which one CORRECTLY describes inflation?" },
      o: [
        { vi: "Mặt bằng giá chung tăng, cùng số tiền mua được ít hơn", en: "The general price level rises, so the same money buys less" },
        { vi: "Đồng Việt Nam mất giá so với đô la Mỹ", en: "The Vietnamese dong loses value against the US dollar" },
        { vi: "Giá một món hàng tăng vì hết hàng", en: "One product's price rises because it sold out" },
        { vi: "Ngân hàng giảm lãi suất tiết kiệm", en: "Banks cut savings interest rates" },
      ],
      a: 0,
      why: {
        vi: "Bẫy phổ biến! VND mất giá so với USD là chuyện <b>tỷ giá</b> (giá của đồng tiền so với ngoại tệ). Lạm phát đo giá cả <b>trong nước</b>. Hai thứ có thể liên quan, nhưng không phải một.",
        en: "Classic trap! The dong weakening against the dollar is about the <b>exchange rate</b> (a currency's price in foreign money). Inflation measures <b>domestic</b> prices. They can be linked, but they're not the same thing.",
      },
      hint: { vi: "Lạm phát nói về giá của <b>hàng hóa</b> nói chung, không phải giá của một đồng tiền khác.", en: "Inflation is about the price of <b>goods</b> in general, not the price of another currency." },
    },
    {
      t: "sort", q: { vi: "Lạm phát hay tỷ giá?", en: "Inflation or exchange rate?" },
      buckets: [["🛒", { vi: "Lạm phát", en: "Inflation" }], ["💱", { vi: "Tỷ giá", en: "Exchange rate" }]],
      items: [
        ["🍜", { vi: "Bát phở từ 40k lên 45k, rau thịt cũng tăng", en: "Phở goes 40k → 45k, and veg and meat too" }, 0],
        ["💵", { vi: "1 USD đổi được nhiều VND hơn năm ngoái", en: "1 USD buys more dong than last year" }, 1],
        ["📊", { vi: "CPI tăng 4% so với cùng kỳ", en: "CPI up 4% year on year" }, 0],
        ["🎓", { vi: "Học phí ở Mỹ không đổi (USD) nhưng tính ra VND đắt hơn", en: "US tuition unchanged in USD but costs more in dong" }, 1],
        ["⚡", { vi: "Điện, xăng, thực phẩm cùng tăng giá", en: "Power, fuel and food all get pricier" }, 0],
        ["📱", { vi: "iPhone nhập khẩu đắt hơn chỉ vì đô la lên giá", en: "Imported iPhones cost more only because the dollar rose" }, 1],
      ],
      why: { vi: "Giá nhiều thứ trong nước cùng tăng → lạm phát. Giá của đồng tiền so với ngoại tệ thay đổi → tỷ giá.", en: "Many domestic prices rising together → inflation. A currency's price vs foreign money changing → exchange rate." },
      hint: { vi: "Có nhắc tới USD/ngoại tệ không? Nếu có, thường là tỷ giá.", en: "Does it mention USD or foreign money? If so, it's usually the exchange rate." },
    },
    {
      t: "calc", q: { vi: "Bạn gửi 10.000.000₫, lãi 6%/năm. Lạm phát năm đó 4%.", en: "You deposit 10,000,000₫ at 6% a year. Inflation that year is 4%." },
      art: "🏦 6% vs 🛒 4%",
      parts: [
        { label: { vi: "Tiền lãi nhận được sau 1 năm (₫)", en: "Interest earned after 1 year (₫)" }, a: 600000, tol: 0, unit: "₫" },
        { label: { vi: "Giỏ hàng 10 triệu hôm nay, năm sau giá bao nhiêu? (₫)", en: "A 10-million basket today costs how much next year? (₫)" }, a: 10400000, tol: 0, unit: "₫" },
        { label: { vi: "Lãi suất thực xấp xỉ (%)", en: "Approximate real interest rate (%)" }, a: 2, tol: 0.1, unit: "%" },
      ],
      why: { vi: "Lãi 600.000₫, nhưng giỏ hàng đắt thêm 400.000₫ → sức mua chỉ tăng ~200.000₫ = ~2%. Lãi suất thực ≈ 6% − 4%.", en: "You earn 600,000₫, but the basket costs 400,000₫ more → buying power grows only ~200,000₫ = ~2%. Real rate ≈ 6% − 4%." },
      hint: { vi: "Bước 3: lãi suất thực ≈ lãi suất danh nghĩa − lạm phát.", en: "Step 3: real rate ≈ nominal rate − inflation." },
    },
    {
      t: "chart", q: { vi: "10 triệu, 8%/năm. Sau 30 năm, lãi kép cho số tiền khoảng gấp mấy lần lãi đơn?", en: "10 million at 8% a year. After 30 years, compound gives roughly how many times as much as simple?" },
      chart: {
        kind: "bar",
        labels: [{ vi: "0 năm", en: "0 yrs" }, { vi: "10 năm", en: "10 yrs" }, { vi: "20 năm", en: "20 yrs" }, { vi: "30 năm", en: "30 yrs" }],
        series: [
          { name: { vi: "Lãi đơn", en: "Simple" }, color: "#B3B2CC", data: [10, 18, 26, 34] },
          { name: { vi: "Lãi kép", en: "Compound" }, color: "#2BB673", data: [10, 21.6, 46.6, 100.6] },
        ],
        y: { vi: "triệu ₫", en: "million ₫" },
        source: { vi: "Tính toán minh họa, lãi ghép hằng năm", en: "Illustrative calculation, compounded yearly" },
      },
      o: [{ vi: "Khoảng 3 lần", en: "About 3 times" }, { vi: "Bằng nhau", en: "The same" }, { vi: "Khoảng 10 lần", en: "About 10 times" }, { vi: "Ít hơn lãi đơn", en: "Less than simple" }],
      a: 0,
      why: { vi: "100,6 ÷ 34 ≈ 3. Để ý: 10 năm đầu hai cột gần bằng nhau, khoảng cách bùng lên về sau — đó là lý do 'thời gian' quan trọng nhất.", en: "100.6 ÷ 34 ≈ 3. Notice the bars are close for the first 10 years and the gap explodes later — that's why time matters most." },
      hint: { vi: "So cột 30 năm: 100,6 và 34.", en: "Compare the 30-year bars: 100.6 and 34." },
    },
    {
      t: "predict", q: { vi: "Đoán thử: gửi tiền lãi kép 6%/năm thì bao nhiêu năm tiền gấp đôi?", en: "Guess: at 6% a year compounded, how many years until money doubles?" },
      art: "💰 → 💰💰", min: 1, max: 30, step: 1, start: 20, actual: 11.9, unit: "yr",
      reveal: { vi: "Khoảng 12 năm. Quy tắc 72: 72 ÷ 6 = 12. (Chính xác là 11,9 năm.) Nhiều người đoán gần 17 năm — vì quen nghĩ theo lãi đơn: 100% ÷ 6%.", en: "About 12 years. Rule of 72: 72 ÷ 6 = 12 (exactly 11.9). Many people guess ~17 years — thinking in simple interest: 100% ÷ 6%." },
    },
    {
      t: "match", q: { vi: "Nối khái niệm với ý nghĩa", en: "Match each idea to its meaning" },
      pairs: [
        [{ vi: "☂️ Quỹ khẩn cấp", en: "☂️ Emergency fund" }, { vi: "3–6 tháng chi phí thiết yếu", en: "3–6 months of essential costs" }],
        [{ vi: "📉 Lãi suất thực", en: "📉 Real interest" }, { vi: "Lãi danh nghĩa − lạm phát", en: "Nominal rate − inflation" }],
        [{ vi: "7️⃣2️⃣ Quy tắc 72", en: "7️⃣2️⃣ Rule of 72" }, { vi: "Số năm gấp đôi ≈ 72 ÷ lãi suất", en: "Years to double ≈ 72 ÷ rate" }],
        [{ vi: "🛒 CPI", en: "🛒 CPI" }, { vi: "Giá của một giỏ hàng tiêu biểu", en: "Price of a typical basket" }],
      ],
      why: { vi: "Bốn công cụ này đủ để bạn đánh giá một khoản tiết kiệm có thật sự 'lớn lên' hay không.", en: "These four tools let you judge whether savings are really growing." },
    },
    {
      t: "pick", q: { vi: "Quỹ khẩn cấp nên để ở đâu?", en: "Where should an emergency fund live?" },
      opts: [["📈", { vi: "Cổ phiếu một công ty bạn thích", en: "Shares of a company you like" }], ["🥇", { vi: "Vàng cất ở nhà", en: "Gold kept at home" }], ["🏦", { vi: "Tiết kiệm ngân hàng ngắn hạn / không kỳ hạn", en: "Short-term or instant-access bank savings" }], ["🤝", { vi: "Cho bạn vay lấy lãi", en: "Lend it to a friend for interest" }]],
      a: 2,
      why: { vi: "Quỹ khẩn cấp cần <b>an toàn</b> và <b>rút nhanh</b> hơn là lợi nhuận cao. Cổ phiếu và vàng có thể giảm giá đúng lúc bạn cần tiền.", en: "An emergency fund needs to be <b>safe</b> and <b>quick to reach</b> more than high-return. Stocks and gold can drop exactly when you need the money." },
      hint: { vi: "Khi có chuyện gấp, bạn cần tiền ngay và không muốn nó vừa mất giá.", en: "In an emergency you need the money now — and not right after it lost value." },
    },
    {
      t: "order", q: { vi: "Sắp xếp thứ tự ưu tiên hợp lý cho người mới đi làm", en: "Order these priorities for someone with a first job" },
      items: [["🪣", { vi: "Để dành một quỹ khẩn cấp nhỏ", en: "Build a small emergency buffer" }], ["💳", { vi: "Trả hết nợ lãi cao (thẻ, BNPL)", en: "Pay off high-interest debt (cards, BNPL)" }], ["☂️", { vi: "Đủ quỹ khẩn cấp 3–6 tháng", en: "Grow the fund to 3–6 months" }], ["🌳", { vi: "Đầu tư dài hạn, đa dạng hóa", en: "Invest long-term, diversified" }]],
      why: { vi: "Trả nợ lãi 24%/năm là 'lợi nhuận chắc chắn' 24% — khó khoản đầu tư nào sánh được. Nhưng nên có một quỹ nhỏ trước để khỏi vay thêm khi có chuyện.", en: "Paying off 24%-a-year debt is a guaranteed 24% 'return' — hard to beat. But keep a small buffer first so a surprise doesn't push you into new debt." },
    },
  ],
  deep: [
    {
      t: "learn", art: "(1 + i) = (1 + r)(1 + π)",
      fs: 26,
      title: { vi: "Phương trình Fisher (bản chính xác)", en: "The Fisher equation (exact form)" },
      text: {
        vi: "Công thức 'lãi − lạm phát' chỉ là xấp xỉ. Nhà kinh tế Irving Fisher viết chính xác: <b>(1 + i) = (1 + r)(1 + π)</b>, với i là lãi danh nghĩa, r là lãi thực, π là lạm phát. Suy ra <b>r = (1 + i)/(1 + π) − 1</b>. Khi lạm phát cao (như 23% năm 2008), sai số của phép xấp xỉ trở nên đáng kể.",
        en: "'Rate minus inflation' is only an approximation. Economist Irving Fisher wrote it exactly: <b>(1 + i) = (1 + r)(1 + π)</b>, where i is the nominal rate, r the real rate and π inflation. So <b>r = (1 + i)/(1 + π) − 1</b>. When inflation is high (like 23% in 2008), the approximation error becomes significant.",
      },
    },
    {
      t: "calc", q: { vi: "Dùng công thức chính xác và quy tắc 72:", en: "Use the exact formula and the rule of 72:" },
      parts: [
        { label: { vi: "Lãi thực chính xác khi i = 6%, π = 4% (%, 2 chữ số thập phân)", en: "Exact real rate with i = 6%, π = 4% (%, 2 decimals)" }, a: 1.92, tol: 0.02, unit: "%" },
        { label: { vi: "Lãi thực chính xác khi i = 8%, π = 23% (%, 1 chữ số thập phân)", en: "Exact real rate with i = 8%, π = 23% (%, 1 decimal)" }, a: -12.2, tol: 0.1, unit: "%" },
        { label: { vi: "Theo quy tắc 72, lãi 9%/năm thì bao nhiêu năm gấp đôi?", en: "Rule of 72: years to double at 9% a year?" }, a: 8, tol: 0, unit: { vi: "năm", en: "years" } },
      ],
      why: { vi: "1,06/1,04 − 1 = 1,92%. 1,08/1,23 − 1 = −12,2% (xấp xỉ sẽ ra −15%). 72 ÷ 9 = 8 năm.", en: "1.06/1.04 − 1 = 1.92%. 1.08/1.23 − 1 = −12.2% (the shortcut says −15%). 72 ÷ 9 = 8 years." },
      hint: { vi: "Lãi thực âm nghĩa là tiền gửi mất sức mua — nhớ dấu trừ.", en: "A negative real rate means deposits lose buying power — keep the minus sign." },
    },
    {
      t: "mcq", q: { vi: "Lạm phát tăng vọt bất ngờ. Ai thường được lợi?", en: "Inflation jumps unexpectedly. Who usually benefits?" },
      o: [
        { vi: "Người đang vay với lãi suất cố định", en: "People with fixed-rate loans" },
        { vi: "Người gửi tiết kiệm kỳ hạn dài lãi cố định", en: "Savers locked into long fixed-rate deposits" },
        { vi: "Người giữ nhiều tiền mặt", en: "People holding lots of cash" },
        { vi: "Người cho vay lãi cố định", en: "Fixed-rate lenders" },
      ],
      a: 0,
      why: { vi: "Giá trị thực của khoản nợ cố định giảm khi giá cả tăng — của cải chuyển từ chủ nợ sang con nợ. Người gửi, người giữ tiền mặt và người cho vay lãi cố định chịu thiệt.", en: "The real value of a fixed debt falls as prices rise — wealth shifts from creditors to debtors. Savers, cash holders and fixed-rate lenders lose." },
    },
    {
      t: "explain", q: { vi: "Vì sao giữ tiền mặt dưới gối khi lạm phát 4% là 'lỗ', dù số tiền không đổi?", en: "Why is keeping cash under the mattress a 'loss' at 4% inflation, even though the amount doesn't change?" },
      keys: [
        { label: { vi: "Sức mua giảm", en: "Buying power falls" }, words: { vi: ["sức mua", "mua được ít", "mua ít hơn", "giá trị thực"], en: ["buying power", "purchasing power", "buy less", "real value"] } },
        { label: { vi: "Giá cả tăng", en: "Prices rise" }, words: { vi: ["giá tăng", "giá cả tăng", "đắt hơn", "lạm phát"], en: ["prices rise", "prices go up", "more expensive", "inflation"] } },
        { label: { vi: "Không sinh lãi", en: "Earns no interest" }, words: { vi: ["không có lãi", "không sinh lãi", "lãi suất", "không lãi", "lãi thực"], en: ["no interest", "interest", "real rate", "earns nothing"] } },
      ],
      need: 2,
      model: { vi: "Vì giá cả tăng 4% mỗi năm nên cùng số tiền mua được ít hơn — sức mua giảm, trong khi tiền mặt không sinh lãi để bù lại (lãi thực ≈ −4%).", en: "Prices rise 4% a year, so the same cash buys less — its buying power falls — and cash earns no interest to make up for it (real rate ≈ −4%)." },
      why: { vi: "Ý chính: lỗ ở đây là lỗ <b>sức mua</b>, không phải lỗ số tiền.", en: "Key idea: the loss is in <b>buying power</b>, not in the number." },
    },
  ],
};
export default lesson;
