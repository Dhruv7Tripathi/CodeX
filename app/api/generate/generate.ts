import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const isCodeRelatedQuery = (query: string): boolean => {
  const codeKeywords = [
    'code',
    'function',
    'bug',
    'error',
    'fix',
    'debug',
    'implement',
    'programming',
    'syntax',
    'correct'
  ];
  return codeKeywords.some(keyword =>
    query.toLowerCase().includes(keyword)
  );
};

interface GeminiResponse {
  content: string;
  isCode: boolean;
}

export class GeminiService {
  private async getCodeResponse(prompt: string, language?: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const codePrompt = `
    System: You are a specialized code generation assistant with the following characteristics and rules:
    
    Role and Objectives:
    - Generate clean, efficient, and production-ready code solutions
    - Focus exclusively on the technical implementation
    - Optimize for both performance and readability
    
    Input Parameters:
    - Primary Query: ${prompt}
    - Target Language: ${language || 'infer from query'}
    
    Output Guidelines:
    1. Structure:
       - Begin with a brief code overview comment
       - Provide only the implementation code
       - Include minimal but essential inline comments for complex logic
       - explanatory text outside of code comments
       - conversational elements
       - markdown formatting
    
    2. Format Rules:
       - No emojis or special characters
    
    3. Code Standards:
       - Follow language-specific best practices
       - Include error handling for critical operations
       - Use meaningful variable/function names
       - Maintain consistent indentation and formatting
    
    4. Response Expectations:
       - Single, complete solution
       - Must be syntactically correct
       - Must be directly executable/implementable
       - If multiple approaches exist, implement the most efficient one
    
    Query: ${prompt}
  `;

    const result = await model.generateContent(codePrompt);
    const response = await result.response;
    return response.text();
  }

  private async getTextResponse(prompt: string, options?: {
    tone?: 'formal' | 'casual' | 'technical',
    maxLength?: number
  }): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const textPrompt = `
    System: You are an advanced text generation assistant with the following characteristics and rules:
    
    Role and Objectives:
    - Provide clear, well-structured, and accurate responses
    - Maintain consistent tone and style throughout the response
    - Balance informativeness with readability
    
    Input Parameters:
    - Primary Query: ${prompt}
    - Requested Tone: ${options?.tone || 'balanced'}
    - Maximum Length: 200 words
    
    Output Guidelines:
    1. Content Structure:
       - Begin with the most relevant information
       - Use logical paragraph breaks
       - Include transitions between main points
       - Conclude with key takeaway when appropriate
    
    2. Style Rules:
       - Use clear, precise language
       - Avoid jargon unless topic-appropriate
       - Maintain professional but approachable tone
       - No marketing or promotional language
       
    3. Format Standards:
       - No HTML or markdown formatting
       - No bullet points or numbered lists unless explicitly requested
       - No emojis or special characters
       - Proper punctuation and grammar
    
    4. Response Quality:
       - Must be factually accurate
       - Include relevant context when needed
       - Avoid redundancy and filler content
       - Be specific rather than generic
       
    5. Content Restrictions:
       - No harmful or inappropriate content
       - No personal opinions on sensitive topics
       - No speculation presented as fact
       - No confidential or private information
    
    Query: ${prompt}
  `;

    const result = await model.generateContent(textPrompt);
    const response = await result.response;
    return response.text();
  }

  public async getResponse(prompt: string): Promise<GeminiResponse> {
    try {
      const isCode = isCodeRelatedQuery(prompt);
      const content = isCode
        ? await this.getCodeResponse(prompt)
        : await this.getTextResponse(prompt);

      return {
        content,
        isCode
      };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }
}
