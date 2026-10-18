/* Public finance · G1 — "Where does my tax money go?" (design doc 13.2d ⑤, 6-beat frame 13.2c)
 * Budget revenue (taxes, fees, charges; VAT inside a milk tea), public investment vs recurrent spending.
 * Trap: "teens don't pay tax" (VAT is in almost everything you buy).
 * ⚠️ Draft written with AI help — team review. VERIFY: Vietnam's standard VAT rate (10%) and the temporary 8% rate applied
 * to many goods in recent years; the North–South expressway as a public-investment example (no figures quoted).
 * The city-budget exercise uses made-up numbers. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "g-tax",
  domain: "public",
  icon: "🏛️",
  ic: "bank",
  minutes: 6,
  title: { vi: "Tiền thuế của mình đi đâu?", en: "Where does my tax money go?" },
  desc: {
    vi: "Nhà nước thu tiền từ đâu (thuế, phí, lệ phí — cả trong ly trà sữa của bạn), chi vào đâu (đầu tư công, chi thường xuyên), và những đánh đổi khi chia ngân sách.",
    en: "Where the state's money comes from (taxes, fees, charges — even in your milk tea), where it goes (public investment, day-to-day spending), and the trade-offs of splitting a budget.",
  },
  prereq: { vi: "ngân sách cá nhân Cần · Muốn · Tương lai (P1).", en: "your own Need · Want · Future budget (P1)." },
  review: {
    title: { vi: "Ngân sách nhà nước", en: "The state budget" },
    points: [
      { vi: "Thu: thuế (GTGT, thu nhập, doanh nghiệp…), phí, lệ phí, bán tài nguyên…", en: "Revenue: taxes (VAT, income, corporate…), fees, charges, resources…" },
      { vi: "Chi <b>thường xuyên</b>: lương giáo viên, bác sĩ, vận hành bộ máy.", en: "<b>Recurrent</b> spending: teachers', doctors' pay, running the state." },
      { vi: "Chi <b>đầu tư công</b>: đường, trường, bệnh viện — dùng nhiều năm.", en: "<b>Public investment</b>: roads, schools, hospitals — used for years." },
      { vi: "Teen cũng đóng thuế: thuế GTGT nằm trong giá hàng.", en: "Teens pay tax too: VAT is built into prices." },
    ],
  },
  info: {
    s: { vi: "Nhà nước thu chủ yếu từ thuế (kể cả thuế GTGT trong giá hàng bạn mua) và chi cho chi thường xuyên và đầu tư công.", en: "The state collects mostly taxes (including VAT in the prices you pay) and spends on running costs and public investment." },
    l: {
      vi: "Ngân sách nhà nước giống ngân sách gia đình nhưng lớn hơn rất nhiều. Bên thu có thuế giá trị gia tăng (nằm sẵn trong giá hầu hết hàng hóa, dịch vụ), thuế thu nhập cá nhân, thuế thu nhập doanh nghiệp, thuế xuất nhập khẩu, phí và lệ phí. Bên chi có chi thường xuyên (lương giáo viên, y bác sĩ, công an, vận hành bộ máy, trợ cấp) và chi đầu tư công (đường cao tốc, trường học, bệnh viện). Quốc hội quyết định dự toán ngân sách mỗi năm. Vì tiền có hạn, mỗi đồng chi cho việc này là một đồng không chi cho việc khác — đó là đánh đổi.",
      en: "The state budget is like a family budget, only far bigger. Revenue includes value-added tax (already built into the price of most goods and services), personal income tax, corporate income tax, import/export duties, fees and charges. Spending includes recurrent costs (teachers, health workers, police, running the state, benefits) and public investment (highways, schools, hospitals). The National Assembly approves the budget each year. Money is limited, so every unit spent on one thing isn't spent on another — that's a trade-off.",
    },
  },
  kb: ["budget"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Vietnam highway construction" }, art: "🧋 35.000₫ → 🏛️ ?", cap: { vi: "Một phần ly trà sữa đi xây đường?", en: "Part of your milk tea builds roads?" },
      title: { vi: "Tiền thuế của mình đi đâu?", en: "Where does my tax money go?" },
      text: {
        vi: "Bạn nghĩ mình chưa đóng thuế vì chưa đi làm? Mỗi ly trà sữa, gói snack, lượt nạp điện thoại bạn trả đã có <b>thuế giá trị gia tăng</b> bên trong. Tiền đó cùng hàng triệu khoản khác chảy vào ngân sách nhà nước — rồi thành lương thầy cô, con đường bạn đi học, bệnh viện. Ai quyết định chia ra sao?",
        en: "Think you don't pay tax because you don't work yet? Every milk tea, snack and phone top-up you buy already includes <b>value-added tax</b>. That money, with millions of others, flows into the state budget — and becomes your teachers' pay, the road to school, hospitals. Who decides how it's split?",
      },
      lion: { vi: "Hôm nay bạn làm Chủ tịch thành phố, chia ngân sách 🏛️", en: "Today you're the mayor splitting the budget 🏛️" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: một ly trà sữa 35.000₫ đã gồm thuế GTGT 10% (giả định). Trong đó có bao nhiêu tiền thuế?", en: "Guess: a 35,000₫ milk tea includes 10% VAT (assumed). How much of it is tax?" },
      art: "🧋 35.000₫ = giá + thuế", min: 0, max: 10000, step: 100, start: 500, actual: 3200, unit: "vnd",
      reveal: { vi: "Khoảng <b>3.200₫</b> (35.000 ÷ 1,1 × 10%). Mỗi tháng uống 8 ly là bạn đóng khoảng 25.000₫ thuế. Lưu ý: những năm gần đây nhiều mặt hàng được áp mức tạm thời 8% — mức cụ thể đổi theo quy định.", en: "About <b>3,200₫</b> (35,000 ÷ 1.1 × 10%). Eight cups a month means about 25,000₫ of tax. Note: in recent years many goods had a temporary 8% rate — the exact rate follows current rules." },
    },
    /* 3 · Mechanism */
    {
      t: "sort", q: { vi: "Khoản này là THU hay CHI của ngân sách nhà nước?", en: "Is this state budget REVENUE or SPENDING?" },
      buckets: [["📥", { vi: "Thu", en: "Revenue" }], ["📤", { vi: "Chi", en: "Spending" }]],
      items: [
        ["🧾", { vi: "Thuế GTGT trong giá hàng", en: "VAT in prices" }, 0],
        ["👩‍🏫", { vi: "Lương giáo viên trường công", en: "Public-school teachers' pay" }, 1],
        ["🏭", { vi: "Thuế thu nhập doanh nghiệp", en: "Corporate income tax" }, 0],
        ["🛣️", { vi: "Xây đường cao tốc", en: "Building a highway" }, 1],
        ["🪪", { vi: "Lệ phí làm hộ chiếu", en: "Passport fee" }, 0],
        ["🏥", { vi: "Bảo hiểm y tế cho trẻ em dưới 6 tuổi", en: "Health insurance for under-6s" }, 1],
      ],
      why: { vi: "Thu: thuế, phí, lệ phí. Chi: trả lương khu vực công, xây công trình, an sinh xã hội.", en: "Revenue: taxes, fees, charges. Spending: public-sector pay, building projects, social support." },
    },
    {
      t: "jars", q: { vi: "Bạn là Chủ tịch thành phố, có 100 tỷ năm nay. Hội đồng đã chốt: giáo dục 30, y tế 25, giao thông 25, an sinh 20 (tỷ). Chia đúng theo kế hoạch.", en: "You're the mayor with 100 billion this year. The council agreed: education 30, health 25, transport 25, welfare 20 (billion). Split it to plan." },
      total: 100_000_000_000, step: 5_000_000_000, unit: "mvnd",
      jars: [[{ vi: "🎓 Giáo dục", en: "🎓 Education" }, "#3D7BF5", 30_000_000_000], [{ vi: "🏥 Y tế", en: "🏥 Health" }, "#2FAE73", 25_000_000_000], [{ vi: "🛣️ Giao thông", en: "🛣️ Transport" }, "#F5A524", 25_000_000_000], [{ vi: "🤝 An sinh", en: "🤝 Welfare" }, "#F7867A", 20_000_000_000]],
      why: { vi: "Mỗi tỷ thêm cho đường là một tỷ bớt cho trường hay bệnh viện. Ngân sách thật được Quốc hội và Hội đồng nhân dân thảo luận và biểu quyết — vì mọi lựa chọn đều có người được, người chưa được.", en: "Every extra billion for roads is a billion less for schools or hospitals. Real budgets are debated and voted on by the National Assembly and People's Councils — because every choice has winners and people who wait." },
      hint: { vi: "Kéo từng hũ đúng con số hội đồng đã chốt.", en: "Set each jar to the council's number." },
    },
    {
      t: "mcq", q: { vi: "Năm sau bạn có thêm 10 tỷ. Xây thêm một trường (dùng 30 năm) khác gì tăng thưởng Tết cho công chức (dùng một lần)?", en: "Next year you get 10 billion extra. How is building a school (used for 30 years) different from a one-off holiday bonus for civil servants?" },
      o: [
        { vi: "Trường là đầu tư công — tạo lợi ích nhiều năm; thưởng là chi thường xuyên/một lần — lợi ích ngay nhưng không để lại tài sản", en: "The school is public investment — benefits for years; the bonus is one-off spending — a benefit now but no lasting asset" },
        { vi: "Không khác gì, đều là chi tiền", en: "No difference, both spend money" },
        { vi: "Thưởng Tết tốt hơn vì tiêu ngay", en: "The bonus is better because it's spent at once" },
        { vi: "Trường không tốn tiền duy trì", en: "A school costs nothing to run" },
      ],
      a: 0,
      why: { vi: "Đầu tư công tạo tài sản dùng lâu dài (nhưng cần thêm chi thường xuyên để vận hành: lương giáo viên, điện nước). Chi một lần không để lại tài sản. Cả hai đều có lúc cần — đó là đánh đổi.", en: "Public investment creates long-lasting assets (but then needs running costs: teachers, utilities). One-off spending leaves no asset. Both have their place — it's a trade-off." },
    },
    /* 4 · The real story */
    {
      t: "learn", photo: { query: "North South expressway Vietnam" }, art: "🛣️ Hà Nội ⇄ Cần Thơ",
      title: { vi: "Chuyện thật: đầu tư công", en: "Real story: public investment" },
      text: {
        vi: "Cao tốc Bắc – Nam là một trong những dự án đầu tư công lớn nhất của Việt Nam. Đường tốt giúp hàng hóa đi nhanh hơn, rẻ hơn, nối các vùng — doanh nghiệp được lợi, người dân đi lại an toàn hơn, nhà nước thu thêm thuế về sau. Nhưng nó cần rất nhiều tiền ngân sách và vay, cần giải phóng mặt bằng, và phải làm đúng chất lượng — vì một đồng đầu tư lãng phí là một đồng không dành được cho trường học hay bệnh viện.",
        en: "The North–South expressway is one of Vietnam's largest public-investment projects. Good roads move goods faster and cheaper and connect regions — firms benefit, people travel more safely, the state collects more tax later. But it needs a lot of budget money and borrowing, land clearance, and proper quality — because every wasted unit is one not spent on schools or hospitals.",
      },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Mình là học sinh, mình không đóng thuế nên chuyện ngân sách không liên quan.” Đúng không?", en: "“I'm a student, I don't pay tax, so the budget has nothing to do with me.” True?" },
      o: [
        { vi: "Sai — bạn đóng thuế GTGT mỗi lần mua hàng, và bạn dùng trường công, đường, bệnh viện từ ngân sách", en: "False — you pay VAT every time you buy, and you use public schools, roads and hospitals paid by the budget" },
        { vi: "Đúng — chỉ người đi làm mới đóng thuế", en: "True — only workers pay tax" },
        { vi: "Đúng — thuế chỉ dành cho doanh nghiệp", en: "True — taxes are only for companies" },
        { vi: "Sai — vì học sinh phải nộp thuế thu nhập", en: "False — students must pay income tax" },
      ],
      a: 0,
      why: { vi: "Bẫy phổ biến! Thuế gián thu (GTGT, thuế tiêu thụ đặc biệt) nằm sẵn trong giá nên ít ai để ý. Và bạn là một trong những người hưởng ngân sách nhiều nhất: trường học, sách giáo khoa, bảo hiểm y tế học sinh.", en: "A common trap! Indirect taxes (VAT, excise) are hidden in prices so few notice them. And you're one of the budget's biggest users: schools, textbooks, student health insurance." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: thành phố còn 20 tỷ, phải chọn: sửa 5 trường xuống cấp HAY làm một quảng trường nhạc nước. Bạn chọn gì, vì sao? (1–2 câu)", en: "Final boss: the city has 20 billion left and must choose: repair 5 run-down schools OR build a musical-fountain square. What do you choose and why? (1–2 sentences)" },
      keys: [
        { label: { vi: "Lợi ích lâu dài / nhiều người", en: "Long-term / many people" }, words: { vi: ["lâu dài", "nhiều năm", "học sinh", "an toàn", "nhiều người", "lợi ích"], en: ["long term", "years", "students", "safe", "many people", "benefit"] } },
        { label: { vi: "Ưu tiên / cấp thiết", en: "Priority / urgent" }, words: { vi: ["ưu tiên", "cấp thiết", "quan trọng", "cần", "xuống cấp", "nguy hiểm"], en: ["priority", "urgent", "important", "need", "run-down", "dangerous"] } },
        { label: { vi: "Đánh đổi / chi phí cơ hội", en: "Trade-off / opportunity cost" }, words: { vi: ["đánh đổi", "thay vì", "không chi", "chi phí cơ hội", "bỏ"], en: ["trade-off", "instead", "opportunity cost", "give up"] } },
      ],
      need: 2,
      model: { vi: "Chọn sửa 5 trường vì đó là nhu cầu cấp thiết, giữ an toàn cho hàng nghìn học sinh trong nhiều năm; quảng trường đẹp nhưng có thể làm sau — đánh đổi là bây giờ chưa có chỗ vui chơi mới.", en: "Repair the 5 schools: it's urgent and keeps thousands of students safe for years; the square is nice but can wait — the trade-off is no new fun space for now." },
      why: { vi: "Ý chính: không có đáp án duy nhất — nhưng phải nêu lợi ích, ai hưởng, và thứ phải hy sinh.", en: "Key idea: there's no single answer — but you must state the benefit, who gains, and what's given up." },
      hint: { vi: "Ai được lợi, bao lâu, và bạn bỏ lỡ gì?", en: "Who benefits, for how long, and what do you give up?" },
    },
    {
      t: "learn", art: "🧾 🔎 🏛️",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Làm 'thanh tra ngân sách' trong tuần này:", en: "Be a 'budget inspector' this week:" },
      items: [
        ["🧾", { vi: "Xem một hóa đơn (siêu thị, điện thoại): dòng thuế GTGT là bao nhiêu?", en: "Check a receipt (supermarket, phone): how much is the VAT line?" }],
        ["🏫", { vi: "Kể 3 thứ quanh bạn được trả bằng ngân sách nhà nước", en: "Name 3 things around you paid for by the state budget" }],
        ["🗳️", { vi: "Nếu được chia 1 tỷ cho trường mình, bạn ưu tiên gì?", en: "If you had 1 billion for your school, what would come first?" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Tòa thị chính ở Trung tâm hành chính (phần chơi Bộ trưởng sắp có)!", en: "🎮 Unlocked in the game: City hall in the Civic Centre (the minister gameplay is coming soon)!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "📈 thuế lũy tiến · 📉 thuế lũy thoái", fs: 20,
      title: { vi: "Thuế công bằng là thế nào?", en: "What makes a tax fair?" },
      text: {
        vi: "Thuế <b>lũy tiến</b> (như thuế thu nhập cá nhân): thu nhập cao đóng tỷ lệ cao hơn. Thuế GTGT tính cùng một tỷ lệ trên giá, nhưng người thu nhập thấp tiêu gần hết thu nhập, nên tính trên <b>thu nhập</b> thì họ đóng tỷ lệ cao hơn — gọi là tính <b>lũy thoái</b>. Vì vậy nhiều nước áp mức thuế thấp hơn cho hàng thiết yếu (lương thực, thuốc, sách vở).",
        en: "A <b>progressive</b> tax (like personal income tax): higher incomes pay a higher rate. VAT is the same rate on prices, but low earners spend almost all their income, so as a share of <b>income</b> they pay more — it's <b>regressive</b>. That's why many countries tax essentials (food, medicine, books) at lower rates.",
      },
    },
    {
      t: "calc", q: { vi: "Giả sử thuế GTGT 10% trên mọi thứ tiêu dùng.", en: "Assume 10% VAT on everything consumed." },
      parts: [
        { label: { vi: "Chị A thu nhập 10tr, tiêu hết 10tr (giá đã gồm thuế). Thuế GTGT ≈ % thu nhập (1 chữ số thập phân)", en: "A earns 10M and spends all 10M (prices incl. tax). VAT ≈ % of income (1 decimal)" }, a: 9.1, tol: 0.05, unit: "%" },
        { label: { vi: "Anh B thu nhập 100tr, tiêu 40tr. Thuế GTGT ≈ % thu nhập (1 chữ số thập phân)", en: "B earns 100M and spends 40M. VAT ≈ % of income (1 decimal)" }, a: 3.6, tol: 0.05, unit: "%" },
      ],
      why: { vi: "A: 10 ÷ 1,1 × 10% ≈ 0,91tr = 9,1%. B: 40 ÷ 1,1 × 10% ≈ 3,64tr = 3,6%. Cùng mức thuế, người thu nhập thấp đóng tỷ lệ cao hơn trên thu nhập.", en: "A: 10 ÷ 1.1 × 10% ≈ 0.91M = 9.1%. B: 40 ÷ 1.1 × 10% ≈ 3.64M = 3.6%. Same rate, but the lower earner pays a bigger share of income." },
    },
  ],
};
export default lesson;
