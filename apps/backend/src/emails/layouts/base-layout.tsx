import { Font, Head, Html, pixelBasedPreset, Tailwind } from '@react-email/components';
import { type ReactNode } from 'react';

type Props = {
    children: ReactNode
}

function BaseLayout({ children }: Props) {
    return <Html>
        <Head>
            <Font
                fontFamily="Inter"
                fallbackFontFamily="Helvetica"
                webFont={{
                    url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap",
                    format: "woff2",
                }}
                fontWeight={400}
                fontStyle="normal"
            />
        </Head>
        <Tailwind
            config={{
                presets: [pixelBasedPreset],
                theme: {
                    extend: {
                        fontFamily: {
                            inter: ['Inter','Helvetica','sans-serif']
                        }
                    }
                }
            }}
        >
            {children}
        </Tailwind>
    </Html>
}

export default BaseLayout;