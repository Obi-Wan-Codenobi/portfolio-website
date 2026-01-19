"use client";
import { useState, useEffect, useRef } from 'react';
import { getBrowser, getOS } from '@/util/getPersonalInfo';
import Menu from "@/components/menu-bar";
import Head from 'next/head';


export default function Home({ children }) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);


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

    }, []);


    return (
        <>
            <Head>
                <title>Pip-Boy Terminal Portfolio</title>
                <meta name="description" content="Personal portfolio terminal" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="h-screen w-screen bg-black font-mono flex items-center justify-center p-0">
                <div className="terminal-container w-[calc(90%)] h-[calc(90%)]  rounded-lg shadow-[0_0_80px_rgba(46,204,113,0.2)] p-2 relative overflow-hidden">

                    {/* Terminal Screen */}
                    <div ref={terminalRef} className="w-full h-[calc(100%)]  text-[#2ecc71] rounded-lg shadow-[0_0_10px_rgba(46,204,113,0.3)]  p-5 overflow-y-auto relative z-0">
                        <div className="relative min-h-full">
                            <div className="terminal-content">
                                {children}

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