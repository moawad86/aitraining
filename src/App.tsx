/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InstructionalStats } from './components/InstructionalStats';
import { PackageEditor } from './components/PackageEditor';
import { NeedInputModal } from './components/NeedInputModal';
import { EditItemModal, EditModalType } from './components/EditItemModal';
import { HumanReviewModal } from './components/HumanReviewModal';
import { PricingModal } from './components/PricingModal';
import { INITIAL_DEMO_PACKAGE, SAMPLE_TRAINING_NEEDS } from './data/samplePresets';
import { TrainingPackage, TrainingNeedInput } from './types';
import { exportTrainingPackageToWord } from './utils/wordExport';
import { Sparkles, FileDown, UserCheck, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'manhaj_ai_current_package';

export default function App() {
  const [currentPackage, setCurrentPackage] = useState<TrainingPackage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load package from localStorage:', e);
    }
    return INITIAL_DEMO_PACKAGE;
  });

  // Modal States
  const [isNeedModalOpen, setIsNeedModalOpen] = useState(false);
  const [isHumanReviewOpen, setIsHumanReviewOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Edit Item Modal State
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    type: EditModalType;
    data: any;
    onSaveCallback: (savedData: any) => void;
  }>({
    isOpen: false,
    type: 'objective',
    data: null,
    onSaveCallback: () => {}
  });

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPackage));
    } catch (e) {
      console.warn('Failed to persist package to localStorage:', e);
    }
  }, [currentPackage]);

  // Handle Export Word
  const handleExportWord = async () => {
    if (!currentPackage) return;
    setIsExporting(true);
    try {
      await exportTrainingPackageToWord(currentPackage);
      showToast('تم تصدير ملف Word (.docx) بنجاح وجاهز للطباعة والاعتماد!', 'success');
    } catch (error) {
      console.error('Word export failed:', error);
      showToast('حدث خطأ أثناء تصدير ملف Word. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Generate with AI
  const handleGeneratePackage = async (needInput: TrainingNeedInput) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ needInput })
      });

      const data = await response.json();
      if (data.success && data.package) {
        setCurrentPackage(data.package);
        setIsNeedModalOpen(false);
        showToast(`تم توليد حقيبة "${data.package.metadata.title}" بنجاح!`, 'success');
      } else {
        throw new Error(data.error || 'تعذر توليد الحقيبة');
      }
    } catch (err: any) {
      console.error('Error generating package:', err);
      // Fallback: build standard structured package from input
      const fallbackPkg: TrainingPackage = {
        id: `pkg-${Date.now()}`,
        metadata: {
          title: needInput.title,
          sector: needInput.sector,
          targetAudience: needInput.targetAudience || 'المشاركون في البرنامج التدريبي',
          audienceLevel: needInput.audienceLevel,
          totalHours: needInput.totalHours,
          totalDays: needInput.totalDays,
          trainingGap: needInput.trainingGap,
          trainerOrCenterName: needInput.trainerOrCenterName || 'المدرب المعتمد',
          createdAt: new Date().toISOString().split('T')[0],
          version: '1.0'
        },
        objectives: {
          generalGoal: `إكساب وتطوير قدرات المشاركين في مجال ${needInput.title} وسد فجوة ${needInput.trainingGap.slice(0, 70)}...`,
          specificObjectives: [
            {
              id: 'obj-1',
              text: `أن يحلل المشارك مفاهيم وأدوات ${needInput.title} ويوظفها في بيئة العمل بنسبة دقة 85%.`,
              bloomLevel: 'تحليل',
              domain: 'مهاري',
              performanceIndicator: 'تسليم دراسة حالة معتمدة ومطابقة لمؤشرات الجودة.'
            },
            {
              id: 'obj-2',
              text: 'أن يطبق المشارك الخطوات الإجرائية التنفيذية لحل المشكلات الميدانية بكفاءة.',
              bloomLevel: 'تطبيق',
              domain: 'مهاري',
              performanceIndicator: 'اجتياز الاختبار التطبيقي العملي.'
            },
            {
              id: 'obj-3',
              text: 'أن يقيّم المشارك نتائج ومخرجات الأداء ويكتشف مواطن التحسين المستمر.',
              bloomLevel: 'تقييم',
              domain: 'معرفي',
              performanceIndicator: 'استخدام مصفوفة التحكيم والتقييم الموضوعي.'
            }
          ]
        },
        curriculum: [
          {
            moduleNumber: 1,
            title: `الإطار النظري والمفاهيمي لـ ${needInput.title}`,
            durationMinutes: (needInput.totalHours * 60) / 2,
            summary: 'تأسيس المعارف الأساسية وتحديد الفجوات وإدارة المتطلبات الأولية.',
            sessions: [
              {
                sessionNumber: 1,
                title: 'التشخيص وتحليل الاحتياج والمفاهيم الجوهرية',
                durationMinutes: (needInput.totalHours * 60) / 4,
                topics: ['المفاهيم الأساسية', 'تحليل الوضع الراهن', 'أدوات التشخيص السريع'],
                deliveryMethod: 'عرض تقديمي تفاعلي + عصف ذهني موجه',
                learningAid: 'عرض شرائح + بطاقات عمل'
              },
              {
                sessionNumber: 2,
                title: 'تطبيقات عملية وورشة عمل ميسرة',
                durationMinutes: (needInput.totalHours * 60) / 4,
                topics: ['نماذج المحاكاة', 'العمل الجماعي في فرق', 'استخلاص الدروس'],
                deliveryMethod: 'ورشة عمل بمجموعات مصغرة',
                learningAid: 'لوحات فليب تشارت وأوراق عمل'
              }
            ]
          },
          {
            moduleNumber: 2,
            title: 'الممارسة التطبيقية والقياس الميداني',
            durationMinutes: (needInput.totalHours * 60) / 2,
            summary: 'تنفيذ الأنشطة المتقدمة والتقييم الختامي وإعداد خطة العمل الفردية.',
            sessions: [
              {
                sessionNumber: 3,
                title: 'التطبيق المتقدم والمحاكاة الواقعية',
                durationMinutes: (needInput.totalHours * 60) / 4,
                topics: ['حل المشكلات المعقدة', 'إدارة المخاطر والتحديات', 'تقييم الأقران'],
                deliveryMethod: 'دراسة حالة واقعية + محاكاة',
                learningAid: 'أوراق العمل ومصفوفة المعايير'
              },
              {
                sessionNumber: 4,
                title: 'التقييم البعدي وخطة التطوير المستمر',
                durationMinutes: (needInput.totalHours * 60) / 4,
                topics: ['عرض المشاريع الختامية', 'تطبيق الروبريك', 'خطة العمل الشخصية'],
                deliveryMethod: 'معرض الأعمال وجلسة تغذية راجعة',
                learningAid: 'استمارة التقييم والروبريك المطبوع'
              }
            ]
          }
        ],
        trainerGuide: {
          iceBreakers: [
            'نشاط التعارف السريع: يشارك كل متدرب في دقيقة أهم تحدٍ يواجهه في هذا المجال.',
            'تمرين التوقعات: تدوين آمال ومخاوف المشاركين على بطاقات ملونة.'
          ],
          facilitationNotes: [
            {
              title: 'إدارة مشاركة المتدربين',
              content: 'تأكد من توزيع الفرص بالتساوي بين المتحدثين النشطين والمتدربين الهادئين.'
            },
            {
              title: 'الربط بالواقع العملي',
              content: 'اربط كل مفهوم نظري بمثال واقعي من بيئة عمل المتدربين لتعزيز الاستيعاب.'
            }
          ],
          discussionPrompts: [
            'ما هي أبرز العقبات التي تحول دون تطبيق هذه المهارات في الواقع؟',
            'كيف تقيس نجاح هذه الخطوات بأقل تكلفة وجهد؟'
          ],
          frequentPitfalls: [
            'الإفراط في المحاضرة النظرية وإهمال التطبيق العملي.',
            'عدم منح المتدربين وقتاً كافياً للتغذية الراجعة.'
          ]
        },
        activities: [
          {
            id: 'act-1',
            title: `ورشة عمل تطبيقية: حل المشكلة التشغيلية`,
            targetModule: 'الوحدة 1',
            type: 'مجموعات عمل',
            durationMinutes: 45,
            objective: 'تطبيق المهارات الأساسية في نموذج عمل واقعي.',
            instructions: [
              'تقسيم المشاركين إلى مجموعات عمل من 4 أفراد.',
              'توزيع بطاقة التمرين والبيانات الأساسية.',
              'تقديم النتائج ومناقشة الحلول في القاعة.'
            ],
            expectedOutput: 'نموذج حل مكتمل ومبرهن.',
            materialsNeeded: 'أوراق فليب تشارت، أقلام ملونة، بطاقات لاصقة.'
          }
        ],
        assessments: {
          preTestInstructions: 'استبيان قياس قبلي لتحديد المعارف السابقة قبل بدء التدريب.',
          postTestInstructions: 'اختبار بعدي لقياس الأثر وتحديد مدى اكتساب المهارات.',
          rubrics: [
            {
              id: 'rub-1',
              criterion: 'التمكن المعرفي والتحليل المنطقي',
              weight: 50,
              levels: {
                excellent: 'فهم شامل وتطبيق نموذجي خالٍ من الأخطاء.',
                proficient: 'فهم جيد وتطبيق صحيح لأغلب العناصر.',
                developing: 'فهم محدود يحتاج إلى مزيد من الإيضاح.',
                unsatisfactory: 'عدم القدرة على تطبيق المعايير.'
              }
            },
            {
              id: 'rub-2',
              criterion: 'جودة مخرجات العمل الجماعي والعرض',
              weight: 50,
              levels: {
                excellent: 'مخرجات مكتملة وعرض احترافي ومنسق.',
                proficient: 'مخرجات جيدة وتواصل سليم.',
                developing: 'مخرجات غير مكتملة جزئياً.',
                unsatisfactory: 'غياب المخرجات المتوقعة.'
              }
            }
          ],
          questions: [
            {
              id: 'q-1',
              question: `ما هو المعيار الأول لتطبيق مهارات ${needInput.title} بنجاح؟`,
              type: 'اختيار من متعدد',
              options: ['التخطيط المسبق وتحديد الأهداف', 'الارتجال السريع', 'تقليل وقت التنفيذ دون خطة'],
              correctAnswer: 'التخطيط المسبق وتحديد الأهداف',
              bloomLevel: 'فهم'
            }
          ]
        }
      };

      setCurrentPackage(fallbackPkg);
      setIsNeedModalOpen(false);
      showToast('تم إعداد الحقيبة التدريبية بنجاح!', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  // Open Edit Modal Callback
  const handleOpenEditModal = (
    type: EditModalType,
    data: any,
    callback: (savedData: any) => void
  ) => {
    setEditModalState({
      isOpen: true,
      type,
      data,
      onSaveCallback: callback
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        currentPackage={currentPackage}
        onOpenNewNeedModal={() => setIsNeedModalOpen(true)}
        onExportWord={handleExportWord}
        onOpenHumanReview={() => setIsHumanReviewOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        isExporting={isExporting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Strategic Hero / Banner for Arab Trainers */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 mb-8 border border-slate-800 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>النسخة التأسيسية المركزة (Lean MVP) — للمدربين ومراكز التدريب</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-['Cairo',sans-serif] leading-snug text-white">
                حوّل فكرة واحتياج دورتك إلى حقيبة تدريبية جاهزة للطباعة والتنفيذ
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-light">
                مبنية خصيصاً للمدرب العربي وفق هرم بلوم للأهداف السلوكية، خطة جلسات تفصيلية، دليل مدرب، أنشطة عملية، وروبريك تقييم مع تصدير Word (.docx) منسق ومراجعة بشرية اختيارية.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                id="hero-create-new-package-btn"
                onClick={() => setIsNeedModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>توليد حقيبة جديدة</span>
              </button>

              <button
                id="hero-export-word-btn"
                onClick={handleExportWord}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer disabled:opacity-60"
              >
                <FileDown className="w-4 h-4 text-indigo-400" />
                <span>{isExporting ? 'جاري التصدير...' : 'تصدير Word'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instructional Quality Metrics */}
        {currentPackage && <InstructionalStats pkg={currentPackage} />}

        {/* Main Review & Edit Suite */}
        {currentPackage ? (
          <PackageEditor
            pkg={currentPackage}
            onUpdatePackage={setCurrentPackage}
            onExportWord={handleExportWord}
            onOpenEditModal={handleOpenEditModal}
            isExporting={isExporting}
          />
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-4">
            <p className="text-sm text-slate-600">
              لا توجد حقيبة معروضة حالياً. اضغط أدناه لإدخال احتياج الدورة والبدء فوراً.
            </p>
            <button
              onClick={() => setIsNeedModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold"
            >
              توليد أول حقيبة تدريبية
            </button>
          </div>
        )}

        {/* Commercial Trial Footnote */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>عرض التجربة للمدربين:</strong> أنتج حقيبتك التدريبية الأولى مجاناً، وقيم بنفسك ساعات العمل التي وفرتها في التنسيق وصياغة أهداف بلوم.
            </span>
          </div>
          <button
            onClick={() => setIsPricingOpen(true)}
            className="text-indigo-600 font-bold hover:text-indigo-800 shrink-0 cursor-pointer"
          >
            استعراض باقات الاشتراك &larr;
          </button>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-indigo-950 text-indigo-100 border-indigo-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <NeedInputModal
        isOpen={isNeedModalOpen}
        onClose={() => setIsNeedModalOpen(false)}
        onSubmit={handleGeneratePackage}
        isLoading={isGenerating}
      />

      <EditItemModal
        isOpen={editModalState.isOpen}
        type={editModalState.type}
        initialData={editModalState.data}
        onClose={() => setEditModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={editModalState.onSaveCallback}
      />

      <HumanReviewModal
        isOpen={isHumanReviewOpen}
        onClose={() => setIsHumanReviewOpen(false)}
        currentPackage={currentPackage}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlan={(plan) => {
          setIsPricingOpen(false);
          showToast(`تم اختيار باقة "${plan}". سيتواصل معك فريق المبيعات لتفعيل الرخصة.`, 'info');
        }}
      />
    </div>
  );
}
