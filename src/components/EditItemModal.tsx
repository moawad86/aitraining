import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { BloomLevel, LearningDomain } from '../types';

export type EditModalType = 
  | 'objective' 
  | 'session' 
  | 'activity' 
  | 'rubric' 
  | 'question'
  | 'metadata';

interface EditItemModalProps {
  isOpen: boolean;
  type: EditModalType;
  initialData: any;
  onClose: () => void;
  onSave: (updatedData: any) => void;
}

const BLOOM_LEVELS: BloomLevel[] = ['تذكر', 'فهم', 'تطبيق', 'تحليل', 'تقييم', 'ابتكار'];

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  type,
  initialData,
  onClose,
  onSave
}) => {
  const [data, setData] = useState<any>(initialData);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
            {type === 'objective' && 'تعديل الهدف التدريبي وتصنيف بلوم'}
            {type === 'session' && 'تعديل الجلسة التدريبية والمحاور'}
            {type === 'activity' && 'تعديل النشاط التدريبي وورشة العمل'}
            {type === 'rubric' && 'تعديل معيار مصفوفة الروبريك'}
            {type === 'question' && 'تعديل سؤال قياس الأثر'}
            {type === 'metadata' && 'تعديل بطاقة التوصيف والاحتياج'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Objective Form */}
          {type === 'objective' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نص الهدف السلوكي (صياغة أداء المتدرب)
                </label>
                <textarea
                  rows={2}
                  required
                  value={data.text || ''}
                  onChange={(e) => setData({ ...data, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مستوى بلوم المعرفي / المهاري
                  </label>
                  <select
                    value={data.bloomLevel}
                    onChange={(e) => setData({ ...data, bloomLevel: e.target.value as BloomLevel })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  >
                    {BLOOM_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المجال التدريبي
                  </label>
                  <select
                    value={data.domain}
                    onChange={(e) => setData({ ...data, domain: e.target.value as LearningDomain })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  >
                    <option value="معرفي">معرفي</option>
                    <option value="مهاري">مهاري</option>
                    <option value="وجداني">وجداني</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مؤشر التحقق والإنجاز (كيف نعرف أن المتدرب حقق الهدف؟)
                </label>
                <input
                  type="text"
                  value={data.performanceIndicator || ''}
                  onChange={(e) => setData({ ...data, performanceIndicator: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </>
          )}

          {/* Session Form */}
          {type === 'session' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الجلسة
                </label>
                <input
                  type="text"
                  required
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المدة بالدقائق
                  </label>
                  <input
                    type="number"
                    value={data.durationMinutes || 60}
                    onChange={(e) => setData({ ...data, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    أسلوب التدريب الموصى به
                  </label>
                  <input
                    type="text"
                    value={data.deliveryMethod || ''}
                    onChange={(e) => setData({ ...data, deliveryMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المحاور والموضوعات التفصيلية (سطر لكل محور)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(data.topics) ? data.topics.join('\n') : ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      topics: e.target.value.split('\n').filter((t) => t.trim())
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المعينات والوسائل التدريبية
                </label>
                <input
                  type="text"
                  value={data.learningAid || ''}
                  onChange={(e) => setData({ ...data, learningAid: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </>
          )}

          {/* Activity Form */}
          {type === 'activity' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان النشاط / ورشة العمل
                </label>
                <input
                  type="text"
                  required
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نوع النشاط
                  </label>
                  <select
                    value={data.type}
                    onChange={(e) => setData({ ...data, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  >
                    <option value="مجموعات عمل">مجموعات عمل</option>
                    <option value="ثنائي">ثنائي</option>
                    <option value="فردي">فردي</option>
                    <option value="لعب أدوار">لعب أدوار</option>
                    <option value="دراسة حالة">دراسة حالة</option>
                    <option value="محاكاة عملية">محاكاة عملية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المدة (دقيقة)
                  </label>
                  <input
                    type="number"
                    value={data.durationMinutes || 30}
                    onChange={(e) => setData({ ...data, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  هدف النشاط
                </label>
                <textarea
                  rows={2}
                  value={data.objective || ''}
                  onChange={(e) => setData({ ...data, objective: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  خطوات وتعليمات التنفيذ للمدرب والمتدربين (سطر لكل خطوة)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(data.instructions) ? data.instructions.join('\n') : ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      instructions: e.target.value.split('\n').filter((i) => i.trim())
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المخرج الملموس المتوقع من المتدربين
                </label>
                <input
                  type="text"
                  value={data.expectedOutput || ''}
                  onChange={(e) => setData({ ...data, expectedOutput: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المعينات والمواد المطلوبة
                </label>
                <input
                  type="text"
                  value={data.materialsNeeded || ''}
                  onChange={(e) => setData({ ...data, materialsNeeded: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </>
          )}

          {/* Rubric Form */}
          {type === 'rubric' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المعيار المقاس
                  </label>
                  <input
                    type="text"
                    required
                    value={data.criterion || ''}
                    onChange={(e) => setData({ ...data, criterion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الوزن النسبي (%)
                  </label>
                  <input
                    type="number"
                    value={data.weight || 25}
                    onChange={(e) => setData({ ...data, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    مستوى 4: متميز (Excellent)
                  </label>
                  <textarea
                    rows={2}
                    value={data.levels?.excellent || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        levels: { ...data.levels, excellent: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    مستوى 3: كفء (Proficient)
                  </label>
                  <textarea
                    rows={2}
                    value={data.levels?.proficient || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        levels: { ...data.levels, proficient: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200">
                  <label className="block text-xs font-bold text-orange-900 mb-1">
                    مستوى 2: يحتاج تطوير (Developing)
                  </label>
                  <textarea
                    rows={2}
                    value={data.levels?.developing || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        levels: { ...data.levels, developing: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-orange-300 bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200">
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    مستوى 1: غير مقبول (Unsatisfactory)
                  </label>
                  <textarea
                    rows={2}
                    value={data.levels?.unsatisfactory || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        levels: { ...data.levels, unsatisfactory: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </>
          )}

          {/* Question Form */}
          {type === 'question' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نص السؤال
                </label>
                <textarea
                  rows={2}
                  required
                  value={data.question || ''}
                  onChange={(e) => setData({ ...data, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نوع السؤال
                  </label>
                  <select
                    value={data.type}
                    onChange={(e) => setData({ ...data, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  >
                    <option value="اختيار من متعدد">اختيار من متعدد</option>
                    <option value="دراسة حالة مصغرة">دراسة حالة مصغرة</option>
                    <option value="سؤال تطبيقي">سؤال تطبيقي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مستوى بلوم المقاس
                  </label>
                  <select
                    value={data.bloomLevel}
                    onChange={(e) => setData({ ...data, bloomLevel: e.target.value as BloomLevel })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  >
                    {BLOOM_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {data.type === 'اختيار من متعدد' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الخيارات المتاحة (سطر لكل خيار)
                  </label>
                  <textarea
                    rows={4}
                    value={Array.isArray(data.options) ? data.options.join('\n') : ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        options: e.target.value.split('\n').filter((o) => o.trim())
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الإجابة النموذجية ومفتاح التصحيح
                </label>
                <textarea
                  rows={2}
                  value={data.correctAnswer || ''}
                  onChange={(e) => setData({ ...data, correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </>
          )}

          {/* Metadata Form */}
          {type === 'metadata' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الحقيبة التدريبية
                </label>
                <input
                  type="text"
                  required
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    القطاع التدريبي
                  </label>
                  <input
                    type="text"
                    value={data.sector || ''}
                    onChange={(e) => setData({ ...data, sector: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المدرب أو مركز التدريب
                  </label>
                  <input
                    type="text"
                    value={data.trainerOrCenterName || ''}
                    onChange={(e) => setData({ ...data, trainerOrCenterName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الفئة المستهدفة
                </label>
                <input
                  type="text"
                  value={data.targetAudience || ''}
                  onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الفجوة التدريبية والمشكلة المعالجة
                </label>
                <textarea
                  rows={2}
                  value={data.trainingGap || ''}
                  onChange={(e) => setData({ ...data, trainingGap: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </>
          )}

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
