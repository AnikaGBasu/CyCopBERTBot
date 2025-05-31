#!/usr/bin/env python3
import sys
import torch
from transformers import BertTokenizer

# 1) Load the traced TorchScript model
model = torch.jit.load("model_save/cycop_model.pt", map_location="cpu")
model.eval()

# 2) Load the tokenizer (we still need Hugging Face’s tokenizer)
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# 3) Read the message, tokenize, and run
text = sys.argv[1] if len(sys.argv)>1 else ""
inputs = tokenizer(
    text,
    return_tensors="pt",
    truncation=True,
    padding="max_length",
    max_length=128
)
with torch.no_grad():
    # your wrapper probably returned logits directly
    logits = model(inputs["input_ids"], inputs["attention_mask"])
    # if your wrapper returns a tuple, unpack as needed:
    # logits = model(inputs["input_ids"], inputs["attention_mask"])[0]
    
# 4) Pick the predicted label
pred = torch.argmax(logits, dim=1).item()
print(pred)
