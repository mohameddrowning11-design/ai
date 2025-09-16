
import React, { useState, useCallback } from 'react';
import { editImages } from './services/geminiService';
import { ImageFile } from './types';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [image1, setImage1] = useState<ImageFile | null>(null);
  const [image2, setImage2] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>(
    'A Polaroid-style photo with two people standing close together. The picture should look like an ordinary snapshot, without a clear subject, and slightly blurred. Lighting should resemble a flash coming from a dark room, spreading evenly across the photo. Keep the faces unchanged. Replace the background behind them with a simple white curtain'
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const loadingMessages = [
    "Warming up the digital canvas...",
    "Blending pixels and prompts...",
    "Consulting with the AI muse...",
    "This is taking a moment, the AI is being extra creative...",
    "Rendering the final masterpiece...",
  ];
  
  const handleGenerate = useCallback(async () => {
    if (!image1 || !image2 || !prompt) {
      setError('Please upload two images and provide a prompt.');
      return;
    }

    setError(null);
    setLoading(true);
    setGeneratedImage(null);
    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
        setLoadingMessage(prev => {
            const currentIndex = loadingMessages.indexOf(prev);
            const nextIndex = (currentIndex + 1) % loadingMessages.length;
            return loadingMessages[nextIndex];
        });
    }, 3000);

    try {
      const result = await editImages(image1, image2, prompt);
      if (result) {
        setGeneratedImage(`data:image/png;base64,${result}`);
      } else {
        setError('The AI could not generate an image from the prompt. Please try again with a different prompt.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  }, [image1, image2, prompt, loadingMessages]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Image Fusion Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Combine two images with a creative prompt using AI.
          </p>
        </header>

        <main className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader id="image1" label="First Image" onImageUpload={setImage1} />
            <ImageUploader id="image2" label="Second Image" onImageUpload={setImage2} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <label htmlFor="prompt" className="block text-lg font-semibold mb-2 text-gray-300">
              Your Creative Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-200"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A surreal painting of both people in a sci-fi city..."
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={loading || !image1 || !image2 || !prompt}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 transform transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
            >
              {loading ? <Spinner /> : 'Generate Image'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loading && (
             <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-lg text-purple-400 animate-pulse">{loadingMessage}</p>
             </div>
          )}

          {generatedImage && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">Result</h2>
              <div className="flex justify-center">
                 <img src={generatedImage} alt="Generated" className="rounded-lg max-w-full h-auto shadow-2xl" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
