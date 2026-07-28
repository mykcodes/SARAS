import os
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# This will automatically grab the MISTRAL_API_KEY from his existing .env file
load_dotenv()

async def generate_grounded_answer(pdf_context: str, question: str, marks: int = 2) -> str:
    """
    Takes the raw OCR/PDF text, a question, and the target marks, 
    and returns a formatted explanation strictly based on the provided text.
    """
    try:
        # Initialize Mistral (Temperature 0.1 for strict fact-based answers)
        llm = ChatMistralAI(model="mistral-large-latest", temperature=0.1)

        # The Strict Grounding Prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are Saraswati AI, an expert academic tutor.
        Your task is to answer the student's request or explain the concept based STRICTLY on the provided PDF/OCR document context.

        STRICT CONSTRAINTS:
        1. Base your entire answer ONLY on the provided PDF Context. Do NOT use outside general knowledge if it's not present or implied in the context.
        2. If the answer cannot be found in the provided PDF context, reply exactly with:
           "I cannot answer this question based on the provided document context."
        3. Silently correct OCR typos present in the extracted text.
        4. Format the explanation strictly according to the marks requested:
           - 1 Mark: Concise 1-2 sentence definition directly from context.
           - 2 Marks: 3-4 sentence explanation with bullet points from context.
           - 5 Marks: Comprehensive answer (Intro, Key Points, Analogy/Example from document, Summary).
        """),
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
            "marks_requested": marks
        })
        
        return answer

    except Exception as e:
        return f"Error generating AI response: {str(e)}"