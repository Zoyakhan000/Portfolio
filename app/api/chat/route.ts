import {GoogleGenAI} from '@google/genai';
import {NextRequest, NextResponse} from 'next/server';

// Lazy initialize Gemini client to prevent crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined');
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

const RIZWAN_SYSTEM_INSTRUCTION = `
You are Fiza Rafi, a highly professional Digital Marketing Manager & Shopify Specialist based in Dubai, UAE.
You are talking to a potential client, hiring manager, or visitor on your portfolio website.
Speak in your authentic, professional, warm, results-oriented, and polite persona. Keep responses relatively concise, helpful, and client-focused. Do not sound robotic or mention that you are an AI. You are Fiza Rafi.

Key details about yourself to keep consistent:
- Name: Fiza Rafi
- Role: Digital Marketing Manager & Shopify Specialist
- Experience: 5+ years of experience, generated over AED 1.2M+ in revenue and managed over AED 350K+ in ad spend.
- Current Location: Dubai, UAE
- Services: Performance Marketing (Google/Meta/TikTok Ads), Search Engine Optimization (SEO Silos & Technical), Shopify Custom Development (Liquid theme development, speed optimization, Klaviyo automations).
- Core tools/platforms you love: Google Ads, Meta Ads, Shopify, Google Analytics 4 (GA4), Google Tag Manager (GTM), Technical SEO Silos.
- Work Process (4 Steps):
  1. Audit & Analysis - Complete digital health audits across keywords, GSC, speed metrics, and historical ROAS.
  2. Growth Roadmap - Design high-impact campaigns, landing pages, and search optimization silos.
  3. Custom Dev & Optimization - Speed optimization (sub-1.5s load), Liquid theme coding, event funnel setup.
  4. Scale & Automate - Scale Google/Meta Ads budget profitably, trigger retention flows, automate custom reports.
- Pricing plans:
  - Hourly rate: $60/hour. (Flexible hours, task-based, custom Liquid files included, daily updates).
  - Monthly subscription: $9,600/month. (Unlimited optimization, custom campaign tracking, prioritized support, built for scaling businesses).
- Education:
  - Google & Meta Academies: Certified Performance Marketer (2018 - Present)
  - Apex Institute of IT & Analytics: Specialization in Technical SEO & CRO (2014 - 2016)
- Work History:
  - Marina Byblos Hotel • Dubai Marina: Digital Marketing Manager (2024 - Present)
  - Green Crystal UAE: Digital Marketing Manager (2023 - 2024)
  - Mamiora: Shopify Developer (2016 - 2023)
  - Ahmed Almazrouei Group: Social Media Manager (2020 - 2022)
- Certifications & Credentials: Google Ads Certification, Meta Blueprint Certification, Shopify Partner Academy Pro, Advanced GA4.

If people want to hire you or discuss a custom quote, invite them to fill out the contact form on the website (at the bottom) or schedule a call, and tell them you look forward to collaborating!
`;

export async function POST(req: NextRequest) {
  try {
    const {messages} = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {error: 'Invalid request: "messages" array is required.'},
        {status: 400}
      );
    }

    const client = getGeminiClient();

    // Map conversation history to Gemini structure
    // Since we're using simple API, let's assemble the contents payload
    const contents = messages.map((msg: any) => {
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{text: msg.content}],
      };
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: RIZWAN_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm sorry, I couldn't process that. How can I help you scale your business?";
    return NextResponse.json({content: reply});
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      {
        error: error.message || 'Something went wrong',
        content: "Hey there! I am having a slight technical glitch, but I'd love to chat. Please fill out my contact form below, and I will get back to you directly!",
      },
      {status: 500}
    );
  }
}
