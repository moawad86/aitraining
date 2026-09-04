import React, { useState } from 'react';
import { Sparkles, X, Lightbulb, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TrainingNeedInput, TrainingSector } from '../types';
import { SAMPLE_TRAINING_NEEDS } from '../data/samplePresets';

interface NeedInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: TrainingNeedInput) => void;
  isLoading: boolean;
}

const SECTORS: TrainingSector[] = [
  'تنموي وغير ربحي',
  'إداري وقيادي',
  'مهني وتقني',
  'تربوي وتعليمي',
  'ريادة أعمال ومشاريع',
  'مبيعات وخدمة عملاء',
  'أخرى'
];

export const NeedInputModal: React.FC<NeedInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<TrainingNeedInput>({
    title: '',
    sector: 'تنموي وغير ربحي',
    targetAudience: '',
    audienceLevel: 'متوسط',
    totalHours: 16,
    totalDays: 3,
    trainingGap: '',
    expectedOutcomes: '',
    trainerOrCenterName: ''
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof SAMPLE_TRAINING_NEEDS[0]) => {
    setSelectedPresetId(preset.id);
    setFormData({ ...preset.data });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Cairo',sans-serif]">
                نموذج إدخال وتوصيف احتياج الدورة التدريبية
              </h2>
              <p className="text-xs text-slate-500">
                أدخل معايير الحقيبة لتحويلها إلى هيكل تدريبي، خطة جلسات، أنشطة، وروبريك تقييم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Selection */}
        <div className="px-6 pt-5 pb-3 bg-indigo-50/40 border-b border-indigo-100/80">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">
              قوالب واحتياجات جاهزة للتجربة بنقرة واحدة (موصى بها للمدربين):
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_TRAINING_NEEDS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-right p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-medium shadow-xs'
                      : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {preset.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                  <p className="line-clamp-2 leading-relaxed text-slate-900">
                    {preset.data.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              عنوان البرنامج التدريبي أو فكرة الدورة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: إدارة وتصميم المشاريع التنموية وفق منهجية الإطار المنطقي"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sector & Audience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                القطاع التدريبي
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value as TrainingSector })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              >
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                المستوى السابق للمشاركين
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['مبتدئ', 'متوسط', 'متقدم', 'متنوع'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, audienceLevel: lvl })}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      formData.audienceLevel === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              الفئة المستهدفة بالتحديد ومجال عملهم
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="مثال: مديرو المشاريع الميدانية، منسقو البرامج في الجمعيات الأهلية، والباحثون التنمويون"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-slate-400"
            />
          </div>

          {/* Timing: Hours & Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                إجمالي الساعات التدريبية
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={formData.totalHours}
                  onChange={(e) => setFormData({ ...formData, totalHours: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                />
                <span className="text-xs text-slate-500">ساعة تدريبية فعلية</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                عدد أيام التدريب
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={formData.totalDays}
                  onChange={(e) => setFormData({ ...formData, totalDays: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                />
                <span className="text-xs text-slate-500">أيام تدريبية</span>
              </div>
            </div>
          </div>

          {/* Training Gap & Problem */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              الفجوة التدريبية أو المشكلة الواقعية المطلوب معالجتها <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.trainingGap}
              onChange={(e) => setFormData({ ...formData, trainingGap: e.target.value })}
              placeholder="مثال: صعوبة صياغة شجرة المشكلات وربط الأسباب الجذرية بالنتائج في مصفوفة الإطار المنطقي، ما يؤدي لرفض مقترحات المشاريع من الممولين."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-slate-400"
            />
          </div>

          {/* Expected Outcomes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              النواتج والكفايات المرجو خروج المتدرب بها
            </label>
            <textarea
              rows={2}
              value={formData.expectedOutcomes}
              onChange={(e) => setFormData({ ...formData, expectedOutcomes: e.target.value })}
              placeholder="مثال: قدرة المشارك على إعداد مصفوفة إطار منطقي واقعية، وتحديد مؤشرات قياس ذكية KPI، وتصميم خطة مخاطر ومتابعة وتقييم."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-slate-400"
            />
          </div>

          {/* Trainer or Center Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              اسم المدرب أو مركز التدريب (يظهر في غلاف الحقيبة وتصدير Word)
            </label>
            <input
              type="text"
              value={formData.trainerOrCenterName}
              onChange={(e) => setFormData({ ...formData, trainerOrCenterName: e.target.value })}
              placeholder="مثال: د. أحمد معوض / أكاديمية رواد التدريب العربي"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-slate-400"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <p className="leading-relaxed">
              <strong>معايير التصميم التعليمي:</strong> سيقوم المحرك بصياغة أهداف بلوم السلوكية، وتوزيع الجلسات زمنياً، وتوليد دليل المدرب، والأنشطة العملية، وروبريك التقييم الرباعي بصيغة منظمة قابلة للتحرير والتصدير الفوري لملف Word.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              id="submit-generate-package-btn"
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-900/10 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري بناء وتوليد الحقيبة التدريبية...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>توليد الحقيبة التدريبية الآن</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
