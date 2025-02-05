import React, { useState } from 'react';
import { Send } from 'lucide-react';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [model, setModel] = useState('meta-llama/Meta-Llama-3.1-8B-Instruct');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          model: model,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            LLM Privacy Wrapper
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Input Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 text-base"
                placeholder="Enter your text here..."
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base appearance-none bg-white"
              >
                <option value="meta-llama/Meta-Llama-3.1-8B-Instruct">Llama-3.1-8B-Instruct</option>
                <option value="meta-llama/Meta-Llama-3.1-70B-Instruct">Llama-3.1-70B-Instruct</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !inputText}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="text-lg">Processing...</span>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  <span className="text-lg">Submit</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-base text-red-600">
                  {error}
                </p>
              </div>
            )}

            {response && (
              <div className="mt-8">
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Response
                </label>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner whitespace-pre-wrap text-base">
                  {response}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
