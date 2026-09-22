import React, { useMemo } from 'react';

interface KeyboardHeatmapProps {
    heatmapData: {
        problemKeys: Record<string, number>;
        missedKeys: Record<string, number>;
    } | undefined;
}

const KEYBOARD_ROWS = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    [' ']
];

const getKeyLabel = (key: string) => {
    if (key === ' ') return 'SPACE';
    return key.toUpperCase();
};

export default function KeyboardHeatmap({ heatmapData }: KeyboardHeatmapProps) {
    const maxValues = useMemo(() => {
        if (!heatmapData) return { missed: 0, problem: 0 };

        const maxMissed = Math.max(
            ...Object.values(heatmapData.missedKeys || {}),
            0
        );

        const maxProblem = Math.max(
            ...Object.values(heatmapData.problemKeys || {}),
            0
        );

        return {
            missed: maxMissed,
            problem: maxProblem
        };
    }, [heatmapData]);

    const activeMap = heatmapData?.missedKeys;
    const activeMax = maxValues.missed;

    const getIntensity = (val: number | undefined, maxVal: number) => {
        if (!val || maxVal === 0) return 0;

        return 0.15 + (val / maxVal) * 0.85;
    };

    return (
        <div style={{
            backgroundColor: '#11111B',
            padding: '24px',
            borderRadius: '12px'
        }}>
            <h3 style={{
                color: '#A6ACCD',
                margin: '0 0 24px 0'
            }}>
                Keyboard Heatmap
            </h3>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                overflowX: 'auto',
                paddingBottom: '10px'
            }}>
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            marginLeft: `${rowIndex * 15}px`
                        }}
                    >
                        {row.map(key => {
                            const count = activeMap?.[key] || 0;
                            const intensity = getIntensity(count, activeMax);

                            const rgb = '248, 113, 113';

                            return (
                                <div
                                    key={key}
                                    title={`Key: ${key === ' ' ? 'Space' : key}\nMissed: ${count} times`}
                                    style={{
                                        width: key === ' ' ? '300px' : '45px',
                                        height: '45px',
                                        backgroundColor:
                                            intensity > 0
                                                ? `rgba(${rgb}, ${intensity})`
                                                : '#1E1E2E',
                                        color:
                                            intensity > 0.5
                                                ? '#11111B'
                                                : '#A6ACCD',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        cursor: 'default',
                                        transition: 'background-color 0.3s ease',
                                        border: `1px solid ${
                                            intensity > 0
                                                ? `rgba(${rgb}, ${intensity})`
                                                : '#374151'
                                        }`,
                                        boxShadow:
                                            intensity > 0.4
                                                ? `0 0 10px rgba(${rgb}, ${intensity / 2})`
                                                : 'none'
                                    }}
                                >
                                    {getKeyLabel(key)}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}