import os
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# This will automatically grab the MISTRAL_API_KEY from his existing .env file
load_dotenv()

async def generate_grounded_answer(pdf_context: str, question: str, marks: int = None) -> str:
    """
    Takes the raw OCR/PDF text, a question, and optional target marks, 
    and returns a formatted explanation strictly based on the provided text.
    """
    try:
        # Initialize Mistral (Temperature 0.1 for strict fact-based answers)
        llm = ChatMistralAI(model="mistral-large-latest", temperature=0.1)

        # Determine the system prompt based on whether marks are provided
        if marks:
            # STRICT EXAM MODE
            system_instructions = """You are Saraswati AI, an expert academic tutor and examiner.
        Your task is to answer the student's request STRICTLY based on the provided PDF/OCR document context.

        STRICT CONSTRAINTS:
        1. Base your entire answer ONLY on the provided PDF Context. Do NOT use outside general knowledge if it's not present or implied in the context.
        2. If the answer cannot be found in the provided PDF context, reply exactly with:
           "I cannot answer this question based on the provided document context."
        3. Silently correct OCR typos present in the extracted text.
        4. Format the explanation strictly according to the marks requested:
           - 1 Mark: Concise 1-2 sentence definition directly from context.
           - 2 Marks: 3-4 sentence explanation with bullet points from context.
           - 5 Marks: Comprehensive answer (Intro, Key Points, Analogy/Example from document, Summary).
        """
            target_marks_text = str(marks)
        else:
            # CONVERSATIONAL TUTOR MODE
            system_instructions = """You are Saraswati AI, a friendly, encouraging, and intelligent study assistant.
        Your goal is to help a student understand their uploaded notes and answer their doubts naturally and conversationally.

        STRICT CONSTRAINTS:
        1. Base your explanation STRICTLY on the provided PDF Context. 
        2. If the user asks a question whose answer cannot be found in the provided PDF context, reply gently indicating that the context doesn't mention it.
        3. Break down complex topics simply. Be helpful and clear. Do not format the response like a test paper.
        4. Silently correct OCR typos present in the extracted text.
        """
            target_marks_text = "N/A (Conversational)"

        # The Prompt Template
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_instructions),
            ("human", """PDF Document Context:
        ---
        {pdf_context}
        ---

        Student Question / Topic: {question}
        Target Marks: {marks_requested}""")
        ])

        # Create and run the pipeline
        pipeline = prompt | llm | StrOutputParser()
        
        answer = await pipeline.ainvoke({
            "pdf_context": pdf_context,
            "question": question,
            "marks_requested": target_marks_text
        })
        
        return answer

    except Exception as e:
        return f"Error generating AI response: {str(e)}"