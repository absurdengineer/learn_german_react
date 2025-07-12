import { useState, useCallback } from "react";

interface PronunciationButtonProps {
  text: string;
  className?: string;
}

export default function PronunciationButton({
  text,
  className = "",
}: PronunciationButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSpeaking) return;

      // Use the German word (text) instead of IPA pronunciation
      const textToSpeak = text;

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Set to German language
        utterance.lang = "de-DE";

        // Set slower speed for new learners (0.5)
        utterance.rate = 0.5;

        // Set slightly lower pitch for better clarity
        utterance.pitch = 0.9;

        // Try to select a good German voice
        const voices = speechSynthesis.getVoices();
        const germanVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith("de") && voice.name.includes("Google")
          ) ||
          voices.find((voice) => voice.lang.startsWith("de")) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") && voice.name.includes("Google")
          );

        if (germanVoice) {
          utterance.voice = germanVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        speechSynthesis.speak(utterance);
      }
    },
    [text, isSpeaking]
  );

  return (
    <button
      onClick={speak}
      disabled={isSpeaking}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors disabled:opacity-50 ${className}`}
      title="Listen to pronunciation"
    >
      {isSpeaking ? (
        // Animated sound waves when speaking
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      ) : (
        // Play button icon when not speaking
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
