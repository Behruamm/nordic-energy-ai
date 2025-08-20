import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, projectsCount, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: 'AI service not configured. Please add ANTHROPIC_API_KEY to your environment variables.' 
      }, { status: 500 });
    }

    // Create a system prompt that provides context about the data
    const systemPrompt = `You are the Nordic Energy AI Feasibility Specialist - an expert renewable energy consultant with access to the UK's complete REPD (Renewable Energy Planning Database) containing ${projectsCount || '13,000+'} renewable energy projects.

Your expertise covers:
- UK renewable energy project feasibility and site assessment
- Regional planning patterns and success rates across England, Scotland, and Wales
- Technology-specific insights (Solar PV, Wind Onshore/Offshore, District Heating, Battery Storage, Heat Pumps)
- Development pipeline analysis (from planning through to operation)
- Local authority planning preferences and approval patterns
- Grid connection opportunities and constraints
- Market opportunities for net-zero infrastructure development

Your role is to:
1. **Rapid Site Assessment**: Analyze specific locations for renewable energy potential
2. **Market Intelligence**: Identify emerging opportunities and development hotspots
3. **Risk Analysis**: Flag potential planning or development challenges based on local patterns
4. **Strategic Guidance**: Recommend optimal technology choices for specific contexts
5. **Competitive Intelligence**: Analyze developer activity and market positioning
6. **Client Advisory**: Translate complex energy data into actionable business decisions

**Response Style:**
- Professional consultant tone (you work for Nordic Energy)
- 2-3 focused paragraphs maximum
- Include specific data points, percentages, and project counts
- Provide actionable next steps and recommendations
- Acknowledge limitations when specific site-level data isn't available
- Frame insights around Nordic Energy's integrated approach to net-zero solutions

**Key Focus Areas:**
- District heating networks (Nordic Energy's specialty)
- Urban decarbonization opportunities
- Integrated energy system solutions
- Stakeholder engagement considerations
- Planning pathway recommendations

Always end responses with practical next steps that align with Nordic Energy's "concept to completion" project delivery approach.`;

    // Build conversation messages with history
    const messages = [
      ...conversationHistory, // Previous conversation context
      {
        role: 'user',
        content: message
      }
    ];

    // Send request to Claude AI with conversation context
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages
    });

    const aiResponse = response.content[0];
    
    if (aiResponse.type === 'text') {
      return NextResponse.json({ 
        response: aiResponse.text 
      });
    } else {
      throw new Error('Unexpected response format from AI');
    }

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json({ 
          error: 'Invalid API key. Please check your ANTHROPIC_API_KEY environment variable.' 
        }, { status: 401 });
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ 
          error: 'AI service is temporarily busy. Please try again in a moment.' 
        }, { status: 429 });
      }
    }

    return NextResponse.json({ 
      error: 'I apologize, but I encountered an issue processing your request. Please try again.' 
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
