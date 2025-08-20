import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, projectsCount } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: 'AI service not configured. Please add ANTHROPIC_API_KEY to your environment variables.' 
      }, { status: 500 });
    }

    // Create a system prompt that provides context about the data
    const systemPrompt = `You are an AI energy analyst specializing in UK renewable energy data. You have access to a comprehensive dataset of ${projectsCount || '13,000+'} renewable energy projects from the UK's REPD (Renewable Energy Planning Database).

The dataset includes information about:
- Project locations across UK regions (Scotland, Wales, England)
- Technology types (Solar Photovoltaics, Wind Onshore, Wind Offshore, Biomass, Hydro, Battery Storage, etc.)
- Development status (Operational, Under Construction, Planning Permission Granted, Application Submitted, etc.)
- Project capacity in MW
- Operators/developers
- Planning dates and permissions

Your role is to:
1. Provide insights based on renewable energy trends and patterns
2. Answer questions about regional development, technology comparisons, and market opportunities
3. Offer business intelligence for investors, developers, and policymakers
4. Explain complex energy data in accessible terms
5. Suggest actionable recommendations based on the data patterns

Keep responses informative but concise (2-3 paragraphs max). Use specific numbers and percentages when possible. Focus on actionable business insights.

If asked about specific data that you don't have access to, acknowledge this limitation and provide general industry insights where helpful.`;

    // Send request to Claude AI
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
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
