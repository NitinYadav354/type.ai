interface StatCardProps {
    title: string;
    value: string | number;
    icon?: string;
    subtitle?: string;
}

export default function StatCard({ title, value, icon, subtitle }: StatCardProps) {
    return (
        <div style={{
            backgroundColor: '#11111B',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            flex: '1',
            minWidth: '150px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
                <span style={{ color: '#A6ACCD', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {title}
                </span>
            </div>
            <div style={{ color: '#818CF8', fontSize: '2.2rem', fontWeight: 700, lineHeight: '1' }}>
                {value}
            </div>
            {subtitle && (
                <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '8px' }}>
                    {subtitle}
                </div>
            )}
        </div>
    );
}
