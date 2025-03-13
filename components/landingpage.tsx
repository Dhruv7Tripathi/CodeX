"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { useSession } from "next-auth/react";
import UserAccountNav from "./userAccountNav";
import SignInButton from "./SignInButton";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { projectOptions } from '@/contant';

const LandingPage = () => {
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [promptText, setPromptText] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setPromptText("");
  }, []);

  const handleGenerateCode = () => {
    if (!session?.user) return;
    if (promptText.trim()) {
      router.push(`/dashboard?prompt=${encodeURIComponent(promptText)}`);
    }
  };

  const handleOptionClick = (href: string) => {
    if (!session?.user) return;
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="fixed w-full top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            CodeX.ai
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-gray-400 hover:text-white transition-all hover:scale-105">
              {status === "loading" ? null : session?.user ? (
                <UserAccountNav user={session.user} />
              ) : (
                <SignInButton text={"Sign In"} />
              )}
            </div>
            {session?.user && (
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-md transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="pt-32 pb-16 px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              What do you want to build?
            </h1>
            <p className="text-gray-400 text-xl">
              Let CodeX.ai help you correct your code effortlessly.
            </p>
          </div>
          <div
            className={`relative bg-gray-800/50 rounded-xl p-4 mb-12 backdrop-blur-sm border transition-all duration-300 ${textareaFocused ? 'border-blue-500/50 shadow-lg shadow-blue-500/25' : 'border-gray-700'
              }`}
          >
            <div className="flex flex-col gap-3">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="How can CodeX.ai help you today? Describe your code..."
                className="w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-300 placeholder-gray-500"
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
              />
              <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                <div className="flex gap-2 text-sm text-gray-500">
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Tab</kbd>
                  <span>to autocomplete</span>
                </div>
                {session?.user ? (
                  <button
                    onClick={handleGenerateCode}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-all hover:scale-105 text-sm flex items-center gap-2"
                  >
                    Generate code
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <SignInButton text="Sign in to generate" />
                )}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {projectOptions.map((option) => (
              <div
                key={option.title}
                onClick={() => handleOptionClick(option.href)}
                className="group relative p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {option.title}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
                <div className={`absolute inset-x-0 bottom-0 h-1 rounded-b-xl bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 text-center">
            © 2025 CodeX.ai
          </div>
          <div className="flex gap-4">
            <Github className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
            <Linkedin className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
            <Twitter className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;