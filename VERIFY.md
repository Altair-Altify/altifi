# VERIFY — số liệu, trích dẫn & case cần nhóm kiểm trước khi nộp

> Gom từ mọi chỗ đánh dấu ⚠️ trong `PROGRESS.md` và trong code nội dung (`src/content`, bài học, kho Alti Lion, tham số game).
> **Chỉ liệt kê — Claude Code không tự sửa số.** Số trong app hiện là số làm tròn **theo trí nhớ** (mạng của phiên chặn các trang thống kê, báo chí).
> Thứ tự: **theo vòng demo trong video trước** (mục 8: học M2 → bảo tàng 1929 → Cuộc sống của tôi 1–2 tháng → hỏi Alti Lion), sau đó các bài có thể lên video (P1, P3), rồi phần còn lại theo mảng.
> Cột *file:dòng* chỉ dòng hiển thị chính; con số thường lặp lại ở bản EN ngay dòng dưới và ở comment đầu file — sửa thì sửa cả hai bản VI/EN.
> Kiểm xong mục nào: đánh ✅ vào cột đầu, ghi nguồn (link) vào cột cuối và vào phần "Nguồn" trên màn hình nếu bài có.

## A. Vòng demo trong video

| ✓ | Bài / màn hình | Nội dung cần kiểm | Giá trị hiện tại | file:dòng | Nguồn nên tra |
|---|---|---|---|---|---|
| | M2 · Đoán thử | Khảo sát nhóm: chỉ 13% biết vay thả nổi trả nhiều hơn khi lãi tăng | 13% (6/46) | `src/content/lessons/m-centralbank.ts:55` | Dữ liệu khảo sát của nhóm (mục 1.3 ALTIFI_DESIGN) |
| | M2 · Đoán thử | Khoản trả vay nhà 1 tỷ / 20 năm khi lãi 8% → 10% (tự tính) | 8,36tr → 9,65tr | `src/content/lessons/m-centralbank.ts:53–55` | Tự tính lại bằng công thức trả góp (PMT) |
| | M2 · Núm Thống đốc | Mô hình minh họa: lạm phát = 7 − 0,8·(r − 4); thất nghiệp = 2,4 + 0,6·(r − 4) | hệ số 0,8 / 0,6 | `src/content/lessons/m-centralbank.ts:72` | Không phải số thật — chỉ cần màn hình ghi rõ "mô hình minh họa" |
| | M2 · Chuyện thật (biểu đồ) | Lãi suất Fed 2022–23 theo mốc | 0,1 → 1,6 → 3,1 → 4,4 → 4,9 → 5,4% | `src/content/lessons/m-centralbank.ts:84` | Fed (federalreserve.gov — FOMC target range), FRED `FEDFUNDS` |
| | M2 · Chuyện thật (biểu đồ) | Lạm phát Mỹ cùng các mốc; đỉnh ~9,1% (6/2022), ~3% giữa 2023 | 7,5 → 9,1 → 8,2 → 6,5 → 5,0 → 3,2% | `src/content/lessons/m-centralbank.ts:85, 97` | US Bureau of Labor Statistics (CPI-U, yoy), FRED `CPIAUCSL` |
| | M2 · Chuyện thật | NHNN tăng lãi suất tái cấp vốn 4% → 5% (9/2022) → 6% (10/2022) | 4 → 5 → 6% | `src/content/lessons/m-centralbank.ts:97` | Ngân hàng Nhà nước (sbv.gov.vn — quyết định điều chỉnh lãi suất 2022) |
| | M2 · Đào sâu | Quy tắc Taylor (1993), hệ số ½ | John Taylor 1993 | `src/content/lessons/m-centralbank.ts:157` | Taylor (1993), *Carnegie-Rochester Conference Series on Public Policy* |
| | Bảo tàng 1929 · Chuyện thật | Dow Jones đỉnh 3/9/1929 → đáy 8/7/1932 | ~381 → ~41 (≈ −89%) | `src/content/crisis1929.ts:124` (chỉ số theo bước: `:21`) | S&P Dow Jones Indices / dữ liệu lịch sử DJIA; Federal Reserve History |
| | Bảo tàng 1929 | Ngày "Thứ Năm Đen tối" 24/10 và "Thứ Ba Đen tối" 29/10/1929 | 24/10, 29/10 | `src/content/crisis1929.ts:124` | Federal Reserve History ("Stock Market Crash of 1929") |
| | Bảo tàng 1929 · bước 12/1930 | Bank of United States đóng cửa 12/1930 | 12/1930 | `src/content/crisis1929.ts:52` | Federal Reserve History; Friedman & Schwartz (1963) |
| | Bảo tàng 1929 | Số ngân hàng Mỹ đổ 1930–33 | ~9.000 | `src/content/crisis1929.ts:124` | FDIC history; Federal Reserve History ("Banking Panics of 1930–31") |
| | Bảo tàng 1929 | Thất nghiệp Mỹ năm 1933 | ~25% | `src/content/crisis1929.ts:71, 124` | US Bureau of Labor Statistics (dữ liệu lịch sử) |
| | Bảo tàng 1929 · bước 1932 | Lượng tiền giảm khoảng 1/3 | ~1/3 | `src/content/crisis1929.ts:107, 130` | Friedman & Schwartz (1963), *A Monetary History of the United States* |
| | Bảo tàng 1929 · vai Thống đốc | Fed tăng lãi suất chiết khấu 10/1931 để giữ vàng | 10/1931 | `src/content/crisis1929.ts:93, 124` | Federal Reserve History ("The Great Depression") |
| | Bảo tàng 1929 · vai Thống đốc | Mỹ lập bảo hiểm tiền gửi FDIC năm 1933 | 1933 | `src/content/crisis1929.ts:113, 124` | fdic.gov (lịch sử FDIC) |
| | Bảo tàng 1929 · Chuyện thật | Câu nói của Ben Bernanke (2002) với Milton Friedman: "You're right, we did it. We're very sorry." | trích nguyên văn | `src/content/crisis1929.ts:124–125` | federalreserve.gov — bài phát biểu của Bernanke, 8/11/2002 |
| | Bảo tàng 1929 · kết quả | Mô hình "nếu như" của vai Thống đốc (thất nghiệp, số ngân hàng đổ) | mô hình tự đặt | `src/ui/crisis.ts:127–128` | Không phải số thật — màn hình phải ghi rõ "chỉ để so sánh" |
| | Cuộc sống của tôi · bắt đầu | Lương 10tr gộp → 8,95tr thực nhận (BH bắt buộc 10,5%: BHXH 8%, BHYT 1,5%, BHTN 1%), chưa chịu thuế TNCN | 8.950.000₫ | `src/game/life.ts:67–69` | Luật BHXH 2024, Luật Việc làm; Luật Thuế TNCN (bản sửa đổi 2025–26) — Bộ Tài chính, BHXH Việt Nam |
| | Cuộc sống của tôi · tháng 1 (case "Lương đầu tiên") | Madrian & Shea (2001): tự động đăng ký → tham gia ~37% → 86% | 37% → 86% | `src/content/cases.ts:34` | Madrian & Shea (2001), *Quarterly Journal of Economics* 116(4) |
| | Cuộc sống của tôi · tháng 2 (case "Quỹ không bao giờ lỗ") | Madoff: ~65 tỷ USD trên giấy, án 150 năm tù, Markopolos cảnh báo | 65 tỷ USD, 150 năm | `src/content/cases.ts:54` | US SEC (báo cáo OIG 2009), US DOJ (bản án 6/2009) |
| | Cuộc sống của tôi · thị trường | Lãi suất NHTW mô phỏng 4% (tháng 1–4) → 5% (5–6) → 6% (từ 7); thả nổi = NHTW + 6,5%; cố định 12,5%; tiết kiệm = NHTW + 1,6%; thẻ 30%/năm; lạm phát 3,5%/năm | xem cột trước | `src/game/life.ts:36–41` | NHNN (lãi suất điều hành 2022); biểu lãi suất cho vay tiêu dùng / tiết kiệm của vài ngân hàng; Tổng cục Thống kê (CPI) |
| | Cuộc sống của tôi · Nhà & xe | Bảng giá: phòng trọ 2,5tr/tháng, căn hộ thuê 5,5tr, xe máy 35tr, căn hộ 1,6 tỷ, nhà phố 4,5 tỷ, ô tô nhỏ 550tr… | xem cột trước | `src/game/life.ts:48–57` | Tin rao thuê/bán (batdongsan, chotot), bảng giá xe hãng — số "gần thật", chỉnh khi cân bằng game |
| | Cuộc sống của tôi · Chợ | Mức chi tiêu: nhu cầu 3tr, mong muốn 0,5 / 1,5 / 3,5tr | xem cột trước | `src/game/life.ts:61–63` | Tham số game; đối chiếu chi tiêu thực tế của người mới đi làm |
| | Cuộc sống của tôi · Phòng khám | Bảo hiểm 180k/tháng, trả 80% viện phí; sự cố ốm 4tr / hỏng điện thoại 3tr, 30% mỗi tháng từ tháng 3 | xem cột trước | `src/game/life.ts:65, 196–197` | Tham số game; đối chiếu một gói bảo hiểm sức khỏe thật |
| | Cuộc sống của tôi · bảng xếp hạng | 7 bạn NPC: quỹ đạo tài sản (người liều mất 65% ở tháng 5…) | công thức | `src/game/life.ts:142–148` | Tham số game (minh họa lối sống) |
| | Thị trấn · lần đầu vào | Tiền khởi đầu 2.000.000₫ "tiền lì xì tiết kiệm" | 2.000.000₫ | `src/ui/town.ts:26` | Tham số game |
| | Hỏi Alti Lion (kho câu trả lời) | Madoff ~65 tỷ USD (2008) | 65 tỷ USD | `src/assistant/kb.ts:114` | US SEC / DOJ |
| | Hỏi Alti Lion | Thất nghiệp Mỹ thời Đại khủng hoảng ~25% | ~25% | `src/assistant/kb.ts:153` | US BLS (dữ liệu lịch sử) |
| | Hỏi Alti Lion | Giá dầu tăng ~4 lần (10/1973, cấm vận Ả Rập) | ×4 | `src/assistant/kb.ts:161` | US EIA; Federal Reserve History ("Oil Shock of 1973–74") |
| | Hỏi Alti Lion | Lehman Brothers phá sản 9/2008 | 15/9/2008 | `src/assistant/kb.ts:145–146` | Federal Reserve History; hồ sơ phá sản Lehman |
| | Hỏi Alti Lion | 50/30/20 do Elizabeth Warren & Amelia Warren Tyagi phổ biến; "kế toán tinh thần" (Thaler) | *All Your Worth* (2005) | `src/assistant/kb.ts:82` | Warren & Tyagi (2005); Thaler (1999) *Mental Accounting Matters*; Nobel 2017 (nobelprize.org) |

## B. Bài có thể lên video: P1, P3

| ✓ | Bài / màn hình | Nội dung cần kiểm | Giá trị hiện tại | file:dòng | Nguồn nên tra |
|---|---|---|---|---|---|
| | P1 · Chuyện thật | Madrian & Shea (2001): 37% → 86% (biểu đồ + giải thích) | 37% → 86% | `src/content/lessons/p-budget.ts:104–110` | Madrian & Shea (2001), *QJE* |
| | P1 · Cơ chế | 50/30/20 — Warren & Tyagi (2005) | 50/30/20 | `src/content/lessons/p-budget.ts:80` | Warren & Tyagi (2005), *All Your Worth* |
| | P1 · Bẫy | Khảo sát nhóm: 20/46 bạn từng mua vì "bạn bè có rồi" | 20/46 | `src/content/lessons/p-budget.ts:138` | Dữ liệu khảo sát của nhóm |
| | P3 · Chuyện thật | Lạm phát bình quân Việt Nam 2008 | ~23% | `src/content/lessons/p-inflation.ts:137, 181–182` | Tổng cục Thống kê (CPI bình quân năm 2008) |
| | P3 · Bẫy | Khảo sát nhóm: 12/46 nhầm lãi kép với lãi đơn | 12/46 | `src/content/lessons/p-inflation.ts:185–190` | Dữ liệu khảo sát của nhóm |
| | P1 · cả bài (viết lại 20/10) | Tháng lương của Minh — **số tự đặt**, đáp án đã đổi theo: thực nhận 9tr; rò rỉ 2,32tr ≈ **26%** (trước: 54%); hũ 4,5 / 2,7 / 1,8tr; cà phê 35k × 20 × 12 = **8,4tr/năm** (trước: trà sữa 7,3tr); Đào sâu: Mai 12tr → để dành 2,4tr, quỹ 18tr, **7,5 tháng** | xem cột trước | `src/content/lessons/p-budget.ts:4–7` (phép tính), `:56–57, 64–73, 87–89, 94–96, 182–186` | Tự tính lại; mức lương/tiền phòng chỉ là ví dụ gần thực tế TP.HCM — nhóm chỉnh nếu thấy lệch |
| | P3 · Đoán thử (viết lại 20/10) | 10 triệu, lạm phát 4%/năm, 10 năm → sức mua **≈ 6,76 triệu** (trước: 100k → 67.600₫) | 10.000.000 ÷ 1,04¹⁰ | `src/content/lessons/p-inflation.ts:141–143` | Tự tính lại |
| | P3 · video "Quả cầu tuyết" (viết lại 20/10) | 10 triệu, 8%/năm, gửi từ 22 tuổi → 60 tuổi ≈ **186 triệu**; từ 32 tuổi ≈ **86 triệu** (trước: 15 → 319tr, 25 → 148tr) | 10tr × 1,08³⁸ / 1,08²⁸ | `src/content/lessons/p-inflation.ts:64–69` | Tự tính lại |
| | P3 · Trùm cuối | Quỹ khẩn cấp 27 triệu = 3 tháng chi tiêu thiết yếu (ví dụ) | 27tr | `src/content/lessons/p-inflation.ts` (bước "Trùm cuối") | Ví dụ — không cần nguồn |

## C. Các bài khác (theo mảng)

| ✓ | Bài / màn hình | Nội dung cần kiểm | Giá trị hiện tại | file:dòng | Nguồn nên tra |
|---|---|---|---|---|---|
| | P2 · Đoán thử / thanh trượt | Lãi thẻ tín dụng ~30%/năm (2,5%/tháng) | 30%/năm | `src/content/lessons/p-bnpl.ts:50, 64, 159` | Biểu phí thẻ tín dụng của vài ngân hàng VN |
| | P2 · Cơ chế | Phí trễ hạn BNPL 60.000₫/kỳ (giả định) | 60.000₫ | `src/content/lessons/p-bnpl.ts:70, 76` | Điều khoản một ví/sàn có "mua trước trả sau" thật |
| | P2 · Chuyện thật / Bẫy | Khảo sát nhóm: 6/46 đã dùng trả sau; 7/46 nghĩ điểm tín dụng = tiền tiết kiệm | 6/46, 7/46 | `src/content/lessons/p-bnpl.ts:104, 117`; `src/content/cases.ts:114` | Dữ liệu khảo sát của nhóm |
| | P4 · Chuyện thật | Madoff ~65 tỷ USD trên giấy, 150 năm tù, Markopolos | 65 tỷ USD, 150 năm | `src/content/lessons/p-scam.ts:96, 104` | US SEC, US DOJ |
| | P4 · Chuyện thật | Case trái phiếu VN 2022 (viết **ẩn danh**) | không nêu tên | `src/content/cases.ts:74` | Báo chính thống 2022–23 — kiểm mô tả, giữ ẩn danh (6.5) |
| | P5 · Phiếu lương | BH bắt buộc người lao động: BHXH 8%, BHYT 1,5%, BHTN 1% = 10,5% | 10,5% | `src/content/lessons/p-salary.ts:25, 33, 53, 60–61` | Luật BHXH 2024; BHXH Việt Nam |
| | P5 · Thuế TNCN | "Lương 10tr chưa phải nộp thuế" — không nêu mức giảm trừ gia cảnh / biểu thuế | không nêu số | `src/content/lessons/p-salary.ts:53` | Luật Thuế TNCN sửa đổi (2025–26), nghị quyết giảm trừ gia cảnh — Bộ Tài chính |
| | P5 · Đào sâu | Doanh nghiệp đóng thêm ~21,5% trên lương (ghi "giả định") | 21,5% | `src/content/lessons/p-salary.ts:140–141` | Luật BHXH 2024; BHXH Việt Nam |
| | B1 · cả bài | Số liệu quán trà sữa (định phí 63tr, lãi góp 22k/ly → hòa vốn 2.864 ly, DOL 22) — số tự đặt | 2.864 ly, DOL 22 | `src/content/lessons/c-breakeven.ts:9, 98, 115, 181` | Hỏi 1 chủ quán thật để chỉnh |
| | B2 · cả bài | Nhu cầu theo giá ở 2 khu (số tự đặt) | xem comment đầu file | `src/content/lessons/c-price.ts:3–6` | Minh họa — ghi rõ "giả định" (đã có) |
| | B3 · Chuyện thật | "Vấn đề dòng tiền là lý do hàng đầu khiến doanh nghiệp nhỏ đóng cửa" — đang viết chung chung | không nêu số | `src/content/cases.ts:142`; `src/content/lessons/c-cash.ts:6` | Khảo sát SME (vd US Bank / SCORE, VCCI) — tìm nguồn trước khi nêu số |
| | B4 · Chuyện thật | Steve Jobs rời Apple 1985, quay lại 1997 | 1985, 1997 | `src/content/lessons/c-funding.ts:92, 100` | Lịch sử Apple (báo cáo thường niên, tiểu sử Isaacson 2011) |
| | B4 · cả bài | Vay 600tr, 11%/năm, 60 tháng → 13,05tr/tháng, lãi ~183tr (tự tính) | 13,05tr | `src/content/lessons/c-funding.ts:44, 67` | Tự tính lại; lãi 11% là minh họa |
| | B5 · Chuyện thật | Starbucks đóng ~600 cửa hàng Mỹ (7/2008), Schultz quay lại CEO 1/2008 | ~600 | `src/content/lessons/c-growth.ts:107, 115` | Thông cáo Starbucks 1/7/2008 |
| | B5 · Chuyện thật | Kodak: kỹ sư Steve Sasson làm máy ảnh số 1975; Kodak phá sản 1/2012 | 1975, 2012 | `src/content/lessons/c-growth.ts:8–9` (comment) và bước "chuyện thật" sau `:115` | Kodak; hồ sơ phá sản 19/1/2012 |
| | Doanh nghiệp của tôi · thông số quầy | Vốn 50tr, định phí 16tr/tháng, biến phí 15k/ly, nhu cầu 1.750/1.300/900 ly ở 25/35/45k, nhà đầu tư 40tr = 45%, vay cố định 11% / thả nổi NHTW + 5%, thấu chi 20%, phá sản khi thấu chi > 30tr | xem cột trước | `src/game/biz.ts:10–21, 38` | Hỏi 1 chủ quán thật; biểu lãi vay hộ kinh doanh |
| | Doanh nghiệp của tôi · case | 4 case kinh doanh (dầu 1973 tăng ~4 lần, chiến tranh voucher, vay thả nổi 2022–23) | xem cột trước | `src/content/cases.ts:142, 162, 182, 202` | US EIA (1973); báo chính thống |
| | Case "Trả góp xe" | Fed từ gần 0% lên hơn 4% trong 9 tháng (2022), trên 5% năm 2023; NHNN tăng 2 lần cuối 2022 | xem cột trước | `src/content/cases.ts:94` | Fed; NHNN |
| | M1 · Chuyện thật (biểu đồ) | CPI bình quân Việt Nam 2007–2013 | 8,3 · 23,0 · 6,9 · 9,2 · 18,6 · 9,1 · 6,6% | `src/content/lessons/m-inflation.ts:93, 99` | Tổng cục Thống kê (CPI bình quân năm) |
| | M1 · Chuyện thật | Zimbabwe: lạm phát chính thức 7/2008 ~231 triệu %, tờ 100 nghìn tỷ đô | 231 triệu % | `src/content/lessons/m-inflation.ts:82, 103–107` | IMF; Reserve Bank of Zimbabwe; Hanke & Krus (2012) |
| | M3 · Đoán thử / Chuyện thật | Tăng trưởng GDP Việt Nam 2019–2024 | 7,02 · 2,91 · 2,58 · 8,02 · 5,05 · 7,09% | `src/content/lessons/m-news.ts:50–52, 95, 101` | Tổng cục Thống kê (thông cáo GDP cả năm) |
| | M4 · Đoán thử / biểu đồ | Mỹ 1972–76: lạm phát 3,3 · 6,2 · 11,0 · 9,1 · 5,8%; thất nghiệp 5,6 · 4,9 · 5,6 · 8,5 · 7,7% | xem cột trước | `src/content/lessons/m-policy.ts:50–52, 90` | US BLS (CPI-U bình quân năm, tỷ lệ thất nghiệp bình quân năm) |
| | I1 · Đoán thử | VN-Index đầu 2022 ~1.500 → 11/2022 ~900 (≈ −40%) | 1.500 → 900 | `src/content/lessons/i-stocks.ts:50–52` | HOSE (dữ liệu VN-Index lịch sử) |
| | I2 · Móc câu | Tulip mania Hà Lan 1636–37 | 1636–37 | `src/content/lessons/i-bubbles.ts:41–44` | Garber (2000), *Famous First Bubbles* |
| | I2 · Đoán thử | Nasdaq 5.048 (10/3/2000) → 1.114 (10/2002), −78% | −78% | `src/content/lessons/i-bubbles.ts:53` | Nasdaq (dữ liệu lịch sử chỉ số) |
| | I2 · Chuyện thật | Bitcoin ~69.000 USD (11/2021) → ~16.000 (11/2022), −77% | −77% | `src/content/lessons/i-bubbles.ts:89, 93` | CoinMarketCap / CoinGecko (giá lịch sử) |
| | G1 · Đoán thử | Thuế GTGT 10% (và mức tạm giảm 8% nhiều năm gần đây) | 10% / 8% | `src/content/lessons/g-tax.ts:51–53, 143` | Luật Thuế GTGT; nghị quyết giảm thuế GTGT của Quốc hội |
| | G2 · Chuyện thật (biểu đồ) | Nợ công Hy Lạp 2007–2011 | 103 · 109 · 127 · 146 · 172% GDP | `src/content/lessons/g-debt.ts:81` | Eurostat (government debt, % GDP) |
| | G2 · Chuyện thật | Gói cứu trợ EU–IMF đầu tiên 110 tỷ euro (5/2010); bội chi 2009 ~15% GDP | 110 tỷ euro | `src/content/lessons/g-debt.ts:92` | IMF; European Commission |
| | X1 · Chuyện thật (biểu đồ) | Tỷ giá USD/VND cuối năm 2020–2024 | 23,1 · 22,8 · 23,6 · 24,3 · 25,4 nghìn | `src/content/lessons/x-fx.ts:86` | Ngân hàng Nhà nước (tỷ giá trung tâm); Vietcombank |
| | X2 · Chuyện thật | Mức mất giá so với USD 1997–98: Indonesia ~80%, Thái ~55%, Hàn ~50%, Malaysia ~45% | xem cột trước | `src/content/lessons/x-1997.ts:88–100` | IMF; ngân hàng trung ương các nước |
| | X2 · Chuyện thật | Gói IMF cho Hàn Quốc ~57 tỷ USD (lớn nhất), Hàn Quốc quyên vàng 1998; comment đầu file còn ghi Thái ~17 tỷ, Indonesia ~40 tỷ | 57 tỷ USD | `src/content/lessons/x-1997.ts:100` (comment `:5–7`) | IMF (Independent Evaluation Office, 2003) |
| | Bảo tàng 1997 | Baht ~25/USD trước 2/7/1997 → ~56 (1/1998); dự trữ ~38 tỷ USD, ~23 tỷ đã hứa qua hợp đồng kỳ hạn; 58 công ty tài chính bị đình chỉ, 56 đóng cửa 12/1997; gói IMF ~17 tỷ (8/1997) | xem cột trước | `src/content/crisis1997.ts:18, 31, 45, 63–64, 75` | Bank of Thailand; IMF |
| | Khám phá · "NHTW tăng lãi suất" | Fed từ gần 0% lên trên 5% trong ~16 tháng; lạm phát Mỹ ~9% giữa 2022 | xem cột trước | `src/content/explore.ts:38–43` | Fed; US BLS |
| | Khám phá · "Châu Á 1997" | Baht mất khoảng một nửa; gói Hàn Quốc ~57 tỷ USD | xem cột trước | `src/content/explore.ts:90–99` | IMF; Bank of Thailand |
| | Khám phá · "Vàng khi bất ổn" | Vàng 800–900 USD/oz (2008) → gần 1.900 (2011) → ~1.100 (cuối 2015); > 2.000 USD (2020) | xem cột trước | `src/content/explore.ts:145–148` | LBMA Gold Price; World Gold Council |
| | Khám phá · cả 3 bài | Nguồn hiện chỉ ghi tên tổ chức/báo cáo, chưa có link | — | `src/content/explore.ts:75, 126, 178` | Thêm link cho từng nguồn |
| | Kho Alti Lion · các chủ đề khác | Mọi con số trong 3 cấp n/l/p | — | `src/assistant/kb.ts` (cả file) | Đối chiếu như các dòng trên |

## D. Ghi chú chung

- **Khảo sát của nhóm** (46 bạn 14–17 tuổi): các tỷ lệ 6/46, 7/46, 12/46, 13%, 20/46 lấy từ mục 1.3 `ALTIFI_DESIGN.md` — nhóm đối chiếu lại bảng khảo sát gốc.
- **Số tự đặt cho bài tập** (quán trà sữa, nhu cầu theo giá, ngân sách thành phố, tít báo M3, đoạn chat P4…) không cần nguồn, nhưng màn hình phải ghi "giả định / ví dụ" (đa số đã ghi).
- Ảnh thật lấy từ Wikimedia Commons lúc chạy: kiểm giấy phép từng ảnh và ghi vào `assets/CREDITS.md` (xem PROGRESS phiên 2).
