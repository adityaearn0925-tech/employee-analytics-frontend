import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AIAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const fetchAIInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      const response = await axios.post('https://employee-analytics-backend-960o.onrender.com/api/ai/recommend', {}, config);
      if (response.data?.success) {
        setData(response.data.analytics);
      } else {
        throw new Error('AI Engine generated unparsable metric packages.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error talking to remote AI orchestration service layers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Insights & System Recommendations</h1>
          <p className="mt-2 text-sm text-slate-600">Automated corporate assessments powered by custom machine learning evaluation contexts.</p>
        </div>
        <button
          onClick={fetchAIInsights} disabled={loading}
          className="mt-4 md:mt-0 bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 shadow-sm"
        >
          {loading ? 'Re-Computing Metrics...' : 'Re-Run System Analysis'}
        </button>
      </div>

      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 mb-6">{error}</div>}

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <span className="text-indigo-600 font-bold text-xl">★</span>
            </div>
            <p className="text-slate-500 font-medium text-lg">Querying AI layers, calculating rankings, and compiling feedback fields...</p>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-10">
          
          {/* Employee Rankings Leaderboard Grid System Component */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4">
              <h2 className="text-lg font-bold text-white flex items-center">
                <span className="text-yellow-400 mr-2">🏆</span> AI Normalized Global Rankings Matrix
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {data.rankings?.map((item) => (
                <div key={item.rank} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-4">
                    <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-extrabold text-slate-800">
                      #{item.rank}
                    </span>
                    <div>
                      <h4 className="text-md font-bold text-slate-900">{item.name}</h4>
                      <p className="text-sm text-slate-600 mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Weighted Factor</span>
                    <span className="text-lg font-black text-indigo-600">{item.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HR Decision Matrix Component Wrapper Grid */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Actionable Professional Development Roadmaps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recommendations?.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">{rec.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                        rec.status === 'Promote' ? 'bg-green-100 text-green-800 border border-green-200' :
                        rec.status === 'Needs Training' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Constructive Evaluation</span>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg italic border-l-2 border-slate-300">"{rec.feedback}"</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Suggested Skill Enhancements</span>
                        <p className="text-sm text-slate-600 font-medium">{rec.trainingSuggested || 'None specified. Maintaining expected path guidelines.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};

export default AIAnalytics;