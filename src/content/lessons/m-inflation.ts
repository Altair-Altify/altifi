/* Macroeconomics · M1 — "Where does inflation come from?" (design doc 13.2d ③, 6-beat frame 13.2c)
 * CPI basket (build your own), demand-pull / cost-push / too much money, expectations; trap (survey 7/46):
 * inflation ≠ the dong falling against the dollar (moved here from the old P3, 13.2e).
 * ⚠️ Draft written with AI help — team review. Verify (GSO, average CPI): 2007 8.3%, 2008 23.0%, 2009 6.9%, 2010 9.2%,
 * 2011 18.6%, 2012 9.1%, 2013 6.6%; Zimbabwe 2008 (official ~231 million % in Jul 2008; 100-trillion-dollar note);
 * US CPI peak 9.1% (Jun 2022). The personal-CPI basket is illustrative. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "m-inflation",
  domain: "macro",
  icon: "🎈",
  ic: "drop",
  minutes: 7,
  title: { vi: "Lạm phát đến từ đâu?", en: "Where does inflation come from?" },
  desc: {
    vi: "Rổ hàng CPI (tự xây rổ của bạn), lạm phát do cầu kéo, chi phí đẩy và tiền quá nhiều, kỳ vọng lạm phát — và vì sao lạm phát khác với VND mất giá so với USD.",
    en: "The CPI basket (build your own), demand-pull, cost-push and too-much-money inflation, expectations — and why inflation isn't the dong falling against the dollar.",
  },
  prereq: { vi: "sức mua và lãi suất thực (bài P3).", en: "buying power and the real interest rate (lesson P3)." },
  review: {
    title: { vi: "Nguồn gốc lạm phát", en: "Where inflation comes from" },
    points: [
      { vi: "CPI = giá của một <b>rổ hàng</b> tiêu biểu, mỗi món có trọng số.", en: "CPI = the price of a typical <b>basket</b>, each item weighted." },
      { vi: "<b>Cầu kéo</b>: người ta muốn mua nhiều hơn số hàng có.", en: "<b>Demand-pull</b>: people want to buy more than there is." },
      { vi: "<b>Chi phí đẩy</b>: xăng, nguyên liệu, lương đắt lên.", en: "<b>Cost-push</b>: fuel, materials, wages get dearer." },
      { vi: "<b>Tiền quá nhiều</b> so với hàng hóa → giá tăng. Lạm phát ≠ tỷ giá.", en: "<b>Too much money</b> chasing goods → prices rise. Inflation ≠ exchange rate." },
    ],
  },
  info: {
    s: { vi: "Lạm phát đến từ cầu kéo, chi phí đẩy hoặc tiền quá nhiều so với hàng hóa; đo bằng CPI — khác với tỷ giá.", en: "Inflation comes from demand-pull, cost-push or too much money for the goods available; measured by CPI — not the exchange rate." },
    l: {
      vi: "Lạm phát là mặt bằng giá chung tăng, đo bằng chỉ số giá tiêu dùng CPI — giá của một rổ hàng hóa, dịch vụ tiêu biểu với trọng số theo mức chi tiêu. Có ba nguồn chính: cầu kéo (thu nhập, tín dụng tăng nhanh nên người ta muốn mua nhiều hơn lượng hàng có), chi phí đẩy (giá xăng, nguyên liệu, lương tăng nên doanh nghiệp tăng giá) và tiền quá nhiều (lượng tiền tăng nhanh hơn hàng hóa). Kỳ vọng cũng quan trọng: nếu ai cũng tin giá sẽ tăng, họ mua sớm và đòi tăng lương, làm giá tăng thật. Lạm phát khác với việc VND mất giá so với USD — đó là tỷ giá.",
      en: "Inflation is a rise in the general price level, measured by the consumer price index CPI — the price of a typical basket of goods and services, weighted by spending. Three main sources: demand-pull (incomes and credit grow fast, so people want more than is available), cost-push (fuel, materials and wages cost more, so firms raise prices) and too much money (the money supply grows faster than goods). Expectations matter too: if everyone believes prices will rise, they buy early and ask for raises, which pushes prices up. Inflation is not the dong falling against the dollar — that's the exchange rate.",
    },
  },
  kb: ["inflation", "realrate", "fx"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "Vietnam street market vendor" }, art: "🧋 25k → 45k ?", cap: { vi: "Ai làm giá tăng?", en: "Who pushed the price up?" },
      title: { vi: "Lạm phát đến từ đâu?", en: "Where does inflation come from?" },
      text: {
        vi: "Ly trà sữa 25.000₫ ngày nào giờ thành 45.000₫. Không chỉ trà sữa — cơm trưa, vé xe, học phí cũng lên. Ai quyết định giá tăng? Không có “ông trùm giá cả” nào cả. Lạm phát đến từ <b>cách cả nền kinh tế mua, bán và in tiền</b>. Bài này bạn sẽ tự tìm ra ba nguồn của nó — và tự tính lạm phát “của riêng mình”.",
        en: "A milk tea that was 25,000₫ is now 45,000₫. Not just milk tea — lunch, bus fares and school fees too. Who decided? There's no “price boss”. Inflation comes from <b>how the whole economy buys, sells and prints money</b>. In this lesson you'll find its three sources — and calculate your very own inflation rate.",
      },
      lion: { vi: "Gợi ý: hãy nghĩ về tiền và hàng hóa như hai bên của một cái cân ⚖️", en: "Hint: think of money and goods as the two sides of a scale ⚖️" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: một thị trấn nhỏ, chỉ bán trà sữa, mỗi ngày 100 ly giá 30.000₫. Bỗng nhiên ai cũng có GẤP ĐÔI tiền, nhưng quán vẫn chỉ làm được 100 ly. Về lâu dài, giá một ly sẽ là bao nhiêu?", en: "Guess: a tiny town that only sells milk tea, 100 cups a day at 30,000₫. Suddenly everyone has TWICE as much money, but the shop can still only make 100 cups. In the long run, what will a cup cost?" },
      art: "💵💵 → 🧋 × 100", min: 30000, max: 90000, step: 1000, start: 35000, actual: 60000, unit: "vnd",
      reveal: { vi: "Khoảng <b>60.000₫</b> — gấp đôi. Tiền nhiều gấp đôi nhưng hàng không nhiều hơn, nên mọi người tranh nhau trả giá cao hơn tới khi giá cũng gấp đôi. Không ai giàu hơn: ai cũng có gấp đôi tiền, nhưng vẫn chỉ mua được 1 ly. Đó là “tiền quá nhiều đuổi theo quá ít hàng”.", en: "About <b>60,000₫</b> — double. Twice the money but no more tea, so people outbid each other until the price doubles too. Nobody is richer: everyone has twice the money but can still buy only one cup. That's “too much money chasing too few goods”." },
    },
    /* 3 · Mechanism */
    {
      t: "learn", art: "🛒 = 🍚40% + 🚌20% + 🧋30% + 🎮10%", fs: 18,
      title: { vi: "CPI: giá của một rổ hàng", en: "CPI: the price of a basket" },
      text: {
        vi: "Cục Thống kê theo dõi giá của một <b>rổ hàng</b> mà gia đình Việt Nam hay mua (ăn uống, nhà ở, đi lại, giáo dục, y tế…). Mỗi món có <b>trọng số</b> theo phần tiền người ta chi cho nó: ăn uống chiếm phần lớn nên giá gạo, thịt tăng ảnh hưởng nhiều hơn giá vé xem phim. Lạm phát = rổ hàng năm nay đắt hơn năm ngoái bao nhiêu %.",
        en: "The statistics office tracks the price of a <b>basket</b> Vietnamese families typically buy (food, housing, transport, education, health…). Each item has a <b>weight</b> based on how much people spend on it: food is a big share, so rice and meat prices matter more than cinema tickets. Inflation = how many % dearer the basket is than last year.",
      },
    },
    {
      t: "calc", q: { vi: "Tự xây rổ CPI của BẠN. Năm nay so với năm ngoái:<span class=\"qsub\">🍚 Cơm trưa — trọng số 40% — giá +5%<br>🧋 Trà sữa — 30% — giá +20%<br>🚌 Vé xe buýt — 20% — giá +10%<br>🎮 Nạp game — 10% — giá +0%</span>", en: "Build YOUR own CPI basket. This year vs last year:<span class=\"qsub\">🍚 Lunch — weight 40% — price +5%<br>🧋 Milk tea — 30% — price +20%<br>🚌 Bus pass — 20% — price +10%<br>🎮 Game top-ups — 10% — price +0%</span>" },
      parts: [
        { label: { vi: "Trà sữa đóng góp bao nhiêu điểm % vào lạm phát của bạn?", en: "How many percentage points does milk tea add to your inflation?" }, a: 6, tol: 0.05, unit: "%" },
        { label: { vi: "Lạm phát “của riêng bạn” (%)", en: "Your “personal” inflation (%)" }, a: 10, tol: 0.05, unit: "%" },
      ],
      why: { vi: "Trà sữa: 30% × 20% = 6 điểm. Tổng: 0,4×5 + 0,3×20 + 0,2×10 + 0,1×0 = 2 + 6 + 2 + 0 = 10%. Nếu CPI cả nước chỉ 4%, rổ của bạn vẫn có thể đắt lên 10% — vì bạn mua thứ khác với “gia đình tiêu biểu”.", en: "Milk tea: 30% × 20% = 6 points. Total: 0.4×5 + 0.3×20 + 0.2×10 + 0.1×0 = 2 + 6 + 2 + 0 = 10%. Even if national CPI is 4%, your basket can rise 10% — because you buy different things from the “typical family”." },
      hint: { vi: "Mỗi món: trọng số × mức tăng giá, rồi cộng lại.", en: "Each item: weight × price rise, then add them up." },
    },
    {
      t: "sort", q: { vi: "Giá tăng vì nguyên nhân nào?", en: "Why did prices rise here?" },
      buckets: [["🛍️", { vi: "Cầu kéo", en: "Demand-pull" }], ["⛽", { vi: "Chi phí đẩy", en: "Cost-push" }], ["💵", { vi: "Tiền quá nhiều", en: "Too much money" }]],
      items: [
        ["⛽", { vi: "Giá dầu thế giới tăng vọt → vận chuyển, điện đắt lên", en: "World oil prices soar → transport and power cost more" }, 1],
        ["✈️", { vi: "Lương tăng, Tết ai cũng đi du lịch → giá tour, vé máy bay tăng", en: "Pay rises and everyone travels at Tết → tour and flight prices up" }, 0],
        ["🖨️", { vi: "Chính phủ in rất nhiều tiền để trả nợ", en: "The government prints lots of money to pay its debts" }, 2],
        ["💾", { vi: "Thiếu chip toàn cầu → điện thoại, ô tô đắt lên", en: "A global chip shortage → phones and cars get dearer" }, 1],
        ["🏠", { vi: "Lãi suất rất thấp, người người vay mua nhà → giá nhà tăng", en: "Very low rates, everyone borrows to buy homes → home prices up" }, 0],
        ["🇿🇼", { vi: "Zimbabwe 2008: in tiền tờ 100 nghìn tỷ đô", en: "Zimbabwe 2008: printing 100-trillion-dollar notes" }, 2],
      ],
      why: { vi: "Cầu kéo: người mua nhiều hơn lượng hàng (thường vì thu nhập/tín dụng tăng). Chi phí đẩy: làm ra hàng đắt hơn. Tiền quá nhiều: lượng tiền tăng nhanh hơn hàng hóa — ở mức cực đoan thành siêu lạm phát.", en: "Demand-pull: buyers want more than there is (often because incomes or credit grow). Cost-push: making things got dearer. Too much money: money grows faster than goods — at the extreme, hyperinflation." },
      hint: { vi: "Hỏi: người mua muốn nhiều hơn, làm ra hàng đắt hơn, hay tiền bị in ra nhiều hơn?", en: "Ask: do buyers want more, did making it get dearer, or was more money printed?" },
    },
    /* 4 · The real story */
    {
      t: "chart", q: { vi: "Lạm phát bình quân ở Việt Nam 2007–2013. Hai năm nào lạm phát vượt 15%?", en: "Vietnam's average inflation 2007–2013. Which two years were above 15%?" },
      chart: {
        kind: "bar",
        labels: ["2007", "2008", "2009", "2010", "2011", "2012", "2013"],
        series: [{ name: { vi: "CPI bình quân (%)", en: "Average CPI (%)" }, color: "#8B6CF0", data: [8.3, 23.0, 6.9, 9.2, 18.6, 9.1, 6.6] }],
        y: "%",
        source: { vi: "Tổng cục Thống kê (làm tròn)", en: "General Statistics Office of Vietnam (rounded)" },
      },
      o: [{ vi: "2008 và 2011", en: "2008 and 2011" }, { vi: "2007 và 2010", en: "2007 and 2010" }, { vi: "2009 và 2013", en: "2009 and 2013" }, { vi: "2010 và 2012", en: "2010 and 2012" }],
      a: 0,
      why: { vi: "2008 (~23%): tín dụng và tiền tăng rất nhanh những năm trước đó, cộng giá dầu, lương thực thế giới lên đỉnh — cả cầu kéo, chi phí đẩy lẫn tiền nhiều. 2011 (~18,6%): lại sau một đợt nới tín dụng mạnh. Mỹ năm 2022 cũng có lạm phát ~9% sau khi bơm tiền mùa COVID và giá năng lượng tăng.", en: "2008 (~23%): credit and money had grown very fast, plus world oil and food prices peaked — demand-pull, cost-push and too much money at once. 2011 (~18.6%): again after a big credit boom. The US also hit ~9% in 2022 after COVID-era stimulus and an energy price spike." },
      hint: { vi: "Tìm hai cột cao vượt vạch 15.", en: "Find the two bars above 15." },
    },
    {
      t: "learn", photo: { query: "Zimbabwe 100 trillion dollar banknote" }, art: "🇿🇼 💵 100.000.000.000.000",
      title: { vi: "Khi in tiền mất kiểm soát", en: "When money printing gets out of control" },
      text: {
        vi: "Năm 2008, Zimbabwe in tiền để chi tiêu và trả nợ. Giá cả tăng nhanh tới mức lạm phát chính thức tháng 7/2008 khoảng <b>231 triệu %</b>; ngân hàng trung ương phát hành tờ <b>100 nghìn tỷ đô la Zimbabwe</b> — không đủ mua một ổ bánh mì. Người dân bỏ tiền nội tệ, dùng USD. Bài học: khi người ta mất niềm tin vào đồng tiền, <b>kỳ vọng</b> làm giá tăng còn nhanh hơn.",
        en: "In 2008 Zimbabwe printed money to spend and pay debts. Prices rose so fast that official inflation in July 2008 was about <b>231 million %</b>; the central bank issued a <b>100-trillion Zimbabwe-dollar</b> note — not enough for a loaf of bread. People dropped the local money for US dollars. Lesson: when people lose faith in a currency, <b>expectations</b> push prices up even faster.",
      },
    },
    /* 5 · Traps (survey: 7/46 confused inflation with the dong vs the dollar) */
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
        vi: "Bẫy phổ biến — 7/46 bạn trong khảo sát nhầm! VND mất giá so với USD là chuyện <b>tỷ giá</b> (giá của đồng tiền so với ngoại tệ). Lạm phát đo giá cả <b>trong nước</b>. Hai thứ có thể liên quan (hàng nhập khẩu đắt lên), nhưng không phải một.",
        en: "Classic trap — 7 of 46 teens in our survey fell for it! The dong weakening against the dollar is about the <b>exchange rate</b> (a currency's price in foreign money). Inflation measures <b>domestic</b> prices. They can be linked (imports get dearer), but they're not the same thing.",
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
      why: { vi: "Giá nhiều thứ trong nước cùng tăng → lạm phát. Giá của đồng tiền so với ngoại tệ thay đổi → tỷ giá (bài X1).", en: "Many domestic prices rising together → inflation. A currency's price vs foreign money changing → exchange rate (lesson X1)." },
      hint: { vi: "Có nhắc tới USD/ngoại tệ không? Nếu có, thường là tỷ giá.", en: "Does it mention USD or foreign money? If so, it's usually the exchange rate." },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: em bạn hỏi “Sao nhà nước không in thật nhiều tiền chia cho mọi người cho giàu?” Giải thích 1–2 câu.", en: "Final boss: your sibling asks “Why doesn't the government just print loads of money and give it to everyone?” Explain in 1–2 sentences." },
      keys: [
        { label: { vi: "Hàng hóa không tăng theo", en: "Goods don't increase" }, words: { vi: ["hàng hóa", "hàng", "sản xuất", "không tăng", "vẫn vậy", "không nhiều hơn"], en: ["goods", "products", "production", "don't increase", "same amount", "no more"] } },
        { label: { vi: "Giá tăng / lạm phát", en: "Prices rise / inflation" }, words: { vi: ["giá tăng", "giá", "lạm phát", "đắt"], en: ["prices", "inflation", "expensive", "dearer"] } },
        { label: { vi: "Không ai giàu hơn / mất sức mua", en: "Nobody's richer / buying power" }, words: { vi: ["không ai giàu", "không giàu", "sức mua", "mua được", "như cũ", "mất giá"], en: ["nobody", "not richer", "buying power", "purchasing power", "buy the same", "worth less"] } },
      ],
      need: 2,
      model: { vi: "Vì in thêm tiền không làm ra thêm hàng hóa, nên khi ai cũng nhiều tiền hơn thì giá cả tăng theo (lạm phát) và cuối cùng không ai mua được nhiều hơn — như thị trấn trà sữa.", en: "Printing money doesn't make more goods, so when everyone has more money prices just rise (inflation) and in the end nobody can buy more — like the milk-tea town." },
      why: { vi: "Ý chính: của cải thật là hàng hóa, dịch vụ làm ra — không phải số tờ tiền.", en: "Key idea: real wealth is the goods and services produced — not the number of banknotes." },
      hint: { vi: "Nhớ thị trấn trà sữa ở đầu bài.", en: "Remember the milk-tea town at the start." },
    },
    {
      t: "learn", art: "🧾 📈 🧠",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Thử làm 'nhà thống kê' trong một tuần:", en: "Be a statistician for a week:" },
      items: [
        ["🧾", { vi: "Ghi giá 5 món bạn mua thường xuyên — so lại sau 3 tháng", en: "Note the prices of 5 things you buy often — check again in 3 months" }],
        ["📰", { vi: "Đọc tin CPI tháng này: nhóm hàng nào tăng mạnh nhất? Vì cầu kéo hay chi phí đẩy?", en: "Read this month's CPI news: which group rose most? Demand-pull or cost-push?" }],
        ["💱", { vi: "Thấy tin 'USD tăng giá' — nhớ: đó là tỷ giá, chưa chắc là lạm phát", en: "See 'the dollar is up' — remember: that's the exchange rate, not necessarily inflation" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: chỉ số giá chạy trên bảng tin thị trấn — và giá ở Chợ tăng theo lạm phát mỗi tháng!", en: "🎮 Unlocked in the game: a price index on the town's news board — and Market prices rise with inflation every month!" },
    },
  ],
  deep: [
    {
      t: "learn", art: "M × V = P × Y", fs: 28,
      title: { vi: "Phương trình số lượng tiền", en: "The quantity equation" },
      text: {
        vi: "<b>M × V = P × Y</b>: lượng tiền (M) nhân số vòng quay của tiền (V) bằng mặt bằng giá (P) nhân sản lượng thực (Y). Nếu V khá ổn định, tiền tăng nhanh hơn sản lượng thì giá phải tăng. Theo % gần đúng: <b>lạm phát ≈ tăng trưởng tiền + thay đổi V − tăng trưởng sản lượng</b>.",
        en: "<b>M × V = P × Y</b>: money (M) times how often it changes hands (V) equals the price level (P) times real output (Y). If V is fairly steady and money grows faster than output, prices must rise. In % terms, roughly: <b>inflation ≈ money growth + change in V − output growth</b>.",
      },
    },
    {
      t: "calc", q: { vi: "Dùng phương trình số lượng tiền (theo %, gần đúng):", en: "Use the quantity equation (in %, approximately):" },
      parts: [
        { label: { vi: "Tiền tăng 15%, V không đổi, sản lượng tăng 6% → lạm phát (%)", en: "Money +15%, V unchanged, output +6% → inflation (%)" }, a: 9, tol: 0.05, unit: "%" },
        { label: { vi: "Tiền tăng 8%, V giảm 2%, sản lượng tăng 6% → lạm phát (%)", en: "Money +8%, V −2%, output +6% → inflation (%)" }, a: 0, tol: 0.05, unit: "%" },
      ],
      why: { vi: "15 + 0 − 6 = 9%. 8 − 2 − 6 = 0% — tiền tăng nhưng không gây lạm phát vì nền kinh tế làm ra nhiều hàng hơn và tiền quay chậm lại.", en: "15 + 0 − 6 = 9%. 8 − 2 − 6 = 0% — money grew but caused no inflation because output grew and money circulated more slowly." },
      hint: { vi: "Lạm phát ≈ tiền + V − sản lượng.", en: "Inflation ≈ money + V − output." },
    },
    {
      t: "mcq", q: { vi: "Lạm phát do CHI PHÍ ĐẨY (giá dầu tăng vọt). Vì sao ngân hàng trung ương khó xử?", en: "Inflation is COST-PUSH (an oil shock). Why is the central bank in a bind?" },
      o: [
        { vi: "Tăng lãi suất hạ được giá nhưng làm kinh tế vốn đang yếu (vì chi phí cao) càng yếu, thất nghiệp tăng — đình lạm", en: "Raising rates can cool prices but weakens an economy already hurt by high costs, raising unemployment — stagflation" },
        { vi: "Vì lãi suất không liên quan gì tới giá cả", en: "Because rates have nothing to do with prices" },
        { vi: "Vì ngân hàng trung ương quyết định giá dầu", en: "Because the central bank sets oil prices" },
        { vi: "Vì chi phí đẩy luôn tự hết sau một tuần", en: "Because cost-push always fades within a week" },
      ],
      a: 0,
      why: { vi: "Với cầu kéo, tăng lãi suất 'trúng bệnh'. Với chi phí đẩy, nó hạ giá bằng cách làm kinh tế chậm thêm — như những năm 1970 sau cú sốc dầu 1973.", en: "With demand-pull, higher rates treat the cause. With cost-push, they lower prices by slowing an economy that's already slowing — like the 1970s after the 1973 oil shock." },
    },
  ],
};
export default lesson;
