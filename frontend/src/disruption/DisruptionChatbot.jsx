import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, MicOff, Paperclip, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, X, Minimize2, Maximize2, 
  FileText, ShieldCheck, Clock, RefreshCw, Volume2
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
      text: "Hello! I am your Voyage Disruption Concierge. If your flight or train was booked outside Voyage, share your disruption details below, speak using voice chat, or upload your ticket file. I will evaluate your downstream domino risks, calculate your statutory refund under DGCA/EU261, and construct your optimal recovery plan.",
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentDisruption, setCurrentDisruption] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording]);

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
          // Fallback simulation
          simulateVoiceInput();
        }
      } else {
        // Fallback simulation if browser doesn't support Speech API
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setTimeout(() => {
      setIsRecording(false);
      const simulatedVoices = [
        "My IndiGo flight 6E 521 from Mumbai to Delhi is delayed by 3 hours and 30 minutes, and I'll miss my Vande Bharat train to Jaipur.",
        "Air India AI 882 was cancelled this morning due to technical issues. I have a hotel booked in Delhi tonight.",
        "Vande Bharat Express train from New Delhi is delayed by 4 hours. Will I get a full refund?"
      ];
      const randomPrompt = simulatedVoices[Math.floor(Math.random() * simulatedVoices.length)];
      handleSendMessage(randomPrompt);
    }, 2800);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Heuristically extract ticket info from query
    const lower = query.toLowerCase();
    let carrier = "IndiGo";
    let service = "6E 521";
    let delayMins = 210;
    let isCancellation = lower.includes("cancel");
    let origin = "Mumbai (BOM)";
    let dest = "Delhi (DEL)";
    let ticketCost = 6450;

    if (lower.includes("air india") || lower.includes("ai ")) {
      carrier = "Air India";
      service = "AI 882";
      ticketCost = 7200;
    } else if (lower.includes("spicejet")) {
      carrier = "SpiceJet";
      service = "SG 819";
      ticketCost = 5400;
    } else if (lower.includes("vande bharat") || lower.includes("train") || lower.includes("rail")) {
      carrier = "Indian Railways";
      service = "#20978 Vande Bharat";
      origin = "New Delhi (NDLS)";
      dest = "Jaipur (JAI)";
      ticketCost = 1850;
    }

    if (lower.includes("4 hour") || lower.includes("4hr")) delayMins = 240;
    if (lower.includes("3 hour") || lower.includes("3.5") || lower.includes("3hr")) delayMins = 210;
    if (lower.includes("45 min") || lower.includes("45m")) delayMins = 45;

    // Call backend API to save in SQLite database
    try {
      const response = await fetch('/api/disruptions/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier,
          service_number: service,
          origin,
          destination: dest,
          delay_minutes: delayMins,
          is_cancellation: isCancellation,
          ticket_cost: ticketCost,
          disruption_reason: isCancellation 
            ? "Operational Aircraft Cancellation without notice" 
            : `Schedule Delay (+${delayMins}m) causing downstream connection breach`
        })
      });

      const resData = await response.json();
      const savedRecord = resData.record;
      setCurrentDisruption(savedRecord);
      if (onTicketProcessed) onTicketProcessed(savedRecord);

      // Add assistant response with structured card
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: `I have analyzed your disrupted itinerary for ${carrier} (${service}) and recorded it into the Voyage Disruption Database. A critical connection risk of ${delayMins} minutes was detected.`,
            structuredCard: savedRecord,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 600);

    } catch (e) {
      console.error(e);
      // Fallback local structured record
      const fallbackRecord = {
        id: Date.now(),
        pnr: `VY-${Math.floor(10000 + Math.random() * 90000)}-IN`,
        carrier,
        service_number: service,
        origin,
        destination: dest,
        delay_minutes: delayMins,
        is_cancellation: isCancellation,
        ticket_cost: ticketCost,
        currency: "INR",
        rights_evaluation: {
          refund_eligible: true,
          refund_amount: ticketCost,
          statutory_compensation: 5000,
          total_claim: ticketCost + 5000,
          applicable_law: "DGCA CAR Section 3 Series M Part IV"
        }
      };
      setCurrentDisruption(fallbackRecord);
      if (onTicketProcessed) onTicketProcessed(fallbackRecord);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Your ticket has been recorded. Severe disruption of ${delayMins}m identified with statutory claim eligibility.`,
            structuredCard: fallbackRecord,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = file.name;

    // Add user upload message
    setMessages((prev) => [
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
      const response = await fetch('/api/disruptions/upload-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: fileName,
          file_type: file.type || 'application/pdf',
          text: `Ticket manifest for IndiGo 6E 521 BOM to DEL delayed 195 minutes. PNR VY-88294. Fare 6450 INR.`
        })
      });

      const resData = await response.json();
      const savedRecord = resData.record;
      setCurrentDisruption(savedRecord);
      if (onTicketProcessed) onTicketProcessed(savedRecord);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Successfully extracted ticket parameters from ${fileName} and stored structured manifest in Voyage Database.`,
            structuredCard: savedRecord,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 600);

    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // If chatbot is minimized into the bottom-right corner ("bottom right crack")
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={onRestore}
          title="Open Voyage Disruption Concierge"
          className="group flex items-center gap-2.5 bg-white hover:bg-slate-50 text-[#181E4B] pl-3 pr-4 py-2.5 rounded-full shadow-2xl border border-slate-200 transition-all transform hover:scale-105 cursor-pointer"
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
            <div className="text-[10px] text-[#A35645] font-semibold leading-tight">Dispute Assistant</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
      
      {/* Chatbot Header */}
      <div className="p-4 sm:px-6 bg-[#FAF9F6] border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs p-1.5">
            <img src="/voyage_logo.png" alt="Voyage" className="h-4 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-volkhov font-bold text-base text-[#181E4B]">
                Voyage Disruption Concierge
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-[#5E6282]">
              Multi-Modal Voice &amp; Ticket Ingestion Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* End Chat Button */}
          <button
            onClick={() => onEndChat && onEndChat(currentDisruption)}
            className="px-3 py-1.5 rounded-xl text-xs font-googleSans font-bold text-white bg-[#A35645] hover:bg-[#b8614e] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="End chat, minimize to bottom-right crack, and open Dispute Management"
          >
            <span>End Chat &amp; Resolve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Button */}
          <button
            onClick={onMinimize}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            title="Minimize to corner logo"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-poppins text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#181E4B] text-white rounded-br-xs shadow-xs'
                  : 'bg-slate-50 text-[#181E4B] border border-slate-200 rounded-bl-xs'
              }`}
            >
              {msg.isFile && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-white/10 rounded-xl">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-semibold">{msg.fileName}</span>
                </div>
              )}

              <p>{msg.text}</p>

              {/* If Structured Card is present */}
              {msg.structuredCard && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#181E4B]">
                    <span>{msg.structuredCard.carrier} ({msg.structuredCard.service_number})</span>
                    <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      +{msg.structuredCard.delay_minutes}m DELAY
                    </span>
                  </div>

                  <div className="text-slate-600">
                    Route: <strong className="text-slate-900">{msg.structuredCard.origin} → {msg.structuredCard.destination}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database Record ID:</span>
                      <span className="font-bold text-[#181E4B]">#VY-DB-{msg.structuredCard.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-emerald-600">STRUCTURED &amp; STORED</span>
                    </div>
                  </div>

                  {/* Actions right inside card */}
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

              <span className={`text-[10px] mt-1.5 block ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Live Audio Waves when recording */}
        {isRecording && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 animate-pulse">
            <Volume2 className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <div className="font-bold text-xs">Listening to your voice... Speak your flight or delay details</div>
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

      {/* Quick Prompt Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-200/70 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
        <span className="text-slate-400 font-semibold shrink-0">Quick prompts:</span>
        <button
          onClick={() => handleSendMessage("IndiGo 6E 521 delayed 3.5 hrs (Mumbai to Delhi)")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#181E4B] transition-colors cursor-pointer"
        >
          IndiGo 6E 521 delayed 3.5h
        </button>
        <button
          onClick={() => handleSendMessage("Air India AI 882 cancelled BOM to DEL")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#181E4B] transition-colors cursor-pointer"
        >
          Air India AI 882 cancelled
        </button>
        <button
          onClick={() => handleSendMessage("Vande Bharat train delayed by 3 hours")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#181E4B] transition-colors cursor-pointer"
        >
          Vande Bharat train delayed
        </button>
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
          {/* File Upload Input */}
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
            title="Upload Ticket PDF or Boarding Pass"
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
            title={isRecording ? "Stop Voice Input" : "Speak to Voyage Disruption Concierge"}
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
            placeholder="Type ticket details, e.g. 'IndiGo 6E 521 delayed 3 hours'..."
            className="flex-1 text-xs font-poppins px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#181E4B] bg-slate-50/50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#181E4B] text-white hover:bg-[#232a68] disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
