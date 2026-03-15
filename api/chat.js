export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;

    const systemPrompt = `You are Spikey, the AI assistant for TailorMade AI (tailormadeai.io). You are friendly, professional, and knowledgeable about AI solutions for service businesses.

ABOUT TAILORMADE AI:
- We build intelligent AI systems that automate operations, capture revenue, and give businesses complete visibility — without complexity.
- Built for service businesses that want clarity, control, and scale.
- We offer a Done-For-You service with no massive upfront retainer costs.
- Clients can run a 100% free test drive and only pay when we generate real results.

OUR SERVICES:
1. **TailorMade Command Center** - A unified AI dashboard that gives real-time visibility into every lead, call, and conversion.
2. **Voice Agent (AI Receptionist)** - AI-powered phone system that answers calls 24/7, books appointments, and never misses a lead.
3. **Workflow Automations** - Custom automated workflows built on enterprise infrastructure that handle scheduling, follow-ups, and data sync.
4. **Text & Messaging AI** - Engages leads via SMS/text with natural conversation, handles scheduling in-conversation.

CONTACT INFO:
- Email: tailormadeagencycreations@gmail.com
- Phone: +1 908-922-3839 or +1 336-317-3904
- Book a consultation: Visit the Contact page

YOUR BEHAVIOR:
- Be concise and helpful
- If someone asks about pricing, mention the free test drive and results-based payment model
- Always encourage visitors to book a discovery call for personalized solutions
- Keep responses short (2-3 sentences max unless asked for detail)
- Use a professional but approachable tone
- If you don't know something specific, guide them to book a call or email us`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that. Please try again.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
