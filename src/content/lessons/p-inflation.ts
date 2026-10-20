/* Personal finance · P3 — "4% inflation a year: what is 10 million left idle worth?" (design doc 13.2d, 6-beat frame 13.2c, with animated video)
 * Buying power, CPI, nominal vs real rate, compounding, rule of 72, emergency fund & liquidity. Survey trap targeted:
 * compound ≠ simple interest (12/46). Lesson 3 of the domain: a moderate number of terms; the deep dive adds the Fisher
 * equation and who wins from surprise inflation. 10,000,000 ÷ 1.04¹⁰ ≈ 6,755,642₫.
 * Where inflation comes from + "inflation ≠ the dong falling vs the dollar" moved to M1 (13.2e).
 * ⚠️ Draft written with AI help — team review. Verify: Vietnam's 2008 average CPI inflation ≈ 23% (GSO).
 * All other numbers are computed here (10M at 8% from 22 → 60: ≈ 186M; from 32: ≈ 86M). */
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
      say: { vi: "Thời gian là siêu năng lực. Gửi 10 triệu lúc 22 tuổi, đến 60 tuổi thành khoảng 186 triệu. Đợi tới 32 tuổi mới gửi: chỉ khoảng 86 triệu.", en: "Time is the superpower. Put 10 million in at age 22 and by 60 it's about 186 million. Wait until 32: only about 86 million." },
      els: [
        { k: "h", text: { vi: "⏳ Bắt đầu sớm", en: "⏳ Start early" } },
        { k: "bars", at: 400, bars: [
          { label: { vi: "Bắt đầu lúc 22", en: "Start at 22" }, v: 186252756, color: "#5B5BD6", txt: { vi: "~186 tr", en: "~186M" } },
          { label: { vi: "Bắt đầu lúc 32", en: "Start at 32" }, v: 86271064, color: "#B3B2CC", txt: { vi: "~86 tr", en: "~86M" } },
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
  minutes: 7,
  title: { vi: "Lạm phát 4% mỗi năm: 10 triệu để yên còn giá trị bao nhiêu?", en: "4% inflation a year: what is 10 million left idle worth?" },
  desc: {
    vi: "Sức mua và CPI, lãi suất thực = danh nghĩa − lạm phát, quả cầu tuyết lãi kép, quy tắc 72, và để quỹ khẩn cấp ở đâu.",
    en: "Buying power and the CPI, real rate = nominal rate − inflation, the compound-interest snowball, the rule of 72, and where an emergency fund belongs.",
  },
  prereq: { vi: "lãi suất là 'giá' của việc dùng tiền: gửi thì được trả lãi, vay thì phải trả lãi.", en: "interest is the 'price' of using money: savers get paid interest, borrowers pay it." },
  review: {
    title: { vi: "Sức mua & lãi kép", en: "Buying power & compounding" },
    points: [
      { vi: "Giá cả tăng → cùng số tiền mua được ít hơn (mất <b>sức mua</b>); lạm phát đo bằng CPI.", en: "Prices rise → the same money buys less (it loses <b>buying power</b>); inflation is measured by the CPI." },
      { vi: "Lãi suất thực ≈ lãi suất danh nghĩa − lạm phát.", en: "Real interest ≈ nominal rate − inflation." },
      { vi: "Lãi kép = lãi trên cả tiền lãi cũ ⛄ — KHÔNG phải lãi đơn.", en: "Compound interest = interest on past interest ⛄ — NOT simple interest." },
      { vi: "Quy tắc 72: số năm gấp đôi ≈ 72 ÷ lãi suất.", en: "Rule of 72: years to double ≈ 72 ÷ rate." },
    ],
  },
  info: {
    s: { vi: "Tiền để yên mất sức mua vì lạm phát; lãi kép giúp tiền lớn nhanh — lãi suất thực ≈ lãi − lạm phát.", en: "Idle money loses buying power to inflation; compounding grows money fast — real rate ≈ interest − inflation." },
    l: {
      vi: "Khi mặt bằng giá tăng (lạm phát, đo bằng CPI), tiền để yên mua được ít hơn — đó là lý do 10 triệu để yên mất giá trị dù con số không đổi. Muốn giữ sức mua, tiền phải sinh lãi ít nhất bằng lạm phát: lãi suất thực ≈ lãi suất − lạm phát. Lãi kép là lãi sinh ra trên cả tiền lãi cũ — càng để lâu càng lớn; quy tắc 72 ước lượng thời gian gấp đôi. Quỹ khẩn cấp (3–6 tháng chi phí thiết yếu) nên để nơi an toàn, rút nhanh. (Nguồn gốc của lạm phát và chuyện tỷ giá USD học ở bài M1.)",
      en: "When the general price level rises (inflation, measured by CPI), idle money buys less — that's why 10 million left idle loses value even though the number stays the same. To keep buying power, money must earn at least inflation: real rate ≈ interest − inflation. Compound interest is interest earned on past interest — the longer, the bigger; the rule of 72 estimates doubling time. An emergency fund (3–6 months of essentials) belongs somewhere safe and quick to reach. (Where inflation comes from, and the USD exchange rate, are in lesson M1.)",
    },
  },
  kb: ["inflation", "realrate", "compound", "emergency"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Ben Thanh Market Ho Chi Minh City" }, art: "💵 10tr → 🛒 ~6,8tr", cap: { vi: "Cùng số dư, mỗi năm mua được ít hơn", en: "Same balance, buys less every year" },
      title: { vi: "Lạm phát 4% mỗi năm: 10 triệu để yên còn giá trị bao nhiêu?", en: "4% inflation a year: what is 10 million left idle worth?" },
      text: {
        vi: "Bạn để dành được 10.000.000₫ và để trong tài khoản thanh toán, lãi gần 0%. Nhiều năm sau số dư vẫn là 10 triệu, nhưng mỗi năm nó <b>mua được ít hơn</b> vì giá cả nói chung tăng — gọi là <b>lạm phát</b> (inflation). Lạm phát được đo bằng <b>CPI</b> (chỉ số giá tiêu dùng, consumer price index): giá của một rổ hàng hóa, dịch vụ mà một hộ gia đình điển hình mua, công bố hằng tháng. Tiền không mất đi; nó mất <b>sức mua</b> (purchasing power) — lượng hàng mua được với cùng số tiền. Bài này: làm sao để tiền để dành không mất giá trị, mà còn lớn lên như quả cầu tuyết.",
        en: "You've saved 10,000,000₫ and keep it in a current account paying almost 0%. Years later the balance still says 10 million, but each year it <b>buys less</b>, because prices in general go up — that's <b>inflation</b>. Inflation is measured by the <b>CPI</b> (consumer price index): the price of a basket of goods and services a typical household buys, published every month. The money doesn't disappear; it loses <b>purchasing power</b> — how much the same amount can buy. This lesson: how to keep savings from losing value — and make them grow like a snowball.",
      },
      lion: { vi: "Năm 2008, lạm phát ở Việt Nam khoảng 23% — tiền để yên mất gần ¼ sức mua chỉ trong một năm!", en: "In 2008 Vietnam's inflation was about 23% — idle money lost almost a quarter of its buying power in one year!" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: 10.000.000₫ nằm trong tài khoản lãi gần 0% suốt 10 năm, giá cả tăng 4% mỗi năm. Khi đó nó mua được lượng hàng bằng bao nhiêu tiền hôm nay?", en: "Guess: 10,000,000₫ sits in an account paying almost 0% for 10 years while prices rise 4% a year. Then it buys what how much buys today?" },
      art: "💵 10.000.000₫ · ⏳ 10", min: 0, max: 10000000, step: 100000, start: 9000000, actual: 6760000, unit: "vnd",
      reveal: { vi: "Chỉ khoảng 6,76 triệu — mất gần ⅓ sức mua, dù số dư vẫn ghi 10.000.000₫. (10.000.000 ÷ 1,04¹⁰.) Lạm phát âm thầm 'ăn' tiền để yên.", en: "Only about 6.76 million — almost ⅓ of its buying power gone, though the balance still says 10,000,000₫. (10,000,000 ÷ 1.04¹⁰.) Inflation quietly eats idle money." },
    },
    /* 3 · Mechanism: the snowball + three jars */
    { t: "video", video: compoundVideo },
    {
      t: "chart", q: { vi: "Ba người cùng có 10 triệu, lạm phát 4%/năm. Đường nào là tiền để trong tài khoản thanh toán lãi ~0%? (tính theo sức mua hôm nay)", en: "Three people each have 10 million; inflation is 4% a year. Which line is the money left in a current account at ~0%? (in today's buying power)" },
      chart: {
        kind: "line",
        labels: [{ vi: "0", en: "0" }, { vi: "2 năm", en: "2 yrs" }, { vi: "4 năm", en: "4 yrs" }, { vi: "6 năm", en: "6 yrs" }, { vi: "8 năm", en: "8 yrs" }, { vi: "10 năm", en: "10 yrs" }],
        series: [
          { name: { vi: "A · gửi tiết kiệm 6%", en: "A · savings at 6%" }, color: "#5B5BD6", data: [10, 10.39, 10.79, 11.21, 11.64, 12.09] },
          { name: { vi: "B · tài khoản thanh toán ~0%", en: "B · current account ~0%" }, color: "#EF4E4E", data: [10, 9.25, 8.55, 7.9, 7.31, 6.76] },
          { name: { vi: "C · quỹ chỉ số ~9% (lên xuống thất thường)", en: "C · index fund ~9% (bumpy)" }, color: "#2BB673", data: [10, 10.98, 12.06, 13.25, 14.55, 15.97] },
        ],
        y: { vi: "triệu ₫ theo giá hôm nay", en: "million ₫ at today's prices" },
        source: { vi: "Tính minh họa: giá trị ÷ 1,04^năm", en: "Illustrative: value ÷ 1.04^years" },
      },
      o: [{ vi: "B — đường đi xuống", en: "B — the line going down" }, { vi: "A — đường đi lên chậm", en: "A — the slowly rising line" }, { vi: "C — đường đi lên nhanh", en: "C — the fast-rising line" }, { vi: "Không đường nào giảm", en: "None of them falls" }],
      a: 0,
      why: { vi: "Tài khoản lãi ~0% giữ nguyên con số nhưng sức mua giảm còn ~6,8 triệu. Gửi tiết kiệm 6% thắng lạm phát 4% (lãi thực ~2%). <b>Quỹ chỉ số</b> (index fund) — quỹ mua cả rổ cổ phiếu theo một chỉ số — trung bình cao hơn nhưng có năm giảm, không hợp để giữ quỹ khẩn cấp.", en: "The ~0% account keeps its number but its buying power falls to ~6.8M. Savings at 6% beat 4% inflation (real ~2%). An <b>index fund</b> — a fund that buys the whole basket of shares in an index — averages more but has down years, so it's not for an emergency fund." },
      hint: { vi: "Tiền không sinh lãi thì sức mua đi lên hay đi xuống?", en: "Money earning nothing: does its buying power go up or down?" },
    },
    {
      t: "calc", q: { vi: "Bạn gửi 10.000.000₫, lãi 6%/năm. Lạm phát năm đó 4%.", en: "You deposit 10,000,000₫ at 6% a year. Inflation that year is 4%." },
      art: "🏦 6% vs 🛒 4%",
      parts: [
        { label: { vi: "Tiền lãi nhận được sau 1 năm (₫)", en: "Interest earned after 1 year (₫)" }, a: 600000, tol: 0, unit: "₫" },
        { label: { vi: "Giỏ hàng 10 triệu hôm nay, năm sau giá bao nhiêu? (₫)", en: "A 10-million basket today costs how much next year? (₫)" }, a: 10400000, tol: 0, unit: "₫" },
        { label: { vi: "Lãi suất thực xấp xỉ (%)", en: "Approximate real interest rate (%)" }, a: 2, tol: 0.1, unit: "%" },
      ],
      why: { vi: "Lãi 600.000₫, nhưng giỏ hàng đắt thêm 400.000₫ → sức mua chỉ tăng ~200.000₫ = ~2%. <b>Lãi suất thực</b> (real interest rate) ≈ <b>lãi suất danh nghĩa</b> (nominal interest rate — con số ngân hàng niêm yết) − lạm phát = 6% − 4%.", en: "You earn 600,000₫, but the basket costs 400,000₫ more → buying power grows only ~200,000₫ = ~2%. The <b>real interest rate</b> ≈ the <b>nominal interest rate</b> (the number the bank posts) − inflation = 6% − 4%." },
      hint: { vi: "Bước 3: lãi suất thực ≈ lãi suất danh nghĩa − lạm phát.", en: "Step 3: real rate ≈ nominal rate − inflation." },
    },
    /* 4 · The real story */
    {
      t: "learn", photo: { query: "Vietnam 2008 market prices" }, art: "📈 2008: CPI ~23%",
      title: { vi: "Chuyện thật: Việt Nam 2008", en: "Real story: Vietnam 2008" },
      text: {
        vi: "Năm 2008, lạm phát bình quân ở Việt Nam lên khoảng <b>23%</b> (Tổng cục Thống kê). Người để tiền mặt ở nhà mất gần một phần tư sức mua. Ngân hàng phải nâng lãi tiết kiệm lên rất cao, nhưng nhiều tháng lãi vẫn thấp hơn lạm phát — tức <b>lãi suất thực âm</b> (negative real interest rate): gửi tiền vẫn 'lỗ' sức mua.",
        en: "In 2008 Vietnam's average inflation reached about <b>23%</b> (General Statistics Office). People holding cash at home lost almost a quarter of its buying power. Banks pushed savings rates very high, yet for many months they were still below inflation — a <b>negative real interest rate</b>: even savers lost buying power.",
      },
    },
    /* 5 · Trap (survey: 12/46 mixed up compound and simple interest) */
    {
      t: "mcq", q: { vi: "Gửi 10 triệu, <b>lãi kép</b> (compound interest — tiền lãi được cộng vào gốc và tiếp tục sinh lãi) 8%/năm. Sau 2 năm bạn có bao nhiêu?", en: "You deposit 10 million at 8% a year with <b>compound interest</b> — interest is added to the balance and earns interest too. How much after 2 years?" },
      o: [{ vi: "11.600.000₫", en: "11,600,000₫" }, { vi: "11.664.000₫", en: "11,664,000₫" }, { vi: "12.000.000₫", en: "12,000,000₫" }, { vi: "10.800.000₫", en: "10,800,000₫" }],
      a: 1,
      why: { vi: "Năm 1: 10tr × 1,08 = 10,8tr. Năm 2 tính lãi trên 10,8tr: × 1,08 = 11,664tr. Đáp án 11,6tr là <b>lãi đơn</b> (simple interest — lãi chỉ tính trên tiền gốc) — trong khảo sát của nhóm, 12/46 bạn nhầm như vậy. Chênh 64k nhỏ lúc đầu, nhưng sau 30 năm là gấp ba!", en: "Year 1: 10M × 1.08 = 10.8M. Year 2 earns on 10.8M: × 1.08 = 11.664M. 11.6M is <b>simple interest</b> — interest on the original amount only — 12 of 46 teens in our survey made that mistake. A 64k gap at first, but three times as much after 30 years!" },
      hint: { vi: "Năm thứ hai, lãi được tính trên số tiền nào?", en: "In year two, what amount earns interest?" },
    },
    {
      t: "predict", q: { vi: "Đoán thử: gửi tiền lãi kép 6%/năm thì bao nhiêu năm tiền gấp đôi?", en: "Guess: at 6% a year compounded, how many years until money doubles?" },
      art: "💰 → 💰💰", min: 1, max: 30, step: 1, start: 20, actual: 11.9, unit: "yr",
      reveal: { vi: "Khoảng 12 năm. <b>Quy tắc 72</b> (rule of 72) — chia 72 cho lãi suất năm để ước số năm tiền gấp đôi: 72 ÷ 6 = 12. (Chính xác là 11,9 năm.) Nhiều người đoán gần 17 năm — vì quen nghĩ theo lãi đơn: 100% ÷ 6%. Quy tắc 72 chạy cả chiều ngược lại: nợ thẻ 24%/năm thì ~3 năm là nợ gấp đôi!", en: "About 12 years. The <b>rule of 72</b> — divide 72 by the yearly rate to estimate the doubling time: 72 ÷ 6 = 12 (exactly 11.9). Many people guess ~17 years — thinking in simple interest: 100% ÷ 6%. It works backwards too: card debt at 24% a year doubles in ~3 years!" },
    },
    /* 6 · Boss + use it today */
    {
      t: "pick", q: { vi: "Trùm cuối: bạn để dành được 27 triệu — đủ 3 tháng chi tiêu thiết yếu — làm <b>quỹ khẩn cấp</b> (emergency fund: tiền dự phòng khi mất việc, ốm đau, hỏng xe). Để ở đâu?", en: "Final boss: you've saved 27 million — three months of essential spending — as an <b>emergency fund</b> (money for job loss, illness, a broken bike). Where do you keep it?" },
      opts: [["📈", { vi: "Cổ phiếu một công ty đang hot", en: "Shares of a hot company" }], ["💵", { vi: "Tiền mặt cất ở nhà cho dễ lấy", en: "Cash at home, easy to grab" }], ["🏦", { vi: "Tiền gửi tiết kiệm kỳ hạn ngắn, rút trước hạn được", en: "A short-term savings deposit you can withdraw early" }], ["🤝", { vi: "Cho bạn vay lấy lãi 5%/tuần", en: "Lend it to a friend at 5% a week" }]],
      a: 2,
      why: { vi: "Quỹ khẩn cấp cần <b>an toàn</b>, <b>thanh khoản</b> cao (liquidity — đổi ra tiền mặt nhanh mà không mất giá) và nên có lãi để không mất sức mua. Tiền mặt ở nhà dễ lấy nhưng mất sức mua; cổ phiếu có thể giảm đúng lúc bạn cần tiền; '5%/tuần' là cờ đỏ lừa đảo.", en: "An emergency fund must be <b>safe</b>, highly <b>liquid</b> — quick to turn into cash without losing value — and earn something so it keeps its buying power. Cash at home is handy but loses buying power; shares can drop just when you need cash; '5% a week' is a scam red flag." },
      hint: { vi: "Ba yêu cầu: an toàn, rút nhanh, không mất sức mua.", en: "Three needs: safe, quick to reach, keeps its buying power." },
    },
    {
      t: "order", q: { vi: "Sắp xếp thứ tự ưu tiên hợp lý cho người mới đi làm", en: "Order these priorities for someone with a first job" },
      items: [["🪣", { vi: "Để dành một quỹ khẩn cấp nhỏ", en: "Build a small emergency buffer" }], ["💳", { vi: "Trả hết nợ lãi cao (thẻ, BNPL)", en: "Pay off high-interest debt (cards, BNPL)" }], ["☂️", { vi: "Đủ quỹ khẩn cấp 3–6 tháng", en: "Grow the fund to 3–6 months" }], ["🌳", { vi: "Đầu tư dài hạn, đa dạng hóa", en: "Invest long-term, diversified" }]],
      why: { vi: "Trả nợ lãi 24%/năm là 'lợi nhuận chắc chắn' 24% — khó khoản đầu tư nào sánh được. Nhưng nên có một quỹ nhỏ trước để khỏi vay thêm khi có chuyện.", en: "Paying off 24%-a-year debt is a guaranteed 24% 'return' — hard to beat. But keep a small buffer first so a surprise doesn't push you into new debt." },
    },
    {
      t: "learn", art: "🏦 ⛄ 72",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Ba việc nhỏ làm được ngay:", en: "Three small things you can do right now:" },
      items: [
        ["🔎", { vi: "Mở app ngân hàng: lãi tiết kiệm kỳ hạn 6 và 12 tháng là bao nhiêu? So với CPI năm gần nhất", en: "Open your banking app: what do 6- and 12-month deposits pay? Compare with the latest yearly CPI" }],
        ["💵", { vi: "Tiền để dành lâu hơn vài tháng: đừng để trong tài khoản thanh toán lãi ~0%", en: "Money you'll keep for more than a few months: don't leave it in a ~0% current account" }],
        ["7️⃣2️⃣", { vi: "Gặp mức lãi nào cũng chia 72 để biết bao lâu gấp đôi (kể cả lãi nợ!)", en: "Whenever you see a rate, divide 72 by it to see the doubling time (debt too!)" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Sổ tiết kiệm ở Ngân hàng — lãi suất chạy theo ngân hàng trung ương mô phỏng!", en: "🎮 Unlocked in the game: a savings book at the Bank — its rate follows the simulated central bank!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "(1 + i) = (1 + r)(1 + π)",
      fs: 26,
      title: { vi: "Phương trình Fisher (bản chính xác)", en: "The Fisher equation (exact form)" },
      text: {
        vi: "Công thức 'lãi − lạm phát' chỉ là xấp xỉ. Nhà kinh tế Irving Fisher viết chính xác thành <b>phương trình Fisher</b> (Fisher equation): <b>(1 + i) = (1 + r)(1 + π)</b>, với i là lãi danh nghĩa, r là lãi thực, π là lạm phát. Suy ra <b>r = (1 + i)/(1 + π) − 1</b>. Khi lạm phát cao (như 23% năm 2008), sai số của phép xấp xỉ trở nên đáng kể.",
        en: "'Rate minus inflation' is only an approximation. Economist Irving Fisher wrote it exactly — the <b>Fisher equation</b>: <b>(1 + i) = (1 + r)(1 + π)</b>, where i is the nominal rate, r the real rate and π inflation. So <b>r = (1 + i)/(1 + π) − 1</b>. When inflation is high (like 23% in 2008), the approximation error becomes significant.",
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
      why: { vi: "Giá trị thực của khoản nợ cố định giảm khi giá cả tăng — một dạng <b>tái phân phối của cải</b> (wealth redistribution) từ <b>chủ nợ</b> (creditor, người cho vay) sang <b>con nợ</b> (debtor, người đi vay). Người gửi, người giữ tiền mặt và người cho vay lãi cố định chịu thiệt. Lạm phát đã được dự đoán trước thì thường đã nằm sẵn trong lãi suất; chính phần <b>bất ngờ</b> mới chuyển của cải.", en: "The real value of a fixed debt falls as prices rise — a <b>redistribution of wealth</b> from <b>creditors</b> (lenders) to <b>debtors</b> (borrowers). Savers, cash holders and fixed-rate lenders lose. Inflation that was expected is usually already built into interest rates; it's the <b>surprise</b> part that moves wealth." },
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
