# Altifi

Web app (PWA) giúp teen Việt Nam học tài chính – kinh tế: bài học ngắn + game mô phỏng + trợ lý **Alti Lion** 🦁.
Đọc `ALTIFI_DESIGN.md` (thiết kế, nguồn sự thật duy nhất) và `PROGRESS.md` (tiến độ từng ngày) trước khi làm.

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:5173 — mở trên điện thoại cùng mạng Wi-Fi bằng địa chỉ "Network" Vite in ra
npm run build      # kiểm tra kiểu (tsc) + build vào dist/
npm run preview    # chạy bản build (có service worker → "Thêm vào màn hình chính")
```

Kiểm thử tự động (cần `npm run dev` đang chạy và Playwright): `node scripts/playthrough.cjs vi` (hoặc `en`) — chơi hết mọi bài, in RIGHT/WRONG từng bước.

`dist/` là web tĩnh: deploy thẳng lên GitHub Pages / Netlify / Vercel (đã đặt `base: "./"` nên chạy được ở thư mục con).

## Cấu trúc

```
index.html              vỏ trang: khung điện thoại, 5 tab, overlay
public/                 manifest, service worker (sw.js), icon Alti Lion
src/main.ts             khởi động app
src/core/               state.ts (lưu + migrate save cũ), actions.ts (A.xxx cho onclick), util.ts
src/i18n/               i18n.ts (t, tx, đổi VI/EN) · strings.ts (mọi chuỗi giao diện [vi, en])
src/mascot/lion.ts      vẽ Alti Lion: lion(size, mood, cfg) — thay cho tiko() cũ
src/ui/                 shell (thanh trên, điều hướng, overlay, pop-up kết quả), learn (lớp HTML trên ngân hà + dạng Danh sách), explore, play, me, buddy, settings, weather, fx
src/lesson/             types.ts (định dạng dữ liệu bài học) · player.ts (engine 16 dạng bài) · video.ts (trình phát video hoạt họa)
src/assistant/          assistant.ts (nút Alti Lion góc phải + chat theo ngữ cảnh) · kb.ts (kho câu trả lời 3 cấp × 2 ngôn ngữ) · context.ts
src/content/            domains.ts (6 mảng · 20 bài = 20 hành tinh, mục 13.2d) · lessons/*.ts (mỗi bài một file)
src/galaxy/             Dải ngân hà Altair (Three.js, mục 13.1): layout.ts (vị trí hệ/hành tinh) · planet.ts (hành tinh low-poly procedural) · sky.ts (sao, tinh vân, bụi xoắn ốc) · scene.ts (camera 3 tầng zoom, cử chỉ) · home.ts (hành tinh nhà ở tab Chơi)
src/styles/             base.css (từ altifi-base.html) · lesson.css (từ prototype) · app.css · ui2.css (nâng cấp giao diện 10c)
src/ui/icons.ts         bộ icon SVG dùng chung: icon(name, {size, color, label}) — xem tất cả ở /dev/icons.html khi chạy dev
src/ui/scenes.ts        mảnh minh họa SVG (cây, nhà, cửa hàng, tòa kính, tòa thị chính, cảng) + Alti Lion toàn thân ở mascot/lion.ts
src/ui/realimage.ts     ảnh thật từ Wikimedia Commons (lấy lúc chạy trong trình duyệt người dùng)
src/ui/skybg.ts         nền ngân hà nhẹ (canvas 2D) cho Khám phá · Tôi · Cài đặt · Chơi
reference/              3 file HTML gốc (base, prototype, alti-lion) để đối chiếu
assets/CREDITS.md       nguồn & giấy phép ảnh/asset
```

## Thêm một bài học (không cần sửa engine)

1. Tạo `src/content/lessons/<id>.ts` theo mẫu `p-budget.ts` (mọi chữ là `{ vi, en }`), `id` trùng với id của hành tinh trong `domains.ts`.
2. Trong `src/content/domains.ts`: import file đó và thêm `lesson: <tên import>` vào hành tinh tương ứng → hành tinh tự đổi từ "phác thảo nét đứt" sang hành tinh thật.

Mỗi hành tinh khai báo: `code` (P1…X2), `title` (chủ đề ngắn — nhãn hành tinh), `hook` (câu hỏi bí ẩn — tiêu đề thẻ), `prereq` (id bài "nên biết trước", được trỏ sang mảng khác → dải sáng nối ngang), `unlock` (thứ mở khóa trong game), `planet: { shape, palette, feature, size?, at? }` (`at: [góc°, bán kính]` để đặt tay vị trí).

Dạng bài tập (`t:`): `learn` · `video` · `pick` · `mcq` · `sort` · `match` · `order` · `slider` · `jars` · `spot` · `tap` · `chart` · `calc` · `statement` · `explain` · `predict` — xem `src/lesson/types.ts`.
Bài có thể có `deep: [...]` (tầng **Đào sâu**), `prereq` (**Nên biết trước**) và `review` (thẻ **Ôn nhanh 1 phút**, cũng dùng để hồi tim).

Video hoạt họa = một danh sách cảnh (`VideoDef` trong `src/lesson/video.ts`), ví dụ `compoundVideo` trong `p-inflation.ts`.

## Ảnh thật (RealImage)

Bài Khám phá, phòng bảo tàng khủng hoảng và phần mở đầu bài học khai báo `imageQuery` (hoặc `photo: { query }` trong bài học).
Trình duyệt của người dùng tự gọi API Wikimedia Commons, **chỉ nhận ảnh giấy phép tự do** (Public domain, CC0, CC BY, CC BY-SA), hiện dòng ghi nguồn và lưu cache.
Mất mạng hoặc không tìm thấy ảnh thì hiện hình minh họa SVG.

**Chọn & ghim ảnh cho video demo:** mở app với `?pick=1` (vd `http://localhost:5173/?pick=1`; khi chạy `npm run dev` thì luôn bật).
Mỗi ảnh có nút ↻ (xem ảnh khác) và nút **imageFile** (chép dòng `imageFile: "Tên_file.jpg"`).
Dán dòng đó vào dữ liệu (`imageFile` trong `src/ui/explore.ts`, `src/ui/play.ts`; `file` trong `photo` của bài học) để ảnh cố định khi quay.

## AI

Bản demo **không gọi API trả phí**: Alti Lion trả lời bằng kho soạn sẵn + luật đơn giản. Chỗ cắm AI thật: `setAnswerEngine()` trong `src/assistant/assistant.ts` (cùng đầu vào: câu hỏi, cấp độ, ngữ cảnh màn hình).
