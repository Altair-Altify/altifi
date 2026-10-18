/* The course map (design doc 13.2d): 6 areas, 20 lessons. Each lesson is a planet in the Altair galaxy (13.1).
 * A node without `lesson` has no content yet: it shows as a dashed "sketch" planet with the day it is scheduled (13.6).
 * prereq = "good to know first" (13.2f): ids, and may point into another area — those become the cross-area light bands. */
import type { TL } from "../i18n/i18n";
import type { CourseNode, DomainId, Lesson } from "../lesson/types";
import budget from "./lessons/p-budget";
import inflation from "./lessons/p-inflation";
import breakeven from "./lessons/c-breakeven";
import placement from "./placement";

export interface Domain {
  id: DomainId; ic: string;
  color: string; // system / nebula color (13.1 "Màu 6 mảng")
  title: TL; tag?: TL; desc: TL;
  nodes: CourseNode[];
}

type N = Omit<CourseNode, "domain">;
const area = (d: Omit<Domain, "nodes">, nodes: N[]): Domain => ({ ...d, nodes: nodes.map((n) => ({ ...n, domain: d.id })) });
const T = (vi: string, en: string) => ({ vi, en });

export const DOMAINS: Domain[] = [
  area({ id: "personal", ic: "piggy", color: "#F7867A", title: T("Tài chính cá nhân", "Personal Finance"), tag: T("Tiền của tôi", "My money"), desc: T("Chi tiêu, tín dụng, tiết kiệm, lừa đảo, lương & thuế", "Spending, credit, saving, scams, pay & tax") }, [
    { id: "p-budget", code: "P1", ic: "piggy", lesson: budget, day: "21/10", prereq: [],
      title: T("Tiền tiêu vặt & ngân sách", "Pocket money & budgets"), hook: T("Tiền tiêu vặt của mình biến đi đâu hết?", "Where does my pocket money disappear to?"),
      unlock: T("Sổ chi tiêu", "Spending log"), planet: { shape: "rocky", palette: ["#F4A28C", "#F7C59F", "#9FD6A8", "#FFF1D6"], feature: "leak" } },
    { id: "p-bnpl", code: "P2", ic: "card", day: "21/10", prereq: ["p-budget"],
      title: T("Trả sau & tín dụng", "Pay-later & credit"), hook: T("“Trả sau 0%” có thật sự 0 đồng?", "Is “0% pay later” really free?"),
      unlock: T("Thẻ tín dụng & điểm tín dụng", "Credit card & credit score"), planet: { shape: "rocky", palette: ["#C86B85", "#E89AAE", "#F6C6D0", "#FFE9EE"], feature: "cardRing" } },
    { id: "p-inflation", code: "P3", ic: "drop", lesson: inflation, day: "21/10", prereq: [],
      title: T("Sức mua & lãi kép", "Purchasing power & compounding"), hook: T("Vì sao 100 nghìn của mình đang teo dần?", "Why is my 100k slowly shrinking?"),
      unlock: T("Sổ tiết kiệm ở ngân hàng", "A savings book at the bank"), planet: { shape: "ice", palette: ["#8FB8F0", "#BFD9FA", "#E6F2FF", "#FFFFFF"], feature: "shrink" } },
    { id: "p-scam", code: "P4", ic: "bolt", day: "24/10", prereq: ["p-inflation"],
      title: T("Nhận diện lừa đảo", "Spotting scams"), hook: T("Làm sao biết mình sắp bị lừa?", "How do I know I'm about to be scammed?"),
      unlock: T("Sự kiện lừa đảo bất ngờ trong game", "Surprise scam events in the game"), planet: { shape: "rocky", palette: ["#5C4A6E", "#7D6590", "#A58BB5", "#D9C6E3"], feature: "flags" } },
    { id: "p-salary", code: "P5", ic: "banknote", day: "24/10", prereq: ["p-budget"],
      title: T("Lương, thuế & bảo hiểm", "Pay, tax & insurance"), hook: T("Lương 10 triệu, cầm về được bao nhiêu?", "A 10-million salary — how much do I take home?"),
      unlock: T("Việc làm có lương & bảo hiểm", "Paid jobs & insurance"), planet: { shape: "rocky", palette: ["#E8956B", "#F3B98A", "#F8D9A8", "#FFF0D2"], feature: "strata" } },
  ]),
  area({ id: "corporate", ic: "shop", color: "#F5A524", title: T("Tài chính doanh nghiệp", "Business Finance"), tag: T("Quán của tôi", "My shop"), desc: T("Mở một quán trà sữa — mỗi bài là một khủng hoảng thật của quán", "Run a milk-tea shop — every lesson is one of its real crises") }, [
    { id: "c-breakeven", code: "B1", ic: "calc", lesson: breakeven, day: "22/10", prereq: [],
      title: T("Chi phí & điểm hòa vốn", "Costs & break-even"), hook: T("Bán một ly trà sữa lời bao nhiêu?", "How much profit is in one cup of milk tea?"),
      unlock: T("Quầy hàng đầu tiên", "Your first stall"), planet: { shape: "rocky", palette: ["#C99A6B", "#DDB78B", "#EED3AE", "#FFF3E0"], feature: "boba" } },
    { id: "c-price", code: "B2", ic: "percent", day: "24/10", prereq: ["c-breakeven"],
      title: T("Định giá & khuyến mãi", "Pricing & promotions"), hook: T("Giá bao nhiêu thì đúng?", "What's the right price?"),
      unlock: T("Chỉnh giá & khuyến mãi", "Set prices & promotions"), planet: { shape: "rocky", palette: ["#E5873A", "#F2A65A", "#F9C98B", "#FFE6C2"], feature: "tagRing" } },
    { id: "c-cash", code: "B3", ic: "drop", day: "22/10", prereq: ["c-breakeven"],
      title: T("Lợi nhuận ≠ tiền mặt", "Profit ≠ cash"), hook: T("Lời mà vẫn phá sản — chuyện gì vậy?", "Profitable yet bankrupt — how?"),
      unlock: T("Báo cáo dòng tiền của quán", "Your shop's cash-flow report"), planet: { shape: "rocky", palette: ["#9C7A5B", "#B8977A", "#D4BC9F", "#EFE2CF"], feature: "craters" } },
    { id: "c-funding", code: "B4", ic: "scale", day: "22/10", prereq: ["c-breakeven"],
      title: T("Vay nợ hay gọi vốn", "Debt or equity"), hook: T("Vay ngân hàng hay gọi vốn kiểu Shark Tank?", "A bank loan or a Shark Tank pitch?"),
      unlock: T("Vay vốn / gọi vốn", "Loans & investors"), planet: { shape: "rocky", palette: ["#D98E2B", "#ECB04E", "#F6D27E", "#FFF0BF"], feature: "twin" } },
    { id: "c-growth", code: "B5", ic: "rocket", day: "25/10", prereq: ["c-cash", "c-funding"],
      title: T("Mở rộng & NPV", "Growth & NPV"), hook: T("Mở 10 chi nhánh cùng lúc: liều hay khôn?", "Opening 10 branches at once: bold or smart?"),
      unlock: T("Chi nhánh trên các lô đất", "Branches on the map's plots"), planet: { shape: "rocky", palette: ["#7FA35B", "#A3C27A", "#C9DDA0", "#EEF5D8"], feature: "cities" } },
  ]),
  area({ id: "macro", ic: "sliders", color: "#8B6CF0", title: T("Kinh tế vĩ mô", "Macroeconomics"), tag: T("Nền kinh tế vận hành ra sao", "How the economy works"), desc: T("Lạm phát, lãi suất, GDP, chính sách — lõi để hiểu tin tức kinh tế", "Inflation, interest rates, GDP, policy — the core of reading economic news") }, [
    { id: "m-inflation", code: "M1", ic: "chart", day: "23/10", prereq: ["p-inflation"],
      title: T("Nguồn gốc lạm phát", "Where inflation comes from"), hook: T("Lạm phát đến từ đâu?", "Where does inflation come from?"),
      unlock: T("Chỉ số giá trên bảng tin thị trấn", "A price index on the town board"), planet: { shape: "gas", palette: ["#B79CFF", "#E0B8FF", "#FFC2D9", "#9D7BF0"], feature: "swell", size: 1.3 } },
    { id: "m-centralbank", code: "M2", ic: "bank", day: "22/10", prereq: ["p-bnpl", "c-funding"],
      title: T("NHTW & lãi suất", "Central bank & interest rates"), hook: T("Ngân hàng trung ương — người cầm vòi nước", "The central bank — who holds the tap?"),
      unlock: T("Lãi suất trong game do NHTW mô phỏng", "In-game rates set by a simulated central bank"), planet: { shape: "ocean", palette: ["#4C55C7", "#6F7BE6", "#9FD3B0", "#F1F6E8"], feature: "dial", size: 1.15 } },
    { id: "m-news", code: "M3", ic: "doc", day: "23/10", prereq: ["i-stocks"],
      title: T("GDP & chu kỳ kinh tế", "GDP & the business cycle"), hook: T("Đọc một bản tin kinh tế trong 60 giây", "Read an economic news story in 60 seconds"),
      unlock: T("Tòa tin tức trong thị trấn", "The newsroom in town"), planet: { shape: "rocky", palette: ["#6F5BBF", "#9585D9", "#BFB4EE", "#ECE8FF"], feature: "satellites" } },
    { id: "m-policy", code: "M4", ic: "sliders", day: "25/10", prereq: ["g-tax", "g-debt"],
      title: T("Tài khóa & tiền tệ", "Fiscal & monetary policy"), hook: T("Hai tay lái: chính phủ & NHTW", "Two steering wheels: government & central bank"),
      unlock: T("Vai Thống đốc trong chế độ Khủng hoảng", "The Governor role in Crisis mode"), planet: { shape: "rocky", palette: ["#584AA8", "#7C6CCB", "#A99BE6", "#E2DCFF"], feature: "twinMoons" } },
  ]),
  area({ id: "markets", ic: "chart", color: "#1BB0C2", title: T("Đầu tư & thị trường", "Investing & Markets"), desc: T("Rủi ro – lợi nhuận, đa dạng hóa, bong bóng, tài sản trú ẩn", "Risk & return, diversification, bubbles, safe havens") }, [
    { id: "i-stocks", code: "I1", ic: "chart", day: "25/10", prereq: ["p-inflation"],
      title: T("Cổ phiếu & đa dạng hóa", "Stocks & diversification"), hook: T("Chứng khoán: đầu tư hay đánh bạc?", "Stocks: investing or gambling?"),
      unlock: T("Sàn giao dịch", "The stock exchange"), planet: { shape: "rocky", palette: ["#2D8FA0", "#4FB3C0", "#8ED8DC", "#DDF6F4"], feature: "bars" } },
    { id: "i-bubbles", code: "I2", ic: "coin", day: "25/10", prereq: ["i-stocks"],
      title: T("Bong bóng & tài sản trú ẩn", "Bubbles & safe havens"), hook: T("Vàng, đất, tiền ảo: vì sao giá lên xuống điên cuồng?", "Gold, land, crypto: why do prices swing so wildly?"),
      unlock: T("Tiệm vàng & quầy ngoại tệ", "Gold shop & currency desk"), planet: { shape: "rocky", palette: ["#3C7F86", "#5FA5A8", "#9CCFC9", "#E2F3EE"], feature: "crystals" } },
  ]),
  area({ id: "public", ic: "bank", color: "#3D7BF5", title: T("Tài chính công", "Public Finance"), desc: T("Thuế, ngân sách nhà nước, nợ công", "Taxes, the state budget, public debt") }, [
    { id: "g-tax", code: "G1", ic: "pie", day: "26/10", prereq: [],
      title: T("Thuế & ngân sách nhà nước", "Taxes & the state budget"), hook: T("Tiền thuế của mình đi đâu?", "Where do my taxes go?"),
      unlock: T("Công trình ở tòa thị chính", "Projects at the town hall"), planet: { shape: "rocky", palette: ["#3D7BF5", "#7AA7FA", "#F5B841", "#7ED3A1", "#F28C8C"], feature: "pie" } },
    { id: "g-debt", code: "G2", ic: "doc", day: "26/10", prereq: ["g-tax"],
      title: T("Thâm hụt & nợ công", "Deficits & public debt"), hook: T("Chính phủ vay nợ: tốt hay xấu?", "Government borrowing: good or bad?"),
      unlock: T("Vai Bộ trưởng Tài chính", "The Finance Minister role"), planet: { shape: "gas", palette: ["#5A86E0", "#86A9EE", "#B7CDF6", "#E3ECFC"], feature: "saturn", size: 1.15 } },
  ]),
  area({ id: "intl", ic: "ship", color: "#2FAE73", title: T("Tài chính quốc tế", "International Finance"), desc: T("Tỷ giá, dòng vốn, khủng hoảng 1997", "Exchange rates, capital flows, the 1997 crisis") }, [
    { id: "x-fx", code: "X1", ic: "swap", day: "26/10", prereq: ["m-inflation"],
      title: T("Tỷ giá", "Exchange rates"), hook: T("Vì sao USD tăng thì du học & iPhone đắt hơn?", "Why does a strong dollar make iPhones and studying abroad pricier?"),
      unlock: T("Cảng & quầy đổi tiền", "The port & exchange desk"), planet: { shape: "rocky", palette: ["#2E9B6A", "#5DBE8C", "#E4766A", "#F3B0A6"], feature: "split" } },
    { id: "x-1997", code: "X2", ic: "globe", day: "26/10", prereq: ["x-fx", "m-centralbank"],
      title: T("Khủng hoảng châu Á 1997", "The 1997 Asian crisis"), hook: T("1997: khi cả châu Á sụp đổ trong vài tháng", "1997: when Asia crashed in a few months"),
      unlock: T("Phòng 1997 trong Bảo tàng Khủng hoảng", "The 1997 room in the Crisis Museum"), planet: { shape: "rocky", palette: ["#4E6B5C", "#6F8C7B", "#97B3A0", "#D0E2D4"], feature: "cracked" } },
  ]),
];

export const NODES: CourseNode[] = DOMAINS.flatMap((d) => d.nodes);
export const isReal = (n: CourseNode): n is CourseNode & { lesson: Lesson } => !!n.lesson;
export const ALL_LESSONS: Lesson[] = NODES.filter(isReal).map((n) => n.lesson);
export const findLesson = (id: string) => (id === placement.id ? placement : ALL_LESSONS.find((l) => l.id === id));
export const findNode = (id: string) => NODES.find((n) => n.id === id);
export const domainOf = (id: DomainId) => DOMAINS.find((d) => d.id === id)!;
