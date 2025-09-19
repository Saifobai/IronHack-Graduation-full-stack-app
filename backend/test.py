import torch, whisper

print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))

# Load Whisper on GPU
model = whisper.load_model(
    "base", device="cuda" if torch.cuda.is_available() else "cpu"
)
print("Model loaded successfully on", "GPU" if torch.cuda.is_available() else "CPU")
