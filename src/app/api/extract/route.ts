import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }

    // Remove the data:image/jpeg;base64, prefix if present
    const base64Image = image.split(",")[1] || image;

    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64Image,
            },
            {
              type: "text",
              text: `You are an expert document scanner. Your task is to extract information from the provided image of a retirement contribution form.

The document contains various fields such as names, dates, amounts, and identification numbers.

Please extract all relevant information and return it strictly as a JSON object.

Do not include any markdown formatting like \`\`\`json in your response. Just the raw JSON.

If a field is not found, use an empty string for its value.

Expected JSON structure example:
{
  "full_name": "John Doe",
  "document_number": "12345678",
  "contribution_date": "2023-01-15",
  "amount": "1500.50",
  "period": "January 2023"
}

Analyze the image carefully and provide the most accurate transcription possible.`,
            },
          ],
        });

      const extractedData = JSON.parse(text);
      return new Response(JSON.stringify(extractedData), { status: 200 });
    } catch (error: any) {
      console.error("Extraction error:", error);
      return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
    }
  }
}
