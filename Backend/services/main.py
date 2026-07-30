import os
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File, Form

# 1. Import your Mistral OCR function
from ocr_service import extract_with_ocr

# 2. Import your AI Answer Generator
from ocr_reciever import generate_grounded_answer

app = FastAPI(title="Saraswati AI API")

@app.post("/ask-pdf")
async def ask_pdf(
    file: UploadFile = File(..., description="Upload the PDF document"),
    question: str = Form(..., description="The question you want to ask about the PDF"),
    marks: int = Form(2, description="Target marks (1, 2, or 5)")
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    temp_file_path = ""
    try:
        # Step A: Save the incoming PDF to a temporary file on your Mac/Server
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        # Step B: Run Mistral's powerful OCR on that file
        print("Running Mistral OCR...")
        pdf_markdown = extract_with_ocr(temp_file_path)
        
        if not pdf_markdown:
            raise HTTPException(status_code=400, detail="Mistral OCR could not extract any text from this file.")

        # Step C: Pass the beautifully formatted Markdown to your AI Tutor
        print("Generating answer...")
        answer = await generate_grounded_answer(
            pdf_context=pdf_markdown,
            question=question,
            marks=marks
        )
        
        return {
            "filename": file.filename,
            "question": question,
            "marks_requested": marks,
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    finally:
        # Step D: Always clean up the temporary file from your hard drive
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)