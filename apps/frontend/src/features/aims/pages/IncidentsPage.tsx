import React from 'react';
import { FaExclamationTriangle, FaPlus } from 'react-icons/fa';

export default function IncidentsPage() {
  const incidents = [
    {
      id: 1,
      title: 'Model Performance Degradation',
      severity: 'high',
      status: 'investigating',
      timestamp: '2024-02-15 10:30:00',
    },
    {
      id: 2,
      title: 'Data Pipeline Failure',
      severity: 'medium',
      status: 'resolved',
      timestamp: '2024-02-14 15:45:00',
    },
    {
      id: 3,
      title: 'Security Alert',
      severity: 'critical',
      status: 'mitigated',
      timestamp: '2024-02-14 09:15:00',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
        <button className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">
          <FaPlus className="mr-2 h-4 w-4" />
          Report Incident
        </button>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <FaExclamationTriangle className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Reported at {incident.timestamp}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    incident.severity === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : incident.severity === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)} Severity
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    incident.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : incident.status === 'mitigated'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 