"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const directories = ['about', 'projects', 'work_experience', 'education'];

export default function Home() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([
        'PIP-BOY 3000 v1.2.3',
        'INITIALIZING VAULT-OS...',
        '> ls',
        ...directories.map(dir => `  ${dir}`),
    ]);
    const [currentDir, setCurrentDir] = useState('/'); // Simulate current directory
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const trimmedInput = input.trim();
            const [command, ...args] = trimmedInput.split(' ');
            const newOutput = [...output, `> ${trimmedInput}`];

            switch (command.toLowerCase()) {
                case 'ls':
                case 'dir': // Alias for ls
                    newOutput.push(...directories.map(dir => `  ${dir}`));
                    break;
                case 'ls -a':
                case 'la': // Alias for ls -a
                    newOutput.push(...directories.map(dir => `  ${dir}`), '  .vault-config  .status');
                    break;
                case 'cd':
                    if (args.length === 0) {
                        newOutput.push('  cd: missing directory');
                    } else if (directories.includes(args[0])) {
                        setCurrentDir(`/${args[0]}`);
                        newOutput.push(`  Directory changed to ${currentDir}${args[0]}`);
                    } else if (args[0] === '..') {
                        setCurrentDir('/');
                        newOutput.push('  Directory changed to /');
                    } else {
                        newOutput.push(`  cd: ${args[0]}: No such directory`);
                    }
                    break;
                case 'pwd':
                    newOutput.push(`  ${currentDir}`);
                    break;
                case 'cat':
                    if (args.length === 0) {
                        newOutput.push('  cat: missing file');
                    } else if (directories.includes(args[0])) {
                        switch (args[0]) {
                            case 'about':
                                newOutput.push(
                                    '  Name: [Your Name]',
                                    '  Status: Vault Dweller',
                                    '  Skills: Next.js, Tailwind, TypeScript'
                                );
                                break;
                            case 'projects':
                                newOutput.push(
                                    '  1. Pip-Boy Portfolio - Interactive terminal',
                                    '  2. Vault-Tec DB - Secure data system'
                                );
                                break;
                            case 'work_experience':
                                newOutput.push(
                                    '  Vault-Tec Corp - Lead Terminal Engineer'
                                );
                                break;
                            case 'education':
                                newOutput.push(
                                    '  Vault-Tec University - B.S. Nuclear Computing'
                                );
                                break;
                        }
                    } else {
                        newOutput.push(`  cat: ${args[0]}: No such file`);
                    }
                    break;
                case 'clear':
                case 'cls':
                    setOutput(['PIP-BOY 3000 v1.2.3', 'INITIALIZING VAULT-OS...']);
                    setInput('');
                    return;
                case 'help':
                    newOutput.push(
                        '  Available commands:',
                        '    ls/dir - List directories',
                        '    ls -a/la - List all (including hidden)',
                        '    cd <dir> - Change directory',
                        '    pwd - Print working directory',
                        '    cat <file> - Display file contents',
                        '    clear/cls - Clear terminal',
                        '    help - Show this message'
                    );
                    break;
                case '':
                    break; // Ignore empty input
                default:
                    newOutput.push(`  ${command}: Command not found. Type "help" for commands.`);
            }

            setOutput(newOutput);
            setInput('');
        }
    };

    return (
        <>
            <Head>
                <title>Pip-Boy Terminal Portfolio</title>
                <meta name="description" content="Personal portfolio terminal" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="h-screen w-screen bg-black font-mono flex items-center justify-center p-0">
                <div className="terminal-container w-[calc(50%)] h-[calc(90%)]  rounded-lg shadow-[0_0_80px_rgba(46,204,113,0.2)] p-2 relative overflow-hidden">

                    {/* Terminal Screen */}
                    <div className="w-full h-[calc(100%)]  text-[#2ecc71] rounded-lg shadow-[0_0_10px_rgba(46,204,113,0.3)]  p-5 overflow-y-auto relative z-0">
                        <div className="relative min-h-full">
                            <div className="terminal-content">
                                {/* Text Content */}
                                {output.map((line, index) => (
                                    <div key={index} className="leading-relaxed">
                                        {line}
                                    </div>
                                ))}

                                {/* Input Area */}
                                <div className="w-full mt-2 flex items-center relative z-20 ">
                                    <span className="text-[#2ecc71]">{currentDir} > </span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleInput}
                                        className="flex-1 bg-transparent text-[#2ecc71] outline-none ml-2 caret-[#2ecc71]"
                                        placeholder="Type a command..."
                                    />
                                </div>
                            </div>


                            {/* Static Overlay - Over the text */}
                            <div className="absolute inset-0 screen-effects pointer-events-none z-10" />

                            {/* Scan Line Element */}
                            <div className="scan-line"></div>

                            {/* SVG Filters */}
                            
                            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                                <defs>
                                    {/* Existing barrel distortion */}
                                    <filter id="barrel-distortion">
                                        <feDisplacementMap
                                            in="SourceGraphic"
                                            scale="7"
                                            xChannelSelector="R"
                                            yChannelSelector="G"
                                        >
                                            <feImage
                                                xlinkHref="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZGllbnQiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+CiAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSJyZ2IoMjU1LCAwLCAwKSIvPgogICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSJyZ2IoMCwgMCwgMCkiLz4KICA8L3JhZGlhbEdyYWRpZW50PgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+Cjwvc3ZnPg=="
                                                width="100%"
                                                height="100%"
                                            />
                                        </feDisplacementMap>
                                    </filter>
                                    {/* wavy warp filter */}
                                    <filter id="scan-warp">

                                        <feTurbulence
                                            type="turbulence"
                                            baseFrequency="0.05"
                                            numOctaves="0.5"
                                            result="warp"
                                        >
                                            <animate
                                                attributeName="baseFrequency"
                                                from="0.05"
                                                to="0.1"
                                                dur="7s"
                                                repeatCount="indefinite"
                                                calcMode="linear"
                                            />
                                        </feTurbulence>
                                        <feDisplacementMap
                                            in="SourceGraphic"
                                            in2="warp"
                                            scale="5"
                                            xChannelSelector="G"
                                            yChannelSelector="G"
                                        >
                                            <animate
                                                attributeName="scale"
                                                values="0;0;2;-0.5;1;0;0;-2;0;0"
                                                dur="7s"
                                                repeatCount="indefinite"
                                                calcMode="linear"
                                                keyTimes="0;0.1;0.15;0.2;0.225;0.25;0.7;0.725;0.75;1"
                                            />
                                        </feDisplacementMap>

                                    </filter>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}