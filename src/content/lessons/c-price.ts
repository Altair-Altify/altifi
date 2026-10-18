/* Business finance · B2 — "What's the right price?" (design doc 13.2d ②, 6-beat frame 13.2c)
 * Price elasticity of demand, competitors, promotions and vouchers. Trap: "a discount always sells more = more profit".
 * Same kiosk as the game: variable cost 15,000₫/cup, fixed 16M/month.
 * School area: 25k → 1,900 cups, 35k → 1,500, 45k → 800. Office area: 25k → 1,300, 35k → 1,200, 45k → 1,050.
 * Profit = cups × (price − 15k) − 16M. School: 3M / 14M / 8M. Office: −3M / 8M / 15.5M.
 * ⚠️ Draft written with AI help — team review. Demand numbers are made up for the exercise. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "c-price",
  domain: "corporate",
  icon: "🏷️",
  ic: "percent",
  minutes: 6,
  title: { vi: "Giá bao nhiêu thì đúng?", en: "What's the right price?" },
  desc: {
    vi: "Khách phản ứng với giá ra sao (độ co giãn), giá của đối thủ, khuyến mãi và voucher — và vì sao giảm giá chưa chắc đã lời hơn.",
    en: "How customers react to price (elasticity), rivals' prices, promotions and vouchers — and why a discount isn't always more profit.",
  },
  prereq: { vi: "lãi góp mỗi ly và điểm hòa vốn (bài B1).", en: "contribution per cup and break-even (lesson B1)." },
  review: {
    title: { vi: "Định giá", en: "Pricing" },
    points: [
      { vi: "Lợi nhuận = số ly × (giá − biến phí) − định phí.", en: "Profit = cups × (price − variable cost) − fixed costs." },
      { vi: "Khách <b>nhạy giá</b> (co giãn mạnh): tăng giá mất nhiều khách.", en: "<b>Price-sensitive</b> (elastic) customers: a price rise loses many." },
      { vi: "Khách <b>ít nhạy giá</b>: tăng giá mất ít khách, lời hơn.", en: "<b>Less sensitive</b> customers: a rise loses few, profit grows." },
      { vi: "Giảm giá phải bán thêm RẤT nhiều mới bù được phần lãi góp mất.", en: "A discount must sell A LOT more to make up the lost margin." },
    ],
  },
  info: {
    s: { vi: "Giá đúng phụ thuộc vào khách nhạy giá đến đâu: lợi nhuận = số lượng × (giá − biến phí) − định phí.", en: "The right price depends on how price-sensitive customers are: profit = quantity × (price − variable cost) − fixed costs." },
    l: {
      vi: "Giá cao hơn thì mỗi ly lời hơn nhưng có thể bán được ít hơn. Mức giảm số lượng khi giá tăng gọi là độ co giãn của cầu: học sinh tiêu tiền tiêu vặt thường rất nhạy giá, dân văn phòng ít nhạy hơn. Vì thế cùng một quán, giá tốt nhất ở cạnh trường khác giá tốt nhất ở khu văn phòng. Giảm giá chỉ lời hơn khi số ly bán thêm đủ bù phần lãi góp bị mất — thường phải bán thêm rất nhiều. Khuyến mãi, voucher hữu ích để kéo khách mới, nhưng chiến tranh giá thường làm mọi bên mỏng lời.",
      en: "A higher price earns more per cup but may sell fewer cups. How much sales fall when the price rises is the price elasticity of demand: students spending pocket money are very price-sensitive; office workers less so. So the same shop's best price near a school differs from its best price in an office district. A discount only pays when the extra cups make up the lost margin — usually a lot more cups. Promotions and vouchers help win new customers, but price wars usually thin everyone's profits.",
    },
  },
  kb: ["breakeven", "profit"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "bubble tea menu prices" }, art: "🧋 25k? 35k? 45k?", cap: { vi: "Một con số quyết định cả tháng", en: "One number decides the whole month" },
      title: { vi: "Giá bao nhiêu thì đúng?", en: "What's the right price?" },
      text: {
        vi: "Linh mở thêm quầy thứ hai. Một quầy cạnh trường cấp 3, một quầy trong khu văn phòng. Cùng ly trà sữa, biến phí 15.000₫, định phí mỗi quầy 16 triệu/tháng. Nên bán <b>25k, 35k hay 45k</b>? Và có nhất thiết hai quầy cùng một giá?",
        en: "Linh opens a second kiosk. One is next to a high school, one in an office district. Same milk tea, 15,000₫ variable cost, 16 million fixed costs per kiosk a month. Should she charge <b>25k, 35k or 45k</b>? And must both kiosks charge the same?",
      },
      lion: { vi: "Rẻ nhất chưa chắc lời nhất, đắt nhất cũng vậy 🤔", en: "The cheapest isn't always most profitable — nor is the dearest 🤔" },
    },
    /* 2 · Guess first */
    {
      t: "pick", q: { vi: "Đoán trước khi tính: ở quầy CẠNH TRƯỜNG (khách là học sinh), giá nào lời nhất?", en: "Guess before calculating: at the SCHOOL kiosk (students), which price makes the most profit?" },
      opts: [["🪙", { vi: "25.000₫ — rẻ cho học sinh", en: "25,000₫ — cheap for students" }], ["🧋", { vi: "35.000₫", en: "35,000₫" }], ["💎", { vi: "45.000₫ — lời nhiều mỗi ly", en: "45,000₫ — big margin per cup" }]],
      a: 1,
      why: { vi: "Ở cạnh trường: 25k bán 1.900 ly → lời 3 triệu; 35k bán 1.500 ly → lời <b>14 triệu</b>; 45k chỉ còn 800 ly → lời 8 triệu. Học sinh rất nhạy giá: lên 45k là mất gần nửa khách.", en: "At the school: 25k sells 1,900 cups → 3M profit; 35k sells 1,500 → <b>14M</b>; 45k only 800 → 8M. Students are very price-sensitive: at 45k almost half of them leave." },
      hint: { vi: "Mỗi giá: số ly × (giá − 15k) − 16 triệu. (Số ly ở phần giải thích.)", en: "Each price: cups × (price − 15k) − 16M. (Cup numbers are in the explanation.)" },
    },
    /* 3 · Mechanism */
    {
      t: "chart", q: { vi: "Số ly bán được mỗi tháng ở hai quầy theo giá. Quầy nào khách NHẠY GIÁ hơn?", en: "Cups sold per month at each kiosk by price. Where are customers MORE price-sensitive?" },
      chart: {
        kind: "line",
        labels: ["25k", "35k", "45k"],
        series: [
          { name: { vi: "Cạnh trường", en: "By the school" }, color: "#F5A524", data: [1900, 1500, 800] },
          { name: { vi: "Khu văn phòng", en: "Office district" }, color: "#3D7BF5", data: [1300, 1200, 1050] },
        ],
        y: { vi: "ly/tháng", en: "cups/month" },
        source: { vi: "Số liệu giả định cho bài tập", en: "Made-up figures for the exercise" },
      },
      o: [{ vi: "Cạnh trường — đường dốc xuống mạnh", en: "By the school — the line drops steeply" }, { vi: "Khu văn phòng", en: "The office district" }, { vi: "Như nhau", en: "The same" }, { vi: "Không ai nhạy giá", en: "Nobody is" }],
      a: 0,
      why: { vi: "Đường càng dốc, khách càng nhạy giá (cầu co giãn mạnh). Học sinh dùng tiền tiêu vặt nên rất để ý giá; dân văn phòng quan tâm tiện lợi hơn.", en: "The steeper the line, the more price-sensitive (elastic) the customers. Students spend pocket money and watch prices; office workers care more about convenience." },
      hint: { vi: "So độ dốc hai đường từ 25k tới 45k.", en: "Compare how steep the two lines are from 25k to 45k." },
    },
    {
      t: "calc", q: { vi: "Quầy khu văn phòng (biến phí 15k, định phí 16 triệu). Tính lợi nhuận tháng (triệu ₫):", en: "Office kiosk (15k variable cost, 16M fixed). Monthly profit (million ₫):" },
      parts: [
        { label: { vi: "Giá 35k, bán 1.200 ly", en: "35k, selling 1,200 cups" }, a: 8, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Giá 45k, bán 1.050 ly", en: "45k, selling 1,050 cups" }, a: 15.5, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
      ],
      why: { vi: "1.200 × 20k − 16tr = 8tr. 1.050 × 30k − 16tr = 15,5tr. Ở khu văn phòng, giá cao lại lời nhất — vì khách ít nhạy giá. Cùng sản phẩm, khác khách, khác giá đúng.", en: "1,200 × 20k − 16M = 8M. 1,050 × 30k − 16M = 15.5M. In the office district the high price wins — customers are less sensitive. Same product, different customers, different right price." },
      hint: { vi: "Lãi góp mỗi ly = giá − 15k.", en: "Margin per cup = price − 15k." },
    },
    /* 4 · The real story */
    {
      t: "learn", photo: { query: "online shopping sale voucher" }, art: "🎟️ −50% · −50% · −50%",
      title: { vi: "Chuyện thật: chiến tranh voucher", en: "Real story: voucher wars" },
      text: {
        vi: "Các sàn thương mại điện tử và chuỗi đồ uống từng tung voucher, mã giảm giá liên tục để giành khách. Doanh số tăng vọt — nhưng nhiều năm liền nhiều bên vẫn báo lỗ, vì khách quen 'chỉ mua khi có mã'. Khi giảm khuyến mãi, một phần khách chuyển đi nơi khác. Bên thắng thường là bên có nhiều vốn để chịu lỗ lâu hơn — hoặc bên khiến khách ở lại vì lý do khác ngoài giá.",
        en: "E-commerce platforms and drink chains have run endless vouchers and discount codes to win customers. Sales soared — yet for years many still reported losses, because customers learned to 'only buy with a code'. When promotions shrank, some customers moved elsewhere. Winners tend to be those with deep pockets to lose money longer — or those who give customers reasons to stay other than price.",
      },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Quầy cạnh trường đang bán 35k, 1.500 ly. Linh định giảm còn 30k. Phải bán ít nhất bao nhiêu ly mới giữ nguyên lợi nhuận 14 triệu?", en: "The school kiosk sells 1,500 cups at 35k. Linh plans to cut to 30k. At least how many cups to keep the same 14M profit?" },
      o: [{ vi: "2.000 ly (bán thêm 33%)", en: "2,000 cups (33% more)" }, { vi: "1.650 ly (bán thêm 10%)", en: "1,650 cups (10% more)" }, { vi: "1.500 ly — giảm giá thì tự đông hơn", en: "1,500 — a discount brings crowds anyway" }, { vi: "1.300 ly", en: "1,300 cups" }],
      a: 0,
      why: { vi: "Lãi góp từ 20k xuống 15k mỗi ly. Cần (14tr + 16tr) ÷ 15k = 2.000 ly. Giảm giá 14% nhưng phải bán thêm 33% — đó là bẫy 'giảm giá luôn lời hơn'.", en: "Margin falls from 20k to 15k a cup. Needed: (14M + 16M) ÷ 15k = 2,000 cups. A 14% price cut needs 33% more sales — the 'discounts always pay' trap." },
      hint: { vi: "Lợi nhuận + định phí = số ly × lãi góp mới.", en: "Profit + fixed costs = cups × new margin." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: Linh hỏi “Sao không để hai quầy cùng một giá cho dễ?” Khuyên 1–2 câu.", en: "Final boss: Linh asks “Why not one price for both kiosks, to keep it simple?” Advise in 1–2 sentences." },
      keys: [
        { label: { vi: "Khách khác nhau / nhạy giá", en: "Different customers / sensitivity" }, words: { vi: ["nhạy giá", "khác nhau", "học sinh", "văn phòng", "co giãn", "khách"], en: ["price-sensitive", "sensitive", "different", "students", "office", "elastic", "customers"] } },
        { label: { vi: "Lợi nhuận mỗi nơi", en: "Profit at each place" }, words: { vi: ["lợi nhuận", "lời", "lãi", "14", "15,5", "15.5"], en: ["profit", "earn", "14", "15.5"] } },
        { label: { vi: "Giá phù hợp từng khu", en: "Price per area" }, words: { vi: ["35", "45", "mỗi khu", "mỗi quầy", "riêng", "phù hợp"], en: ["35", "45", "each area", "each kiosk", "separate", "fit"] } },
      ],
      need: 2,
      model: { vi: "Vì khách hai nơi nhạy giá khác nhau: cạnh trường bán 35k lời nhất (14tr), khu văn phòng bán 45k lời nhất (15,5tr), nên mỗi quầy nên có giá riêng.", en: "Because customers differ in price sensitivity: 35k is most profitable at the school (14M), 45k in the office district (15.5M), so each kiosk should have its own price." },
      why: { vi: "Ý chính: giá đúng phụ thuộc vào khách — đo phản ứng của khách rồi mới chọn giá.", en: "Key idea: the right price depends on the customers — measure their reaction, then choose." },
      hint: { vi: "Nhớ lại hai đường trên biểu đồ.", en: "Remember the two lines on the chart." },
    },
    {
      t: "learn", art: "🏷️ 👀 🧮",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Lần tới thấy 'giảm 50%':", en: "Next time you see '50% off':" },
      items: [
        ["🧮", { vi: "Hỏi: cửa hàng phải bán thêm bao nhiêu để vẫn có lời? Giá gốc có bị đẩy lên trước không?", en: "Ask: how much more must the shop sell to still profit? Was the 'original' price inflated first?" }],
        ["👀", { vi: "Để ý cùng một món ở hai khu khác nhau có giá khác nhau không — vì sao?", en: "Notice whether the same item costs different amounts in two areas — why?" }],
        ["🎟️", { vi: "Voucher chỉ có lợi nếu bạn vốn định mua món đó", en: "A voucher only helps if you were going to buy it anyway" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: chỉnh giá ở quán mỗi tháng — xem số khách và độ yêu thích thay đổi!", en: "🎮 Unlocked in the game: set your shop's price each month — watch customers and their love change!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "Ed = %ΔQ ÷ %ΔP", fs: 28,
      title: { vi: "Độ co giãn của cầu theo giá", en: "Price elasticity of demand" },
      text: {
        vi: "<b>Ed = % thay đổi lượng cầu ÷ % thay đổi giá</b>. |Ed| > 1: cầu co giãn — tăng giá làm doanh thu giảm. |Ed| < 1: ít co giãn — tăng giá làm doanh thu tăng. Hàng thiết yếu, ít thay thế (xăng, thuốc) thường ít co giãn; hàng có nhiều lựa chọn thay thế (trà sữa giữa 10 quán) co giãn mạnh.",
        en: "<b>Ed = % change in quantity ÷ % change in price</b>. |Ed| > 1: elastic — raising the price lowers revenue. |Ed| < 1: inelastic — raising it raises revenue. Essentials with few substitutes (fuel, medicine) tend to be inelastic; things with many substitutes (milk tea among ten shops) are elastic.",
      },
    },
    {
      t: "calc", q: { vi: "Từ 35k lên 45k (giá tăng ~28,6%):", en: "From 35k to 45k (price up ~28.6%):" },
      parts: [
        { label: { vi: "Cạnh trường: lượng 1.500 → 800, % thay đổi lượng (làm tròn, số âm)", en: "School: 1,500 → 800 cups, % change in quantity (rounded, negative)" }, a: -47, tol: 0.5, unit: "%" },
        { label: { vi: "Khu văn phòng: 1.200 → 1.050, % thay đổi lượng (1 chữ số thập phân)", en: "Office: 1,200 → 1,050, % change in quantity (1 decimal)" }, a: -12.5, tol: 0.05, unit: "%" },
      ],
      why: { vi: "−700/1.500 ≈ −47% → |Ed| ≈ 1,6 (co giãn). −150/1.200 = −12,5% → |Ed| ≈ 0,44 (ít co giãn).", en: "−700/1,500 ≈ −47% → |Ed| ≈ 1.6 (elastic). −150/1,200 = −12.5% → |Ed| ≈ 0.44 (inelastic)." },
      hint: { vi: "(mới − cũ) ÷ cũ × 100.", en: "(new − old) ÷ old × 100." },
    },
  ],
};
export default lesson;
