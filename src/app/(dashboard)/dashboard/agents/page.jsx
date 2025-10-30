'use client';
import { useState, useEffect } from 'react';
import { agentService } from '@/services/agentService';
import { shiftService } from '@/services/shiftService';
import { toast } from 'sonner';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    agentName: '',
    agentId: '',
    shift: '',
    email: '',
    password: ''
  });

  // Available shifts (backend se fetch hongi)
  const [shifts, setShifts] = useState([]);
  const [shiftsLoading, setShiftsLoading] = useState(false);

  // Fetch shifts from backend
  const fetchShifts = async () => {
    setShiftsLoading(true);
    try {
      const response = await shiftService.getShiftsForDropdown();
      setShifts(response);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Error fetching shifts');
    } finally {
      setShiftsLoading(false);
    }
  };

  // Fetch agents
  const fetchAgents = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await agentService.getAllAgents({
        page,
        limit: 10,
        search
      });
      setAgents(response.agents);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Error fetching agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchShifts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchAgents(1, e.target.value);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  // Create new agent
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.shift) {
      toast.warning('Please select a shift');
      return;
    }

    setLoading(true);
    try {
      await agentService.createAgent(formData);
      toast.success('Agent created successfully! Welcome email sent.');
      setShowCreateForm(false);
      setFormData({
        agentName: '',
        agentId: '',
        shift: '',
        email: '',
        password: ''
      });
      fetchAgents(); // Refresh list
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.success(error.response?.data?.error || 'Error creating agent');
    } finally {
      setLoading(false);
    }
  };

  // Delete agent
  const handleDeleteAgent = async (agentId) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      await agentService.deleteAgent(agentId);
      toast.success('Agent deleted successfully');
      fetchAgents(); // Refresh list
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Error deleting agent');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Agent Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New Agent
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search agents by name, ID, or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Create Agent Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
            
            <form onSubmit={handleCreateAgent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Agent Name</label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Agent ID</label>
                  <input
                    type="text"
                    name="agentId"
                    value={formData.agentId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shift</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    required
                    disabled={shiftsLoading}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select Shift</option>
                    {shiftsLoading ? (
                      <option>Loading shifts...</option>
                    ) : (
                      shifts.map(shift => (
                        <option key={shift._id} value={shift._id}>
                          {shift.shiftName} ({shift.startTime} - {shift.endTime})
                        </option>
                      ))
                    )}
                  </select>
                  {shifts.length === 0 && !shiftsLoading && (
                    <p className="text-red-500 text-sm mt-1">
                      No shifts available. Please create shifts first.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="bg-gray-500 text-white px-3 rounded hover:bg-gray-600"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading || shifts.length === 0}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Agent'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agents List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No agents found
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {agent.agentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {agent.agentId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agent.shift ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {agent.shift.shiftName} ({agent.shift.startTime} - {agent.shift.endTime})
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          No Shift
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        agent.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteAgent(agent._id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                <div>
                  Showing {(pagination.currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(pagination.currentPage * 10, pagination.totalAgents)} of{' '}
                  {pagination.totalAgents} agents
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchAgents(pagination.currentPage - 1, searchTerm)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchAgents(pagination.currentPage + 1, searchTerm)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}