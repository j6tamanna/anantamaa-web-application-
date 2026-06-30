/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Shirt, ChevronRight } from 'lucide-react';
import { Message, Product } from '../types';

interface AIStylistProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function AIStylist({ products, onSelectProduct }: AIStylistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'stylist',
      text: "Namaste! I am Ananya, your Personal Heritage Stylist at ANANTAMAA. It is a pleasure to guide you today.\n\nWhether you are looking for an exquisite Pakistani Suit for a wedding, a comfortable mulmul Kurti Set for daytime elegance, or custom outfit styling for an upcoming occasion, I am here to assist.\n\nWhat are you dressing for today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Create chat history for context
      const chatHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      // 2. Call server-side API proxy
      const response = await fetch('/api/ai-stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory: chatHistory.slice(-10) // Limit context
        }),
      });

      if (!response.ok) {
        throw new Error('Stylist is currently preparing matching fabrics...');
      }

      const data = await response.json();

      const stylistMsg: Message = {
        id: `stylist-${Date.now()}`,
        sender: 'stylist',
        text: data.text || "I apologize, but I am momentarily studying our latest textiles. Could you repeat that?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: data.recommendedProductIds || []
      };

      setMessages((prev) => [...prev, stylistMsg]);
    } catch (error) {
      console.error('Error contacting stylist API:', error);
      // Friendly fallback message
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'stylist',
        text: "I am having difficulty retrieving our master fabric catalogs at the moment. Let me recommend our exquisite signature line: our **Gilded Noor Organza Anarkali Set** (₹7,999) features outstanding hand-embroidered details perfect for any premium event.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: ['an-001']
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const samplePrompts = [
    'Recommend a suit for a daytime garden wedding.',
    'What do you recommend in soft blush pink?',
    'Show me comfortable cotton co-ord sets.',
    'Do you have raw silk pieces for festive dinners?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="ai-stylist-widget">
      {/* 1. Expandable Floating Stylist Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-brand-charcoal to-brand-taupe hover:from-brand-taupe hover:to-brand-charcoal text-white shadow-2xl p-4 rounded-full flex items-center justify-center space-x-2 transition-luxury group scale-100 hover:scale-105"
          id="stylist-open-btn"
        >
          <Sparkles className="w-5 h-5 text-brand-dusty animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-sans font-medium uppercase tracking-widest whitespace-nowrap">
            Ask AI Stylist
          </span>
        </button>
      )}

      {/* 2. Stylist Chat Panel Drawer */}
      {isOpen && (
        <div
          className="glass-panel backdrop-blur-2xl w-[92vw] sm:w-[420px] h-[80vh] max-h-[640px] rounded-2xl shadow-3xl border border-white/20 flex flex-col overflow-hidden animate-slideUp text-brand-charcoal"
          id="stylist-drawer-panel"
        >
          {/* Header */}
          <div className="bg-brand-charcoal text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-brand-dusty/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-dusty" />
              </div>
              <div>
                <h4 className="font-serif text-sm tracking-wider font-semibold">Ananya</h4>
                <p className="text-[9px] text-brand-dusty/80 uppercase tracking-widest">Heritage Fashion Stylist</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1"
              id="stylist-close-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-transparent" id="stylist-chat-timeline">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name */}
                  <span className="text-[9px] text-brand-taupe/70 uppercase tracking-wider mb-1 font-mono px-1">
                    {isUser ? 'You' : 'Ananya • Senior Stylist'}
                  </span>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-brand-dusty text-white rounded-tr-none shadow-sm'
                        : 'bg-white/40 backdrop-blur-sm text-brand-charcoal border border-white/30 rounded-tl-none font-serif font-light'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Dynamic Product Recommendations in Chat */}
                  {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2 pl-2">
                      <p className="text-[10px] tracking-wider text-brand-dusty font-sans uppercase font-medium flex items-center space-x-1">
                        <Shirt className="w-3 h-3" />
                        <span>Recommended Apparel</span>
                      </p>
                      <div className="flex flex-col gap-2">
                        {msg.recommendedProductIds.map((id) => {
                          const matchedProd = products.find((p) => p.id === id);
                          if (!matchedProd) return null;
                          return (
                            <div
                              key={id}
                              onClick={() => {
                                onSelectProduct(matchedProd);
                                setIsOpen(false); // Close drawer to focus on product
                              }}
                              className="flex items-center space-x-3 p-2 bg-white/35 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/60 hover:border-brand-dusty/40 cursor-pointer transition-luxury duration-200 shadow-sm"
                            >
                              <img
                                src={matchedProd.images[0]}
                                alt={matchedProd.name}
                                className="w-10 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-serif text-[11px] font-medium text-brand-charcoal truncate">
                                  {matchedProd.name}
                                </h5>
                                <p className="text-[10px] text-brand-taupe font-mono">
                                  ₹{matchedProd.price.toLocaleString()}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-brand-dusty shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Time Stamp */}
                  <span className="text-[8px] text-brand-taupe/50 mt-1 font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Simulated typing indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-brand-taupe/70 uppercase tracking-wider mb-1 font-mono">Ananya is matching fabrics...</span>
                <div className="bg-white/30 border border-white/25 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-brand-dusty rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-dusty rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-dusty rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions block */}
          {messages.length === 1 && (
            <div className="bg-transparent px-4 pb-3 pt-1 border-t border-white/10" id="quick-prompts-container">
              <p className="text-[9px] text-brand-taupe tracking-wider uppercase font-sans font-medium mb-1.5">Consultation Prompts:</p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPromptClick(prompt)}
                    className="text-[10px] text-brand-charcoal bg-white/30 border border-white/20 hover:bg-brand-rose/40 px-2.5 py-1 rounded-full transition-colors text-left font-sans"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field */}
          <div className="p-3 border-t border-white/10 bg-transparent" id="stylist-input-container">
            <div className="flex items-center bg-white/40 border border-white/30 rounded-full px-3.5 py-1.5">
              <input
                type="text"
                placeholder="Ask about fabrics, fits, styles..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
                disabled={isTyping}
                className="w-full bg-transparent text-xs text-brand-charcoal placeholder-brand-taupe/60 focus:outline-none"
                id="stylist-message-input"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={isTyping || !inputText.trim()}
                className="text-brand-taupe hover:text-brand-dusty disabled:text-brand-taupe/30 p-1 transition-luxury"
                aria-label="Send query"
                id="stylist-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
