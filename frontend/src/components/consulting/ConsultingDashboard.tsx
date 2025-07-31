import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Phone, Building, DollarSign, MessageSquare, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';

interface ConsultingRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  communicationPreference: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  communications: Communication[];
}

interface Communication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string;
  content: string;
  method: string;
  followUpRequired: boolean;
  followUpDate: string | null;
  createdAt: string;
  createdBy: string;
}

const ConsultingDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ConsultingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ConsultingRequest | null>(null);
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Communication form state
  const [communicationData, setCommunicationData] = useState({
    type: 'email' as 'email' | 'call' | 'meeting' | 'note',
    subject: '',
    content: '',
    method: 'email',
    followUpRequired: false,
    followUpDate: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/consulting');
      const result = await response.json();
      
      if (result.success) {
        setRequests(result.data);
      } else {
        setError('Failed to fetch consulting requests');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/consulting/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (result.success) {
        setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: status as any } : req
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addCommunication = async () => {
    if (!selectedRequest || !communicationData.content.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/consulting/${selectedRequest.id}/communication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communicationData),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh the selected request
        const updatedResponse = await fetch(`http://localhost:5000/api/consulting/${selectedRequest.id}`);
        const updatedResult = await updatedResponse.json();
        
        if (updatedResult.success) {
          setSelectedRequest(updatedResult.data);
          setRequests(prev => prev.map(req => 
            req.id === selectedRequest.id ? updatedResult.data : req
          ));
        }

        // Reset form
        setCommunicationData({
          type: 'email',
          subject: '',
          content: '',
          method: 'email',
          followUpRequired: false,
          followUpDate: ''
        });
        setShowCommunicationForm(false);
      }
    } catch (err) {
      console.error('Error adding communication:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">Consulting Dashboard</h1>
        <p className="text-navy-600">Manage consulting requests and client communications</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-navy-500 mr-2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-navy-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-navy-200 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="text-sm text-navy-600">
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-navy-900">Consulting Requests</h2>
          
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <MessageSquare className="h-12 w-12 text-navy-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-navy-700 mb-2">No requests found</h3>
              <p className="text-navy-500">No consulting requests match your current filters.</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div
                key={request.id}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedRequest?.id === request.id ? 'ring-2 ring-teal-500' : ''
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">{request.name}</h3>
                    <p className="text-navy-600">{request.company || 'Individual'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-navy-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {request.email}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {request.projectType}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {request.budget}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-navy-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={request.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateRequestStatus(request.id, e.target.value);
                      }}
                      className="text-xs border border-navy-200 rounded px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Request Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-navy-900">Request Details</h2>
          
          {selectedRequest ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-navy-900">{selectedRequest.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-navy-500" />
                    {selectedRequest.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-navy-500" />
                    {selectedRequest.phone || 'Not provided'}
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-navy-500" />
                    {selectedRequest.company || 'Individual'}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-navy-500" />
                    {selectedRequest.budget}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-navy-500" />
                    {selectedRequest.timeline}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-navy-500" />
                    {selectedRequest.preferredDate || 'Flexible'}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-navy-900 mb-2">Project Description</h4>
                <p className="text-navy-600 text-sm">{selectedRequest.description}</p>
              </div>

              {/* Communications */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-navy-900">Communications</h4>
                  <button
                    onClick={() => setShowCommunicationForm(true)}
                    className="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Note
                  </button>
                </div>
                
                {selectedRequest.communications.length === 0 ? (
                  <p className="text-navy-500 text-sm">No communications recorded yet.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedRequest.communications.map(comm => (
                      <div key={comm.id} className="border border-navy-200 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-navy-900">
                            {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                            {comm.subject && `: ${comm.subject}`}
                          </span>
                          <span className="text-xs text-navy-500">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-navy-600">{comm.content}</p>
                        {comm.followUpRequired && (
                          <div className="mt-2 text-xs text-orange-600">
                            Follow-up required: {comm.followUpDate}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Communication Form */}
              {showCommunicationForm && (
                <div className="border-t border-navy-200 pt-4">
                  <h5 className="font-medium text-navy-900 mb-3">Add Communication</h5>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={communicationData.type}
                        onChange={(e) => setCommunicationData(prev => ({ ...prev, type: e.target.value as any }))}
                        className="border border-navy-200 rounded px-3 py-2 text-sm"
                      >
                        <option value="email">Email</option>
                        <option value="call">Phone Call</option>
                        <option value="meeting">Meeting</option>
                        <option value="note">Note</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Subject (optional)"
                        value={communicationData.subject}
                        onChange={(e) => setCommunicationData(prev => ({ ...prev, subject: e.target.value }))}
                        className="border border-navy-200 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <textarea
                      placeholder="Communication details..."
                      value={communicationData.content}
                      onChange={(e) => setCommunicationData(prev => ({ ...prev, content: e.target.value }))}
                      rows={3}
                      className="w-full border border-navy-200 rounded px-3 py-2 text-sm"
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={communicationData.followUpRequired}
                          onChange={(e) => setCommunicationData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                          className="mr-2"
                        />
                        Follow-up required
                      </label>
                      {communicationData.followUpRequired && (
                        <input
                          type="date"
                          value={communicationData.followUpDate}
                          onChange={(e) => setCommunicationData(prev => ({ ...prev, followUpDate: e.target.value }))}
                          className="border border-navy-200 rounded px-2 py-1 text-sm"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addCommunication}
                        className="bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600"
                      >
                        Add Communication
                      </button>
                      <button
                        onClick={() => setShowCommunicationForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Eye className="h-12 w-12 text-navy-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-navy-700 mb-2">Select a Request</h3>
              <p className="text-navy-500">Click on a consulting request to view details and manage communications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultingDashboard;
