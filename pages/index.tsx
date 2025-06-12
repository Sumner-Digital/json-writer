import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../src/components/Layout';
import TemplatePicker from '../src/components/TemplatePicker';
import TemplateForm from '../src/components/TemplateForm';
import JsonPreview from '../src/components/JsonPreview';
import { makeHomepageLd } from '../templates/homepage';

// Import schemas (assuming they are JSON files)
import homepageSchema from '../schemas/homepage.schema.json';
import homepageUiSchema from '../schemas/homepage.ui.json';

// Define a type for validation results

// Define a type for the different template answers
type Answers = any; // Use any as the specific Answers interface was removed

const Home: NextPage = () => {
  const [step, setStep] = useState<number>(1);
  const [templateId, setTemplateId] = useState<string | null>(null);
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
            defaultAnswers[key] = 0; // Or a more appropriate default number
          } else if (property.type === 'object') {
            defaultAnswers[key] = {};
          } else if (property.enum && Array.isArray(property.enum) && property.enum.length > 0) {
             defaultAnswers[key] = property.enum[0]; // Use the first enum value as default
          }
          // Add more types as needed
        });
      }
    } catch (error) {
      console.error('Error generating default answers:', error);
    }
    return defaultAnswers as Answers;
  };

  const [answers, setAnswers] = useState<any>(() => generateDefaultAnswers()); // Initialize with default answers using lazy initial state
  const [jsonLd, setJsonLd] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Load answers from localStorage on mount
  // Load answers from localStorage on mount and merge with defaults
  useEffect(() => {
    const savedAnswers = localStorage.getItem('answers');
    const defaultAnswers = generateDefaultAnswers(); // Generate defaults
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        // Merge saved answers with defaults, saved answers take precedence
        setAnswers({ ...defaultAnswers, ...parsedAnswers });
      } catch (error) {
        console.error('Error parsing saved answers from localStorage:', error);
        setAnswers(defaultAnswers); // Fallback to defaults on error
      }
    } else {
      setAnswers(defaultAnswers); // Use defaults if no saved answers
    }
  }, []); // Empty dependency array means this effect runs only once on mount

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  // Generate JSON-LD and validate whenever answers or templateId change
  useEffect(() => {
    if (templateId === 'home') {
      try {
        console.log('Answers object before makeHomepageLd:', answers); // Log the answers object
        const ldData = makeHomepageLd(answers);
        const generatedLd = JSON.stringify(ldData, null, 2);
        console.log('Generated JSON-LD string:', generatedLd); // Log the generated JSON string
        setJsonLd(generatedLd);

      } catch (error) {
        console.error('Error generating JSON-LD:', error); // Simplified log message
        // Set valid empty JSON instead of error string
        setJsonLd('{}');
      }
    } else {
      setJsonLd('');
    }
  }, [answers, templateId]); // Depend on answers and templateId

  const handleStartGenerator = useCallback(() => {
    setStep(2);
  }, []);

  const handleTemplateSelect = useCallback((id: string) => {
    setTemplateId(id);
    setStep(3);
    console.log('Template selected, templateId:', id);
    // Reset answers when template changes? Or load defaults?
    // For now, let's keep existing answers, but a more robust solution might load template-specific defaults.
    // setAnswers({} as Answers); // Optional: reset answers
  }, []);

  const handleFormChange = useCallback((newData: any) => {
    setAnswers(newData);
  }, []);

  const handleCopyJson = useCallback(() => {
    if (navigator.clipboard && jsonLd) {
      navigator.clipboard.writeText(jsonLd).then(() => {
        console.log('JSON-LD copied to clipboard');
        setShowToast(true);
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
      a.download = `${templateId || 'generated'}-json-ld.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowToast(true);
    }
  }, [jsonLd, templateId]);

  const handleEmailJson = useCallback(() => {
    if (jsonLd) {
      const subject = `JSON-LD for ${templateId || 'homepage'}`;
      const body = `Please find the generated JSON-LD below:\n\n${jsonLd}`;
      // Basic URL encoding for mailto body
      const encodedBody = encodeURIComponent(body);
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
      setShowToast(true);
    }
  }, [jsonLd, templateId]);

  const handleToastYes = useCallback(() => {
    setTemplateId('product');
    setStep(2);
    setShowToast(false);
  }, []);

  const handleToastNo = useCallback(() => {
    setShowToast(false);
  }, []);

  // Determine which schema and uischema to use based on templateId
  const currentSchema = templateId === 'home' && homepageSchema ? homepageSchema : null;
  const currentUiSchema = templateId === 'home' && homepageUiSchema ? homepageUiSchema : null;
  
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
        <title>JSON-LD Generator</title>
      </Head>

      {step === 1 && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
          <div className="glass p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to the JSON-LD Generator</h2>
            <p className="mb-6">Generate structured data for your website.</p>
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleStartGenerator}
            >
              Start Generator
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <TemplatePicker onSelect={handleTemplateSelect} selected={templateId || undefined} />
      )}

      {step === 3 && templateId && currentSchema && currentUiSchema && (
        <>
          {console.log('Rendering TemplateForm with:', { templateId, currentSchema, currentUiSchema })}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Enter Details</h2>
              <TemplateForm
                schema={currentSchema}
                uischema={currentUiSchema}
                data={answers}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">JSON-LD Preview</h2>
              <JsonPreview value={parsedJsonLd} onCopy={handleCopyJson} />
              <div className="mt-4 flex gap-2">
                <button type="button" className="accent-text" onClick={handleDownloadJson} disabled={!jsonLd || jsonLd === '{}'}>Download .json</button>
                <button type="button" className="accent-text" onClick={handleEmailJson} disabled={!jsonLd || jsonLd === '{}'}>Email to dev</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 glass p-4 rounded-lg shadow-lg flex items-center">
          <span className="mr-4">Want Product schema next?</span>
          <button type="button" className="accent-text mr-2" onClick={handleToastYes}>Yes</button>
          <button type="button" className="accent-text" onClick={handleToastNo}>No</button>
        </div>
      )}
    </Layout>
  );
};

export default Home;