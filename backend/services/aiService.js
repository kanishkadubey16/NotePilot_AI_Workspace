const { GoogleGenerativeAI } = require('@google/generative-ai');

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
};

const generateNoteSummary = async (content) => {
  if (!content) return '';
  const prompt = `Please read the following note and provide a clear, concise, and professional summary. Preserve all important points but make it highly readable.\n\nNote Content:\n${content}`;

  try {
    const result = await getModel().generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error generating AI summary:', error);
    throw new Error('Failed to generate AI summary');
  }
};

const extractActionItems = async (content) => {
  if (!content) return [];
  const prompt = `Extract a clear list of actionable tasks or action items from the following note. 
Respond ONLY with a valid JSON array of strings. Do not include markdown formatting like \`\`\`json. Just the raw JSON array.
If there are no action items, return an empty array [].\n\nNote Content:\n${content}`;

  try {
    const result = await getModel().generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Error extracting action items:', error);
    throw new Error('Failed to extract action items');
  }
};

const generateTitle = async (content) => {
  if (!content) return '';
  const prompt = `Analyze the following note and generate a smart, professional, and concise title for it (maximum 6 words). Respond ONLY with the title text itself, without any quotes or additional commentary.\n\nNote Content:\n${content}`;

  try {
    const result = await getModel().generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Error generating title:', error);
    throw new Error('Failed to generate title');
  }
};

const suggestTags = async (content) => {
  if (!content) return [];
  const prompt = `Analyze the following note and suggest 3 to 5 highly relevant, single-word tags that describe its main topics.
Respond ONLY with a valid JSON array of lowercase strings. Do not include markdown formatting like \`\`\`json. Just the raw JSON array.\n\nNote Content:\n${content}`;

  try {
    const result = await getModel().generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Error suggesting tags:', error);
    throw new Error('Failed to suggest tags');
  }
};

const improveWriting = async (content) => {
  if (!content) return '';
  const prompt = `Analyze the following note for clarity, grammar, and readability. 
Provide a significantly improved version of the text that fixes grammatical errors, enhances flow, and maintains the original meaning. 
Respond ONLY with the improved text and nothing else.\n\nNote Content:\n${content}`;

  try {
    const result = await getModel().generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error improving writing:', error);
    throw new Error('Failed to improve writing');
  }
};

module.exports = {
  generateNoteSummary,
  extractActionItems,
  generateTitle,
  suggestTags,
  improveWriting
};
