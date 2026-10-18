/* International finance · X2 — "1997: when Asia crashed in a few months" (13.2d ⑥, frame 13.2c)
 * Hot money, fixed exchange rates, the balance of payments and the IMF — the learner is Thailand's central bank
 * in mid-1997, BEFORE knowing the outcome: hold the peg or float?
 * Trap: "the more foreign money flows in, the better".
 * ⚠️ Draft written with AI help — team review. Verify (rounded, widely cited): baht ≈ 25/USD before 2/7/1997, ≈ 50–56 at the
 * worst (Jan 1998); IMF-led packages ≈ 17 bn USD (Thailand), ≈ 40 bn (Indonesia), ≈ 57 bn (Korea); peak-to-trough currency
 * falls vs USD in the chart (Indonesia ≈ 80%, Thailand ≈ 55%, Korea ≈ 50%, Malaysia ≈ 45%); Korea's 1998 gold drive. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "x-1997",
  domain: "intl",
  icon: "🌏",
  ic: "globe",
  minutes: 7,
  title: { vi: "1997: khi cả châu Á sụp đổ trong vài tháng", en: "1997: when Asia crashed in a few months" },
  desc: {
    vi: "Vốn nóng, tỷ giá cố định và nợ bằng đô la: vì sao Thái Lan, Indonesia, Hàn Quốc gục ngã gần như cùng lúc — và IMF đã làm gì.",
    en: "Hot money, fixed exchange rates and dollar debt: why Thailand, Indonesia and Korea fell almost at once — and what the IMF did.",
  },
  prereq: { vi: "tỷ giá (bài X1) và ngân hàng trung ương (bài M2).", en: "exchange rates (X1) and central banks (M2)." },
  review: {
    title: { vi: "Khủng hoảng 1997", en: "The 1997 crisis" },
    points: [
      { vi: "<b>Vốn nóng</b>: tiền ngắn hạn vào nhanh, rút còn nhanh hơn.", en: "<b>Hot money</b>: short-term money comes in fast and leaves faster." },
      { vi: "Giữ tỷ giá cố định cần <b>dự trữ ngoại hối</b> — dự trữ cạn thì phải thả.", en: "Holding a fixed rate needs <b>foreign reserves</b> — when they run out, you must float." },
      { vi: "Vay bằng USD, thu bằng tiền nội: đồng tiền mất giá một nửa → nợ <b>gấp đôi</b>.", en: "Borrow in dollars, earn in local money: the currency halves → the debt <b>doubles</b>." },
      { vi: "Không phải vốn ngoại nào cũng như nhau: nhà máy (FDI) ở lại, vốn nóng bỏ chạy.", en: "Not all foreign money is equal: factories (FDI) stay, hot money runs." },
    ],
  },
  info: {
    s: { vi: "Năm 1997, vốn ngắn hạn rút khỏi Thái Lan, đồng baht phải thả nổi và mất giá một nửa; khủng hoảng lan sang Indonesia, Hàn Quốc, Malaysia.", en: "In 1997 short-term money fled Thailand, the baht was floated and lost half its value; the crisis spread to Indonesia, Korea and Malaysia." },
    l: {
      vi: "Đầu thập niên 1990, các nền kinh tế Đông Á tăng trưởng nhanh và hút rất nhiều vốn ngoại. Thái Lan giữ đồng baht gần như cố định khoảng 25 baht/USD, lãi suất trong nước cao hơn ở Mỹ, nên ngân hàng và công ty vay USD ngắn hạn giá rẻ rồi cho vay, đầu tư bằng baht — nhiều vào bất động sản. Khi xuất khẩu chậm lại và bong bóng nhà đất xì hơi, nhà đầu tư lo ngại, rút tiền và bán baht. Ngân hàng trung ương bán dự trữ USD để giữ tỷ giá cho đến khi gần cạn, rồi ngày 2/7/1997 phải thả nổi. Baht mất giá khoảng một nửa; các khoản nợ USD tính ra baht tăng gấp đôi, hàng loạt công ty và tổ chức tài chính đổ vỡ. Nhà đầu tư rút khỏi cả khu vực: Indonesia, Hàn Quốc, Malaysia, Philippines bị cuốn theo. IMF cho vay các gói cứu trợ lớn kèm điều kiện thắt chặt — đến nay vẫn còn tranh luận các điều kiện đó đúng hay quá khắt khe. Việt Nam khi đó ít mở cửa cho vốn ngắn hạn nên bị ảnh hưởng nhẹ hơn, chủ yếu qua xuất khẩu và FDI chậm lại.",
      en: "In the early 1990s East Asian economies grew fast and attracted lots of foreign money. Thailand kept the baht almost fixed at about 25 per dollar while its interest rates were higher than America's, so banks and firms borrowed cheap short-term dollars and lent or invested in baht — much of it in property. When exports slowed and the property bubble deflated, investors got nervous, pulled money out and sold baht. The central bank sold dollar reserves to hold the rate until they were nearly gone, then on 2 July 1997 had to float. The baht lost about half its value; dollar debts doubled in baht, and many firms and lenders failed. Investors fled the whole region: Indonesia, Korea, Malaysia and the Philippines were swept along. The IMF lent big rescue packages with tough conditions — still debated today as right or too harsh. Vietnam was less open to short-term money then, so it was hit more mildly, mainly through slower exports and FDI.",
    },
  },
  kb: ["fx", "fixedfloat"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Bangkok 1997 financial crisis" }, art: "🇹🇭 25 ฿ → 50 ฿ = 1 USD", cap: { vi: "Một đồng tiền mất nửa giá trị", en: "A currency loses half its value" },
      title: { vi: "1997: khi cả châu Á sụp đổ trong vài tháng", en: "1997: when Asia crashed in a few months" },
      text: {
        vi: "Bangkok, giữa năm 1997. Mười năm qua kinh tế tăng trưởng thần kỳ, tòa nhà mọc lên khắp nơi, tiền nước ngoài đổ vào ào ạt. Rồi chỉ trong vài tháng: đồng baht mất giá một nửa, hàng chục công ty tài chính đóng cửa, nhiều tòa nhà bỏ dở. Cơn bão lan sang Indonesia, Hàn Quốc… Trong bài này, <b>bạn</b> sẽ ngồi vào ghế ngân hàng trung ương Thái Lan — trước khi biết chuyện gì xảy ra.",
        en: "Bangkok, mid-1997. A decade of miracle growth, towers everywhere, foreign money pouring in. Then in a few months: the baht lost half its value, dozens of finance companies shut, many towers were left half-built. The storm spread to Indonesia, Korea… In this lesson <b>you</b> sit in Thailand's central bank — before knowing what happens.",
      },
      lion: { vi: "Tiền vào dễ thì cũng ra dễ — nhớ câu này nhé 🌪️", en: "Money that comes in easily leaves easily — remember that 🌪️" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: một công ty Thái vay 1 triệu USD khi 1 USD = 25 baht (tức 25 triệu baht). Sau khi thả nổi, 1 USD = 50 baht. Món nợ giờ là bao nhiêu triệu baht?", en: "Guess: a Thai firm borrowed $1 million when $1 = 25 baht (25 million baht). After the float, $1 = 50 baht. How many million baht is the debt now?" },
      art: "🏢 1.000.000 USD", min: 0, max: 100, step: 5, start: 25, actual: 50, unit: "num",
      reveal: { vi: "<b>50 triệu baht</b> — gấp đôi, dù công ty không vay thêm đồng nào. Doanh thu vẫn bằng baht, không tăng. Hàng nghìn công ty rơi vào cảnh này cùng lúc.", en: "<b>50 million baht</b> — double, though the firm borrowed nothing more. Its revenue is still in baht and didn't grow. Thousands of firms hit this at once." },
    },
    /* 3 · Mechanism */
    {
      t: "order", q: { vi: "Xếp vòng xoáy 1997 theo đúng thứ tự:", en: "Put the 1997 spiral in order:" },
      items: [
        ["💸", { vi: "Tỷ giá cố định + lãi suất cao → vốn ngắn hạn đổ vào", en: "Fixed rate + high interest → short-term money pours in" }],
        ["🏗️", { vi: "Vay USD ngắn hạn, cho vay bất động sản bằng baht", en: "Short-term dollar loans, lent out in baht for property" }],
        ["😨", { vi: "Xuất khẩu chậm, nhà đất xì hơi → nhà đầu tư rút tiền, bán baht", en: "Exports slow, property deflates → investors pull out, sell baht" }],
        ["🏦", { vi: "Ngân hàng trung ương bán dự trữ USD để giữ tỷ giá — dự trữ cạn dần", en: "The central bank sells dollar reserves to hold the rate — reserves drain" }],
        ["📉", { vi: "Thả nổi: baht mất giá một nửa", en: "The float: the baht halves" }],
        ["💥", { vi: "Nợ USD tăng gấp đôi → công ty, ngân hàng đổ vỡ; khủng hoảng lan ra khu vực", en: "Dollar debts double → firms and banks fail; the crisis spreads" }],
      ],
      why: { vi: "Mỗi bước đẩy bước sau: tiền vào vì tin tỷ giá không đổi → nợ USD chồng chất → khi niềm tin mất, chính khoản nợ đó làm cú mất giá thành thảm họa.", en: "Each step drives the next: money came in trusting the fixed rate → dollar debt piled up → when trust broke, that same debt turned the fall into a disaster." },
      hint: { vi: "Bắt đầu từ lúc tiền đổ vào, kết thúc ở chỗ đổ vỡ.", en: "Start with money flowing in, end with the collapse." },
    },
    /* 4 · You decide (before the outcome) */
    {
      t: "mcq", q: { vi: "Tháng 6/1997, bạn là Thống đốc. Mỗi ngày có người bán baht, dự trữ USD chỉ còn ít, phần lớn đã hứa bán trước. Bạn chọn gì?", en: "June 1997, you're the Governor. People sell baht every day; dollar reserves are low, most already promised in forward deals. What do you do?" },
      o: [
        { vi: "Thả nổi tỷ giá ngay, xin hỗ trợ IMF, xử lý các tổ chức tài chính yếu", en: "Float now, ask the IMF for help, deal with weak lenders" },
        { vi: "Bán nốt dự trữ để giữ 25 baht/USD bằng mọi giá", en: "Sell the last reserves to hold 25 baht per dollar at any cost" },
        { vi: "In thêm thật nhiều baht để trả nợ USD", en: "Print lots of baht to repay dollar debts" },
        { vi: "Tuyên bố mọi thứ ổn và chờ thị trường bình tĩnh lại", en: "Declare all is fine and wait for markets to calm" },
      ],
      a: 0,
      why: { vi: "Không có lựa chọn nào không đau. Thực tế Thái Lan đã cố giữ tỷ giá và gần như tiêu hết dự trữ, rồi vẫn phải thả nổi ngày 2/7/1997 — lúc đó trong tay không còn gì để đỡ. Thả sớm hơn mất ít dự trữ hơn. In tiền không tạo ra USD (nợ là USD!) mà còn làm baht mất giá thêm; chờ đợi chỉ cho người bán thêm thời gian.", en: "No choice was painless. In reality Thailand tried to hold the rate, spent almost all its reserves, and still had to float on 2 July 1997 — with nothing left to cushion the fall. Floating earlier would have cost fewer reserves. Printing money doesn't create dollars (the debt is in dollars!) and weakens the baht further; waiting just gives sellers more time." },
      hint: { vi: "Dự trữ là hữu hạn. Giữ tỷ giá đến khi hết dự trữ thì sao?", en: "Reserves are finite. What happens if you hold until they run out?" },
    },
    /* 5 · The real story */
    {
      t: "chart", q: { vi: "Đồng tiền mất giá bao nhiêu so với USD (từ giữa 1997 đến đáy 1998, khoảng)? Nước nào chịu nặng nhất?", en: "How much did each currency lose against the dollar (mid-1997 to the 1998 low, approx.)? Which was hit hardest?" },
      chart: {
        kind: "bar",
        labels: [{ vi: "Indonesia", en: "Indonesia" }, { vi: "Thái Lan", en: "Thailand" }, { vi: "Hàn Quốc", en: "Korea" }, { vi: "Malaysia", en: "Malaysia" }],
        series: [{ name: { vi: "% mất giá so với USD", en: "% lost vs USD" }, color: "#E4766A", data: [80, 55, 50, 45] }],
        y: { vi: "%", en: "%" },
        source: { vi: "Số làm tròn từ tỷ giá thị trường — cần kiểm chứng (IMF, ngân hàng trung ương các nước)", en: "Rounded from market rates — to be verified (IMF, national central banks)" },
      },
      o: [
        { vi: "Indonesia — đồng rupiah mất khoảng 80%, kéo theo khủng hoảng chính trị", en: "Indonesia — the rupiah lost about 80%, followed by a political crisis" },
        { vi: "Thái Lan — vì là nơi bắt đầu", en: "Thailand — because it started there" },
        { vi: "Hàn Quốc — vì là nền kinh tế lớn nhất", en: "Korea — because it was the biggest economy" },
        { vi: "Các nước mất giá như nhau", en: "They all fell the same" },
      ],
      a: 0,
      why: { vi: "Nơi bắt đầu chưa chắc là nơi đau nhất. Indonesia có rất nhiều nợ USD ngắn hạn của doanh nghiệp, ngân hàng yếu, và niềm tin sụp cùng lúc với chính trị. Hàn Quốc nhận gói cứu trợ lớn nhất (khoảng 57 tỷ USD); người dân Hàn còn quyên góp vàng trong nhà để giúp đất nước trả nợ.", en: "Where it starts isn't always where it hurts most. Indonesia had huge short-term corporate dollar debt, weak banks, and trust collapsed together with politics. Korea got the biggest rescue (about $57 bn); Koreans even donated household gold to help repay the debt." },
      hint: { vi: "Nhìn cột cao nhất.", en: "Look at the tallest bar." },
    },
    {
      t: "sort", q: { vi: "Dòng vốn nào ở lại khi có bão, dòng nào dễ bỏ chạy?", en: "Which money stays in a storm, which runs?" },
      buckets: [["🌳", { vi: "Dài hạn, khó rút", en: "Long-term, hard to pull" }], ["🌪️", { vi: "Vốn nóng, rút trong ngày", en: "Hot money, gone in a day" }]],
      items: [
        ["🏭", { vi: "Tập đoàn nước ngoài xây nhà máy (FDI)", en: "A foreign group builds a factory (FDI)" }, 0],
        ["💵", { vi: "Ngân hàng vay USD kỳ hạn 3 tháng từ nước ngoài", en: "A bank borrows dollars abroad for 3 months" }, 1],
        ["📈", { vi: "Quỹ nước ngoài mua cổ phiếu trên sàn", en: "A foreign fund buys listed shares" }, 1],
        ["🌉", { vi: "Khoản vay 20 năm để xây cầu (ODA)", en: "A 20-year loan to build a bridge (ODA)" }, 0],
        ["🏦", { vi: "Nhà đầu tư nước ngoài gửi tiền ngắn hạn để hưởng lãi cao", en: "A foreign investor parks money short-term for high interest" }, 1],
      ],
      why: { vi: "Nhà máy không thể khiêng đi trong một đêm; khoản vay 20 năm không bị đòi ngay. Nhưng tiền gửi ngắn hạn, cổ phiếu, khoản vay 3 tháng có thể rút chỉ bằng một cú bấm.", en: "A factory can't be carried off overnight; a 20-year loan isn't called tomorrow. But short deposits, shares and 3-month loans can leave with a click." },
      hint: { vi: "Rút ra có mất nhiều thời gian không?", en: "How long would it take to pull out?" },
    },
    /* 6 · Trap */
    {
      t: "mcq", q: { vi: "Một bài báo: “Vốn ngoại đổ vào càng nhiều càng tốt cho kinh tế.” Ý nào ĐÚNG nhất?", en: "An article: “The more foreign money flows in, the better for the economy.” Which is MOST right?" },
      o: [
        { vi: "Còn tùy loại vốn: vốn dài hạn (nhà máy) giúp tăng trưởng; vốn nóng và nợ USD ngắn hạn có thể bỏ chạy và gây khủng hoảng", en: "It depends on the kind: long-term money (factories) builds growth; hot money and short dollar debt can flee and cause a crisis" },
        { vi: "Đúng — càng nhiều tiền càng giàu", en: "True — more money, more wealth" },
        { vi: "Sai — mọi vốn ngoại đều có hại, nên đóng cửa hoàn toàn", en: "False — all foreign money is harmful; close the doors" },
        { vi: "Chỉ cần tỷ giá cố định là vốn ngoại luôn an toàn", en: "As long as the rate is fixed, foreign money is always safe" },
      ],
      a: 0,
      why: { vi: "Bẫy 'càng nhiều càng tốt'. Thái Lan 1997 có rất nhiều vốn ngoại — chính vốn ngắn hạn đó bỏ chạy. Đóng cửa hoàn toàn cũng mất vốn tốt (FDI giúp Việt Nam tăng trưởng nhiều năm). Và tỷ giá cố định còn khiến người ta yên tâm vay USD, làm rủi ro lớn hơn.", en: "The 'more is better' trap. Thailand in 1997 had plenty of foreign money — that short-term money is what fled. Closing the doors loses the good kind too (FDI powered Vietnam's growth for years). And a fixed rate made people comfortable borrowing dollars, which raised the risk." },
      hint: { vi: "Nhớ bài phân loại vừa rồi.", en: "Remember the sorting step." },
    },
    /* 7 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: bạn là Thống đốc một nước đang hút rất nhiều vốn ngắn hạn, giống Thái Lan năm 1995. Nêu 2 việc bạn làm để tránh một năm 1997.", en: "Final boss: you govern a country attracting lots of short-term money, like Thailand in 1995. Name 2 things you'd do to avoid a 1997." },
      keys: [
        { label: { vi: "Tỷ giá linh hoạt hơn", en: "A more flexible rate" }, words: { vi: ["linh hoạt", "thả nổi", "biên độ", "không cố định", "nới"], en: ["flexible", "float", "band", "not fixed", "let it move"] } },
        { label: { vi: "Tích dự trữ ngoại hối", en: "Build foreign reserves" }, words: { vi: ["dự trữ", "tích lũy usd", "ngoại hối"], en: ["reserve", "reserves", "foreign exchange"] } },
        { label: { vi: "Hạn chế nợ USD ngắn hạn / vốn nóng", en: "Limit short dollar debt / hot money" }, words: { vi: ["hạn chế", "nợ ngắn hạn", "vốn nóng", "kiểm soát vốn", "vay usd", "giới hạn"], en: ["limit", "short-term debt", "hot money", "capital control", "dollar loan", "cap"] } },
        { label: { vi: "Giám sát ngân hàng, bất động sản", en: "Supervise banks and property lending" }, words: { vi: ["giám sát", "ngân hàng", "bất động sản", "cho vay", "bong bóng"], en: ["supervis", "bank", "property", "real estate", "lending", "bubble"] } },
      ],
      need: 2,
      model: { vi: "Cho tỷ giá linh hoạt hơn để người vay không ỷ vào tỷ giá cố định, hạn chế các khoản vay USD ngắn hạn, và tích dự trữ ngoại hối khi tiền đang vào — để có 'đệm' khi tiền rút ra.", en: "Let the rate be more flexible so borrowers don't lean on a fixed rate, limit short-term dollar borrowing, and build reserves while money is flowing in — a cushion for when it flows out." },
      why: { vi: "Sau 1997, nhiều nước châu Á làm đúng như vậy: tỷ giá linh hoạt hơn, dự trữ ngoại hối lớn hơn nhiều, giám sát ngân hàng chặt hơn.", en: "After 1997 many Asian countries did exactly that: more flexible rates, much bigger reserves, tighter bank supervision." },
      hint: { vi: "Nghĩ về 3 thứ làm Thái Lan gục: tỷ giá cố định, nợ USD ngắn hạn, dự trữ cạn.", en: "Think of the three things that sank Thailand: a fixed rate, short dollar debt, empty reserves." },
    },
    {
      t: "learn", art: "🌏 🔎 🧠",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Bài học 1997 cho chính bạn:", en: "The 1997 lesson for you:" },
      items: [
        ["💳", { vi: "Đừng vay bằng một đồng tiền mà bạn không kiếm ra — khoản nợ có thể phình to dù bạn không vay thêm.", en: "Don't borrow in a currency you don't earn — the debt can balloon without you borrowing more." }],
        ["🔎", { vi: "Đọc tin 'vốn ngoại kỷ lục': hỏi đó là nhà máy hay tiền ngắn hạn?", en: "Reading 'record foreign inflows': ask — factories or short-term money?" }],
        ["🧠", { vi: "Khi ai cũng nói 'lần này khác', hãy nhớ Bangkok 1997.", en: "When everyone says 'this time is different', remember Bangkok 1997." }],
      ],
      lion: { vi: "🎮 Đã mở trong game: Phòng 1997 trong Bảo tàng Khủng hoảng — vào vai Thống đốc Thái Lan!", en: "🎮 Unlocked in the game: the 1997 room in the Crisis Museum — play Thailand's Governor!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "🏛️ IMF", fs: 32,
      title: { vi: "IMF: cứu hỏa hay làm khó?", en: "The IMF: firefighter or tough master?" },
      text: {
        vi: "IMF (Quỹ Tiền tệ Quốc tế) cho các nước vay khi cạn ngoại tệ — năm 1997 là các gói cho Thái Lan, Indonesia, Hàn Quốc. Đổi lại, nước vay phải tăng lãi suất, cắt chi tiêu, đóng cửa ngân hàng yếu. Người ủng hộ nói điều kiện giúp lấy lại niềm tin; người phản đối nói chúng làm suy thoái nặng hơn. Malaysia từ chối IMF và áp kiểm soát vốn năm 1998 — đến nay vẫn tranh luận cách nào tốt hơn. Bài học chung mà ít ai cãi: đừng để nợ ngắn hạn bằng ngoại tệ vượt xa dự trữ.",
        en: "The IMF (International Monetary Fund) lends to countries that run out of foreign currency — in 1997, packages for Thailand, Indonesia and Korea. In return, borrowers had to raise rates, cut spending and close weak banks. Supporters say the conditions restored confidence; critics say they deepened the slump. Malaysia refused the IMF and imposed capital controls in 1998 — which way was better is still debated. The shared lesson few dispute: don't let short-term foreign-currency debt far exceed reserves.",
      },
    },
    {
      t: "calc", q: { vi: "Một tập đoàn Hàn Quốc nợ 100 triệu USD. Đồng won từ 900 xuống 1.800 won/USD.", en: "A Korean group owes $100 million. The won goes from 900 to 1,800 per dollar." },
      parts: [
        { label: { vi: "Nợ tính ra won trước khủng hoảng (tỷ won)", en: "The debt in won before the crisis (billion won)" }, a: 90, tol: 0, unit: { vi: "tỷ won", en: "bn won" } },
        { label: { vi: "Nợ tính ra won sau (tỷ won)", en: "The debt in won after (billion won)" }, a: 180, tol: 0, unit: { vi: "tỷ won", en: "bn won" } },
      ],
      why: { vi: "100 triệu × 900 = 90 tỷ won → × 1.800 = 180 tỷ won. Đồng won mất nửa giá trị so với USD thì nợ USD tính ra won tăng gấp đôi.", en: "100 million × 900 = 90 bn won → × 1,800 = 180 bn won. When the won loses half its value against the dollar, dollar debt in won doubles." },
    },
  ],
};
export default lesson;
