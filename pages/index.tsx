import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Layout from '../src/components/Layout';
import Link from 'next/link';

const templates = [
  { 
    id: 'homepage', 
    label: 'Homepage', 
    description: 'Generate structured data for your homepage',
    available: true,
    path: '/homepage'
  },
  { 
    id: 'product', 
    label: 'Product', 
    description: 'Generate structured data for product pages',
    available: false,
    path: '/product'
  },
  { 
    id: 'article', 
    label: 'Article', 
    description: 'Generate structured data for articles and blog posts',
    available: false,
    path: '/article'
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    description: 'Generate structured data for FAQ pages',
    available: false,
    path: '/faq'
  },
  { 
    id: 'event', 
    label: 'Event', 
    description: 'Generate structured data for events',
    available: false,
    path: '/event'
  },
  { 
    id: 'local', 
    label: 'Local Business', 
    description: 'Generate structured data for local businesses',
    available: false,
    path: '/local'
  },
];

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>JSON-LD Generator</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">JSON-LD Generator</h1>
          <p className="text-lg text-gray-600">
            Generate structured data for your website to improve SEO and search engine understanding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{template.label}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              {template.available ? (
                <Link href={template.path} className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Generate Schema
                </Link>
              ) : (
                <span className="inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">What is JSON-LD?</h2>
          <div className="glass p-6 rounded-lg text-left max-w-2xl mx-auto">
            <p className="mb-4">
              JSON-LD (JavaScript Object Notation for Linked Data) is a method of encoding linked data using JSON. 
              It's a W3C standard that helps search engines understand the content and context of your web pages.
            </p>
            <p>
              By adding structured data to your website, you can enhance how your pages appear in search results 
              with rich snippets, knowledge graphs, and other search features.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;