/* Macroeconomics · M3 — "Read an economic news story in 60 seconds" (design doc 13.2d ③, 6-beat frame 13.2c)
 * GDP & growth, real vs nominal, unemployment, the business cycle, PMI as a leading indicator; "decode the headline";
 * trap: "GDP up = everyone richer".
 * ⚠️ Draft written with AI help — team review. Verify (GSO): Vietnam GDP growth 2019 7.02%, 2020 2.91%, 2021 2.58%,
 * 2022 8.02%, 2023 5.05%, 2024 7.09%. Headlines in the exercises are invented examples, not real news. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "m-news",
  domain: "macro",
  icon: "📰",
  ic: "doc",
  minutes: 6,
  title: { vi: "Đọc một bản tin kinh tế trong 60 giây", en: "Read an economic news story in 60 seconds" },
  desc: {
    vi: "GDP, tăng trưởng thực và danh nghĩa, thất nghiệp, chu kỳ kinh tế, chỉ số PMI — giải mã một tít báo: nghĩa là gì, ai được, ai mất.",
    en: "GDP, real vs nominal growth, unemployment, the business cycle, PMI — decode a headline: what it means, who wins, who loses.",
  },
  prereq: { vi: "lạm phát và CPI (bài M1).", en: "inflation and CPI (lesson M1)." },
  review: {
    title: { vi: "Đọc tin kinh tế", en: "Reading economic news" },
    points: [
      { vi: "<b>GDP</b> = giá trị hàng hóa, dịch vụ cuối cùng làm ra trong nước trong một thời kỳ.", en: "<b>GDP</b> = the value of final goods and services produced in a country over a period." },
      { vi: "Tăng trưởng <b>thực</b> ≈ tăng trưởng danh nghĩa − lạm phát.", en: "<b>Real</b> growth ≈ nominal growth − inflation." },
      { vi: "PMI &gt; 50: nhà máy mở rộng; &lt; 50: thu hẹp (chỉ báo đi trước).", en: "PMI &gt; 50: factories expanding; &lt; 50: shrinking (a leading indicator)." },
      { vi: "GDP tăng ≠ ai cũng giàu hơn.", en: "GDP up ≠ everyone richer." },
    ],
  },
  info: {
    s: { vi: "GDP đo sản lượng cả nền kinh tế; tăng trưởng thực = danh nghĩa − lạm phát; PMI dưới 50 báo hiệu nhà máy thu hẹp.", en: "GDP measures a whole economy's output; real growth = nominal − inflation; a PMI under 50 signals factories shrinking." },
    l: {
      vi: "GDP (tổng sản phẩm trong nước) là giá trị mọi hàng hóa, dịch vụ cuối cùng được làm ra trong nước trong một quý hay một năm. Tin tức thường nói tăng trưởng GDP thực — đã trừ phần tăng giá. Nền kinh tế đi theo chu kỳ: mở rộng, đỉnh, suy giảm, đáy, phục hồi. Tỷ lệ thất nghiệp thường đi sau chu kỳ; chỉ số nhà quản trị mua hàng PMI đi trước — trên 50 là sản xuất mở rộng, dưới 50 là thu hẹp. GDP tăng không có nghĩa ai cũng giàu hơn: còn phải xem dân số, lạm phát và ai nhận được phần tăng thêm.",
      en: "GDP (gross domestic product) is the value of all final goods and services produced in the country in a quarter or a year. News usually quotes real GDP growth — with price rises taken out. The economy moves in cycles: expansion, peak, contraction, trough, recovery. Unemployment usually lags the cycle; the purchasing managers' index PMI leads it — above 50 means manufacturing is expanding, below 50 shrinking. GDP growth doesn't mean everyone gets richer: look at population, inflation and who gets the extra.",
    },
  },
  kb: ["inflation", "stocks"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "newspaper business section" }, art: "📰 GDP +7,4% · PMI 47 · CPI 2,8%", fs: 20, cap: { vi: "Một tít báo — ba con số — bạn hiểu mấy?", en: "One headline — three numbers — how many do you get?" },
      title: { vi: "Đọc một bản tin kinh tế trong 60 giây", en: "Read an economic news story in 60 seconds" },
      text: {
        vi: "“GDP quý III tăng 7,4%, nhưng PMI tháng 9 giảm xuống 47; lạm phát lõi 2,8%.” Người lớn đọc tin này mỗi sáng và quyết định gửi tiền, vay tiền, tuyển người… Sau 6 phút, bạn sẽ đọc được nó trong 60 giây — và biết nó ảnh hưởng gì tới chính mình. <i>(Tít báo trong bài là ví dụ, không phải tin thật.)</i>",
        en: "“Q3 GDP up 7.4%, but September PMI falls to 47; core inflation 2.8%.” Adults read news like this every morning and decide whether to save, borrow, hire… In 6 minutes you'll read it in 60 seconds — and know how it affects you. <i>(Headlines in this lesson are examples, not real news.)</i>",
      },
      lion: { vi: "Bí quyết: mỗi con số trả lời một câu hỏi — làm ra bao nhiêu? giá ra sao? sắp tới thế nào? 🔎", en: "Secret: each number answers a question — how much was made? what about prices? what's coming next? 🔎" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: năm 2022 GDP Việt Nam tăng 8,02% — cao nhất nhiều năm. Năm 2023 tăng bao nhiêu?", en: "Guess: in 2022 Vietnam's GDP grew 8.02% — the fastest in years. How much in 2023?" },
      art: "📈 2022: 8,02% → 2023: ?", min: 0, max: 12, step: 0.1, start: 8, actual: 5.05, unit: "pct",
      reveal: { vi: "<b>5,05%</b> — chậm lại rõ. 2022 cao một phần vì so với 2021 thấp do COVID; 2023 xuất khẩu giảm vì thế giới mua ít đi, lãi suất cao. Một con số tăng trưởng luôn cần hỏi: “so với cái gì?”", en: "<b>5.05%</b> — a clear slowdown. 2022 was high partly because 2021 was low (COVID); in 2023 exports fell as the world bought less and rates were high. Always ask of a growth number: “compared with what?”" },
    },
    /* 3 · Mechanism */
    {
      t: "match", q: { vi: "Nối con số trên báo với câu hỏi nó trả lời", en: "Match each news number with the question it answers" },
      pairs: [
        [{ vi: "📈 Tăng trưởng GDP", en: "📈 GDP growth" }, { vi: "Cả nước làm ra nhiều hơn bao nhiêu?", en: "How much more did the country produce?" }],
        [{ vi: "🛒 CPI / lạm phát", en: "🛒 CPI / inflation" }, { vi: "Giá cả tăng bao nhiêu?", en: "How much did prices rise?" }],
        [{ vi: "👷 Tỷ lệ thất nghiệp", en: "👷 Unemployment rate" }, { vi: "Bao nhiêu người muốn làm mà không có việc?", en: "How many who want work can't find it?" }],
        [{ vi: "🏭 PMI", en: "🏭 PMI" }, { vi: "Nhà máy đang mở rộng hay thu hẹp?", en: "Are factories expanding or shrinking?" }],
        [{ vi: "🎛️ Lãi suất điều hành", en: "🎛️ Policy rate" }, { vi: "NHTW đang hãm hay bơm?", en: "Is the central bank braking or pumping?" }],
      ],
      why: { vi: "Năm con số này là 'bảng đồng hồ' của nền kinh tế. Đọc chúng cùng nhau mới thấy bức tranh.", en: "These five numbers are the economy's dashboard. Read them together to see the picture." },
    },
    {
      t: "order", q: { vi: "Sắp xếp các giai đoạn của một chu kỳ kinh tế (bắt đầu từ lúc kinh tế đang lớn lên)", en: "Put the phases of a business cycle in order (starting while the economy is growing)" },
      items: [
        ["📈", { vi: "Mở rộng: việc làm, thu nhập, chi tiêu tăng", en: "Expansion: jobs, incomes and spending rise" }],
        ["⛰️", { vi: "Đỉnh: kinh tế 'nóng', giá cả tăng nhanh", en: "Peak: the economy 'overheats', prices rise fast" }],
        ["📉", { vi: "Suy giảm: doanh nghiệp cắt giảm, thất nghiệp tăng", en: "Contraction: firms cut back, unemployment rises" }],
        ["🕳️", { vi: "Đáy: tệ nhất đã qua", en: "Trough: the worst is over" }],
        ["🌱", { vi: "Phục hồi: sản xuất, tuyển dụng trở lại", en: "Recovery: production and hiring come back" }],
      ],
      why: { vi: "NHTW và chính phủ cố làm chu kỳ 'phẳng' hơn: hãm lúc quá nóng, đỡ lúc suy giảm (bài M2, M4).", en: "Central banks and governments try to flatten the cycle: brake when too hot, support in a downturn (lessons M2, M4)." },
    },
    {
      t: "mcq", q: { vi: "Giải mã tít báo: “PMI tháng 9 giảm xuống 47”. Nghĩa là gì?", en: "Decode the headline: “September PMI falls to 47”. What does it mean?" },
      o: [
        { vi: "Các nhà máy thu hẹp sản xuất so với tháng trước — dấu hiệu kinh tế có thể chậm lại", en: "Factories cut output compared with last month — a sign the economy may slow" },
        { vi: "47% người lao động bị thất nghiệp", en: "47% of workers are unemployed" },
        { vi: "Giá cả tăng 47%", en: "Prices rose 47%" },
        { vi: "Chứng khoán tăng 47 điểm", en: "Stocks rose 47 points" },
      ],
      a: 0,
      why: { vi: "PMI hỏi các nhà quản lý mua hàng xem đơn hàng, sản xuất, tuyển dụng tăng hay giảm. Mốc 50 là ranh giới: dưới 50 là thu hẹp. Vì đơn hàng đến trước sản lượng, PMI là chỉ báo đi trước.", en: "PMI asks purchasing managers whether orders, output and hiring are up or down. 50 is the line: below 50 means shrinking. Because orders come before output, PMI is a leading indicator." },
      hint: { vi: "Nhớ mốc 50.", en: "Remember the 50 line." },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Tăng trưởng GDP Việt Nam 2019–2024. Vì sao 2020–2021 thấp nhất?", en: "Vietnam's GDP growth 2019–2024. Why were 2020–2021 the lowest?" },
      chart: {
        kind: "bar",
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        series: [{ name: { vi: "Tăng trưởng GDP (%)", en: "GDP growth (%)" }, color: "#8B6CF0", data: [7.02, 2.91, 2.58, 8.02, 5.05, 7.09] }],
        y: "%",
        source: { vi: "Tổng cục Thống kê", en: "General Statistics Office of Vietnam" },
      },
      o: [{ vi: "Đại dịch COVID-19: giãn cách, nhà máy và cửa hàng đóng", en: "The COVID-19 pandemic: lockdowns, factories and shops closed" }, { vi: "Lạm phát 23%", en: "23% inflation" }, { vi: "Khủng hoảng 1997", en: "The 1997 crisis" }, { vi: "Vì dân số giảm một nửa", en: "Because the population halved" }],
      a: 0,
      why: { vi: "Đặc biệt quý III/2021 giãn cách kéo dài ở phía Nam. Nhưng Việt Nam vẫn tăng trưởng dương trong khi nhiều nước suy giảm. 2022 bật lại 8,02% (so với nền thấp), 2023 chậm lại 5,05%, 2024 khoảng 7,09%.", en: "Especially the long lockdowns in the south in Q3 2021. Yet Vietnam still grew while many countries shrank. 2022 bounced to 8.02% (from a low base), 2023 slowed to 5.05%, 2024 about 7.09%." },
      hint: { vi: "Nhớ lại năm bạn học online ở nhà.", en: "Remember the year you studied online at home." },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "“GDP năm nay tăng 7% — vậy là ai cũng giàu hơn 7%.” Sai ở đâu?", en: "“GDP grew 7% this year — so everyone is 7% richer.” What's wrong?" },
      o: [
        { vi: "Phải trừ tăng dân số, xem có phải số thực chưa, và phần tăng thêm chia cho ai — có người được nhiều, có người không được gì", en: "You must subtract population growth, check it's real, and see who gets the extra — some gain a lot, some nothing" },
        { vi: "Không sai — GDP chia đều cho mọi người", en: "Nothing — GDP is shared equally" },
        { vi: "Sai vì GDP chỉ tính hàng xuất khẩu", en: "Wrong because GDP only counts exports" },
        { vi: "Sai vì GDP tăng thì ai cũng nghèo đi", en: "Wrong because GDP growth makes everyone poorer" },
      ],
      a: 0,
      why: { vi: "GDP là tổng của cả nước. Chia cho dân số mới ra bình quân đầu người; và bình quân vẫn che giấu chuyện phần tăng thêm chảy về đâu (ngành nào, vùng nào, ai).", en: "GDP is the national total. Divide by population for per person; and even the average hides where the extra goes (which sectors, regions, people)." },
      hint: { vi: "Một lớp có 1 bạn được tăng 70k tiền tiêu vặt, 9 bạn không — 'trung bình' tăng 7k.", en: "One kid gets 70k more pocket money and nine get nothing — the 'average' rose 7k." },
    },
    {
      t: "calc", q: { vi: "Một năm: GDP danh nghĩa tăng 12%, lạm phát (chỉ số giảm phát GDP) 4%, dân số tăng 1%.", en: "One year: nominal GDP +12%, inflation (GDP deflator) 4%, population +1%." },
      parts: [
        { label: { vi: "Tăng trưởng GDP thực xấp xỉ (%)", en: "Approximate real GDP growth (%)" }, a: 8, tol: 0.05, unit: "%" },
        { label: { vi: "GDP thực bình quân đầu người tăng xấp xỉ (%)", en: "Approximate real GDP per person growth (%)" }, a: 7, tol: 0.05, unit: "%" },
      ],
      why: { vi: "12 − 4 = 8% thực. 8 − 1 = 7% mỗi người (bình quân). Báo thường đưa con số thực; khi thấy số lớn bất thường, hỏi: thực hay danh nghĩa?", en: "12 − 4 = 8% real. 8 − 1 = 7% per person (average). News usually gives the real number; if a number looks oddly big, ask: real or nominal?" },
      hint: { vi: "Thực ≈ danh nghĩa − lạm phát; đầu người ≈ thực − dân số.", en: "Real ≈ nominal − inflation; per person ≈ real − population." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: tóm tắt cho bạn mình trong 1–2 câu: “Tăng trưởng GDP chậm lại còn 5%, thất nghiệp thanh niên tăng” nghĩa là gì và ảnh hưởng gì tới tụi mình?", en: "Final boss: sum up for a friend in 1–2 sentences: “GDP growth slows to 5%, youth unemployment rises” — what does it mean and how does it affect us?" },
      keys: [
        { label: { vi: "Kinh tế tăng chậm hơn", en: "The economy grows more slowly" }, words: { vi: ["chậm", "tăng chậm", "chậm lại", "làm ra ít", "sản xuất ít"], en: ["slow", "slower", "slowing", "less output"] } },
        { label: { vi: "Khó tìm việc / làm thêm", en: "Harder to find jobs" }, words: { vi: ["việc làm", "tìm việc", "khó", "thất nghiệp", "làm thêm", "tuyển"], en: ["jobs", "job", "hard", "unemployment", "part-time", "hiring"] } },
        { label: { vi: "Thu nhập / chi tiêu / để dành", en: "Income / spending / saving" }, words: { vi: ["thu nhập", "lương", "chi tiêu", "tiết kiệm", "để dành", "quỹ"], en: ["income", "pay", "spending", "save", "savings", "fund"] } },
      ],
      need: 2,
      model: { vi: "Nghĩa là nền kinh tế lớn chậm lại và doanh nghiệp tuyển ít người trẻ hơn, nên tìm việc làm thêm sẽ khó hơn; tụi mình nên chi tiêu cẩn thận và để dành một chút.", en: "It means the economy is growing more slowly and firms are hiring fewer young people, so part-time jobs will be harder to find; we should spend carefully and save a bit." },
      why: { vi: "Ý chính: biến con số thành câu chuyện — điều gì đang xảy ra, và nó chạm tới mình ra sao.", en: "Key idea: turn numbers into a story — what's happening, and how it reaches you." },
      hint: { vi: "Hai ý: chuyện gì đang xảy ra? mình nên làm gì?", en: "Two parts: what's happening? what should we do?" },
    },
    {
      t: "learn", art: "📰 → 🔎 → 🧠",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Mẹo đọc tin 60 giây — hỏi 4 câu:", en: "The 60-second news trick — ask 4 questions:" },
      items: [
        ["🔢", { vi: "Con số này đo cái gì (sản lượng, giá, việc làm, kỳ vọng)?", en: "What does this number measure (output, prices, jobs, expectations)?" }],
        ["⚖️", { vi: "So với cái gì — tháng trước, cùng kỳ năm trước, mục tiêu?", en: "Compared with what — last month, a year ago, a target?" }],
        ["👥", { vi: "Ai được, ai mất?", en: "Who wins, who loses?" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Tòa tin tức trong thị trấn — tin kinh tế sẽ ảnh hưởng tới thị trường trong game!", en: "🎮 Unlocked in the game: the News tower in town — economic news will move the in-game market!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "📊 ≠ 😊", fs: 30,
      title: { vi: "GDP đo được gì — và không đo được gì", en: "What GDP measures — and what it doesn't" },
      text: {
        vi: "GDP không tính việc nhà không lương, không trừ ô nhiễm hay tài nguyên bị khai thác, không nói gì về phân phối thu nhập hay sức khỏe tinh thần. Vì vậy nhiều nước và tổ chức xem thêm GDP bình quân đầu người theo sức mua (PPP), Chỉ số phát triển con người (HDI), hệ số bất bình đẳng Gini… Kinh tế học không chỉ là một con số.",
        en: "GDP ignores unpaid housework, doesn't subtract pollution or depleted resources, and says nothing about income distribution or wellbeing. So countries and organisations also look at GDP per person at purchasing-power parity (PPP), the Human Development Index (HDI), the Gini inequality coefficient… Economics isn't one number.",
      },
    },
    {
      t: "mcq", q: { vi: "Chỉ báo nào thường ĐI SAU chu kỳ kinh tế (thay đổi muộn nhất)?", en: "Which indicator usually LAGS the business cycle (changes last)?" },
      o: [
        { vi: "Tỷ lệ thất nghiệp", en: "The unemployment rate" },
        { vi: "Chỉ số PMI (đơn hàng mới)", en: "The PMI (new orders)" },
        { vi: "Giá cổ phiếu", en: "Share prices" },
        { vi: "Số giấy phép xây dựng mới", en: "New building permits" },
      ],
      a: 0,
      why: { vi: "Doanh nghiệp thường cắt giờ làm, ngừng tuyển trước, sa thải sau cùng; và khi phục hồi cũng tuyển lại chậm. PMI, giá cổ phiếu, giấy phép xây dựng là chỉ báo đi trước.", en: "Firms cut hours and stop hiring first and lay off last; when recovering they also rehire slowly. PMI, share prices and building permits lead." },
    },
    {
      t: "calc", q: { vi: "Chỉ số giảm phát GDP: GDP danh nghĩa 10.000 nghìn tỷ, GDP thực (giá năm gốc) 8.000 nghìn tỷ.", en: "GDP deflator: nominal GDP 10,000 trillion, real GDP (base-year prices) 8,000 trillion." },
      parts: [
        { label: { vi: "Chỉ số giảm phát = danh nghĩa ÷ thực × 100", en: "Deflator = nominal ÷ real × 100" }, a: 125, tol: 0.05, unit: "" },
        { label: { vi: "Giá cả đã tăng bao nhiêu % so với năm gốc?", en: "How much have prices risen since the base year (%)?" }, a: 25, tol: 0.05, unit: "%" },
      ],
      why: { vi: "10.000 ÷ 8.000 × 100 = 125 → giá cao hơn năm gốc 25%.", en: "10,000 ÷ 8,000 × 100 = 125 → prices are 25% above the base year." },
    },
  ],
};
export default lesson;
