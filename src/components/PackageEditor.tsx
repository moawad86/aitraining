import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  Calendar,
  Compass,
  Users,
  CheckSquare,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  FileDown,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  TrainingPackage,
  SpecificObjective,
  TrainingModule,
  TrainingSession,
  TrainingActivity,
  AssessmentCriterion,
  AssessmentQuestion,
  BloomLevel
} from '../types';
import { EditModalType } from './EditItemModal';

interface PackageEditorProps {
  pkg: TrainingPackage;
  onUpdatePackage: (updated: TrainingPackage) => void;
  onExportWord: () => void;
  onOpenEditModal: (type: EditModalType, data: any, callback: (newData: any) => void) => void;
  isExporting: boolean;
}

export const PackageEditor: React.FC<PackageEditorProps> = ({
  pkg,
  onUpdatePackage,
  onExportWord,
  onOpenEditModal,
  isExporting
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'objectives' | 'curriculum' | 'guide' | 'activities' | 'assessments'
  >('objectives');

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const toggleModule = (moduleNumber: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber]
    }));
  };

  // Helper to color Bloom badges
  const getBloomBadgeColor = (level: BloomLevel) => {
    switch (level) {
      case 'ابتكار':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'تقييم':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'تحليل':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'تطبيق':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'فهم':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'تذكر':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Handlers for deleting or adding items
  const handleDeleteObjective = (id: string) => {
    const updated = {
      ...pkg,
      objectives: {
        ...pkg.objectives,
        specificObjectives: pkg.objectives.specificObjectives.filter((o) => o.id !== id)
      }
    };
    onUpdatePackage(updated);
  };

  const handleAddObjective = () => {
    const newObj: SpecificObjective = {
      id: `obj-${Date.now()}`,
      text: 'أن يمارس المشارك المهارة المستهدفة وفق معايير الجودة المعتمدة.',
      bloomLevel: 'تطبيق',
      domain: 'مهاري',
      performanceIndicator: 'تنفيذ تمرين عملي بنجاح بنسبة 80% على الأقل.'
    };
    onOpenEditModal('objective', newObj, (saved) => {
      onUpdatePackage({
        ...pkg,
        objectives: {
          ...pkg.objectives,
          specificObjectives: [...pkg.objectives.specificObjectives, saved]
        }
      });
    });
  };

  const handleDeleteActivity = (id: string) => {
    const updated = {
      ...pkg,
      activities: pkg.activities.filter((a) => a.id !== id)
    };
    onUpdatePackage(updated);
  };

  const handleAddActivity = () => {
    const newAct: TrainingActivity = {
      id: `act-${Date.now()}`,
      title: 'ورشة عمل وتطبيق عملي جديد',
      targetModule: `الوحدة ${pkg.curriculum[0]?.moduleNumber || 1}`,
      type: 'مجموعات عمل',
      durationMinutes: 45,
      objective: 'تطبيق المهارات في سيناريو عملي واقعي.',
      instructions: [
        'يقسم المدرب المتدربين إلى مجموعات عمل متوازنة.',
        'توزع ورقة المهام ودراسة الحالة للتنفيذ.',
        'تقدم كل مجموعة مخرجاتها ويتم فتح النقاش الجماعي.'
      ],
      expectedOutput: 'نموذج عمل مكتمل ومطابق للمعايير.',
      materialsNeeded: 'أوراق عمل، شاشة عرض، بطاقات تفاعلية.'
    };
    onOpenEditModal('activity', newAct, (saved) => {
      onUpdatePackage({
        ...pkg,
        activities: [...pkg.activities, saved]
      });
    });
  };

  const handleAddRubric = () => {
    const newRub: AssessmentCriterion = {
      id: `rub-${Date.now()}`,
      criterion: 'معيار تقييم جديد',
      weight: 25,
      levels: {
        excellent: 'أداء متميز وتطبيق إبداعي شامل لكافة المعايير.',
        proficient: 'أداء جيد جداً يغطي معظم المتطلبات بصورة صحيحة.',
        developing: 'أداء مقبول يحتاج تدريباً إضافياً وتوجيهاً مباشراً.',
        unsatisfactory: 'أداء دون المستوى المطلوب ولم يحقق مؤشرات النجاح.'
      }
    };
    onOpenEditModal('rubric', newRub, (saved) => {
      onUpdatePackage({
        ...pkg,
        assessments: {
          ...pkg.assessments,
          rubrics: [...pkg.assessments.rubrics, saved]
        }
      });
    });
  };

  const handleAddQuestion = () => {
    const newQ: AssessmentQuestion = {
      id: `q-${Date.now()}`,
      question: 'سؤال قياس أثر جديد في الميدان التدريبي',
      type: 'اختيار من متعدد',
      options: ['خيار أول', 'خيار ثاني', 'خيار ثالث', 'خيار رابع'],
      correctAnswer: 'خيار أول',
      bloomLevel: 'تطبيق'
    };
    onOpenEditModal('question', newQ, (saved) => {
      onUpdatePackage({
        ...pkg,
        assessments: {
          ...pkg.assessments,
          questions: [...pkg.assessments.questions, saved]
        }
      });
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden mb-12">
      {/* Top Title & Toolbar */}
      <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              {pkg.metadata.sector || 'قطاع تدريبي'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {pkg.metadata.totalHours} ساعة تدريبية
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              المستوى: {pkg.metadata.audienceLevel || 'متوسط'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Cairo',sans-serif]">
            {pkg.metadata.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            إعداد: <strong className="text-slate-800">{pkg.metadata.trainerOrCenterName || 'المدرب المعتمد'}</strong> — الفئة المستهدفة: {pkg.metadata.targetAudience}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={() =>
              onOpenEditModal('metadata', pkg.metadata, (saved) => {
                onUpdatePackage({ ...pkg, metadata: saved });
              })
            }
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل التوصيف</span>
          </button>

          <button
            onClick={onExportWord}
            disabled={isExporting}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-60 border border-slate-800"
          >
            <FileDown className="w-4 h-4 text-indigo-400" />
            <span>{isExporting ? 'جاري التصدير...' : 'تصدير Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 border-b border-slate-200 overflow-x-auto bg-slate-50/40">
        {[
          { id: 'objectives', label: 'الأهداف وهرم بلوم', icon: Target, count: pkg.objectives.specificObjectives.length },
          { id: 'curriculum', label: 'خطة الوحدات والجلسات', icon: Calendar, count: pkg.curriculum.length },
          { id: 'guide', label: 'دليل المدرب والتيسير', icon: Compass },
          { id: 'activities', label: 'الأنشطة وورش العمل', icon: Users, count: pkg.activities.length },
          { id: 'assessments', label: 'الروبريك والاختبارات', icon: CheckSquare, count: pkg.assessments.rubrics.length },
          { id: 'overview', label: 'بطاقة الاحتياج والتوصيف', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Objectives & Bloom */}
        {activeTab === 'objectives' && (
          <div className="space-y-6">
            {/* General Goal Box */}
            <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  الهدف العام الشامل للبرنامج التدريبي (Course Purpose)
                </span>
                <button
                  onClick={() => {
                    const newGoal = prompt('عدل الهدف العام للبرنامج:', pkg.objectives.generalGoal);
                    if (newGoal && newGoal.trim()) {
                      onUpdatePackage({
                        ...pkg,
                        objectives: { ...pkg.objectives, generalGoal: newGoal.trim() }
                      });
                    }
                  }}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {pkg.objectives.generalGoal}
              </p>
            </div>

            {/* Specific Objectives Header */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                  الأهداف السلوكية التفصيلية ومستويات تصنيف بلوم (Bloom's Taxonomy)
                </h3>
                <p className="text-xs text-slate-500">
                  مصاغة بصياغة إجرائية محددة تقيس الأداء ومؤشر التحقق الواقعي
                </p>
              </div>
              <button
                onClick={handleAddObjective}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة هدف</span>
              </button>
            </div>

            {/* Specific Objectives List */}
            <div className="space-y-3">
              {pkg.objectives.specificObjectives.map((obj, idx) => (
                <div
                  key={obj.id || idx}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBloomBadgeColor(
                          obj.bloomLevel
                        )}`}
                      >
                        بلوم: {obj.bloomLevel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        المجال: {obj.domain}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {obj.text}
                    </p>

                    <div className="text-xs text-slate-500 flex items-start gap-1.5 pt-1">
                      <span className="font-bold text-slate-700 shrink-0">مؤشر الإنجاز:</span>
                      <span className="text-slate-600">{obj.performanceIndicator}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <button
                      onClick={() =>
                        onOpenEditModal('objective', obj, (saved) => {
                          const updated = pkg.objectives.specificObjectives.map((o) =>
                            o.id === obj.id ? saved : o
                          );
                          onUpdatePackage({
                            ...pkg,
                            objectives: { ...pkg.objectives, specificObjectives: updated }
                          });
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      title="تعديل الهدف"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteObjective(obj.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      title="حذف الهدف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum & Sessions */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                  خطة الوحدات والجلسات التدريبية وجدول التوقيتات
                </h3>
                <p className="text-xs text-slate-500">
                  توزيع زمني واقعي يربط الموضوعات بأساليب التدريب والمعينات
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pkg.curriculum.map((module) => {
                const isExpanded = expandedModules[module.moduleNumber] !== false;
                return (
                  <div
                    key={module.moduleNumber}
                    className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs"
                  >
                    {/* Module Header */}
                    <div
                      onClick={() => toggleModule(module.moduleNumber)}
                      className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                          {module.moduleNumber}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                            {module.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{module.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-800">
                          {module.durationMinutes} دقيقة
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Sessions Table */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                                <th className="py-2.5 px-3">الجلسة والزمن</th>
                                <th className="py-2.5 px-3">عنوان الجلسة والمحاور</th>
                                <th className="py-2.5 px-3">أسلوب التدريب</th>
                                <th className="py-2.5 px-3">المعينات والوسائل</th>
                                <th className="py-2.5 px-3 text-center">إجراءات</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {module.sessions.map((sess) => (
                                <tr key={sess.sessionNumber} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-3 px-3 align-top font-bold text-slate-900 whitespace-nowrap">
                                    جلسة {sess.sessionNumber}
                                    <div className="text-[11px] font-normal text-slate-500">
                                      {sess.durationMinutes} دقيقة
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 align-top max-w-sm">
                                    <div className="font-bold text-slate-900 mb-1">{sess.title}</div>
                                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                                      {sess.topics.map((t, tidx) => (
                                        <li key={tidx}>{t}</li>
                                      ))}
                                    </ul>
                                  </td>
                                  <td className="py-3 px-3 align-top text-slate-700">
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">
                                      {sess.deliveryMethod}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 align-top text-slate-600">
                                    {sess.learningAid}
                                  </td>
                                  <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                                    <button
                                      onClick={() =>
                                        onOpenEditModal('session', sess, (saved) => {
                                          const updatedCurriculum = pkg.curriculum.map((m) => {
                                            if (m.moduleNumber === module.moduleNumber) {
                                              return {
                                                ...m,
                                                sessions: m.sessions.map((s) =>
                                                  s.sessionNumber === sess.sessionNumber ? saved : s
                                                )
                                              };
                                            }
                                            return m;
                                          });
                                          onUpdatePackage({ ...pkg, curriculum: updatedCurriculum });
                                        })
                                      }
                                      className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                      title="تعديل الجلسة"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Trainer Guide & Facilitation */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                دليل إرشادات المدرب وتقنيات التيسير الاحترافي
              </h3>
              <p className="text-xs text-slate-500">
                مفاتيح إدارة الوقت، التعامل مع اعتراضات المتدربين، وأسئلة إثارة التفكير
              </p>
            </div>

            {/* Ice Breakers */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>أنشطة كسر الجليد والتمهيد الذهني الموصى بها</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                {pkg.trainerGuide.iceBreakers.map((ib, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
                    <span className="font-bold text-amber-800">({idx + 1})</span>
                    <span className="leading-relaxed">{ib}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilitation Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pkg.trainerGuide.facilitationNotes.map((fn, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 shadow-2xs">
                  <h5 className="text-xs font-bold text-indigo-900 font-['Cairo',sans-serif]">
                    ◆ {fn.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{fn.content}</p>
                </div>
              ))}
            </div>

            {/* Discussion Prompts */}
            <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>أسئلة الحوار المفتوح والعصف الذهني لإثارة التفكير</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.trainerGuide.discussionPrompts.map((dp, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-indigo-100/80 text-xs text-slate-800 leading-relaxed flex items-start gap-2 shadow-2xs">
                    <span className="font-extrabold text-indigo-600">؟</span>
                    <span>{dp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequent Pitfalls */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide mb-2">
                أخطاء وتحديات شائعة أثناء تنفيذ الحقيبة وكيفية تلافيها
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                {pkg.trainerGuide.frequentPitfalls.map((fp, idx) => (
                  <li key={idx} className="leading-relaxed">{fp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Activities & Workshops */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                  الأنشطة التدريبية وورش العمل التطبيقية
                </h3>
                <p className="text-xs text-slate-500">
                  نماذج تطبيقية تفاعلية جاهزة للطباعة والتوزيع على المتدربين
                </p>
              </div>
              <button
                onClick={handleAddActivity}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة نشاط</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pkg.activities.map((act, idx) => (
                <div
                  key={act.id || idx}
                  className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {act.targetModule}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.durationMinutes} دقيقة</span>
                        <span>•</span>
                        <span>{act.type}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 font-['Cairo',sans-serif]">
                      {act.title}
                    </h4>

                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">هدف النشاط:</strong>
                      {act.objective}
                    </div>

                    <div className="space-y-1 text-xs">
                      <strong className="text-slate-900 block">خطوات التنفيذ:</strong>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-1">
                        {act.instructions.map((step, sidx) => (
                          <li key={sidx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-slate-800 shrink-0">المخرج المتوقع:</span>
                        <span className="text-slate-600">{act.expectedOutput}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-slate-800 shrink-0">المعينات المطلوبة:</span>
                        <span className="text-slate-500">{act.materialsNeeded}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                    <button
                      onClick={() =>
                        onOpenEditModal('activity', act, (saved) => {
                          const updated = pkg.activities.map((a) => (a.id === act.id ? saved : a));
                          onUpdatePackage({ ...pkg, activities: updated });
                        })
                      }
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Rubrics & Assessments */}
        {activeTab === 'assessments' && (
          <div className="space-y-8">
            {/* Section 1: Rubrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                    مصفوفة روبريك تقييم الأداء والمشاريع (Rubric Matrix)
                  </h3>
                  <p className="text-xs text-slate-500">
                    معايير تصحيح موضوعية رباعية المستويات لتقييم أداء وتطبيقات المتدربين
                  </p>
                </div>
                <button
                  onClick={handleAddRubric}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة معيار</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs border border-slate-200 rounded-2xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold">
                      <th className="py-3 px-3 w-1/4">المعيار والوزن</th>
                      <th className="py-3 px-3 w-1/5 bg-emerald-50/80 text-emerald-950">متميز (4)</th>
                      <th className="py-3 px-3 w-1/5 bg-amber-50/80 text-amber-950">كفء (3)</th>
                      <th className="py-3 px-3 w-1/5 bg-orange-50/80 text-orange-950">يحتاج تطوير (2)</th>
                      <th className="py-3 px-3 w-1/6 bg-rose-50/80 text-rose-950">غير مقبول (1)</th>
                      <th className="py-3 px-2 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {pkg.assessments.rubrics.map((rub) => (
                      <tr key={rub.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-bold text-slate-900 align-top">
                          {rub.criterion}
                          <div className="text-[11px] font-semibold text-indigo-600 mt-1">
                            الوزن: {rub.weight}%
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700 leading-relaxed bg-emerald-50/20">
                          {rub.levels.excellent}
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700 leading-relaxed bg-amber-50/20">
                          {rub.levels.proficient}
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700 leading-relaxed bg-orange-50/20">
                          {rub.levels.developing}
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700 leading-relaxed bg-rose-50/20">
                          {rub.levels.unsatisfactory}
                        </td>
                        <td className="py-3 px-2 align-top text-center whitespace-nowrap">
                          <button
                            onClick={() =>
                              onOpenEditModal('rubric', rub, (saved) => {
                                const updated = pkg.assessments.rubrics.map((r) =>
                                   r.id === rub.id ? saved : r
                                );
                                onUpdatePackage({
                                  ...pkg,
                                  assessments: { ...pkg.assessments, rubrics: updated }
                                });
                              })
                            }
                            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Pre & Post Test Bank */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                    بنك أسئلة قياس الأثر (الاختبار القبلي والبعدي)
                  </h3>
                  <p className="text-xs text-slate-500">
                    أسئلة معرفية وتطبيقية مع الإجابة النموذجية ومستوى بلوم المقاس
                  </p>
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة سؤال</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.assessments.questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-2xl border border-slate-200/90 bg-white space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        مستوى: {q.bloomLevel}
                      </span>
                      <span className="text-xs text-slate-500">{q.type}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      س {idx + 1}: {q.question}
                    </p>

                    {q.options && (
                      <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {q.options.map((opt, oidx) => (
                          <div key={oidx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-indigo-900 font-medium bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                      <strong className="text-indigo-950">الإجابة النموذجية: </strong>
                      {q.correctAnswer}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() =>
                          onOpenEditModal('question', q, (saved) => {
                            const updated = pkg.assessments.questions.map((item) =>
                              item.id === q.id ? saved : item
                            );
                            onUpdatePackage({
                              ...pkg,
                              assessments: { ...pkg.assessments, questions: updated }
                            });
                          })
                        }
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Needs Overview Card */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Cairo',sans-serif]">
                بطاقة توصيف البرنامج والاحتياج التدريبي
              </h3>
              <p className="text-xs text-slate-500">
                البيانات الأساسية للحقيبة كما تظهر في ملف Word المعتمد
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-200 text-xs sm:text-sm">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-600">عنوان الحقيبة:</span>
                <span className="font-bold text-slate-900">{pkg.metadata.title}</span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-600">القطاع التدريبي:</span>
                <span className="text-slate-900">{pkg.metadata.sector}</span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-600">الفئة المستهدفة:</span>
                <span className="text-slate-900">{pkg.metadata.targetAudience}</span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-600">الساعات والأيام:</span>
                <span className="text-slate-900">
                  {pkg.metadata.totalHours} ساعة تدريبية ({pkg.metadata.totalDays} أيام)
                </span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-between gap-2">
                <span className="font-bold text-slate-600 shrink-0">الفجوة التدريبية المعالجة:</span>
                <span className="text-slate-900 leading-relaxed text-left sm:text-right">
                  {pkg.metadata.trainingGap}
                </span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-600">الجهة المنفذة / المدرب:</span>
                <span className="text-slate-900">{pkg.metadata.trainerOrCenterName}</span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-600">تاريخ الإصدار والنسخة:</span>
                <span className="text-slate-700 font-mono">
                  {pkg.metadata.createdAt} - الإصدار {pkg.metadata.version}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
