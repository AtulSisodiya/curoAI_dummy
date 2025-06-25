import React, { useState, useEffect } from 'react';
import { Calendar, Target, Loader2, CheckCircle, XCircle, Sparkles, Sun, Moon } from 'lucide-react';

interface ApiResponse {
  status: string;
  message?: string;
  data?: any;
}

function App() {
  const [goalDescription, setGoalDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('curoai-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('curoai-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous states
    setResponse(null);
    setError(null);
    
    // Validation
    if (!goalDescription.trim()) {
      setError('Please enter a goal description');
      return;
    }
    
    if (!targetDate) {
      setError('Please select a target date');
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      setError('Target date must be in the future');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        goal_description: goalDescription.trim(),
        target_date: targetDate
      };

      const response = await fetch('https://curoai.free.beeceptor.com/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.status === 'success' || response.status === 201) {
        setResponse(data);
        // Clear form on success
        setGoalDescription('');
        setTargetDate('');
      } else {
        setError(data.message || 'Failed to create your plan. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl group"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600 group-hover:-rotate-12 transition-transform duration-200" />
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Curo<span className="text-blue-600 dark:text-blue-400">AI</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Achieve your goals on time with CuroAI
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Description */}
            <div>
              <label htmlFor="goal" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 transition-colors duration-300">
                <Target className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                What's your goal?
              </label>
              <textarea
                id="goal"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="Describe your goal in detail... The more specific, the better your AI-generated plan will be!"
                className="w-full h-32 px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Be specific about what you want to achieve
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">
                  {goalDescription.length}/500
                </span>
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label htmlFor="date" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 transition-colors duration-300">
                <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Target deadline
              </label>
              <input
                type="date"
                id="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={getTodayDate()}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                Choose a deadline for your goal
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl transition-all duration-300">
                <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !goalDescription.trim() || !targetDate}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Plan...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create My Plan
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Success Response */}
        {response && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 transition-all duration-300">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 transition-colors duration-300">
                  Success! Your plan is being created
                </h3>
                {response.message && (
                  <p className="text-green-700 dark:text-green-300 mb-3 transition-colors duration-300">{response.message}</p>
                )}
                {response.data && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700 transition-all duration-300">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 transition-colors duration-300">Response Data:</h4>
                    <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap overflow-x-auto transition-colors duration-300">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            powered by CuroAI
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;