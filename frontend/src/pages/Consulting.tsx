import React, { useState } from 'react';
import { Calendar, Settings, Users } from 'lucide-react';
import ConsultingForm from '../components/consulting/ConsultingForm';
import ConsultingDashboard from '../components/consulting/ConsultingDashboard';

const Consulting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard'>('form');

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">
                AI Consulting Services
              </h1>
              <p className="text-navy-600">
                Transform your business with cutting-edge AI solutions and expert guidance
              </p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-navy-100 rounded-lg p-1 mt-4 md:mt-0">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'form'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Consultation
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Requests
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'form' ? (
          <div>
            {/* Services Overview */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">AI Strategy</h3>
                  <p className="text-navy-600 text-sm">
                    Develop comprehensive AI strategies aligned with your business objectives and market opportunities.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="bg-coral-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-coral-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Implementation</h3>
                  <p className="text-navy-600 text-sm">
                    End-to-end AI solution implementation with seamless integration into your existing systems.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="bg-navy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-navy-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Ongoing Support</h3>
                  <p className="text-navy-600 text-sm">
                    Continuous optimization, monitoring, and support to ensure maximum ROI from your AI investments.
                  </p>
                </div>
              </div>
            </div>

            {/* Consulting Form */}
            <ConsultingForm />
          </div>
        ) : (
          <ConsultingDashboard />
        )}
      </div>
    </div>
  );
};

export default Consulting;
