import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
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

function generateAlgorithmicDraft(title: string, subtitle: string, category: string, processContent: string): string {
  const cleanTitle = title || 'Featured Showcase Project';
  const cleanSub = subtitle ? ` (${subtitle})` : '';
  const cleanCat = category ? category.toUpperCase() : 'UI/UX & WEB';
  
  // Extract key sentences or headings from process content
  const snippet = processContent
    ? processContent.replace(/[#*`_]/g, '').slice(0, 180).trim()
    : 'focusing on strategic positioning, high-impact aesthetic alignment, and seamless conversion rates.';

  return `An elite ${cleanCat} initiative for ${cleanTitle}${cleanSub}. Engineered with meticulous visual hierarchy and performance-focused architecture, ${snippet}... Designed to drive measurable user engagement and elevated brand ROI.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', subtitle = '', category = '', processContent = '' } = body || {};

    const fallbackDraft = generateAlgorithmicDraft(title, subtitle, category, processContent);

    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json({ description: fallbackDraft, source: 'algorithmic' });
    }

    const prompt = `You are a world-class UX copywriter and digital strategist for Fiza Rafi (UI/UX Designer & Growth Strategist). 
Auto-draft a concise, compelling 2 to 3 sentence SEO-friendly project summary for a portfolio showcase project with the following details:

Project Title: "${title}"
Subtitle: "${subtitle}"
Category: "${category}"
Detailed Process / Case Study Notes:
"${processContent.slice(0, 1000)}"

Instructions:
1. Focus on conversion rate optimization, visual craftsmanship, and business impact.
2. Keep the tone sophisticated, professional, and clear.
3. Length: Exactly 2 to 3 sentences (40-60 words).
4. Output ONLY the raw paragraph description. Do not include quotes, titles, bullet points, markdown formatting, or preamble text.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    const draftText = response.text?.trim() || fallbackDraft;
    return NextResponse.json({ description: draftText, source: 'gemini' });

  } catch (error) {
    console.error('Error auto-drafting project description:', error);
    return NextResponse.json(
      { 
        description: 'A performance-driven portfolio project designed with high-density visual hierarchy, seamless micro-interactions, and conversion-focused UX architecture.',
        source: 'error_fallback' 
      }, 
      { status: 200 }
    );
  }
}
