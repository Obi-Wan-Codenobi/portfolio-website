"use client";
import { useState, useEffect, useRef } from 'react';
import { getBrowser, getOS } from '@/util/getPersonalInfo'
import Tree from '@/components/tree'
import Head from 'next/head';
import { FileTree } from '@/components/filesystem';

// const directories = ['about', 'projects', 'work_experience', 'education'];
// const files = ['.vault-config', '.status']; // Define known files

export default function Home() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([
        'PIP-BOY 3000 v1.2.3',
        'INITIALIZING VAULT-OS...'
    ]);
    const [fileTree] = useState<FileTree>(() => {
        const tree = new FileTree();
        // Initialize directory structure
        tree.addNode('about', true, null, 'About section');
        tree.addNode('projects', true, null, 'Projects section');
        tree.addNode('work_experience', true, null, 'Work experience section');
        tree.addNode('education', true, null, 'Education section');
        tree.addNode('.vault-config', false, null, 'Vault configuration file');
        tree.addNode('.status', false, null, 'System status file');
        tree.navigate('/about');
        tree.addNode('info.txt', false, null, [
            'Name: [Your Name]',
            'Status: Vault Dweller',
            'Skills: Next.js, Tailwind, TypeScript',
        ].join('\n'));

        // Navigate to 'projects' and add list.txt
        tree.navigate('/projects');
        tree.addNode('list.txt', false, null, [
            '1. Pip-Boy Portfolio - Interactive terminal',
            '2. Vault-Tec DB - Secure data system',
        ].join('\n'));

        // Navigate to 'work_experience' and add history.txt
        tree.navigate('/work_experience');
        tree.addNode('history.txt', false, null, [
            'Vault-Tec Corp - Lead Terminal Engineer',
        ].join('\n'));

        // Navigate to 'education' and add degree.txt
        tree.navigate('/education');
        tree.addNode('degree.txt', false, null, [
            'Vault-Tec University - B.S. Nuclear Computing',
        ].join('\n'));

        // Reset to root directory
        tree.navigate('/');
        return tree;
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    const customizedUserGreeting = () => {
        const greeting = `ACCESSING VIA ${getBrowser()} ON ${getOS()}`;
        setOutput(prev => [
            ...prev,
            greeting,
            'WELCOME HOME vault dweller',
            `Type 'help' for assistance`
        ]);
    }
    useEffect(() => {
        customizedUserGreeting();
        setOutput(prev => [
            ...prev,
            '> ls',
            ...fileTree.listDirectory()
                .filter((item) => !item.name.startsWith('.'))
                .map((item) => `  ${item.name}`),
            
        ]);
        inputRef.current?.focus();
    }, []);

    // Scroll to bottom when output changes and reposition scan line when screen changes
    useEffect(() => {

        if (!styleRef.current) {
            styleRef.current = document.createElement('style');
            document.head.appendChild(styleRef.current);
        }

        const updateScanLineKeyframes = () => {
            if (terminalRef.current && styleRef.current) {
                const scrollTop = terminalRef.current.scrollTop;
                const clientHeight = terminalRef.current.clientHeight;
                const startPos = scrollTop - 60;
                const endPos = scrollTop + clientHeight;

                // Update keyframes with pixel values
                styleRef.current.innerHTML = `
                    @keyframes largeScan {
                        0% { top: ${startPos}px; }
                        100% { top: ${endPos}px; }
                    }
                `;

                // Set duration based on visible height
                const baseDuration = 5; // Base duration for 500px visible height
                const referenceHeight = 500; // Reference visible height
                const currentHeight = clientHeight;
                const newDuration = (currentHeight / referenceHeight) * baseDuration;
                console.log('Scan duration:', newDuration, 'clientHeight:', currentHeight, 'scrollTop:', scrollTop); // Debug
                terminalRef.current.style.setProperty('--scan-duration', `${newDuration}s`);
            }
        };

        const scrollToBottom = () => {
            if (terminalRef.current) {
                // Scroll to the bottom, accounting for visible height
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight - terminalRef.current.clientHeight;
            }
            updateScanLineKeyframes();
        };
        setTimeout(scrollToBottom, 10);

        const handleScroll = () => {
            updateScanLineKeyframes();
        };

        terminalRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            terminalRef.current?.removeEventListener('scroll', handleScroll);
            if (styleRef.current) {
                document.head.removeChild(styleRef.current);
                styleRef.current = null;
            }
        };

    }, [output]);

    const handleInput = (e: React.KeyboardEvent<HTMLInputElement> | string) => {
        let trimmedInput: string;
        if (typeof e === 'string') {
            trimmedInput = e.trim();
        } else if (e.key === 'Enter') {
            trimmedInput = input.trim();
        } else {
            return;
        }

        const [command, ...args] = trimmedInput.split(' ');
        const newOutput = [...output, `> ${trimmedInput}`];

        switch (command.toLowerCase()) {
            case 'ls':
            case 'dir':
                newOutput.push(
                    ...fileTree
                        .listDirectory()
                        .filter((item) => !item.name.startsWith('.'))
                        .map((item) => `  ${item.name}`)
                );
                break;
            case 'ls -a':
            case 'la':
                newOutput.push(...fileTree.listDirectory().map((item) => `  ${item.name}`));
                break;
            case 'cd':
                if (args.length === 0) {
                    newOutput.push('  cd: missing directory');
                } else {
                    const success = fileTree.navigate(args[0]);
                    if (success) {
                        newOutput.push(`  Directory changed to ${fileTree.getCurrentPath()}`);
                    } else {
                        newOutput.push(`  cd: ${args[0]}: No such directory`);
                    }
                }
                break;
            case 'pwd':
                newOutput.push(`  ${fileTree.getCurrentPath()}`);
                break;
            case 'cat':
                if (args.length === 0) {
                    newOutput.push('  cat: missing file');
                } else {
                    const nodeInfo = fileTree.getNodeInfo(args[0]);
                    if (nodeInfo && !nodeInfo.isDirectory && nodeInfo.content) {
                        newOutput.push(...nodeInfo.content.split('\n').map((line) => `  ${line}`));
                    } else {
                        newOutput.push(`  cat: ${args[0]}: No such file or directory`);
                    }
                }
                break;
            case 'echo':
                if (args.length === 0) {
                    newOutput.push('  echo: missing file');
                } else {
                    const nodeInfo = fileTree.getNodeInfo(args[0]);
                    if (nodeInfo) {
                        newOutput.push(`  ECHO: ${nodeInfo.name}`);
                    } else {
                        newOutput.push(`  echo: ${args[0]}: No such file`);
                    }
                }
                break;
            case 'clear':
            case 'cls':
                setOutput(['PIP-BOY 3000 v1.2.3', 'INITIALIZING VAULT-OS...']);
                customizedUserGreeting();
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
                    '    echo <file> - Echo file name',
                    '    clear/cls - Clear terminal',
                    '    help - Show this message'
                );
                break;
            case '':
                break;
            default:
                newOutput.push(`  ${command}: Command not found. Type "help" for commands.`);
        }

        setOutput(newOutput);
        setInput('');
        inputRef.current?.focus();
    };


    const handleLineClick = (line: string) => {
        const trimmedLine = line.trim();
        const nodeInfo = fileTree.getNodeInfo(trimmedLine);
        if (nodeInfo) {
            if (nodeInfo.isDirectory) {
                handleInput(`cd ${trimmedLine}`);
                handleInput('la');
            } else {
                handleInput(`cat ${trimmedLine}`);
            }
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
                    <div ref={terminalRef} className="w-full h-[calc(100%)]  text-[#2ecc71] rounded-lg shadow-[0_0_10px_rgba(46,204,113,0.3)]  p-5 overflow-y-auto relative z-0">
                        <div className="relative min-h-full">
                            <div className="terminal-content">
                                {/* Text Content */}
                                {output.map((line, index) => (
                                    <div
                                        key={index}
                                        className={`leading-relaxed ${fileTree.getNodeInfo(line.trim())
                                            ? 'cursor-pointer hover:font-bold hover:text-[#4ade80] hover:[text-shadow:0_0_8px_rgba(46,204,113,0.6)]'
                                            : ''
                                            }`}
                                        onClick={() => handleLineClick(line)}
                                    >
                                        {line}
                                    </div>
                                ))}

                                {/* Input Area */}
                                <div className="w-full mt-2 flex items-center relative z-20 ">
                                    <span className="text-[#2ecc71]">{fileTree.getCurrentPath()} > </span>
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

                            {/* Grain element */}
                            <div className="grain-overlay"></div>

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