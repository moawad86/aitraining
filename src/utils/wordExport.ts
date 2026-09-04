import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip
} from 'docx';
import { TrainingPackage } from '../types';

export async function exportTrainingPackageToWord(pkg: TrainingPackage): Promise<void> {
  const doc = new Document({
    creator: 'منهج AI - المنصة الذكية لإعداد الحقائب التدريبية',
    title: pkg.metadata.title,
    description: `الحقيبة التدريبية: ${pkg.metadata.title}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8)
            }
          }
        },
        children: [
          // Cover Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'المملكة العربية السعودية / الوطن العربي - معايير الجودة والاعتماد',
                size: 20,
                color: '64748B',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 },
            children: [
              new TextRun({
                text: 'منهج AI | المنصة المتخصصة لتصميم الحقائب التدريبية وفق معايير التصميم التعليمي',
                size: 22,
                bold: true,
                color: '0F766E',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),

          // Main Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: 'الحقيبة التدريبية المتكاملة',
                size: 28,
                bold: true,
                color: '1E293B',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 600 },
            children: [
              new TextRun({
                text: pkg.metadata.title,
                size: 38,
                bold: true,
                color: '0F766E',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),

          // Metadata Info Box / Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('القطاع التدريبي:', true, 'F1F5F9', 30),
                  createTableCell(pkg.metadata.sector || 'عام', false, 'FFFFFF', 70)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('الفئة المستهدفة:', true, 'F1F5F9', 30),
                  createTableCell(pkg.metadata.targetAudience, false, 'FFFFFF', 70)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('زمن البرنامج:', true, 'F1F5F9', 30),
                  createTableCell(`${pkg.metadata.totalHours} ساعة تدريبية (${pkg.metadata.totalDays} أيام)`, false, 'FFFFFF', 70)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('المعد / الجهة المنفذة:', true, 'F1F5F9', 30),
                  createTableCell(pkg.metadata.trainerOrCenterName || 'المدرب المعتمد', false, 'FFFFFF', 70)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('تاريخ الإصدار والنسخة:', true, 'F1F5F9', 30),
                  createTableCell(`${pkg.metadata.createdAt} - الإصدار ${pkg.metadata.version}`, false, 'FFFFFF', 70)
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 400, after: 200 }, children: [] }),

          // Section 1: Needs Analysis & Gap
          createSectionHeading('أولاً: مبررات البرنامج والاحتياج التدريبي'),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'الفجوة التدريبية والمشكلة المعالجة: ',
                bold: true,
                font: 'Arial',
                rightToLeft: true
              }),
              new TextRun({
                text: pkg.metadata.trainingGap,
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),

          // Section 2: Objectives & Bloom
          createSectionHeading('ثانياً: الأهداف التدريبية ومستويات بلوم المعرفية والمهارية'),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'الهدف العام للحقيبة: ',
                bold: true,
                color: '0F766E',
                font: 'Arial',
                rightToLeft: true
              }),
              new TextRun({
                text: pkg.objectives.generalGoal,
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),

          // Objectives Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('#', true, 'E2E8F0', 10),
                  createTableCell('الهدف السلوكي التفصيلي', true, 'E2E8F0', 50),
                  createTableCell('مستوى بلوم / المجال', true, 'E2E8F0', 20),
                  createTableCell('مؤشر التحقق والإنجاز', true, 'E2E8F0', 20)
                ]
              }),
              ...pkg.objectives.specificObjectives.map((obj, idx) =>
                new TableRow({
                  children: [
                    createTableCell(String(idx + 1), false, 'FFFFFF', 10),
                    createTableCell(obj.text, false, 'FFFFFF', 50),
                    createTableCell(`${obj.bloomLevel} (${obj.domain})`, false, 'FFFFFF', 20),
                    createTableCell(obj.performanceIndicator, false, 'FFFFFF', 20)
                  ]
                })
              )
            ]
          }),

          new Paragraph({ spacing: { before: 300, after: 100 }, children: [] }),

          // Section 3: Curriculum & Modules
          createSectionHeading('ثالثاً: الخطة التدريبية وجدول توزيع الجلسات والموضوعات'),
          ...pkg.curriculum.flatMap((mod) => [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: `الوحدة التدريبية (${mod.moduleNumber}): ${mod.title} [${mod.durationMinutes} دقيقة]`,
                  bold: true,
                  size: 24,
                  color: '0F766E',
                  font: 'Arial',
                  rightToLeft: true
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 50, after: 150 },
              children: [
                new TextRun({
                  text: mod.summary,
                  color: '475569',
                  font: 'Arial',
                  rightToLeft: true
                })
              ]
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    createTableCell('الجلسة', true, 'E2E8F0', 15),
                    createTableCell('عنوان الجلسة والموضوعات', true, 'E2E8F0', 45),
                    createTableCell('أسلوب التدريب', true, 'E2E8F0', 20),
                    createTableCell('المعينات والوسائل', true, 'E2E8F0', 20)
                  ]
                }),
                ...mod.sessions.map((sess) =>
                  new TableRow({
                    children: [
                      createTableCell(`جلسة ${sess.sessionNumber}\n(${sess.durationMinutes} د)`, false, 'FFFFFF', 15),
                      createTableCell(`${sess.title}\n\nالمحاور:\n• ${sess.topics.join('\n• ')}`, false, 'FFFFFF', 45),
                      createTableCell(sess.deliveryMethod, false, 'FFFFFF', 20),
                      createTableCell(sess.learningAid, false, 'FFFFFF', 20)
                    ]
                  })
                )
              ]
            }),
            new Paragraph({ spacing: { before: 200 }, children: [] })
          ]),

          // Section 4: Trainer's Guide
          createSectionHeading('رابعاً: دليل إرشادات المدرب ومفاتيح التيسير'),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({
                text: '1. أنشطة كسر الجليد والتمهيد:',
                bold: true,
                color: '1E293B',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          ...pkg.trainerGuide.iceBreakers.map((item) =>
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: `• ${item}`, font: 'Arial', rightToLeft: true })
              ]
            })
          ),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 150, after: 50 },
            children: [
              new TextRun({
                text: '2. إرشادات إدارة القاعة والتيسير الفعال:',
                bold: true,
                color: '1E293B',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          ...pkg.trainerGuide.facilitationNotes.map((note) =>
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({ text: `◆ ${note.title}: `, bold: true, font: 'Arial', rightToLeft: true }),
                new TextRun({ text: note.content, font: 'Arial', rightToLeft: true })
              ]
            })
          ),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 150, after: 50 },
            children: [
              new TextRun({
                text: '3. أسئلة العصف الذهني والحوار الموجه:',
                bold: true,
                color: '1E293B',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          ...pkg.trainerGuide.discussionPrompts.map((q) =>
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: `؟ ${q}`, color: '0F766E', font: 'Arial', rightToLeft: true })
              ]
            })
          ),

          // Section 5: Activities
          createSectionHeading('خامساً: نماذج الأنشطة التدريبية وورش العمل التطبيقية'),
          ...pkg.activities.flatMap((act, idx) => [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: `نشاط تدريبي (${idx + 1}): ${act.title}`,
                  bold: true,
                  size: 24,
                  color: '0F766E',
                  font: 'Arial',
                  rightToLeft: true
                })
              ]
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    createTableCell('الوحدة المستهدفة:', true, 'F1F5F9', 25),
                    createTableCell(act.targetModule, false, 'FFFFFF', 25),
                    createTableCell('نوع النشاط والزمن:', true, 'F1F5F9', 25),
                    createTableCell(`${act.type} - (${act.durationMinutes} دقيقة)`, false, 'FFFFFF', 25)
                  ]
                }),
                new TableRow({
                  children: [
                    createTableCell('هدف النشاط:', true, 'F1F5F9', 25),
                    createTableCell(act.objective, false, 'FFFFFF', 75, 3)
                  ]
                }),
                new TableRow({
                  children: [
                    createTableCell('خطوات التنفيذ للمدرب والمتدربين:', true, 'F1F5F9', 25),
                    createTableCell(act.instructions.map((i, k) => `${k + 1}. ${i}`).join('\n'), false, 'FFFFFF', 75, 3)
                  ]
                }),
                new TableRow({
                  children: [
                    createTableCell('المخرج المتوقع:', true, 'F1F5F9', 25),
                    createTableCell(act.expectedOutput, false, 'FFFFFF', 75, 3)
                  ]
                }),
                new TableRow({
                  children: [
                    createTableCell('المعينات والمواد اللازمة:', true, 'F1F5F9', 25),
                    createTableCell(act.materialsNeeded, false, 'FFFFFF', 75, 3)
                  ]
                })
              ]
            }),
            new Paragraph({ spacing: { before: 150 }, children: [] })
          ]),

          // Section 6: Rubrics & Assessments
          createSectionHeading('سادساً: أدوات التقييم وروبريك قياس الأداء والاختبارات'),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: '1. مصفوفة روبريك تقييم الأداء والمشاريع (Rubric Matrix):',
                bold: true,
                size: 22,
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('المعيار والوزن', true, 'E2E8F0', 25),
                  createTableCell('متميز (4)', true, 'DCFCE7', 20),
                  createTableCell('كفء (3)', true, 'FEF3C7', 20),
                  createTableCell('يحتاج تطوير (2)', true, 'FFEDD5', 20),
                  createTableCell('غير مقبول (1)', true, 'FEE2E2', 15)
                ]
              }),
              ...pkg.assessments.rubrics.map((rub) =>
                new TableRow({
                  children: [
                    createTableCell(`${rub.criterion} (${rub.weight}%)`, true, 'FFFFFF', 25),
                    createTableCell(rub.levels.excellent, false, 'FFFFFF', 20),
                    createTableCell(rub.levels.proficient, false, 'FFFFFF', 20),
                    createTableCell(rub.levels.developing, false, 'FFFFFF', 20),
                    createTableCell(rub.levels.unsatisfactory, false, 'FFFFFF', 15)
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: '2. بنك أسئلة قياس الأثر (الاختبار القبلي والبعدي):',
                bold: true,
                size: 22,
                font: 'Arial',
                rightToLeft: true
              })
            ]
          }),
          ...pkg.assessments.questions.map((q, idx) =>
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({
                  text: `س ${idx + 1}: ${q.question} [مستوى بلوم: ${q.bloomLevel}]`,
                  bold: true,
                  color: '1E293B',
                  font: 'Arial',
                  rightToLeft: true
                }),
                new TextRun({
                  text: q.options ? `\nالخيارات: ${q.options.join(' | ')}` : '',
                  font: 'Arial',
                  rightToLeft: true
                }),
                new TextRun({
                  text: `\nالإجابة النموذجية ومؤشر التصحيح: ${q.correctAnswer}`,
                  color: '0F766E',
                  font: 'Arial',
                  rightToLeft: true
                })
              ]
            })
          ),

          // Footer info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({
                text: 'تم توليد وتنسيق هذه الحقيبة بواسطة «منهج AI» وفق معايير التصميم التعليمي العربي',
                size: 18,
                color: '94A3B8',
                font: 'Arial',
                rightToLeft: true
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedTitle = pkg.metadata.title.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 50);
  link.download = `حقيبة_${sanitizedTitle}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function createSectionHeading(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({
        text,
        size: 26,
        bold: true,
        color: '0F766E',
        font: 'Arial',
        rightToLeft: true
      })
    ]
  });
}

function createTableCell(
  text: string,
  isHeader = false,
  shadingColor = 'FFFFFF',
  widthPercent = 25,
  colSpan?: number
): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: shadingColor },
    columnSpan: colSpan,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
    },
    margins: {
      top: convertInchesToTwip(0.08),
      bottom: convertInchesToTwip(0.08),
      left: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.1)
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text,
            bold: isHeader,
            color: isHeader ? '0F172A' : '334155',
            size: 20,
            font: 'Arial',
            rightToLeft: true
          })
        ]
      })
    ]
  });
}
