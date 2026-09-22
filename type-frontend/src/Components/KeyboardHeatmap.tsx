import React from 'react';

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
                        {row.map(key => (
                            <div
                                key={key}
                                style={{
                                    width: key === ' ' ? '300px' : '45px',
                                    height: '45px',
                                    backgroundColor: '#1E1E2E',
                                    color: '#A6ACCD',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    border: '1px solid #374151'
                                }}
                            >
                                {getKeyLabel(key)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}