import React, { FC } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>JSON-LD Generator</title>
      </Head>
      <div className="max-w-4xl mx-auto p-4">
        <header className="glass mb-4 p-4 rounded">
          <h1 className="text-2xl font-bold">JSON-LD Generator</h1>
        </header>
        <main>{children}</main>
        <footer className="mt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} JSON-LD Generator
        </footer>
      </div>
    </>
  );
};

export default Layout;