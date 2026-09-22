import React, { useState, useMemo } from 'react';

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
    const [mode, setMode] = useState<'missed' | 'problem'>('missed');

    const maxValues = useMemo(() => {
        if (!heatmapData) return { missed: 0, problem: 0 };
        
        const maxMissed = Math.max(...Object.values(heatmapData.missedKeys || {}), 0);
        const maxProblem = Math.max(...Object.values(heatmapData.problemKeys || {}), 0);
        
        return { missed: maxMissed, problem: maxProblem };
    }, [heatmapData]);

    const activeMap = mode === 'missed' ? heatmapData?.missedKeys : heatmapData?.problemKeys;
    const activeMax = mode === 'missed' ? maxValues.missed : maxValues.problem;

    const getIntensity = (val: number | undefined, maxVal: number) => {
        if (!val || maxVal === 0) return 0;
        // Map to a scale of 0.1 to 1.0 (so even 1 error is slightly visible)
        return 0.15 + (val / maxVal) * 0.85;
    };

    return (
        <div style={{ backgroundColor: '#11111B', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h3 style={{ color: '#A6ACCD', margin: '0 0 8px 0' }}>Keyboard Heatmap</h3>
                    <p style={{ color: '#6B7280', margin: 0, fontSize: '0.85rem' }}>
                        {mode === 'missed' 
                            ? "Keys you frequently mistype (Accuracy)." 
                            : "Keys that cause you to pause or hesitate (Fluency)."}
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#1E1E2E', padding: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => setMode('missed')}
                        style={{
                            backgroundColor: mode === 'missed' ? '#F87171' : 'transparent',
                            color: mode === 'missed' ? '#11111B' : '#A6ACCD',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: mode === 'missed' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        Accuracy
                    </button>
                    <button
                        onClick={() => setMode('problem')}
                        style={{
                            backgroundColor: mode === 'problem' ? '#F59E0B' : 'transparent',
                            color: mode === 'problem' ? '#11111B' : '#A6ACCD',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: mode === 'problem' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        Fluency
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '10px' }}>
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', gap: '8px', marginLeft: `${rowIndex * 15}px` }}>
                        {row.map(key => {
                            const count = activeMap?.[key] || 0;
                            const intensity = getIntensity(count, activeMax);
                            
                            // Base color depends on mode (Red for missed, Orange for problem)
                            const rgb = mode === 'missed' ? '248, 113, 113' : '245, 158, 11';
                            
                            return (
                                <div
                                    key={key}
                                    title={`Key: ${key === ' ' ? 'Space' : key}\n${mode === 'missed' ? 'Missed' : 'Hesitated'}: ${count} times`}
                                    style={{
                                        width: key === ' ' ? '300px' : '45px',
                                        height: '45px',
                                        backgroundColor: intensity > 0 ? `rgba(${rgb}, ${intensity})` : '#1E1E2E',
                                        color: intensity > 0.5 ? '#11111B' : '#A6ACCD',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        cursor: 'default',
                                        transition: 'background-color 0.3s ease',
                                        border: `1px solid ${intensity > 0 ? `rgba(${rgb}, ${intensity})` : '#374151'}`,
                                        boxShadow: intensity > 0.4 ? `0 0 10px rgba(${rgb}, ${intensity / 2})` : 'none'
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