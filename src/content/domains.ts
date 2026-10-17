/* The 5 areas of finance (design doc 3.1) and the lesson list of each (3.4).
 * Lessons without content yet are stubs: they show on the path as "coming soon". */
import type { TL } from "../i18n/i18n";
import type { DomainId, Lesson, LessonStub } from "../lesson/types";
import budget from "./lessons/p-budget";
import inflation from "./lessons/p-inflation";
import breakeven from "./lessons/c-breakeven";

export interface Domain { id: DomainId; icon: string; color: string; title: TL; desc: TL; lessons: (Lesson | LessonStub)[] }

const stub = (domain: DomainId, id: string, icon: string, vi: string, en: string): LessonStub => ({ id, domain, icon, title: { vi, en }, soon: true });

export const DOMAINS: Domain[] = [
  {
    id: "personal", icon: "🏡", color: "#2BB673",
    title: { vi: "Tài chính cá nhân", en: "Personal Finance" },
    desc: { vi: "Ngân sách, tiết kiệm, tín dụng, bảo hiểm, hưu trí", en: "Budgeting, saving, credit, insurance, retirement" },
    lessons: [
      budget,
      inflation,
      stub("personal", "p-credit", "💳", "Tín dụng & nợ", "Credit & debt"),
      stub("personal", "p-rates", "🌊", "Lãi suất cố định vs thả nổi", "Fixed vs floating rates"),
      stub("personal", "p-insurance", "☂️", "Bảo hiểm", "Insurance"),
      stub("personal", "p-retire", "🌳", "Hưu trí & đầu tư dài hạn", "Retirement & long-term investing"),
    ],
  },
  {
    id: "corporate", icon: "🏪", color: "#8E44AD",
    title: { vi: "Tài chính doanh nghiệp", en: "Corporate Finance" },
    desc: { vi: "Lợi nhuận, báo cáo tài chính, vốn, dự án", en: "Profit, statements, capital, projects" },
    lessons: [
      breakeven,
      stub("corporate", "c-statements", "📑", "Ba báo cáo tài chính", "The three financial statements"),
      stub("corporate", "c-cash", "💧", "Lợi nhuận ≠ tiền mặt", "Profit ≠ cash"),
      stub("corporate", "c-npv", "🧮", "NPV & IRR", "NPV & IRR"),
      stub("corporate", "c-capital", "⚖️", "Cấu trúc vốn & đòn bẩy", "Capital structure & leverage"),
      stub("corporate", "c-growth", "🚀", "Tăng trưởng thông minh & đổi mới phá vỡ", "Smart growth & disruption"),
    ],
  },
  {
    id: "markets", icon: "📈", color: "#F28C28",
    title: { vi: "Thị trường tài chính & Đầu tư", en: "Markets & Investing" },
    desc: { vi: "Các kênh đầu tư, rủi ro, định giá, phái sinh", en: "Asset classes, risk, valuation, derivatives" },
    lessons: [
      stub("markets", "m-assets", "🧺", "Các kênh đầu tư & rủi ro – lợi nhuận", "Asset classes & risk vs return"),
      stub("markets", "m-valuation", "🔍", "Định giá & phái sinh", "Valuation & derivatives"),
    ],
  },
  {
    id: "public", icon: "🏛️", color: "#0E9F9A",
    title: { vi: "Tài chính công", en: "Public Finance" },
    desc: { vi: "Ngân sách nhà nước, thuế, chính sách tài khóa", en: "State budget, taxes, fiscal policy" },
    lessons: [
      stub("public", "g-budget", "🧾", "Ngân sách nhà nước", "The state budget"),
      stub("public", "g-policy", "🎛️", "Chính sách tài khóa vs tiền tệ", "Fiscal vs monetary policy"),
    ],
  },
  {
    id: "intl", icon: "⚓", color: "#3D5AFE",
    title: { vi: "Tài chính quốc tế", en: "International Finance" },
    desc: { vi: "Tỷ giá, cán cân thanh toán, IMF & World Bank", en: "Exchange rates, balance of payments, IMF & World Bank" },
    lessons: [
      stub("intl", "i-fx", "💱", "Tỷ giá & thị trường ngoại hối", "Exchange rates & FX markets"),
      stub("intl", "i-bop", "🌏", "Cán cân thanh toán & khủng hoảng 1997", "Balance of payments & the 1997 crisis"),
    ],
  },
];

export const isReal = (l: Lesson | LessonStub): l is Lesson => !("soon" in l);
export const ALL_LESSONS: Lesson[] = DOMAINS.flatMap((d) => d.lessons.filter(isReal));
export const findLesson = (id: string) => ALL_LESSONS.find((l) => l.id === id);
export const domainOf = (id: DomainId) => DOMAINS.find((d) => d.id === id)!;
