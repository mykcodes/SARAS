from mistralai import Mistral
from config import settings
_client = Mistral(api_key=settings.MISTRAL_API_KEY)
def extract_with_ocr(file_path: str) -> str:
    uploaded_file = _client.files.upload(
        file={
            "file_name": __import__("os").path.basename(file_path),
            "content": open(file_path, "rb"),
        },
        purpose="ocr",
    )
    signed_url = _client.files.get_signed_url(file_id=uploaded_file.id)
    ocr_response = _client.ocr.process(
        model="mistral-ocr-latest",
        document={
            "type": "document_url",
            "document_url": signed_url.url,
        },
    )
    text = ""
    for page in ocr_response.pages:
        text += page.markdown + "\n"
    return text.strip()
