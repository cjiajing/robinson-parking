'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function IssuesPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [hasCalledTech, setHasCalledTech] = useState(false);
  const [reportedIssues, setReportedIssues] = useState([
    {
      id: 1,
      lift: 'A',
      type: 'Mechanical Error',
      description: 'Lift not responding to commands',
      reportedBy: 'User #482',
      time: '3:15 PM',
      status: 'investigating',
      confirmations: 2
    }
  ]);

  const issueTypes = [
    'Lift not moving',
    'Error message on screen',
    'Strange noise/vibration',
    'Car stuck',
    'Touchscreen not responding',
    'Other problem'
  ];

  const submitIssue = () => {
    if (!selectedLift || !issueType) return;

    const newIssue = {
      id: reportedIssues.length + 1,
      lift: selectedLift,
      type: issueType,
      description,
      reportedBy: 'You',
      time: new Date().toLocaleTimeString('en-SG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      status: 'reported',
      confirmations: 0
    };

    setReportedIssues([newIssue, ...reportedIssues]);
    
    // Reset form
    setSelectedLift('');
    setIssueType('');
    setDescription('');
    setHasCalledTech(false);

    alert('Issue reported! Other users will be notified.');
  };

  const confirmIssue = (issueId) => {
    setReportedIssues(issues =>
      issues.map(issue =>
        issue.id === issueId
          ? { ...issue, confirmations: issue.confirmations + 1 }
          : issue
      )
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Report Issues</h1>
        <p className="text-gray-600">Report problems and see current issues</p>
      </header>

      {/* Emergency Contact */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-800">Emergency Contact</h3>
            </div>
            <p className="text-red-700 text-sm mb-2">
              Call technician immediately for urgent issues
            </p>
            <p className="font-mono font-bold text-lg text-red-900">+65 8126 0005</p>
          </div>
          <a
            href="tel:+6581260005"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </div>

      {/* Currently Reported Issues */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Issues</h2>
        
        {reportedIssues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
            <p>No reported issues. All systems operational.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportedIssues.map((issue) => (
              <div key={issue.id} className="status-card border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        issue.lift === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Lift {issue.lift}
                      </div>
                      <span className="text-sm text-gray-500">{issue.time}</span>
                    </div>
                    <h3 className="font-medium text-gray-900">{issue.type}</h3>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Reported by</div>
                    <div className="text-sm font-medium">{issue.reportedBy}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => confirmIssue(issue.id)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirm ({issue.confirmations})
                    </button>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      issue.status === 'investigating' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </div>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Mark resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report New Issue Form */}
      <div className="status-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Report New Issue</h2>
        
        {/* Lift Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Which lift is affected?
          </label>
          <div className="flex gap-3">
            {['A', 'B', 'Both', 'Not sure'].map((lift) => (
              <button
                key={lift}
                onClick={() => setSelectedLift(lift)}
                className={`flex-1 py-3 rounded-lg border ${
                  selectedLift === lift
                    ? 'border-parking-blue bg-blue-50 text-parking-blue'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                {lift}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What's the problem?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {issueTypes.map((type) => (
              <button
                key={type}
                onClick={() => setIssueType(type)}
                className={`py-3 rounded-lg border text-sm ${
                  issueType === type
                    ? 'border-parking-blue bg-blue-50 text-parking-blue'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional details (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, any error messages, etc."
            className="w-full p-3 border border-gray-300 rounded-lg h-32"
            rows="4"
          />
        </div>

        {/* Technician Called */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="calledTech"
              checked={hasCalledTech}
              onChange={(e) => setHasCalledTech(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="calledTech" className="text-sm text-gray-700">
              I have already called the technician at +65 8126 0005
            </label>
          </div>
          {hasCalledTech && (
            <div className="mt-2 text-sm text-green-600">
              ✓ Thank you for calling. Please report the issue here so other users are notified.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={submitIssue}
          disabled={!selectedLift || !issueType}
          className="w-full btn-primary py-3 text-lg"
        >
          Report Issue to Community
        </button>

        <p className="text-sm text-gray-500 text-center mt-3">
          This will alert other users about the problem
        </p>
      </div>
    </div>
  );
}