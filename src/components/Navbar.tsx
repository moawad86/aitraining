import React from 'react';
import { FileDown, Sparkles, UserCheck, CreditCard, BookOpen, PlusCircle } from 'lucide-react';
import { TrainingPackage } from '../types';

interface NavbarProps {
  currentPackage: TrainingPackage | null;
  onOpenNewNeedModal: () => void;
  onExportWord: () => void;
  onOpenHumanReview: () => void;
  onOpenPricing: () => void;
  isExporting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPackage,
  onOpenNewNeedModal,
  onExportWord,
  onOpenHumanReview,
  onOpenPricing,
  isExporting
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <BookOpen className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Cairo',sans-serif]">
                  منهج AI
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                  B2B للمدربين والمراكز
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                تحويل الاحتياج إلى حقيبة تدريبية جاهزة وفق معايير التصميم التعليمي
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="nav-new-need-btn"
              onClick={onOpenNewNeedModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>حقيبة جديدة</span>
            </button>

            {currentPackage && (
              <button
                id="nav-export-word-btn"
                onClick={onExportWord}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-50 transition-colors shadow-xs cursor-pointer disabled:opacity-60 border border-slate-800"
                title="تصدير ملف Word منسق (.docx)"
              >
                <FileDown className="w-4 h-4 text-indigo-400" />
                <span>{isExporting ? 'جاري التصدير...' : 'تصدير Word'}</span>
              </button>
            )}

            <button
              id="nav-human-review-btn"
              onClick={onOpenHumanReview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors cursor-pointer"
              title="مراجعة بشرية معتمدة من استشاري تصميم تعليمي"
            >
              <UserCheck className="w-4 h-4 text-amber-700" />
              <span className="hidden md:inline">مراجعة بشرية معتمدة</span>
              <span className="md:hidden">مراجعة</span>
            </button>

            <button
              id="nav-pricing-btn"
              onClick={onOpenPricing}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="باقات ورخص الاشتراك"
            >
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">الباقات والأسعار</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
