from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()

model = ChatMistralAI(
    model="mistral-large-latest"
)

answer = model.invoke("Hello! Who are you?")
print(answer.content)