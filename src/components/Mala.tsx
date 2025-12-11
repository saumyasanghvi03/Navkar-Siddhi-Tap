"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const RADIUS = 140; // Radius of the circle
const BEAD_RADIUS = 8; // Radius of each bead
const MERU_BEAD_RADIUS = 12; // Radius of the larger 'meru' bead

export function Mala({ count, beadColor = 'hsl(var(--primary))', totalBeads = 108 }: { count: number; beadColor?: string, totalBeads?: number }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Render a placeholder or nothing on the server to avoid hydration mismatch
        return <div className="relative w-full h-full flex items-center justify-center pointer-events-none opacity-0" aria-hidden="true"></div>;
    }

    const filledCount = count > 0 ? count % totalBeads : 0;
    const displayCount = (count > 0 && count % totalBeads === 0) ? totalBeads : filledCount;
    const isComplete = displayCount === totalBeads;

    const beads = [];
    for (let i = 0; i < totalBeads; i++) {
        const angle = (i / totalBeads) * 2 * Math.PI - Math.PI / 2;
        const x = RADIUS * Math.cos(angle);
        const y = RADIUS * Math.sin(angle);
        beads.push({ x, y });
    }

    // Meru bead position
    const meruAngle = -Math.PI / 2;
    const meruX = (RADIUS + MERU_BEAD_RADIUS + 10) * Math.cos(meruAngle);
    const meruY = (RADIUS + MERU_BEAD_RADIUS + 10) * Math.sin(meruAngle);

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <svg
                viewBox={`-${RADIUS + 30} -${RADIUS + 30} ${2 * (RADIUS + 30)} ${2 * (RADIUS + 30)}`}
                className="w-full h-auto max-w-[80vmin] max-h-[80vmin] opacity-20"
                style={{
                    filter: isComplete ? `drop-shadow(0 0 20px ${beadColor})` : 'none',
                    transition: 'filter 500ms ease-in-out'
                }}
            >
                <g>
                    {/* Meru Bead */}
                    <circle
                        cx={meruX}
                        cy={meruY}
                        r={MERU_BEAD_RADIUS}
                        fill={beadColor}
                        stroke="hsla(var(--foreground), 0.3)"
                        strokeWidth="2"
                    />

                    {/* Beads */}
                    {beads.map((bead, i) => {
                        const isFilled = i < displayCount;
                        return (
                            <circle
                                key={i}
                                cx={bead.x}
                                cy={bead.y}
                                r={BEAD_RADIUS}
                                fill={isFilled ? beadColor : 'hsla(var(--foreground), 0.1)'}
                                stroke={isFilled ? 'hsla(var(--foreground), 0.3)' : 'hsla(var(--foreground), 0.2)'}
                                strokeWidth="1"
                                className="transition-all duration-300"
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
