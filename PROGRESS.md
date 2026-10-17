# PROGRESS — Altifi

> Đọc file này + `ALTIFI_DESIGN.md` ở đầu mỗi phiên. Cập nhật ở cuối mỗi phiên.

## Phiên 2 — 18/10/2026 · Nâng cấp giao diện (mục 10c) ✅ có bản chạy được

**Kết quả:** `npm run build` sạch. Kiểm thử Playwright chơi hết 3 bài (cơ bản + đào sâu) ở VI và EN: mọi bước chấm điểm đều đúng (bước `predict` không chấm điểm, đúng thiết kế). Đã chụp và soát Sáng/Tối, VI/EN, chế độ giảm chuyển động. Làm theo đúng thứ tự được giao, ưu tiên các màn lên video (trang chủ, bài học, màn kết quả).

### Đã xong
1. **Bộ icon SVG riêng** (`src/ui/icons.ts`, ~70 icon): lưới 24px, nét bo 2px, 2 tông (nét + tông nhạt); `icon(name, {size, color, label, active})` có `aria-label`. Đã thay emoji ở: thanh điều hướng (tab đang chọn tô màu, tab khác viền xám), HUD (lửa, sao XP, ví net worth, tim trong bài học), nút trên lộ trình, Cài đặt, nút đóng/quay lại, nút điều khiển video, pop-up kết quả, trang Tôi, nút hành động. Emoji chỉ còn trong *nội dung* bài học. Xem toàn bộ icon tại `/dev/icons.html` khi chạy dev.
2. **Trang chủ có hero**: thị trấn SVG (đồi, cây, nhà, cửa hàng trà sữa, tòa kính — cùng phong cách bản đồ game) + **Alti Lion toàn thân vẫy tay, đuôi đung đưa** (`lionFull()`), giữ bong bóng thoại & biểu cảm của base; bấm vào để tùy biến. **Vòng mục tiêu hôm nay** (20 XP/ngày, `S.today`), **streak** to, và **thẻ lớn "Tiếp tục bài đang học"** (lưu bước đang dở `S.inprog`, bấm là vào đúng bước đó; hiện % tiến độ). Người mới → thẻ **"Làm bài test xếp lớp"**.
   - **Bài test xếp lớp** (`src/content/placement.ts`, 8 câu dựa trên các hiểu sai trong khảo sát; không mất tim) → đặt `S.placement` → trình độ tự động của Alti Lion + gợi ý bài bắt đầu. (Kế hoạch đặt placement vào 23/10; làm sớm vì thẻ hero cần chỗ dẫn tới. 23/10 chỉ cần duyệt câu hỏi.)
3. **Lộ trình = con đường uốn lượn**: 5 vùng, mỗi vùng là cảnh của khu tương ứng trên bản đồ game (Cá nhân → nhà; Doanh nghiệp → phố cửa hàng; Đầu tư → tòa kính + bảng giá VNI; Công → tòa thị chính; Quốc tế → biển, tàu, cần cẩu). Nút bài có trạng thái đã xong (vàng + sao) / gợi ý (nhấp nháy + "BẮT ĐẦU") / mở / sắp có, nhãn **"Nên biết trước"**. **Rương thưởng** sau 3 bài (mở → +20 XP, hiệu ứng), **huy hiệu** cuối mỗi vùng. Không ép thứ tự.
4. **Chiều sâu & phân cấp**: bóng đổ mềm nhiều lớp thay viền mỏng, gradient nhẹ cho thẻ nổi bật, thẻ to nhỏ khác nhau (hero + lưới 2 cột), tiêu đề màn 30px, con số to dùng `tabular-nums` và **đếm lên/xuống** (XP, streak, net worth, mục tiêu).
5. **Trang Tôi**: **ảnh bìa** (4 ảnh bìa minh họa: Thị trấn, Phố tài chính, Bến cảng, Hoàng hôn, hoặc ảnh tải lên qua đúng hộp xin quyền ảnh kiểu iOS của base), avatar chồng mép bìa, 4 chỉ số lớn (streak, XP, số bài, số case), **biểu đồ net worth** (area chart từ `S.game.history`; chưa có dữ liệu → trạng thái rỗng có Alti Lion), **kệ huy hiệu** 14 huy hiệu (đã đạt có màu, chưa đạt xám + ổ khóa, bấm xem điều kiện; `src/content/badges.ts`).
6. **Motion kiểu app**: trang trượt (base), thẻ hiện lần lượt khi mở màn (≤ 300ms, dịch ≤ 10px), nút nhấn lún, số đếm, rương nảy, Alti Lion chớp mắt & vẫy tay. Tôn trọng **Potato Mode** và **`prefers-reduced-motion`** (cả CSS lẫn JS: `noMotion()`); chỉ animate transform/opacity.
7. **Nền mờ tiền bạc**: họa tiết lặp vẽ từ chính bộ icon (đồng xu, tờ tiền, heo đất, biểu đồ, ngân hàng, %, cân, địa cầu), ~6% ở Sáng / ~4,5% ở Tối, nằm dưới thời tiết, tắt khi Theme = ảnh của tôi, trôi rất chậm và đứng yên khi Khoai tây/giảm chuyển động. Có cả trong màn bài học.
8. **RealImage** (`src/ui/realimage.ts`): trình duyệt người dùng gọi API Wikimedia Commons (`origin=*`, `generator=search`, `gsrnamespace=6`, `iiprop=url|extmetadata`, `iiurlwidth=800`), **chỉ nhận Public domain / CC0 / CC BY / CC BY-SA** (loại `NonFree`), hiện "tác giả · giấy phép · Wikimedia Commons" có link, **cache localStorage**, **fallback** minh họa SVG (có hiệu ứng đang tải). Chế độ chọn ảnh `?pick=1`: nút ↻ đổi ảnh + nút chép `imageFile: "..."` để ghim. Đã gắn vào: 5 thẻ Khám phá (1 thẻ lớn + lưới 2 cột), 3 phòng Bảo tàng Khủng hoảng (tab Chơi), ảnh mở đầu của 3 bài học.
   - Đã test bằng API giả lập (Playwright chặn & trả JSON): lọc giấy phép đúng, ghi nguồn đúng, nút chọn ảnh hiện. **Chưa test với Commons thật** vì phiên Claude Code bị chặn mạng tới Wikimedia → **nhóm mở app trên trình duyệt để kiểm tra** (xem bên dưới).
   - ⚠️ Tránh "spoil" (mục 6.4): thẻ phòng bảo tàng dùng ảnh **trung tính "trước sự kiện"** (`imageQuery`: sàn chứng khoán thập niên 1920, xe tải giao hàng 1970s, khu nhà ở Mỹ 2000s). Các từ khóa trong tài liệu (`1931 soup kitchen line Chicago`, `1973 gas station no gas sign`, `Lehman Brothers headquarters`) được giữ ở `revealQuery` cho bước "Chuyện gì đã thực sự xảy ra" của chế độ Khủng hoảng (22/10).
- Khác: chạm ≥ 44px cho nút icon (nút đóng, VI/EN, video), nút thoát giữa bài giờ **giữ vị trí** để tiếp tục sau; `addXP()` cập nhật cả XP hôm nay; save mới có thêm `today, goal, chests, badges, inprog, p.cover` (save cũ tự điền mặc định).

### Nhóm cần làm (ảnh thật)
1. `npm run dev`, mở `http://localhost:5173` trên máy có mạng (hoặc bản deploy + `?pick=1`).
2. Xem tab **Khám phá**, **Chơi → Bảo tàng**, và ảnh mở đầu 3 bài học. Ảnh nào không hợp: bấm ↻ để xem ảnh tiếp theo, ưng thì bấm **imageFile** rồi dán vào `imageFile` (Khám phá: `src/ui/explore.ts`; Bảo tàng: `src/ui/play.ts`; bài học: `photo: { query, file }` trong file bài). Không có ảnh nào hợp thì đổi `imageQuery`.
3. Ghi tên file + tác giả + giấy phép vào `assets/CREDITS.md`.

### Lỗi / lưu ý đã biết (phiên 2)
- Kiểm thử tự động thỉnh thoảng báo bước `sort` "not-checked" khi máy chậm (do thời gian chờ của script, chạy lại thì đúng; đã tăng thời gian chờ).
- Service worker cache cả phản hồi API Commons (cache-first) — sau khi ghim `imageFile` thì không ảnh hưởng; muốn làm mới ảnh trên bản deploy thì tăng `VERSION` trong `public/sw.js`.
- Huy hiệu mảng tính theo **các bài đã có nội dung** (bài "Sắp có" không tính); khi thêm bài mới, huy hiệu đã nhận vẫn được giữ.
- Thẻ "Tiếp tục" mở lại bài ở đúng bước nhưng các câu trước đó không được tính lại vào điểm/XP của lần đó.

## Phiên 1 — 18/10/2026 (làm sớm từ tối 17/10) ✅ có bản chạy được

**Kết quả:** `npm run dev` / `npm run build` chạy sạch (tsc không lỗi). Kiểm thử tự động bằng Playwright: chơi hết 3 bài × (cơ bản + đào sâu) ở cả VI và EN — mọi bước có chấm điểm đều RIGHT, không có lỗi console; bản build production đăng ký service worker được.

### Đã xong
- **Dự án mới Vite 7 + TypeScript (không React)** — giữ cách render bằng template string của base để chuyển nhanh và giống hệt UX; handler gọi qua `A.xxx(...)` (`src/core/actions.ts`). Cấu trúc thư mục: xem README.
- **Gộp giao diện nền `altifi-base.html` (mục 10b)** — giữ nguyên: khung điện thoại, hiệu ứng trượt trang `pageAnim`, `pushThen`, theme Sáng/Tối/Ảnh của tôi (hộp xin quyền kiểu iOS), Alti Lion tương tác (bong bóng thoại chạy từng câu + biểu cảm), Hiệu ứng thời tiết theo quốc gia, Chế độ Khoai tây, Thông minh (pop-up mẹo sau câu trả lời), hồ sơ (avatar chữ cái, bio, quốc gia, tuổi, nút Lưu chỉ hiện khi có thay đổi, hỏi trước khi rời), pop-up kết quả (Alti Lion lớn theo điểm, thanh "độ vui", confetti), hiệu ứng đúng/sai (wave/shake/push), tim vỡ, thông báo nhắc học (xem trước), Reset demo.
- **Migrate save cũ** (`src/core/state.ts`): đọc `altifi-demo-v1` (base: set/p/m/xp/streak + ảnh nền `altifi-demo-v1-bg`) và `altifi-demo-v2` (v3: m/xp/streak/lvl/life). Không xóa key cũ. Save mới: `altifi-app-v1` (+ `altifi-app-v1-bg`). Buddy đồng xu → sư tử (màu `silver` → `sky`, mắt `round` → `amber`, tên "Tiko" → "Alti Lion"; nếu buddy cũ là mặc định thì dùng Alti Lion mặc định). `life` của v3 cất trong `S.legacy.life` để trình tạo nhân vật (19/10) nhập lại tên & ngoại hình; net worth tạm = cash + save. Đã test bằng save giả của cả 2 bản.
- **Thanh điều hướng theo mục 7:** Học · Khám phá · Chơi · Tôi · Cài đặt (EN: Learn · Explore · Play · Me · Settings). Tab "Ask Tiko" bỏ, thay bằng nút Alti Lion nổi. Thanh trên: 🔥 streak · ⭐ XP · 💰 net worth (khi đã có game) · nút VI/EN.
- **Alti Lion thay linh vật** (`src/mascot/lion.ts`): `lion(size, mood, cfg)` cùng chữ ký `tiko()`. 6 màu/6 mắt/6 miệng của `alti-lion.html`; thêm biểu cảm **laugh**; phụ kiện cũ (5 mũ, 3 kính, 4 phụ kiện) đã căn lại toạ độ cho đầu sư tử (nơ thay chỗ mặt dây chuyền ₫); hoạt ảnh **chớp mắt** + **bờm rung khi vui** (tắt trong Khoai tây). Trang tùy biến giữ nguyên, tile đổi sang bộ của sư tử, tên tile có bản VI. Tên mặc định "Alti Lion", đổi được.
- **i18n VI/EN từ đầu** (`src/i18n`): mọi chuỗi giao diện qua `t()` (bảng `[vi, en]` cạnh nhau trong `strings.ts` để Gia Mẫn soát), nội dung qua `tx({vi,en})`. Đổi ngôn ngữ ở nút VI/EN (thanh trên) hoặc Cài đặt; lưu lựa chọn; đổi giữa chừng bài học vẫn giữ tiến độ. Mặc định theo ngôn ngữ trình duyệt.
- **Engine bài học** (`src/lesson/player.ts`) — 16 dạng: 10 dạng của v3 (`learn, pick, mcq, sort, match, order, slider, jars, spot, tap`) + mới `video, chart` (đọc biểu đồ SVG), `calc` (tính nhiều bước, nhận số kiểu "1.800.000" hoặc "1,800,000" hoặc "1,92"), `statement` (đọc báo cáo tài chính mini; trắc nghiệm hoặc bấm dòng có vấn đề), `explain` (gõ 1–2 câu, chấm theo ý chính bằng từ khóa, không dấu cũng được), `predict` (dự đoán rồi xem thực tế, không chấm). Phản hồi + "vì sao" sau mỗi câu; XP = 10 + 5 × số câu đúng.
  - **Tim cho bài học** (mục 10b): sai mất 1 tim; hết tim → thẻ "Ôn nhanh 1 phút" → hồi đầy tim, học tiếp.
  - **2 tầng**: Cơ bản + 🔬 **Đào sâu** (mở sau khi xong cơ bản). Thẻ bài có **"Nên biết trước"** + nút **"Ôn nhanh 1 phút"**.
  - Lộ trình dạng nút tròn theo **5 mảng**, **không ép thứ tự** (mọi bài đã có nội dung đều mở; "BẮT ĐẦU" chỉ là gợi ý). 18 bài theo mục 3.4 đều hiện trên lộ trình; bài chưa soạn hiện 🔜 "Sắp có".
- **Trình phát video hoạt họa** (`src/lesson/video.ts`): video = danh sách cảnh (chữ, emoji, số đếm chạy, cột tăng, thẻ…), thanh tiến trình theo cảnh, phát/dừng/xem lại/nhảy cảnh, phụ đề luôn hiện, **thuyết minh bằng Web Speech API** (bật/tắt; giọng tùy thiết bị). Phải xem hết (hoặc "Bỏ qua video") mới tiếp tục. **1 video mẫu hoàn chỉnh: "Lãi kép: quả cầu tuyết của tiền"** (7 cảnh, ~45 giây, VI + EN).
- **Alti Lion trợ lý góc phải** (`src/assistant/`): nút nổi trên **mọi màn hình** (cả trong bài học, tự né footer/thanh điều hướng). Bấm → khung chat đầy đủ **theo ngữ cảnh** (biết đang ở tab/bài/bước nào, hiện tóm tắt nội dung đó). **Chế độ gợi ý** khi câu hỏi chưa trả lời (chỉ gợi ý, không lộ đáp án — luật của base); trả lời xong thì "mở khóa" giải thích đầy đủ. **3 cấp n/l/p** tự động theo tiến độ (số bài + cấp game + placement), đổi tay được (trong khung chat hoặc Cài đặt); câu hỏi có **thuật ngữ chuyên sâu** → trả lời cấp Pro kèm ghi chú; ở Pro Alti Lion đội mũ tốt nghiệp. Kho 20 chủ đề × 3 cấp × 2 ngôn ngữ (`kb.ts`), có câu fallback. Ghi rõ "Demo — bản đầy đủ dùng AI". Chỗ cắm AI thật: `setAnswerEngine()`.
- **Nội dung mẫu mới hoàn toàn** (không dùng lại 12 bài cũ) — 3 bài, phủ đủ 16 dạng bài tập:
  1. Cá nhân #1 **Ngân sách & 50/30/20** (hũ, rò rỉ tiền, bài đăng "bạn bè rủ mua" + BNPL, giải thích bằng lời; Đào sâu: kế toán tinh thần, Madrian & Shea, ngân sách cơ sở 0).
  2. Cá nhân #2 **Lạm phát, lãi kép & quỹ khẩn cấp** (video; bẫy "lạm phát ≠ mất giá so với USD" từ khảo sát; lãi suất thực; quy tắc 72; Đào sâu: phương trình Fisher chính xác, ai lợi khi lạm phát bất ngờ).
  3. Doanh nghiệp #1 **Doanh thu, chi phí & điểm hòa vốn** (báo cáo kết quả kinh doanh mini của quán trà sữa, biểu đồ hòa vốn; Đào sâu: đòn bẩy hoạt động DOL, biên an toàn).
- **Tab Khám phá & Chơi**: đã có trong điều hướng, hiện danh sách bài Khám phá dự kiến (5 bài mục 4) và các chế độ chơi theo mảng + Bảo tàng Khủng hoảng (nhãn "Sắp có · ngày"), thẻ net worth, bảng ký hiệu chấm nước đi.
- **PWA**: `manifest.webmanifest`, icon Alti Lion (svg + png 192/512, maskable), `sw.js` (trang: mạng trước; asset: cache trước). Chỉ đăng ký SW ở bản build.
- Bắt lỗi toàn cục → toast (như prototype). `README.md`, `assets/CREDITS.md`, `scripts/playthrough.cjs` (test tự động), `reference/` (3 file HTML gốc).

### Còn dở / chưa làm (thuộc phạm vi 18/10)
- **Ảnh thật** cho phần mở đầu bài học: engine đã hỗ trợ (`img: {src, alt, credit}`), nhưng phiên này **không truy cập được Wikimedia/Unsplash** (mạng bị chặn) nên chưa có ảnh nào. → Tải ảnh PD/CC về `public/img/` + ghi `assets/CREDITS.md`.
- Mới có 3/18 bài và 1/3 video — đúng kế hoạch (bài & video còn lại thuộc các ngày 20–22/10).
- Dạng `statement` chế độ "bấm dòng có vấn đề" đã code nhưng chưa có bài nào dùng (mới test bài dạng trắc nghiệm).

### Lỗi / lưu ý đã biết
- Giọng đọc tiếng Việt phụ thuộc thiết bị (Chrome desktop/Android thường có; một số máy không có giọng vi-VN → vẫn có phụ đề). Trình duyệt chặn tự phát âm thanh đến khi người dùng chạm vào trang — bình thường vì video luôn mở sau một lần bấm.
- Chấm "giải thích bằng lời" chỉ theo từ khóa (demo): câu trả lời lạc đề nhưng chứa từ khóa vẫn có thể được tính đúng. Ghi rõ trên màn hình.
- Nút Alti Lion nổi có thể che một phần mép phải của nội dung (đã thu nhỏ trong bài học và tự né footer).
- `S.game` hiện chỉ có `netWorth` (từ save v3) — cấu trúc game thật sẽ định nghĩa ở 19–20/10; `autoLvl()` đã đọc sẵn `S.game.rank` nếu có.

### Số liệu cần kiểm chứng trước khi nộp ⚠️
- Lạm phát bình quân Việt Nam 2008 ≈ 23% (Tổng cục Thống kê) — dùng trong bài Lạm phát.
- 50/30/20 do Elizabeth Warren & Amelia Warren Tyagi phổ biến (sách *All Your Worth*, 2005).
- Madrian & Shea (2001): tự động đăng ký → tham gia từ ~37% lên 86%.
- Trong kho Alti Lion: Madoff ~65 tỷ USD; thất nghiệp Mỹ ~25% thời Đại khủng hoảng; giá dầu ~×4 năm 1973; Lehman phá sản 9/2008; Thaler Nobel 2017.
- Các con số tự tính (lãi kép 10 triệu × 8% × 30 năm = 100,6 triệu, quy tắc 72, hòa vốn 2.864 ly, DOL 22…) đã ghi phép tính trong comment của file bài học.

## ▶️ Việc đầu tiên của phiên sau (19/10)
1. Đọc `ALTIFI_DESIGN.md` mục 6.1, 6.1b, 6.6, **10b, 10c** + file này. `npm install && npm run dev`, chạy `node scripts/playthrough.cjs vi` để chắc mọi thứ vẫn xanh.
2. Quyết định engine bản đồ: **Phaser 3** (camera, tilemap, tween) — thêm `src/game/`; tab **Chơi** mở bản đồ thay cho danh sách "Sắp có". **Dùng lại phong cách & mảnh SVG trong `src/ui/scenes.ts`** (nhà, cửa hàng, tòa kính, tòa thị chính, tàu, cây) và bảng màu của 5 vùng trên con đường học để Học và Chơi là một thế giới (10c.3).
3. Làm theo bảng mục 12 ngày 19/10: thế giới ~1600×2400 (camera theo nhân vật, kéo/zoom, minimap, nút về nhân vật), bấm-để-đi (tìm đường trên lưới), 6 khu, NPC, dùng lại thời tiết; trình tạo nhân vật (`avatar()` của v3, nhập tên/ngoại hình từ `S.legacy.life`); HUD net worth (đặt `S.game.netWorth` và **đẩy giá trị theo tháng vào `S.game.history`** để biểu đồ trang Tôi tự chạy; số case vào `S.game.cases`).
4. Dùng `icon()` cho mọi icon mới (không emoji ở chrome), `noMotion()` cho hiệu ứng, Night mode cho màn game, `setCtx()` cho Alti Lion, `t()`/`tx()` cho chữ.
