// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "~/pr/personal/portfolio-website/portfolio-website main ❯ ls",
    "README.md  next-env.d.ts  node_modules  package-lock.json  postcss.config.mjs  src",
    "eslint.config.mjs  next.config.ts  out  package.json  public  tsconfig.json",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Terminal sections data
  const sections = {
    about: "Wasteland survivor, 28 yo, skilled in code crafting and digital scavenging",
    projects: "Vault-Tec Terminal Rebuild | Nuka-Cola Website | Radaway Dashboard",
    work: "Senior Dev at Vault-Tec (2074-2077) | Wasteland Freelancer (2077-Present)",
    education: "BS in Nuclear Coding - MIT Wasteland Campus",
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (command: string) => {
    const trimmed = command.trim().toLowerCase();
    let response = "";

    switch (trimmed) {
      case "about":
        response = sections.about;
        break;
      case "projects":
        response = sections.projects;
        break;
      case "work":
        response = sections.work;
        break;
      case "education":
        response = sections.education;
        break;
      case "clear":
        setHistory([]);
        return;
      case "ls":
        response = "about  projects  work  education";
        break;
      default:
        response = "Command not found. Try: ls, about, projects, work, education, clear";
    }

    setHistory([...history, `${getPrompt()} ${command}`, response]);
    setInput("");
  };

  const getPrompt = () => {
    return "~/pr/personal/portfolio-website/portfolio-website main ❯";
  };

  return (
    <div className="min-h-screen bg-[#1a3c34] font-mono text-[#00ff41] p-8 flex justify-center items-center">
      <div className="w-full max-w-3xl border-4 border-[#00ff41] rounded-lg bg-[#0f2a25] shadow-[0_0_20px_rgba(0,255,65,0.3)]">
        {/* Pip-Boy Header */}
        <div className="border-b-2 border-[#00ff41] p-2 flex justify-between bg-[#1a3c34]">
          <span className="text-lg tracking-wider">PIP-BOY 3000</span>
          <span className="text-sm">16:01:08</span>
        </div>

        {/* Terminal Content */}
        <div className="p-4 min-h-[400px] flex flex-col justify-between">
          <div className="space-y-2">
            {history.map((line, index) => (
              <div key={index} className="break-words">
                {line}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) handleCommand(input);
              }}
            >
              <span className="mr-2">{getPrompt()}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent outline-none text-[#00ff41] w-3/4 caret-[#00ff41]"
                autoFocus
              />
            </form>
          </div>
        </div>

        {/* Pip-Boy Footer */}
        <div className="border-t-2 border-[#00ff41] p-2 text-sm text-center bg-[#1a3c34]">
          VAULT-TEC INDUSTRIES © 2077
        </div>
      </div>
    </div>
  );
}