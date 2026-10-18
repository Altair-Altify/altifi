# ALTIFI — Tài liệu thiết kế (Design Doc)

> **Dành cho Claude Code:** đây là bản tổng hợp *mọi quyết định đã chốt* giữa nhóm Altifi và Claude (cập nhật 18/10/2026, chiều). Đọc toàn bộ trước khi viết code.
>
> **4 file đi kèm:**
> 1. `ALTIFI_DESIGN.md` — tài liệu này (nguồn sự thật duy nhất; nếu chỗ nào mâu thuẫn, mục có ✅ và mục viết sau thắng).
> 2. `altifi-base.html` — **giao diện nền** (vỏ app + mọi tính năng UX) → xem **mục 10b**.
> 3. `altifi-prototype.html` — lấy **engine** bài học, game, nhân vật, thư viện case → xem mục 10b & 11.
> 4. `alti-lion.html` — thiết kế **linh vật sư tử Alti Lion** → xem mục 5.3.
>
> ⭐ **Cập nhật lớn 18/10 chiều: đọc mục 13 ở cuối file trước tiên.**
>
> **Quy trình làm việc:** mỗi ngày một phiên (cuộc trò chuyện) mới, làm đúng phần việc của ngày đó trong mục 12. **Cuối mỗi phiên, cập nhật `PROGRESS.md`** (đã xong gì, còn dở gì, lỗi chưa sửa, việc đầu tiên của phiên sau). **Đầu mỗi phiên, đọc `ALTIFI_DESIGN.md` + `PROGRESS.md`** trước khi làm.
>
> **Quy ước trong tài liệu:** ✅ = đã chốt · 💡 = đề xuất của Claude đã được nhóm đồng ý · ⚠️ = cần kiểm chứng / lưu ý · 🔜 = để dành cho bản thật (không làm trong demo).

---

## 0. Tóm tắt 1 đoạn

> ⭐ **Đã thay đổi 18/10 chiều:** xem **mục 13** (mục 13 thắng khi mâu thuẫn).
> Tóm tắt mới: **6 mảng** (thêm *Kinh tế vĩ mô*), tab Học là **dải ngân hà Altair**, game **low-poly kiểu Focustown/Animal Crossing** điều khiển bằng **joystick**, net worth mua được **nhà & xe**.

Altifi là app học **tài chính – kinh tế cho teen Việt Nam** (kiểu Duolingo) kết hợp **game mô phỏng có đồ họa dễ thương kiểu Animal Crossing**. Người dùng học theo **5 mảng tài chính** (không bắt buộc học theo thứ tự), mỗi bài gồm **video/hoạt họa ngắn + bài tập tương tác có hình ảnh thật**. Kiến thức được **áp dụng trong game**: mỗi mảng có một chế độ chơi riêng (tài chính cá nhân → sống & quản lý tiền; tài chính doanh nghiệp → sở hữu & điều hành doanh nghiệp trong một thị trường mô phỏng giống Việt Nam; …), cộng thêm **chế độ Khủng hoảng lịch sử** (1929, 1973, 2008…). Có mục **Khám phá** để đọc các sự kiện tài chính thế giới do AI tổng hợp từ nguồn uy tín. **Alti Lion** — linh vật sư tử — là **trợ lý AI ở góc phải**, giải thích mọi thứ theo trình độ của người dùng. Luôn có **net worth**: nước đi hay thì giàu lên, nước đi tệ thì mất tiền, mất nhiều thì **phá sản**.

---

## 1. Bối cảnh dự án
> ⚠️ **CHỈ ĐỂ THAM KHẢO.** Nhóm **chưa hoàn thành business proposal**, nên mục này có thể còn thay đổi. **Đừng đưa nhiều nội dung của mục này vào app** (không dựng màn hình giới thiệu vấn đề/mô hình kinh doanh/thành viên/cuộc thi trong app). App chỉ cần phản ánh *sản phẩm*: học, chơi, khám phá, Alti Lion.

### 1.1 Cuộc thi
- ✅ **RMIT Business Plan Competition 2026** (Cuộc thi Sáng kiến kinh doanh RMIT 2026). Tên đội: **Altair**. Tên app: **Altifi** (đổi từ "Altair" vì trùng tên đội).
- ✅ **Hạn nộp: 23:59 ngày 01/11/2026** — nộp **bản đề xuất PDF + video ≤ 2 phút** (gửi rbpc@rmit.edu.vn). Bài nộp & thuyết trình **bằng tiếng Anh**.
- Mốc sau đó: 18/11 công bố top 5 · 22/11 hội thảo · **06/12/2026 chung kết**.
- 5 tiêu chí chấm: (1) phương pháp giải quyết vấn đề (vấn đề, nguyên nhân gốc, giải pháp); (2) sáng tạo; (3) khả thi; (4) tác động xã hội & môi trường; (5) trình bày tổng thể.
- Lĩnh vực: EdTech + ngân hàng/tài chính/kinh tế. Định hướng BTC: công cụ học tài chính dễ hiểu, **AI hỗ trợ chứ không thay thế con người**. Công nghệ khuyến khích: AI, blockchain, IoT, phân tích dữ liệu.
- ✅ **BTC đã đồng ý cho dùng AI** để dựng demo.
- ⚠️ **Quy định quan trọng:** bài *hoàn toàn do AI tạo, thiếu tư duy độc lập* sẽ bị loại; không được hỗ trợ từ giáo viên/người ngoài. → App có thể dựng bằng AI (đã được phép), nhưng **ý tưởng, thiết kế, lập luận trong PDF và lời thuyết trình phải là của nhóm**. Tài liệu này ghi lại quyết định của nhóm; khi viết proposal, nhóm tự viết.
- Thành viên (4): **Minh Hân** (tiếng Anh, thuyết trình, ý tưởng tác động xã hội; viết Problem & Objectives + Social Impacts & Values cùng Gia Mẫn) · **Gia Mẫn** (tiếng Anh, thuyết trình, trích dẫn nguồn, soát lỗi) · **Phước Tấn** (ý tưởng, biên tập, tìm thông tin tài chính/kinh tế) · **Quốc Huy** (tiếng Anh, hiện thực hóa ý tưởng, thuyết trình, sáng tạo).

### 1.2 Vấn đề (Problem) — đã chốt chia 2 phần lớn
1. ✅ **Nhiều người thiếu kiến thức tài chính** → dễ tiêu xài thiếu kế hoạch, nợ nần, sa vào lừa đảo, ra quyết định sai. Altifi cung cấp kiến thức + thực hành để **giảm thiểu những trường hợp đó** (có thể kết hợp với trường học).
2. ✅ **Những người muốn mở rộng hiểu biết** (như Minh Hân): muốn hiểu sâu, kiến thức **nâng cao, chuyên sâu** về tài chính – kinh tế, đọc hiểu các sự kiện kinh tế thế giới. Lessons hiện tại quá đơn giản và chán với nhóm này → phải có nội dung đi sâu.
- Góc nhìn trình bày với giám khảo (đã chốt trước): *"điều mọi người xem là bình thường nhưng thật ra không bình thường"* — teen thiếu nhận thức về thế giới kinh tế xung quanh. Nguyên nhân nhóm nêu: trường không dạy tài chính, GDKT&PL nặng lý thuyết thiếu thực hành. ⚠️ Nhận định "chương trình Bộ GD&ĐT không dạy tài chính" **chưa kiểm chứng**.
- Lý do phụ: teen cần hiểu tiền sớm vì ai cũng sẽ đi làm; quản lý dòng tiền là kỹ năng sống quan trọng; tiếp xúc case study thật có thể khơi mong muốn kinh doanh/lãnh đạo, giúp teen biết mình có hợp kinh doanh không.
- ✅ Số liệu teen muốn kinh doanh — nguồn gốc đã tìm: khảo sát của **Junior Achievement USA** (CNBC đưa tin 03/2022): **60% teen Mỹ 13–17 tuổi** (1.000 người) quan tâm đến việc *một ngày nào đó tự mở doanh nghiệp hơn là đi làm công việc truyền thống*; JA (do Wakefield Research thực hiện) công bố lại con số 60% vào 10/2023. ⚠️ Đây là số liệu **ở Mỹ**, không phải "trên thế giới" → khi trích dẫn ghi đúng phạm vi, vd: *"60% of US teens aged 13–17 would rather start their own business than work a traditional job (Junior Achievement USA, 2022)"*. Lập luận đi kèm: muốn kinh doanh tốt thì cần kiến thức tài chính.

### 1.3 Bằng chứng từ khảo sát của nhóm
**✅ Kết quả MỚI NHẤT — bản "TRONG TRƯỜNG" (46 phản hồi: lớp 9 = 21, lớp 10 = 25; chủ yếu IGCSE & Tích hợp).** ⚠️ Số liệu do Claude đọc tự động từ Google Sheets (mỗi câu cộng đủ 46) — nhóm nên đối chiếu lại với trang Tóm tắt của Google Forms trước khi đưa vào proposal.

| Câu hỏi | Kết quả |
|---|---|
| Nghề tương lai liên quan kinh tế/tài chính | Chắc chắn có 18 · Có thể 15 · Hiện chưa 9 · Chắc chắn không 4 |
| Thích học về tài chính | Thật sự thú vị 22 · Tạm được 12 · Chán/đáng sợ 7 · Không chắc 5 |
| Lý do e ngại (chọn nhiều, tùy chọn) | **Không biết bắt đầu từ đâu 23** · Không có ai hướng dẫn 11 · Thấy chán 11 · Nghề không cần 9 |
| Quản lý tài chính có quan trọng | Rất quan trọng 30 · Khá 9 · Không lắm 4 · Không chắc 3 (→ **85% thấy quan trọng**) |
| Tự chấm kiến thức 0–5 | 0:2 · 1:4 · 2:12 · 3:14 · 4:10 · 5:4 (TB ≈ 2,8) |
| **Lãi kép** | Đúng **6/46 (13%)** · "Không biết" 24 · **12 nhầm thành lãi đơn** |
| **Tài sản thế chấp** | Đúng 11/46 (24%) · "Không biết" 23 |
| **Lạm phát** | Đúng 14/46 (30%) · "Không biết" 16 · **7 nhầm thành mất giá so với ngoại tệ** |
| **Điểm tín dụng** | Đúng **6/46 (13%)** · "Không biết" 26 · 7 nhầm thành tổng tiết kiệm/đầu tư |
| **Dòng tiền** | Đúng 18/46 (39%) · "Không biết" 19 |
| **NHTW tăng lãi suất → khoản vay thả nổi** | Đúng (trả nhiều hơn) **6/46 (13%)** · "Không biết" 22 · **13 nghĩ khoản trả giữ nguyên** |
| Học về tiền chủ yếu từ đâu | Bố mẹ/gia đình 15 · Tự học 9 · Ở trường 7 · Mạng xã hội/video 7 · Chưa học 6 |
| Ghi chép/kiểm tra chi tiêu | Gần như mỗi ngày 7 · Mỗi tuần 8 · Mỗi tháng 11 · Vài lần/năm 8 · **Không bao giờ 11** |
| Đã dùng trong 3 tháng (chọn nhiều) | Mua online 22 · App ngân hàng 16 · Ví điện tử/QR 11 · Mua trong game/app 8 · **Vay bạn bè/người thân 8** · **Mua trước trả sau 6** · Không cái nào 14 |
| Mua đồ chủ yếu vì bạn bè có (tháng qua) | Không 22 · 1 lần 11 · 2–3 lần 6 · >3 lần 3 · Không mua gì 4 (→ **20/46 có**) |
| Nếu có cơ hội học thêm | **Cần người hướng dẫn 22** · Hào hứng tìm hiểu ngay 12 · Không hứng thú 8 · Không lắm nhưng không phiền 4 |
| Miễn phí, không rủi ro thì thử không | Chắc chắn 19 · Có thể, nếu có người học cùng 16 · Chắc không 9 · Không 2 |
| **Cách học muốn chọn (tối đa 2)** | **Game ra quyết định về tiền 22** · Giáo viên/mentor 12 · Video 12 · Bài ngắn mỗi ngày trên điện thoại 12 · Học trên lớp 11 · Đọc sách/bài 5 · Học nhóm 4 |

**💡 Hệ quả cho thiết kế app (dùng số liệu trên):**
- **Game ra quyết định là cách học được chọn nhiều nhất (22/46)** → củng cố việc game là trọng tâm. Video (12) và bài ngắn hằng ngày (12) → khớp format "video ngắn + quiz".
- **"Không biết bắt đầu từ đâu" (23) + "Cần người hướng dẫn" (22)** → bắt buộc có **bài test xếp lớp + lộ trình gợi ý** và **Alti Lion trợ lý dẫn dắt** ở mọi màn hình.
- **"Có thể, nếu có người học cùng" (16)** → 💡 cân nhắc tính năng học cùng bạn (🔜, ngoài demo).
- **Các hiểu sai phổ biến phải thành bài tập riêng:** lãi kép vs lãi đơn · lạm phát ≠ mất giá so với ngoại tệ · điểm tín dụng là khả năng trả nợ (không phải số tiền tiết kiệm) · **vay thả nổi khi lãi suất tăng thì khoản trả TĂNG** (13 người nghĩ giữ nguyên) · tài sản thế chấp.
- **Hành vi rủi ro thật:** mua trước trả sau, vay bạn bè, mua theo bạn bè, không ghi chép chi tiêu → đưa vào chế độ game Cá nhân (sự kiện "bạn bè rủ mua", BNPL, theo dõi chi tiêu).

**Kết quả cũ (bản ngoài trường, 29 phản hồi, đếm tay ~85–90% chính xác):**
- 28/29 (97%) thấy quản lý tài chính quan trọng; tự chấm kiến thức TB **2,2/5** (17/29 chấm 0–2).
- Trả lời đúng/29: lãi kép 12 · tài sản thế chấp 12 · điểm tín dụng 9 · lạm phát 15. Nhiều người chọn "I don't know". Hiểu sai phổ biến: 5 người nghĩ lạm phát = đồng tiền mất giá so với ngoại tệ.
- Hứng thú học thêm: 8 rất hào hứng · 11 quan tâm nhưng cần hướng dẫn · 10 không lắm nhưng không phiền. Nếu miễn phí không rủi ro: 21 chắc chắn thử, 7 có thể.
- Rào cản: không biết bắt đầu (12), không đủ tiền (12), sợ mất tiền (7), không có người hướng dẫn (7), nhàm chán (5).
- Bản "trong trường" (được ban giám hiệu cho phép) đã có 46 phản hồi — xem bảng kết quả mới nhất ở trên. Dự định thêm khảo sát phụ huynh (có muốn cho con dùng / sẵn sàng trả tiền?).
- 💡 Gợi ý dùng trong app: các khái niệm nhiều người sai (lãi kép, tài sản thế chấp, điểm tín dụng, lạm phát, lãi suất thả nổi) nên có bài học riêng; câu "lạm phát ≠ mất giá so với ngoại tệ" nên là một bài tập.

### 1.4 Người dùng
- ✅ Teen Việt Nam (bản nháp: lớp 8–12; độ tuổi cuối chưa chốt), bất kỳ teen nào muốn học. Thị trường chính: **Việt Nam**.
- ✅ 2 nhóm: (a) cần học để tự quản lý tài chính; (b) muốn học nâng cao để hiểu biết.

### 1.5 Mô hình kinh doanh (chưa chốt hoàn toàn)
- Chủ yếu **subscription freemium** (như Duolingo, chess.com; phụ huynh hoặc teen trả). B2B với trường học là phương án phụ (còn cân nhắc vì rủi ro).

---

## 2. Yêu cầu chung cho bản demo

| Hạng mục | Quyết định |
|---|---|
| Nền tảng | ✅ **Web app chạy giống app** — KHÔNG phải app native (không lên App Store/Google Play). Mở bằng trình duyệt trên điện thoại hoặc máy tính; trên máy tính hiển thị trong khung điện thoại (max-width ~400px), trên điện thoại full màn hình. 💡 Làm thành **PWA** (có manifest + icon + service worker) để người dùng **"Thêm vào màn hình chính"** — mở lên trông y như app, không có thanh trình duyệt. 🔜 Bản thật có thể đóng gói thành app native (vd Capacitor) từ cùng mã nguồn. |
| Ngôn ngữ | ✅ **Song ngữ Tiếng Việt + English**, có nút chuyển VI/EN (lưu lựa chọn). Mọi nội dung (UI, lessons, case, Alti Lion) cần có cả 2 bản. Video thi bằng tiếng Anh → bản EN phải hoàn chỉnh. |
| AI | ✅ **Không phát sinh chi phí API.** Alti Lion và phần "AI phân tích" trong demo là **giả lập** (câu trả lời soạn sẵn + luật đơn giản), có ghi chú "Demo — bản đầy đủ dùng AI". Không đặt API key trong frontend. 🔜 Bản thật: AI thật + truy xuất từ kho nguồn đã kiểm chứng (RAG) để không bịa. |
| Hình ảnh | ✅ Dùng **ảnh thật** khi có thể: ảnh lịch sử thuộc phạm vi công cộng (Wikimedia Commons) và ảnh miễn phí bản quyền (Unsplash/Pexels…), **ghi nguồn/attribution**. Cần mạng khi demo (hoặc tải ảnh về thư mục `assets/` nếu giấy phép cho phép). Không dùng ảnh có bản quyền, ảnh nhân vật/thương hiệu nổi tiếng. |
| Video | ✅ Claude **không tạo được video thật**. Giải pháp: **video hoạt họa bằng code** (motion graphic HTML/CSS/SVG/JS, chạy theo cảnh, có thể thuyết minh bằng Web Speech API — giọng tiếng Việt tùy thiết bị). Làm thật đẹp **2–3 bài mẫu**; các bài khác dùng nhiều hình minh họa + ảnh thật. Mẫu tham khảo nhóm đưa: một video giải thích kiến thức dạng TikTok (https://vt.tiktok.com/ZSgjdbcbv/ — Claude chưa xem được nội dung link). 🔜 Bản thật: dùng công cụ AI tạo video hoặc nhóm tự quay. |
| Lưu tiến độ | localStorage (demo). Có cơ chế **migrate save cũ** từ cả 2 bản: base (`altifi-demo-v1`) và v3 (`altifi-demo-v2`) — không làm mất cài đặt, hồ sơ, linh vật, tiến độ. |
| Phạm vi | Xem mục 3.4 và mục 12. |

---

## 3. LESSONS (phần Học)

### 3.1 Cấu trúc: 5 mảng tài chính ✅

> ⭐ **Đã thay đổi 18/10 chiều:** xem **13.2 (6 mảng, 20 bài)** (mục 13 thắng khi mâu thuẫn).
1. **Tài chính cá nhân (Personal Finance)** — lập ngân sách & kiểm soát chi tiêu (50/30/20, ghi chép thu chi); tiết kiệm & quỹ khẩn cấp (3–6 tháng chi phí, lãi kép); tín dụng & nợ (điểm tín dụng, thẻ tín dụng an toàn, vay tiêu dùng, thế chấp); bảo hiểm (y tế, nhân thọ, tài sản); kế hoạch hưu trí (tích lũy & đầu tư dài hạn).
2. **Tài chính doanh nghiệp (Corporate Finance)** — phân tích báo cáo tài chính (Bảng cân đối kế toán, Báo cáo kết quả kinh doanh, Báo cáo lưu chuyển tiền tệ); đầu tư & ngân sách vốn (NPV, IRR); cấu trúc vốn & chi phí vốn (nợ vs vốn chủ sở hữu); quản trị vốn lưu động (tiền mặt, tồn kho, phải thu – phải trả).
3. **Thị trường tài chính & Đầu tư** — các kênh đầu tư (gửi tiết kiệm, cổ phiếu, trái phiếu, quỹ mở/ETF, bất động sản, vàng, ngoại tệ); công cụ phái sinh (hợp đồng tương lai, quyền chọn, kỳ hạn, hoán đổi); định giá tài sản & quản trị rủi ro (Beta, độ biến động, giá trị thực).
4. **Tài chính công (Public Finance)** — ngân sách nhà nước (thuế, phí, lệ phí, đầu tư công); chính sách tài khóa (dùng thuế & chi tiêu công để điều tiết lạm phát, kích thích/kìm hãm tăng trưởng).
5. **Tài chính quốc tế (International Finance)** — tỷ giá hối đoái & thị trường ngoại hối; cán cân thanh toán (dòng vốn, xuất nhập khẩu), IMF, World Bank.

### 3.2 Nguyên tắc học ✅
- **Không ép học từ thấp lên cao** — học mảng nào, bài nào cũng được.
- 💡 Để người nhảy cóc vẫn hiểu: mỗi bài nâng cao có dòng **"Nên biết trước: …"** + nút **"Ôn nhanh 1 phút"** (thẻ tóm tắt khái niệm nền). Thêm **bài test xếp lớp** (placement test, ~8–10 câu) khi mới vào để gợi ý điểm bắt đầu và đặt trình độ cho Alti Lion.
- ✅ **Độ sâu:** nội dung phải *thú vị, mới, có chiều sâu*, không dừng ở mức hiển nhiên. Mỗi bài nên có: một **hiện tượng/câu chuyện thật** mở đầu (ảnh thật), **cơ chế** (vì sao nó vận hành như vậy), **con số/công thức** khi phù hợp, **case thật**, và **bẫy hiểu sai phổ biến**.
- ✅ **Mỗi bài = video/hoạt họa ngắn giải thích → bài tập (quiz) tương tác**. Nếu không có video thì **nhiều hình ảnh** (ảnh thật + minh họa).
- 💡 Mỗi bài có **2 tầng**: "Cơ bản" (ai cũng hiểu) và **"Đào sâu" (Deep dive)** tùy chọn cho người muốn nâng cao (công thức, tranh luận học thuật, số liệu). Tầng này giải quyết vấn đề #2 (người muốn hiểu sâu thấy bài quá dễ).

### 3.3 Các dạng bài tập (đã có trong prototype — giữ và nâng cấp) ✅
`learn` (thẻ ý tưởng có hình) · `pick` (chọn hình) · `mcq` (trắc nghiệm) · `sort` (phân loại thẻ bay vào giỏ, 2–3 giỏ) · `match` (nối cặp) · `order` (sắp xếp thứ tự) · `slider` (ước lượng con số) · `jars` (chia tiền vào các hũ, vd 50/30/20) · `spot` (bấm vào cờ đỏ trong một bài đăng mạng xã hội giả) · `tap` (tìm "rò rỉ tiền" trong hóa đơn).
💡 Thêm cho nội dung nâng cao: **đọc biểu đồ** (biểu đồ thật, hỏi suy luận), **tính toán nhiều bước** (NPV, lãi kép, tỷ giá), **đọc báo cáo tài chính mini** (bảng số → tìm vấn đề), **giải thích bằng lời** (gõ 1–2 câu; demo chấm bằng từ khóa, 🔜 bản thật AI chấm), **dự đoán rồi xem kết quả thật**.
- Hiển thị phản hồi ngay, có giải thích "vì sao" sau mỗi câu. XP = 10 + 5 × số bài tập đúng.

### 3.4 Phạm vi lessons cho demo ✅

> ⭐ **Đã thay đổi 18/10 chiều:** xem **13.2d (danh sách bài mới)** (mục 13 thắng khi mâu thuẫn).
- **Tài chính cá nhân** và **Tài chính doanh nghiệp**: làm **sâu** (đề xuất ~6 bài mỗi mảng).
- **Thị trường & Đầu tư, Tài chính công, Tài chính quốc tế**: **mỗi mảng 2 bài**, và **mỗi bài phải đi sâu hơn hẳn mức hiện tại** (không còn đơn giản như 8 bài cũ).
- **2–3 bài có video hoạt họa** (đề xuất: 1 bài cá nhân như *Lãi kép*, 1 bài doanh nghiệp như *Lợi nhuận ≠ tiền mặt*, 1 bài quốc tế như *Tỷ giá*).

💡 Danh sách bài đề xuất (nhóm có thể chỉnh):

**Tài chính cá nhân (6)**
1. Ngân sách & 50/30/20 — kèm "rò rỉ tiền" (latte factor), ghi chép thu chi.
2. Quỹ khẩn cấp, lạm phát & lãi kép — lạm phát ≠ mất giá so với ngoại tệ (bẫy hiểu sai từ khảo sát); lãi suất thực = danh nghĩa − lạm phát; Rule of 72.
3. Tín dụng & nợ — điểm tín dụng (ở VN: CIC), thẻ tín dụng an toàn, trả tối thiểu, BNPL, vay tiêu dùng, **tài sản thế chấp**.
4. Lãi suất cố định vs thả nổi — ai lợi khi NHTW tăng lãi suất (gắn câu khảo sát).
5. Bảo hiểm — y tế, nhân thọ, tài sản; phí bảo hiểm, mức khấu trừ; khi nào cần/không cần.
6. Hưu trí & đầu tư dài hạn — sức mạnh thời gian, đa dạng hóa, lừa đảo (Ponzi, cờ đỏ), **trái phiếu ≠ tiền gửi**.

**Tài chính doanh nghiệp (6)**
1. Doanh thu – chi phí – lợi nhuận; chi phí cố định vs biến đổi; điểm hòa vốn.
2. Ba báo cáo tài chính (đọc báo cáo mini của một quán trà sữa).
3. Lợi nhuận ≠ tiền mặt; vốn lưu động (tồn kho, phải thu, phải trả).
4. NPV & IRR — chọn dự án nào để rót vốn.
5. Cấu trúc vốn: vay nợ vs gọi vốn; đòn bẩy; chi phí vốn.
6. Tăng trưởng thông minh & sự đổi mới phá vỡ (test → đo → sửa → mở rộng; Kodak, Starbucks 2008).

**Thị trường & Đầu tư (2)**
1. Các kênh đầu tư & rủi ro – lợi nhuận (tiết kiệm, cổ phiếu, trái phiếu, quỹ/ETF, BĐS, vàng, ngoại tệ); đa dạng hóa; Beta, độ biến động.
2. Định giá & phái sinh — giá trị thực vs giá thị trường; hợp đồng tương lai, quyền chọn, kỳ hạn, hoán đổi dùng để phòng ngừa rủi ro (vd hãng hàng không phòng ngừa giá dầu).

**Tài chính công (2)**
1. Ngân sách nhà nước — tiền thuế đến từ đâu, đi về đâu (thuế, phí, lệ phí; đầu tư công vào hạ tầng, xã hội); thâm hụt & nợ công.
2. Chính sách tài khóa vs tiền tệ — chính phủ (thuế/chi tiêu) và NHTW (lãi suất) cùng điều tiết lạm phát & tăng trưởng; case: gói kích thích 2008–2009, COVID-19.

**Tài chính quốc tế (2)**
1. Tỷ giá & thị trường ngoại hối — vì sao VND lên/xuống so với USD; tác động lên du học, xuất khẩu, giá iPhone.
2. Cán cân thanh toán, dòng vốn & IMF/World Bank — case: khủng hoảng tài chính châu Á 1997.

> ✅ **Lessons làm mới hoàn toàn**: không tái sử dụng nội dung 12 bài cũ (chỉ dùng lại engine dạng bài tập).

---

## 4. KHÁM PHÁ — Đọc sự kiện tài chính thế giới ✅
- Mục riêng để **đọc & học về các sự kiện tài chính – kinh tế** (công ty, nhân vật, cổ phiếu, khủng hoảng, nền kinh tế các nước…). Ví dụ nhóm nêu: **Elon Musk & SpaceX**, cổ phiếu, khủng hoảng kinh tế, kinh tế các nước.
- Nội dung do **AI tổng hợp từ nguồn uy tín** và **phân tích dựa trên các nguồn đó** (ghi rõ nguồn). Có phân tích **góc nhìn từng bên** liên quan.
- **Alti Lion** giải thích mọi thuật ngữ/thắc mắc khi đọc (trợ lý góc phải).
- Có video ngắn nếu được, không thì **nhiều hình ảnh**.
- ✅ **Demo: 3–5 bài mẫu** soạn sẵn từ nguồn uy tín (không cập nhật tin thật hằng ngày). 🔜 Bản thật: cập nhật thường xuyên; cấp cao: học tin mới, dự đoán diễn biến, ra quyết định theo vai.
- 💡 Đề xuất 5 bài mẫu: (1) SpaceX — vì sao một công ty tư nhân có thể định giá rất cao dù chưa niêm yết; (2) Một đợt tăng lãi suất của NHTW ảnh hưởng thế nào đến người vay/gửi; (3) Khủng hoảng tài chính châu Á 1997; (4) Vì sao giá vàng tăng khi thị trường bất ổn; (5) Một câu chuyện doanh nghiệp Việt Nam (chọn chủ đề trung lập). ⚠️ Kiểm chứng mọi số liệu trước khi đưa vào, ghi nguồn.
- 💡 Mỗi bài: tiêu đề + ảnh thật → tóm tắt 30 giây → "Chuyện gì đã xảy ra" → "Vì sao quan trọng" → "Góc nhìn các bên" → 2–3 câu quiz → nút "Hỏi Alti Lion".
- Cảnh báo bản quyền: tóm tắt bằng lời của mình, không chép nguyên văn bài báo.

---

## 5. ALTI LION — Trợ lý AI đồng hành ✅

### 5.1 Vị trí & vai trò
- **Trợ lý nổi ở góc phải** (bong bóng/nút nổi), có mặt ở **mọi màn hình** (lesson, Khám phá, game). Bấm vào → khung chat. Alti Lion **biết ngữ cảnh**: đang ở bài nào/sự kiện nào/case nào thì giải thích đúng nội dung đó.
- Tab "Ask Alti Lion" riêng vẫn có thể giữ (chat đầy đủ).

### 5.2 Trả lời theo trình độ ✅ (đã có trong prototype — giữ)
- 3 chế độ: **🌱 Newbie** (từ đơn giản, ví dụ đời thường, emoji) · **📘 Learner** (dữ kiện rõ ràng, có số liệu) · **🎓 Pro / Professor** (thuật ngữ, lý thuyết, học thuật — như giáo sư).
- **Tự động** theo tiến độ (số bài đã học + cấp trong game + kết quả placement test); người dùng có thể **đổi thủ công**; nếu câu hỏi có **thuật ngữ chuyên sâu** (CPI, Fisher, CAPM, duration, swap, leverage…) thì trả lời câu đó ở chế độ Pro và ghi chú. Ở chế độ Pro, Alti Lion đội mũ tốt nghiệp.
- Demo: kho câu trả lời soạn sẵn, mỗi chủ đề 3 phiên bản (n/l/p), song ngữ. Có câu fallback cho câu hỏi ngoài kho.

### 5.3 Linh vật — ✅ ĐỔI THÀNH SƯ TỬ
- ✅ **Alti Lion là một chú sư tử** (thay cho đồng xu cũ). Nhóm đưa một hình tham khảo (con mèo lớn màu hồng đậm, phong cách minh họa phẳng, nhiều đốm, mắt vàng hổ phách). ⚠️ Hình đó là tác phẩm của người khác → **chỉ lấy cảm hứng phong cách, không sao chép**.
- ✅ Thiết kế đã dựng: **`alti-lion.html`** — sư tử gốc, phẳng, bo tròn, hợp app: **bờm lượn sóng có đốm**, mặt tròn, má hồng, **mắt hổ phách**, mũi hình tim, miệng ":3", **mặt dây chuyền đồng xu ₫** (giữ liên hệ với tài chính & linh vật cũ). Màu mặc định **Rose (hồng)**; 6 màu: Rose, Gold, Coral, Grape, Mint, Sky; 6 kiểu mắt: Amber, Sparkly, Happy, Sleepy, Wink, Cool; 6 kiểu miệng: Kitty, Smile, Big grin, Silly, Ooh, Calm; 4 cảm xúc: happy, cheer, wow, sad.
- Hàm `tikoLion(size, mood, cfg)` cùng chữ ký với `tiko()` cũ → **thay thế trực tiếp** mọi chỗ gọi `tiko()` trong giao diện nền. Phụ kiện cũ (mũ, kính, nơ…) cần căn lại toạ độ cho đầu sư tử. Trang tùy biến buddy giữ nguyên, đổi bộ tile sang mắt/miệng/màu của sư tử.
- 💡 Cần thêm cho bản app: hoạt ảnh nhỏ (chớp mắt, bờm rung nhẹ khi vui, đuôi vẫy nếu vẽ toàn thân) và biểu cảm "laugh" mà giao diện nền đang dùng. ✅ **Tên chính thức: Alti Lion** (trước đây là "Tiko"). Đổi mọi chỗ hiển thị trong app: tab "Ask Alti Lion", lời chào, bong bóng thoại, thông báo… Người dùng vẫn đặt lại tên riêng được trong trang tùy biến; mặc định = "Alti Lion". (Tên hàm trong code như `tiko()`, `tikoLion()` có thể giữ hoặc đổi — không ảnh hưởng người dùng.)
- (Cũ) Đồng xu vàng có mầm cây, má hồng. **Tùy biến được** (đã có): đổi tên, mắt (6), miệng (6), màu (6), mũ (5), kính (3), phụ kiện (4); có nút xúc xắc đặt tên ngẫu nhiên; nút Save chỉ hiện khi có thay đổi; hỏi trước khi rời mà chưa lưu. Tên hiển thị của linh vật ở mọi nơi đổi theo tên người dùng đặt.

---

## 6. GAME ✅

### 6.1 Nguyên tắc chung
- **Nhân vật chính là người dùng**, tùy biến ngoại hình (da, kiểu tóc, màu tóc, áo, quần, phụ kiện, tên) — đã có trong prototype.
- **Đồ họa phải đẹp hơn hiện tại**, nét **giống Animal Crossing**: 2D góc nhìn từ trên xuống / 3/4, màu pastel, bo tròn, cây cối, hoa, nhân vật chibi có hoạt ảnh đi lại. (Không làm 3D.) Có thể vẽ SVG kỹ hơn hoặc dùng bộ asset miễn phí bản quyền (CC0, vd Kenney) — ghi nguồn. 💡 Có thể dùng engine 2D (vd Phaser) nếu cần chuyển động phong phú.
- **Luôn hiển thị NET WORTH.** Nước đi **brilliant → nhiều tiền hơn**; **terrible → mất tiền**; mất nhiều → **PHÁ SẢN** (game over cho màn đó, có tổng kết bài học & chơi lại).
- **Game chia theo mảng/giai đoạn học** — học mảng nào thì chơi chế độ tương ứng (mục 6.3).
- **Độ khó tăng dần** ✅:
  - Tài chính cá nhân: **chưa cần brilliant, "good move" là đủ** để tiến bộ.
  - Lên cao (tạo ra tiền, doanh nghiệp…) mới cần **brilliant**. Càng lên cao càng đòi **tư duy logic, giải quyết vấn đề, lãnh đạo, tư duy kinh doanh – tài chính** thật sự — không dễ đoán như bản hiện tại.
  - 💡 Ở cấp cao: người chơi **chọn phương án + viết lý do 1–2 câu**; AI chấm cả lập luận (demo: chấm theo từ khóa/luật; 🔜 AI thật dựa trên kho case đã kiểm chứng).
- 💡 **Phương án đúng không được lộ qua giọng văn**: các lựa chọn phải có **đánh đổi thật**, đáp án tốt nhất phụ thuộc tình huống của người chơi (tiền tiết kiệm, nợ, lãi suất…) hoặc cần tính một con số.
- 💡 **Yếu tố ngẫu nhiên:** quyết định đúng vẫn có thể gặp xui (và ngược lại) → dạy "quyết định tốt ≠ kết quả tốt".
- 💡 **Nguồn tiêu tiền & mục tiêu:** tránh tình trạng tiền dồn vô nghĩa (prototype có lúc tích 93 triệu không làm gì).
- **AI phân tích mọi nước đi** (rating kiểu cờ vua: `!!` Brilliant, `!` Excellent, `★` Good, `!?` Okay, `?!` Risky, `??` Terrible) + **"Góc nhìn từng bên"** (2–4 bên liên quan) + **"Chuyện gì đã thực sự xảy ra"** (với case lịch sử).
- Kiến thức gắn với học: case cần kiến thức nào thì hiển thị **"📖 Ôn nhanh"** tóm tắt bài đó trước khi chọn; nếu chưa học, Alti Lion gợi ý bài cần học (💡 không khóa cứng vì nhóm chốt *không ép thứ tự* — có thể cho chơi nhưng cảnh báo, hoặc khóa nhẹ với nút "Học ngay").
- ✅ **Game là nơi ôn lại kiến thức** bằng **case thật lấy từ sự kiện lịch sử** (để AI phân tích chính xác hơn).
- 💡 Ý tưởng nhóm từng có, đưa lại: **nhập vai nhiều góc**: thống đốc NHTW, chủ doanh nghiệp, chính phủ, người gửi tiền…

### 6.1b Bản đồ thế giới — RỘNG HƠN NHIỀU ✅

> ⭐ **Đã thay đổi 18/10 chiều:** xem **13.3 (low-poly, joystick, khu thứ 7)** (mục 13 thắng khi mâu thuẫn).
✅ Nhóm chốt: **đồ họa game đẹp hơn và bản đồ rộng hơn nhiều** so với prototype (prototype chỉ có 1 khung bản đồ vừa màn hình). Vì app giữ dạng khung điện thoại, bản đồ phải là **thế giới cuộn được**:
- **Kích thước thế giới** khoảng **4–5 lần màn hình mỗi chiều** (vd ~1600 × 2400 px logic). Màn hình là "camera" **đi theo nhân vật**; người chơi **kéo để di chuyển bản đồ**, **zoom** (chụm 2 ngón / con lăn chuột), có nút **"về nhân vật"** và **bản đồ thu nhỏ (minimap)**.
- **Bấm vào đâu đi tới đó** theo đường đi (tìm đường đơn giản trên lưới), có hoạt ảnh bước đi, lật hướng, bóng đổ.
- **Các khu (district), mỗi khu gắn với một mảng học** — học mảng nào thì khu đó "sáng lên"/mở rộng:
  1. 🏡 **Khu dân cư** — Tài chính cá nhân: nhà mình, chợ, ngân hàng, bệnh viện/bảo hiểm, nơi làm việc đầu tiên.
  2. 🏪 **Phố kinh doanh** — Tài chính doanh nghiệp: HQ, **nhiều lô đất trống** rải khắp phố để mở chi nhánh (không chỉ 3 lô), nhà cung cấp, kho.
  3. 📈 **Khu tài chính** — Thị trường & Đầu tư: sàn giao dịch với bảng điện tử chạy giá, tòa nhà quỹ đầu tư, tiệm vàng, quầy đổi ngoại tệ.
  4. 🏛️ **Trung tâm hành chính** — Tài chính công: tòa thị chính / bộ tài chính, kho bạc, công trình đầu tư công (cầu, trường) thay đổi theo quyết định ngân sách.
  5. ⚓ **Cảng & sân bay** — Tài chính quốc tế: tàu hàng xuất nhập khẩu, bảng tỷ giá.
  6. 🏛️📜 **Bảo tàng Lịch sử** — cửa vào **chế độ Khủng hoảng** (mỗi phòng = một cuộc khủng hoảng; bước vào thì thị trấn biến thành bối cảnh năm đó — xem 6.4).
- **Sự sống trên bản đồ:** NPC đi lại, xe chạy, chim/bướm, nước lấp lánh, cây đung đưa; **dùng lại hiệu ứng thời tiết** của giao diện nền (mưa/nắng/tuyết) trên bản đồ; 💡 chu kỳ ngày–đêm (đèn bật ban đêm) nếu kịp.
- **Thị trường phản ánh lên bản đồ:** kinh tế tốt → phố đông, đèn sáng; suy thoái → cửa hàng đóng, biển "cho thuê"; chi nhánh của người chơi mọc trên các lô đất.
- **Phong cách:** Animal Crossing — pastel, bo tròn, viền mềm, đổ bóng nhẹ; 2D top-down/3/4. 💡 Để kịp 6 ngày: dùng **bộ asset miễn phí bản quyền (CC0, vd Kenney)** cho đường, cây, nhà, rồi tô lại màu pastel; tự vẽ SVG cho nhân vật & công trình đặc trưng. Ghi nguồn trong `assets/CREDITS.md`.
- 💡 Kỹ thuật: Canvas hoặc **Phaser** (camera, tilemap, tween có sẵn) sẽ nhanh hơn tự viết SVG cho thế giới lớn; giữ hiệu năng tốt trên điện thoại; tôn trọng **Potato Mode** (tắt NPC/hiệu ứng).

### 6.2 Thị trường mô phỏng ✅ / 💡
- Game **giả lập một thị trường kinh tế giống Việt Nam hiện tại** (đơn giản hóa): lãi suất (có NHTW điều chỉnh), lạm phát, một chỉ số chứng khoán kiểu VN-Index, giá vàng, tỷ giá USD/VND, giá thuê mặt bằng, lương… dùng **số liệu gần thật** (⚠️ kiểm chứng & ghi nguồn khi chốt tham số).
- Doanh nghiệp của người chơi **thành công hay thất bại** tùy quyết định + biến động thị trường.
- Prototype đã có cơ chế lãi suất tăng dần theo tháng (4,8% → 12%/năm) làm lựa chọn cố định/thả nổi có hậu quả thật — giữ ý này, tinh chỉnh theo số liệu VN.

### 6.3 Các chế độ chơi theo mảng
1. **Cá nhân — "Cuộc sống của tôi"**: nhân vật đi làm có lương; lập ngân sách, chi tiêu ở chợ (needs vs wants ảnh hưởng tâm trạng), tiết kiệm ở ngân hàng (lãi cố định/thả nổi), **quản lý tín dụng** (thẻ, điểm tín dụng, vay), **bảo hiểm** (sự kiện bất ngờ: ốm, mất đồ…), cuối tháng về nhà trả tiền nhà/ăn & xem báo cáo tháng. Case cá nhân (lương đầu tiên, quỹ "không bao giờ lỗ", sản phẩm "tiết kiệm" tại quầy ngân hàng, vay mua nhà lãi mồi…). Good move là đủ.
2. **Doanh nghiệp — "Doanh nghiệp của tôi"**: **sở hữu & điều hành một doanh nghiệp** (trà sữa / tiệm bánh / trung tâm dạy thêm…), huy động vốn (vay cố định/thả nổi, gọi vốn), đọc báo cáo tài chính của chính mình, quản lý vốn lưu động, chọn dự án (NPV), **mở chi nhánh trên bản đồ** → chuỗi → **đế chế kinh doanh**. Cần brilliant + lý do.
3. **Thị trường & Đầu tư** (💡): quản lý danh mục đầu tư mô phỏng (tiết kiệm, cổ phiếu, vàng, quỹ…) trong thị trường giả lập; phái sinh để phòng ngừa rủi ro.
4. **Tài chính công** (💡): đóng vai **bộ trưởng tài chính/chính phủ** — chia ngân sách, chỉnh thuế, chi tiêu công khi kinh tế nóng/lạnh.
5. **Tài chính quốc tế** (💡): đóng vai **doanh nghiệp xuất nhập khẩu** chịu biến động tỷ giá; hoặc NHTW giữ ổn định tỷ giá.
- ✅ Teen **hóa thân thành businessman/businesswoman** và hành động khi học tới các phần doanh nghiệp, công, quốc tế.
- Demo: làm hoàn chỉnh **(1) Cá nhân** và **(2) Doanh nghiệp**; (3)(4)(5) có thể là màn chơi ngắn/mẫu nếu kịp (xem mục 12).

### 6.4 Chế độ Khủng hoảng lịch sử ✅ (phần game riêng)
Hình dung đã chốt:
- **1929 — Đại khủng hoảng:** thị trấn đang vui thì **bảng giá cổ phiếu chuyển đỏ**; người dân **xếp hàng dài trước ngân hàng (bank run)**; **đèn các cửa hàng tắt dần** trên bản đồ; người thất nghiệp ngồi ghế đá. Người chơi giữ doanh nghiệp sống sót qua từng tháng.
- **1973 — Khủng hoảng dầu mỏ:** **biển giá xăng lật số liên tục**, xe xếp hàng ở trạm xăng, chi phí tăng vọt.
- **2008 — Khủng hoảng tài chính:** **biển "nhà bị thu hồi" lan dần** từ nhà này sang nhà khác như dịch bệnh; **ngân hàng đổ như domino**.
- **Đổi vai:** cùng một cuộc khủng hoảng chơi lại ở vai **thống đốc NHTW (xoay núm lãi suất)**, **chính phủ (cứu hay không cứu ngân hàng)**, **người gửi tiền**…
- ⚠️ **Sửa lỗi "spoil":** đặt người chơi ở thời điểm **TRƯỚC** sự kiện (vd tháng 9/1929: "cổ phiếu tăng gấp đôi, ai cũng giàu"), quyết định xong mới **công bố chuyện gì xảy ra**. Không để headline lộ kết quả trước.

### 6.5 Thư viện case thật (đã viết trong prototype — giữ, sửa theo 6.4)
Mỗi case: năm, nơi, tiêu đề, ảnh/emoji, tóm tắt kiến thức cần ôn, tình huống, 3 lựa chọn (rating + hiệu ứng + phân tích), **3 góc nhìn**, **sự thật lịch sử**.
| Case | Kiến thức | Góc nhìn |
|---|---|---|
| Lương đầu tiên (nghiên cứu Madrian & Shea 2001: tự động đăng ký tiết kiệm → tham gia từ ~37% lên 86%) | Ngân sách | Bạn hôm nay · Bạn tương lai · Chủ nhà |
| Quỹ "không bao giờ lỗ" — Madoff, Mỹ 2008 (~65 tỷ USD; 150 năm tù) | Lừa đảo | Nhà đầu tư · Kẻ điều hành quỹ · Người tố giác (Harry Markopolos)/SEC |
| Sản phẩm "tiết kiệm" tại quầy ngân hàng — Việt Nam 2022 (**viết ẩn danh**: "một tập đoàn bất động sản" & "một ngân hàng thương mại") | Trái phiếu vs tiền gửi | Người mua · Nhân viên ngân hàng · Cơ quan quản lý |
| Tiết kiệm cố định hay thả nổi — làn sóng tăng lãi suất 2022 (Fed từ ~0% lên >5%; NHNN tăng lãi suất điều hành cuối 2022) | Lãi suất cố định/thả nổi | Người gửi · Người vay · NHTW |
| Vay mua nhà lãi mồi — Mỹ 2007 (subprime, Lehman phá sản 9/2008) | Tín dụng & nợ | Người vay · Bên cho vay · Phần còn lại của thế giới |
| Vay vốn mở doanh nghiệp: cố định hay thả nổi — 2022–23 | Lãi suất | Chủ doanh nghiệp nhỏ · Ngân hàng · NHTW |
| Chi phí tăng vọt — khủng hoảng dầu 1973 (giá dầu ~x4, "stagflation") | Lợi nhuận | Doanh nghiệp · Gia đình · Nước sản xuất dầu |
| Mở 10 chi nhánh cùng lúc? — Starbucks 7/2008 đóng ~600 cửa hàng | Tăng trưởng | Starbucks · Howard Schultz · Nhân viên |
| Vay tiền mua cổ phiếu — 1929 (margin; thất nghiệp Mỹ ~25%) | Đòn bẩy/nợ | Nhà đầu tư · Ngân hàng · Người lao động |
| Công nghệ mới giết sản phẩm cũ — Kodak (máy ảnh số 1975, phá sản 1/2012) | Đổi mới phá vỡ | Kodak · Khách hàng · Đối thủ |
- ✅ Case trái phiếu tại quầy ngân hàng (VN 2022) **viết ẩn danh**: KHÔNG nêu tên tập đoàn, ngân hàng hay cá nhân nào; chỉ dùng "một tập đoàn bất động sản lớn", "một ngân hàng thương mại", "ngân hàng nhà nước đặt ngân hàng này vào diện kiểm soát đặc biệt". Áp dụng cho mọi nơi trong app (case, bài học, Khám phá, câu trả lời Alti Lion).
- ⚠️ Kiểm chứng lại toàn bộ số liệu lịch sử trước khi nộp.

### 6.6 Những gì prototype game đang có (tham khảo tái sử dụng)
- Bản đồ thị trấn SVG: ngân hàng, văn phòng (thành HQ khi làm chủ), chợ, nhà, đài phun nước, hồ, cây, hoa; 3 lô đất trống "FOR SALE" → mọc chi nhánh khi mở rộng.
- Nhân vật đi bộ tới tòa nhà khi bấm (qua quảng trường, có lật hướng & nhún).
- Vòng lặp theo **tháng**: 1 quyết định/tháng ở văn phòng/HQ → chợ (mua wants tăng tâm trạng, khóa học tăng hiệu suất) → ngân hàng (gửi/rút, trả nợ vay) → về nhà kết thúc tháng (lương/lợi nhuận, tiền nhà 2tr + ăn 1,5tr, lãi tiết kiệm, lãi nợ 3%/tháng nếu tiền âm, báo cáo + mẹo của Alti Lion).
- Thang nghề: Intern (5tr) → Staff (8tr) → Senior Analyst (12tr) → Founder & Owner → Chain Owner → Business Tycoon 👑 (4 chi nhánh). Trang phục tự nâng cấp (cà vạt → vest → vương miện).
- Tâm trạng: giảm 12/tháng; thấp (<30) thì hiệu suất giảm một nửa (burnout).
- Doanh nghiệp: vốn mở 30tr (tiết kiệm + vay ≥5tr), chi nhánh 20tr (tiền mặt hoặc vay), "customer love" (⭐) ảnh hưởng doanh thu; loại vay: cố định 9,6%/năm · thả nổi (thị trường + 3,6%) · thẻ tín dụng 24%/năm.
- ⚠️ Các vấn đề Claude đã nhận xét (cần sửa ở bản mới): headline spoil kết quả; đáp án dễ đoán; "AI phân tích" là text soạn sẵn (giám khảo sẽ hỏi cơ chế); chưa có rủi ro thất bại/phá sản thật; tiền dồn vô nghĩa; khó chơi lại (10 case là hết) → cần nguồn case liên tục (🔜 AI tạo case từ tin thời sự) + chơi lại ở vai khác.

---

## 7. Các phần khác của app (prototype đã có)
- **Thanh trên:** logo altifi, 🔥 streak, ⭐ XP, 💵 tiền trong game. → Thêm **net worth**.
- ✅ **Thanh điều hướng (chốt, 5 tab):** **Học · Khám phá · Chơi · Tôi · Cài đặt** (EN: Learn · Explore · Play · Me · Settings). Tab "Ask Alti Lion" cũ được thay bằng **nút Alti Lion nổi góc phải** (mở khung chat đầy đủ, có ngữ cảnh) trên mọi màn hình. Tab "Crisis Game" của base → tab **Chơi**.
- **Me:** nhân vật, linh vật, streak, XP, số bài, net worth; **nhắc học hằng ngày** vào đúng giờ người dùng mở app hôm trước (có nút xem trước thông báo); nút Reset demo.
- **Lộ trình bài học dạng nút tròn** kiểu Duolingo (mở khóa, sao, nút START nhấp nháy).

---

## 8. Chiến lược demo & video (cho hạn 1/11)
- 💡 Video ≤ 2 phút: chỉ khoe **một vòng thật mượt**: học 1 bài (có video hoạt họa) → mở/ôn 1 case lịch sử → ra quyết định + viết lý do → AI phân tích + góc nhìn các bên → thấy hậu quả trên bản đồ / net worth → hỏi Alti Lion 1 câu. Giám khảo nhớ một vòng rõ ràng hơn 10 tính năng.
- Video & giao diện quay demo dùng **tiếng Anh**.
- Phần "AI" ghi rõ là demo; trong proposal giải thích cơ chế AI thật (chọn + giải thích → AI chấm lập luận dựa trên kho case đã kiểm chứng/RAG; AI hỗ trợ, không thay thế giáo viên — đúng định hướng BTC).

---

## 9. Đề xuất kỹ thuật cho Claude Code
- Chuyển từ 1 file HTML sang **dự án nhiều file** (vd Vite + TypeScript, có thể React). Tách: `content/` (lessons, cases, articles, Alti Lion KB — dạng JSON/TS, có cả `vi` và `en`), `game/`, `ui/`, `assets/` (ảnh + file `CREDITS.md` ghi nguồn/giấy phép).
- **i18n** từ đầu: mọi chuỗi qua hàm dịch; nút VI/EN.
- Engine nội dung: một "lesson player" đọc dữ liệu, hỗ trợ mọi dạng bài tập (mục 3.3) + trình phát "video hoạt họa" dạng cảnh (scene list: hình, chữ, chuyển động, thời lượng, lời thuyết minh tùy chọn).
- Game: SVG/Canvas hoặc Phaser; dữ liệu case & tham số thị trường tách riêng để dễ chỉnh.
- **Không gọi API AI trả phí** trong demo; không lộ key. Thiết kế sẵn interface để sau này cắm AI thật.
- Dùng **git** để cả nhóm theo dõi thay đổi; chạy local để test; có thể deploy miễn phí (vd GitHub Pages/Netlify/Vercel) để giám khảo bấm thử.
- Giữ cơ chế migrate save và bắt lỗi toàn cục (hiện toast khi có lỗi) như prototype.

---

## 10. Việc cần kiểm chứng trước khi nộp ⚠️
- ~~Nguồn số liệu teen muốn kinh doanh~~ → đã có (mục 1.2: Junior Achievement USA, 60%, teen Mỹ) — chỉ cần ghi đúng phạm vi khi trích dẫn.
- Nhận định "chương trình Bộ GD&ĐT không dạy tài chính".
- Mọi số liệu lịch sử trong case & bài Khám phá; tham số thị trường VN (lãi suất, lạm phát, VN-Index, tỷ giá, giá thuê, lương).
- ~~Giữ hay ẩn danh case trái phiếu VN 2022~~ → ✅ đã chốt viết ẩn danh.
- Giấy phép mọi ảnh dùng.

---

## 10b. GIAO DIỆN NỀN ✅ — `altifi-base.html` (bản v4 của nhóm)
✅ **Nhóm chốt: lấy giao diện của `altifi-base.html` làm nền để làm lại game & lessons.** File này là một nhánh khác của prototype (phát triển từ bản v1), có lớp giao diện/trải nghiệm hoàn thiện hơn; còn `altifi-prototype.html` (v3) có engine bài học & game mới hơn. → **Lấy vỏ (shell) + mọi tính năng UX của base, cấy engine/nội dung mới vào.**

**Có trong `altifi-base.html` — GIỮ NGUYÊN:**
- Điều hướng 5 tab (base hiện là Learn · Crisis Game · Ask Tiko · Me · Settings — **đổi theo mục 7**: Học · Khám phá · Chơi · Tôi · Cài đặt); hiệu ứng trượt trang theo hướng tab (`pageAnim`), nút bấm có hiệu ứng nhấn (`pushThen`).
- **Settings:** Theme (Light / Night / **ảnh của tôi** — tải ảnh nền lên, có hộp xin quyền truy cập ảnh kiểu iOS); **Alti Lion Interactions** (Alti Lion nói chuyện & biểu cảm ở trang chủ); **Weather Effects** (thời tiết thường gặp của quốc gia người dùng chạy nền: mưa/tuyết/nắng/lá, mây, đồi); **Potato Mode** (giảm hiệu ứng, buddy im lặng hơn — cho máy yếu); **Intelligence** (mẹo thông minh sau mỗi câu trả lời).
- **Alti Lion biết nói & có cảm xúc** ở trang chủ (bong bóng thoại chạy từng câu, các biểu cảm cười/buồn/cổ vũ, phản ứng theo kết quả).
- **Intelligence / info tips:** nút "i" cạnh nội dung → popup giải thích nhanh → mở bảng đầy đủ, có thể hỏi tiếp (chat theo ngữ cảnh). ← Đây chính là nền cho **Alti Lion trợ lý góc phải theo ngữ cảnh** (mục 5.1): mở rộng thành trợ lý nổi trên mọi màn hình.
- **Hồ sơ (Profile):** avatar chữ cái đầu (gradient) hoặc ảnh, tên, bio, quốc gia (cờ), tuổi (bước chọn tuổi); chỉnh sửa có hiệu ứng lưu.
- **Result pop-up** cuối bài: Alti Lion lớn với biểu cảm theo điểm, thống kê, thanh "độ vui của Alti Lion", nút hành động; **confetti**; hiệu ứng đúng/sai (rung, nhấn); **tim** có hiệu ứng vỡ khi mất. 💡 Tim dùng cho **lessons** (sai mất 1 tim, hết tim thì gợi ý "Ôn nhanh" để hồi tim); trong game dùng **net worth** thay cho tim.
- Linh vật + trang tùy biến (base đang là **đồng xu "Tiko"** → **thay bằng sư tử Alti Lion** theo mục 5.3, giữ nguyên trang tùy biến).
- Lưu: localStorage key `altifi-demo-v1` (`S.set` cài đặt, `S.p` hồ sơ, `S.m` buddy) + ảnh nền ở `altifi-demo-v1-bg`. → Khi gộp, **migrate** dữ liệu này sang cấu trúc mới, không làm mất cài đặt/hồ sơ của người dùng.

**✅ ĐƯỢC PHÉP CẢI THIỆN giao diện nền** — base là *điểm xuất phát*, không phải bản đóng băng. Giữ **bản sắc** (font Nunito, bảng màu tím/vàng/xanh/đỏ — ✅ giữ nguyên màu hiện tại, không đổi màu chủ đạo, nút có bóng đáy kiểu Duolingo, bo góc lớn, phong cách dễ thương) và **mọi tính năng** đã liệt kê ở trên, nhưng được làm đẹp & mượt hơn:
- Khoảng cách, cỡ chữ, phân cấp tiêu đề nhất quán (một thang spacing & type scale chung); thẻ/card đồng bộ.
- Chế độ Night hoàn chỉnh cho mọi màn hình mới (game, Khám phá, lesson).
- Trạng thái rỗng, đang tải, lỗi có minh họa Alti Lion thay vì chữ trơn.
- Khả năng tiếp cận: tương phản chữ đủ, vùng bấm ≥ 44px, có nhãn cho nút chỉ có icon.
- Ảnh thật & minh họa được bo góc, có chú thích nguồn nhỏ.

**✅ Chuyển động (motion) — nên có, nhưng kiểu "app", không kiểu "landing page":**
- NÊN: chuyển trang trượt (base đã có), danh sách/thẻ **hiện lần lượt (stagger)** khi mở màn hình, nút nhấn lún, thanh tiến độ chạy mượt, số net worth/XP **đếm lên/xuống**, thẻ đúng/sai rung/nảy, confetti khi hoàn thành, Alti Lion chớp mắt & phản ứng.
- Có thể dùng **fade-in khi cuộn** nhẹ cho các màn dài (bài Khám phá, phần "Đào sâu" của lesson) — nhanh (≤ 300ms), dịch chuyển nhỏ (≤ 12px), chỉ chạy 1 lần.
- KHÔNG: hiệu ứng parallax nặng, chuyển động kéo dài làm chậm thao tác, animation lặp vô hạn ngoài các điểm nhấn nhỏ.
- Bắt buộc tôn trọng **Potato Mode** và cài đặt hệ thống **"giảm chuyển động" (`prefers-reduced-motion`)**: tắt/giảm toàn bộ hiệu ứng.
- Ưu tiên mượt trên điện thoại tầm trung (chỉ animate `transform`/`opacity`).

**Trong base nhưng THAY THẾ bằng thiết kế mới:**
- Lessons dạng chỉ trắc nghiệm (8 bài, 4 unit) → engine 10+ dạng bài tập của v3 + nội dung 5 mảng (mục 3).
- Crisis Game gõ chữ + đồng hồ 45 giây (3 case 1929/1973/2008) → game mới theo mục 6 (bản đồ kiểu Animal Crossing, nhân vật, chế độ theo mảng, chế độ Khủng hoảng có hình ảnh động, không spoil). 💡 Có thể giữ ý "gõ lý do trong thời gian giới hạn" cho các quyết định cấp cao (mục 6.1 — viết lý do), chấm demo bằng từ khóa như base đang làm (`rate`/`analyzeMove`).
- Tab "Crisis Game" → đổi thành tab **Chơi** (gồm các chế độ + Khủng hoảng); thêm tab/mục **Khám phá**.

**Lấy từ `altifi-prototype.html` (v3) cấy vào nền:** engine bài học (`learn, pick, mcq, sort, match, order, slider, jars, spot, tap`), trình tạo nhân vật + hàm vẽ `avatar()`, bản đồ thị trấn & đi bộ, vòng lặp tháng, ngân hàng/chợ/nhà/HQ, doanh nghiệp & chi nhánh, thư viện 10 case + góc nhìn các bên, Alti Lion 3 cấp độ (n/l/p) + phát hiện thuật ngữ chuyên sâu, migrate save.

## 10c. NÂNG CẤP GIAO DIỆN ✅ (nhóm chốt 18/10 — làm ngay, áp dụng cho mọi màn hình hiện có và làm sau)
> Lý do: giao diện nền gọn nhưng còn "chất prototype" (emoji làm icon, nhiều ô trắng viền mỏng giống nhau, trang chủ chưa có điểm nhấn). Mục tiêu: trông như **app hoàn chỉnh**, vẫn giữ sự đơn giản & bản sắc (Nunito, màu hiện tại, nút kiểu Duolingo, Alti Lion). **Ưu tiên 4 màn sẽ lên video demo:** trang chủ, một bài học, bản đồ game, màn kết quả.

**1. Bộ icon SVG vẽ riêng, đồng bộ một phong cách** — thay **toàn bộ emoji** ở: thanh điều hướng, nút bài học/lộ trình, Cài đặt, HUD (streak, XP, net worth, tim), các nút hành động.
- Một phong cách duy nhất: nét bo tròn ~2px, góc mềm, tô 2 tông (màu chủ đạo + tông nhạt), kích thước lưới 24px; có trạng thái active/inactive (tab đang chọn tô đầy màu, tab khác viền xám).
- Làm thành 1 component/sprite `Icon` dùng chung, có `aria-label`. Emoji chỉ còn được dùng *bên trong nội dung* (minh họa bài học) khi thật cần.

**2. Trang chủ (tab Học) có phần đầu minh họa (hero)**
- Khung cảnh nhỏ vẽ SVG (đồi, cây, vài ngôi nhà/cửa hàng mini cùng phong cách bản đồ game) với **Alti Lion đứng/vẫy tay** (giữ bong bóng thoại & biểu cảm của base).
- **Vòng tròn mục tiêu hôm nay** (vd 20 XP hoặc 5 phút/ngày, chạy đầy khi đạt), **streak** 🔥→icon lửa, và **thẻ lớn "Tiếp tục bài đang học"** (tên bài, mảng, % tiến độ, nút Tiếp tục). Người mới: thẻ thành "Làm bài test xếp lớp".

**3. Lộ trình học = con đường minh họa uốn lượn**

> ⭐ **Đã thay đổi 18/10 chiều:** xem **13.1 — thay bằng dải ngân hà Altair** (mục 13 thắng khi mâu thuẫn).
- Đường đi SVG uốn lượn, nút bài học nằm trên đường. **Mỗi mảng tài chính là một vùng có cảnh riêng, cùng phong cách & màu với các khu trên bản đồ game (mục 6.1b):** Cá nhân → khu dân cư; Doanh nghiệp → phố cửa hàng; Thị trường & Đầu tư → tòa nhà kính + bảng giá; Tài chính công → tòa thị chính; Quốc tế → cảng/tàu. → Học và Chơi trông như **một thế giới thống nhất**.
- **Cột mốc:** rương thưởng sau mỗi 2–3 bài (mở ra có hiệu ứng + XP), **huy hiệu** khi xong một mảng.
- Vì không ép thứ tự (mục 3.2): mọi mảng đều mở; nút bài hiển thị trạng thái đã xong/đang học/chưa học + nhãn "nên biết trước" khi có.

**4. Tạo chiều sâu & phân cấp**
- Thẻ có **bóng đổ mềm nhiều lớp**, **gradient nhẹ** cho thẻ nổi bật; **giảm viền mỏng** lặp lại.
- **Kích thước thẻ đa dạng** để có điểm nhấn (1 thẻ hero lớn + lưới thẻ nhỏ 2 cột), không xếp các ô giống hệt nhau.
- Thang chữ rõ: tiêu đề màn 28–32px extra-bold; **con số (XP, net worth, streak) to, đậm**, dùng `font-variant-numeric: tabular-nums`, có hiệu ứng đếm lên/xuống.

**5. Trang Tôi (Me)**
- **Ảnh bìa hồ sơ** (chọn từ vài ảnh bìa minh họa có sẵn theo chủ đề, hoặc ảnh người dùng tải lên — dùng lại luồng xin quyền ảnh của base); avatar chồng lên mép ảnh bìa.
- **Kệ huy hiệu thành tích** (huy hiệu đã đạt có màu, chưa đạt xám + ổ khóa; bấm xem điều kiện).
- **Biểu đồ net worth nhỏ** (đường/area theo tháng trong game) + các chỉ số streak, XP, số bài, số case.

**6. Được phép cải thiện giao diện nền & chuyển động (motion)** — làm theo đúng 2 đoạn "ĐƯỢC PHÉP CẢI THIỆN giao diện nền" và "Chuyển động (motion)" ở **mục 10b** (giữ bản sắc & tính năng; motion kiểu app; tôn trọng Potato Mode & `prefers-reduced-motion`).

**7. Nền mờ chủ đề tiền bạc – kinh tế**
- Họa tiết lặp (pattern SVG) **rất nhạt** phía sau nội dung: đồng xu ₫, tờ tiền, heo đất, biểu đồ đi lên, ngân hàng, ký hiệu %, cái cân, quả địa cầu… vẽ nét mảnh cùng phong cách icon.
- Độ mờ ~4–7% ở Light, ~3–5% ở Night; **không làm khó đọc chữ**; nằm **dưới** lớp hiệu ứng thời tiết; **tắt** khi Theme = "ảnh của tôi". Có thể trôi cực chậm, nhưng **đứng yên** khi Potato Mode hoặc giảm chuyển động.

**8. Ảnh thật cho Khám phá & case lịch sử — nhóm KHÔNG phải tự tìm từng ảnh**
- Vấn đề: phiên Claude Code không truy cập được Wikimedia; nhóm không có thời gian gom ảnh.
- Giải pháp: **trình duyệt của người dùng thì truy cập được**, nên app tự lấy ảnh **lúc chạy** qua **API của Wikimedia Commons** (gọi từ trình duyệt, tham số `origin=*` để qua CORS):
  1. Mỗi bài Khám phá / case lịch sử khai báo trong dữ liệu: `imageQuery` (từ khóa tìm, vd `"1931 soup kitchen line Chicago"`, `"1973 gas station no gas sign"`, `"Falcon 9 launch"`, `"Lehman Brothers headquarters"`, `"gold bars"`) và tùy chọn `imageFile` (tên file Commons cụ thể nếu nhóm đã chọn).
  2. Component `RealImage` gọi API (`action=query`, `generator=search`, `gsrnamespace=6`, `prop=imageinfo`, `iiprop=url|extmetadata`, `iiurlwidth=800`), **chỉ nhận ảnh có giấy phép tự do** (Public domain, CC0, CC BY, CC BY-SA) đọc từ `extmetadata.LicenseShortName`, lấy tác giả từ `Artist`.
  3. Hiển thị ảnh bo góc + **dòng ghi nguồn nhỏ** (tác giả · giấy phép · Wikimedia Commons, có link).
  4. **Cache** kết quả trong localStorage để lần sau không gọi lại; **fallback** sang hình minh họa SVG nếu mất mạng/lỗi/không tìm thấy.
  5. Khi nhóm duyệt và ưng ảnh nào, bấm/ghi lại tên file vào `imageFile` để **cố định** ảnh cho video demo (tránh API trả ảnh khác lúc quay).
- Vì Claude Code không chạy thử được API này trong phiên, **nhóm mở app trên trình duyệt để kiểm tra** ảnh hiện đúng; báo lại ảnh nào không hợp để đổi `imageQuery`.
- ⚠️ Không dùng ảnh từ Google Images/báo chí (có bản quyền). Không dùng ảnh "fair use" của Wikipedia tiếng Anh — chỉ lấy từ **Commons** với giấy phép tự do như trên.

---

## 11. Prototype hiện có — cái gì giữ, cái gì bỏ
**Giữ & nâng cấp:** khung điện thoại & phong cách (font Nunito, màu tím `#5B5BD6`, vàng `#FFC93C`, xanh `#2BB673`, đỏ `#EF4E4E`, nút có bóng đáy kiểu Duolingo); linh vật Alti Lion + trang tùy biến; trình tạo nhân vật; 10 dạng bài tập; Alti Lion 3 cấp độ; bản đồ thị trấn & đi bộ; vòng lặp tháng; ngân hàng/chợ/nhà/HQ; rating kiểu cờ vua; góc nhìn các bên; thư viện 10 case; migrate save.
**Viết lại:** ✅ **lessons làm mới hoàn toàn** — không chuyển nội dung 12 bài cũ, chỉ dùng lại *engine* dạng bài tập; toàn bộ nội dung bài học (sâu hơn, chia 5 mảng, có ảnh thật & video mẫu); đồ họa game (đẹp hơn, Animal Crossing hơn); case theo 6.4 (không spoil); thêm net worth, phá sản, độ khó tăng dần, viết lý do; thêm mục Khám phá; Alti Lion nổi góc phải theo ngữ cảnh; song ngữ.

---

## 12. Kế hoạch & ưu tiên (hạn 01/11/2026) — ✅ RÚT CÒN 6 NGÀY CODE

> ⭐ **Đã thay đổi 18/10 chiều:** xem **13.6 (lịch mới)** (mục 13 thắng khi mâu thuẫn).
✅ Nhóm chốt: **6 ngày code (18–23/10)**, **kết quả thiết kế giữ nguyên như trên** (không cắt mục tiêu), lessons làm mới hoàn toàn, bản đồ rộng hơn nhiều. 24/10–01/11 dành cho kiểm thử, kiểm chứng số liệu, quay video ≤ 2 phút, viết PDF (nhóm tự viết).

**Cách rút từ ~10 ngày xuống 6 ngày mà không cắt kết quả:**
1. **Nội dung là dữ liệu, không phải code:** mọi bài học, case, bài Khám phá, câu trả lời Alti Lion, cảnh video đều là file JSON/TS (`vi` + `en`). Claude Code dựng engine 1 lần, sau đó thêm bài = thêm dữ liệu.
2. **Chạy song song với nhóm:** trong khi Claude Code dựng engine & game, nhóm soạn/duyệt nội dung theo mẫu dữ liệu — Phước Tấn tìm thông tin tài chính & số liệu, Gia Mẫn kiểm nguồn & soát tiếng Anh, Minh Hân/Quốc Huy duyệt trải nghiệm & chơi thử mỗi tối.
3. **Video hoạt họa = 1 trình phát cảnh dùng chung**; mỗi video chỉ là danh sách cảnh.
4. **Asset bản đồ CC0 + Phaser** thay vì vẽ tay toàn bộ thế giới.
5. **Mỗi ngày kết thúc bằng một bản chạy được** (commit git), chơi thử ngay, sửa sớm.

| Ngày | Việc |
|---|---|
| **18/10** | Dự án mới (Vite + TS), gộp giao diện nền `altifi-base.html` (mục 10b) + migrate dữ liệu cũ; i18n VI/EN; engine bài học (10+ dạng) + trình phát video hoạt họa; Alti Lion trợ lý góc phải theo ngữ cảnh (n/l/p). |
| **19/10** | Bản đồ thế giới lớn (camera, kéo/zoom, minimap, bấm-để-đi, 6 khu, NPC, thời tiết) + trình tạo nhân vật + HUD net worth. |
| **20/10** | Chế độ **Cá nhân** hoàn chỉnh (vòng tháng, ngân sách, tín dụng, bảo hiểm, tiết kiệm cố định/thả nổi, phá sản) + **6 bài Tài chính cá nhân** + 1 video. |
| **21/10** | Chế độ **Doanh nghiệp** (thị trường mô phỏng VN, báo cáo tài chính của chính mình, vốn, chi nhánh trên các lô đất, viết lý do + chấm demo) + **6 bài Tài chính doanh nghiệp** + 1 video. |
| **22/10** | **Chế độ Khủng hoảng** (Bảo tàng; 1929/1973/2008 có hình ảnh động, đổi vai, không spoil) + màn chơi ngắn cho 3 mảng phụ + **6 bài** (3 mảng × 2) + 1 video. |
| **23/10** | **Khám phá** 3–5 bài; placement test; đánh bóng đồ họa; sửa lỗi; kiểm thử trên điện thoại; deploy để giám khảo bấm thử. |
| 24–28/10 | Đệm cho việc trễ + kiểm chứng số liệu/ảnh/giấy phép + chỉnh nội dung. |
| 29–31/10 | Quay video, hoàn thiện PDF. |
| **01/11** | Nộp trước 23:59. |

⚠️ **Rủi ro của lịch 6 ngày:** Claude Code có giới hạn sử dụng theo gói → chia việc theo ngày như bảng, mỗi phiên một mục rõ ràng; nội dung từ nhóm phải về kịp theo ngày; nếu trễ thì dùng ngày đệm 24–28/10 chứ **không cắt** vòng lặp demo (mục 8), song ngữ EN, net worth, bản đồ lớn.

---

## 13. ĐỢT THAY ĐỔI LỚN 18/10 (chiều) — ĐỌC MỤC NÀY TRƯỚC ⭐
> Mục này **thắng** mọi mục cũ khi mâu thuẫn. Ký hiệu: ✅ nhóm đã chốt · 💡 đề xuất của Claude (vai: nhà thiết kế app & khóa học, người xử lý vấn đề dự án, giáo sư kinh doanh – tài chính – kinh tế) **chờ nhóm duyệt** · ❓ nhóm phải quyết trước khi code phần đó.

| Mục cũ | Bị thay bằng |
|---|---|
| 10c.3 Lộ trình = con đường uốn lượn | **13.1** Dải ngân hà Altair |
| 3.1 (5 mảng), 3.4 (danh sách bài) | **13.2** 6 mảng + 20 bài thiết kế lại |
| 6.1 & 6.1b phần *đồ họa* và *cách di chuyển* (2D, bấm-để-đi) | **13.3** low-poly kiểu Focustown/Animal Crossing + joystick |
| 6.6 "nguồn tiêu tiền" (mới chỉ là ý) | **13.4** Nhà, xe & net worth |
| 12 Lịch 6 ngày | **13.6** Lịch mới |

---

### 13.1 Tab Học = DẢI NGÂN HÀ ALTAIR ✅ (chi tiết 💡)

**Vì sao đổi** ✅: con đường uốn lượn là dấu ấn của Duolingo và còn ngầm nói "học theo thứ tự", trái với nguyên tắc *không ép thứ tự* (3.2). Ngân hà thì không có điểm đầu – điểm cuối, và gắn với tên đội: **Altair là một ngôi sao**.

**Ý niệm:** cả kiến thức tài chính – kinh tế là một **dải ngân hà xoắn ốc**. Ở tâm là **sao Altair** (nơi Alti Lion sống). Mỗi **mảng** là một **hệ hành tinh** nằm trên một nhánh xoắn. Mỗi **bài học là một hành tinh**. Các hành tinh **nối với nhau bằng dải sáng** = quan hệ "nên biết trước" — kể cả **nối ngang giữa các mảng** (vd *NHTW tăng lãi suất* → *Bẫy 0 đồng*), cho thấy kinh tế là một hệ thống liên thông, không phải các chương rời rạc.

**3 tầng zoom (semantic zoom — mỗi tầng hiện lượng thông tin khác nhau):**
| Tầng | Thấy gì | Thao tác |
|---|---|---|
| **1. Ngân hà** | Toàn cảnh xoắn ốc, 6 hệ phát sáng theo màu mảng, tên mảng, % đã khám phá mỗi hệ, các dải sáng nối ngang. Sao băng/sao chổi bay qua. | Chạm 1 hệ → bay (camera lướt + zoom mượt ~600ms) vào tầng 2 |
| **2. Hệ hành tinh** | 3–5 hành tinh của mảng, mỗi hành tinh có **hình dạng riêng gợi chủ đề** (vd *Lạm phát*: hành tinh khí đang phình to; *Bẫy 0 đồng*: hành tinh có vành đai dạng thẻ tín dụng; *1997*: hành tinh nứt vỡ), quỹ đạo mờ, dải sáng prerequisite, nhãn tên bài | Chụm/kéo để zoom, chạm hành tinh → tầng 3 |
| **3. Hành tinh** | Hành tinh lớn xoay chậm chiếm nửa trên; **thẻ bài học** nửa dưới: câu hỏi mở đầu (hook), thời lượng, "Nên biết trước" (chạm → bay tới hành tinh đó), 2 tầng Cơ bản/Đào sâu, nút **Hạ cánh** (= bắt đầu) | Hạ cánh → **tên lửa nhỏ của Alti Lion** đáp xuống → vào bài |

**Trạng thái hành tinh:** chưa học = bóng tối, viền mờ, có "sương mù" · gợi ý = **đèn hiệu nhấp nháy** + Alti Lion nhỏ bay quanh · đang học = nửa sáng · xong = sáng rực, **có vành đai** · xong cả Đào sâu = thêm **mặt trăng vàng**. Xong cả hệ → **chòm sao của mảng hiện lên** trên nền trời (thay "huy hiệu" cũ). **Rương thưởng → sao chổi** đi ngang, chạm để nhặt (+XP). Hành tinh "Sắp có" = vẫn hiện nhưng ở dạng phác thảo nét đứt.

**Hành tinh nhà (cầu nối với game) 💡:** cạnh sao Altair có **hành tinh nhà** — trên đó là thị trấn của người chơi (thu nhỏ). Chạm vào → sang tab **Chơi**. Thị trấn càng phát triển, hành tinh nhà càng nhiều đèn. → Học và Chơi vẫn là *một vũ trụ* (giữ tinh thần 10c.3).

**Phong cách hình ảnh** (đẹp, không sơ sài):
- Hành tinh **low-poly, đổ bóng phẳng nhiều mặt** (cùng ngôn ngữ với thị trấn low-poly ở 13.3), có khí quyển phát sáng nhẹ (rim light), vành đai, mây trôi.
- Nền: 3 lớp sao **parallax** (xa – giữa – gần), **tinh vân** màu theo mảng, bụi sao dọc nhánh xoắn, thỉnh thoảng sao băng.
- **Light theme** = bầu trời bình minh pastel (tím lavender → hồng đào, sao mờ); **Night theme** = vũ trụ tím than sâu, sao sáng. Giữ bảng màu thương hiệu (tím `#5B5BD6` làm chủ đạo của tinh vân; vàng `#FFC93C` cho ánh sao/đèn hiệu).
- Màu 6 mảng (gợi ý): Cá nhân = hồng đào · Doanh nghiệp = vàng cam · **Kinh tế vĩ mô = tím** (mảng lõi, gần tâm nhất) · Đầu tư = xanh ngọc · Tài chính công = xanh dương · Quốc tế = xanh lá biển.
- HUD góc trên: streak, XP, mục tiêu hôm nay (vòng tròn) — thu gọn thành 1 thanh mảnh để không che trời. Thẻ "Tiếp tục bài đang học" là **thẻ nổi** ở cạnh dưới, kéo xuống để ẩn.

**Tương tác & hiệu năng:** chụm 2 ngón / con lăn chuột để zoom, kéo để lia, chạm đúp để zoom vào, nút `+`/`−` và **"Về Altair"**; quán tính khi kéo. Mặc định mở ở tầng 2 của **mảng gợi ý** (người dùng mới không bị ngợp), tự lướt nhẹ từ tầng 1 ở lần mở đầu tiên (≤ 1,2s, bỏ qua được). **Potato Mode / giảm chuyển động:** tắt parallax, sao băng, xoay hành tinh, chuyển cảnh thành cắt thẳng.
**Tiếp cận:** nút **"Danh sách"** chuyển sang dạng danh sách bài theo mảng (cho máy yếu, trình đọc màn hình, và người cần tìm nhanh).
**Kỹ thuật 💡:** dùng **Three.js** cho cả ngân hà lẫn game (13.3) → một engine, một phong cách low-poly. Hành tinh tạo bằng icosphere có nhiễu (procedural) + màu theo mảng, không cần asset. Dữ liệu: mỗi bài có `domain`, `prereq: string[]` (được trỏ sang mảng khác), `planet: { shape, palette, feature }`. Vị trí hành tinh tính tự động theo nhánh xoắn + chỉnh tay được.

#### 13.1b Nhóm duyệt sau phiên 19/10 ✅ (thắng các dòng trên của 13.1 khi mâu thuẫn)
**Giữ:** màu 6 mảng (Cá nhân `#F7867A` · Doanh nghiệp `#F5A524` · Vĩ mô `#8B6CF0` · Đầu tư `#1BB0C2` · Công `#3D7BF5` · Quốc tế `#2FAE73`); 6 dải sáng thêm (P2→P1, P5→P1, B2→B1, B4→B1, I1→P3, G2→G1); 3 bài cũ hiện tiêu đề câu hỏi mới ngay từ bây giờ.

**Sửa:**
1. **Chòm sao:** mỗi mảng luôn có chòm sao mờ trên nền trời, **mỗi bài xong sáng một ngôi sao**. Chòm sao chỉ **hoàn chỉnh** (đường nối sáng + hiệu ứng + huy hiệu mảng) khi xong **mọi bài của mảng, tính cả bài "Sắp có"**.
2. **Tầng ngân hà:** 6 hệ trải **đều dọc các nhánh xoắn** để dải ngân hà phủ gần kín màn hình điện thoại (dọc). Nhãn mảng = **viên thuốc nhỏ gọn** (chấm màu + tên + %), **không đè lên nhau**, **không bị thẻ dưới đáy che**.
3. **Tầng hệ hành tinh:** hành tinh **to gấp ~2 lần**; nhãn bài = **viên thuốc nhỏ dưới hành tinh** (mã + tên ngắn); chi tiết (trạng thái, sao, ngày) chỉ ở tầng 3. Không để nhãn của hệ khác lẹm sau breadcrumb.
4. **Bụi sao:** chỉ nằm **dọc các nhánh xoắn**, hạt nhỏ hơn, **mờ dần ra ngoài**, có ánh sáng nhẹ; không rải lốm đốm khắp màn hình.
5. **Thẻ "Làm bài test xếp lớp":** thẻ **thấp ở đáy**, vuốt xuống thu thành **viên thuốc**; bấm "Bỏ qua" cũng thu gọn luôn.
6. **Nền theo tab:**
   - **Học:** cảnh Three.js đầy đủ (như trên).
   - **Khám phá · Tôi · Cài đặt:** **bản ngân hà nhẹ** (CSS/canvas 2D, cùng bảng màu Light/Night, trôi rất chậm, **đứng yên** khi Potato Mode hoặc giảm chuyển động) — **không** chạy Three.js. Thẻ chuyển sang **kính mờ**; chữ phải đạt tương phản (≥ 4.5:1 cho chữ thường) ở cả Light và Night.
   - **Chơi:** trang chính là **hành tinh nhà trong không gian**; bấm vào → camera bay xuống thị trấn. Thị trấn (phiên sau) giữ **nắng pastel**, không phải vũ trụ.
   - **Màn làm bài học:** giữ **nền trơn**.
   - **Hiệu ứng thời tiết** chỉ dùng **trong thị trấn**; **bỏ họa tiết tiền** ở nền; theme **"Ảnh của tôi"** vẫn ưu tiên hơn nền ngân hà.

---

### 13.2 KHÓA HỌC THIẾT KẾ LẠI ✅ (nội dung 💡 — nhóm duyệt & chỉnh)
> ⚠️ Quy định cuộc thi: bài *hoàn toàn do AI tạo* sẽ bị loại. Đây là **bản nháp chuyên môn** để nhóm phản biện; nhóm cần đọc, sửa, thêm ví dụ của chính mình (nhất là từ khảo sát) và giải thích được trong proposal *vì sao* thiết kế như vậy.

#### 13.2a Vì sao bài hiện tại chán (chẩn đoán)
1. **Bắt đầu bằng định nghĩa** ("Ngân sách là…") → giọng sách giáo khoa. Teen chỉ chú ý khi có *câu hỏi về chính đời mình*.
2. **Không có gì để mất** — bài tập kiểm tra *nhớ*, không bắt *ra quyết định*.
3. **Ví dụ chung chung** (lương, nhà) xa với teen 14–17 tuổi chưa có lương.
4. **Kiến thức rời rạc** — không thấy lạm phát ↔ lãi suất ↔ khoản vay ↔ doanh nghiệp liên quan nhau.
5. **Không có "aha"** — không có khoảnh khắc trực giác bị lật ngược.

#### 13.2b 7 nguyên tắc thiết kế bài
1. **Mỗi bài là một câu hỏi bí ẩn**, không phải một chủ đề. ❌ "Lạm phát" → ✅ "Vì sao ly trà sữa 25k năm 2015 giờ thành 45k?"
2. **Quyết định trước, học sau** (*productive failure*): người học đoán/chọn khi chưa được dạy → thấy mình sai ở đâu → lúc đó mới giải thích. Nhớ lâu hơn hẳn đọc trước.
3. **Đời teen Việt Nam trước, người lớn sau:** tiền tiêu vặt, lì xì Tết, Shopee 11.11, trà sữa, nạp game, SPayLater/trả sau, làm thêm, đi du học, giá iPhone.
4. **Một trình mô phỏng ở trung tâm mỗi bài:** kéo thanh trượt và *thấy* hậu quả (khoản trả nợ phình ra, quả cầu tuyết lãi kép, núm lãi suất của NHTW). Không phải đọc.
5. **Bẫy hiểu sai từ khảo sát là nhân vật chính** (lãi kép ≠ lãi đơn; lạm phát ≠ mất giá so với USD; điểm tín dụng ≠ tiền tiết kiệm; vay thả nổi khi lãi suất tăng → trả **nhiều hơn**; tài sản thế chấp).
6. **Số thật, nguồn thật, chuyện thật** — có ghi nguồn; sự kiện lịch sử đặt người học *trước* khi biết kết quả.
7. **Mỗi bài kết thúc bằng hành động:** "Dùng ngay" (1 việc làm được hôm nay ngoài đời) + **mở khóa một thứ trong game** (quầy, sản phẩm, lựa chọn mới) → học xong *có lý do* vào game.

#### 13.2c Khung 1 bài (6 nhịp, 4–6 phút)
| Nhịp | Thời lượng | Nội dung | Dạng bài tập (engine 16 dạng đã có) |
|---|---|---|---|
| 1. **Móc câu** | 20s | Câu hỏi bí ẩn + ảnh thật/hoạt họa | `learn` (ảnh), `video` |
| 2. **Đoán thử** | 40s | Ra quyết định/dự đoán khi chưa học | `predict`, `slider`, `pick` |
| 3. **Cơ chế** | 90s | Trình mô phỏng tương tác + giải thích ngắn | `chart`, `calc`, `jars`, `slider` |
| 4. **Chuyện thật** | 60s | Case Việt Nam / thế giới, có số liệu | `statement`, `order`, `mcq` |
| 5. **Bẫy** | 40s | Hiểu sai phổ biến (từ khảo sát) — người học tự rơi vào rồi gỡ | `spot`, `sort`, `mcq` |
| 6. **Trùm cuối + Dùng ngay** | 60s | 1 câu tình huống tổng hợp (có thể `explain` viết lý do) + việc làm ngay + mở khóa game | `explain`, `tap`, `match` |
| 🔬 **Đào sâu** (tùy chọn) | 3–5 phút | Công thức, học thuật, tranh luận, số liệu | `calc`, `chart`, `explain` |

#### 13.2d SÁU MẢNG — 20 BÀI
Cột "Game" = thứ được mở khóa trong game sau khi học xong.

**① TÀI CHÍNH CÁ NHÂN — "Tiền của tôi" (5 bài)**
| # | Bài (câu hỏi bí ẩn) | Cốt lõi | Trình mô phỏng / tương tác chính | Chuyện thật | Bẫy | Game |
|---|---|---|---|---|---|---|
| P1 | **Tiền tiêu vặt của mình biến đi đâu hết?** | Theo dõi chi tiêu, cần/muốn/tương lai (50/30/20 bản teen), "rò rỉ" nhỏ, kế toán tâm lý | Sống thử 1 tuần của một teen (trà sữa, nạp game, Shopee) → cuối tuần tìm rò rỉ; chia tiền vào hũ | Madrian & Shea 2001 (tự động tiết kiệm) | "Ít tiền thì không cần lập ngân sách" | Mở **sổ chi tiêu** trong game |
| P2 | **"Trả sau 0%" có thật sự 0 đồng?** | BNPL, phí trễ hạn, thẻ tín dụng, trả tối thiểu, điểm tín dụng (CIC), tài sản thế chấp | Thanh trượt "trả tối thiểu mỗi tháng" → xem số tháng & tổng lãi nhảy lên | Khảo sát nhóm: 6/46 đã dùng mua trước trả sau | Điểm tín dụng = tiền tiết kiệm (7 người nhầm) | Mở **thẻ tín dụng & điểm tín dụng** |
| P3 | **Vì sao 100 nghìn của mình đang teo dần?** | Sức mua, lãi suất thực = danh nghĩa − lạm phát, lãi kép, quy tắc 72, quỹ khẩn cấp | Video "Quả cầu tuyết" (đã có) + so 3 hũ: để ống heo / gửi tiết kiệm / đầu tư | Lạm phát VN 2008 ⚠️ | Lãi kép ≠ lãi đơn (12 người nhầm) | Mở **sổ tiết kiệm** ở ngân hàng |
| P4 | **Làm sao biết mình sắp bị lừa?** | Ponzi, "việc nhẹ lương cao", nhóm đầu tư "cam kết lãi", lừa nạp game, phishing | Đọc đoạn chat giả lập → bấm các cờ đỏ (`spot`) ; tính xem "lãi 5%/tuần" vô lý cỡ nào | Madoff 2008; case trái phiếu VN 2022 (**ẩn danh**) | "Lãi cao + cam kết không lỗ = cơ hội" | Sự kiện **lừa đảo** xuất hiện ngẫu nhiên trong game |
| P5 | **Lương 10 triệu, cầm về được bao nhiêu?** | Lương gộp vs thực nhận, bảo hiểm bắt buộc, thuế TNCN, bảo hiểm (khi nào cần), quỹ khẩn cấp 3–6 tháng | Phiếu lương tương tác: kéo lương gộp → thấy từng khoản trừ | Mức đóng BHXH/BHYT/BHTN & giảm trừ gia cảnh hiện hành ⚠️ (luật thuế TNCN có thể đã đổi — kiểm tra bản mới nhất) | "Lương ghi trên hợp đồng = tiền về tài khoản" | Mở **việc làm có lương** & **bảo hiểm** |

**② TÀI CHÍNH DOANH NGHIỆP — "Quán của tôi" (5 bài)** — *một câu chuyện xuyên suốt*: người học mở một quán trà sữa nhỏ, mỗi bài là một khủng hoảng thật của quán.
| # | Bài | Cốt lõi | Tương tác chính | Chuyện thật | Bẫy | Game |
|---|---|---|---|---|---|---|
| B1 | **Bán một ly trà sữa lời bao nhiêu?** | Chi phí cố định/biến đổi, lãi gộp mỗi ly, điểm hòa vốn | Tự định giá ly + chọn mặt bằng → xem cần bán bao nhiêu ly/ngày (biểu đồ hòa vốn, đã có) | Báo cáo mini quán trà sữa | "Doanh thu cao = lời nhiều" | Mở được **quầy hàng đầu tiên** |
| B2 | **Giá bao nhiêu thì đúng?** | Cầu co giãn theo giá, đối thủ, khuyến mãi, voucher | Đặt giá 25k/35k/45k trong 3 khu khác nhau → khách phản ứng | Chiến tranh voucher của sàn TMĐT (viết trung lập) | "Giảm giá luôn bán được nhiều hơn = lời hơn" | Mở **chỉnh giá & khuyến mãi** |
| B3 | **Lời mà vẫn phá sản — chuyện gì vậy?** | Lợi nhuận ≠ tiền mặt, vốn lưu động, phải thu/phải trả/tồn kho, 3 báo cáo | Dòng thời gian tiền vào – ra của quán: nhận hợp đồng lớn trả chậm 60 ngày → hết tiền trả lương | Doanh nghiệp "lãi trên giấy" phá sản vì dòng tiền | "Có lãi thì không thể hết tiền" | Mở **báo cáo dòng tiền** của quán |
| B4 | **Vay ngân hàng hay gọi vốn kiểu Shark Tank?** | Nợ vs vốn chủ, pha loãng cổ phần, đòn bẩy, lãi cố định/thả nổi cho doanh nghiệp | Bàn đàm phán: nhà đầu tư đề nghị X tỷ cho Y% → tính định giá, so với khoản vay | Vay thả nổi 2022–23 khi lãi suất tăng | "Gọi vốn là tiền miễn phí" | Mở **vay vốn / gọi vốn** |
| B5 | **Mở 10 chi nhánh cùng lúc: liều hay khôn?** | Tăng trưởng, thời gian hoàn vốn, NPV (Đào sâu: IRR), đổi mới phá vỡ | Chọn 1 trong 3 dự án mở rộng có dòng tiền khác nhau → tính hoàn vốn/NPV | Starbucks 7/2008 đóng ~600 cửa hàng; Kodak | "Càng nhiều chi nhánh càng giàu" | Mở **chi nhánh trên các lô đất** |

**③ KINH TẾ VĨ MÔ — "Nền kinh tế vận hành ra sao" (4 bài) — MẢNG MỚI ✅, là lõi "hiểu tin tức kinh tế"** (xem 13.2e)
| # | Bài | Cốt lõi | Tương tác chính | Chuyện thật | Bẫy | Game |
|---|---|---|---|---|---|---|
| M1 | **Lạm phát đến từ đâu?** | Rổ hàng CPI, lạm phát do cầu kéo / chi phí đẩy / tiền nhiều, kỳ vọng lạm phát | **Tự xây rổ CPI** của một teen → tính lạm phát "của riêng mình"; bơm tiền vào nền kinh tế mini và xem giá chạy | VN 2008 & 2011 ⚠️; Zimbabwe; Mỹ 2022 | Lạm phát ≠ VND mất giá so với USD (7 người nhầm) | **Chỉ số giá** chạy trên bảng tin thị trấn |
| M2 | **Ngân hàng trung ương — người cầm vòi nước** | Lãi suất điều hành, truyền dẫn sang lãi vay/gửi, đánh đổi lạm phát – thất nghiệp | **Xoay núm lãi suất**: thấy lạm phát, thất nghiệp, *và khoản trả góp của chính bạn* thay đổi | Fed 2022 ~0% → >5%; NHNN tăng lãi suất cuối 2022 | Vay thả nổi khi lãi suất tăng thì trả **nhiều hơn** (13 người nghĩ giữ nguyên) | Lãi suất trong game **do NHTW mô phỏng điều chỉnh** |
| M3 | **Đọc một bản tin kinh tế trong 60 giây** | GDP, tăng trưởng, thất nghiệp, chu kỳ kinh tế, chỉ báo dẫn dắt | "Giải mã tít báo": tít giả lập → chọn nghĩa đúng, ai được – ai mất | Tin GDP quý của VN (số thật, ghi nguồn) ⚠️ | "GDP tăng = ai cũng giàu hơn" | Mở **tòa tin tức** trong thị trấn (tin kinh tế ảnh hưởng game) |
| M4 | **Hai tay lái: chính phủ & NHTW** | Chính sách tài khóa vs tiền tệ, đình lạm (stagflation), kích thích kinh tế | Đóng vai: bạn điều khiển cả thuế/chi tiêu và lãi suất khi nền kinh tế quá nóng/quá lạnh | Dầu mỏ 1973 (đình lạm); gói kích thích 2008–09; COVID-19 | "Chính phủ in thêm tiền là hết nghèo" | Mở vai **Thống đốc** trong chế độ Khủng hoảng |

**④ ĐẦU TƯ & THỊ TRƯỜNG (2 bài)**
| # | Bài | Cốt lõi | Tương tác chính | Chuyện thật | Bẫy | Game |
|---|---|---|---|---|---|---|
| I1 | **Chứng khoán: đầu tư hay đánh bạc?** | Rủi ro – lợi nhuận, đa dạng hóa, quỹ chỉ số/ETF, FOMO (Đào sâu: Beta, độ biến động) | Mô phỏng 10 năm: dồn hết 1 mã vs chia đều vs quỹ chỉ số | Biến động VN-Index ⚠️ | "Cổ phiếu đang lên thì sẽ lên tiếp" | Mở **sàn giao dịch** |
| I2 | **Vàng, đất, tiền ảo: vì sao giá lên xuống điên cuồng?** | Giá trị thực vs giá thị trường, bong bóng, tài sản trú ẩn (Đào sâu: phái sinh phòng ngừa rủi ro — hãng bay & giá dầu) | Vẽ đường giá dự đoán rồi so với thực tế | Bong bóng dot-com 2000; vàng khi bất ổn | "Giá cao = đáng giá" | Mở **tiệm vàng & quầy ngoại tệ** |

**⑤ TÀI CHÍNH CÔNG (2 bài)**
| # | Bài | Cốt lõi | Tương tác chính | Chuyện thật | Bẫy | Game |
|---|---|---|---|---|---|---|
| G1 | **Tiền thuế của mình đi đâu?** | Thu ngân sách (thuế, phí, lệ phí; VAT trong ly trà sữa), chi đầu tư công, chi thường xuyên | **Chia ngân sách** một thành phố: trường, bệnh viện, đường cao tốc… và xem người dân phản ứng | Thuế GTGT hiện hành ⚠️; cao tốc Bắc – Nam (đầu tư công) | "Teen không đóng thuế" (VAT có trong mọi món mua) | **Tòa thị chính** hiện công trình theo ngân sách |
| G2 | **Chính phủ vay nợ: tốt hay xấu?** | Thâm hụt, nợ công, trái phiếu chính phủ, khi nào vay để đầu tư là đáng | So 2 quốc gia giả định: vay để xây hạ tầng vs vay để chi tiêu | Khủng hoảng nợ Hy Lạp 2010 | "Nợ công lúc nào cũng xấu" | Vai **Bộ trưởng Tài chính** |

**⑥ TÀI CHÍNH QUỐC TẾ (2 bài)**
| # | Bài | Cốt lõi | Tương tác chính | Chuyện thật | Bẫy | Game |
|---|---|---|---|---|---|---|
| X1 | **Vì sao USD tăng thì du học & iPhone đắt hơn?** | Tỷ giá, cung – cầu ngoại tệ, ai lợi (xuất khẩu) ai thiệt (nhập khẩu, du học) | Kéo tỷ giá → giá iPhone, học phí du học, lợi nhuận một xưởng xuất khẩu | Tỷ giá USD/VND ⚠️ | Tỷ giá tăng = kinh tế VN đang sụp | Mở **cảng & quầy đổi tiền** |
| X2 | **1997: khi cả châu Á sụp đổ trong vài tháng** | Dòng vốn nóng, cố định tỷ giá, cán cân thanh toán, vai trò IMF | Đặt người học là Thái Lan đầu 1997 *trước khi biết kết quả*: giữ hay thả tỷ giá? | Khủng hoảng tài chính châu Á 1997 | "Vốn ngoại đổ vào càng nhiều càng tốt" | Mở **phòng 1997** trong Bảo tàng |

**Liên hệ với 3 bài đã code:** `p-budget` → làm lại thành **P1**; `p-inflation` → tách: phần sức mua/lãi kép/quỹ khẩn cấp ở **P3**, phần *nguồn gốc lạm phát & bẫy USD* chuyển sang **M1**; `c-breakeven` → làm lại thành **B1**. Giữ engine & video "Quả cầu tuyết", viết lại lời thoại theo khung 13.2c.

#### 13.2e Mảng Kinh tế vĩ mô — vì sao tách riêng & cái gì chuyển về đây ✅
- Đây là **lõi ban đầu của nhóm** ("hiểu tin tức kinh tế") và là chỗ teen hổng nhất trong khảo sát (chỉ **30%** đúng lạm phát, **13%** đúng vay thả nổi khi lãi suất tăng). Đặt mảng này **gần tâm ngân hà nhất**, nối dải sáng tới hầu hết các mảng khác.
- **Chuyển về Vĩ mô:** nguồn gốc lạm phát (từ bài lạm phát cũ), "NHTW tăng lãi suất → khoản vay thả nổi" (từ bài Cá nhân #4 cũ), "Chính sách tài khóa vs tiền tệ" (từ Tài chính công #2 cũ).
- **Ở lại mảng cũ:** Cá nhân giữ phần *bảo vệ tiền của mình* trước lạm phát (P3); Tài chính công giữ *ngân sách, thuế, nợ công* (G1, G2).
- Game: Vĩ mô = **khu NHTW + tòa tin tức** trên bản đồ (khu thứ 7); chế độ chơi = vai **Thống đốc NHTW** (dùng chung với chế độ Khủng hoảng đổi vai, 6.4).
- Alti Lion: thêm chủ đề KB cho GDP, CPI, lãi suất điều hành, đình lạm, chu kỳ kinh tế (3 cấp n/l/p).

#### 13.2f Dải sáng nối ngang (prerequisite) gợi ý
M1 → P3 · M2 → P2, B4 · M3 → I1 · M4 → G1, G2 · X1 → M1 · X2 → X1, M2 · B3 → B1 · B5 → B3, B4 · I2 → I1 · P4 → P3.

---

### 13.3 GAME: ĐỒ HỌA LOW-POLY KIỂU FOCUSTOWN + ANIMAL CROSSING, ĐIỀU KHIỂN BẰNG JOYSTICK ✅ (chi tiết 💡)

**Tham chiếu phong cách** (✅ nhóm chọn): **Focustown** (app học tập, tự mô tả là *môi trường low-poly ấm cúng*: quán cà phê, thư viện, nhân vật tùy biến, mua phụ kiện bằng đồng xu) và **Animal Crossing**. ⚠️ **Chỉ lấy cảm hứng phong cách — không dùng hình, mô hình, nhân vật hay tên của hai game này** (Nintendo và nhà phát triển Focustown giữ bản quyền). Không đưa ảnh chụp của họ vào app, video hay proposal như thể là của nhóm.

**✅ Nhóm chốt (18/10): tham chiếu CHÍNH là Animal Crossing** — bám phong cách Animal Crossing nhiều nhất có thể; Focustown chỉ là tham chiếu phụ (không khí ấm cúng, low-poly). Vẫn chỉ lấy *phong cách*, tự dựng mọi thứ.

**Checklist "giống Animal Crossing" (dùng để tự soát mỗi phiên):**
- **Camera:** cao, nghiêng ~40–50°, bám sau nhân vật; **mặt đất cong xuống ở xa** ("thế giới cuộn tròn") — làm bằng shader uốn đỉnh theo khoảng cách camera; ưu tiên làm trong 20/10, không còn là tùy chọn.
- **Hình khối:** mọi thứ **mập, tròn, bo cạnh**, hơi "đồ chơi"; cây tán tròn/tán tam giác xếp tầng, thân ngắn; nhà mái to, cửa sổ ô vuông, hàng rào gỗ thấp.
- **Mặt đất:** cỏ xanh tươi có **mảng hoa nhỏ & cỏ lăn tăn**, đường đất/đá lát bo tròn, **vách đá bậc thang** (2–3 tầng cao độ), sông/suối có thác nhỏ, cát ven biển.
- **Ánh sáng & màu:** pastel bão hòa vừa, nắng ấm, bóng đổ mềm màu tím xanh (không đen); **đổi màu trời theo giờ thật** (sáng – trưa – hoàng hôn cam hồng – đêm xanh tím, đèn cửa sổ bật).
- **Sự sống:** bướm, chim, lá rơi, cá nhảy dưới nước, NPC dạng **chibi tròn**; cây rung khi đi ngang, cỏ lay; bụi nhỏ dưới chân khi chạy.
- **Âm thanh 💡:** tiếng bước chân đổi theo mặt đất (cỏ/gỗ/đá), nhạc nền nhẹ đổi theo giờ (nếu kịp; tắt được trong Cài đặt).
- **Giao diện trong game:** khung thoại **bo tròn, màu kem, chữ hiện từng chữ** kèm tiếng "bíp" nhỏ; menu dạng **"điện thoại trong game"** (net worth, nhà & xe, bản đồ, nhiệm vụ) với icon tròn pastel — dùng lại bộ icon SVG của app.
- **Nhà:** vào nhà = cắt cảnh sang **phòng nhìn chéo kiểu diorama**, nội thất đặt theo ô lưới (trang trí — 🔜 nếu thiếu thời gian).
- ⚠️ Không dùng: tên, nhân vật, logo, nhạc, font, mô hình, ảnh chụp từ Animal Crossing; không gọi tên game này trong app.

**Ngôn ngữ hình ảnh cần đạt:**
- **3D low-poly**, đổ bóng phẳng/mềm, khối tròn mập mạp, tỉ lệ chibi (đầu to).
- **Camera cao nhìn chéo xuống ~45°**, đi theo nhân vật; hiệu ứng "**thế giới cong**" (xem checklist trên — bắt buộc).
- Bảng màu pastel ấm, ánh nắng vàng, bóng đổ mềm; cỏ có hoa, cây tròn đung đưa, đường lát gạch, nước trong; ban đêm đèn đường & cửa sổ sáng.
- Nội thất ấm cúng kiểu Focustown khi vào nhà/quán (cắt cảnh sang phòng bên trong).
- Giữ: thời tiết (mưa/nắng/tuyết) của giao diện nền; Potato Mode giảm bóng, giảm NPC.

**✅ Nhóm chốt (18/10): 3D LOW-POLY THẬT — Phương án A, Three.js.** (Thay cho "không làm 3D" ở 6.1.) Phương án B chỉ để tham khảo.
- **Phương án A — 3D low-poly thật (💡 Claude khuyên):** **Three.js** + bộ mô hình **miễn phí bản quyền CC0** (vd các bộ thành phố, xe, thiên nhiên, nội thất, nhân vật mini của **Kenney** và **Quaternius** ⚠️ kiểm tra lại giấy phép từng bộ khi tải, ghi vào `assets/CREDITS.md`). Có sẵn nhà nhiều cỡ, xe nhiều loại → hợp ngay với ý "mua nhà, xe" (13.4). Trông giống Focustown nhất. Rủi ro: hiệu năng trên điện thoại yếu (giải bằng Potato Mode, giới hạn số vật thể, bóng đổ đơn giản), tùy biến nhân vật 3D khó hơn 2D.
- **Phương án B — 2,5D:** vẽ SVG/Canvas góc nhìn isometric, tô nhiều mặt phẳng giả low-poly. An toàn hơn nhưng khó đạt độ "ấm" và chiều sâu như mong muốn.
- Nếu chọn A, ngân hà (13.1) cũng dùng Three.js → một engine cho cả app.

**Điều khiển ✅:**
- **Joystick ảo** ở góc trái dưới (điện thoại; 💡 thư viện nhẹ dạng nipplejs — MIT, hoặc tự viết), **phím mũi tên/WASD** trên máy tính.
- **Nút hành động** ở góc phải dưới: hiện nhãn khi đứng gần cửa ("Vào ngân hàng", "Nói chuyện"). Va chạm với nhà, cây, nước.
- ✅ **Không có chạm-để-đi** (nhóm chốt bỏ hẳn). Chỉ joystick + phím.
- Khi vào game: **ẩn thanh điều hướng 5 tab**, có nút thoát; **nút Alti Lion nổi chuyển lên góc phải trên** để không đè nút hành động.

**Nhân vật người chơi 💡 (mẫu đã duyệt hình 18/10, chờ nhóm chốt):** chibi low-poly **dựng hoàn toàn bằng khối hình học trong code** (Three.js, `flatShading`), không dùng mô hình tải về → tùy biến màu/kiểu dễ, không lo bản quyền.
- Tỉ lệ: đầu ≈ 40% chiều cao, thân ngắn, chân ngắn; mắt đen bầu dục có chấm sáng, má hồng, miệng cười nhỏ; tóc = mũ chỏm + mái bằng các khối đa diện.
- Tùy biến (khớp trình tạo nhân vật cũ): màu da, kiểu & màu tóc, áo, quần, giày, phụ kiện.
- **Trang phục tự đổi theo giai đoạn nghề:** Học sinh (áo phông + balo vàng) → Nhân viên (sơ mi + cà vạt tím) → Chủ quán (tạp dề + mũ xanh lá) → Ông trùm (vest tối + cà vạt đỏ + vương miện vàng). Màu lấy từ bảng màu thương hiệu.
- Hoạt ảnh: thở nhẹ khi đứng, đung đưa tay chân + nhún khi đi theo joystick, nghiêng đầu; tôn trọng Potato Mode & giảm chuyển động.

**Bản đồ:** giữ 6 khu ở 6.1b + **khu thứ 7: NHTW & tòa tin tức** (Vĩ mô). Mỗi khu mở rộng khi học mảng tương ứng. Thế giới vẫn lớn hơn nhiều màn hình, camera theo nhân vật, có minimap.

---

### 13.4 NHÀ, XE & NET WORTH ✅ ý tưởng · 💡 luật kinh tế

**Ý của nhóm ✅ — cách làm 13.4 cũng ✅ (nhóm chốt 18/10):** nhiều tiền → mua được **xe sang, nhà đẹp**; giai đoạn đầu chỉ nhà/xe bình thường; muốn giàu phải giải tốt các vấn đề kinh doanh.

**⚠️ Góc nhìn giáo sư — chỗ này có thể phản tác dụng:** nếu xe sang chỉ là *phần thưởng khoe*, game đang dạy đúng điều app muốn chữa (khảo sát: **20/46** teen mua đồ vì bạn bè có). Giải pháp không phải bỏ ý tưởng, mà để **chính nhà và xe dạy tài chính**:
1. **Tài sản vs tiêu sản:** xe **mất giá** mỗi tháng + tốn **xăng, bảo dưỡng, bảo hiểm, gửi xe**; nhà có thể **tăng giá** và **cho thuê** (tạo thu nhập) nhưng tốn phí bảo trì, thuế. Net worth tính theo **giá thị trường hiện tại**, nên mua xe sang quá sớm → net worth **giảm** và dòng tiền âm.
2. **Quy tắc của người giàu thật:** chỉ mua món "khoe" khi **thu nhập thụ động** (lợi nhuận quán, tiền cho thuê nhà, cổ tức) **trả được chi phí nuôi nó**. Alti Lion nhắc khi người chơi định mua vượt sức.
3. **Mua bằng vay:** được vay mua nhà/xe, nhưng cần **điểm tín dụng** (nối bài P2) và chịu **lãi suất do NHTW mô phỏng** (nối M2) → lãi suất tăng thì khoản trả tăng thật.
4. **Mở khóa theo giai đoạn, không chỉ theo tiền:** món cao cấp cần cấp nghề/chuỗi cửa hàng (giai đoạn doanh nghiệp) → buộc phải *giỏi kinh doanh*, không chỉ cày tiền.
5. **Xếp hạng theo net worth, không theo đồ:** người mua xe sang mà nợ nần sẽ xếp **dưới** người sống giản dị nhưng có tài sản sinh lời. Đây là "aha" của game.

**Bậc tài sản gợi ý 💡** (giá theo đơn vị tiền trong game, chỉnh khi cân bằng):
| Giai đoạn | Nhà | Xe |
|---|---|---|
| Cá nhân (đi làm) | Phòng trọ → căn hộ nhỏ | Đi bộ → xe đạp → xe máy |
| Chủ quán | Nhà phố | Xe máy tốt → ô tô nhỏ |
| Chuỗi cửa hàng | Nhà phố có sân vườn, có thể mua thêm căn để cho thuê | Ô tô gia đình |
| Ông trùm 👑 | Biệt thự | Xe thể thao / xe sang |
- Mỗi món có: giá mua, phí duy trì/tháng, % mất giá hoặc tăng giá/tháng, (nhà) tiền thuê nếu cho thuê.
- Nhà mua về **trang trí nội thất được** (kiểu Animal Crossing/Focustown) bằng tiền trong game.

**✅ Bảng xếp hạng "đứa nào nhiều tiền" (nhóm đồng ý dùng NPC cho demo):** cần máy chủ để so với người thật → **demo không có** (localStorage). 💡 Demo: xếp hạng với **6–8 NPC "bạn cùng lớp"** có phong cách khác nhau (người tiêu xài, người tiết kiệm, người liều, người kinh doanh giỏi) — vừa tạo động lực, vừa minh họa các lối sống tài chính. 🔜 Bản thật: bảng xếp hạng bạn bè/lớp học.

---

### 13.5 Mâu thuẫn & điểm chưa rõ — ✅ ĐÃ TRẢ LỜI 18/10
- ✅ (1) **3D low-poly thật**, Three.js. (2) **Nhà/xe dạy tài sản vs tiêu sản** theo đúng 13.4, xếp hạng theo net worth. (3) **Xếp hạng với NPC** cho demo. (4) **Bỏ chạm-để-đi**, chỉ joystick + phím; nút Alti Lion lên góc phải trên khi trong game. (5) **Đồng ý lịch 13.6** và thứ tự hoãn. (6) Người duyệt nội dung: chờ nhóm phân công.

_Câu hỏi gốc:_
1. **3D low-poly hay 2,5D?** (13.3) — quyết định ảnh hưởng cả ngân hà lẫn game.
2. **Xe sang/nhà đẹp là phần thưởng khoe hay công cụ dạy tài sản vs tiêu sản?** Claude khuyên cách 13.4.
3. **Bảng xếp hạng:** đồng ý dùng NPC cho demo?
4. **Chạm-để-đi** giữ làm tùy chọn hay bỏ hẳn?
5. **Phạm vi trong 5 ngày còn lại:** khối lượng tăng (ngân hà + 3D + 20 bài làm lại + mảng mới + nhà/xe). Phải chọn cái **hoãn** — xem 13.6.
6. **Ai duyệt nội dung bài:** cần 1 người (đề xuất Phước Tấn) duyệt số liệu + 1 người (Gia Mẫn) soát bản EN theo ngày.

---

### 13.6 Lịch mới (💡 chờ nhóm duyệt)
Khối lượng tăng mạnh nhưng hạn không đổi → **giữ nguyên vòng lặp demo mục 8**, hoãn phần không lên video.

| Ngày | Việc |
|---|---|
| **18/10 (chiều)** | Nhóm duyệt mục 13, trả lời 13.5. Cập nhật file này lên repo. |
| **19/10** | **Ngân hà Altair** (3 tầng zoom, trạng thái, dải sáng, hành tinh nhà, danh sách) thay con đường; dữ liệu 6 mảng/20 bài (bài chưa có = hành tinh phác thảo). |
| **20/10** | **Thị trấn low-poly**: Three.js + asset CC0, joystick + phím, camera, va chạm, 7 khu, NPC, thời tiết, nhân vật tùy biến, HUD net worth. |
| **21/10** | **Chế độ Cá nhân** + **nhà & xe** (13.4) + bài **P1, P2, P3** (theo khung 13.2c). |
| **22/10** | **Chế độ Doanh nghiệp** + bài **B1, B3, B4** + **M2** (núm lãi suất — trùng vòng demo). |
| **23/10** | **1 cuộc khủng hoảng làm thật đẹp** (đề xuất 2008 hoặc 1929, có đổi vai Thống đốc) + **M1, M3** + deploy. |
| 24–26/10 | Đệm: các bài còn lại (P4, P5, B2, B5, M4, I1–2, G1–2, X1–2), Khám phá 3 bài, sửa lỗi, kiểm thử điện thoại. |
| 27–28/10 | Kiểm chứng số liệu/ảnh/giấy phép; khóa tính năng. |
| 29–31/10 | Quay video, hoàn thiện PDF. |
| **01/11** | Nộp trước 23:59. |

**Hoãn sang sau demo (🔜) nếu thiếu thời gian, theo thứ tự hoãn trước:** màn chơi riêng cho Đầu tư/Công/Quốc tế → 2 cuộc khủng hoảng còn lại (để ở dạng phòng bảo tàng "sắp mở") → trang trí nội thất nhà → âm thanh.
**Không hoãn:** ngân hà, thị trấn low-poly + joystick, net worth + nhà/xe, chế độ Cá nhân & Doanh nghiệp, M2, bản EN.
