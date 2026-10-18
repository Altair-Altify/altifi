/* Macroeconomics · M4 — "Two steering wheels: government & central bank" (design doc 13.2d ③, 6-beat frame 13.2c)
 * Fiscal vs monetary policy, stagflation, stimulus. Trap: "the government printing money ends poverty".
 * Dial (cold economy): inflation = 1 − 0.8·(r − 6), unemployment = 8 + 1.0·(r − 6); goals u ≤ 5, π ≤ 4 → r 2.25–3.
 * ⚠️ Draft written with AI help — team review. Verify (US, annual averages, rounded): inflation 1972 3.3%, 1973 6.2%,
 * 1974 11.0%, 1975 9.1%, 1976 5.8%; unemployment 5.6%, 4.9%, 5.6%, 8.5%, 7.7%. Multiplier figures are textbook simplifications. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "m-policy",
  domain: "macro",
  icon: "🕹️",
  ic: "sliders",
  minutes: 7,
  title: { vi: "Hai tay lái: chính phủ & NHTW", en: "Two steering wheels: government & central bank" },
  desc: {
    vi: "Chính sách tài khóa (thuế, chi tiêu công) và tiền tệ (lãi suất, lượng tiền); khi kinh tế quá nóng, quá lạnh, và cơn ác mộng 'đình lạm'.",
    en: "Fiscal policy (taxes, public spending) and monetary policy (rates, money); when the economy runs too hot or too cold, and the nightmare of 'stagflation'.",
  },
  prereq: { vi: "NHTW & lãi suất (M2), nguồn gốc lạm phát (M1).", en: "central bank & rates (M2), where inflation comes from (M1)." },
  review: {
    title: { vi: "Hai tay lái", en: "Two wheels" },
    points: [
      { vi: "<b>Tài khóa</b> (chính phủ, Quốc hội): thuế, chi tiêu công.", en: "<b>Fiscal</b> (government, parliament): taxes, public spending." },
      { vi: "<b>Tiền tệ</b> (NHTW): lãi suất, lượng tiền.", en: "<b>Monetary</b> (central bank): interest rates, money supply." },
      { vi: "Quá lạnh → hạ lãi, tăng chi, giảm thuế. Quá nóng → ngược lại.", en: "Too cold → cut rates, spend more, cut taxes. Too hot → the opposite." },
      { vi: "<b>Đình lạm</b>: lạm phát cao + thất nghiệp cao cùng lúc — khó chữa nhất.", en: "<b>Stagflation</b>: high inflation + high unemployment together — hardest to fix." },
    ],
  },
  info: {
    s: { vi: "Chính phủ lái bằng thuế và chi tiêu (tài khóa), NHTW lái bằng lãi suất và tiền (tiền tệ); đình lạm là khi cả lạm phát và thất nghiệp cùng cao.", en: "Governments steer with taxes and spending (fiscal), central banks with rates and money (monetary); stagflation is high inflation plus high unemployment." },
    l: {
      vi: "Nền kinh tế có hai tay lái. Chính sách tài khóa do chính phủ và Quốc hội quyết: tăng chi tiêu công (đường, trường, hỗ trợ người dân) hoặc giảm thuế để kích cầu khi kinh tế lạnh; làm ngược lại khi quá nóng. Chính sách tiền tệ do NHTW điều hành: hạ lãi suất, bơm tiền khi kinh tế lạnh; tăng lãi khi lạm phát cao. Hai tay lái cần đi cùng hướng. Khó nhất là đình lạm — như sau cú sốc dầu 1973: giá tăng do chi phí đẩy trong khi kinh tế đình trệ; hạ lãi thì lạm phát tệ hơn, tăng lãi thì thất nghiệp tệ hơn.",
      en: "The economy has two wheels. Fiscal policy is decided by government and parliament: more public spending (roads, schools, support for people) or lower taxes to boost demand when the economy is cold; the reverse when it's overheating. Monetary policy is run by the central bank: cut rates and add money when cold; raise rates when inflation is high. The two should steer the same way. The hardest case is stagflation — as after the 1973 oil shock: cost-push inflation while the economy stalls; cut rates and inflation worsens, raise them and unemployment worsens.",
    },
  },
  kb: ["inflation", "fixedfloat", "crisis1973"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "empty street lockdown 2020" }, art: "🏛️ 🕹️ + 🏦 🎛️", cap: { vi: "Hai người cầm lái một chiếc xe", en: "Two drivers, one car" },
      title: { vi: "Hai tay lái: chính phủ & NHTW", en: "Two steering wheels: government & central bank" },
      text: {
        vi: "Năm 2020, đại dịch làm cửa hàng đóng cửa, nhiều người mất việc. Khắp thế giới, <b>chính phủ</b> giãn thuế, hỗ trợ tiền cho người dân và doanh nghiệp, còn <b>NHTW</b> hạ lãi suất, bơm tiền. Hai tay lái cùng đánh về một hướng. Nhưng năm 2022, chính những đợt bơm đó góp phần đẩy lạm phát lên… Lái kinh tế khó hơn lái xe nhiều.",
        en: "In 2020 the pandemic shut shops and cost many people their jobs. Around the world, <b>governments</b> delayed taxes and sent money to people and firms, while <b>central banks</b> cut rates and added money. Both wheels turned the same way. But by 2022 that same support helped push inflation up… Steering an economy is much harder than driving.",
      },
      lion: { vi: "Hôm nay bạn cầm cả hai tay lái 🕹️🎛️", en: "Today you hold both wheels 🕹️🎛️" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: năm 1974, sau khi giá dầu tăng khoảng 4 lần, kinh tế Mỹ đang chững lại. Lạm phát Mỹ năm đó khoảng bao nhiêu?", en: "Guess: in 1974, after oil prices roughly quadrupled, the US economy was stalling. What was US inflation that year?" },
      art: "⛽ ×4 · 📉", min: 0, max: 20, step: 0.5, start: 3, actual: 11, unit: "pct",
      reveal: { vi: "Khoảng <b>11%</b> — trong khi năm sau thất nghiệp lên ~8,5%. Thường lạm phát cao đi cùng kinh tế nóng; nhưng 1974–75 giá tăng mạnh TRONG KHI kinh tế đình trệ. Gọi là <b>đình lạm</b>.", en: "About <b>11%</b> — and unemployment hit ~8.5% the next year. Usually high inflation comes with a hot economy; but in 1974–75 prices soared WHILE the economy stalled. That's <b>stagflation</b>." },
    },
    /* 3 · Mechanism */
    {
      t: "sort", q: { vi: "Công cụ này thuộc tay lái nào?", en: "Which wheel does this tool belong to?" },
      buckets: [["🏛️", { vi: "Tài khóa (chính phủ)", en: "Fiscal (government)" }], ["🏦", { vi: "Tiền tệ (NHTW)", en: "Monetary (central bank)" }]],
      items: [
        ["🧾", { vi: "Giảm thuế giá trị gia tăng 2%", en: "Cut VAT by 2 points" }, 0],
        ["🎛️", { vi: "Hạ lãi suất điều hành", en: "Cut the policy rate" }, 1],
        ["🛣️", { vi: "Đẩy nhanh xây đường cao tốc", en: "Speed up building highways" }, 0],
        ["💵", { vi: "Mua trái phiếu để bơm tiền cho ngân hàng", en: "Buy bonds to put money into banks" }, 1],
        ["🤝", { vi: "Gói hỗ trợ tiền mặt cho người mất việc", en: "Cash support for people who lost jobs" }, 0],
        ["🏦", { vi: "Yêu cầu ngân hàng giữ ít dự trữ hơn để cho vay nhiều hơn", en: "Let banks hold fewer reserves so they lend more" }, 1],
      ],
      why: { vi: "Thuế và chi tiêu đi qua ngân sách nhà nước → tài khóa. Lãi suất, lượng tiền, quy định cho vay → tiền tệ.", en: "Taxes and spending go through the state budget → fiscal. Rates, money and lending rules → monetary." },
      hint: { vi: "Có liên quan tới ngân sách nhà nước (thu/chi) không?", en: "Does it involve the state budget (revenue/spending)?" },
    },
    {
      t: "dial", q: { vi: "Kinh tế quá LẠNH: thất nghiệp 8%, lạm phát chỉ 1%. Bạn là Thống đốc: xoay lãi suất để thất nghiệp xuống ≤ 5% mà lạm phát không vượt 4%.", en: "The economy is too COLD: unemployment 8%, inflation just 1%. As Governor, turn the rate so unemployment falls to ≤ 5% without inflation going over 4%." },
      dial: { min: 0, max: 8, step: 0.25, start: 6, r0: 6, pi0: 1, kPi: 0.8, u0: 8, kU: 1, goalPi: 4, goalU: 5, loan: 1_000_000_000, months: 240, spread: 4 },
      a: 2.75,
      why: { vi: "Khoảng 2,25–3%: hạ lãi đủ mạnh để doanh nghiệp vay, mở rộng, tuyển người; nhưng hạ quá sâu (gần 0%) thì lạm phát vượt mục tiêu. Khoản vay nhà bạn cũng nhẹ đi — kích cầu chính là như vậy. (Mô hình đơn giản để minh họa.)", en: "Roughly 2.25–3%: cut enough for firms to borrow, expand and hire; cut too far (near 0%) and inflation overshoots. Your family's loan gets lighter too — that's how stimulus works. (A simple model for illustration.)" },
      hint: { vi: "Lần này là HẠ lãi suất — tìm vùng cả hai ô đầu cùng xanh.", en: "This time you CUT rates — find where the first two boxes are both green." },
    },
    {
      t: "mcq", q: { vi: "Kinh tế quá NÓNG: lạm phát 9%, thất nghiệp 2%, giá nhà tăng vọt. Kết hợp hai tay lái nào hợp lý?", en: "The economy is too HOT: inflation 9%, unemployment 2%, house prices soaring. Which combination makes sense?" },
      o: [
        { vi: "NHTW tăng lãi suất + chính phủ giảm bớt chi tiêu công chưa cấp bách", en: "Central bank raises rates + government trims non-urgent spending" },
        { vi: "NHTW hạ lãi suất + chính phủ giảm thuế", en: "Central bank cuts rates + government cuts taxes" },
        { vi: "NHTW tăng lãi suất + chính phủ phát thêm tiền mặt cho mọi người", en: "Central bank raises rates + government hands everyone cash" },
        { vi: "Không làm gì, để giá tự hạ", en: "Do nothing, let prices fall by themselves" },
      ],
      a: 0,
      why: { vi: "Hai tay lái cùng hãm thì xe chậm nhanh hơn và êm hơn. Nếu NHTW hãm mà chính phủ lại đạp ga (phát tiền), hai bên triệt tiêu nhau và lạm phát kéo dài.", en: "Both wheels braking slows the car faster and more smoothly. If the central bank brakes while the government accelerates (hands out cash), they cancel out and inflation lingers." },
      hint: { vi: "Quá nóng thì cả hai cùng… ?", en: "Too hot means both should… ?" },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Mỹ 1972–1976: lạm phát và thất nghiệp. Năm 1974–1975 có gì bất thường?", en: "US 1972–1976: inflation and unemployment. What was unusual in 1974–75?" },
      chart: {
        kind: "line",
        labels: ["1972", "1973", "1974", "1975", "1976"],
        series: [
          { name: { vi: "Lạm phát (%)", en: "Inflation (%)" }, color: "#EF4E4E", data: [3.3, 6.2, 11.0, 9.1, 5.8] },
          { name: { vi: "Thất nghiệp (%)", en: "Unemployment (%)" }, color: "#3D7BF5", data: [5.6, 4.9, 5.6, 8.5, 7.7] },
        ],
        y: "%",
        source: { vi: "Cục Thống kê Lao động Mỹ (bình quân năm, làm tròn)", en: "US Bureau of Labor Statistics (annual averages, rounded)" },
      },
      o: [
        { vi: "Cả lạm phát và thất nghiệp cùng cao — đình lạm", en: "Inflation and unemployment were both high — stagflation" },
        { vi: "Cả hai cùng thấp kỷ lục", en: "Both hit record lows" },
        { vi: "Lạm phát âm", en: "Inflation was negative" },
        { vi: "Không có gì thay đổi", en: "Nothing changed" },
      ],
      a: 0,
      why: { vi: "Sau cú sốc dầu 1973, chi phí sản xuất tăng vọt (chi phí đẩy) đúng lúc kinh tế suy giảm. Hạ lãi để cứu việc làm thì lạm phát tệ hơn; tăng lãi để hạ giá thì thất nghiệp tệ hơn. Phải tới đầu những năm 1980, Fed tăng lãi suất rất mạnh mới dập được lạm phát — với cái giá là một cuộc suy thoái.", en: "After the 1973 oil shock, production costs soared (cost-push) just as the economy shrank. Cutting rates to save jobs worsened inflation; raising them to cut prices worsened unemployment. Only in the early 1980s did very high Fed rates finally crush inflation — at the price of a recession." },
      hint: { vi: "Nhìn năm 1975: hai đường đều ở mức cao.", en: "Look at 1975: both lines are high." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Chính phủ cứ in thêm tiền phát cho dân là hết nghèo.” Bạn nghĩ sao?", en: "“The government should just print money and hand it out — no more poverty.” What do you think?" },
      o: [
        { vi: "Sai — in tiền không làm ra thêm hàng hóa; giá cả tăng theo, tiền mất giá, người nghèo giữ tiền mặt thiệt nhất", en: "False — printing doesn't make more goods; prices rise, money loses value, and the poor who hold cash lose most" },
        { vi: "Đúng — càng nhiều tiền càng giàu", en: "True — more money, more wealth" },
        { vi: "Đúng, miễn là in vào dịp Tết", en: "True, as long as it's at Tết" },
        { vi: "Sai — vì nhà nước không có máy in", en: "False — the state has no printing press" },
      ],
      a: 0,
      why: { vi: "Hỗ trợ có mục tiêu (cho người mất việc, trong khủng hoảng, có nguồn tài trợ rõ ràng) khác với in tiền vô hạn. Zimbabwe 2008 là ví dụ cực đoan (bài M1). Của cải thật là hàng hóa, dịch vụ làm ra.", en: "Targeted support (for the jobless, in a crisis, properly funded) is different from unlimited printing. Zimbabwe 2008 is the extreme example (lesson M1). Real wealth is the goods and services produced." },
      hint: { vi: "Nhớ thị trấn trà sữa trong bài M1.", en: "Remember the milk-tea town in lesson M1." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: đình lạm — lạm phát 10%, thất nghiệp 9%. Vì sao đây là tình huống khó nhất cho người cầm lái? (1–2 câu)", en: "Final boss: stagflation — inflation 10%, unemployment 9%. Why is this the hardest case for the drivers? (1–2 sentences)" },
      keys: [
        { label: { vi: "Hạ lãi/kích cầu → lạm phát tệ hơn", en: "Stimulus → worse inflation" }, words: { vi: ["hạ lãi", "kích cầu", "bơm tiền", "lạm phát tăng", "lạm phát tệ"], en: ["cut rates", "stimulus", "pump", "inflation worse", "more inflation"] } },
        { label: { vi: "Tăng lãi/hãm → thất nghiệp tệ hơn", en: "Braking → more unemployment" }, words: { vi: ["tăng lãi", "hãm", "thất nghiệp tăng", "mất việc", "suy thoái"], en: ["raise rates", "brake", "unemployment", "jobs", "recession"] } },
        { label: { vi: "Đánh đổi / hai mục tiêu ngược nhau", en: "Trade-off / conflicting goals" }, words: { vi: ["đánh đổi", "ngược", "mâu thuẫn", "cả hai", "chi phí đẩy"], en: ["trade-off", "tradeoff", "conflict", "both", "cost-push", "opposite"] } },
      ],
      need: 2,
      model: { vi: "Vì hai mục tiêu kéo ngược nhau: hạ lãi, tăng chi để cứu việc làm thì lạm phát càng cao, còn tăng lãi để hạ giá thì càng nhiều người mất việc.", en: "Because the two goals pull opposite ways: cutting rates and spending to save jobs pushes inflation higher, while raising rates to cut prices costs more jobs." },
      why: { vi: "Ý chính: mỗi tay lái chữa được một bệnh nhưng làm bệnh kia nặng thêm.", en: "Key idea: each wheel cures one problem but worsens the other." },
      hint: { vi: "Thử từng công cụ: nó giúp lạm phát hay thất nghiệp, và làm hại cái nào?", en: "Try each tool: which problem does it help, and which does it hurt?" },
    },
    {
      t: "learn", art: "📰 🏛️ 🏦",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Khi đọc tin chính sách kinh tế:", en: "When you read economic-policy news:" },
      items: [
        ["🔎", { vi: "Đây là tay lái nào — chính phủ (thuế, chi tiêu) hay NHTW (lãi suất)?", en: "Which wheel — government (taxes, spending) or central bank (rates)?" }],
        ["🌡️", { vi: "Nền kinh tế đang nóng hay lạnh — chính sách đang hãm hay đạp ga?", en: "Is the economy hot or cold — is policy braking or accelerating?" }],
        ["👥", { vi: "Ai được hỗ trợ, ai trả tiền (thuế, nợ công)?", en: "Who gets support, who pays (taxes, public debt)?" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: vai Thống đốc trong Bảo tàng Khủng hoảng — thử cứu nước Mỹ năm 1930!", en: "🎮 Unlocked in the game: the Governor role in the Crisis Museum — try to save America in 1930!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "k = 1 ÷ (1 − MPC)", fs: 28,
      title: { vi: "Số nhân chi tiêu", en: "The spending multiplier" },
      text: {
        vi: "Khi chính phủ chi 100 tỷ xây đường, người thợ nhận lương lại chi tiêu một phần (gọi là xu hướng tiêu dùng cận biên MPC), người bán hàng lại chi tiếp… Tổng tác động có thể lớn hơn 100 tỷ: <b>số nhân k = 1 ÷ (1 − MPC)</b>. Thực tế số nhân nhỏ hơn lý thuyết vì một phần tiền dùng để tiết kiệm, nộp thuế, mua hàng nhập khẩu, và vì chi tiêu công có thể 'chèn lấn' đầu tư tư nhân.",
        en: "When the government spends 100 billion on a road, workers spend part of their pay (the marginal propensity to consume, MPC), shopkeepers spend part again… The total effect can exceed 100 billion: <b>multiplier k = 1 ÷ (1 − MPC)</b>. In reality it's smaller, because some money is saved, taxed or spent on imports, and public spending can 'crowd out' private investment.",
      },
    },
    {
      t: "calc", q: { vi: "Mô hình đơn giản (không thuế, không nhập khẩu):", en: "Simple model (no taxes, no imports):" },
      parts: [
        { label: { vi: "MPC = 0,8 → số nhân k", en: "MPC = 0.8 → multiplier k" }, a: 5, tol: 0.05, unit: "" },
        { label: { vi: "Chi thêm 100 tỷ → tổng sản lượng tăng tối đa (tỷ ₫)", en: "Spend 100 billion more → max total output rise (billion ₫)" }, a: 500, tol: 0.5, unit: { vi: "tỷ ₫", en: "billion ₫" } },
        { label: { vi: "Nếu MPC = 0,5 thì k = ?", en: "If MPC = 0.5, k = ?" }, a: 2, tol: 0.05, unit: "" },
      ],
      why: { vi: "1 ÷ 0,2 = 5 → 500 tỷ. 1 ÷ 0,5 = 2. Người dân càng tiêu nhiều phần tiền tăng thêm, kích cầu càng mạnh.", en: "1 ÷ 0.2 = 5 → 500 billion. 1 ÷ 0.5 = 2. The more of each extra unit people spend, the stronger the stimulus." },
    },
    {
      t: "mcq", q: { vi: "'Chèn lấn' (crowding out) nghĩa là gì?", en: "What is 'crowding out'?" },
      o: [
        { vi: "Chính phủ vay nhiều để chi tiêu làm lãi suất tăng, doanh nghiệp tư nhân vay đắt hơn nên đầu tư ít đi", en: "Heavy government borrowing pushes rates up, so private firms borrow less and invest less" },
        { vi: "Đường cao tốc quá đông xe", en: "Highways get too crowded" },
        { vi: "Ngân hàng đóng cửa vì đông khách", en: "Banks close because of crowds" },
        { vi: "Dân số tăng quá nhanh", en: "Population grows too fast" },
      ],
      a: 0,
      why: { vi: "Đó là lý do chi tiêu công không phải 'bữa trưa miễn phí': nguồn tiền (thuế hay vay) có tác động phụ (bài G2).", en: "That's why public spending isn't a 'free lunch': how it's paid for (taxes or borrowing) has side effects (lesson G2)." },
    },
  ],
};
export default lesson;
