import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../src/components/Layout';
import TemplateForm from '../src/components/TemplateForm';
import JsonPreview from '../src/components/JsonPreview';
import { makeHomepageLd } from '../templates/homepage';

// Import schemas
import homepageSchema from '../schemas/homepage.schema.json';
import homepageUiSchema from '../schemas/homepage.ui.json';



const HomePage: NextPage = () => {
  // Function to generate default answers based on the schema
  const generateDefaultAnswers = (): any => {
    const defaultAnswers: any = {};
    try {
      if (homepageSchema && typeof homepageSchema === 'object' && homepageSchema.properties) {
        Object.keys(homepageSchema.properties).forEach(key => {
          const property = (homepageSchema.properties as any)[key];
          if (!property || typeof property !== 'object') return;
          
          if (property.type === 'string') {
            defaultAnswers[key] = '';
          } else if (property.type === 'array') {
            defaultAnswers[key] = [];
          } else if (property.type === 'boolean') {
            defaultAnswers[key] = false;
          } else if (property.type === 'number' || property.type === 'integer') {
            defaultAnswers[key] = 0;
          } else if (property.type === 'object') {
            defaultAnswers[key] = {};
          } else if (property.enum && Array.isArray(property.enum) && property.enum.length > 0) {
             defaultAnswers[key] = property.enum[0];
          }
        });
      }
    } catch (error) {
      console.error('Error generating default answers:', error);
    }
    return defaultAnswers;
  };

  const [answers, setAnswers] = useState<any>(() => generateDefaultAnswers());
  const [jsonLd, setJsonLd] = useState<string>('');

  // Load answers from localStorage on mount and merge with defaults
  useEffect(() => {
    const savedAnswers = localStorage.getItem('homepage-answers');
    const defaultAnswers = generateDefaultAnswers();
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers({ ...defaultAnswers, ...parsedAnswers });
      } catch (error) {
        console.error('Error parsing saved answers from localStorage:', error);
        setAnswers(defaultAnswers);
      }
    } else {
      setAnswers(defaultAnswers);
    }
  }, []);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('homepage-answers', JSON.stringify(answers));
  }, [answers]);

  // Generate JSON-LD whenever answers change
  useEffect(() => {
    try {
      const ldData = makeHomepageLd(answers);
      const generatedLd = JSON.stringify(ldData, null, 2);
      setJsonLd(generatedLd);
    } catch (error) {
      console.error('Error generating JSON-LD:', error);
      setJsonLd('{}');
    }
  }, [answers]);

  const handleFormChange = useCallback((newData: any) => {
    setAnswers(newData);
  }, []);

  const handleCopyJson = useCallback(() => {
    if (navigator.clipboard && jsonLd) {
      navigator.clipboard.writeText(jsonLd).then(() => {
        console.log('JSON-LD copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy JSON-LD:', err);
      });
    }
  }, [jsonLd]);

  const handleDownloadJson = useCallback(() => {
    if (jsonLd) {
      const blob = new Blob([jsonLd], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'homepage-json-ld.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [jsonLd]);

  const handleEmailJson = useCallback(() => {
    if (jsonLd) {
      const subject = 'JSON-LD for Homepage';
      const body = `Please find the generated JSON-LD below:\n\n${jsonLd}`;
      const encodedBody = encodeURIComponent(body);
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
    }
  }, [jsonLd]);

  // Parse JSON safely
  const parsedJsonLd = React.useMemo(() => {
    if (!jsonLd || jsonLd === '{}') return {};
    try {
      return JSON.parse(jsonLd);
    } catch (error) {
      console.error('Error parsing JSON-LD:', error);
      return {};
    }
  }, [jsonLd]);

  return (
    <Layout>
    
      <Head>
      
        <title >Website HQ JSON-LD Generator</title>
        
      </Head>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Fill Out the Form and the JSON Code will Magically Appear on the right.</h1>
        <p className="text-gray-600 bottom-margin-70">You Don't have to Fill Every Question Out the Code Will Just Write Out What You've Filled In</p>
      </div>

      <div className="responsive-grid">
        <div>
          <h2 className="text-xl font-bold mb-2">Enter Details</h2>
          <TemplateForm
            schema={homepageSchema}
            uischema={homepageUiSchema}
            data={answers}
            onChange={handleFormChange}
          />
        </div>
        <div  className="glass-background top-margin-80">
          <h2 className="text-xl font-bold mb-2">JSON-LD Preview</h2>
          <JsonPreview value={parsedJsonLd} onCopy={handleCopyJson} />
          <div className="mt-4 flex gap-2">
            <button type="button" className="liquid-button" onClick={handleDownloadJson} disabled={!jsonLd || jsonLd === '{}'}>
              Download .json
            </button>
            <button type="button" className="liquid-button" onClick={handleEmailJson} disabled={!jsonLd || jsonLd === '{}'}>
              Email to dev
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;