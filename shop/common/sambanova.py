"""
AI клиент с ротацией SambaNova ключей + fallback на локальный Ollama.
Порядок: SambaNova (быстро, бесплатно) → Ollama qwen2.5:32b (оффлайн, безлимит)
"""
import httpx
import asyncio
import re
import time

SAMBANOVA_URL = "https://api.sambanova.ai/v1/chat/completions"
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "qwen2.5:32b"

# Отсортированы по скорости (tok/s)
KEYS = [
    {"key": "79db85e5-f101-4dbd-aa81-c2e3054e2ff6", "model": "gpt-oss-120b",                       "toks": 671, "reasoning": True},
    {"key": "f2ede240-dc31-4bb6-ae0b-17fdcfbe5734", "model": "Meta-Llama-3.3-70B-Instruct",        "toks": 317, "reasoning": False},
    {"key": "17c59177-53b8-458c-97d8-6ef95bbf0472", "model": "DeepSeek-V3.2",                      "toks": 226, "reasoning": False},
    {"key": "9fefda7a-9d38-4a2d-9802-94ace26c84d3", "model": "DeepSeek-V3.1",                      "toks": 207, "reasoning": False},
    {"key": "eaf6236e-c2b8-4d35-8bf2-fb348a4f102a", "model": "Llama-4-Maverick-17B-128E-Instruct", "toks": 189, "reasoning": False},
    {"key": "0f3397fb-2613-4dca-b8e6-ab1b471f89da", "model": "DeepSeek-R1-0528",                   "toks": 180, "reasoning": True},
    {"key": "d7dd43f9-4b32-4ecf-abff-8f15f13c5a41", "model": "Qwen3-32B",                          "toks": 178, "reasoning": True},
    {"key": "e604fbff-7386-4e34-8c7c-1ae2cd25665f", "model": "DeepSeek-V3.1-Terminus",             "toks": 152, "reasoning": False},
    {"key": "927a0a49-1456-4bba-8ac1-b5f6377018d6", "model": "DeepSeek-V3-0324",                   "toks": 75,  "reasoning": False},
    {"key": "8cd3c038-2634-4927-b6d6-293e2c5fe5bf", "model": "Qwen3-235B",                         "toks": 37,  "reasoning": False},
    {"key": "63ef5567-3d0c-4643-a88c-b86018a599ac", "model": "DeepSeek-V3.1-cb",                   "toks": 16,  "reasoning": False},
]

_cooldown: dict = {}  # key -> unix timestamp до которого в кулдауне


def _clean(text: str) -> str:
    """Убираем <think>...</think> из reasoning моделей."""
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()


async def _ask_ollama(prompt: str, system: str) -> str:
    """Fallback на локальный Ollama."""
    print("[ai] Fallback → ollama qwen2.5:32b")
    async with httpx.AsyncClient(timeout=300) as client:
        r = await client.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            "stream": False
        })
        r.raise_for_status()
        return r.json()["message"]["content"]


async def ask(
    prompt: str,
    system: str = "You are a helpful assistant. Reply in the same language as the user.",
    prefer_reasoning: bool = False,
    max_tokens: int = 2000
) -> str:
    now = time.time()
    available = [k for k in KEYS if _cooldown.get(k["key"], 0) < now]

    if prefer_reasoning:
        reasoning = [k for k in available if k["reasoning"]]
        if reasoning:
            available = reasoning

    for entry in available:
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                r = await client.post(SAMBANOVA_URL, headers={
                    "Authorization": f"Bearer {entry['key']}",
                    "Content-Type": "application/json"
                }, json={
                    "stream": False,
                    "model": entry["model"],
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": max_tokens
                })

                if r.status_code == 429:
                    print(f"[ai] Rate limit: {entry['model']}, cooldown 60s")
                    _cooldown[entry["key"]] = now + 60
                    continue

                r.raise_for_status()
                content = r.json()["choices"][0]["message"].get("content") or ""
                return _clean(content)

        except Exception as e:
            print(f"[ai] Error {entry['model']}: {e}")
            continue

    # Все ключи в кулдауне → fallback на локальную модель
    try:
        return await _ask_ollama(prompt, system)
    except Exception as e:
        return f"[ERROR] Все модели недоступны: {e}"


if __name__ == "__main__":
    import sys
    prompt = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Привет! Напиши Hello World на Python."
    print(asyncio.run(ask(prompt)))
