/* Personal finance · P4 — "How do I know I'm about to be scammed?" (design doc 13.2d ①, 6-beat frame 13.2c)
 * Ponzi schemes, "easy job, high pay", "guaranteed returns" groups, game top-up scams, phishing.
 * Trap: "high return + no-loss promise = opportunity". Real: Madoff 2008; Vietnam 2022 bond case (ANONYMISED, 6.5).
 * ⚠️ Draft written with AI help — team review. Verify Madoff figures (~$65 billion on paper, 150 years).
 * The chats and messages are invented examples. 5%/week compounded: 1.05^52 ≈ 12.6× → ≈ +1,164%/yr. */
import type { Lesson } from "../../lesson/types";

const lesson: Lesson = {
  id: "p-scam",
  domain: "personal",
  icon: "🚩",
  ic: "bolt",
  minutes: 6,
  title: { vi: "Làm sao biết mình sắp bị lừa?", en: "How do I know I'm about to be scammed?" },
  desc: {
    vi: "Ponzi, 'việc nhẹ lương cao', nhóm 'cam kết lãi', lừa nạp game và tin nhắn giả mạo — học cách bấm đúng cờ đỏ trước khi mất tiền.",
    en: "Ponzi schemes, 'easy job, high pay', 'guaranteed profit' groups, game top-up scams and fake messages — learn to spot the red flags before you lose money.",
  },
  prereq: { vi: "lãi kép và lãi suất thực (bài P3).", en: "compound interest and the real rate (lesson P3)." },
  review: {
    title: { vi: "Cờ đỏ lừa đảo", en: "Scam red flags" },
    points: [
      { vi: "Lãi rất cao + <b>cam kết không lỗ</b> = cờ đỏ lớn nhất.", en: "Very high return + <b>no-loss promise</b> = the biggest red flag." },
      { vi: "Giục gấp, bảo giữ bí mật, đòi chuyển tiền trước.", en: "Rushing you, secrecy, asking you to pay first." },
      { vi: "Không bao giờ đưa mã OTP / mật khẩu cho ai.", en: "Never give anyone your OTP code or password." },
      { vi: "Hỏi: tiền lãi từ đâu ra? Có giấy phép không?", en: "Ask: where does the profit come from? Is it licensed?" },
    ],
  },
  info: {
    s: { vi: "Lãi cao kèm cam kết không lỗ, giục gấp, đòi chuyển tiền trước hay xin mã OTP là dấu hiệu lừa đảo.", en: "High returns with a no-loss promise, pressure to hurry, paying first or asking for an OTP are signs of a scam." },
    l: {
      vi: "Lừa đảo tài chính thường có chung vài dấu hiệu: hứa lợi nhuận rất cao mà 'không có rủi ro', giục bạn quyết định ngay, bảo bạn giữ bí mật, đòi chuyển tiền hay 'phí kích hoạt' trước, hoặc xin mã OTP, mật khẩu. Mô hình Ponzi trả lãi cho người cũ bằng tiền của người mới, nên nó chạy được cho tới khi tiền mới ngừng chảy vào. Câu hỏi đúng luôn là: tiền lãi này từ đâu ra, ai được cấp phép, và nếu họ không trả thì sao?",
      en: "Money scams share a few signs: very high returns 'with no risk', pressure to decide now, secrecy, paying money or an 'activation fee' first, or asking for your OTP or password. A Ponzi scheme pays early members with newcomers' money, so it works until new money stops. The right questions are always: where does this return come from, who licensed it, and what if they don't pay?",
    },
  },
  kb: ["scam", "compound"],
  steps: [
    /* 1 · Hook */
    {
      t: "learn", photo: { query: "smartphone chat messages" }, art: "💬 “Việc nhẹ, 500k/ngày!”", cap: { vi: "Tin nhắn lạ lúc nửa đêm", en: "A strange message at midnight" },
      title: { vi: "Làm sao biết mình sắp bị lừa?", en: "How do I know I'm about to be scammed?" },
      text: {
        vi: "Một tài khoản lạ nhắn: “Chào em, bên chị tuyển cộng tác viên online, chỉ cần bấm thích sản phẩm, <b>500k/ngày</b>. Nạp trước 200k để kích hoạt nhé!” Nghe dễ quá phải không? Kẻ lừa đảo không trông giống kẻ xấu — họ trông giống <b>cơ hội</b>. Bài này dạy bạn bấm đúng cờ đỏ.",
        en: "A stranger messages: “Hi! We're hiring online helpers — just like products, <b>500k a day</b>. Top up 200k first to activate!” Sounds easy, right? Scammers don't look like villains — they look like <b>opportunities</b>. This lesson teaches you to spot the red flags.",
      },
      lion: { vi: "Quy tắc vàng: thứ gì nghe quá tốt để là thật… thường không thật 🚩", en: "Golden rule: if it sounds too good to be true… it usually isn't 🚩" },
    },
    /* 2 · Guess first */
    {
      t: "predict", q: { vi: "Đoán thử: một nhóm hứa “lãi 5% MỖI TUẦN”. Nếu đúng như vậy và lãi được cộng dồn, sau 1 năm 1 triệu thành bao nhiêu?", en: "Guess: a group promises “5% EVERY WEEK”. If true and compounded, what does 1 million become after one year?" },
      art: "💰 1tr × 1,05⁵² = ?", min: 1000000, max: 20000000, step: 100000, start: 3600000, actual: 12600000, unit: "vnd",
      reveal: { vi: "Khoảng <b>12,6 triệu</b> — gấp hơn 12 lần, tức lãi ~1.160%/năm. Gửi tiết kiệm chỉ khoảng 5–6%/năm. Không có việc kinh doanh hợp pháp nào trả nổi mức đó cho mọi người — nên tiền 'lãi' chỉ có thể là tiền của người đến sau.", en: "About <b>12.6 million</b> — over 12 times, i.e. ~1,160% a year. Savings pay about 5–6% a year. No legal business can pay that to everyone — so the 'profit' can only be newcomers' money." },
    },
    /* 3 · Mechanism */
    {
      t: "learn", art: "👤 ← 💵👥 ← 💵👥👥👥",
      title: { vi: "Mô hình Ponzi chạy thế nào", en: "How a Ponzi scheme works" },
      text: {
        vi: "Người đầu tiên bỏ 10 triệu và nhận 'lãi' đều đặn — nhưng tiền lãi đó lấy từ tiền của người thứ hai, thứ ba… Người cũ thấy nhận được tiền thật nên rủ thêm người mới. Mô hình cần số người mới <b>tăng mãi</b>; khi tiền mới chậm lại, nó sụp và phần lớn người tham gia mất trắng. Vì vậy những người 'đã rút được tiền thật' lại chính là quảng cáo tốt nhất cho kẻ lừa đảo.",
        en: "The first person puts in 10 million and gets regular 'profits' — but that money comes from the second, third… person. Early members get real money, so they bring in new ones. The scheme needs ever more newcomers; when new money slows, it collapses and most members lose everything. That's why people who 'really got paid' are the scammer's best advert.",
      },
    },
    {
      t: "spot", q: { vi: "Đọc đoạn chat này. Bấm vào MỌI cờ đỏ.", en: "Read this chat. Tap EVERY red flag." },
      post: {
        user: "Chị Thảo · Tuyển CTV", av: "💼",
        parts: [
          [{ vi: "Bên chị là công ty thương mại điện tử.", en: "We're an e-commerce company." }, false],
          [{ vi: "Việc nhẹ, chỉ cần bấm thích sản phẩm, 500k/ngày 💸", en: "Easy work, just like products, 500k a day 💸" }, true],
          [{ vi: "Nạp trước 200k phí kích hoạt tài khoản nha em.", en: "Just top up a 200k activation fee first." }, true],
          [{ vi: "Cam kết hoàn tiền 100%, không có rủi ro.", en: "100% money-back guarantee, zero risk." }, true],
          [{ vi: "Chỉ còn 3 suất hôm nay, em quyết nhanh nhé ⏰", en: "Only 3 spots left today, decide fast ⏰" }, true],
          [{ vi: "Đừng nói với bố mẹ kẻo người ta giành suất.", en: "Don't tell your parents or someone will take your spot." }, true],
          [{ vi: "Em có thể xem website bên chị ở đây.", en: "You can see our website here." }, false],
        ],
      },
      why: { vi: "Năm cờ đỏ: lương quá cao cho việc quá dễ, đòi tiền trước, 'không rủi ro', giục gấp, bảo giữ bí mật. Một công ty thật không bao giờ bắt ứng viên nộp tiền để được làm việc.", en: "Five red flags: pay far too high for work far too easy, paying first, 'no risk', hurry, secrecy. A real employer never makes you pay to get a job." },
      hint: { vi: "Tìm: tiền trước, hứa hẹn quá đẹp, gấp gáp, bí mật.", en: "Look for: paying first, too-good promises, urgency, secrecy." },
    },
    {
      t: "sort", q: { vi: "Tin nhắn này an toàn hay là lừa đảo?", en: "Is this message safe or a scam?" },
      buckets: [["✅", { vi: "Có thể an toàn", en: "Probably safe" }], ["🚩", { vi: "Lừa đảo", en: "Scam" }]],
      items: [
        ["🏦", { vi: "“Ngân hàng” nhắn: tài khoản bị khóa, bấm link và nhập mã OTP để mở", en: "“Your bank”: account locked, click the link and enter your OTP to unlock" }, 1],
        ["🎮", { vi: "Người lạ: “Cho mình mật khẩu game, mình nạp hộ kim cương x10 giá rẻ”", en: "Stranger: “Give me your game password, I'll top up 10× diamonds cheap”" }, 1],
        ["📚", { vi: "Thầy cô nhắn nhóm lớp: lịch kiểm tra tuần sau", en: "Your teacher in the class group: next week's test schedule" }, 0],
        ["🎁", { vi: "“Bạn trúng iPhone! Chỉ cần chuyển 300k phí ship”", en: "“You won an iPhone! Just pay a 300k shipping fee”" }, 1],
        ["🛍️", { vi: "App mua sắm chính thức báo đơn hàng đã giao (bạn có đặt)", en: "The official shopping app says your order was delivered (you did order)" }, 0],
        ["📈", { vi: "Nhóm Zalo “thầy chứng khoán” cam kết lãi 30%/tháng", en: "A chat group 'stock guru' promising 30% a month" }, 1],
      ],
      why: { vi: "Ngân hàng không bao giờ xin mã OTP qua tin nhắn. Không ai tặng iPhone rồi đòi phí. Mật khẩu là của riêng bạn. Lãi 30%/tháng là không tưởng.", en: "Banks never ask for your OTP by message. Nobody gives away iPhones for a fee. Your password is yours alone. 30% a month is impossible." },
      hint: { vi: "Có đòi mã, mật khẩu hay chuyển tiền trước không?", en: "Does it ask for a code, a password or money first?" },
    },
    /* 4 · The real story */
    {
      t: "mcq", q: { vi: "Bernard Madoff từng là chủ tịch sàn chứng khoán Nasdaq, khách hàng là người giàu và quỹ lớn. Quỹ của ông trả lãi đều đặn ~10%/năm suốt nhiều năm, không bao giờ lỗ. Điều gì lẽ ra phải làm người ta nghi ngờ?", en: "Bernard Madoff once chaired the Nasdaq stock market; his clients were the rich and big funds. His fund paid a steady ~10% a year for years, never a losing month. What should have raised suspicion?" },
      o: [
        { vi: "Lợi nhuận đều đặn tới mức phi thực tế — thị trường thật luôn có năm lên năm xuống — và không ai giải thích được cách ông kiếm ra nó", en: "Returns so smooth they were unrealistic — real markets have up and down years — and nobody could explain how he made them" },
        { vi: "Lãi 10% là quá thấp", en: "10% was too low" },
        { vi: "Ông là người nổi tiếng", en: "He was famous" },
        { vi: "Không có gì đáng nghi", en: "Nothing was suspicious" },
      ],
      a: 0,
      why: { vi: "Mô hình của Madoff sụp năm 2008 với khoảng 65 tỷ USD trên giấy; ông nhận án 150 năm tù. Nhà phân tích Harry Markopolos đã cảnh báo cơ quan quản lý nhiều năm trước vì con số 'đẹp quá'. Ở Việt Nam năm 2022, nhiều người được tư vấn mua trái phiếu của một tập đoàn bất động sản như thể là sổ tiết kiệm và không lấy lại tiền đúng hạn — lừa đảo không chỉ đến từ người lạ trên mạng.", en: "Madoff's scheme collapsed in 2008 with about $65 billion on paper; he got 150 years in prison. Analyst Harry Markopolos had warned regulators for years because the numbers were 'too good'. In Vietnam in 2022, many people were sold a real-estate group's bonds as if they were savings accounts and couldn't get their money back on time — trouble doesn't only come from strangers online." },
      hint: { vi: "Một quỹ thật có tháng nào bị lỗ không?", en: "Does a real fund ever have losing months?" },
    },
    /* 5 · Trap */
    {
      t: "mcq", q: { vi: "Bạn thân rủ: “Tham gia đi, mình rút được lãi 3 tuần liền rồi, cam kết không lỗ!” Bạn nghĩ gì?", en: "Your best friend says: “Join! I've been paid three weeks in a row — guaranteed no loss!” What do you think?" },
      o: [
        { vi: "Lãi cao + cam kết không lỗ = cơ hội hiếm, phải vào ngay", en: "High return + no-loss guarantee = a rare chance, jump in now" },
        { vi: "Việc bạn rút được tiền không chứng minh đó là kinh doanh thật — Ponzi cũng trả tiền cho người cũ; cần hỏi tiền lãi từ đâu ra", en: "My friend getting paid doesn't prove it's real — Ponzi schemes pay early members too; ask where the profit comes from" },
        { vi: "Vào thử một ít, khi nào thấy lỗ thì rút", en: "Put in a little and pull out if it starts losing" },
        { vi: "Đã có bạn mình tham gia thì chắc an toàn", en: "If my friend's in, it must be safe" },
      ],
      a: 1,
      why: { vi: "Đây chính là bẫy: 'đã nhận được tiền' và 'người quen rủ' khiến mình mất cảnh giác. Trong mô hình Ponzi, khi mọi người muốn rút thì quỹ đã sụp — 'khi nào lỗ thì rút' thường là quá muộn.", en: "That's the trap: 'already paid' and 'a friend invited me' lower your guard. In a Ponzi scheme, by the time everyone wants out it has already collapsed — 'pull out when it loses' is usually too late." },
      hint: { vi: "Nhớ: tiền trả cho người cũ đến từ đâu?", en: "Remember: where does the money paid to early members come from?" },
    },
    /* 6 · Boss + use it today */
    {
      t: "explain", q: { vi: "Trùm cuối: em bạn được mời vào “nhóm đầu tư lãi 5%/tuần, cam kết không lỗ”. Khuyên em 1–2 câu.", en: "Final boss: your sibling was invited into an “investment group, 5% a week, no loss guaranteed”. Advise them in 1–2 sentences." },
      keys: [
        { label: { vi: "Lãi quá cao / phi thực tế", en: "Return too high / unrealistic" }, words: { vi: ["quá cao", "vô lý", "phi thực tế", "5%/tuần", "1.160", "gấp 12", "không thể"], en: ["too high", "unrealistic", "impossible", "5% a week", "1,160", "12 times"] } },
        { label: { vi: "Cam kết không lỗ / Ponzi", en: "No-loss promise / Ponzi" }, words: { vi: ["không lỗ", "cam kết", "ponzi", "đa cấp", "người mới", "lừa"], en: ["no loss", "guarantee", "ponzi", "pyramid", "newcomers", "scam"] } },
        { label: { vi: "Hỏi / kiểm tra / từ chối", en: "Ask / check / say no" }, words: { vi: ["hỏi", "kiểm tra", "giấy phép", "từ đâu", "từ chối", "đừng", "bố mẹ"], en: ["ask", "check", "licence", "license", "where", "refuse", "don't", "parents"] } },
      ],
      need: 2,
      model: { vi: "Lãi 5%/tuần là hơn 1.000%/năm — không việc kinh doanh thật nào trả nổi, còn cam kết không lỗ là dấu hiệu lừa đảo kiểu Ponzi; em hãy từ chối và hỏi bố mẹ trước khi đưa tiền cho ai.", en: "5% a week is over 1,000% a year — no real business can pay that, and a no-loss promise is a Ponzi-style warning sign; say no and ask our parents before giving anyone money." },
      why: { vi: "Ý chính: tính ra con số thật → nhận ra cờ đỏ → hỏi người tin cậy, không quyết vội.", en: "Key idea: work out the real number → spot the red flag → ask someone you trust, don't rush." },
      hint: { vi: "Nhớ phép tính ở đầu bài: 1 triệu thành bao nhiêu sau 1 năm?", en: "Remember the start: what does 1 million become in a year?" },
    },
    {
      t: "learn", art: "🛑 🔒 🗣️",
      title: { vi: "Dùng ngay hôm nay", en: "Use it today" },
      text: { vi: "Ba thói quen chống lừa đảo:", en: "Three anti-scam habits:" },
      items: [
        ["🔒", { vi: "Không bao giờ đưa mã OTP, mật khẩu cho bất kỳ ai — kể cả người xưng là ngân hàng", en: "Never give your OTP or password to anyone — even someone claiming to be the bank" }],
        ["🛑", { vi: "Ai giục gấp và bảo giữ bí mật: dừng lại 24 giờ", en: "Anyone rushing you and asking for secrecy: stop for 24 hours" }],
        ["🗣️", { vi: "Kể cho bố mẹ hoặc thầy cô trước khi chuyển tiền cho người chưa gặp", en: "Tell a parent or teacher before sending money to someone you've never met" }],
      ],
      lion: { vi: "🎮 Đã mở trong game: sự kiện lừa đảo bất ngờ — bạn đã gặp quỹ “không bao giờ lỗ” ở Công ty chưa?", en: "🎮 Unlocked in the game: surprise scam events — have you met the “never-lose” fund at the Office yet?" },
    },
  ],
  deep: [
    {
      t: "learn", art: "1 → 6 → 36 → 216 → … 👥", fs: 24,
      title: { vi: "Vì sao mô hình đa cấp kiểu kim tự tháp chắc chắn sụp", en: "Why pyramid schemes must collapse" },
      text: {
        vi: "Nếu mỗi người phải rủ được 6 người mới để 'hoàn vốn', thì tầng 1 cần 6 người, tầng 2 cần 36, tầng 5 cần 7.776, tầng 10 cần hơn 60 triệu, tầng 13 vượt dân số thế giới. Toán học bảo đảm phần lớn người tham gia — những người vào sau — sẽ mất tiền.",
        en: "If each person must recruit 6 new people to 'break even', level 1 needs 6 people, level 2 needs 36, level 5 needs 7,776, level 10 over 60 million, and level 13 more than the world's population. The maths guarantees most members — the late ones — lose money.",
      },
    },
    {
      t: "calc", q: { vi: "Mỗi người phải rủ được 6 người mới.", en: "Each person must recruit 6 new people." },
      parts: [
        { label: { vi: "Tầng 4 cần bao nhiêu người mới?", en: "How many new people does level 4 need?" }, a: 1296, tol: 0, unit: { vi: "người", en: "people" } },
        { label: { vi: "Lãi 2%/tuần cộng dồn — sau 52 tuần tiền gấp bao nhiêu lần? (1 chữ số thập phân)", en: "2% a week compounded — how many times after 52 weeks? (1 decimal)" }, a: 2.8, tol: 0.05, unit: { vi: "lần", en: "times" } },
      ],
      why: { vi: "6⁴ = 1.296 người. 1,02⁵² ≈ 2,8 lần — vẫn là 180%/năm, cao hơn mọi kênh đầu tư hợp pháp.", en: "6⁴ = 1,296 people. 1.02⁵² ≈ 2.8 times — still 180% a year, more than any legal investment." },
      hint: { vi: "Tầng n cần 6 mũ n người.", en: "Level n needs 6 to the power n." },
    },
  ],
};
export default lesson;
