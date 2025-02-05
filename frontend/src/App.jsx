import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';

const PrivacyWrapperApp = () => {
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
      const response = await fetch('/api/query', {
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
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>LLM Privacy Wrapper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Input Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-2 border rounded-md h-32"
                placeholder="Enter your text here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="meta-llama/Meta-Llama-3.1-8B-Instruct">Llama-3.1-8B-Instruct</option>
                <option value="meta-llama/Meta-Llama-3.1-70B-Instruct">Llama-3.1-70B-Instruct</option>
                <option value="meta-llama/Meta-Llama-3.1-405B-Instruct">Llama-3.1-405B-Instruct</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !inputText}
              className="w-full bg-blue-500 text-white p-2 rounded-md flex items-center justify-center space-x-2 disabled:bg-gray-300"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            {response && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Response
                </label>
                <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyWrapperApp;
