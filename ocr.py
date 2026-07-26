import os
from dotenv import load_dotenv
from mistralai.client import Mistral
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
load_dotenv()
client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
uploaded_file = client.files.upload(
    file={
        "file_name": "Unit 3 sem 1.pdf",
        "content": open("Unit 3 sem 1.pdf", "rb"),
    },
    purpose="ocr",
)
signed_url = client.files.get_signed_url(file_id=uploaded_file.id)
ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": signed_url.url,
    },
)
text = ""
for page in ocr_response.pages:
    text += page.markdown + "\n"
documents = [Document(page_content=text)]
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
chunks = text_splitter.split_documents(documents)
for i in range(3):
    print(chunks[i].page_content)