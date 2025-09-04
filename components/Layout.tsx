import { ReactNode } from 'react'
import Head from 'next/head'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>AdyShop - Premium E-commerce Platform</title>
        <meta name="description" content="Discover the latest iPhones, MacBooks, Nike shoes and more with AdyShop! Premium tech and fashion products with seamless shopping experience." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Primary Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content="AdyShop" />
        <meta name="apple-mobile-web-app-title" content="AdyShop" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <div className="min-h-screen bg-white">
        <Header />
        <main>{children}</main>
      </div>
    </>
  )
}