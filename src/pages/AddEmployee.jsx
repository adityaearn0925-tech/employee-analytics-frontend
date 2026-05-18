import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Form input formatting validations
    const structuredSkills = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');

    if (structuredSkills.length === 0) {
      setError('Please provide at least one valid core specialized skill.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const payload = {
        ...formData,
        skills: structuredSkills,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      await axios.post('https://employee-analytics-backend-960o.onrender.com/api/employees', payload, config);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to successfully store employee records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Register New Employee</h2>
        
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label>
              <input
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Aman Verma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="aman@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text" name="department" required value={formData.department} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
              <input
                type="number" name="experience" min="0" required value={formData.experience} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Performance Score (0 - 100)</label>
            <input
              type="number" name="performanceScore" min="0" max="100" required value={formData.performanceScore} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="85"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skills (Comma-separated values)</label>
            <input
              type="text" name="skills" required value={formData.skills} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button" onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition"
            >
              {loading ? 'Storing Details...' : 'Save Employee Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;