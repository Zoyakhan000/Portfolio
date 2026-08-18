import {GoogleGenAI} from '@google/genai';
import {NextRequest, NextResponse} from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', description = '', urlPath = '', typeLabel = '' } = body || {};
    const fallbackDescription = description || `Read about ${title || 'this topic'} on Fiza Rafi's professional digital portfolio.`;

    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json({ description: fallbackDescription, source: 'fallback' });
    }

    const prompt = `You are an expert SEO strategist and copywriter. Generate a highly optimized meta description (maximum 150 characters) for a web page with the following metadata:

Page Title: "${title}"
Page Path: "${urlPath}"
Page Category: "${typeLabel}"
Current Content Summary / Existing Description: "${description}"

Write a compelling, action-oriented meta description that encourages click-throughs while accurately reflecting the page content. 
Output ONLY the meta description text. Do not include quote marks, character counts, or any introductory text. Keep it under 150 characters.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    let text = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : '';
    if (text.length > 160) {
      text = text.substring(0, 157) + '...';
    }
    const finalDescription = text || fallbackDescription;

    return NextResponse.json({ description: finalDescription, source: 'ai' });
  } catch (error: any) {
    console.error('Error generating description with Gemini:', error);
    const body = await req.clone().json().catch(() => ({}));
    const fallback = body.description || `Read about ${body.title || 'this topic'} on Fiza Rafi's professional digital portfolio.`;
    return NextResponse.json({ description: fallback, source: 'fallback' });
  }
}
