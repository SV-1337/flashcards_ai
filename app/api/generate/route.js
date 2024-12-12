import {NextResponse} from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 12 flashcards.
Both front and back should be one sentence long. The front should be a question/word and the back should define/explain it.
You should return in the following format (That will be parsed into JSON, so you do not want to add any characters such as \`:


{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
});

export async function POST(req){
    const data = await req.text()
    const result = await model.generateContent(data);

    const flashcards = JSON.parse(result.response.text())

    return NextResponse.json(flashcards.flashcards)
}

