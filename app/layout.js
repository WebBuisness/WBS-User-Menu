import './globals.css';
import { Inter, Bricolage_Grotesque, Noto_Kufi_Arabic } from 'next/font/google';
import GlobalWhatsApp from '@/components/GlobalWhatsApp';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata = {
  title: 'WBS Menu Demo — Serious taste, real flavor',
  description: 'Order authentic broasted, burgers and more. Serious taste, real flavor.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'WBS Menu Demo',
    description: 'Order authentic broasted, burgers and more. Serious taste, real flavor.',
    url: 'https://wbs-demo-menu.vercel.app',
    siteName: 'WBS Menu Demo',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WBS Menu Demo',
    description: 'Order authentic broasted, burgers and more. Serious taste, real flavor.',
    images: ['/icon.svg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WBS Menu Demo',
    startupImage: '/icon.svg',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${notoKufi.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://yphtacdbyljefbzaurlo.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://yphtacdbyljefbzaurlo.supabase.co" />
        {/* Preload the main LCP image if possible — typically the first fallback item */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1633321702518-7feccafb94d5%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26w%3D800%26q%3D85&w=640&q=75"
          imagesrcset="/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1633321702518-7feccafb94d5%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26w%3D800%26q%3D85&w=640&q=75 1x, /_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1633321702518-7feccafb94d5%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26w%3D800%26q%3D85&w=828&q=75 2x"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        {children}
        <GlobalWhatsApp />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful');
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
