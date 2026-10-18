# PROGRESS — Altifi

> Đọc file này + `ALTIFI_DESIGN.md` ở đầu mỗi phiên. Cập nhật ở cuối mỗi phiên.

## Quyết định Claude Code tự đưa ra — nhóm duyệt sau

> Tuần thi giữa kì (19–23/10) nhóm không trả lời được; chỗ chưa rõ Claude Code tự chọn theo tài liệu và ghi ở đây. Mỗi dòng: quyết định — lý do. Đổi được dễ (đã ghi chỗ sửa).

- **(20/10) Thị trấn dựng hoàn toàn bằng khối hình học trong code, chưa dùng asset Kenney/Quaternius** — mạng của phiên bị chặn tới kenney.nl và quaternius.com (proxy từ chối), và 13.3 đã chọn cách này cho nhân vật; không phải lo giấy phép. Muốn thêm mô hình CC0 sau: tải về `public/models/`, ghi `assets/CREDITS.md`.
- **(20/10) Bóng đổ = "bóng tròn mềm" màu tím xanh vẽ sẵn dưới mỗi vật, không dùng shadow map** — rẻ cho điện thoại yếu, đúng ý "bóng mềm tím xanh, không đen" của 13.3, và shadow map không khớp với shader thế giới cong.
- **(20/10) Tiền khởi đầu trong game = 2.000.000₫ "tiền lì xì tiết kiệm"** (`ensureGame()` trong `src/ui/town.ts`); save cũ có `netWorth` > 0 thì giữ số đó — cần một con số để HUD net worth có ý nghĩa ngay từ lần đầu vào thị trấn; teen 14–17 chưa có lương. Cân bằng lại khi làm chế độ Cá nhân (21/10).
- **(20/10) Camera cố định hướng (không xoay), cao ~44°, nhìn hơi về phía trước nhân vật; FOV tự tăng trên màn hình dọc** — giống cách camera kiểu Animal Crossing; màn điện thoại hẹp cần FOV rộng hơn để thấy đủ phố.
- **(20/10) Cửa có thể vào = nút hành động góc phải dưới hiện khi đứng gần (≤ 1,9 m); trong nhà/quầy hiện khung thoại kem + nút "Học ngay" nếu chưa học bài mở khóa nơi đó** — 13.3 yêu cầu nút hành động có nhãn; gắn mỗi nơi với cột "Game" của 13.2d để học xong có lý do vào game (13.2b-7).

## Phiên 5 — 20/10: Thị trấn low-poly (mục 13.3) — đang làm

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

## ▶️ Việc đầu tiên của phiên sau (20/10 — Thị trấn low-poly, mục 13.3)
0. Thị trấn mở từ tab Chơi qua `goTown()` trong `src/ui/play.ts` (sau cú lao camera của `HomeSpace.dive`) — thay `openTown()` tạm bằng thị trấn thật; giữ **nắng pastel**, thời tiết vẽ vào `#wxTown`.
1. Đọc `ALTIFI_DESIGN.md` **mục 13** (13.1b, 13.3 checklist "giống Animal Crossing", 13.4, 13.6) + file này. `npm install && npm run dev`, `node scripts/playthrough.cjs vi`.
2. **Dùng lại engine của ngân hà**: cùng Three.js (đã tách chunk), cách tô phẳng từng mặt + nhiễu trong `src/galaxy/planet.ts` (`fbm`, `seeded`, `flatShading`), mẫu class `Galaxy` trong `src/galaxy/scene.ts` (resize, vòng lặp tự dừng qua `hidden()`, `motion` cho Khoai tây/giảm chuyển động, nhãn HTML qua `project()`). Thêm `src/game/` cho thị trấn.
3. Làm theo 13.6 ngày 20/10: Three.js + asset CC0 (Kenney/Quaternius — **kiểm tra giấy phép từng bộ, ghi `assets/CREDITS.md`**), joystick + WASD (không chạm-để-đi), camera cao ~45° bám nhân vật + shader "thế giới cong", va chạm, 7 khu (thêm khu NHTW & tòa tin tức), NPC chibi, thời tiết, nhân vật dựng bằng khối hình học (tùy biến, đổi trang phục theo giai đoạn), HUD net worth (đặt `S.game.netWorth`, đẩy giá trị theo tháng vào `S.game.history`).
4. Khi vào game: ẩn thanh 5 tab, có nút thoát, nút Alti Lion nổi lên góc phải trên. Hành tinh nhà trên ngân hà đã dẫn sang tab Chơi — có thể cho số đèn đọc từ tiến độ thị trấn.

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
