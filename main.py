from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from ocr import get_ocr_text
load_dotenv()
model = ChatMistralAI(
    model="mistral-large-latest"
)
pdf_path = "Unit 3 sem 1.pdf"
ocr_docs = get_ocr_text(pdf_path)
answer = model.invoke(f"explain Thermodynamic Equilibrium \n\n{ocr_docs}")
print(answer.content)