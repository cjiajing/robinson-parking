'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Our Commitment to Privacy</p>
              <p className="text-sm text-blue-700">
                We take your privacy seriously. This policy explains what data we collect and how we use it.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" /> 1. Information We Collect
          </h2>
          
          <h3 className="font-medium mt-4 mb-2">1.1 Anonymous User ID</h3>
          <p className="text-gray-700">
            We generate a random, anonymous ID stored in your browser's local storage. This ID:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Cannot be traced back to your identity</li>
            <li>Is unique to your browser/device</li>
            <li>Can be reset by clearing your browser data</li>
            <li>Is not linked to your name, email, or phone number</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">1.2 Parking Information</h3>
          <p className="text-gray-700">
            When you use our services, we store:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Lift selection (A or B)</li>
            <li>4-digit parking code (you provide)</li>
            <li>Pallet number (optional, you provide)</li>
            <li>Queue join/leave timestamps</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">1.3 Technical Data</h3>
          <p className="text-gray-700">
            We automatically collect basic technical information:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Browser type and version</li>
            <li>Device type (mobile/desktop)</li>
            <li>Approximate location (building/city level only)</li>
            <li>Time of access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" /> 2. How We Use Your Information
          </h2>
          <p className="text-gray-700">We use the collected information solely to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Remember your parking spot across sessions</li>
            <li>Manage the queue system</li>
            <li>Improve app performance and user experience</li>
            <li>Generate anonymous usage statistics</li>
          </ul>
          <p className="text-gray-700 mt-2 font-medium">
            We DO NOT sell, rent, or share your personal information with third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Data Storage & Security</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Local Storage:</strong> Your parking preferences are stored in your browser's local storage</li>
            <li><strong>Database:</strong> Queue data is stored securely on Supabase cloud infrastructure</li>
            <li><strong>Retention:</strong> Queue entries are automatically deleted after 24 hours</li>
            <li><strong>Encryption:</strong> All data transmitted using HTTPS encryption</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" /> 4. Your Rights & Choices
          </h2>
          <p className="text-gray-700">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Access:</strong> Request what data we have about you</li>
            <li><strong>Delete:</strong> Request deletion of your data</li>
            <li><strong>Opt-out:</strong> Stop using the app at any time</li>
            <li><strong>Clear:</strong> Delete your browser's local storage</li>
          </ul>
          <p className="text-gray-700 mt-2">
            To exercise these rights, contact: privacy@yourdomain.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Children's Privacy</h2>
          <p className="text-gray-700">
            Our services are not directed to persons under 13. We do not knowingly collect information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify users of any material changes 
            by updating the "Last updated" date at the top of this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-2">
            <p className="text-gray-800">Email: privacy@yourdomain.com</p>
            <p className="text-gray-800">Response time: Within 7 business days</p>
          </div>
        </section>

        <div className="border-t pt-6 mt-8 text-center text-gray-500 text-sm">
          <p>By using this App, you consent to this Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
