/* Public finance · G2 — "Government borrowing: good or bad?" (design doc 13.2d ⑤, 6-beat frame 13.2c)
 * Deficit, public debt, government bonds; when borrowing to invest is worth it. Trap: "public debt is always bad".
 * Country A borrows 100 for a port that raises tax revenue by 12/yr at 5% interest; country B borrows 100 for a one-off
 * handout → only the 5/yr interest remains.
 * ⚠️ Draft written with AI help — team review. Verify: Greece's public debt ≈ 146% of GDP in 2010 (≈ 180% by 2014);
 * first EU–IMF bailout €110 billion (May 2010); deficit ≈ 15% of GDP in 2009 after revisions. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "g-debt",
  domain: "public",
  icon: "📜",
  ic: "scale",
  minutes: 6,
  title: { vi: "Chính phủ vay nợ: tốt hay xấu?", en: "Government borrowing: good or bad?" },
  desc: {
    vi: "Bội chi, nợ công, trái phiếu chính phủ; khi nào vay để đầu tư là đáng, và chuyện gì xảy ra khi người cho vay mất niềm tin.",
    en: "Deficits, public debt, government bonds; when borrowing to invest is worth it, and what happens when lenders lose faith.",
  },
  prereq: { vi: "ngân sách nhà nước (G1) và vay nợ vs vốn góp (B4).", en: "the state budget (G1) and debt vs equity (B4)." },
  review: {
    title: { vi: "Nợ công", en: "Public debt" },
    points: [
      { vi: "<b>Bội chi</b>: năm nay chi nhiều hơn thu. <b>Nợ công</b>: tổng nợ cộng dồn.", en: "<b>Deficit</b>: spending more than revenue this year. <b>Public debt</b>: all borrowing added up." },
      { vi: "Chính phủ vay chủ yếu bằng <b>trái phiếu chính phủ</b>.", en: "Governments borrow mainly by issuing <b>government bonds</b>." },
      { vi: "Vay để đầu tư sinh lợi (cảng, đường) khác vay để tiêu dùng một lần.", en: "Borrowing for productive investment (ports, roads) differs from borrowing to spend once." },
      { vi: "Nợ quá cao + mất niềm tin → lãi vay vọt lên → khủng hoảng.", en: "Too much debt + lost trust → borrowing costs soar → crisis." },
    ],
  },
  info: {
    s: { vi: "Vay nợ tốt khi tiền đi vào đầu tư tạo thêm thu nhập lớn hơn tiền lãi; xấu khi vay để tiêu dùng hay nợ tăng nhanh hơn khả năng trả.", en: "Borrowing is good when it funds investment that earns more than the interest; bad when it pays for consumption or debt outgrows the ability to repay." },
    l: {
      vi: "Khi chi nhiều hơn thu, chính phủ bội chi và phải vay — chủ yếu bằng cách phát hành trái phiếu chính phủ cho ngân hàng, quỹ, người dân, nhà đầu tư nước ngoài. Nợ cộng dồn qua các năm thành nợ công, thường được so với GDP để biết nền kinh tế 'gánh' được không. Vay để xây hạ tầng giúp kinh tế lớn lên và thu thuế nhiều hơn về sau có thể rất đáng; vay để chi tiêu thường xuyên thì chỉ để lại tiền lãi. Nếu nợ tăng quá nhanh và người cho vay sợ không được trả, họ đòi lãi cao hơn — nợ càng khó trả, có thể thành khủng hoảng như Hy Lạp năm 2010.",
      en: "When spending exceeds revenue, the government runs a deficit and borrows — mostly by selling government bonds to banks, funds, people and foreign investors. Debt piled up over the years is public debt, usually compared with GDP to see whether the economy can carry it. Borrowing for infrastructure that grows the economy and future tax revenue can be well worth it; borrowing for day-to-day spending leaves only interest. If debt grows too fast and lenders fear they won't be repaid, they demand higher rates — making debt even harder to repay, possibly a crisis like Greece in 2010.",
    },
  },
  kb: ["bond", "debt"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Athens Greece parliament protest 2010" }, art: "🏛️💸 → 📜 → 🔥", cap: { vi: "Hy Lạp, 2010", en: "Greece, 2010" },
      title: { vi: "Chính phủ vay nợ: tốt hay xấu?", en: "Government borrowing: good or bad?" },
      text: {
        vi: "Gần như mọi chính phủ trên thế giới đều nợ — kể cả những nước giàu nhất. Nhật Bản nợ hơn gấp đôi GDP mà vẫn vay được lãi thấp. Nhưng năm 2010, Hy Lạp suýt vỡ nợ, người dân bị cắt lương hưu, thất nghiệp tăng vọt. Cùng là nợ, sao kết cục khác nhau đến vậy?",
        en: "Almost every government in the world has debt — including the richest. Japan owes more than twice its GDP and still borrows cheaply. But in 2010 Greece nearly defaulted, pensions were cut and unemployment soared. Same thing — debt — so why such different endings?",
      },
      lion: { vi: "Giống bạn: vay để học nghề khác vay để mua điện thoại 📜", en: "Just like you: borrowing to learn a trade differs from borrowing for a phone 📜" },
    },
    /* 2 · Guess first */
    {
      t: "pick", q: { vi: "Đoán trước khi tính: Nước A vay 100 xây cảng biển (giúp thu thêm 12 tiền thuế mỗi năm). Nước B vay 100 phát tiền cho dân một lần. Lãi vay 5%/năm. Sau 10 năm nước nào khá hơn?", en: "Guess before calculating: Country A borrows 100 for a port (bringing in 12 more tax each year). Country B borrows 100 for a one-off handout. Interest 5% a year. After 10 years, who's better off?" },
      opts: [["⚓", { vi: "Nước A", en: "Country A" }], ["💵", { vi: "Nước B", en: "Country B" }], ["🤝", { vi: "Như nhau — cùng nợ 100", en: "The same — both owe 100" }]],
      a: 0,
      why: { vi: "A: mỗi năm thu thêm 12, trả lãi 5 → dư 7/năm, sau 10 năm dư 70 để trả bớt nợ. B: mỗi năm trả lãi 5, không có thu thêm → mất 50 tiền lãi và vẫn nợ 100. Cùng con số nợ, khác hẳn nhau vì tiền đi đâu.", en: "A: +12 a year, −5 interest → 7 a year spare, 70 after 10 years to repay debt. B: −5 a year with nothing coming in → 50 paid in interest and still owes 100. Same debt figure, totally different outcomes — because of where the money went." },
    },
    /* 3 · Mechanism */
    {
      t: "match", q: { vi: "Nối khái niệm với ý nghĩa", en: "Match each idea to its meaning" },
      pairs: [
        [{ vi: "📉 Bội chi ngân sách", en: "📉 Budget deficit" }, { vi: "Năm nay chi nhiều hơn thu", en: "Spending more than revenue this year" }],
        [{ vi: "📜 Nợ công", en: "📜 Public debt" }, { vi: "Tổng số nợ nhà nước cộng dồn", en: "All the state's borrowing added up" }],
        [{ vi: "🧾 Trái phiếu chính phủ", en: "🧾 Government bond" }, { vi: "Giấy vay nợ nhà nước bán cho nhà đầu tư", en: "An IOU the state sells to investors" }],
        [{ vi: "⚖️ Nợ công / GDP", en: "⚖️ Debt / GDP" }, { vi: "Nợ so với quy mô nền kinh tế", en: "Debt compared with the size of the economy" }],
      ],
      why: { vi: "Bội chi là 'dòng chảy' từng năm; nợ công là 'bể chứa' cộng dồn. So nợ với GDP giống so khoản nợ của một gia đình với thu nhập của họ.", en: "The deficit is the yearly 'flow'; public debt is the accumulated 'stock'. Comparing debt with GDP is like comparing a family's debt with its income." },
    },
    {
      t: "calc", q: { vi: "Nước A vay 100 (lãi 5%/năm) xây cảng, cảng giúp thu thêm 12/năm. Nước B vay 100 để phát một lần.", en: "Country A borrows 100 (5% a year) for a port that adds 12 a year in revenue. Country B borrows 100 for a one-off handout." },
      parts: [
        { label: { vi: "A: phần dư mỗi năm sau khi trả lãi", en: "A: yearly surplus after interest" }, a: 7, tol: 0, unit: "" },
        { label: { vi: "B: tổng tiền lãi trả trong 10 năm", en: "B: total interest paid over 10 years" }, a: 50, tol: 0, unit: "" },
      ],
      why: { vi: "12 − 5 = 7. 5 × 10 = 50. Vay đáng khi lợi ích tạo ra lớn hơn chi phí lãi vay — y như với doanh nghiệp (B4, B5).", en: "12 − 5 = 7. 5 × 10 = 50. Borrowing pays when the benefit exceeds the interest cost — just like for a business (B4, B5)." },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Nợ công Hy Lạp (% GDP). Điều gì xảy ra quanh năm 2010?", en: "Greece's public debt (% of GDP). What happened around 2010?" },
      chart: {
        kind: "bar",
        labels: ["2007", "2008", "2009", "2010", "2011"],
        series: [{ name: { vi: "Nợ công (% GDP)", en: "Public debt (% of GDP)" }, color: "#3D7BF5", data: [103, 109, 127, 146, 172] }],
        y: "% GDP",
        source: { vi: "Eurostat (làm tròn) — cần kiểm chứng", en: "Eurostat (rounded) — to be verified" },
      },
      o: [
        { vi: "Nợ tăng vọt, người cho vay mất niềm tin, lãi vay tăng mạnh — Hy Lạp phải nhận gói cứu trợ và cắt giảm chi tiêu", en: "Debt shot up, lenders lost trust, borrowing costs jumped — Greece needed a bailout and spending cuts" },
        { vi: "Nợ giảm về 0", en: "Debt fell to zero" },
        { vi: "Hy Lạp in tiền trả hết nợ", en: "Greece printed money to pay it all" },
        { vi: "Không có gì xảy ra", en: "Nothing happened" },
      ],
      a: 0,
      why: { vi: "Cuối 2009 Hy Lạp công bố bội chi thật lớn hơn nhiều so với báo cáo trước đó. Nhà đầu tư hoảng sợ, đòi lãi rất cao. Tháng 5/2010 EU và IMF cho vay cứu trợ khoảng 110 tỷ euro, đổi lại Hy Lạp phải cắt chi tiêu, tăng thuế — thất nghiệp lên rất cao. Vì dùng đồng euro, Hy Lạp không thể tự in tiền hay hạ giá đồng tiền.", en: "In late 2009 Greece revealed its real deficit was far bigger than reported. Investors panicked and demanded very high rates. In May 2010 the EU and IMF lent about €110 billion in exchange for spending cuts and tax rises — unemployment soared. Using the euro, Greece couldn't print money or devalue." },
      hint: { vi: "Nhìn cột 2010–2011.", en: "Look at the 2010–2011 bars." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“Nợ công lúc nào cũng xấu — nhà nước tốt là không nợ đồng nào.” Bạn nghĩ sao?", en: "“Public debt is always bad — a good state owes nothing.” What do you think?" },
      o: [
        { vi: "Không hẳn — vay để đầu tư sinh lợi hoặc chống suy thoái có thể có ích; vấn đề là vay vào đâu và có trả được không", en: "Not quite — borrowing for productive investment or to fight a recession can help; what matters is what it funds and whether it can be repaid" },
        { vi: "Đúng — nợ nào cũng dẫn tới vỡ nợ", en: "True — all debt leads to default" },
        { vi: "Nợ càng nhiều càng tốt", en: "The more debt the better" },
        { vi: "Chỉ nước nghèo mới nợ", en: "Only poor countries borrow" },
      ],
      a: 0,
      why: { vi: "Giống như vay học nghề hay vay mua máy cho quán: nợ là công cụ. Nguy hiểm là nợ để tiêu dùng, nợ tăng nhanh hơn thu nhập, hoặc nợ bằng ngoại tệ mà nguồn thu bằng nội tệ.", en: "Like borrowing to learn a trade or buy a machine for the shop: debt is a tool. The danger is debt for consumption, debt growing faster than income, or debt in foreign currency with revenue in local currency." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: chính phủ muốn vay thêm để xây đường sắt tốc độ cao. Hãy nêu 1–2 câu: điều gì khiến khoản vay này đáng hay không đáng?", en: "Final boss: the government wants to borrow more for high-speed rail. In 1–2 sentences: what would make this loan worth it or not?" },
      keys: [
        { label: { vi: "Lợi ích / thu nhập tạo ra", en: "Benefits / income created" }, words: { vi: ["lợi ích", "thu thêm", "tăng trưởng", "thuế", "kinh tế", "sinh lợi"], en: ["benefit", "revenue", "growth", "tax", "economy", "return"] } },
        { label: { vi: "So với chi phí lãi / trả được", en: "Versus interest / repayable" }, words: { vi: ["lãi", "trả được", "chi phí", "so với", "lớn hơn"], en: ["interest", "repay", "cost", "compared", "more than"] } },
        { label: { vi: "Nợ so với GDP / niềm tin", en: "Debt to GDP / trust" }, words: { vi: ["gdp", "nợ công", "niềm tin", "quá cao", "rủi ro"], en: ["gdp", "public debt", "trust", "too high", "risk"] } },
      ],
      need: 2,
      model: { vi: "Đáng nếu đường sắt giúp kinh tế tăng trưởng và thu thêm thuế nhiều hơn tiền lãi phải trả, trong khi nợ công so với GDP vẫn ở mức an toàn; không đáng nếu lợi ích thấp hơn chi phí hoặc nợ đã quá cao.", en: "Worth it if the rail boosts growth and tax revenue by more than the interest, while debt-to-GDP stays safe; not worth it if benefits fall short of costs or debt is already too high." },
      why: { vi: "Ý chính: so lợi ích với chi phí lãi, và nhìn sức gánh nợ của cả nền kinh tế.", en: "Key idea: compare benefits with interest costs, and check the economy's capacity to carry debt." },
      hint: { vi: "Nhớ nước A và nước B.", en: "Remember countries A and B." },
    },
    {
      t: "learn", art: "📜 🔎 ⚖️",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Lần tới đọc tin “phát hành trái phiếu chính phủ” hay “nợ công”:", en: "Next time you read “government bond issue” or “public debt”:" },
      items: [
        ["🔎", { vi: "Tiền vay dùng để làm gì — đầu tư hay chi thường xuyên?", en: "What is the money for — investment or running costs?" }],
        ["⚖️", { vi: "Nợ công đang bằng bao nhiêu % GDP, đang tăng hay giảm?", en: "What % of GDP is the debt, and is it rising or falling?" }],
        ["🧠", { vi: "Áp dụng cho bạn: món nợ nào giúp bạn kiếm thêm tiền, món nào chỉ để tiêu?", en: "Apply it to yourself: which debts help you earn more, which just fund spending?" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: vai Bộ trưởng Tài chính ở Bộ Tài chính (phần chơi sắp có)!", en: "🎮 Unlocked in the game: the Finance Minister role at the ministry (gameplay coming soon)!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "Δ(nợ/GDP) ≈ (r − g) × nợ/GDP − thặng dư cơ bản", fs: 16,
      title: { vi: "Vì sao tăng trưởng quan trọng với nợ công", en: "Why growth matters for public debt" },
      text: {
        vi: "Tỷ lệ nợ/GDP thay đổi theo hai lực: lãi suất trên nợ (<b>r</b>) làm nợ lớn lên; tăng trưởng GDP danh nghĩa (<b>g</b>) làm 'mẫu số' lớn lên. Nếu g > r, tỷ lệ nợ có thể giảm dần ngay cả khi vẫn vay thêm chút ít. Nếu r > g (lãi cao, kinh tế đình trệ — như Hy Lạp 2010), nợ phình ra rất nhanh dù đã cắt chi tiêu.",
        en: "The debt-to-GDP ratio moves with two forces: the interest rate on debt (<b>r</b>) makes debt bigger; nominal GDP growth (<b>g</b>) makes the 'denominator' bigger. If g > r, the ratio can fall even with a little new borrowing. If r > g (high rates, stagnant economy — like Greece in 2010), debt balloons even after spending cuts.",
      },
    },
    {
      t: "calc", q: { vi: "Nợ = 60% GDP, không vay thêm, không thặng dư (gần đúng):", en: "Debt = 60% of GDP, no new borrowing, no surplus (approximately):" },
      parts: [
        { label: { vi: "r = 4%, g = 7%: nợ/GDP năm sau (%, 1 chữ số thập phân)", en: "r = 4%, g = 7%: next year's debt/GDP (%, 1 decimal)" }, a: 58.2, tol: 0.1, unit: "%" },
        { label: { vi: "r = 8%, g = 1%: nợ/GDP năm sau (%, 1 chữ số thập phân)", en: "r = 8%, g = 1%: next year's debt/GDP (%, 1 decimal)" }, a: 64.2, tol: 0.1, unit: "%" },
      ],
      why: { vi: "60 + (4 − 7)% × 60 = 58,2. 60 + (8 − 1)% × 60 = 64,2. Cùng số nợ, tăng trưởng và lãi suất quyết định nó nhẹ đi hay nặng thêm.", en: "60 + (4 − 7)% × 60 = 58.2. 60 + (8 − 1)% × 60 = 64.2. Same debt — growth and rates decide whether it gets lighter or heavier." },
    },
  ],
};
export default lesson;
