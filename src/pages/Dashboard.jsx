import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDept, setSearchDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const fetchEmployees = async (departmentQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      let endpoint = 'https://employee-analytics-backend-960o.onrender.com/api/employees';
      if (departmentQuery) {
        endpoint = `https://employee-analytics-backend-960o.onrender.com/api/employees/search?department=${encodeURIComponent(departmentQuery)}`;
    }

      const response = await axios.get(endpoint, config);
      setEmployees(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error pulling data records from system metrics storage.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees(searchDept);
  };

  const handleClearSearch = () => {
    setSearchDept('');
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you certain you wish to delete this employee profile?')) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.delete(`https://employee-analytics-backend-960o.onrender.com/api/employees/${id}`, config);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing item from remote server database storage.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employee Management Analytics</h1>
          <p className="mt-2 text-sm text-slate-600">Track performance configurations, technical skill lists, and real-time internal enterprise metrics.</p>
        </div>
      </div>

      {/* Search and Filtering Workspace Bar Component */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Filter by Department</label>
          <input
            type="text" value={searchDept} onChange={(e) => setSearchDept(e.target.value)}
            placeholder="e.g. Development"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button type="submit" className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition">
            Search
          </button>
          {searchDept && (
            <button type="button" onClick={handleClearSearch} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-300 transition">
              Clear
            </button>
          )}
        </div>
      </form>

      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 mb-6">{error}</div>}

      {/* Grid List View Display Matrix Rendering Module */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-medium text-lg">Fetching current analytics ledger data from database cluster...</div>
      ) : employees.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-slate-300 rounded-xl py-16 text-slate-500">
          No employee profile models found matching your specified configuration constraints.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden border border-slate-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 relative快捷 operations px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{emp.name}</div>
                    <div className="text-sm text-slate-500">{emp.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{emp.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{emp.experience} Yrs</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {emp.skills.map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      emp.performanceScore >= 85 ? 'bg-green-100 text-green-800' :
                      emp.performanceScore >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {emp.performanceScore} / 100
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:text-red-900 font-semibold transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;   