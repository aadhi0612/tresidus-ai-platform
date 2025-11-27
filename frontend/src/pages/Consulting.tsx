import React from 'react';
import { Calendar, Settings, Users } from 'lucide-react';
import ConsultingForm from '../components/consulting/ConsultingForm';

const Consulting: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              AI Consulting Services
            </h1>
            <p className="text-navy-600">
              Transform your business with cutting-edge AI solutions and expert guidance
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};

export default Consulting;
