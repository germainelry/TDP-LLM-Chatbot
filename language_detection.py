from py3langid.langid import LanguageIdentifier, MODEL_FILE

def detect_language_with_langid(line) -> str:     
    identifier = LanguageIdentifier.from_pickled_model(MODEL_FILE, norm_probs=True) 
    lang, prob = identifier.classify(line)
    return lang
    

if __name__ == "__main__":
    # Testing the language detection function
    detect_language_with_langid("Hello, how are you?")
    detect_language_with_langid("Bonjour, comment ça va?")
    detect_language_with_langid("Hola, cómo estás?")
    detect_language_with_langid("你好吗？")
    detect_language_with_langid("こんにちは、元気ですか？")
    detect_language_with_langid("안녕하세요, 어떻게 지내세요?")
    detect_language_with_langid("Olá, como você está?")
    detect_language_with_langid("Ciao, come stai?")
    detect_language_with_langid("Hallo, wie geht es dir?")
    detect_language_with_langid("Привет, как ты?")
    detect_language_with_langid("Merhaba, nasılsın?")
    detect_language_with_langid("مرحبا كيف حالك؟")
    detect_language_with_langid("שלום, איך אתה?")
    detect_language_with_langid("नमस्ते, कैसे हो?")
    detect_language_with_langid("ਹੈਲੋ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?")
    detect_language_with_langid("हैलो, तिमीलाई कस्तो छ?")
    detect_language_with_langid("हैलो, तिमीलाई कस्तो छ?")
    detect_language_with_langid("வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?")
    detect_language_with_langid("สวัสดีคุณสบายดีไหม?")
    detect_language_with_langid("Xin chào, bạn khỏe không?")
    