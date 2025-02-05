import re
from openai import OpenAI

class LLMPrivacyWrapper:
    def init(self, replacement_map: dict):
        """
        Initializes the wrapper with a mapping of words to their replacements.
        replacement_map: Dictionary where keys are sensitive words and values are their innocent replacements.
        """
        self.replacement_map = replacement_map
        self.reverse_map = {v: k for k, v in replacement_map.items()}  # Reverse for decoding
    def encode(self, text: str) -> str:
        """
        Replaces sensitive words with innocent alternatives.
        text: Input text containing sensitive words.
        return: Encoded text with innocent replacements.
        """
        def replace_match(match):
            word = match.group(0)
            return self.replacement_map.get(word, word)  # Replace if found, else keep the same
        pattern = re.compile(r'\b(' + '|'.join(map(re.escape, self.replacement_map.keys())) + r')\b', re.IGNORECASE)
        return pattern.sub(replace_match, text)
    def decode(self, text: str) -> str:
        """
        Restores original sensitive words in the text.
        text: Encoded text with innocent replacements.
        return: Decoded text with original words restored.
        """
        def replace_match(match):
            word = match.group(0)
            return self.reverse_map.get(word, word)
        pattern = re.compile(r'\b(' + '|'.join(map(re.escape, self.reverse_map.keys())) + r')\b', re.IGNORECASE)
        return pattern.sub(replace_match, text)
    def answer_with_llm(self, text: str, client, model: str) -> str:
        """
        Encodes text, sends it to the LLM, and then decodes the response.
        text: The original input text.
        client: an LLM client, e.g., OpenAI() or Nebius client.
        model: a model name, e.g., "gpt-4o-mini".
        return: The final processed text with original words restored.
        """
        encoded_text = self.encode(text)
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                  "role": "user",
                  "content": encoded_text
                }
            ],
            temperature=None
        )
        llm_response = completion.choices[0].message.content
        return self.decode(llm_response)
