import React from 'react';
import { X, Check, Building2, User, Landmark, Sparkles, HelpCircle } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planName: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50/80 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                باقات SaaS B2B واضحة
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-['Cairo',sans-serif]">
                خطط الاشتراك والتراخيص المؤسسية
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              بدون تكاليف تشغيلية مبالغ فيها وبدون وعود وهمية — ركز على مخرجات تعليمية محكمة وتصدير Word فوري
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1: Independent Trainer */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                  المدرب المستقل
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  للمدرب المحترف الذي يرغب بتوفير أيام العمل في إعداد الحقائب
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">24$</span>
                  <span className="text-xs text-slate-500 mr-1">/ شهرياً</span>
                  <div className="text-[11px] text-indigo-600 mt-0.5 font-medium">
                    (أو 240$ سنوياً بخصم شهرين)
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>توليد حقائب تدريبية متوافقة مع هرم بلوم</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>محرر كامل لمراجعة وتعديل كافة الأقسام</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>تصدير Word (.docx) منسق فوراً للطباعة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>أدوات التقييم وروبريك الأداء وبنك الأسئلة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>أولوية في طلبات المراجعة البشرية المعتمدة</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan('المدرب المستقل')}
                className="w-full mt-6 py-2.5 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold text-xs transition-colors cursor-pointer"
              >
                اختيار باقة المدرب المستقل
              </button>
            </div>

            {/* Plan 2: Training Center (Featured) */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between relative shadow-xl border border-slate-800">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wide">
                الأكثر طلباً لمراكز التدريب
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-['Cairo',sans-serif]">
                  مركز التدريب والأكاديميات
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  رخصة فريق عمل كامل مع هوية وقوالب خاصة بالمركز
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">79$</span>
                  <span className="text-xs text-slate-400 mr-1">/ شهرياً للفريق</span>
                  <div className="text-[11px] text-indigo-400 mt-0.5 font-medium">
                    (أو 790$ سنوياً شامل جلسة تأسيس)
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>رخصة لـ 5 مدربين ومصممي حقائب في المركز</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>إدراج شعار وبيانات المركز في غلاف ملفات Word</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>قوالب قطاعية خاصة متوافقة مع معايير المركز</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>جلسة تأسيس عن بعد لتدريب الفريق على المنصة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>خصم 25% على كافة طلبات المراجعة البشرية</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan('مركز التدريب')}
                className="w-full mt-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                تفعيل رخصة مركز التدريب
              </button>
            </div>

            {/* Plan 3: Organizations & NGOs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                  المنظمات والجامعات
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  حقائب مصممة خصيصاً لمشاريع التنمية والمناقصات والجامعات
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">مخصص</span>
                  <span className="text-xs text-slate-500 mr-1">/ حسب نطاق المشروع</span>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    (عقد مشروع مستقل + رخصة استخدام)
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>تصميم حقائب خاصة متوافقة مع متطلبات المانحين</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>مواءمة معايير الجهات التنظيمية والاعتماد المهني</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>تدقيق استشاري كامل قبل التسليم النهائي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>دعم قانوني وفني وتدريب لموظفي المنظمة</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan('المنظمات والجامعات')}
                className="w-full mt-6 py-2.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                طلب عرض سعر مؤسسي
              </button>
            </div>
          </div>

          {/* Value Proposition Strategy Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold text-indigo-950">لماذا «منهج AI» هو الخيار الرابح؟</strong>
              <p className="leading-relaxed text-slate-700">
                المنافس الحقيقي للمدرب ليس مجرد منصات أخرى؛ المنافس هو إضاعة أيام في التنسيق اليدوي في Google Docs والتخبط في صياغة أهداف بلوم وجداول الجلسات. منهج AI يختصر هذه الأيام إلى دقائق، ويعطيك حقيبة متقنة ومخرجات منظمة جاهزة للاستخدام والطباعة فوراً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
