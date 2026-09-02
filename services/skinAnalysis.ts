import { SkinMetrics, SeverityLevel, TextureLevel, PoreLevel } from '@/types';

export interface SkinAnalysisServiceOptions {
  apiKey?: string;
  imageBuffer?: Buffer;
  imageBase64?: string;
}

export async function analyzeSkinImage(
  imageBase64: string
): Promise<SkinMetrics> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      return await analyzeWithGemini(imageBase64, apiKey);
    } catch (error) {
      console.warn('Gemini API call failed, falling back to Demo Analysis Engine:', error);
      return runDemoAnalysis(imageBase64);
    }
  }

  // Fallback to high-fidelity Demo Analysis Engine
  return runDemoAnalysis(imageBase64);
}

async function analyzeWithGemini(
  imageBase64: string,
  apiKey: string
): Promise<SkinMetrics> {
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `
You are a cosmetic skincare visual assessment assistant.
IMPORTANT: You are NOT a medical diagnostic system. Do NOT diagnose any diseases, eczema, rosacea, acne vulgaris, or medical infections.
Analyze ONLY visible cosmetic surface characteristics from this face image:
- Brightness (estimated surface radiance on a scale of 0 to 100)
- Evenness (estimated skin tone consistency on a scale of 0 to 100)
- Visible dark spots (Low, Moderate, High)
- Visible redness (Low, Moderate, High)
- Visible texture (Smooth, Moderate, Pronounced)
- Visible pores (Refined, Moderate, Visible)
- Appearance notes (2 brief cosmetic sentences describing visible tone and radiance)

Return strictly valid JSON in this structure:
{
  "brightness": 72,
  "evenness": 64,
  "darkSpots": "Moderate",
  "redness": "Low",
  "texture": "Moderate",
  "pores": "Refined",
  "appearanceNotes": "Overall healthy-looking complexion with moderate visible unevenness across the cheeks and slight visible dullness."
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: cleanBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  const parsed = JSON.parse(text);

  return {
    brightness: Math.min(100, Math.max(0, Number(parsed.brightness) || 72)),
    evenness: Math.min(100, Math.max(0, Number(parsed.evenness) || 62)),
    darkSpots: sanitizeSeverity(parsed.darkSpots, 'Moderate'),
    redness: sanitizeSeverity(parsed.redness, 'Low'),
    texture: sanitizeTexture(parsed.texture, 'Moderate'),
    pores: sanitizePore(parsed.pores, 'Refined'),
    appearanceNotes:
      parsed.appearanceNotes ||
      'Visible cosmetic characteristics show mild uneven-looking tone and subtle surface dullness.',
    isDemo: false,
  };
}

function runDemoAnalysis(imageBase64: string): SkinMetrics {
  // Deterministic seed generation based on base64 content sample
  let seed = 0;
  const sample = imageBase64.slice(100, 300);
  for (let i = 0; i < sample.length; i++) {
    seed = (seed + sample.charCodeAt(i) * (i + 1)) % 1000;
  }

  const brightness = 68 + (seed % 15); // Range ~ 68 - 82
  const evenness = 58 + ((seed * 3) % 18); // Range ~ 58 - 75

  const spotOptions: SeverityLevel[] = ['Low', 'Moderate', 'Moderate', 'High'];
  const rednessOptions: SeverityLevel[] = ['Low', 'Low', 'Moderate', 'Low'];
  const textureOptions: TextureLevel[] = ['Smooth', 'Moderate', 'Moderate'];
  const poreOptions: PoreLevel[] = ['Refined', 'Moderate', 'Moderate'];

  return {
    brightness,
    evenness,
    darkSpots: spotOptions[seed % spotOptions.length],
    redness: rednessOptions[(seed + 1) % rednessOptions.length],
    texture: textureOptions[(seed + 2) % textureOptions.length],
    pores: poreOptions[(seed + 3) % poreOptions.length],
    appearanceNotes:
      'Visible characteristics indicate mild surface dullness with some visible uneven-looking tone and minor dark spots on cheek areas. Skin appears reasonably well-hydrated with smooth to moderate texture.',
    isDemo: true,
  };
}

function sanitizeSeverity(val: any, fallback: SeverityLevel): SeverityLevel {
  if (['Low', 'Moderate', 'High'].includes(val)) return val;
  return fallback;
}

function sanitizeTexture(val: any, fallback: TextureLevel): TextureLevel {
  if (['Smooth', 'Moderate', 'Pronounced'].includes(val)) return val;
  return fallback;
}

function sanitizePore(val: any, fallback: PoreLevel): PoreLevel {
  if (['Refined', 'Moderate', 'Visible'].includes(val)) return val;
  return fallback;
}
