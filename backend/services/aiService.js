const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateNoteSummary = async (content) => {
  if (!content) return '';
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional assistant. Provide a concise, executive summary of the note provided.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });
    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq Summary Error:', error.message);
    throw new Error('AI summary generation failed: ' + error.message);
  }
};

const extractActionItems = async (content) => {
  if (!content) return [];
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Extract actionable tasks from the note. Return ONLY a JSON array of strings. No markdown, no numbering, just ["Task 1", "Task 2"].'
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
    });
    
    let text = chatCompletion.choices[0].message.content.trim();
    // Robust JSON parsing
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Groq Action Items Error:', error.message);
    throw new Error('AI action items extraction failed');
  }
};

const generateTitle = async (content) => {
  if (!content) return 'Untitled Note';
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Suggest a short, punchy title for this note (max 5 words). Return ONLY the title text.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });
    return chatCompletion.choices[0].message.content.replace(/"/g, '').trim();
  } catch (error) {
    console.error('Groq Title Error:', error.message);
    return 'Untitled Note';
  }
};

const suggestTags = async (content) => {
  if (!content) return [];
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Suggest 3 relevant tags for this note. Return ONLY a JSON array of strings. No markdown.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });
    
    let text = chatCompletion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Groq Tags Error:', error.message);
    return [];
  }
};

const improveWriting = async (content) => {
  if (!content) return '';
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Rewrite the following text to be more professional and clear, while maintaining the same meaning. Return ONLY the improved text.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
    });
    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq Improve Error:', error.message);
    throw new Error('AI writing improvement failed');
  }
};

module.exports = {
  generateNoteSummary,
  extractActionItems,
  generateTitle,
  suggestTags,
  improveWriting
};
