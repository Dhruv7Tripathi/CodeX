"use client"
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, ArrowRight, Loader2, Code, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatSidebar } from '@/components/ChatSideBar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface Chat {
  id: string;
  title: string;
  input: string;
  response: string;
  createdAt: Date;
}

const SearchParamsHandler = ({ setInput }: { setInput: (input: string) => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setInput(decodeURIComponent(promptParam));
    }
  }, [searchParams, setInput]);

  return null;
};

const DashboardPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isCodeResponse, setIsCodeResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [animatedResponse, setAnimatedResponse] = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  const detectIfCodeQuery = (text: string) => {
    const codeKeywords = [
      'code', 'function', 'bug', 'error', 'fix', 'debug',
      'implement', 'programming', 'syntax', 'correct'
    ];
    return codeKeywords.some(keyword =>
      text.toLowerCase().includes(keyword)
    );
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/chat/${session?.user?.id}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    if (session?.user) {
      fetchChatHistory();
    }
  }, [session]);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  const animateResponse = (text: string) => {
    let currentIndex = 0;
    setAnimatedResponse('');

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setAnimatedResponse(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 20);
  };

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setAnimatedResponse('');
    try {
      const geminiResponse = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({ prompt: input }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!geminiResponse.ok) {
        throw new Error(`HTTP error! status: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      const responseText = geminiData.response || geminiData.content || '';

      setIsCodeResponse(detectIfCodeQuery(input));
      setResponse(responseText);
      animateResponse(responseText);

      const chatResponse = await axios.post('/api/chat', {
        userId: session?.user?.id,
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        input,
        response: responseText,
      });
      setChatHistory(prevChats => [chatResponse.data, ...prevChats]);
      setActiveChat(chatResponse.data.id);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate response. Please try again.';
      setResponse(errorMessage);
      setAnimatedResponse(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    setActiveChat(null);
    setInput('');
    setResponse('');
    setAnimatedResponse('');
    setIsCodeResponse(false);
  };

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat.id);
    setInput(chat.input);
    setResponse(chat.response);
    setAnimatedResponse(chat.response);
    setIsCodeResponse(detectIfCodeQuery(chat.input));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Suspense fallback={null}>
        <SearchParamsHandler setInput={setInput} />
      </Suspense>
      <ChatSidebar
        chats={chatHistory}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleChatSelect}
      />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-900/20 to-black"></div>
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              AI Assistant
            </h1>
            <p className="text-gray-400">
              Ask questions, get code help, or general assistance.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-gray-300 font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Your Question
              </h2>
            </div>

            <div className="flex items-end p-4 gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything... For code-related questions, Fixly.ai will help you to code"
                className="w-full bg-transparent p-4 outline-none resize-none min-h-[150px] text-gray-300 placeholder-gray-500 border border-gray-700 rounded-lg"
              />

              <button
                onClick={handleSubmit}
                disabled={isProcessing || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition-all hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
          <AnimatePresence>
            <motion.div
              ref={responseRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden backdrop-blur-sm"
            >
              <div className="border-b border-gray-700 p-4 flex justify-between items-center">
                <h2 className="text-gray-300 font-medium flex items-center gap-2">
                  {isCodeResponse ? (
                    <>
                      <Code className="w-4 h-4" />
                      Code Response
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Response
                    </>
                  )}
                </h2>
                {response && (
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="p-4 min-h-[300px]">
                {isProcessing ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : response ? (
                  isCodeResponse ? (
                    <Editor
                      height="400px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={animatedResponse || response}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                      }}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-gray-300 whitespace-pre-wrap"
                    >
                      {animatedResponse || response}
                    </motion.div>
                  )
                ) : (
                  <div className="text-gray-500 text-center py-10">
                    Your AI-generated response will appear here
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;