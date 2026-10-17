/* Placement test (design doc 3.2 & 10c.2): 8 quick questions → sets Alti Lion's level and suggests where to start.
 * Built on the common misconceptions from the team's survey (section 1.3). No hearts are lost here. */
import type { Lesson } from "../lesson/types";

const placement: Lesson = {
  id: "placement",
  kind: "placement",
  domain: "personal",
  icon: "🧭",
  ic: "target",
  minutes: 3,
  title: { vi: "Bài test xếp lớp", en: "Placement test" },
  desc: { vi: "8 câu nhanh để Alti Lion biết nên giải thích cho bạn ở mức nào và gợi ý điểm bắt đầu.", en: "8 quick questions so Alti Lion knows how to explain things to you and where to start." },
  review: { title: { vi: "Xếp lớp", en: "Placement" }, points: [{ vi: "Không sao nếu chưa biết — cứ chọn \"Mình chưa biết\".", en: "It's fine not to know — just pick \"I don't know yet\"." }] },
  info: {
    s: { vi: "Bài test xếp lớp: không có đúng/sai mất tim, chỉ để đặt trình độ.", en: "Placement test: no hearts at stake, it just sets your level." },
    l: { vi: "8 câu này đo nhanh các khái niệm hay bị hiểu nhầm (lãi kép, lạm phát, điểm tín dụng, lãi suất thả nổi…). Kết quả đặt trình độ cho Alti Lion (Người mới · Người học · Chuyên sâu) và gợi ý bài nên học trước. Bạn vẫn học được mọi bài.", en: "These 8 questions quickly check commonly misunderstood ideas (compound interest, inflation, credit scores, floating rates…). The result sets Alti Lion's level (Newbie · Learner · Pro) and suggests a first lesson. Every lesson stays open." },
  },
  kb: ["compound", "inflation", "score", "fixedfloat"],
  steps: [
    {
      t: "learn", art: "🧭", title: { vi: "Xếp lớp trong 3 phút", en: "Placement in 3 minutes" },
      text: { vi: "8 câu, không mất tim. Chưa biết thì cứ chọn <b>\"Mình chưa biết\"</b> — trả lời thật giúp Alti Lion giải thích vừa sức bạn.", en: "8 questions, no hearts lost. If you don't know, pick <b>\"I don't know yet\"</b> — honest answers help Alti Lion explain things at your level." },
    },
    { t: "mcq", q: { vi: "Gửi 10 triệu, lãi kép 10%/năm. Sau 2 năm có bao nhiêu?", en: "Deposit 10 million at 10% a year, compounded. How much after 2 years?" }, o: [{ vi: "12,1 triệu", en: "12.1 million" }, { vi: "12 triệu", en: "12 million" }, { vi: "11 triệu", en: "11 million" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "Năm 2 tính lãi trên 11 triệu: 11 × 1,1 = 12,1 triệu. (12 triệu là lãi đơn.)", en: "Year 2 pays interest on 11 million: 11 × 1.1 = 12.1 million. (12 million is simple interest.)" } },
    { t: "mcq", q: { vi: "Lạm phát là…", en: "Inflation is…" }, o: [{ vi: "Mặt bằng giá chung tăng", en: "A rise in the general price level" }, { vi: "VND mất giá so với USD", en: "The dong falling against the USD" }, { vi: "Ngân hàng tăng lãi suất", en: "Banks raising interest rates" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "VND mất giá so với USD là tỷ giá — không phải lạm phát.", en: "The dong falling against the dollar is the exchange rate — not inflation." } },
    { t: "mcq", q: { vi: "Điểm tín dụng cho biết…", en: "A credit score shows…" }, o: [{ vi: "Mức độ đáng tin khi vay và trả nợ", en: "How trustworthy you are as a borrower" }, { vi: "Tổng tiền tiết kiệm của bạn", en: "How much you have saved" }, { vi: "Số tiền đầu tư chứng khoán", en: "How much you invested in stocks" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "Điểm tín dụng dựa trên lịch sử trả nợ, không phải số tiền bạn có.", en: "It's based on your repayment history, not on how much money you have." } },
    { t: "mcq", q: { vi: "Ngân hàng trung ương tăng lãi suất. Người đang vay lãi suất THẢ NỔI sẽ…", en: "The central bank raises rates. Someone with a FLOATING-rate loan will…" }, o: [{ vi: "Phải trả nhiều hơn", en: "Pay more" }, { vi: "Trả như cũ", en: "Pay the same" }, { vi: "Trả ít hơn", en: "Pay less" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "Lãi thả nổi đi theo lãi suất thị trường, nên khoản trả tăng lên.", en: "A floating rate follows market rates, so the payments go up." } },
    { t: "mcq", q: { vi: "Tài sản thế chấp là…", en: "Collateral is…" }, o: [{ vi: "Tài sản bên cho vay có thể xử lý nếu bạn không trả nợ", en: "An asset the lender can take if you don't repay" }, { vi: "Tiền lãi phải trả mỗi tháng", en: "The monthly interest" }, { vi: "Phí mở tài khoản", en: "An account-opening fee" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "Thế chấp giúp người cho vay yên tâm hơn, nên lãi suất thường thấp hơn.", en: "Collateral reassures the lender, so the rate is usually lower." } },
    { t: "mcq", q: { vi: "\"Dòng tiền\" của một người hay doanh nghiệp là…", en: "A person's or company's \"cash flow\" is…" }, o: [{ vi: "Tiền thực sự đi vào và đi ra trong một khoảng thời gian", en: "The money actually coming in and going out over a period" }, { vi: "Tổng tài sản đang có", en: "Everything they own" }, { vi: "Lợi nhuận ghi trên sổ sách", en: "The profit on paper" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "Lời trên sổ sách vẫn có thể thiếu tiền mặt — dòng tiền là tiền thật vào/ra.", en: "You can be profitable on paper and still short of cash — cash flow is the real money in and out." } },
    { t: "mcq", q: { vi: "Theo quy tắc 50/30/20, phần tiết kiệm là bao nhiêu?", en: "In the 50/30/20 rule, how much goes to savings?" }, o: ["20%", "30%", "50%", { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "50% nhu cầu · 30% mong muốn · 20% tiết kiệm.", en: "50% needs · 30% wants · 20% savings." } },
    { t: "mcq", q: { vi: "Chi phí cố định 10 triệu/tháng, mỗi sản phẩm lãi góp 20.000₫. Bán bao nhiêu để hòa vốn?", en: "Fixed costs 10 million a month, each unit contributes 20,000₫. How many to break even?" }, o: ["500", "200", { vi: "5.000", en: "5,000" }, { vi: "Mình chưa biết", en: "I don't know yet" }], a: 0, why: { vi: "10.000.000 ÷ 20.000 = 500.", en: "10,000,000 ÷ 20,000 = 500." } },
  ],
};
export default placement;
