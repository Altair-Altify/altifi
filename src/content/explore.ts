/* ---------- Explore articles (design doc section 4) ----------
 * Each article: real photo → 30-second summary → what happened → why it matters → every side's view → 2–3 quiz questions
 * → sources → "Ask Alti Lion". Written in our own words (no copied news text).
 * ⚠️ Drafts written with AI help from memory (the session's network blocks news sites) — the team checks every number and
 * source before submission; figures are rounded and marked "about". */
import type { TL } from "../i18n/i18n";

export interface ExQuiz { q: TL; o: TL[]; a: number; why: TL }
export interface Article {
  id: string;
  ic: string; // icon for the fallback cover
  c: string; // cover colour
  imageQuery: string; // Wikimedia Commons search words (RealImage)
  imageFile?: string; // pin a specific Commons file once the team picks one
  tag: TL;
  title: TL;
  minutes: number;
  summary: TL; // the 30-second version
  happened: TL[]; // paragraphs
  matters: TL[];
  sides: [string, TL, TL][]; // emoji, who, their view
  quiz: ExQuiz[];
  sources: TL[];
  kb: string[]; // Alti Lion topics that fit
  lesson?: string; // related lesson id
}

const T = (vi: string, en: string): TL => ({ vi, en });

export const ARTICLES: Article[] = [
  {
    id: "ex-rates",
    ic: "bank", c: "#0E9F9A", imageQuery: "Federal Reserve Eccles Building",
    tag: T("Vĩ mô · Lãi suất", "Macro · Rates"),
    title: T("Ngân hàng trung ương tăng lãi suất: ai được, ai mất?", "A central bank hikes rates: who wins, who loses?"),
    minutes: 4,
    summary: T(
      "Năm 2022, lạm phát ở Mỹ lên cao nhất 40 năm. Fed (ngân hàng trung ương Mỹ) tăng lãi suất từ gần 0% lên trên 5% chỉ trong khoảng 16 tháng. Người gửi tiết kiệm vui, người vay thả nổi lo, và cả thế giới — kể cả Việt Nam — cảm nhận được.",
      "In 2022 US inflation hit a 40-year high. The Fed (America's central bank) raised rates from near 0% to over 5% in about 16 months. Savers cheered, floating-rate borrowers worried, and the whole world — Vietnam included — felt it.",
    ),
    happened: [
      T("Sau đại dịch, chuỗi cung ứng tắc nghẽn, giá năng lượng tăng vọt, người dân chi tiêu mạnh trở lại. Lạm phát ở Mỹ lên khoảng 9% vào giữa năm 2022.",
        "After the pandemic, supply chains jammed, energy prices spiked and people spent again. US inflation reached about 9% in mid-2022."),
      T("Từ tháng 3/2022 đến tháng 7/2023, Fed tăng lãi suất 11 lần, có những lần tăng 0,75 điểm % — nhanh nhất trong nhiều thập kỷ.",
        "From March 2022 to July 2023 the Fed raised rates 11 times, some by 0.75 points — the fastest pace in decades."),
      T("USD mạnh lên khắp thế giới. Cuối năm 2022, Ngân hàng Nhà nước Việt Nam tăng lãi suất điều hành 2 lần để giữ ổn định tỷ giá, rồi giảm lại trong năm 2023 khi áp lực dịu đi.",
        "The dollar rose worldwide. In late 2022 the State Bank of Vietnam raised its policy rates twice to steady the exchange rate, then cut them again in 2023 as pressure eased."),
    ],
    matters: [
      T("Lãi suất là 'giá của tiền'. Khi nó tăng: vay đắt hơn → người ta mua nhà, mua xe, mở rộng kinh doanh ít hơn → chi tiêu chậm lại → giá cả tăng chậm hơn.",
        "Interest is 'the price of money'. When it rises, borrowing costs more → people buy fewer homes and cars, firms expand less → spending slows → prices rise more slowly."),
      T("Nhưng cái giá là tăng trưởng chậm hơn, có người mất việc, và người vay lãi thả nổi phải trả nhiều hơn mỗi tháng.",
        "The cost is slower growth, some lost jobs, and higher monthly payments for floating-rate borrowers."),
    ],
    sides: [
      ["🐷", T("Người gửi tiết kiệm", "Savers"), T("Lãi tiền gửi cao hơn — cuối cùng tiền gửi cũng không bị lạm phát 'ăn' hết.", "Higher deposit rates — at last savings aren't eaten by inflation.")],
      ["🏠", T("Người vay mua nhà (thả nổi)", "Home buyers (floating rate)"), T("Tiền trả mỗi tháng tăng mạnh; có người phải bán nhà hoặc cắt chi tiêu.", "Monthly payments jumped; some had to sell or cut spending.")],
      ["🏭", T("Doanh nghiệp", "Businesses"), T("Vay mở rộng đắt hơn, nhiều kế hoạch bị hoãn; nhà xuất khẩu được lợi khi USD mạnh.", "Expansion loans cost more, many plans were shelved; exporters gained from a strong dollar.")],
      ["🏛️", T("Ngân hàng trung ương", "The central bank"), T("Chấp nhận kinh tế chậm lại một chút còn hơn để lạm phát bám rễ — bài học từ thập niên 1970.", "Better a slower economy now than inflation taking root — the lesson of the 1970s.")],
    ],
    quiz: [
      {
        q: T("Vì sao ngân hàng trung ương tăng lãi suất khi lạm phát cao?", "Why does a central bank raise rates when inflation is high?"),
        o: [T("Để vay đắt hơn, chi tiêu chậm lại, giá tăng chậm hơn", "To make borrowing dearer, slow spending and cool prices"), T("Để ngân hàng thương mại lời nhiều hơn", "So commercial banks earn more"), T("Để in thêm tiền", "To print more money")],
        a: 0,
        why: T("Lãi suất cao làm 'giá của tiền' đắt lên, người ta vay và tiêu ít hơn — đó là cách hạ nhiệt lạm phát.", "Higher rates make money dearer, so people borrow and spend less — that's how inflation cools."),
      },
      {
        q: T("Ai thường THIỆT nhiều nhất khi lãi suất tăng nhanh?", "Who usually LOSES most when rates rise fast?"),
        o: [T("Người gửi tiết kiệm", "Savers"), T("Người đang vay lãi thả nổi", "People with floating-rate loans"), T("Nhà xuất khẩu nhận USD", "Exporters paid in dollars")],
        a: 1,
        why: T("Lãi thả nổi đi theo lãi suất thị trường, nên khoản trả hằng tháng tăng ngay. Đây là lý do bài M2 nói về cố định vs thả nổi.", "Floating rates follow the market, so monthly payments rise at once. That's why lesson M2 covers fixed vs floating."),
      },
    ],
    sources: [
      T("Federal Reserve — lịch sử quyết định lãi suất FOMC 2022–2023", "Federal Reserve — FOMC rate decisions 2022–2023"),
      T("Cục Thống kê Lao động Mỹ (BLS) — chỉ số CPI 2022", "US Bureau of Labor Statistics — CPI 2022"),
      T("Ngân hàng Nhà nước Việt Nam — các quyết định điều chỉnh lãi suất 9/2022, 10/2022 và năm 2023", "State Bank of Vietnam — rate decisions Sep 2022, Oct 2022 and 2023"),
    ],
    kb: ["fixedfloat", "inflation", "realrate", "fx"],
    lesson: "m-centralbank",
  },
  {
    id: "ex-1997",
    ic: "globe", c: "#EF4E4E", imageQuery: "Bangkok skyline 1990s",
    tag: T("Khủng hoảng · Tỷ giá", "Crisis · FX"),
    title: T("Khủng hoảng tài chính châu Á 1997", "The 1997 Asian financial crisis"),
    minutes: 4,
    summary: T(
      "Ngày 2/7/1997, Thái Lan buộc phải thả nổi đồng baht sau khi gần cạn dự trữ ngoại tệ. Baht mất khoảng một nửa giá trị; chỉ trong vài tháng, khủng hoảng lan sang Indonesia, Hàn Quốc, Malaysia. Nguyên nhân chính: vốn ngắn hạn đổ vào quá nhanh và nợ bằng đô la.",
      "On 2 July 1997 Thailand had to float the baht after nearly running out of reserves. The baht lost about half its value; within months the crisis spread to Indonesia, Korea and Malaysia. The main cause: short-term money rushing in, and debts in dollars.",
    ),
    happened: [
      T("Đầu thập niên 1990, Đông Á được gọi là 'phép màu'. Thái Lan giữ baht gần như cố định ~25 baht/USD; lãi trong nước cao nên ngân hàng, công ty vay USD ngắn hạn rẻ rồi cho vay bằng baht, nhiều vào bất động sản.",
        "In the early 1990s East Asia was called a 'miracle'. Thailand kept the baht nearly fixed at ~25 per dollar; local rates were high, so banks and firms borrowed cheap short-term dollars and lent in baht, much of it into property."),
      T("Khi xuất khẩu chậm lại và giá nhà đất giảm, nhà đầu tư rút tiền. Ngân hàng trung ương bán dự trữ để giữ tỷ giá đến khi gần hết, rồi phải thả nổi. Nợ USD tính ra baht tăng gấp đôi, hàng loạt công ty tài chính đóng cửa.",
        "When exports slowed and property prices fell, investors pulled out. The central bank sold reserves to hold the rate until they were nearly gone, then had to float. Dollar debts doubled in baht, and many finance companies closed."),
      T("Nhà đầu tư rút khỏi cả khu vực. IMF dẫn đầu các gói cứu trợ cho Thái Lan, Indonesia và Hàn Quốc (gói của Hàn Quốc khoảng 57 tỷ USD). Người dân Hàn Quốc còn quyên góp vàng để giúp đất nước trả nợ.",
        "Investors fled the whole region. The IMF led rescue packages for Thailand, Indonesia and Korea (Korea's was about $57 bn). Koreans even donated gold to help the country repay."),
    ],
    matters: [
      T("Không phải vốn ngoại nào cũng như nhau: nhà máy ở lại, còn tiền ngắn hạn có thể rời đi trong một ngày.", "Not all foreign money is equal: factories stay, short-term money can leave in a day."),
      T("Vay bằng đồng tiền mình không kiếm ra rất nguy hiểm: đồng nội tệ mất giá một nửa thì nợ gấp đôi. Sau 1997, các nước châu Á tích dự trữ lớn hơn nhiều và để tỷ giá linh hoạt hơn.",
        "Borrowing in a currency you don't earn is dangerous: if your money halves, the debt doubles. After 1997 Asian countries built much bigger reserves and let rates move more."),
    ],
    sides: [
      ["🏛️", T("IMF", "The IMF"), T("Cho vay khẩn cấp kèm điều kiện: tăng lãi suất, cắt chi tiêu, đóng ngân hàng yếu — để lấy lại niềm tin.", "Emergency loans with conditions — higher rates, spending cuts, closing weak banks — to restore confidence.")],
      ["🗣️", T("Người phê phán IMF", "IMF critics"), T("Điều kiện quá khắt khe làm suy thoái nặng hơn, người lao động chịu thiệt nhiều nhất.", "The conditions were too harsh, deepened the slump, and workers paid most.")],
      ["🇲🇾", T("Malaysia", "Malaysia"), T("Từ chối IMF, áp kiểm soát vốn năm 1998 — đến nay vẫn tranh luận cách này tốt hay xấu.", "Refused the IMF and imposed capital controls in 1998 — still debated today.")],
      ["🇻🇳", T("Việt Nam", "Vietnam"), T("Ít mở cửa cho vốn ngắn hạn nên bị ảnh hưởng nhẹ hơn, chủ yếu qua xuất khẩu và FDI chậm lại.", "Less open to short-term money, so hit more mildly — mainly via slower exports and FDI.")],
    ],
    quiz: [
      {
        q: T("Vì sao nợ của các công ty Thái 'phình to' sau khi thả nổi baht?", "Why did Thai firms' debts 'balloon' after the float?"),
        o: [T("Vì họ vay bằng USD nhưng thu bằng baht, mà baht mất giá", "They borrowed in dollars but earned in baht, which fell"), T("Vì ngân hàng tăng phí", "Banks raised fees"), T("Vì họ vay thêm", "They borrowed more")],
        a: 0,
        why: T("Nợ 1 triệu USD = 25 triệu baht khi tỷ giá 25; tỷ giá 50 thì thành 50 triệu baht — dù không vay thêm.", "$1 million = 25 million baht at 25; at 50 it's 50 million baht — without borrowing more."),
      },
      {
        q: T("Loại vốn nào bỏ chạy nhanh nhất năm 1997?", "Which money ran fastest in 1997?"),
        o: [T("Nhà máy FDI", "FDI factories"), T("Vốn ngắn hạn: tiền gửi, khoản vay vài tháng, cổ phiếu", "Short-term money: deposits, few-month loans, shares"), T("Khoản vay 20 năm làm cầu", "A 20-year bridge loan")],
        a: 1,
        why: T("Vốn ngắn hạn rút được chỉ bằng một lệnh chuyển tiền — đó gọi là 'vốn nóng'.", "Short-term money leaves with one transfer — that's 'hot money'."),
      },
    ],
    sources: [
      T("IMF — báo cáo đánh giá các chương trình ở Indonesia, Hàn Quốc, Thái Lan (1997–98)", "IMF — evaluation of the programmes in Indonesia, Korea and Thailand (1997–98)"),
      T("Ngân hàng Thái Lan (Bank of Thailand) — thông báo thả nổi baht 2/7/1997", "Bank of Thailand — announcement of the baht float, 2 July 1997"),
      T("Ngân hàng Thế giới — East Asia: The Road to Recovery (1998)", "World Bank — East Asia: The Road to Recovery (1998)"),
    ],
    kb: ["fx", "fixedfloat", "debt"],
    lesson: "x-1997",
  },
  {
    id: "ex-gold",
    ic: "coin", c: "#F2A33A", imageQuery: "gold bars",
    tag: T("Đầu tư · Tài sản", "Investing · Assets"),
    title: T("Vì sao giá vàng tăng khi thị trường bất ổn?", "Why does gold rise when markets get scary?"),
    minutes: 3,
    summary: T(
      "Mỗi lần thế giới hoảng loạn — khủng hoảng 2008, đại dịch 2020 — giá vàng thường tăng. Vàng không trả lãi, không tạo ra lợi nhuận, nhưng nhiều người tin nó 'giữ giá' khi mọi thứ khác lung lay. Niềm tin đó có lý do, nhưng vàng cũng có thể giảm mạnh.",
      "Every time the world panics — the 2008 crisis, the 2020 pandemic — gold tends to rise. Gold pays no interest and makes no profit, but many believe it 'holds value' when everything else wobbles. That belief has reasons, but gold can also fall hard.",
    ),
    happened: [
      T("Sau khủng hoảng 2008, giá vàng thế giới tăng từ khoảng 800–900 USD/ounce lên gần 1.900 USD năm 2011, rồi giảm còn khoảng 1.100 USD vào cuối 2015 — mất hơn 40% so với đỉnh.",
        "After the 2008 crisis, world gold went from about $800–900 an ounce to nearly $1,900 in 2011, then fell to about $1,100 by late 2015 — over 40% below the peak."),
      T("Năm 2020, đại dịch làm thị trường chao đảo, lãi suất về gần 0%: vàng vượt 2.000 USD/ounce lần đầu tiên. Những năm sau, nhiều ngân hàng trung ương mua thêm vàng dự trữ và giá lập kỷ lục mới.",
        "In 2020 the pandemic shook markets and rates fell to near 0%: gold topped $2,000 an ounce for the first time. In later years many central banks bought gold for reserves and prices set new records."),
      T("Ở Việt Nam, giá vàng miếng trong nước có lúc cao hơn giá thế giới quy đổi rất nhiều — người mua lúc 'sốt' có thể lỗ ngay khi bán lại.",
        "In Vietnam, domestic gold bar prices have at times been far above the converted world price — buying in a frenzy can mean an instant loss on resale."),
    ],
    matters: [
      T("Vàng tăng khi bất ổn vì: người ta tìm nơi 'trú ẩn'; lãi suất thấp nên giữ vàng (không lãi) ít bị thiệt; khi đồng tiền mất giá hoặc lạm phát lo ngại, vàng là tài sản không ai in thêm được.",
        "Gold rises in turmoil because people seek a 'safe haven'; low rates make holding gold (no interest) less costly; and when money weakens or inflation looms, gold is something nobody can print."),
      T("Nhưng 'trú ẩn' không có nghĩa 'chắc chắn lời': giá vàng có thể đi ngang hoặc giảm nhiều năm. Vàng nên là một phần nhỏ trong kế hoạch, không phải chỗ dồn hết tiền.",
        "But 'safe haven' doesn't mean 'sure profit': gold can go sideways or fall for years. It's a small slice of a plan, not where you put everything."),
    ],
    sides: [
      ["🛡️", T("Người giữ vàng lâu năm", "Long-term gold holders"), T("Vàng giữ sức mua qua hàng trăm năm, là 'bảo hiểm' khi tiền giấy mất giá.", "Gold kept its purchasing power over centuries — 'insurance' when paper money weakens.")],
      ["📈", T("Nhà đầu tư cổ phiếu", "Stock investors"), T("Vàng không tạo ra lợi nhuận; về dài hạn, doanh nghiệp tốt thường tăng giá trị nhiều hơn.", "Gold produces nothing; over the long run good companies usually grow more.")],
      ["🏛️", T("Ngân hàng trung ương", "Central banks"), T("Mua vàng để đa dạng dự trữ, bớt phụ thuộc vào một đồng tiền như USD.", "Buy gold to diversify reserves and rely less on one currency like the dollar.")],
      ["🧑", T("Người mua lúc 'sốt'", "Frenzy buyers"), T("Thấy giá tăng thì sợ lỡ cơ hội (FOMO) — dễ mua đỉnh, chênh lệch mua–bán cao.", "Rising prices trigger FOMO — easy to buy at the top, with a wide buy–sell spread.")],
    ],
    quiz: [
      {
        q: T("Lý do nào KHÔNG giải thích vì sao vàng hay tăng khi bất ổn?", "Which is NOT a reason gold tends to rise in turmoil?"),
        o: [T("Vàng trả lãi cao hơn tiền gửi", "Gold pays more interest than deposits"), T("Người ta tìm nơi trú ẩn", "People seek a safe haven"), T("Không ai in thêm vàng được", "Nobody can print gold")],
        a: 0,
        why: T("Vàng không trả lãi chút nào — chính vì vậy khi lãi suất thấp, giữ vàng ít bị thiệt hơn.", "Gold pays no interest at all — which is why low rates make holding it less costly."),
      },
      {
        q: T("Giá vàng 2011 → 2015 cho thấy điều gì?", "What does gold from 2011 to 2015 show?"),
        o: [T("Vàng chỉ có thể tăng", "Gold can only rise"), T("Vàng cũng có thể giảm hơn 40% và mất nhiều năm để hồi lại", "Gold can also drop over 40% and take years to recover"), T("Vàng luôn tăng khi kinh tế tốt", "Gold always rises when the economy is good")],
        a: 1,
        why: T("Người mua ở đỉnh 2011 phải chờ gần chục năm mới hòa vốn — 'trú ẩn' vẫn có rủi ro (bài I2).", "Someone who bought at the 2011 peak waited nearly a decade to break even — even a 'haven' has risk (lesson I2)."),
      },
    ],
    sources: [
      T("World Gold Council — dữ liệu giá vàng và mua vàng của các ngân hàng trung ương", "World Gold Council — gold price data and central bank purchases"),
      T("LBMA — giá vàng tham chiếu (LBMA Gold Price) 2008–2020", "LBMA — LBMA Gold Price 2008–2020"),
      T("Ngân hàng Nhà nước Việt Nam — thông tin về thị trường vàng miếng trong nước", "State Bank of Vietnam — notes on the domestic gold bar market"),
    ],
    kb: ["inflation", "stocks", "realrate"],
    lesson: "i-bubbles",
  },
];

/* Still planned (cards show "coming soon"). */
export const PLANNED_EX = [
  { ic: "rocket", c: "#3D5AFE", imageQuery: "Falcon 9 launch", title: T("SpaceX: vì sao công ty chưa niêm yết vẫn được định giá rất cao?", "SpaceX: how can an unlisted company be valued so highly?"), tag: T("Công ty · Định giá", "Company · Valuation") },
  { ic: "shop", c: "#2BB673", imageQuery: "Ho Chi Minh City skyline", title: T("Một câu chuyện doanh nghiệp Việt Nam", "A Vietnamese business story"), tag: T("Doanh nghiệp · Việt Nam", "Business · Vietnam") },
];
