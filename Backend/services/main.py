import os
import tempfile
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

# 1. Import your extraction services
from pdf_service import extract_text as extract_digital_text
from ocr_service import extract_with_ocr
from ocr_reciever import generate_grounded_answer

app = FastAPI(title="Saraswati AI API")

# 2. Enable CORS so your Vite frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (e.g., localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask-pdf")
async def ask_pdf(
    file: UploadFile = File(..., description="Upload the PDF document"),
    question: str = Form(..., description="The question you want to ask about the PDF"),
    marks: Optional[int] = Form(None, description="Target marks (optional)")
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    temp_file_path = ""
    try:
        # Step A: Save the incoming PDF to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        # Step B: Smart Extraction (Try standard PyPDF first)
        print("Attempting standard digital text extraction...")
        pdf_content = extract_digital_text(temp_file_path)
        
        # Step C: Fallback to Mistral OCR if the PDF is handwritten/scanned
        # If PyPDF returns less than 50 characters, it's likely an image-based PDF
        if not pdf_content or len(pdf_content.strip()) < 50:
            print("Standard extraction failed or returned little text. Falling back to Mistral OCR...")
            pdf_content = extract_with_ocr(temp_file_path)
            
        if not pdf_content:
            raise HTTPException(status_code=400, detail="Could not extract any text from this file.")

        # Step D: Pass the extracted text to your AI Tutor
        print(f"Generating answer for: '{question}'...")
        answer = await generate_grounded_answer(
            pdf_context=pdf_content,
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
        # Step E: Always clean up the temporary file to prevent storage bloat
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)