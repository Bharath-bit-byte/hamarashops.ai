/**
 * HamaraShops.ai - Browser-Native Voice Assistance Service
 * Provides Speech-to-Text (SpeechRecognition) and Text-to-Speech (speechSynthesis)
 * Zero external API dependencies, zero credentials, privacy-first local browser execution.
 */

// Feature detection
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
}

/**
 * Strips Markdown syntax, backslash escapes, URLs, bullets, numbered markers,
 * and code blocks to produce clean, conversational text suitable for speech synthesis.
 */
export function sanitizeTextForSpeech(rawMarkdown) {
  if (!rawMarkdown || typeof rawMarkdown !== 'string') return '';

  return (
    rawMarkdown
      // 1. Remove code blocks ```...```
      .replace(/```[\s\S]*?```/g, ' ')
      // 2. Remove inline code `...`
      .replace(/`([^`]+)`/g, '$1')
      // 3. Remove Markdown images ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
      // 4. Transform Markdown links [label](url) -> label
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // 5. Remove raw URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // 6. Remove backslash escapes: e.g. \* \- \_ 1\.
      .replace(/\\([*_\-#`~.\[\]()!+>])/g, '$1')
      // 7. Remove headers: #, ##, ###
      .replace(/^#{1,6}\s+/gm, '')
      // 8. Transform bold and italic: ***text***, **text**, *text*, _text_
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // 9. Remove bullets: -, *, • at start of lines
      .replace(/^[\u2022\-\*]\s+/gm, '')
      // 10. Transform numbered list prefixes: e.g. "1. Product" -> "Product"
      .replace(/^\d+[.)]\s+/gm, '')
      // 11. Remove emojis and unusual symbols
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
      // 12. Normalize multiple punctuation or dashes
      .replace(/--+/g, ' ')
      // 13. Collapse multiple whitespace/newlines into clean sentences
      .replace(/\s*\n+\s*/g, '. ')
      .replace(/\.\s*\./g, '.')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Creates and configures a SpeechRecognition instance.
 * @param {Object} options
 * @param {Function} options.onStart Callback when listening begins
 * @param {Function} options.onResult Callback with recognized transcript string
 * @param {Function} options.onError Callback with user-friendly error message
 * @param {Function} options.onEnd Callback when recognition finishes
 * @param {string} [options.lang='en-IN'] Language code (defaults to en-IN)
 * @returns {SpeechRecognition|null}
 */
export function createSpeechRecognizer({
  onStart,
  onResult,
  onError,
  onEnd,
  lang = 'en-IN',
}) {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Voice input is not supported in this browser.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.lang = lang;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0][0]?.transcript || '';
      if (onResult && transcript.trim()) {
        onResult(transcript.trim());
      }
    }
  };

  recognition.onerror = (event) => {
    let friendlyMessage = 'Could not capture voice input. Please try again.';

    switch (event.error) {
      case 'not-allowed':
      case 'permission-denied':
        friendlyMessage = 'Microphone permission was denied. Please allow microphone access to use voice input.';
        break;
      case 'no-speech':
        friendlyMessage = "Sorry, I couldn't hear you. Please try speaking again.";
        break;
      case 'audio-capture':
        friendlyMessage = 'No microphone was detected on your device.';
        break;
      case 'network':
        friendlyMessage = 'Network error occurred during speech recognition.';
        break;
      case 'aborted':
        // Aborted intentionally by user clicking stop
        friendlyMessage = '';
        break;
      default:
        friendlyMessage = 'Voice input encountered an error. Please type your message.';
        break;
    }

    if (onError && friendlyMessage) {
      onError(friendlyMessage);
    }
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}

/**
 * Selects the best natural English voice available in window.speechSynthesis.
 */
function getBestEnglishVoice() {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Try Indian English voice first
  const indianVoice = voices.find(
    (v) => v.lang === 'en-IN' || v.lang === 'en_IN' || v.name.includes('India')
  );
  if (indianVoice) return indianVoice;

  // 2. Try Natural / Google / Premium English voices
  const naturalVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))
  );
  if (naturalVoice) return naturalVoice;

  // 3. Any English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
  if (anyEnglish) return anyEnglish;

  // 4. Default voice
  return voices[0] || null;
}

// Track active utterance to prevent garbage-collection cutoffs
let activeUtterance = null;

/**
 * Speaks message text aloud using browser speechSynthesis.
 * Automatically sanitizes Markdown text.
 * @param {string} text Raw message text
 * @param {Object} options
 * @param {Function} [options.onStart]
 * @param {Function} [options.onEnd]
 * @param {Function} [options.onError]
 * @param {number} [options.rate=1.0]
 * @param {number} [options.pitch=1.0]
 */
export function speakText(text, { onStart, onEnd, onError, rate = 1.0, pitch = 1.0 } = {}) {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError('Speech synthesis is not supported in this browser.');
    return;
  }

  // Always cancel previous speech
  stopSpeaking();

  const spokenText = sanitizeTextForSpeech(text);
  if (!spokenText) {
    if (onEnd) onEnd();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voice = getBestEnglishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      activeUtterance = null;
      // 'interrupted' or 'canceled' are normal stop events
      if (event.error !== 'interrupted' && event.error !== 'canceled' && onError) {
        onError('Voice playback encountered an error.');
      }
      if (onEnd) onEnd();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    activeUtterance = null;
    if (onError) onError('Failed to initialize voice playback.');
    if (onEnd) onEnd();
  }
}

/**
 * Stops any active speech synthesis immediately.
 */
export function stopSpeaking() {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  } catch (err) {
    // Ignore cancel errors
  }
}
