import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'KOUDOUS 2.0 - Pioneer in Data Science & System Architecture';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 60,
                    background: 'linear-gradient(to bottom right, #000000, #111111)',
                    color: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    borderTop: '16px solid #FF7F11', // koudous-primary
                    borderBottom: '16px solid #43C6AC', // koudous-secondary
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                    <div
                        style={{
                            width: 160,
                            height: 160,
                            borderRadius: 80,
                            background: 'linear-gradient(to bottom right, #FF7F11, #43C6AC)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 40,
                        }}
                    >
                        <span style={{ fontSize: 80, fontWeight: 'bold', color: 'black' }}>K</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.05em' }}>KOUDOUS<span style={{ color: '#FF7F11' }}>.</span></span>
                        <span style={{ fontSize: 32, color: '#A0A0A0', letterSpacing: '0.1em', marginTop: 10, textTransform: 'uppercase' }}>Data Science & System Architecture</span>
                    </div>
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
