"use client";
import React, { useState, useRef } from 'react';
import {
  Loader2, FileDown, Copy, ChevronDown, Check, Sparkles,
  AlertTriangle, Zap, Target, Award, Twitter, Linkedin, Facebook
} from 'lucide-react';

// A helper function for combining class names conditionally
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// --- Main App Component ---
export default function App() {
  // --- STATE MANAGEMENT ---
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Neutral');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [isPresetLoading, setIsPresetLoading] = useState<string | null>(null);
  const questionsRef = useRef(null);
  const generatorRef = useRef(null);
  
  const tones = ['Neutral', 'Formal', 'Casual', 'Friendly', 'Professional', 'Empathetic'];
  const presetPrompts = [
    { id: 'engagement', label: 'Quarterly Engagement' },
    { id: 'onboarding', label: 'New Hire Onboarding' },
    { id: 'project_review', label: 'Post-Project Review' },
    { id: 'customer_sat', label: 'Customer Satisfaction' }
  ];

  // --- MOCK API CALLS & HANDLERS ---

  /**
   * Generates survey questions by simulating an API call with mock data.
   */
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic for your survey.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setQuestions([]); // Clear previous results

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use mock data instead of a real API call
    const mockQuestions = [
      `On a scale of 1-10, how satisfied are you with the recent process for "${prompt}"?`,
      `What was the most helpful part of your experience?`,
      `What is one thing we could do to improve this process for the future?`,
      `Did you feel you had all the necessary tools and resources to succeed?`,
      `How well did the team collaborate and communicate during this process?`,
      `Was the information provided about the goals and outcomes clear and accurate?`,
      `Do you have any suggestions for how we could have been better prepared?`,
      `How would you rate the overall success of this initiative?`,
    ];
    setQuestions(mockQuestions);
    setIsLoading(false);
  };

  const handleToneSelect = (selectedTone: string) => {
    setTone(selectedTone);
    setIsToneDropdownOpen(false);
  };
  
  /**
   * Fetches a detailed, customizable prompt template from a simulated backend.
   */
  const getDetailedPromptFromBackend = async (id: string) => {    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const detailedPrompts = {
      engagement: 'A quarterly employee engagement survey for the [department name] department, covering the period of [e.g., Q2 2025]. Key areas to investigate are work-life balance, manager effectiveness, and opportunities for career development.',
      onboarding: 'A survey for new hires who have completed their first 90 days. The goal is to gather detailed feedback on the entire onboarding process, from the pre-boarding communication to their full integration into the team. Please ask about the clarity of their role, the quality of training sessions, and their overall experience with [company name].',
      project_review: 'A post-project effectiveness review for the [project name] project. The survey should be for team members to provide feedback on what went well, what could be improved, and the overall collaboration. Focus on communication, resource allocation, and meeting project goals.',
      customer_sat: 'A customer satisfaction survey for clients who have used our [product/service name] in the last 3 months. The goal is to measure their overall satisfaction, ease of use, and the quality of support they received. Include a question about their likelihood to recommend us.'
    };

    return detailedPrompts[id as keyof typeof detailedPrompts] || 'Could not find a detailed prompt for this topic.';
  };
  
  const handlePresetPrompt = async (presetId: string) => {
        setIsPresetLoading(presetId);
    // This simulates a fetch call to an endpoint like `/api/getPresetPrompt?id=${presetId}`
    const detailedPrompt = await getDetailedPromptFromBackend(presetId);
    setPrompt(detailedPrompt);
    setIsPresetLoading(null);
    const generatorRef = useRef<HTMLDivElement>(null);
  };

  /**
   * Copies the generated questions as a numbered list to the clipboard.
   */
  const handleCopyQuestions = () => {
    if (questions.length === 0) return;

    const questionsText = questions.map((q, index) => `${index + 1}. ${q}`).join('\n');
    
    const textArea = document.createElement("textarea");
    textArea.value = questionsText;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess('Questions copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
    document.body.removeChild(textArea);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800">
      {/* --- Header --- */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-between items-center py-4">
          <a href="#" className="flex items-center space-x-2">
            <img src="/CM_Logo.png" alt="CultureMonkey Logo" className="h-8 md:h-9 w-auto" />
          </a>
          <a href="https://www.culturemonkey.io/request-demo" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100 transition-colors">
            Request a Demo
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="py-12 md:py-20 text-center">
          <img src="/CM Logo Square.png" alt="CultureMonkey Logo Square" className="h-20 w-35 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            AI Survey Generator
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Powered by the <span className="font-semibold" style={{color: '#36B37E'}}>CultureMonkey Engagement Engine</span>. Instantly create expert-level surveys from a single prompt.
          </p>
        </div>

        {/* --- Generator Card --- */}
        <div ref={generatorRef} className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
           <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-semibold text-gray-700">1. What is the survey about?</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Quarterly employee engagement, new hire onboarding experience..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 resize-none shadow-sm"
              rows={5}
            />
          </div>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold text-gray-700">2. Select a tone</label>
            <div className="relative">
              <button
                onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                className="w-full md:w-60 flex items-center justify-between text-left p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-colors shadow-sm hover:bg-gray-100"
              >
                <span>{tone}</span>
                <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform", isToneDropdownOpen && "rotate-180")} />
              </button>
              {isToneDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full md:w-60 bg-white rounded-lg shadow-xl border border-gray-200 animate-in fade-in-5 zoom-in-95">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleToneSelect(t)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 flex items-center justify-between"
                    >
                      {t}
                      {tone === t && <Check className="h-4 w-4 text-green-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              style={{backgroundColor: '#36B37E'}}
              className="w-full inline-flex items-center justify-center px-8 py-3 text-white font-bold rounded-lg shadow-md hover:opacity-90 disabled:bg-green-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? ( <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generating...</> ) : ( <><Sparkles className="mr-2 h-5 w-5" />Generate with CultureMonkey AI</>)}
            </button>
          </div>
        </div>
        
        {/* --- Preset Prompts Section --- */}
        <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-sm text-gray-500">Or start with one of our expert-designed templates:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {presetPrompts.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => handlePresetPrompt(p.id)} 
                      disabled={!!isPresetLoading}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center"
                    >
                        {isPresetLoading === p.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {p.label}
                    </button>
                ))}
            </div>
        </div>

        {/* --- Error Display & Results Section --- */}
        <div className="max-w-3xl mx-auto mt-12">
            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-800 border-l-4 border-red-400 rounded-r-lg flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}
            
            {(isLoading || questions.length > 0) && (
              <div className="animate-in fade-in-10 slide-in-from-bottom-5 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Generated Questions</h2>
                  {questions.length > 0 && (
                    <div className="flex items-center space-x-2 relative">
                       <button onClick={() => alert('PDF export logic goes here.')} className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition shadow-sm"><FileDown className="h-4 w-4 mr-1.5 text-gray-600"/>PDF</button>
                       <button onClick={() => alert('Google Form export logic goes here.')} className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition shadow-sm"><img src="https://ssl.gstatic.com/docs/forms/favicon_2020q4.ico" className="h-4 w-4 mr-1.5" alt="Google Forms Icon"/>Form</button>
                       <button onClick={handleCopyQuestions} className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition shadow-sm"><Copy className="h-4 w-4 mr-1.5 text-gray-600"/>Copy</button>
                       {copySuccess && <div className="absolute -top-8 right-0 px-2 py-1 text-xs bg-gray-800 text-white rounded-md shadow-lg animate-in fade-in-0 zoom-in-90">{copySuccess}</div>}
                    </div>
                  )}
                </div>
                
                <div ref={questionsRef} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
                  {isLoading && questions.length === 0 && ( <div className="space-y-5">{[...Array(8)].map((_, i) => ( <div key={i} className="animate-pulse flex space-x-4"><div className="rounded-full bg-gray-200 h-6 w-6"></div><div className="flex-1 space-y-3 py-1"><div className="h-2 bg-gray-200 rounded"></div><div className="h-2 bg-gray-200 rounded w-5/6"></div></div></div> ))}</div> )}
                  {questions.length > 0 && ( <ul className="space-y-4 text-gray-700">{questions.map((q, index) => ( <li key={index} className="flex items-start"><span style={{color: '#36B37E'}} className="font-semibold mr-3">{index + 1}.</span><p className="flex-1 leading-relaxed">{q}</p></li> ))}</ul> )}
                </div>
              </div>
            )}
        </div>
        
        {/* --- REVISED: Features Section --- */}
        <section className="py-16 md:py-24 bg-gray-50 mt-24">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">More Than an AI. It&apos;s Our Expertise.</h2>
                    <p className="mt-3 text-lg text-gray-600">Generic AI models guess. Our Engagement Engine knows. We&apos;ve distilled insights from millions of employee data points from top companies into an AI that understands workplace culture.</p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto">
                            <Award size={24} />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold">Built on Real-World Data</h3>
                        <p className="mt-2 text-base text-gray-600">This isn&apos;t an experiment. Our generator is powered by anonymized insights from our work with industry leaders. It knows what questions actually drive change.</p>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto">
                            <Zap size={24} />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold">Smarter Than Generic Models</h3>
                        <p className="mt-2 text-base text-gray-600">While other tools give you generic questions, our AI is tuned to the nuances of workplace dynamics, generating surveys that are more relevant and insightful.</p>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto">
                            <Target size={24} />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold">Get Actionable Insights, Faster</h3>
                        <p className="mt-2 text-base text-gray-600">Skip the guesswork. Get a survey that&apos;s ready to deploy and designed to uncover the feedback that truly matters for your team&apos;s growth.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- REVISED: How It Works Section --- */}
        <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Get Started in 3 Simple Steps</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative">
                    {/* Dashed line connector for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-10">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 1"><path d="M0 0.5 H800" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-gray-300"></path></svg>
                    </div>
                    
                    <div className="relative p-6 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-green-500 text-green-600 mx-auto font-bold text-2xl shadow-lg">1</div>
                        <h3 className="mt-5 text-lg font-semibold">Define Your Objective</h3>
                        <p className="mt-2 text-base text-gray-600">Provide a simple prompt. Tell our AI what you need to understand about your team, project, or customers.</p>
                    </div>
                    <div className="relative p-6 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-green-500 text-green-600 mx-auto font-bold text-2xl shadow-lg">2</div>
                        <h3 className="mt-5 text-lg font-semibold">Harness Our Expertise</h3>
                        <p className="mt-2 text-base text-gray-600">Click &apos;Generate&apos; and our Engagement Engine gets to work, crafting questions based on proven best practices.</p>
                    </div>
                    <div className="relative p-6 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-green-500 text-green-600 mx-auto font-bold text-2xl shadow-lg">3</div>
                        <h3 className="mt-5 text-lg font-semibold">Deploy with Confidence</h3>
                        <p className="mt-2 text-base text-gray-600">Export your expert-designed survey and start gathering the insights you need to build a better workplace.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* --- Floating Chat Icon --- */}
      <div className="fixed bottom-5 right-5 z-20">
        <button className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
          <img src="/Caesar Only.png" alt="Chat with Caesar" className="h-10 w-10" />
        </button>
      </div>

      {/* --- Footer --- */}
      <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-gray-900">AI Survey Generator</a></li>
                        <li><a href="#" className="hover:text-gray-900">Employee Engagement</a></li>
                        <li><a href="#" className="hover:text-gray-900">Performance</a></li>
                        <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-gray-900">About Us</a></li>
                        <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                        <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                        <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                        <li><a href="#" className="hover:text-gray-900">Case Studies</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm">&copy; 2025 CultureMonkey. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-gray-900"><Twitter size={20} /></a>
                    <a href="#" className="hover:text-gray-900"><Linkedin size={20} /></a>
                    <a href="#" className="hover:text-gray-900"><Facebook size={20} /></a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
