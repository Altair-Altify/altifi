/* Corporate finance · Lesson 1 — Revenue, costs, profit; fixed vs variable; break-even (design doc 3.4)
 * Linh's bubble-tea shop is a made-up example; every number is computed in the comments. */
import type { Lesson } from "../../lesson/types";

// Price 40,000₫ · variable cost 18,000₫/cup · fixed 63,000,000₫/month · sells 3,000 cups/month
// Revenue 120M · variable 54M · contribution 66M (55%) · operating profit 3M (2.5%)
// Break-even 63M / 22k = 2,864 cups/month ≈ 95/day · DOL = 66/3 = 22

const lesson: Lesson = {
  id: "c-breakeven",
  domain: "corporate",
  icon: "🧋",
  ic: "scale",
  minutes: 8,
  title: { vi: "Doanh thu, chi phí & điểm hòa vốn", en: "Revenue, costs & break-even" },
  desc: {
    vi: "Vì sao quán đông khách vẫn có thể lỗ: chi phí cố định vs biến đổi, đọc báo cáo kết quả kinh doanh mini, tính điểm hòa vốn.",
    en: "Why a busy shop can still lose money: fixed vs variable costs, reading a mini income statement, working out break-even.",
  },
  prereq: { vi: "lợi nhuận = doanh thu − chi phí.", en: "profit = revenue − costs." },
  review: {
    title: { vi: "Doanh thu & chi phí", en: "Revenue & costs" },
    points: [
      { vi: "<b>Doanh thu</b> = tiền khách trả. <b>Lợi nhuận</b> = doanh thu − chi phí.", en: "<b>Revenue</b> = what customers pay. <b>Profit</b> = revenue − costs." },
      { vi: "Chi phí <b>cố định</b> không đổi theo số lượng bán (thuê, lương quản lý).", en: "<b>Fixed</b> costs don't change with sales (rent, manager pay)." },
      { vi: "Chi phí <b>biến đổi</b> tăng theo từng sản phẩm (sữa, ly).", en: "<b>Variable</b> costs grow with each unit (milk, cups)." },
      { vi: "Hòa vốn = chi phí cố định ÷ (giá − biến phí mỗi sản phẩm).", en: "Break-even = fixed costs ÷ (price − variable cost per unit)." },
    ],
  },
  info: {
    s: { vi: "Hòa vốn = chi phí cố định ÷ lãi góp mỗi sản phẩm (giá − chi phí biến đổi).", en: "Break-even = fixed costs ÷ contribution per unit (price − variable cost)." },
    l: {
      vi: "Doanh thu là toàn bộ tiền khách trả; lợi nhuận là phần còn lại sau mọi chi phí. Chi phí cố định (thuê, lương) phải trả dù bán ít hay nhiều; chi phí biến đổi tăng theo từng ly. Mỗi ly bán ra đóng góp (giá − biến phí) để 'trả dần' chi phí cố định; khi đủ, quán hòa vốn, sau đó mới có lời. Quán nhiều chi phí cố định giống như có đòn bẩy: doanh số đổi một chút, lợi nhuận đổi rất nhiều.",
      en: "Revenue is all the money customers pay; profit is what's left after every cost. Fixed costs (rent, salaries) are due whether you sell a little or a lot; variable costs rise with every cup. Each cup contributes (price − variable cost) toward covering fixed costs; once they're covered the shop breaks even, and only then does it make a profit. A shop with heavy fixed costs is leveraged: a small change in sales swings profit a lot.",
    },
  },
  kb: ["breakeven", "profit"],
  steps: [
    {
      t: "learn", photo: { query: "bubble tea shop" }, art: "🧋🧋🧋👥👥👥 → 📉?", cap: { vi: "Đông khách ≠ có lời", en: "Busy ≠ profitable" },
      title: { vi: "Quán đông mà vẫn lỗ?", en: "Busy, yet losing money?" },
      text: {
        vi: "Linh mở quán trà sữa gần trường. Tháng nào cũng bán khoảng <b>3.000 ly</b>, giờ tan học khách xếp hàng. Vậy mà cuối tháng, Linh gần như không còn đồng lời nào. Chuyện gì đang xảy ra? Để trả lời, ta cần tách <b>chi phí</b> thành hai loại.",
        en: "Linh opened a bubble-tea shop near a school. She sells about <b>3,000 cups</b> a month, with queues after class. Yet at month-end there's almost no profit left. What's going on? To answer, we need to split <b>costs</b> into two kinds.",
      },
    },
    {
      t: "learn", art: "📌 + 📦 = 🧾",
      title: { vi: "Cố định vs biến đổi", en: "Fixed vs variable" },
      text: {
        vi: "<b>Chi phí cố định</b> không đổi dù bán 1 hay 5.000 ly: tiền thuê mặt bằng, lương nhân viên theo tháng. <b>Chi phí biến đổi</b> tăng theo từng ly: sữa, trà, trân châu, ly, ống hút, phí nền tảng giao đồ ăn tính theo đơn.",
        en: "<b>Fixed costs</b> stay the same whether you sell 1 cup or 5,000: rent, monthly salaries. <b>Variable costs</b> rise with every cup: milk, tea, tapioca, cups, straws, delivery-app fees charged per order.",
      },
      items: [["🏠", { vi: "Thuê: cố định", en: "Rent: fixed" }], ["🥛", { vi: "Sữa: biến đổi", en: "Milk: variable" }], ["👩‍🍳", { vi: "Lương tháng: cố định", en: "Salary: fixed" }]],
    },
    {
      t: "sort", q: { vi: "Cố định hay biến đổi?", en: "Fixed or variable?" },
      buckets: [["📌", { vi: "Cố định", en: "Fixed" }], ["📦", { vi: "Biến đổi", en: "Variable" }]],
      items: [
        ["🏠", { vi: "Tiền thuê mặt bằng", en: "Shop rent" }, 0],
        ["🧋", { vi: "Trân châu & sữa", en: "Tapioca & milk" }, 1],
        ["👔", { vi: "Lương quản lý cố định", en: "Manager's fixed salary" }, 0],
        ["🥤", { vi: "Ly, nắp, ống hút", en: "Cups, lids, straws" }, 1],
        ["📱", { vi: "Phí nền tảng giao đồ ăn (% mỗi đơn)", en: "Delivery-app fee (% per order)" }, 1],
        ["🛜", { vi: "Gói internet & phần mềm bán hàng", en: "Internet & POS software plan" }, 0],
      ],
      why: { vi: "Hỏi: bán thêm 1 ly thì khoản này có tăng không? Có → biến đổi. Không → cố định.", en: "Ask: if I sell one more cup, does this cost go up? Yes → variable. No → fixed." },
      hint: { vi: "Tưởng tượng tháng này quán đóng cửa: khoản nào vẫn phải trả?", en: "Imagine the shop closes this month: which costs would you still pay?" },
    },
    {
      t: "statement", q: { vi: "Báo cáo tháng này của quán Linh. Biên lợi nhuận hoạt động (lợi nhuận ÷ doanh thu) khoảng bao nhiêu?", en: "Linh's shop, this month. What's the operating margin (profit ÷ revenue), roughly?" },
      sheets: [{
        title: { vi: "Báo cáo kết quả kinh doanh · tháng 9 (₫)", en: "Income statement · September (₫)" },
        rows: [
          { l: { vi: "Doanh thu (3.000 ly × 40.000₫)", en: "Revenue (3,000 cups × 40,000₫)" }, v: 120000000, bold: true },
          { l: { vi: "− Chi phí biến đổi (18.000₫/ly)", en: "− Variable costs (18,000₫/cup)" }, v: -54000000, sub: true },
          { l: { vi: "= Lãi góp", en: "= Contribution" }, v: 66000000, bold: true },
          { l: { vi: "− Tiền thuê", en: "− Rent" }, v: -25000000, sub: true },
          { l: { vi: "− Lương nhân viên", en: "− Staff salaries" }, v: -30000000, sub: true },
          { l: { vi: "− Marketing & khác", en: "− Marketing & other" }, v: -8000000, sub: true },
          { l: { vi: "= Lợi nhuận hoạt động", en: "= Operating profit" }, v: 3000000, bold: true },
        ],
      }],
      o: [{ vi: "Khoảng 2,5%", en: "About 2.5%" }, { vi: "Khoảng 55%", en: "About 55%" }, { vi: "Khoảng 25%", en: "About 25%" }, { vi: "Khoảng 45%", en: "About 45%" }],
      a: 0,
      why: { vi: "3 triệu ÷ 120 triệu = 2,5%. Con số 55% là biên <b>lãi góp</b> — nghe rất đẹp, nhưng 63 triệu chi phí cố định 'ăn' gần hết.", en: "3M ÷ 120M = 2.5%. The 55% figure is the <b>contribution</b> margin — it looks great, but 63M of fixed costs eat almost all of it." },
      hint: { vi: "Lấy dòng cuối cùng chia cho dòng đầu tiên.", en: "Divide the bottom line by the top line." },
    },
    {
      t: "learn", art: "63.000.000₫ ÷ 22.000₫ ≈ 2.864 🧋",
      fs: 22,
      title: { vi: "Điểm hòa vốn", en: "Break-even point" },
      text: {
        vi: "Mỗi ly bán 40.000₫, tốn 18.000₫ nguyên liệu → còn <b>22.000₫ lãi góp</b> để trả chi phí cố định. Cần bao nhiêu ly để trả đủ 63 triệu? <b>Số lượng hòa vốn = chi phí cố định ÷ lãi góp mỗi ly</b>. Bán dưới mức đó là lỗ; trên mức đó mới bắt đầu lời.",
        en: "Each cup sells for 40,000₫ and uses 18,000₫ of ingredients → <b>22,000₫ contribution</b> toward fixed costs. How many cups to cover 63 million? <b>Break-even quantity = fixed costs ÷ contribution per cup</b>. Below that you lose money; above it you start to profit.",
      },
      lion: { vi: "Mỗi ly là một viên gạch trả nợ chi phí cố định 🧱", en: "Every cup is a brick paying off the fixed costs 🧱" },
    },
    {
      t: "calc", q: { vi: "Tính điểm hòa vốn cho quán Linh:", en: "Work out Linh's break-even:" },
      art: "💰 40.000₫ − 📦 18.000₫",
      parts: [
        { label: { vi: "Lãi góp mỗi ly (₫)", en: "Contribution per cup (₫)" }, a: 22000, tol: 0, unit: "₫" },
        { label: { vi: "Số ly hòa vốn mỗi tháng (làm tròn)", en: "Break-even cups per month (rounded)" }, a: 2864, tol: 2, unit: { vi: "ly", en: "cups" } },
        { label: { vi: "Mỗi ngày cần bán khoảng bao nhiêu ly? (30 ngày)", en: "About how many cups per day? (30 days)" }, a: 95, tol: 1, unit: { vi: "ly", en: "cups" } },
      ],
      why: { vi: "40.000 − 18.000 = 22.000₫. 63.000.000 ÷ 22.000 ≈ 2.864 ly. ÷ 30 ≈ 95 ly/ngày. Quán đang bán 100 ly/ngày — chỉ nhỉnh hơn hòa vốn một chút!", en: "40,000 − 18,000 = 22,000₫. 63,000,000 ÷ 22,000 ≈ 2,864 cups. ÷ 30 ≈ 95 cups a day. The shop sells 100 a day — barely above break-even!" },
      hint: { vi: "Chi phí cố định là 63 triệu (thuê + lương + marketing).", en: "Fixed costs are 63 million (rent + salaries + marketing)." },
    },
    {
      t: "chart", q: { vi: "Theo biểu đồ, nếu chỉ bán 2.000 ly/tháng thì quán…", en: "From the chart, if the shop sells only 2,000 cups a month, it…" },
      chart: {
        kind: "line",
        labels: ["0", "1k", "2k", "3k", "4k"],
        series: [
          { name: { vi: "Doanh thu", en: "Revenue" }, color: "#2BB673", data: [0, 40, 80, 120, 160] },
          { name: { vi: "Tổng chi phí", en: "Total cost" }, color: "#EF4E4E", data: [63, 81, 99, 117, 135] },
        ],
        y: { vi: "triệu ₫ · trục ngang: số ly/tháng", en: "million ₫ · x-axis: cups/month" },
      },
      o: [{ vi: "Lỗ khoảng 19 triệu", en: "Loses about 19 million" }, { vi: "Lãi khoảng 19 triệu", en: "Makes about 19 million" }, { vi: "Vừa hòa vốn", en: "Breaks even" }, { vi: "Lãi khoảng 80 triệu", en: "Makes about 80 million" }],
      a: 0,
      why: { vi: "Ở 2.000 ly: doanh thu 80 triệu, tổng chi phí 99 triệu → lỗ 19 triệu. Hai đường cắt nhau ở khoảng 2.864 ly — đó là điểm hòa vốn.", en: "At 2,000 cups: revenue 80M, total cost 99M → a 19M loss. The lines cross near 2,864 cups — that's break-even." },
      hint: { vi: "Ở cột 2k, đường đỏ cao hơn hay đường xanh cao hơn?", en: "At 2k, is the red line or the green line higher?" },
    },
    {
      t: "predict", q: { vi: "Nếu Linh tăng giá lên 45.000₫/ly (chi phí giữ nguyên), số ly hòa vốn mỗi tháng còn bao nhiêu?", en: "If Linh raises the price to 45,000₫ a cup (costs unchanged), what's the new monthly break-even?" },
      art: "🧋 40k → 45k", min: 1000, max: 4000, step: 50, start: 2800, actual: 2333, unit: "cups",
      reveal: { vi: "Khoảng 2.333 ly (63 triệu ÷ 27.000₫). Nhưng cẩn thận: giá cao hơn có thể khiến một số khách bỏ đi — doanh nghiệp phải cân nhắc khách nhạy cảm với giá đến mức nào.", en: "About 2,333 cups (63M ÷ 27,000₫). But careful: a higher price may drive some customers away — a business must weigh how price-sensitive its customers are." },
    },
    {
      t: "mcq", q: { vi: "Quán A: chi phí cố định cao, biến đổi thấp. Quán B: ngược lại. Doanh số cả hai cùng giảm 30%. Lợi nhuận quán nào lao dốc mạnh hơn?", en: "Shop A: high fixed, low variable costs. Shop B: the opposite. Both see sales drop 30%. Whose profit falls harder?" },
      o: [{ vi: "Quán A", en: "Shop A" }, { vi: "Quán B", en: "Shop B" }, { vi: "Như nhau", en: "The same" }, { vi: "Không quán nào bị ảnh hưởng", en: "Neither is affected" }],
      a: 0,
      why: { vi: "Quán A vẫn phải trả nguyên chi phí cố định dù bán ít → lợi nhuận rơi rất mạnh. Đó là <b>đòn bẩy hoạt động</b>: lúc tốt lời nhiều, lúc xấu lỗ nặng.", en: "Shop A still pays all its fixed costs while selling less → profit collapses. That's <b>operating leverage</b>: big gains in good times, big losses in bad." },
      hint: { vi: "Khi bán ít đi, chi phí nào không giảm theo?", en: "When sales drop, which costs don't shrink?" },
    },
    {
      t: "explain", q: { vi: "Giải thích ngắn: vì sao một quán đông khách vẫn có thể lỗ?", en: "Explain briefly: how can a busy shop still lose money?" },
      keys: [
        { label: { vi: "Chi phí cố định cao", en: "High fixed costs" }, words: { vi: ["chi phí cố định", "định phí", "tiền thuê", "mặt bằng", "lương"], en: ["fixed cost", "fixed costs", "rent", "salaries", "salary"] } },
        { label: { vi: "Lãi mỗi ly thấp", en: "Thin margin per cup" }, words: { vi: ["lãi góp", "lãi mỗi ly", "biên", "giá bán thấp", "giá thấp", "chi phí biến đổi", "nguyên liệu"], en: ["margin", "contribution", "per cup", "low price", "variable cost", "ingredients"] } },
        { label: { vi: "Chưa vượt điểm hòa vốn", en: "Below break-even" }, words: { vi: ["hòa vốn", "chưa đủ", "không đủ", "số lượng"], en: ["break-even", "breakeven", "break even", "not enough", "volume"] } },
      ],
      need: 2,
      model: { vi: "Vì chi phí cố định (thuê, lương) quá lớn so với lãi góp mỗi ly, nên dù đông khách, số ly bán vẫn chưa vượt điểm hòa vốn.", en: "Because fixed costs (rent, salaries) are large compared with the contribution per cup, so even with queues the shop doesn't sell enough to pass break-even." },
      why: { vi: "Đông khách chỉ là doanh thu. Lời hay lỗ phụ thuộc cấu trúc chi phí và điểm hòa vốn.", en: "Queues are just revenue. Profit depends on the cost structure and the break-even point." },
    },
  ],
  deep: [
    {
      t: "learn", art: "DOL = 66 ÷ 3 = 22×", fs: 26,
      title: { vi: "Đòn bẩy hoạt động (DOL)", en: "Degree of operating leverage (DOL)" },
      text: {
        vi: "<b>DOL = tổng lãi góp ÷ lợi nhuận hoạt động</b>. Với quán Linh: 66 triệu ÷ 3 triệu = <b>22</b>. Nghĩa là doanh số đổi 1% thì lợi nhuận đổi khoảng 22%. Gần điểm hòa vốn, DOL rất lớn — lợi nhuận cực kỳ nhạy.",
        en: "<b>DOL = total contribution ÷ operating profit</b>. For Linh's shop: 66M ÷ 3M = <b>22</b>. A 1% change in sales moves profit by about 22%. Near break-even, DOL is huge — profit becomes extremely sensitive.",
      },
    },
    {
      t: "calc", q: { vi: "Một trường gần đó nghỉ hè, doanh số giảm 5%.", en: "A nearby school breaks for summer and sales fall 5%." },
      parts: [
        { label: { vi: "Lãi góp mới (triệu ₫)", en: "New contribution (million ₫)" }, a: 62.7, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Lợi nhuận hoạt động mới (triệu ₫)", en: "New operating profit (million ₫)" }, a: -0.3, tol: 0.05, unit: { vi: "triệu ₫", en: "million ₫" } },
        { label: { vi: "Biên an toàn ban đầu = (3.000 − 2.864) ÷ 3.000 (%)", en: "Original margin of safety = (3,000 − 2,864) ÷ 3,000 (%)" }, a: 4.5, tol: 0.1, unit: "%" },
      ],
      why: { vi: "66 × 0,95 = 62,7 triệu; trừ 63 triệu cố định → lỗ 0,3 triệu. Doanh số chỉ giảm 5% mà lợi nhuận giảm 110% (≈ 22 × 5%). Biên an toàn chỉ 4,5% — rất mỏng.", en: "66 × 0.95 = 62.7M; minus 63M fixed → a 0.3M loss. Sales fell just 5% but profit fell 110% (≈ 22 × 5%). The margin of safety is only 4.5% — very thin." },
      hint: { vi: "Chi phí biến đổi giảm cùng doanh số, nên lãi góp cũng giảm đúng 5%.", en: "Variable costs fall with sales, so contribution also falls exactly 5%." },
    },
    {
      t: "mcq", q: { vi: "Cách nào làm quán Linh BỚT mong manh nhất mà không cần tăng giá?", en: "Which change makes Linh's shop LEAST fragile without raising prices?" },
      o: [
        { vi: "Thương lượng chuyển một phần tiền thuê thành % doanh thu", en: "Negotiate part of the rent into a % of sales" },
        { vi: "Ký hợp đồng thuê dài hạn cố định đắt hơn để 'giữ chỗ'", en: "Sign a pricier long fixed lease to 'lock in' the spot" },
        { vi: "Thuê thêm nhân viên toàn thời gian", en: "Hire more full-time staff" },
        { vi: "Vay tiền mở thêm chi nhánh ngay", en: "Borrow to open a second branch now" },
      ],
      a: 0,
      why: { vi: "Biến một phần chi phí cố định thành biến đổi làm giảm điểm hòa vốn và DOL: tháng vắng khách, chi phí cũng giảm theo.", en: "Turning some fixed costs into variable ones lowers break-even and DOL: in a quiet month, costs shrink too." },
    },
  ],
};
export default lesson;
