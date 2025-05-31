from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import BertTokenizer, BertConfig, BertForSequenceClassification

# 1. Load tokenizer as before
tokenizer = BertTokenizer.from_pretrained("model_save")

# 2. Build a fresh config & model, then load your weights
config = BertConfig.from_pretrained(
    "bert-base-uncased",   # or whatever base you started from
    num_labels=5           # your 5‐way classifier
)
model = BertForSequenceClassification(config)
state = torch.load("model_save/bert_classifier_state_dict.pt", map_location="cpu")
model.load_state_dict(state)
model.eval()

app = FastAPI()
class Payload(BaseModel):
    text: str

@app.post("/classify")
def classify(payload: Payload):
    inputs = tokenizer(
        payload.text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )
    with torch.no_grad():
        logits = model(**inputs).logits
    pred = torch.argmax(logits, dim=1).item()
    return {"label": pred}
