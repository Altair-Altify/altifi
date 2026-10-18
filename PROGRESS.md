# PROGRESS — Altifi

> Đọc file này + `ALTIFI_DESIGN.md` ở đầu mỗi phiên. Cập nhật ở cuối mỗi phiên.

## Quyết định Claude Code tự đưa ra — nhóm duyệt sau

> Tuần thi giữa kì (19–23/10) nhóm không trả lời được; chỗ chưa rõ Claude Code tự chọn theo tài liệu và ghi ở đây. Mỗi dòng: quyết định — lý do. Đổi được dễ (đã ghi chỗ sửa).

- **(20/10) Thị trấn dựng hoàn toàn bằng khối hình học trong code, chưa dùng asset Kenney/Quaternius** — mạng của phiên bị chặn tới kenney.nl và quaternius.com (proxy từ chối), và 13.3 đã chọn cách này cho nhân vật; không phải lo giấy phép. Muốn thêm mô hình CC0 sau: tải về `public/models/`, ghi `assets/CREDITS.md`.
- **(20/10) Bóng đổ = "bóng tròn mềm" màu tím xanh vẽ sẵn dưới mỗi vật, không dùng shadow map** — rẻ cho điện thoại yếu, đúng ý "bóng mềm tím xanh, không đen" của 13.3, và shadow map không khớp với shader thế giới cong.
- **(20/10) Tiền khởi đầu trong game = 2.000.000₫ "tiền lì xì tiết kiệm"** (`ensureGame()` trong `src/ui/town.ts`); save cũ có `netWorth` > 0 thì giữ số đó — cần một con số để HUD net worth có ý nghĩa ngay từ lần đầu vào thị trấn; teen 14–17 chưa có lương. Cân bằng lại khi làm chế độ Cá nhân (21/10).
- **(20/10) Camera cố định hướng (không xoay), cao ~44°, nhìn hơi về phía trước nhân vật; FOV tự tăng trên màn hình dọc** — giống cách camera kiểu Animal Crossing; màn điện thoại hẹp cần FOV rộng hơn để thấy đủ phố.
- **(21/10) Chế độ Cá nhân bắt đầu ở tuổi 22, lương 10tr gộp / 8,95tr thực nhận (trừ 10,5% bảo hiểm bắt buộc, chưa tới mức chịu thuế TNCN)** — 6.3 và 13.4 mô tả "nhân vật đi làm có lương"; teen nhập vai chính mình tương lai. ⚠️ Nhóm kiểm lại mức đóng BH và luật thuế TNCN mới.
- **(21/10) Không khóa cứng tính năng trong chế độ Cá nhân, chỉ hiện thẻ "Nên học … Học ngay"** — 3.2 "không ép thứ tự" và 6.1 gợi ý "không khóa cứng"; bài P2/P4/P5 chưa có nội dung nên khóa cứng sẽ chặn cả vòng chơi.
- **(21/10) Trả góp xe được vay tới 100% giá (0 đồng trả trước), nhà tối đa 70%, cần điểm tín dụng ≥ 600** — thử chạy 6 tháng thấy người chơi không thể gom 10% trả trước xe máy trước tháng 4, nên case cố định/thả nổi không xảy ra; "trả góp 0 đồng" có thật ở VN.
- **(21/10) Lãi suất mô phỏng: NHTW 4% → 5% (tháng 5) → 6% (tháng 7); vay thả nổi = NHTW + 6,5%; cố định 12,5%; tiết kiệm = NHTW + 1,6%; thẻ tín dụng 30%/năm; lạm phát 3,5%/năm** — gần đúng diễn biến 2022 để bài M2 có hậu quả thật. ⚠️ Cần kiểm chứng/ghi nguồn trước khi nộp.
- **(21/10) Bảng giá nhà/xe** (phòng trọ 2,5tr/tháng, căn hộ thuê 5,5tr, xe máy 35tr, căn hộ 1,6 tỷ, ô tô nhỏ 550tr…) và **7 bạn NPC có quỹ đạo tài sản theo lối sống** (người liều mất 65% ở tháng 5 khi quỹ sụp…) — số "gần thật", chỉnh khi cân bằng game (13.4 cho phép).
- **(21/10) Mỗi tháng có 30% khả năng gặp sự cố (ốm 4tr / hỏng điện thoại 3tr) từ tháng 3** — để quỹ khẩn cấp và bảo hiểm có ý nghĩa (6.3 "sự kiện bất ngờ").
- **(24/10) P5 không nêu mức giảm trừ gia cảnh / biểu thuế TNCN cụ thể, chỉ nói "lương 10tr chưa phải nộp thuế"** — luật thuế TNCN đang được sửa (2025–26), Claude không tra được bản mới nhất; ⚠️ nhóm bổ sung số hiện hành. Tỷ lệ doanh nghiệp đóng 21,5% trong phần Đào sâu ghi "giả định".
- **(23/10) Số liệu thật dùng trong M1/M3 lấy từ trí nhớ của Claude, chưa tra lại được (mạng phiên bị chặn)**: CPI VN 2007–2013, Zimbabwe 231 triệu % (7/2008), GDP VN 2019–2024 — ⚠️ nhóm đối chiếu Tổng cục Thống kê trước khi nộp.
- **(23/10) Khủng hoảng làm đẹp là 1929 (không phải 2008), tiền tính bằng USD** — 6.4 mô tả 1929 có hình ảnh thị trấn rõ nhất (bảng giá đỏ, xếp hàng rút tiền, cửa hàng tắt đèn, người thất nghiệp) và có câu chuyện đổi vai Thống đốc rất mạnh (Fed 1930–33 vs 2008). 1973 và 2008 để "phòng sắp mở" theo thứ tự hoãn 13.6.
- **(23/10) Kịch bản 1929 do Claude soạn nháp** — ⚠️ nhóm kiểm số liệu & trích dẫn (Dow 381 → 41, ~9.000 ngân hàng, 25% thất nghiệp, Fed tăng lãi 10/1931, FDIC 1933, câu nói của Bernanke 2002) và mô hình "nếu như" của vai Thống đốc (chỉ để so sánh, ghi rõ trên màn hình).
- **(22/10) Thêm dạng bài `dial` cho M2 thay vì ghép bằng thanh trượt có sẵn** — 13.2d ghi rõ "Xoay núm lãi suất: thấy lạm phát, thất nghiệp và khoản trả góp của chính bạn thay đổi" và M2 trùng vòng demo; mô hình: lạm phát = 7 − 0,8·(r − 4), thất nghiệp = 2,4 + 0,6·(r − 4), vay nhà 1 tỷ/20 năm lãi = r + 4%.
- **(22/10) Chế độ Doanh nghiệp gắn vào cùng "cuộc sống" (không phải màn chơi riêng): mở quán khi có ≥ 10tr vốn tự có; tab Chơi có lối tắt kịch bản "đã để dành 30tr"** — 13.4 "giai đoạn" và 13.2d ② "một câu chuyện xuyên suốt", vẫn quay video nhanh được.
- **(22/10) Thông số quầy: vốn 50tr, định phí 16tr/tháng, biến phí 15k/ly, nhu cầu 1.750/1.300/900 ly ở giá 25/35/45k, nhà đầu tư 40tr = 45%, vay KD cố định 11% / thả nổi NHTW + 5%, thấu chi 20%, phá sản khi thấu chi > 30tr** — số "gần thật" cho quầy nhỏ; ⚠️ nhóm hỏi 1 chủ quán thật để chỉnh.
- **(22/10) 4 case kinh doanh do Claude soạn nháp** (`BIZ_CASES` trong `src/content/cases.ts`) — ⚠️ nhóm duyệt lời & số liệu (dầu 1973 tăng ~4 lần…).
- **(21/10) P1/P2/P3: bài cũ giữ id (`p-budget`, `p-inflation`) để không mất tiến độ người dùng; phần tranh luận lạm phát vs tỷ giá bỏ khỏi P3 chờ M1** — 13.2d/13.2e.
- **(21/10) Phí trễ hạn BNPL 60.000₫/kỳ, lãi thẻ 30%/năm trong P2 là số minh họa** (ghi rõ "giả định" trong bài) — mỗi ví/ngân hàng mỗi khác; ⚠️ nhóm kiểm một sản phẩm thật để dẫn nguồn.
- **(21/10) 5 case tháng do Claude soạn nháp** — ⚠️ quy định cuộc thi: nhóm phải đọc, sửa lời, kiểm số liệu (Madoff ~65 tỷ USD, 150 năm tù; Madrian & Shea 37% → 86%; Fed 2022–23; NHNN tăng lãi 2 lần cuối 2022) trước khi nộp.
- **(20/10) Cửa có thể vào = nút hành động góc phải dưới hiện khi đứng gần (≤ 1,9 m); trong nhà/quầy hiện khung thoại kem + nút "Học ngay" nếu chưa học bài mở khóa nơi đó** — 13.3 yêu cầu nút hành động có nhãn; gắn mỗi nơi với cột "Game" của 13.2d để học xong có lý do vào game (13.2b-7).

## Phiên 5 (tiếp) — 24–26/10: bài P4, P5 ✅ (đã push) → mảng Cá nhân đủ 5/5 bài
- **P4 "Làm sao biết mình sắp bị lừa?"** (`p-scam`): tin nhắn "việc nhẹ 500k/ngày" → **đoán** 1tr với lãi 5%/tuần sau 1 năm (12,6tr) → cơ chế Ponzi → **bấm cờ đỏ** trong đoạn chat tuyển CTV → phân loại tin nhắn an toàn/lừa (OTP, mật khẩu game, trúng thưởng, "thầy chứng khoán") → **chuyện thật** Madoff + trái phiếu 2022 (ẩn danh) → **bẫy** "bạn mình rút được tiền rồi" → trùm cuối → Dùng ngay. Đào sâu: toán kim tự tháp (6ⁿ), 2%/tuần.
- **P5 "Lương 10 triệu, cầm về được bao nhiêu?"** (`p-salary`): **đoán** thực nhận (8,95tr) → **phiếu lương** từng dòng → tính lương 15tr + quỹ khẩn cấp → thuế TNCN lũy tiến từng phần (không nêu số giảm trừ cụ thể) → chọn bảo hiểm nên mua trước → **bẫy** gộp vs thực nhận (12tr gộp < 11tr thực nhận) → trùm cuối (làm thêm không bảo hiểm) → Dùng ngay. Đào sâu: chi phí thật của một nhân viên, bảo hiểm là chia sẻ rủi ro.

## Phiên 5 (tiếp) — 23/10: bài M1, M3 ✅ (đã push) → **xong toàn bộ việc 23/10**
- **M1 "Lạm phát đến từ đâu?"** (`m-inflation`, bài mới): thị trấn trà sữa gấp đôi tiền (**đoán** giá → gấp đôi) → CPI là rổ hàng có trọng số → **tự xây rổ CPI của bạn** (tính lạm phát riêng 10%) → phân loại cầu kéo / chi phí đẩy / tiền quá nhiều → **chuyện thật** CPI Việt Nam 2007–2013 (2008 ~23%, 2011 ~18,6%) + Zimbabwe 2008 → **bẫy** lạm phát ≠ VND mất giá so với USD (7/46; chuyển từ P3 cũ, kèm bài phân loại) → trùm cuối "sao không in thật nhiều tiền" → Dùng ngay. Đào sâu: MV = PY (tính), chi phí đẩy và thế khó của NHTW.
- **M3 "Đọc một bản tin kinh tế trong 60 giây"** (`m-news`, bài mới): tít báo ví dụ (GDP, PMI, CPI) → **đoán** tăng trưởng 2023 (5,05%) → nối con số ↔ câu hỏi → chu kỳ kinh tế → giải mã "PMI xuống 47" → **chuyện thật** GDP Việt Nam 2019–2024 (COVID) → **bẫy** "GDP tăng = ai cũng giàu hơn" → tính tăng trưởng thực & bình quân đầu người → trùm cuối tóm tắt tin cho bạn → Dùng ngay. Đào sâu: GDP không đo gì, chỉ báo đi sau, chỉ số giảm phát GDP.
- Tít báo trong M3 là ví dụ tự đặt, có ghi chú trên màn hình.

## Phiên 5 (tiếp) — 23/10: Khủng hoảng 1929 có đổi vai ✅ (đã push)
- **Vào**: tab Chơi → Bảo tàng Khủng hoảng → phòng 1929 **"Vào phòng"** (hoặc thẻ chế độ **Thống đốc NHTW**), hay đi bộ tới **Bảo tàng** trong thị trấn. Phòng 1973 và 2008 hiện "đang dựng — sắp mở" (đúng thứ tự hoãn 13.6).
- **Hai vai** (`src/content/crisis1929.ts`, `src/ui/crisis.ts`): **Người dân** ($1.000 tiền mặt + $1.000 cổ phiếu; 4 mốc: 9/1929 bùng nổ & mời vay ký quỹ → 30/10/1929 sau Thứ Ba Đen tối → 12/1930 xếp hàng rút tiền → hè 1932 đáy, giảm lương) và **Thống đốc Fed** (3 mốc: cứu hay để ngân hàng đổ → 1931 tăng lãi giữ vàng? → 1932 bơm tiền / bảo hiểm tiền gửi). **Không spoil**: tiêu đề mỗi mốc chỉ nói điều người thời đó biết; chọn xong mới chấm (!!…??) kèm lý do; cuối cùng mới có **"Chuyện gì đã thực sự xảy ra"** (Dow −89%, ~9.000 ngân hàng đổ, thất nghiệp ~25%, FDIC 1933, lời xin lỗi của Bernanke 2002 và năm 2008 làm ngược lại), **góc nhìn 4 bên**, kết quả của bạn (người dân: tài sản 1933 so với "giữ nguyên"; Thống đốc: thất nghiệp & số ngân hàng đổ theo mô hình "nếu như" so với thực tế). Nút **chơi lại ở vai kia**.
- **Thị trấn đổi theo câu chuyện** (`Town.setEra`): ảnh **sepia + viền tối** kiểu ảnh cũ; **bảng giá ở Sàn giao dịch chuyển sang DOW 1929** (xanh khi bùng nổ, đỏ và rơi khi sụp); cảnh rút tiền: **7 người dân xếp hàng trước Ngân hàng**; suy thoái: **trời xám, cửa hàng tắt đèn**. Mô phỏng tiền của người dân: giá cổ phiếu theo chỉ số, **gọi ký quỹ** bán ép, ngân hàng của bạn đóng cửa năm 1931 (lấy lại một nửa).

## Phiên 5 (tiếp) — 22/10: bài B1, B3, B4 ✅ (đã push) → **xong toàn bộ việc 22/10**
- **B1 "Bán một ly trà sữa lời bao nhiêu?"** (`c-breakeven`, viết lại theo 6 nhịp): thêm **đoán** lời mỗi ly (chỉ ~1.000₫), bài **chọn mặt bằng** (bẫy "doanh thu cao = lời nhiều": trung tâm thương mại đông nhất mà lỗ, quầy trong hẻm lời nhất), **Dùng ngay** + mở khóa quầy trong game. Giữ phần cố định/biến đổi, báo cáo mini, hòa vốn, đòn bẩy hoạt động, Đào sâu.
- **B3 "Lời mà vẫn phá sản — chuyện gì vậy?"** (`c-cash`, bài mới): hợp đồng 800 ly trả sau 60 ngày → **đoán** tiền mặt cuối tháng 2 (−4tr) → **hai báo cáo đặt cạnh nhau** (lãi +17tr, dòng tiền −7tr: tìm dòng tạo chênh lệch) → giữ/cạn tiền mặt → biểu đồ lợi nhuận cộng dồn vs tiền mặt → bẫy "có lãi thì không hết tiền" → 3 báo cáo tài chính → trùm cuối (đơn trả sau 90 ngày) → Dùng ngay. Đào sâu: chu kỳ chuyển đổi tiền mặt (tính), tăng trưởng quá nóng.
- **B4 "Vay ngân hàng hay gọi vốn kiểu Shark Tank?"** (`c-funding`, bài mới): 600tr vay 11%/5 năm vs 600tr đổi 30% → **đoán** định giá (2 tỷ) → nợ vs vốn góp → **tính** trả góp 13,05tr, lãi ~183tr vs 30% của 10 tỷ = 3 tỷ → phân loại đặc điểm nợ/vốn → **chuyện thật** Steve Jobs rời Apple 1985 + vay thả nổi 2022–23 → bẫy "gọi vốn là tiền miễn phí" → trùm cuối → Dùng ngay. Đào sâu: đòn bẩy tài chính & ROE (tính), startup nên dùng vốn gì.
- Thêm kiểu chữ phụ `.qsub` cho câu hỏi có nhiều số liệu.

## Phiên 5 (tiếp) — 22/10: bài M2 + dạng bài mới "núm Thống đốc" ✅ (đã push)
- **Dạng bài thứ 17 `dial`** (`src/lesson/player.ts`, kiểu `DialModel` trong `types.ts`): núm lãi suất (SVG + thanh trượt, kéo là cập nhật ngay) và 3 ô: **lạm phát năm sau**, **thất nghiệp** (xanh/đỏ theo mục tiêu) và **khoản trả góp thả nổi của nhà bạn**. Mô hình tuyến tính đơn giản, ghi rõ trên màn hình là mô hình minh họa. Đúng khi cả hai mục tiêu đạt.
- **M2 "Ngân hàng trung ương — người cầm vòi nước"** (`m-centralbank`, bài mới, mảng Vĩ mô): móc câu Fed 2022 → **đoán** khoản trả nhà 1 tỷ khi lãi 8% → 10% (9,65tr; bẫy 13% khảo sát) → sắp xếp **cơ chế truyền dẫn** → **núm Thống đốc** (lạm phát 7% → ≤ 4,5%, thất nghiệp ≤ 5%) → **chuyện thật** biểu đồ lãi Fed vs lạm phát Mỹ 2022–23 + NHNN 4% → 5% → 6% → **bẫy** vay thả nổi → ai vui/ai lo khi tăng lãi → **trùm cuối** giải thích vì sao NHTW "cố tình" làm vay đắt → **Dùng ngay** + mở khóa. Đào sâu: quy tắc Taylor (tính), độ trễ chính sách.

## Phiên 5 (tiếp) — 22/10: Chế độ Doanh nghiệp — bước 1 ✅ (đã push)
- **Tab Chơi → "Doanh nghiệp của tôi" → Chơi ngay**: kịch bản sẵn "25 tuổi, đã để dành 30tr" (nếu chưa có cuộc sống), bay xuống, đứng trước **Quán trà sữa của bạn**, mở bảng **Mở quầy trà sữa đầu tiên**. Ai đang chơi "Cuộc sống của tôi" thì đi tới quán khi đủ 10tr vốn tự có.
- **Huy động vốn (B4)**: quầy cần 50tr (thiết bị 30 + cọc & sửa sang 12 + vốn lưu động 8), tự bỏ 10tr; 40tr còn lại: vay **cố định 11%** / vay **thả nổi NHTW + 5%** (36 tháng) / **nhà đầu tư góp 40tr lấy 45%**. Mở quán → trang phục **tạp dề + mũ xanh**, nhà/xe hạng "Chủ quán" mở khóa.
- **Mỗi tháng ở quán** (`src/game/biz.ts`): chọn **giá 25k / 35k / 45k** (mỗi giá hiện lãi góp/ly và **điểm hòa vốn**), khách yêu thích tăng/giảm theo giá; 2 tháng đầu vắng (lỗ nhẹ); 1 quyết định từ `BIZ_CASES` (hợp đồng lớn trả sau 60 ngày — B3; giá nguyên liệu tăng 20% — chi phí đẩy/1973; đối thủ giảm giá 30% — B2; máy pha 20tr vay hay tiền mặt — B4), cấp doanh nghiệp cần nước đi **! hoặc !!**.
- **Cuối tháng**: báo cáo **lãi/lỗ** (doanh thu, biến phí, định phí, khấu hao, lãi vay, lương bạn → lợi nhuận) **và dòng tiền** (tiền khách trả, thu nợ hợp đồng, chi ra → tiền mặt tăng/giảm). Thiếu tiền → **thấu chi 20%/năm**; thấu chi > 30tr → **phá sản** (bán thiết bị 40%, nợ còn lại chuyển sang bạn — hộ kinh doanh chịu trách nhiệm vô hạn). Lương chủ quán = quán trả được bao nhiêu (tối đa 8tr) thay cho lương cũ. Giá trị phần quán của bạn cộng vào tài sản ròng.
- Đã sửa: khung thoại mở khi bảng đang mở thì bị bảng che.

## Phiên 5 (tiếp) — 21/10: bài P1, P2, P3 theo khung 6 nhịp (13.2c) ✅ (đã push)
- **P1 "Tiền tiêu vặt của mình biến đi đâu hết?"** (`p-budget`, viết lại): móc câu tuần của Lan (500k → 20k) → **đoán** % tiền vào khoản nhỏ (54%) → **sổ chi tiêu tuần của Lan**, bấm rò rỉ → Cần · Muốn · Tương lai + chia hũ → trà sữa cả năm → **chuyện thật** Madrian & Shea (biểu đồ 37% → 86%) → **bẫy** "ít tiền thì không cần ngân sách" + bài đăng "cả lớp có rồi" (20/46 khảo sát) → **trùm cuối** khuyên em (giải thích) → **Dùng ngay** (3 việc) + mở khóa Sổ chi tiêu trong game. Đào sâu giữ phần cũ + 1 câu mới.
- **P2 "“Trả sau 0%” có thật sự 0 đồng?"** (`p-bnpl`, **bài mới**): móc câu tai nghe 4 kỳ → **đoán** số tháng trả hết nợ thẻ 5tr khi chỉ trả tối thiểu (40 tháng) → BNPL vs thẻ → **thanh trượt** trả bao nhiêu/tháng để hết nợ trong 12 tháng → phí trễ hạn (tính) → phân loại điều làm điểm tín dụng tăng/giảm/không liên quan → **chuyện thật** khảo sát nhóm (6/46 đã dùng trả sau) → **bẫy** "điểm tín dụng = tiền tiết kiệm" (7/46) → tài sản thế chấp → **trùm cuối** khuyên bạn mua điện thoại 9tr → **Dùng ngay** + mở khóa thẻ & điểm tín dụng. Đào sâu: APR vs lãi thực trả, quy tắc 72 cho nợ, BNPL kiếm tiền từ đâu.
- **P3 "Vì sao 100 nghìn của mình đang teo dần?"** (`p-inflation`, viết lại): móc câu trà sữa 25k → 45k → **đoán** sức mua 100k sau 10 năm (67.600₫) → video "Quả cầu tuyết" → **biểu đồ 3 hũ** (ống heo / tiết kiệm 6% / quỹ chỉ số, theo sức mua) → lãi suất thực → **chuyện thật** VN 2008 (~23%) → **bẫy** lãi kép ≠ lãi đơn (12/46) → quy tắc 72 → **trùm cuối** quỹ khẩn cấp để đâu → ưu tiên tài chính → **Dùng ngay** + mở khóa sổ tiết kiệm. Phần *nguồn gốc lạm phát & bẫy USD* đã bỏ khỏi P3 (chuyển sang M1, 13.2e).
- `scripts/playthrough.cjs` thêm P2. VI và EN: mọi bước có chấm điểm đều đúng.

## Phiên 5 (tiếp) — 21/10: Chế độ Cá nhân + nhà & xe — bước 1 ✅ (đã push)
- **Tab Chơi → "Cuộc sống của tôi" → Chơi ngay** (bay xuống thị trấn, Alti Lion giới thiệu, bấm Bắt đầu). Bạn là chính mình 22 tuổi, lương 10tr gộp / **8,95tr thực nhận**; trang phục đổi sang nhân viên. HUD: tháng · việc tiếp theo · tâm trạng; nút **biểu đồ** = "điện thoại" (tài sản ròng chi tiết + xếp hạng).
- **Vòng lặp tháng** (`src/game/life.ts` logic thuần, `src/ui/life.ts` màn hình):
  - **Công ty**: 1 quyết định/tháng từ `src/content/cases.ts` (5 case theo 6.5: Lương đầu tiên — Madrian & Shea · Quỹ "không bao giờ lỗ" — Madoff · "Sản phẩm tiết kiệm" tại quầy — VN 2022 **ẩn danh** · Trả góp xe cố định/thả nổi — 2022 · Mua trước trả sau 0%). Chấm kiểu cờ vua (!!…??), "Góc nhìn từng bên", "Chuyện gì đã thực sự xảy ra". Hết case → tháng bình thường.
  - **Chợ**: chọn mức chi tiêu (Tiết kiệm / Cân bằng / Thoải mái: nhu cầu + mong muốn, ảnh hưởng tâm trạng; giá tăng theo lạm phát 3,5%/năm).
  - **Ngân hàng**: gửi/rút, **tự động tiết kiệm** 0–30%, khoản vay (lãi hiện tại, trả/tháng), trả nợ thẻ, **điểm tín dụng** 300–850 (giải thích: không phải tiền tiết kiệm), lãi suất NHTW.
  - **Phòng khám**: bảo hiểm 180k/tháng (trả 80% viện phí).
  - **Nhà & xe** (tòa mới cạnh ngân hàng): phòng trọ / căn hộ thuê; xe đạp, xe máy (mua tiền mặt hoặc trả góp cố định/thả nổi); căn hộ, nhà phố, biệt thự, ô tô, xe thể thao **khóa theo giai đoạn nghề** (13.4-4). Alti Lion **cảnh báo** khi món mới tốn > 30% lương/tháng (13.4-2). Xe mua về **đỗ trong vườn nhà**.
  - **Nhà → Kết thúc tháng**: báo cáo từng dòng (lương, tự động tiết kiệm, nhu cầu, mong muốn, thuê nhà, điện nước/xe, bảo hiểm, trả góp, lãi tiết kiệm, **xe mất giá**, sự cố ngẫu nhiên ốm/hỏng điện thoại, quỹ lừa đảo sụp, trái phiếu đóng băng, rút quỹ khẩn cấp, thiếu tiền → quẹt thẻ 30%/năm + trừ điểm tín dụng), tài sản ròng ±, **hạng / 8** so với 7 bạn NPC, lời khuyên của Alti Lion theo chuyện vừa xảy ra.
- **Thị trường mô phỏng**: lãi suất NHTW 4% (tháng 1–4) → 5% (5–6) → 6% (từ 7) như NHNN cuối 2022; vay thả nổi = NHTW + 6,5%; cố định 12,5%; tiết kiệm = NHTW + 1,6%. Tháng tăng lãi có tin nóng + lời nhắc bẫy "vay thả nổi khi lãi suất tăng".
- **Tài sản ròng** = tiền mặt + tiết kiệm + giá trị thị trường đồ đang có + quỹ/trái phiếu (giá trên giấy, đến khi sụp) − nợ. `S.game.history` nhận 1 điểm mỗi tháng → biểu đồ ở trang Tôi.
- Không khóa cứng (3.2): nơi nào chưa học bài liên quan hiện thẻ "Nên học: P1/P3/P5 … Học ngay".
- Đã sửa lỗi: khung thoại do hệ thống mở (không qua nút hành động) mà bấm Esc/E thì thoát luôn thị trấn.

## Phiên 5 — 20/10: Thị trấn low-poly (mục 13.3) ✅

### Bước 2 — 7 khu, NPC, ngày–đêm, bản đồ, tủ đồ ✅ (đã push)
- **Bản đồ ~96 × 70 m, 7 khu** (`BUILDINGS`/`ZONES` trong `src/game/world.ts`, mỗi nơi gắn bài mở khóa theo cột "Game" 13.2d): Khu dân cư (nhà có vườn rào, công ty đầu tiên, phòng khám & bảo hiểm, ngân hàng, chợ) · Bảo tàng Khủng hoảng (băng rôn 1929/1973/2008) · Phố kinh doanh (quán trà sữa có ly khổng lồ trên mái, 2 lô đất trống "bán", kho nhà cung cấp) · Khu tài chính (sàn giao dịch có **bảng giá chạy** — chỉ số mô phỏng "VNX", tiệm vàng & ngoại tệ, tòa quỹ kính) · **NHTW & Tòa tin tức** (khu thứ 7) · Trung tâm hành chính (tòa thị chính mái vòm + cờ, Bộ Tài chính, trường học) · Cảng biển (bãi cát, cầu tàu, tàu hàng, cần cẩu, container, phao, sóng biển).
- Quảng trường có ghế đá; vách đá bậc thang 2 tầng ở mép bản đồ (trang trí); cây tròn/thông/dừa; không đặt cây ngay phía nam đường để không che nhân vật.
- **7 NPC "bạn cùng lớp"** (`src/game/npc.ts`) mỗi người một lối sống tài chính (tiêu xài, tiết kiệm, liều, chủ quán, nhà đầu tư, cẩn thận, mê nạp game): đi dọc đường, dừng lại quay về phía bạn khi đến gần, nút "Nói chuyện với …" → một câu về cách họ tiêu tiền. Sẽ là bảng xếp hạng net worth ở 21/10.
- **Trời theo giờ thật** (sáng – trưa – hoàng hôn hồng cam – đêm xanh tím); ban đêm **cửa sổ và đèn đường sáng**, có vệt sáng dưới đèn. Thử giờ khác bằng `?hour=20` trên URL (dùng khi quay video).
- **Minimap** góc trái trên (bạn = mũi tên đỏ, NPC = chấm tím), chạm (hoặc phím M) → **bản đồ lớn** có tên 7 khu. **Biển tên khu** hiện khi bước sang khu khác; Alti Lion đổi ngữ cảnh theo khu.
- **Tủ đồ** ở nhà (Vào nhà → Thay đồ): màu da, màu tóc, kiểu tóc (ngắn/dài/búi), áo, quần; lưu vào `S.game.look`; trang phục vẫn tự đổi theo nghề.
- **Ao có thác** sau Phố kinh doanh: gò đá 2 bậc, suối trên đỉnh đổ 2 ngọn thác nhỏ (quay về phía camera) xuống ao có lá sen, đá viền, **cá thỉnh thoảng nhảy lên**.
- Bướm bay trên đồng cỏ, bụi dưới chân khi chạy; Khoai tây: ít cây/NPC hơn, không bướm; giảm chuyển động: NPC đứng yên, không gió.
- Đi gần nơi có bài: đã học → "Đã mở: … (phần chơi có từ ngày …)"; chưa học, bài đã có nội dung → nút **Học ngay** mở bài; bài chưa có → "bài sắp có · ngày".

### Bước 1 — bản tối thiểu chạy được ✅ (đã push)
- `src/game/kit.ts`: bộ dựng khối gộp mọi vật tĩnh thành **1 mesh tô màu theo đỉnh** (vài draw call cho cả thị trấn), shader **thế giới cong** (`bend()`: xa camera thì mặt đất cong xuống) + **gió** (tán cây, cỏ, hoa lay), bóng tròn mềm.
- `src/game/avatar.ts`: nhân vật chibi dựng bằng khối (đầu ~40%, mắt bầu dục có chấm sáng, má hồng, tóc mũ chỏm + mái), **trang phục theo giai đoạn** (học sinh/nhân viên/chủ quán/ông trùm), thở khi đứng, vung tay chân + nhún khi đi.
- `src/game/world.ts`: khu **Cá nhân** + quảng trường có đài phun nước: Nhà của bạn (vườn rào gỗ), Ngân hàng, Chợ; đường đất, cây tròn/cây thông, bụi, hoa, cỏ lăn tăn, vòng rừng quanh mép.
- `src/game/town.ts`: camera cao bám nhân vật (mượt), cảnh "rơi" từ trên cao xuống khi đáp, va chạm (nhà, cây, đài phun nước, hàng rào, mép thế giới) có trượt dọc tường.
- `src/ui/town.ts` + `src/styles/town.css`: **joystick** góc trái dưới (chạm/chuột), **WASD/mũi tên** (Shift chạy, E/Space vào, Esc thoát), **nút hành động** góc phải dưới, **khung thoại kem bo tròn chữ hiện dần**, **HUD net worth**, nút thoát; **ẩn thanh 5 tab**, **nút Alti Lion lên góc phải trên** (`.phone.ingame`). Thời tiết vẫn vẽ vào `#wxTown`. Không có chạm-để-đi.
- Kiểm tra: `npm run build` sạch; `node scripts/playthrough.cjs vi` đúng như trước; Playwright 375×812: 5 tab, bài học, vào thị trấn, kéo joystick, đứng gần cửa → nút "Vào …", E → khung thoại, thoát → về tab Chơi; không lỗi console.


## Phiên 4e — bỏ thanh cuộn, chuyển tab mượt (pane giữ sẵn DOM) ✅

Nhóm đo trên altifi.vercel.app (375×812): mỗi `A.go()` chặn luồng chính 70–200ms (render lại toàn bộ HTML + sao chép DOM cho lớp ghost + đọc offsetWidth/Height), tab Học đứng yên chỉ ~27 fps (Galaxy vẽ mọi khung, pixel ratio 2).

### Đã làm
1. **Ẩn thanh cuộn** trong `.phone` (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`), vẫn cuộn bằng tay/chuột.
2. **Mỗi tab một pane giữ sẵn DOM** (`index.html`: 5 `<section class="pane screen" data-tab>` trong `#screenWrap`; `src/ui/shell.ts`):
   - Pane tự cuộn, nhớ vị trí cuộn.
   - Chỉ render lần đầu mở tab hoặc khi dirty: `render()` sau mỗi thay đổi dữ liệu gọi `markDirty()` cho mọi tab và chỉ dựng lại pane đang hiện.
   - `go()` chỉ đổi `.on` — không gọi `render()` trừ khi pane mới dirty. Đã xóa `ghostOut`, `.screen-ghost` và các lệnh ép layout.
   - Thanh nav: dựng một lần cho mỗi ngôn ngữ; đổi tab chỉ toggle `.on` + `--i` cho navpill. Icon nảy bằng class `pop`, bỏ khi `animationend`, không ép reflow.
   - `#screen` cũ được thay bằng `curPane()` / `.pane.on` (`fx.pageAnim`, nền sao).
   - Id không trùng giữa các tab (đã soát: `gxHost`, `homeTalk` chỉ ở Học; `hsStage` chỉ ở Chơi; `wxTown` chỉ ở màn thị trấn).
3. **Fade-through** đúng thông số nhóm đưa (CSS trong `src/styles/galaxy.css`): pane cũ mờ 90ms; pane mới chờ 60ms, hiện 210ms, phóng 98% → 100% trong 300ms. `will-change` chỉ trong lúc chuyển (class `switching` trên `#screenWrap`, bỏ sau 420ms). Potato / giảm chuyển động: không transition.
4. **Giảm tải 3D:**
   - Galaxy và HomeSpace dừng vẽ ngay khi pane của chúng không còn `.on` (`hidden()` kiểm tra `.closest(".pane.on")`); quay lại tab thì `wake()` vẽ khung tiếp theo.
   - Bỏ `Galaxy.recede()` / `restore()`.
   - Tab Chơi: WebGL của hành tinh nhà dựng sau khi pane hiện xong (320ms) — lần đầu vào Chơi trước đây chặn ~910ms; camera tiến tới sau ~300ms.
   - Pixel ratio tối đa 1.5 (cả 2 cảnh 3D). Ngân hà khi đứng yên (không bay, kéo, quán tính) vẽ ~30 fps; thời gian hoạt ảnh tính theo khung đã vẽ nên không bị chậm lại.
   - Vị trí nhãn ngân hà dùng kích thước lưu từ ResizeObserver, không đọc layout mỗi khung.
5. **Thêm (phát hiện khi đo):**
   - **`backdrop-filter` (kính mờ) là thủ phạm lớn nhất** ở các tab có nền động: Khám phá 7 → 53 fps khi tắt nó, vì trình duyệt phải làm mờ lại nền đang chuyển động mỗi khung. Đã bỏ khỏi thẻ, nhãn, HUD trên nền động, thay bằng nền bán trong suốt đậm hơn (độ tương phản chỉ tăng). Theme "Ảnh của tôi" vẫn giữ (ảnh tĩnh).
   - Nền sao 2D được **vẽ sẵn lúc rảnh** sau khi mở app (`prewarmSky`). Lần đầu vào Khám phá trước đây chặn ~72ms, nay ~4ms.

### Đo (Playwright, 375×812, bản build production)
Máy chạy thử này không có GPU: WebGL được giả lập bằng CPU (SwiftShader), nên con số khi có cảnh 3D **không đại diện cho điện thoại thật**. Vì vậy đo 2 lần:
- **Tắt WebGL** (đo riêng đường DOM/CSS/2D của việc chuyển tab):
  - Đổi tab lặp lại chặn **0,3–0,6ms**, khung dài nhất 16,7–33ms.
  - Lần đầu mở tab (phải dựng pane) chặn 1,4–9,5ms. Riêng lần đầu vào Tôi có 1 khung 50ms.
  - Tab Học và Khám phá đứng yên **60 fps**.
  - Bấm liên tục: luôn dừng đúng tab cuối, chỉ 1 pane hiện với opacity 1 sau 300–400ms.
- **Bật WebGL (giả lập CPU):**
  - Đổi tab chặn **0,3–0,5ms** (trước: 70–200ms trên máy nhóm). Lần đầu vào Chơi **2,8ms** (trước: ~910ms).
  - Khoảng cách khung và fps bị giới hạn bởi WebGL giả lập: Học ~13 fps, Khám phá ~43 fps. Khi giấu cả canvas 3D lẫn lớp nhãn HTML thì Học lên 43 fps (không giấu gì: ~14 fps).
  - → **Cần nhóm đo lại trên điện thoại thật / altifi.vercel.app** cho 2 mục tiêu "không khung nào > 34ms" và "Học đứng yên ≥ 50 fps".
- Chức năng (đều đạt):
  - Nhớ vị trí cuộn từng tab.
  - Đổi ngôn ngữ và theme cập nhật mọi tab + nav.
  - Bong bóng Alti Lion trên Học vẫn chạy sau khi đi tab khác rồi quay lại.
  - Bay xuống thị trấn từ Chơi và quay lại.
  - Mở bài học rồi thoát → về đúng ngân hà.
  - Không còn lớp ghost.
  - `npm run build` không lỗi; `node scripts/playthrough.cjs vi` vẫn đúng hết; không lỗi console.

### Lưu ý
- Lỗi cũ ghi ở phiên 4d vẫn còn: bong bóng thoại trống khi thu nhỏ lên tầng 1 ngay trong tab Học (chỉ khởi động khi render lại).
- Nếu trên máy thật tab Học vẫn < 50 fps: bước tiếp theo là chỉ vẽ ngân hà khi dirty (tắt xoay hành tinh / lấp lánh lúc đứng yên), hoặc hạ pixel ratio xuống 1.25.

## Phiên 4d — sửa lỗi chuyển tab (do commit 21a6dac) ✅

Nhóm đo trên altifi.vercel.app ở khung 375×812 và gửi đúng diff sửa; đã áp dụng nguyên văn.
1. **Lớp ghost chiếm chỗ trong bố cục:** `.phone>.screen{position:relative}` (base.css) mạnh hơn `.screen-ghost{position:absolute}`. Ghost lại mang class `screen` (do sao chép className của #screen), nên nằm trong luồng bố cục và đẩy #screen mới xuống còn ~43px trong 0,2–0,34s → giật/chớp. Sửa: thêm selector `.phone>.screen-ghost` (cùng độ mạnh, nạp sau nên thắng) và `margin:0` (`src/styles/galaxy.css`).
2. **ghostOut xóa id trong các lớp 3D dùng lại:** `.gx` (ngân hà) và `.hs-host` (hành tinh nhà) được gắn lại ở lần vào Học/Chơi sau, nhưng id bên trong đã bị xóa → `#homeTalk` mất, bong bóng thoại Alti Lion ngừng chạy sau lần rời tab Học đầu tiên. Sửa: bỏ qua các phần tử nằm trong `.gx`, `.hs-host` (`ghostOut` trong `src/ui/shell.ts`).

**Kiểm tra** (Playwright, 375×812, lấy mẫu mỗi khung hình trong 400ms sau mỗi lần đổi tab):
- Học → Khám phá → Chơi → Tôi → Học: `.screen-ghost` luôn `position:absolute`, #screen luôn cao 674px (trước khi sửa: ~43px).
- Bong bóng Alti Lion: sau Học → Khám phá → Học, `#homeTalk` vẫn còn, có câu thoại, và 6 giây sau đã đổi sang câu khác.
- `npm run build` không lỗi; không lỗi console.

**Lỗi cũ phát hiện thêm (chưa sửa, không do 21a6dac):** bong bóng thoại chỉ được khởi động khi shell render lại cả tab. Nếu đang ở tab Học mà thu nhỏ từ tầng 2 lên tầng 1 trong ngân hà, bong bóng hiện nhưng trống cho đến lần render sau (vd đổi tab rồi quay lại). Cách sửa gợi ý: khi đổi sang tầng 1 trong `onLevel` (`src/ui/learn.ts`), gọi `startTalk("homeTalk", …)` như shell.ts đang làm.

## Phiên 4c — đợt sửa cuối của phiên: Night mặc định, tương phản Night, chuyển tab ✅

Đã ghi vào `ALTIFI_DESIGN.md`: mục **13.1b** điểm 7–9 và đoạn **"Chuyển tab"** trong phần motion của **10b**.

### Đã xong
1. **Nền ngân hà động** (Khám phá · Tôi · Cài đặt · Chơi): đã làm ở phiên 4b (`src/ui/skybg.ts`, commit `9736e27`), đúng đủ yêu cầu: sao lấp lánh lệch pha; 3 lớp parallax có dịch theo cuộn; tinh vân "thở" 20–30 giây; sao băng 10–20 giây; hành tinh nhỏ ở xa; mép và góc trên rõ, giữa nhạt; ≤ 30 fps; dừng khi ẩn; đứng yên khi Potato / giảm chuyển động. Đã kiểm lại, vẫn chạy đúng.
2. **Theme mặc định = Night** cho người dùng mới (`defaultSet` trong `src/core/state.ts`). Bản lưu đã có theme (Light, Night hay Ảnh của tôi) được giữ nguyên.
   - ⚠️ App không phân biệt được "đã tự chọn Light" với "đang để Light mặc định của bản cũ" (bản cũ không lưu cờ này). Vì vậy **mọi bản lưu cũ đang Light đều giữ Light**; chỉ người dùng mới (hoặc sau Reset demo) mới thấy Night.
   - **Kiểm tra tương phản Night** bằng script (Playwright lấy vị trí và màu từng dòng chữ; Python đo trên ảnh chụp thật): 12 màn — ngân hà (tầng hệ, tầng ngân hà, thẻ hành tinh), Danh sách, Khám phá, Tôi, Cài đặt, Chơi, màn bài học (2 bước), pop-up kết quả, khung chat Alti Lion. Lần đầu **48 chỗ dưới ngưỡng**, sau khi sửa còn **0** (chữ thường ≥ 4,5:1, chữ lớn ≥ 3:1; thấp nhất 4,7:1, riêng chữ lớn trang Tôi 3,6:1).
   - Cách sửa (chỉ trong Night, `src/styles/galaxy.css`):
     - Tách màu tím thành 2: `--pri` #A3A2FF cho **chữ** trên nền tối, `--pri-fill` #5A5AD6 cho **nền có chữ trắng** (nút, seg đang chọn, tin nhắn của mình, nút Gửi…).
     - Nút xanh lá `#17824F` và nút đỏ `#C23A3A` đậm hơn.
     - Chip mã bài, đầu mục mảng trong Danh sách: dùng sắc đậm của màu mảng.
     - Chữ nav đang chọn sáng hơn; nút bị khóa có chữ sáng hơn.
     - Chữ "ALTAIR" có viên nền riêng (cả 2 theme).
3. **Chuyển tab** (`go()` trong `src/ui/shell.ts`):
   - Bỏ trượt ngang cả trang. Nền đứng yên. Nội dung cũ được chuyển vào một lớp "bóng" tạm, mờ đi và dịch xuống 8px (160ms); nội dung mới hiện lên từ dưới 8px và phóng 98% → 100% (200ms).
   - Thanh điều hướng có **viên thuốc màu** trượt tới tab đang chọn (lò xo nhẹ 300ms); icon **nảy** khi bấm.
   - **Rời tab Học**: lớp ngân hà 3D thu nhỏ và mờ dần (320ms) trong khi camera lùi xa 1,7 lần, để lộ nền nhẹ bên dưới. Quay lại tab Học thì camera về đúng chỗ cũ.
   - **Vào tab Chơi**: camera tiến từ xa về hành tinh nhà (650ms).
   - Chỉ animate transform/opacity (camera là WebGL). Potato / giảm chuyển động → đổi tab tức thì: không có lớp bóng, viên thuốc không trượt.
   - Màn con (bài học, hồ sơ, trang con Cài đặt) vẫn trượt như cũ.

### Kiểm thử
`npm run build` không lỗi; `node scripts/playthrough.cjs vi` vẫn đúng hết (2 bước `predict` báo WRONG là đúng thiết kế). Playwright:
- Người dùng mới → Night; bản lưu Light → giữ Light.
- Khi đổi tab, lớp bóng được tạo rồi tự xóa; viên thuốc nav đổi vị trí.
- Quay lại tab Học vẫn ở tầng 2, nhãn hiện đủ.
- Không lỗi console.

### Lưu ý
- Ở **Light** vẫn còn vài chỗ tương phản thấp cùng loại (chữ trắng trên nút xanh lá, chip màu mảng sáng). Đợt này chỉ sửa Night theo yêu cầu; muốn đồng bộ thì áp cùng các quy tắc cho Light.
- Hiệu ứng đổi tab chưa được xem trên điện thoại thật.

## Phiên 4b — nền ngân hà nhẹ có chuyển động (Khám phá · Tôi · Cài đặt · Chơi) ✅

**Vì sao:** nhóm xem lại thấy nền gần như đứng yên và quá mờ (chỉ còn màu tím nhạt). Vẫn giữ bản nhẹ: **1 canvas 2D, không Three.js** (`src/ui/skybg.ts`).

### Đã xong
- **Lớp tĩnh** (vẽ 1 lần theo theme/kích thước): nền trời (Light: tím lavender đậm hơn ở trên → hồng đào; Night: tím than), bụi nhánh xoắn mờ.
- **Mỗi khung hình (≤ 30 fps):**
  1. **Sao lấp lánh:** mỗi sao một nhịp và một pha riêng. Sao sáng nhất có tia 4 cánh; ở Light sao có quầng tím để nổi trên nền nhạt.
  2. **3 lớp sao trôi ngang** với tốc độ khác nhau (xa 1,2 · giữa 2,6 · gần 4,8 px/s). **Khi cuộn trang**, lớp gần dịch nhiều hơn lớp xa (3% / 7% / 14% quãng cuộn).
  3. **7 tinh vân** theo màu 6 mảng + tím thương hiệu, nằm ở mép và góc. Mỗi tinh vân "thở" (đậm nhạt + xoay/phóng rất nhẹ) theo chu kỳ riêng 20–30 giây.
  4. **Sao băng** 10–20 giây một lần, vị trí và hướng ngẫu nhiên.
  5. **3 hành tinh nhỏ ở xa** trôi ngang rất chậm (một hành tinh có vành).
  6. **Mép và phía trên rõ, giữa nhạt:** sao thưa và mờ dần vào giữa; có **lớp màn mờ** sau cột chữ và sau khối tiêu đề trang (góc trên phải vẫn giữ màu).
- **Hiệu năng:** giới hạn 30 fps. Vòng lặp **tự dừng** khi sang tab Học, khi mở bài học hay màn thị trấn, hoặc khi app chạy nền; chạy lại khi quay về. Bật **Potato Mode hoặc "giảm chuyển động"** → chỉ vẽ **1 khung tĩnh**, không trôi, không lấp lánh, cuộn trang cũng không dịch lớp sao. Bỏ animation CSS cũ.
- **Tương phản:** chữ đặt thẳng trên nền trời đổi màu (Light `#2E2A57`, Night `#EEEBFF`). Đo trên ảnh chụp thật (lấy phần nền tối nhất sau phụ đề): Khám phá / Cài đặt / Tôi / Chơi đạt **≥ 5,2:1** ở Light và **≥ 6,9:1** ở Night.

### Kiểm thử (Playwright, khung 375px)
- Ảnh nền đổi giữa 2 lần chụp cách 2 giây (Light và Night). Đếm số khung vẽ: ~21–24 fps trong headless (≤ 30).
- Ở tab Học: 0 khung vẽ trong 1,5 giây.
- Potato và giảm chuyển động: ảnh nền không đổi, 0 khung vẽ.
- Không lỗi console.

### Lưu ý
- Vẫn **chưa đo trên điện thoại thật** (pin, nhiệt). Nếu máy yếu bị nóng, có thể hạ xuống 20 fps (hằng số `33` ms trong `start()`).
- Khi cuộn rất dài, sao lớp gần quay vòng theo chiều dọc. Vì vậy mật độ "dày ở mép, thưa ở giữa" chỉ đúng tuyệt đối ở đầu trang.

## Phiên 4 — chỉnh theo nhóm duyệt (mục 13.1b) ✅

**Kết quả:** đã ghi quyết định vào `ALTIFI_DESIGN.md` **mục 13.1b**. `npm run build` không lỗi; `node scripts/playthrough.cjs vi` vẫn đúng hết (2 bước `predict` báo WRONG là đúng thiết kế, không chấm điểm). Đã kiểm thử bằng Playwright ở khung 375px: chòm sao hoàn chỉnh khi xong đủ 4 bài Vĩ mô (kể cả bài "Sắp có") → pill ✦ + huy hiệu `dom-macro`; Bỏ qua thẻ test → viên thuốc, chạm → mở lại; tab Chơi → bay xuống thị trấn (có thời tiết); màn bài học không còn họa tiết/thời tiết. Đã chụp tầng ngân hà, tầng hệ, Khám phá, Tôi ở Light và Night.

### Đã xong
1. **Chòm sao (13.1b-1):** ở tầng ngân hà mỗi hệ là một chòm sao: mỗi hành tinh là một ngôi sao, **bài xong thì sao sáng**, đường nối mờ. Xong **mọi bài của mảng, tính cả bài "Sắp có"** → đường nối vàng, cả chòm nhấp nháy, hào quang, pill có ✦, nhận huy hiệu mảng. `domainDone` (`src/content/badges.ts`) giờ tính đủ mọi bài (huy hiệu mảng đã nhận ở bản cũ vẫn được giữ trong save).
2. **Tầng ngân hà (13.1b-2):** cả ngân hà là elip kéo dài theo chiều dọc (`GZ = 1.55`), 6 hệ trải đều dọc 3 nhánh (bán kính 22 → 82, mỗi nhánh 2 hệ) → phủ gần kín màn hình điện thoại. Camera tự canh khung theo **vùng trống giữa HUD và thẻ dưới đáy** (`setInsets`). Nhãn mảng = viên thuốc (chấm màu · tên ngắn · %), tránh nhau (thử đặt phía trên ngôi sao trước khi đẩy xuống), luôn nằm trong vùng giữa HUD và thẻ đáy.
3. **Tầng hệ (13.1b-3):** hành tinh to gấp 2 (bán kính 1,25 → 2,5; quỹ đạo giãn theo). Nhãn bài = viên thuốc nhỏ dưới hành tinh (mã + tên ngắn); trạng thái, sao, ngày chỉ ở thẻ tầng 3. Nhãn chạm vùng HUD/thẻ đáy thì ẩn (hết thẻ "SẮP CÓ" lẹm sau breadcrumb).
4. **Bụi sao (13.1b-4):** chỉ nằm dọc nhánh xoắn, hạt nhỏ, mờ dần ra rìa và ra mép nhánh, thêm lớp sáng mờ (haze) dọc nhánh; hạt không phóng to khi zoom gần.
5. **Thẻ dưới đáy (13.1b-5):** một hàng thấp (icon · tiêu đề · nút tròn), dùng chung cho bài test xếp lớp / tiếp tục bài / bài gợi ý. Vuốt xuống hoặc bấm **Bỏ qua** → viên thuốc; trạng thái lưu ở `S.galaxy.mini`.
6. **Nền theo tab (13.1b-6):**
   - Khám phá · Tôi · Cài đặt (và Chơi): **nền ngân hà nhẹ** `src/ui/skybg.ts` (canvas 2D vẽ 1 lần theo theme/kích thước, trôi rất chậm bằng CSS, đứng yên khi Khoai tây/giảm chuyển động). Không chạy Three.js. Thẻ chuyển sang **kính mờ**. Tương phản đã tính: chữ trên trời Light `#4A4672` ≥ 5,9:1, Night `#CFCBEF` ≥ 7,3:1; chữ phụ trên kính Light 4,8:1, Night 6,5:1.
   - **Chơi:** trang chính là **hành tinh nhà trong không gian** (`src/galaxy/home.ts`, đèn thị trấn theo tiến độ). Chạm hành tinh / nút "Bay xuống thị trấn" → camera lao xuống bề mặt → màn **thị trấn tạm** nắng pastel (thị trấn thật làm phiên sau). Các thẻ chế độ chơi, bảo tàng giữ bên dưới.
   - **Thời tiết** chỉ còn trong thị trấn (`#wxTown`); **bỏ họa tiết tiền** (xóa `src/ui/pattern.ts`, `.bgpat`); màn bài học nền trơn; theme **"Ảnh của tôi"** ẩn nền ngân hà nhẹ và thay nền trời của tab Học bằng ảnh.

### Lỗi / lưu ý đã biết (phiên 4)
- Vẫn **chưa thử trên điện thoại thật**; tab Chơi giờ có ngữ cảnh WebGL thứ hai (hành tinh nhà) — cần xem hiệu năng máy yếu.
- Màn thị trấn tạm dùng hình SVG `townScene` cũ (có viền trời riêng); sẽ thay bằng thị trấn low-poly.
- Ở Night, chữ trên trang Tôi nằm trên dải ngân hà sáng: đủ tương phản theo tính toán nhưng nên nhìn lại trên máy thật.
- Nền nhẹ chỉ vẽ lại khi đổi theme/kích thước; đổi theme khi đang ở tab Khám phá thì được vẽ lại lúc render lại tab.

## Phiên 3 — phần việc ngày 19/10 (làm sớm tối 18/10) · Dải ngân hà Altair (mục 13.1) + 6 mảng/20 bài (13.2d) ✅ có bản chạy được

**Kết quả:** `npm run build` sạch (tsc không lỗi). `node scripts/playthrough.cjs vi` vẫn xanh (mọi bước có chấm điểm đều RIGHT, không lỗi console). Kiểm thử Playwright (Chromium + WebGL SwiftShader) các luồng: lần đầu mở → tự lướt từ tầng 1 vào tầng 2 · chạm hành tinh → tầng 3 · HẠ CÁNH → tên lửa → mở bài · đóng bài → quay lại đúng hành tinh · nhặt sao chổi (+20 XP) · kéo/lăn chuột → tầng 1 · chạm hệ → tầng 2 · chip "Nên biết trước" → bay sang hành tinh ở mảng khác · Danh sách ↔ Ngân hà · đổi VI/EN · sang tab khác rồi quay lại · Khoai tây + giảm chuyển động (cắt thẳng, không tên lửa). Đã chụp Sáng/Tối.

### Đã xong
1. **Dữ liệu 6 mảng / 20 bài** (`src/content/domains.ts`, kiểu `CourseNode` trong `src/lesson/types.ts`): mỗi bài là một hành tinh có `code` (P1…X2), `title` (chủ đề ngắn — nhãn), `hook` (câu hỏi bí ẩn 13.2b — tiêu đề thẻ), `prereq: string[]` (được trỏ sang mảng khác), `unlock` (thứ mở khóa trong game, cột "Game" của 13.2d), `planet: { shape, palette, feature, size?, at? }`, `day` (ngày dự kiến có nội dung theo 13.6). Mảng mới **Kinh tế vĩ mô** (`macro`, M1–M4). 3 bài đã code giữ id cũ để không mất tiến độ: `p-budget` = P1, `p-inflation` = P3, `c-breakeven` = B1 (nội dung vẫn là bản cũ — viết lại theo khung 13.2c vào 21–22/10). 17 bài còn lại = **hành tinh phác thảo nét đứt** + thẻ "Sắp có · ngày".
2. **Tab Học = Dải ngân hà Altair, Three.js** (`src/galaxy/`), thay hẳn con đường uốn lượn:
   - **3 tầng zoom ngữ nghĩa**: (1) toàn ngân hà — 6 hệ phát sáng theo màu mảng, tên + % đã khám phá, dải sáng nối ngang, sao băng; (2) một hệ — 2–5 hành tinh, quỹ đạo mờ, nhãn tên bài; (3) một hành tinh — hành tinh lớn xoay chậm ở nửa trên, **thẻ bài** nửa dưới (câu hỏi bí ẩn, thời lượng, "Nên biết trước" chạm để bay tới, mở khóa trong game, Cơ bản/Đào sâu, **HẠ CÁNH** → tên lửa nhỏ chở Alti Lion đáp xuống → vào bài, "Ôn nhanh 1 phút"). Camera lướt + zoom ~650 ms; chuyến bay xa (khác hệ) vòng lên cao qua ngân hà.
   - **Cử chỉ**: kéo để lia (có quán tính), chụm 2 ngón / con lăn để zoom (vượt ngưỡng thì tự đổi tầng, có trễ chống giật), chạm đúp chỗ trống để zoom vào, nút `+` / `−` / **Về Altair**, breadcrumb "Altair › mảng › mã bài". Ở tầng 3 kéo ngang để xoay hành tinh.
   - **Hành tinh low-poly procedural** (`planet.ts`): icosphere + nhiễu, tô phẳng từng mặt, khí quyển viền sáng (fresnel). Mỗi bài một **hình dạng gợi chủ đề**: P1 đồng xu rơi ra · P2 vành đai thẻ tín dụng · P3 hành tinh băng teo dần + viền nét đứt cỡ cũ · P4 cờ đỏ · P5 lớp vỏ bị "khấu trừ" bay ra · B1 trà sữa có ống hút + trân châu làm mặt trăng · B2 vành nhãn giá · B3 hố · B4 hành tinh đôi (nợ/vốn) · B5 nhà chi nhánh · M1 khí khổng lồ phình to · M2 đại dương + núm lãi suất · M3 vệ tinh tin tức nhấp nháy · M4 2 mặt trăng (tài khóa/tiền tệ) · I1 cột biểu đồ xanh/đỏ · I2 tinh thể vàng & tiền ảo · G1 chia ngân sách như biểu đồ tròn · G2 vành đai nợ kiểu sao Thổ · X1 hai nửa tiền tệ + đường nối · X2 vỡ nứt trên lõi nham thạch (1997).
   - **Trạng thái hành tinh** đúng 13.1: chưa học = tối + sương mù · gợi ý = đèn hiệu nhấp nháy + Alti Lion nhỏ bay quanh · đang học = nửa sáng · xong = sáng + vành đai · xong Đào sâu = thêm mặt trăng vàng · chưa có nội dung = phác thảo nét đứt. Xong mọi bài đã có của một mảng → **chòm sao của mảng** hiện trên nền trời (huy hiệu mảng giữ nguyên logic cũ).
   - **Dải sáng "nên biết trước"** (13.2f): ribbon phát sáng có xung chạy từ bài cần biết trước → bài sau; nối ngang giữa các mảng uốn cong về phía Altair; sáng hơn khi bài trước đã học. Bề rộng tự giữ ~3–4 px ở mọi mức zoom.
   - **Nền**: 3 lớp sao ở 3 độ xa (parallax thật theo camera), tinh vân theo màu mảng + tím thương hiệu ở lõi, ~11.000 hạt bụi dọc 3 nhánh xoắn, sao băng. **Sáng** = trời bình minh pastel (lavender → hồng đào, sao mờ); **Tối** = vũ trụ tím than, sao sáng (blend cộng).
   - **Sao Altair** ở tâm, Alti Lion sống ở đó (chạm → tùy biến). Bong bóng thoại của Alti Lion (cài đặt "Tương tác") hiện ở tầng 1, góc trên.
   - **Hành tinh nhà** cạnh Altair (thị trấn thu nhỏ): chạm → tab Chơi; số đèn = 2 + 2 × số bài đã học (+2 khi có game).
   - **Rương → sao chổi**: cứ 2 bài học xong có 1 sao chổi bay ngang hệ đang xem, chạm để nhặt +20 XP (lưu `S.chests` dạng `comet-n`; huy hiệu "Săn sao chổi").
   - **HUD 1 thanh mảnh** (breadcrumb · vòng mục tiêu hôm nay · Danh sách) + **thẻ "Tiếp tục" nổi** ở cạnh dưới, kéo xuống để thu gọn (chạm tay nắm để hiện lại); người mới thấy thẻ bài test xếp lớp.
   - **Mặc định** mở ở tầng 2 của mảng gợi ý; **lần đầu** tự lướt từ tầng 1 vào (1,15 s, chạm để bỏ qua; lưu `S.galaxy.seen`).
   - **Khoai tây / giảm chuyển động**: không xoay, không sao băng, không nhấp nháy sao, không quán tính, chuyển cảnh cắt thẳng, không tên lửa; chỉ vẽ lại khi camera đổi (tiết kiệm pin); Khoai tây còn giảm hạt bụi/sao, tắt khử răng cưa, pixel ratio 1.
   - **Dạng Danh sách** (nút "Danh sách", lưu `S.galaxy.list`): danh sách bài theo mảng, mỗi dòng có mã bài, câu hỏi bí ẩn, trạng thái, bài nên biết trước; chạm → thẻ bài (bottom sheet). Máy không có WebGL → tự chuyển sang Danh sách và báo.
   - Nhãn/nút là HTML đặt theo vị trí 3D mỗi khung hình (đọc được bằng trình đọc màn hình, đổi VI/EN tức thì); nhãn tự đẩy nhau ra khi chồng lên nhau và không tràn mép màn hình. Canvas `aria-hidden`.
   - Vòng lặp vẽ tự dừng khi đang mở bài học, ở tab khác hoặc app chạy nền.
3. Khác: tab Chơi thêm chế độ **Thống đốc NHTW** (mảng Vĩ mô) và cập nhật ngày theo 13.6; trang Tôi đếm /20 bài; Three.js tách chunk riêng (`three-*.js` ~126 KB gzip) để cập nhật app không phải tải lại; README cập nhật cấu trúc + cách thêm bài.

### 💡 Đề xuất chờ nhóm duyệt (đã code, đổi dễ trong `domains.ts`)
- **Màu 6 mảng**: Cá nhân `#F7867A` (hồng đào) · Doanh nghiệp `#F5A524` (vàng cam) · Vĩ mô `#8B6CF0` (tím) · Đầu tư `#1BB0C2` (xanh ngọc) · Công `#3D7BF5` (xanh dương) · Quốc tế `#2FAE73` (xanh lá biển).
- **Dải sáng trong cùng mảng** (13.2f chỉ ghi các dải nối ngang): mình thêm P2→P1, P5→P1, B2→B1, B4→B1 và 2 dải ngang I1→P3, G2→G1. Bỏ được bằng cách xóa id trong `prereq`.
- **Chữ trên hành tinh/thẻ** dùng tiêu đề mới theo 13.2d cho cả 3 bài cũ (vd P1 hiện "Tiền tiêu vặt của mình biến đi đâu hết?") dù nội dung bài vẫn là bản cũ đến 21–22/10.
- **Sao chổi** 1 cái / 2 bài xong; **chòm sao** hiện khi xong mọi bài *đã có nội dung* của mảng (nên hiện tại xong B1 là có chòm sao Doanh nghiệp) — nếu muốn chỉ hiện khi xong đủ 5 bài thì sửa `domainDone` trong `src/content/badges.ts`.
- Bố cục: 3 nhánh xoắn; Vĩ mô gần tâm nhất; quỹ đạo kéo dài theo chiều dọc màn hình (ellipse) để một hệ lấp đầy màn hình điện thoại.

### Lỗi / lưu ý đã biết (phiên 3)
- **Chưa thử trên điện thoại thật** (chỉ Chromium headless với WebGL phần mềm). Cần thử pinch-zoom, hiệu năng và nhiệt độ máy trên 1 Android tầm trung + 1 iPhone trước 24/10.
- Zoom bằng chụm/lăn chuột zoom quanh tâm màn hình, chưa zoom theo vị trí ngón tay.
- Ở tầng 1, nhãn hệ có thể bị đẩy lệch khỏi ngôi sao của nó vài chục px khi chồng nhau (Vĩ mô sát Altair). Nhãn chỉ tránh nhau, không tránh hành tinh.
- Bong bóng thoại của Alti Lion giờ chỉ hiện ở tầng 1 (tầng 2 nhiều nhãn, sợ rối).
- "Sương mù" của hành tinh chưa học hơi khó thấy ở theme Sáng.
- Bài test xếp lớp vẫn gợi ý theo thứ tự bài đã có nội dung (P1 → P3 → B1).
- Ảnh Wikimedia vẫn chưa test được vì mạng phiên bị chặn (như phiên 2).

## ▶️ Việc đầu tiên của phiên sau (cập nhật 18/10 tối, giờ VN)
**Trạng thái:** mọi việc trong lịch 13.6 tới **23/10 đã xong và đã deploy** (thị trấn 7 khu, chế độ Cá nhân, chế độ Doanh nghiệp, khủng hoảng 1929 hai vai, bài P1–P3, B1, B3, B4, M1–M3). Đang làm dòng **24–26/10**.
1. `git pull`, đọc mục "Quyết định Claude Code tự đưa ra" ở đầu file + các mục Phiên 5. `npm install && npm run dev`, `node scripts/playthrough.cjs vi` (đã gồm 10 bài; bước `predict` báo WRONG là đúng thiết kế).
2. Làm tiếp các bài còn thiếu theo thứ tự 13.6: ~~P4, P5~~ (xong), **B2, B5, M4, I1, I2, G1, G2, X1, X2** (khung 6 nhịp 13.2c — xem `src/content/lessons/p-bnpl.ts` làm mẫu; nhớ thêm `lesson:` vào node trong `src/content/domains.ts` và thêm id vào `scripts/playthrough.cjs`). Tiến độ từng bài ghi ở các mục Phiên 5/6 phía trên.
3. Sau đó: Khám phá 3 bài (mục 4), sửa lỗi, thử trên điện thoại thật (nhóm).
4. Kiểm tra nhanh trước khi push: build, playthrough, và Playwright 375×812 (5 tab, mở bài học, vào thị trấn, kéo joystick, thoát). Script tham khảo đã dùng: mở tab Chơi → `A.goTown()`; trong dev có `window.__town` để dịch chuyển nhân vật.
5. Tổng kết tuần: nếu từ 18:00 thứ Năm 22/10 (giờ VN) chưa có bản tổng kết ở đầu file thì viết.

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
