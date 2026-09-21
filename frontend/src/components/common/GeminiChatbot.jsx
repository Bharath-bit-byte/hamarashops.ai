import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  LoaderCircle,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
  ArrowRight,
  Compass,
  Zap,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Square,
  Calendar,
  Play,
  Box,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { streamAssistantResponse, INITIAL_SUGGESTIONS } from '../../services/aiAssistantService';
import AppointmentModal from './AppointmentModal';
import './GeminiChatbot.css';

const welcomeMessage = {
  role: 'assistant',
  source: 'concierge',
  text: "Hello! I'm your **HamaraShops.ai Advanced NLP Assistant**.\n\nI am synchronized with our **Spring Cloud API Gateway** and microservices. I can answer complex technical inquiries, detail our **6 enterprise AI products**, explain our **5 industry verticals**, showcase our **official videos**, share details about our **leadership & CEO Dheerendar Srivastav**, or **schedule an engineering consultation**. Ask me anything or tap a topic below!",
  actions: [
    { label: 'Explore AI Products', path: '/use-cases' },
    { label: '5 Industry Verticals', path: '/industries' },
    { label: 'Book Consultation', path: 'open-appointment' },
    { label: 'Meet Our CEO', path: '/about#ceo-section' },
  ],
  suggestions: INITIAL_SUGGESTIONS,
};

// Clean text of emojis, non-standard bullets, and corrupted mojibake (e.g. mojibake bullet/emojis)
function sanitizeChatText(rawText) {
  if (!rawText) return '';
  return rawText
    // 1. Corrupted UTF-8 bullet point: \u00e2\u20ac\u00a2 -> standard "- "
    .replace(/\u00e2\u20ac\u00a2/g, '- ')
    // 2. Corrupted UTF-8 dashes: \u00e2\u20ac\u2013 or \u00e2\u20ac\u2014 -> " - "
    .replace(/\u00e2\u20ac[\u2013\u2014]/g, ' - ')
    // 3. Other 3-byte corrupted symbols starting with \u00e2 (like \u00e2\u0161\u00a1)
    .replace(/\u00e2[^\s]*/g, '')
    // 4. 4-byte corrupted emojis starting with \u00f0 (like \u00f0\u0178...)
    .replace(/\u00f0[^\s]*/g, '')
    // 5. Standard unicode bullets
    .replace(/\u2022/g, '-')
    // 6. Any actual Unicode emojis
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '');
}

function sanitizeLabel(label) {
  if (!label) return '';
  return sanitizeChatText(label).replace(/\s+/g, ' ').trim();
}

// Formats rich markdown: code blocks, inline code, bold, bullet points, numbered lists
function formatMessageContent(text, isCurrentlyStreaming = false) {
  if (!text) return null;

  const sanitizedText = sanitizeChatText(text);

  // Split by code blocks first
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(sanitizedText)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: sanitizedText.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', lang: match[1] || 'text', code: match[2] });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < sanitizedText.length) {
    segments.push({ type: 'text', content: sanitizedText.slice(lastIndex) });
  }

  return (
    <>
      {segments.map((segment, sIdx) => {
        if (segment.type === 'code') {
          return (
            <div key={sIdx} className="gemini-code-block my-2 rounded-xl overflow-hidden border border-[#3c475a]/60 bg-[#0a0d14]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#141822] border-b border-[#3c475a]/40 text-[10px] font-mono text-slate-400">
                <span>{segment.lang.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(segment.code)}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Copy code"
                >
                  Copy
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed">
                <code>{segment.code}</code>
              </pre>
            </div>
          );
        }

        // Parse regular text block lines
        const lines = segment.content.split('\n');
        return lines.map((line, lIdx) => {
          const trimmed = line.trim();
          const isBullet = trimmed.startsWith('\u2022') || trimmed.startsWith('-') || trimmed.startsWith('*');
          const isNumbered = /^\d+\.\s/.test(trimmed);

          let cleanLine = trimmed;
          let prefix = null;

          if (isBullet) {
            cleanLine = trimmed.replace(/^[\u2022\-\*]\s*/, '');
            prefix = <span className="text-[#ff6b6b] text-xs font-bold leading-5 mr-1.5">-</span>;
          } else if (isNumbered) {
            const numMatch = trimmed.match(/^(\d+\.)\s*(.*)/);
            if (numMatch) {
              prefix = <span className="text-[#4cd6ff] text-xs font-mono font-bold leading-5 mr-1.5">{numMatch[1]}</span>;
              cleanLine = numMatch[2];
            }
          }

          // Parse inline code and bold
          const inlineParts = cleanLine.split(/(`[^`]+`|\*\*.*?\*\*)/g);
          const renderedParts = inlineParts.map((part, pIdx) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={pIdx} className="gemini-inline-code px-1.5 py-0.5 rounded bg-[#1f2838] text-[#4cd6ff] font-mono text-[11px]">
                  {part.slice(1, -1)}
                </code>
              );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          if (prefix) {
            return (
              <div key={`${sIdx}-${lIdx}`} className="gemini-bullet-item flex items-start my-1">
                {prefix}
                <span className="flex-1">{renderedParts}</span>
              </div>
            );
          }

          if (!trimmed) {
            return <div key={`${sIdx}-${lIdx}`} className="h-1.5" />;
          }

          return <p key={`${sIdx}-${lIdx}`} className="my-0.5 leading-relaxed">{renderedParts}</p>;
        });
      })}
      {isCurrentlyStreaming && <span className="gemini-typing-cursor" />}
    </>
  );
}

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([welcomeMessage]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isStreaming, isOpen]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Listen for global open-appointment-modal events
  useEffect(() => {
    const handleOpenAppointmentModal = () => {
      setIsAppointmentModalOpen(true);
    };
    window.addEventListener('open-appointment-modal', handleOpenAppointmentModal);
    return () => window.removeEventListener('open-appointment-modal', handleOpenAppointmentModal);
  }, []);

  const handleActionClick = (path) => {
    if (!path) return;

    if (path === 'open-appointment' || path === '#appointment' || path === '/contact#appointment') {
      window.dispatchEvent(new CustomEvent('open-appointment-modal'));
      setIsAppointmentModalOpen(true);
      return;
    }

    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      const targetRoute = route || '/';
      navigate(targetRoute);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
      return;
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSend = async (messageText) => {
    const query = (messageText || input).trim();
    if (!query || isStreaming) return;

    // Check if the user is asking to open the appointment modal
    const lower = query.toLowerCase();
    if (
      lower.includes('open appointment') ||
      lower.includes('schedule appointment') ||
      lower.includes('book appointment') ||
      lower.includes('book consultation') ||
      lower.includes('schedule meeting') ||
      lower.includes('appointment section')
    ) {
      window.dispatchEvent(new CustomEvent('open-appointment-modal'));
      setIsAppointmentModalOpen(true);
    }

    // Cancel any active speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }

    const userMessage = { role: 'user', text: query };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await streamAssistantResponse({
        userInput: query,
        conversationHistory: nextHistory,
        signal: abortController.signal,
        onToken: (currentFullText) => {
          setStreamingText(currentFullText);
        },
        onComplete: (finalResponse) => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              source: finalResponse.source || 'generative',
              text: finalResponse.text,
              actions: finalResponse.actions || [],
              suggestions: finalResponse.suggestions || [],
              productCards: finalResponse.productCards || [],
              solutionCards: finalResponse.solutionCards || [],
            },
          ]);
          setStreamingText('');
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          source: 'concierge',
          text: "I experienced a momentary connection interruption. You can explore our core use cases or schedule an appointment directly!",
          actions: [
            { label: 'Book Appointment', path: 'open-appointment' },
            { label: 'Core AI Use Cases', path: '/use-cases' },
            { label: 'Explore Industries', path: '/industries' },
          ],
        },
      ]);
      setStreamingText('');
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      if (streamingText) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            source: 'generative',
            text: streamingText + ' [Response stopped]',
            actions: [
              { label: 'Book Appointment', path: 'open-appointment' },
              { label: 'All Use Cases', path: '/use-cases' },
            ],
            suggestions: INITIAL_SUGGESTIONS.slice(0, 3),
          },
        ]);
      }
      setStreamingText('');
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text, idx) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks and URLs for speech
    const cleanText = sanitizeChatText(text).replace(/[*#`\-_]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

  const resetChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([welcomeMessage]);
    setStreamingText('');
    setIsStreaming(false);
    setSpeakingIndex(null);
  };

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const activeSuggestions = lastAssistantMessage?.suggestions || INITIAL_SUGGESTIONS;

  return (
    <>
      {/* Universal Appointment Modal (triggered by chatbot or globally) */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      <div className="gemini-chatbot">
        {isOpen && (
          <section className="gemini-panel" aria-label="HamaraShops Advanced NLP Assistant">
            <header className="gemini-panel-header">
              <div className="gemini-title-group">
                <div className="gemini-avatar">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="gemini-eyebrow">Advanced NLP Agent</p>
                    <span className="gemini-header-tag">Neural Streaming</span>
                  </div>
                  <h2>HamaraShops AI Assistant</h2>
                </div>
              </div>
              <div className="gemini-header-actions">
                <button type="button" onClick={resetChat} aria-label="Reset chat" title="Reset chat">
                  <RotateCcw size={16} />
                </button>
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant" title="Close">
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="gemini-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div className={`gemini-message ${message.role}`} key={`${message.role}-${index}`}>
                  {message.role === 'assistant' && (
                    <div className="gemini-bot-icon-wrapper">
                      <Bot size={15} aria-hidden="true" />
                    </div>
                  )}
                  <div className="gemini-message-body">
                    {message.role === 'assistant' && (
                      <div className="gemini-message-meta">
                        <div className="gemini-source-badge">
                          {message.source === 'generative' ? (
                            <>
                              <Zap size={10} className="text-[#4cd6ff]" />
                              <span>Generative NLP Engine</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={10} className="text-[#ff6b6b]" />
                              <span>Enterprise Concierge</span>
                            </>
                          )}
                        </div>
                        <div className="gemini-message-tools">
                          <button
                            type="button"
                            onClick={() => handleSpeak(message.text, index)}
                            className="gemini-tool-btn"
                            title={speakingIndex === index ? 'Stop speaking' : 'Read aloud'}
                            aria-label="Toggle speech"
                          >
                            {speakingIndex === index ? (
                              <VolumeX size={12} className="text-[#ff6b6b] animate-pulse" />
                            ) : (
                              <Volume2 size={12} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(message.text, index)}
                            className="gemini-tool-btn"
                            title="Copy message"
                            aria-label="Copy message"
                          >
                            {copiedIndex === index ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="gemini-message-content">
                      {formatMessageContent(message.text)}
                    </div>

                    {/* Rich Interactive Media Cards */}
                    {message.role === 'assistant' && message.text?.includes('pxaMqyFmHO0') && (
                      <div className="gemini-media-card">
                        <div className="gemini-video-preview">
                          <iframe
                            src="https://www.youtube-nocookie.com/embed/pxaMqyFmHO0?rel=0"
                            title="HamaraShops.ai Profile Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}

                    {/* CEO Profile Card */}
                    {message.role === 'assistant' && message.text?.includes('Dheerendar Srivastav') && (
                      <div className="gemini-ceo-preview">
                        <img
                          src="/images/ceo_poster.png"
                          alt="Dheerendar Srivastav - CEO"
                          className="gemini-ceo-avatar"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">Dheerendar Srivastav</div>
                          <div className="text-[10px] text-[#ffb3b0] font-mono">Founder & CEO | HamaraShops.ai</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleActionClick('/about#ceo-section')}
                          className="gemini-action-btn shrink-0"
                        >
                          <span>Meet CEO</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    )}

                    {/* Structured Product Cards Grid */}
                    {message.role === 'assistant' && message.productCards && message.productCards.length > 0 && (
                      <div className="gemini-product-cards-container my-3 space-y-2.5">
                        {message.productCards.map((prod) => (
                          <div key={prod.id || prod.slug} className="gemini-product-card rounded-2xl p-3.5 bg-[#0a1628]/90 border border-[#ff6b6b]/30 shadow-lg">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-[#ff6b6b]/15 flex items-center justify-center text-[#ff6b6b]">
                                  <Box size={13} />
                                </div>
                                <h4 className="text-xs font-bold text-white leading-tight">{prod.title}</h4>
                              </div>
                              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4cd6ff]/10 text-[#4cd6ff] border border-[#4cd6ff]/30 shrink-0">
                                {prod.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{prod.tagline || prod.description}</p>
                            {prod.metrics && prod.metrics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {prod.metrics.map((m, mIdx) => (
                                  <span key={mIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1f2838] text-emerald-300 border border-emerald-500/20">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-1 border-t border-[#3c475a]/40">
                              <span className="text-[10px] text-slate-400 font-mono">Content Microservice</span>
                              <button
                                type="button"
                                onClick={() => handleActionClick('/use-cases')}
                                className="gemini-card-link text-[10px] font-semibold text-[#ff6b6b] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <span>Explore Capability</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Structured Solution Cards Grid */}
                    {message.role === 'assistant' && message.solutionCards && message.solutionCards.length > 0 && (
                      <div className="gemini-solution-cards-container my-3 space-y-2.5">
                        {message.solutionCards.map((sol) => (
                          <div key={sol.id || sol.slug} className="gemini-solution-card rounded-2xl p-3.5 bg-[#0a1628]/90 border border-[#4cd6ff]/30 shadow-lg">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-[#4cd6ff]/15 flex items-center justify-center text-[#4cd6ff]">
                                  <Layers size={13} />
                                </div>
                                <h4 className="text-xs font-bold text-white leading-tight">{sol.title}</h4>
                              </div>
                              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff6b6b]/10 text-[#ffb3b0] border border-[#ff6b6b]/30 shrink-0">
                                {sol.industry}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{sol.subtitle || sol.summary}</p>
                            {sol.keyBenefits && sol.keyBenefits.length > 0 && (
                              <ul className="space-y-1 mb-2">
                                {sol.keyBenefits.slice(0, 2).map((b, bIdx) => (
                                  <li key={bIdx} className="text-[10px] text-slate-300 flex items-start gap-1.5">
                                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="flex items-center justify-between pt-1 border-t border-[#3c475a]/40">
                              <span className="text-[10px] text-slate-400 font-mono">{sol.type || 'Enterprise Blueprint'}</span>
                              <button
                                type="button"
                                onClick={() => handleActionClick('/industries')}
                                className="gemini-card-link text-[10px] font-semibold text-[#4cd6ff] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <span>View Solution</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dynamic in-chat navigation action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="gemini-actions-container">
                        {message.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleActionClick(act.path)}
                            className="gemini-action-btn"
                          >
                            <span>{sanitizeLabel(act.label)}</span>
                            <ArrowRight size={13} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Live Streaming Assistant Message */}
              {isStreaming && (
                <div className="gemini-message assistant gemini-streaming-message">
                  <div className="gemini-bot-icon-wrapper">
                    <Bot size={15} aria-hidden="true" />
                  </div>
                  <div className="gemini-message-body">
                    <div className="gemini-source-badge">
                      <Zap size={10} className="text-[#4cd6ff] animate-pulse" />
                      <span>Streaming Neural Response...</span>
                    </div>
                    <div className="gemini-message-content">
                      {streamingText ? (
                        formatMessageContent(streamingText, true)
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                          <LoaderCircle size={14} className="gemini-spinner text-[#ff6b6b]" />
                          <span>Thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Contextual Dynamic Suggestion Chips */}
            {!isStreaming && activeSuggestions && activeSuggestions.length > 0 && (
              <div className="gemini-suggestions-bar">
                <div className="gemini-suggestions-label">
                  <Compass size={12} className="text-[#ff6b6b]" />
                  <span>Suggested next steps:</span>
                </div>
                <div className="gemini-suggestions-list">
                  {activeSuggestions.slice(0, 4).map((sug, sIdx) => {
                    const cleanChip = sanitizeLabel(sug);
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSend(cleanChip)}
                        className="gemini-chip"
                        disabled={isStreaming}
                      >
                        {cleanChip}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <form className="gemini-composer" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="gemini-message">Message Assistant</label>
              <input
                id="gemini-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) handleSubmit(event);
                }}
                placeholder="Ask anything about our AI solutions..."
                disabled={isStreaming}
              />

              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="gemini-stop-btn"
                  title="Stop generating"
                  aria-label="Stop generating"
                >
                  <Square size={13} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send message"
                  title="Send message"
                  disabled={!input.trim()}
                >
                  <Send size={16} />
                </button>
              )}
            </form>
            <p className="gemini-disclaimer">NLP Neural Streaming Engine | Multi-Turn Memory | No Key Required</p>
          </section>
        )}

        <button
          type="button"
          className={`gemini-launcher ${isOpen ? 'is-open' : ''}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
          title={isOpen ? 'Close AI assistant' : 'Chat with Advanced NLP Assistant'}
        >
          {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
        </button>
      </div>
    </>
  );
}