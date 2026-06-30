/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { mockProducts } from './src/data/mockProducts.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Expose parsed JSON body
app.use(express.json());

// Initialize Google Gen AI client with appropriate telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. AI Features will operate in demo mode.');
}

// 1. AI Stylist Consultation Endpoint
app.post('/api/ai-stylist', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message query is required' });
    }

    if (!ai) {
      // Elegant fallback if API key is not configured yet
      return res.json({
        text: `**[Demo Mode]** Namaste! Thank you for contacting ANANTAMAA Stylist. It appears our AI connection is being initialized. 
        
Based on our brand values of effortless luxury and timeless grace, we would highly recommend our **Gilded Noor Organza Anarkali Set** in Soft Blush pink (₹7,999) or our **Zebaish Ivory Tussar Kurta Set** (₹6,999) for standard luxury ethnic events.

Please configure your \`GEMINI_API_KEY\` in the Secrets panel to activate full real-time styling recommendations!`,
        recommendedProductIds: ['an-001', 'an-003']
      });
    }

    // Prepare a lightweight catalog summary to inject as context
    const catalogContext = mockProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice || p.price,
      colors: p.colors.join(', '),
      sizes: p.sizes.join(', '),
      fabric: p.fabric,
      description: p.description,
      stock: p.stock > 0 ? 'In Stock' : 'Out of Stock'
    }));

    const systemInstruction = `You are "Ananya", the Senior Luxury Fashion Consultant & Heritage Stylist for "ANANTAMAA" - a premium Indian ethnic wear brand representing timeless femininity, elegance, softness, and modern luxury.
Your personality is graceful, warm, premium, minimal, helpful, and highly sophisticated (reminiscent of high-fashion advisors from Dior, Sezane, and luxury Indian ateliers).

You have complete real-time access to the ANANTAMAA catalogue listed below. You must ONLY recommend products that are present in this list. Always recommend 1-2 exact products when relevant, and reference their characteristics (colors, sizes, fabric texture, style, etc.).

ANANTAMAA CATALOGUE:
${JSON.stringify(catalogContext, null, 2)}

GUIDELINES FOR CONSULTATION:
1. Speak with elegant, respectful language. Use words that evoke softness, luxury, craftsmanship, and comfort.
2. If the customer describes an occasion (e.g., summer wedding, festive lunch, office event), size preference, or color, match them with the perfect garment.
3. Keep answers concise, beautiful, and highly professional. Avoid bullet-point lists that feel robotic; instead, weave your recommendations into flowing, elegant paragraphs.
4. Output your response in structured JSON with two fields:
   - "text" (string: your beautifully crafted stylist response with markdown formatting)
   - "recommendedProductIds" (array of strings: containing the list of product IDs you recommended, e.g. ["an-001", "an-003"])
Make sure you only output valid JSON matching this schema! No trailing commas, no extra markdown wrapping. Just pure JSON.`;

    const userPrompt = `Chat history: ${JSON.stringify(chatHistory || [])}\n\nUser request: "${message}"\n\nProvide the elegant response now:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const outputText = response.text || '{}';
    try {
      const parsed = JSON.parse(outputText.trim());
      return res.json(parsed);
    } catch (parseErr) {
      console.error('Failed to parse Gemini output as JSON, returning text directly.', outputText);
      // Fallback response structure
      return res.json({
        text: outputText,
        recommendedProductIds: []
      });
    }

  } catch (error: any) {
    console.error('Error calling Gemini API for stylist:', error);
    res.status(500).json({ error: 'Failed to consult AI Stylist: ' + (error.message || error) });
  }
});

// 2. AI Review Summarization Endpoint
app.post('/api/review-summary', async (req, res) => {
  try {
    const { productName, reviews } = req.body;

    if (!productName || !reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Product name and reviews array are required' });
    }

    if (reviews.length === 0) {
      return res.json({ summary: 'No reviews yet for this gorgeous garment. Be the first to leave your feedback!' });
    }

    if (!ai) {
      // Demo mode fallback
      return res.json({
        summary: `**[Demo Mode Summary for ${productName}]**
• **Fabric & Texture**: Highly rated for its luxurious feel, lightweight drape, and breathable premium structure.
• **Fit & Comfort**: Customers report a true-to-size, relaxed yet elegant fit suitable for all-day celebrations.
• **Aesthetic Appeal**: Admired for its subtle embroidery details and timeless, clean color tone.`
      });
    }

    const prompt = `You are a professional retail product analyst for ANANTAMAA.
Summarize the following customer reviews for the product "${productName}". 

Reviews:
${JSON.stringify(reviews.map(r => ({ rating: r.rating, comment: r.comment })), null, 2)}

Provide a beautiful, highly polished, bulleted summary (using 3 clear bullet points in markdown):
- **Fabric & Touch**: (1 sentence highlighting the consensus on texture and feel)
- **Fit & Comfort**: (1 sentence on sizing consensus and comfort level)
- **Overall Verdict**: (1 sentence on general feedback and recommended occasion)

Keep the tone luxurious, objective, and helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    return res.json({ summary: response.text?.trim() || 'Summary could not be generated at this moment.' });

  } catch (error: any) {
    console.error('Error calling Gemini API for review summary:', error);
    res.status(500).json({ error: 'Failed to summarize reviews: ' + (error.message || error) });
  }
});

// Setup Vite Dev Server / Static Files middleware
async function startServer() {
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
    console.log(`ANANTAMAA Full Stack App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
