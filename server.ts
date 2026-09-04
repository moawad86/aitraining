import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in server environment');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'منهج AI - محرك إعداد الحقائب التدريبية',
    timestamp: new Date().toISOString()
  });
});

// API: Generate complete instructional package
app.post('/api/generate-package', async (req: Request, res: Response) => {
  try {
    const { needInput } = req.body;
    if (!needInput || !needInput.title) {
      return res.status(400).json({ error: 'بيانات احتياج الدورة غير مكتملة' });
    }

    const prompt = `
أنت خبير واستشاري تصميم تعليمي أول (Senior Instructional Designer) معتمد، متخصص في إعداد الحقائب التدريبية الاحترافية للشركات، المنظمات التنموية، ومراكز التدريب العربية.

المطلوب: تحويل احتياج الدورة التالي إلى حقيبة تدريبية عربية متكاملة رفيعة المستوى، مبنية وفق أحدث معايير التصميم التعليمي وتصنيف بلوم للأهداف السلوكية (Bloom's Taxonomy).

بيانات الاحتياج التدريبي:
- عنوان البرنامج: "${needInput.title}"
- القطاع التدريبي: "${needInput.sector || 'إداري ومهني'}"
- الفئة المستهدفة: "${needInput.targetAudience || 'المتدربون في المجال'}"
- المستوى السابق للفئة: "${needInput.audienceLevel || 'متوسط'}"
- المدة المقترحة: ${needInput.totalHours || 12} ساعة تدريبية موزعة على ${needInput.totalDays || 2} أيام
- الفجوة التدريبية والمشكلة المعالجة: "${needInput.trainingGap || 'تطوير المهارات التخصصية'}"
- النواتج المتوقعة: "${needInput.expectedOutcomes || 'اكتساب الكفايات وتطبيقها ميدانياً'}"
- اسم المدرب / الجهة المنفذة: "${needInput.trainerOrCenterName || 'المدرب المعتمد'}"

يجب الالتزام التام بالمعايير التالية:
1. صياغة أهداف تدريبية دقيقة وفق هرم بلوم بصيغة سلوكية محددة ("أن يكون المتدرب قادراً على...") مع تحديد مستوى بلوم (تذكر، فهم، تطبيق، تحليل، تقييم، ابتكار) والمجال (معرفي، مهاري، وجداني) ومؤشر التحقق.
2. بناء وحدات وجلسات تدريبية واقعية زمنياً، بحيث تتضمن كل جلسة: موضوعات تفصيلية، أسلوب التدريب الموصى به، والوسائل والمعينات.
3. دليل مدرب متقدم يحتوي على: أنشطة كسر الجليد، إرشادات إدارة الوقت والفروق الفردية، أسئلة حوارية مثيرة للتفكير، وأخطاء شائعة يجب تجنبها.
4. أنشطة تدريبية وورش عمل عملية قابلة للتنفيذ المباشر (تعليمات للمدرب، دور المتدربين، المخرج الملموس، والزمن بالدقائق).
5. مصفوفة روبريك تقييم موضوعية (Rubric) تتضمن 3 معايير على الأقل مع وصف رباعي المستويات (متميز، كفء، يحتاج تطوير، غير مقبول).
6. بنك أسئلة لقياس الأثر (اختبار قبلي وبعدي) متضمناً أسئلة اختيارية وتطبيقية مع الإجابة النموذجية.

يجب إرجاع النتيجة بصيغة JSON حصراً مطابقة تماماً للمخطط التالي:
{
  "id": "generated-${Date.now()}",
  "metadata": {
    "title": "${needInput.title}",
    "sector": "${needInput.sector}",
    "targetAudience": "${needInput.targetAudience}",
    "audienceLevel": "${needInput.audienceLevel}",
    "totalHours": ${needInput.totalHours || 12},
    "totalDays": ${needInput.totalDays || 2},
    "trainingGap": "${needInput.trainingGap}",
    "trainerOrCenterName": "${needInput.trainerOrCenterName}",
    "createdAt": "${new Date().toISOString().split('T')[0]}",
    "version": "1.0"
  },
  "objectives": {
    "generalGoal": "الهدف العام الشامل للبرنامج",
    "specificObjectives": [
      {
        "id": "obj-1",
        "text": "أن يكون المشارك في نهاية البرنامج قادراً على...",
        "bloomLevel": "تطبيق",
        "domain": "مهاري",
        "performanceIndicator": "مؤشر قياس الإنجاز"
      }
    ]
  },
  "curriculum": [
    {
      "moduleNumber": 1,
      "title": "عنوان الوحدة الأولى",
      "durationMinutes": 240,
      "summary": "ملخص الوحدة",
      "sessions": [
        {
          "sessionNumber": 1,
          "title": "عنوان الجلسة",
          "durationMinutes": 120,
          "topics": ["محور 1", "محور 2", "محور 3"],
          "deliveryMethod": "ورشة عمل تفاعلية + دراسة حالة",
          "learningAid": "عرض شرائح + بطاقات نشاط"
        }
      ]
    }
  ],
  "trainerGuide": {
    "iceBreakers": ["نشاط كسر جليد 1", "نشاط كسر جليد 2"],
    "facilitationNotes": [
      { "title": "عنوان الإرشاد", "content": "تفاصيل نصيحة التيسير" }
    ],
    "discussionPrompts": ["سؤال نقاشي عميق 1", "سؤال نقاشي 2"],
    "frequentPitfalls": ["تحدٍ أو خطأ شائع 1 وكيفية تجنبه", "خطأ 2"]
  },
  "activities": [
    {
      "id": "act-1",
      "title": "عنوان النشاط التطبيقي",
      "targetModule": "الوحدة الأولى",
      "type": "مجموعات عمل",
      "durationMinutes": 45,
      "objective": "هدف النشاط",
      "instructions": ["خطوة 1", "خطوة 2", "خطوة 3"],
      "expectedOutput": "المخرج الملموس للنشاط",
      "materialsNeeded": "المعينات المطلوبة"
    }
  ],
  "assessments": {
    "preTestInstructions": "تعليمات الاختبار القبلي",
    "postTestInstructions": "تعليمات الاختبار البعدي",
    "rubrics": [
      {
        "id": "rub-1",
        "criterion": "اسم المعيار",
        "weight": 35,
        "levels": {
          "excellent": "وصف الأداء المتميز",
          "proficient": "وصف الأداء الكفء",
          "developing": "وصف الأداء المقبول",
          "unsatisfactory": "وصف الأداء غير المقبول"
        }
      }
    ],
    "questions": [
      {
        "id": "q-1",
        "question": "نص السؤال",
        "type": "اختيار من متعدد",
        "options": ["خيار أ", "خيار ب", "خيار ج", "خيار د"],
        "correctAnswer": "خيار أ",
        "bloomLevel": "تطبيق"
      }
    ]
  }
}
لا تضع أي نصوص تقديمية أو تعليقات خارج كائن الـ JSON.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const outputText = response.text || '';
    let parsedPackage;
    try {
      parsedPackage = JSON.parse(outputText);
    } catch (parseErr) {
      // Clean possible markdown code fence
      const cleanJson = outputText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      parsedPackage = JSON.parse(cleanJson);
    }

    res.json({
      success: true,
      package: parsedPackage
    });
  } catch (error: any) {
    console.error('Error generating training package:', error);
    res.status(500).json({
      error: error?.message || 'حدث خطأ أثناء توليد الحقيبة التدريبية عبر الذكاء الاصطناعي',
      fallbackAvailable: true
    });
  }
});

// API: Refine or Expand Section
app.post('/api/refine-section', async (req: Request, res: Response) => {
  try {
    const { sectionType, currentContent, instruction, courseContext } = req.body;
    if (!currentContent || !instruction) {
      return res.status(400).json({ error: 'المحتوى والتعليمات مطلوبة للتعديل' });
    }

    const prompt = `
أنت خبير تصميم تعليمي معتمد. قم بتعديل وتحسين القسم التالي من الحقيبة التدريبية:
سياق الدورة: ${courseContext?.title || 'حقيبة تدريبية'}
القسم: ${sectionType}
المحتوى الحالي:
${JSON.stringify(currentContent, null, 2)}

الطلب / التوجيه المطلوب تنفيذه:
"${instruction}"

أعد النتيجة بنفس بنية JSON السابقة تماماً وبصياغة تدريبية عربية عالية الاحترافية.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const clean = (response.text || '').replace(/```json/gi, '').replace(/```/gi, '').trim();
    const updated = JSON.parse(clean);

    res.json({ success: true, updated });
  } catch (error: any) {
    console.error('Error refining section:', error);
    res.status(500).json({ error: error?.message || 'تعذر تحسين القسم' });
  }
});

// API: Record Human Review Request
app.post('/api/human-review-request', (req: Request, res: Response) => {
  const reviewData = req.body;
  console.log('Received Human Review Request:', reviewData);
  res.json({
    success: true,
    message: 'تم استلام طلب المراجعة البشرية بنجاح. سيتواصل معك استشاري التصميم التعليمي خلال 24 ساعة.',
    orderId: `REV-${Math.floor(100000 + Math.random() * 900000)}`
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`منهج AI server is running on port ${PORT}`);
  });
}

startServer();
