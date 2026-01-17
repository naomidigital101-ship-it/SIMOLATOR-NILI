
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Character, CharacterType, DifficultyLevel, ArenaType } from "../constants";

export interface SimulationResponse {
  text: string;
  moodDelta: number;
  professionalismTip: string;
  audioData?: string;
  transcription?: string;
}

export interface DetailedScore {
  empathy: number;
  businessLogic: number;
  professionalism: number;
  feedback: string;
  encouragement: string;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export const playAudio = async (base64Audio: string) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const bytes = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(bytes, ctx);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export const generateDynamicCharacter = async (type: CharacterType, level: DifficultyLevel, userAge: number, arena: ArenaType, customContext: string): Promise<Character> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const arenaDescriptions = {
    [ArenaType.HRM]: "ניהול משאבי אנוש (גיוס, פיטורין, קונפליקטים בצוות, משוב עובדים)",
    [ArenaType.SALES]: "מכירות ושיווק (סגירת עסקאות, טיפול בהתנגדויות לקוח, שיחות מכירה קרות)",
    [ArenaType.COACHING]: "אימון וניהול עסקי (מנטורשיפ, ניהול אסטרטגי, קבלת החלטות הנהלה)"
  };

  const contextInstruction = customContext ? `התבסס על הקייס-סטדי/הקשר הספציפי שהמתאמן הוסיף: ${customContext}` : '';

  const metaResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `צור דמות לסימולציה עבור גיל ${userAge}.
    זירת פעילות: ${arenaDescriptions[arena]}.
    ${contextInstruction}
    סוג דמות בתוך הזירה: ${type}.
    רמת קושי: ${level}.
    ספק רקע מפורט (detailedBackground) בעברית שכולל נתונים ספציפיים ובעיה מוגדרת (specificIssue) שקשורה ישירות לזירת ה-${arena}.
    החזר JSON בעברית מלאה: name, role, gender (male/female), description, situation, detailedBackground, specificIssue, goal, initialMessage, portraitPrompt (English), scenePrompt (English), voiceName ('Kore' for female, 'Zephyr' for male).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          gender: { type: Type.STRING },
          description: { type: Type.STRING },
          situation: { type: Type.STRING },
          detailedBackground: { type: Type.STRING },
          specificIssue: { type: Type.STRING },
          goal: { type: Type.STRING },
          initialMessage: { type: Type.STRING },
          portraitPrompt: { type: Type.STRING },
          scenePrompt: { type: Type.STRING },
          voiceName: { type: Type.STRING }
        },
        required: ["name", "role", "gender", "description", "situation", "detailedBackground", "specificIssue", "goal", "initialMessage", "portraitPrompt", "scenePrompt", "voiceName"]
      }
    }
  });

  const res = JSON.parse(metaResponse.text || "{}");
  
  const [portraitGen, sceneGen] = await Promise.all([
    ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-end business portrait of a ${res.gender} ${res.role}: ${res.portraitPrompt}` }] }
    }),
    ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional office or ${arena} context background: ${res.scenePrompt}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    })
  ]);

  const avatarPart = portraitGen.candidates[0].content.parts.find(p => p.inlineData);
  const scenePart = sceneGen.candidates[0].content.parts.find(p => p.inlineData);

  const avatar = avatarPart ? `data:image/png;base64,${avatarPart.inlineData?.data}` : '';
  const sceneUrl = scenePart ? `data:image/png;base64,${scenePart.inlineData?.data}` : '';

  return {
    id: type,
    level: level,
    name: res.name,
    role: res.role,
    gender: res.gender as 'male' | 'female',
    avatar,
    sceneUrl,
    description: res.description,
    situation: res.situation,
    detailedBackground: res.detailedBackground,
    specificIssue: res.specificIssue,
    goal: res.goal,
    initialMessage: res.initialMessage,
    responses: [res.voiceName], 
    bgGradient: 'from-slate-900 to-indigo-950',
    color: res.gender === 'female' ? 'rose' : 'blue'
  };
};

export const generateSimulationTurn = async (character: Character, history: any[], input: { text?: string, audioBase64?: string, mimeType?: string }): Promise<SimulationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  if (input.text) parts.push({ text: input.text });
  if (input.audioBase64) {
    parts.push({
      inlineData: {
        data: input.audioBase64,
        mimeType: input.mimeType || 'audio/webm'
      }
    });
  }

  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts }],
    config: {
      systemInstruction: `אתה ${character.name}, בתפקיד ${character.role}. עליך לדבר בעברית מקצועית וברורה.
      הנושא: ${character.situation}.
      רקע מפורט: ${character.detailedBackground}.
      הבעיה: ${character.specificIssue}.
      פעל לפי כללי המשא ומתן הענייני. תגובות צריכות להיות תמציתיות וממוקדות.
      החזר JSON עם: text (תגובה), moodDelta (-1.0 עד 0.4), professionalismTip (טיפ קצר), transcription (תמלול).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          moodDelta: { type: Type.NUMBER },
          professionalismTip: { type: Type.STRING },
          transcription: { type: Type.STRING }
        },
        required: ["text", "moodDelta", "professionalismTip"]
      }
    }
  });
  const textRes = JSON.parse(textResponse.text || "{}");

  const voiceName = character.gender === 'female' ? 'Kore' : 'Zephyr';
  
  const audioResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: textRes.text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } }
      }
    }
  });
  const audioData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  return { ...textRes, audioData };
};

export const generateFinalSummary = async (character: Character, history: any[]): Promise<DetailedScore> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `נתח ביצועים מקצועיים בעברית: ${JSON.stringify(history)}`,
    config: {
      systemInstruction: "נתח ביצועים בעברית. הערך לפי טכניקות מו\"מ, הקשבה ופתרון בעיות.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          empathy: { type: Type.NUMBER },
          businessLogic: { type: Type.NUMBER },
          professionalism: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          encouragement: { type: Type.STRING }
        },
        required: ["empathy", "businessLogic", "professionalism", "feedback", "encouragement"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
