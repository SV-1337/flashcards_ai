import {NextResponse} from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 12 flashcards.
Both front and back should be one sentence long. The front should be a question/word and the back should define/explain it.
You should return in the following format beginning after START and ending before END. Do not add any other characters other than the format
DO NOT include START and END in your response, and DO NOT include the word json or any other characters other than what I have told you to use:

START
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
END
`

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
});

export async function POST(req){
    const data = await req.text()
    const result = await model.generateContent(data);

    console.log(result.response.text())
    const flashcards = JSON.parse(result.response.text())

    return NextResponse.json(flashcards.flashcards)
}

