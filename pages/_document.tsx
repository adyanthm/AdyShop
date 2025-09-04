import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon Configuration */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="AdyShop - Premium E-commerce Platform. Discover the latest iPhones, MacBooks, Nike shoes and more!" />
        <meta name="keywords" content="e-commerce, shopping, tech, fashion, smartphones, laptops, shoes, audio" />
        <meta name="author" content="Adyanth - AdyDesigner Apps" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AdyShop - Premium E-commerce Platform" />
        <meta property="og:description" content="Discover the latest iPhones, MacBooks, Nike shoes and more with AdyShop!" />
        <meta property="og:image" content="/favicon.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AdyShop - Premium E-commerce Platform" />
        <meta property="twitter:description" content="Discover the latest iPhones, MacBooks, Nike shoes and more with AdyShop!" />
        <meta property="twitter:image" content="/favicon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
