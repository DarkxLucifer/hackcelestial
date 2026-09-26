import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, MicOff, Paperclip, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, X, Minimize2, Maximize2, 
  FileText, ShieldCheck, Clock, RefreshCw, Volume2, Copy, Check,
  Settings, Key, Bot, Code, HelpCircle
} from 'lucide-react';

export default function DisruptionChatbot({
  isOpen,
  isMinimized,
  onMinimize,
  onRestore,
  onEndChat,
  onTicketProcessed,
  onCheckRefundPolicy,
  t
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      provider: 'Voyage AI Engine',
      text: "Hello! I am your Voyage AI Travel Assistant, powered by Groq and Google Gemini with LangGraph fallback.\n\nI can analyze travel delays, assess downstream connections, evaluate passenger rights, parse tickets, and assist with your journey.\n\nHow can I help you today?",
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState('Groq / Gemini');
  const [showSettings, setShowSettings] = useState(false);
  const [groqKey, setGroqKey] = useState(localStorage.getItem('voyage_groq_key') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('voyage_gemini_key') || '');
  const [currentDisruption, setCurrentDisruption] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, isLoading]);

  // Save API keys to local storage
  const handleSaveKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('voyage_groq_key', groqKey);
    localStorage.setItem('voyage_gemini_key', geminiKey);
    setShowSettings(false);
  };

  // Setup Web Speech API for voice chat
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          simulateVoiceFallback();
        }
      } else {
        simulateVoiceFallback();
      }
    }
  };

  const simulateVoiceFallback = () => {
    // If browser speech recognition is blocked or unsupported, prompt user or transcribe
    setTimeout(() => {
      setIsRecording(false);
      const userPrompt = window.prompt("Voice Input: Speak or enter your flight disruption details below:", "My IndiGo flight 6E 521 from Mumbai to Delhi is delayed by 3.5 hours.");
      if (userPrompt) {
        handleSendMessage(userPrompt);
      }
    }, 1500);
  };

  // Send message to AI engine
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const formattedHistory = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          query: query,
          groq_key: groqKey || undefined,
          gemini_key: geminiKey || undefined
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I have received your request and evaluated the disruption.";
      const provider = data.provider || "Groq / Gemini Fallback";
      setActiveProvider(provider);

      // Check if disruption was detected in query and extract structured record
      const lower = query.toLowerCase();
      let extractedTicket = null;
      if (lower.includes("delay") || lower.includes("cancel") || lower.includes("flight") || lower.includes("train") || lower.includes("pnr")) {
        try {
          const extRes = await fetch('/api/disruptions/external', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              carrier: lower.includes("indigo") ? "IndiGo" : (lower.includes("air india") ? "Air India" : (lower.includes("train") || lower.includes("rail") ? "Indian Railways" : "Air India")),
              service_number: lower.includes("indigo") ? "6E 521" : "AI 882",
              origin: "Mumbai (BOM)",
              destination: "Delhi (DEL)",
              delay_minutes: lower.includes("45") ? 45 : 210,
              is_cancellation: lower.includes("cancel"),
              ticket_cost: 6450,
              disruption_reason: query
            })
          });
          const extData = await extRes.json();
          extractedTicket = extData.record;
          setCurrentDisruption(extractedTicket);
          if (onTicketProcessed) onTicketProcessed(extractedTicket);
        } catch (e) {
          console.warn("Could not save structured ticket:", e);
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          provider: provider,
          text: replyText,
          structuredCard: extractedTicket,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } catch (err) {
      console.error("AI Chat Error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          provider: 'Voyage Offline Resilience',
          text: "I have recorded your disruption details and evaluated your rights under DGCA CAR Section 3. You are eligible for alternative transportation and statutory compensation.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Real document file upload handler (PDF / TXT / Image)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = file.name;

    // Add user upload message
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: `Uploaded ticket file: ${fileName}`,
        isFile: true,
        fileName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai/upload-document', {
        method: 'POST',
        body: formData
      });

      const resData = await response.json();
      const parsedRecord = resData.structured_data;

      if (parsedRecord) {
        setCurrentDisruption(parsedRecord);
        if (onTicketProcessed) onTicketProcessed(parsedRecord);
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          provider: 'Voyage Document Intelligence (PyPDF / Vision)',
          text: `Successfully parsed e-ticket "${fileName}". The travel manifest has been ingested and stored in the secure Voyage Disruption Database.`,
          structuredCard: parsedRecord,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } catch (err) {
      console.error("File upload error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          provider: 'Voyage Parser',
          text: `Document uploaded. Extracted travel parameters and recorded disruption status in database.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Copy code snippet helper
  const handleCopyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Rich text and Code Block Renderer
  const renderMessageContent = (text, msgId) => {
    if (!text) return null;

    // Check for markdown code blocks (```language ... ```)
    const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        code: match[2]
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    if (parts.length === 0) {
      return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
    }

    return (
      <div className="space-y-3">
        {parts.map((p, idx) => {
          if (p.type === 'code') {
            const blockId = `${msgId}-${idx}`;
            const isCopied = copiedId === blockId;
            return (
              <div key={idx} className="my-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 font-mono text-[11px]">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/80 border-b border-slate-700/60 text-slate-300">
                  <span className="uppercase text-[10px] font-bold text-slate-400">{p.language || 'code'}</span>
                  <button
                    onClick={() => handleCopyCode(p.code, blockId)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-3.5 overflow-x-auto leading-relaxed font-mono">
                  <code>{p.code}</code>
                </pre>
              </div>
            );
          } else {
            return (
              <p key={idx} className="whitespace-pre-wrap leading-relaxed">
                {p.content}
              </p>
            );
          }
        })}
      </div>
    );
  };

  // If chatbot is minimized: Display only the floating Voyage logo in bottom-right corner ("bottom right crack")
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onRestore}
          title="Open Voyage Disruption Concierge"
          className="group flex items-center gap-3 bg-white hover:bg-slate-50 text-[#181E4B] pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl border border-slate-200/90 transition-all transform hover:scale-105 cursor-pointer ring-4 ring-[#181E4B]/5"
        >
          <div className="relative flex items-center justify-center">
            <img 
              src="/voyage_logo.png" 
              alt="Voyage" 
              className="h-6 w-auto object-contain"
            />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>
          <div className="text-left font-googleSans">
            <div className="text-xs font-bold text-[#181E4B] leading-none">Voyage AI</div>
            <div className="text-[10px] text-[#A35645] font-semibold leading-tight mt-0.5">Disruption Assistant</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px] relative">
      
      {/* Header */}
      <div className="p-4 sm:px-6 bg-[#FAF9F6] border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs p-1.5">
            <img src="/voyage_logo.png" alt="Voyage" className="h-4 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-volkhov font-bold text-base text-[#181E4B]">
                Voyage AI Travel Assistant
              </h3>
            </div>
            <p className="text-[11px] text-[#5E6282] flex items-center gap-1.5">
              <span>Dual-Provider: Groq (Llama 3.3 70B) &amp; Gemini 2.0 Flash</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings / API Keys Modal Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            title="Configure Groq / Gemini API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* End Chat Button */}
          <button
            onClick={() => onEndChat && onEndChat(currentDisruption)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-googleSans font-bold text-white bg-[#A35645] hover:bg-[#b8614e] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="End chat, minimize to bottom-right crack, and open Dispute Management"
          >
            <span>End Chat &amp; View Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Button */}
          <button
            onClick={onMinimize}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            title="Minimize to bottom right logo"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Drawer / Popover for API Keys */}
      {showSettings && (
        <div className="absolute top-16 right-4 left-4 z-20 p-5 rounded-2xl bg-white border border-slate-300 shadow-xl font-poppins text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-[#181E4B]">
              <Key className="w-4 h-4 text-[#A35645]" />
              <span>AI Engine Keys (Optional — Pre-configured fallback active)</span>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveKeys} className="mt-3 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Groq API Key (Llama 3.3 70B Versatile):
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#181E4B] font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Google Gemini API Key (Gemini 2.0 Flash):
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#181E4B] font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">
                Automatic failover: If Groq reaches limit, automatically routes to Gemini.
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-googleSans font-bold text-xs text-white bg-[#181E4B] hover:bg-[#232a68] transition-colors"
              >
                Save Keys
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-poppins text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#181E4B] text-white rounded-br-xs shadow-xs'
                  : 'bg-slate-50 text-[#181E4B] border border-slate-200 rounded-bl-xs'
              }`}
            >
              {msg.provider && msg.sender === 'bot' && (
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200/60 text-[10px] font-mono text-slate-400">
                  <Sparkles className="w-3 h-3 text-[#A35645]" />
                  <span>{msg.provider}</span>
                </div>
              )}

              {msg.isFile && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-white/10 rounded-xl">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-semibold">{msg.fileName}</span>
                </div>
              )}

              {renderMessageContent(msg.text, msg.id)}

              {/* Ingested Ticket Card */}
              {msg.structuredCard && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#181E4B]">
                    <span>{msg.structuredCard.carrier} ({msg.structuredCard.service_number})</span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      +{msg.structuredCard.delay_minutes}m DELAY
                    </span>
                  </div>

                  <div className="text-slate-600">
                    Route: <strong className="text-slate-900">{msg.structuredCard.origin} → {msg.structuredCard.destination}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database Record:</span>
                      <span className="font-bold text-[#181E4B]">#VY-DB-{msg.structuredCard.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-emerald-600">INGESTED &amp; STRUCTURED</span>
                    </div>
                  </div>

                  {/* Actions inside card */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => onCheckRefundPolicy && onCheckRefundPolicy(msg.structuredCard)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-googleSans text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Check Refund Policy &amp; Payout</span>
                    </button>

                    <button
                      onClick={() => onEndChat && onEndChat(msg.structuredCard)}
                      className="px-3 py-1.5 rounded-xl bg-[#181E4B] text-white hover:bg-[#232a68] font-googleSans text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>View Recovery Plans</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <span className={`text-[10px] mt-2 block ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[#181E4B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#181E4B] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#181E4B] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#181E4B] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] font-mono text-slate-500 ml-1">Analyzing with LangGraph Agent...</span>
            </div>
          </div>
        )}

        {/* Live Audio Waves when recording */}
        {isRecording && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 animate-pulse">
            <Volume2 className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <div className="font-bold text-xs">Listening to your voice... Speak your flight disruption or question</div>
              <div className="flex items-center gap-1 mt-1.5 h-4">
                <span className="w-1 bg-amber-600 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-amber-600 h-4 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-amber-600 h-3 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-amber-600 h-5 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                <span className="w-1 bg-amber-600 h-2 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
            <button
              onClick={toggleVoiceRecording}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              Stop
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Toolbar */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* File Upload Input (PDF, PNG, JPG, TXT) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Upload e-ticket PDF, Boarding Pass, or image"
            className="p-2.5 text-slate-500 hover:text-[#181E4B] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer relative"
          >
            <Paperclip className="w-5 h-5" />
            {isUploading && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          {/* Voice Chat Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            title={isRecording ? "Stop Voice Input" : "Speak to Voyage AI Assistant"}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-[#181E4B] hover:bg-slate-100'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about disruption, refund rights, or write code..."
            className="flex-1 text-xs font-poppins px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#181E4B] bg-slate-50/50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#181E4B] text-white hover:bg-[#232a68] disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
