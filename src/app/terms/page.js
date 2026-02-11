'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, AlertCircle, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="prose prose-blue max-w-none">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Important Legal Notice</p>
              <p className="text-sm text-yellow-700">
                This is a community-developed tool and is not officially affiliated with or endorsed by any carpark management.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> 1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-2">
            By accessing or using Robinson Suites Parking Assistant ("the App"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the App.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-2">
            The App provides a voluntary queue management and parking memory system for users. Key features include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Digital record of your parking location</li>
            <li>Voluntary queue joining for vehicle retrieval</li>
            <li>Real-time queue position updates</li>
          </ul>
          <p className="text-gray-700 mt-2">
            <strong>The App is provided "AS IS" without any warranties, express or implied.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Disclaimer of Warranties</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-medium mb-2">YOU EXPRESSLY UNDERSTAND AND AGREE THAT:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your use of the App is at your sole risk</li>
              <li>The App may have bugs, errors, or interruptions</li>
              <li>Queue positions are not guaranteed and may be affected by technical issues</li>
              <li>The App is not an official queue system of the carpark management</li>
              <li>Carpark management may have their own systems that override this App</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Limitation of Liability</h2>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-gray-800 font-medium mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="list-disc pl-6 text-gray-800 space-y-2">
              <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>We shall not be liable for any loss of profits, data, or parking opportunities</li>
              <li>Our total liability to you shall not exceed SGD $10</li>
              <li>We are not responsible for the actions of carpark management or other users</li>
              <li>We do not guarantee that you will retrieve your vehicle within any specific time</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. User Responsibilities</h2>
          <p className="text-gray-700 mb-2">As a user, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Use the App at your own discretion</li>
            <li>Not rely solely on the App for time-sensitive parking retrieval</li>
            <li>Follow official carpark rules and staff instructions</li>
            <li>Not misuse, spam, or attempt to manipulate the queue system</li>
            <li>Not reverse engineer or copy the App</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
          <p className="text-gray-700">
            We reserve the right to modify, suspend, or discontinue the App at any time without notice. 
            We may terminate your access for violating these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by the laws of Singapore, without regard to its conflict of law provisions.
          </p>
        </section>

        <div className="border-t pt-6 mt-8 text-center text-gray-500 text-sm">
          <p>By using this App, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}
