import React from 'react';
import { Clock, Award, Target, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { TrainingPackage } from '../types';

interface InstructionalStatsProps {
  pkg: TrainingPackage;
}

export const InstructionalStats: React.FC<InstructionalStatsProps> = ({ pkg }) => {
  // Calculate total sessions
  const totalSessions = pkg.curriculum.reduce(
    (sum, mod) => sum + (mod.sessions?.length || 0),
    0
  );

  // Calculate Bloom levels distribution
  const highOrderBloomCount = pkg.objectives.specificObjectives.filter(
    (o) => o.bloomLevel === 'تطبيق' || o.bloomLevel === 'تحليل' || o.bloomLevel === 'تقييم' || o.bloomLevel === 'ابتكار'
  ).length;

  const totalObjectives = pkg.objectives.specificObjectives.length || 1;
  const highOrderPercentage = Math.round((highOrderBloomCount / totalObjectives) * 100);

  // Calculate activities duration vs total duration
  const activitiesTotalMinutes = pkg.activities.reduce(
    (acc, act) => acc + (act.durationMinutes || 0),
    0
  );
  const totalCourseMinutes = pkg.metadata.totalHours * 60 || 1;
  const practicalRatio = Math.min(100, Math.round((activitiesTotalMinutes / totalCourseMinutes) * 100));

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">
        {/* Metric 1: Hours */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100/60">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-tight font-['Cairo',sans-serif]">
              {pkg.metadata.totalHours} <span className="text-xs font-normal text-slate-500 font-sans">ساعة</span>
            </div>
            <div className="text-[11px] text-slate-500">{pkg.metadata.totalDays} أيام تدريبية</div>
          </div>
        </div>

        {/* Metric 2: Bloom Quality */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0 border border-violet-100/60">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-tight font-['Cairo',sans-serif]">
              {highOrderPercentage}% <span className="text-xs font-semibold text-indigo-600 font-sans">مهاري/تحليلي</span>
            </div>
            <div className="text-[11px] text-slate-500">مستويات بلوم العليا</div>
          </div>
        </div>

        {/* Metric 3: Modules & Sessions */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100/60">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-tight font-['Cairo',sans-serif]">
              {pkg.curriculum.length} <span className="text-xs font-normal text-slate-500 font-sans">وحدات</span>
            </div>
            <div className="text-[11px] text-slate-500">{totalSessions} جلسات مفصلة</div>
          </div>
        </div>

        {/* Metric 4: Activities */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/60">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-tight font-['Cairo',sans-serif]">
              {pkg.activities.length} <span className="text-xs font-normal text-slate-500 font-sans">ورش عمل</span>
            </div>
            <div className="text-[11px] text-slate-500">{activitiesTotalMinutes} دقيقة تطبيق</div>
          </div>
        </div>

        {/* Metric 5: Rubrics & Assessments */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100/60">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-tight font-['Cairo',sans-serif]">
              {pkg.assessments.rubrics.length} <span className="text-xs font-normal text-slate-500 font-sans">معايير</span>
            </div>
            <div className="text-[11px] text-slate-500">{pkg.assessments.questions.length} أسئلة قياس أثر</div>
          </div>
        </div>

        {/* Metric 6: Export Readiness */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight font-['Cairo',sans-serif]">
              Word .docx
            </div>
            <div className="text-[11px] font-medium text-indigo-600">جاهز للطباعة والتنفيذ</div>
          </div>
        </div>
      </div>
    </div>
  );
};
