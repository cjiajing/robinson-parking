'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Shield, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Legal Disclaimer</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-red-800 text-lg mb-2">Unofficial & Independent Tool</h2>
            <p className="text-red-700">
              This application is <strong>NOT affiliated, endorsed, or authorized</strong> by Robinson Suites, 
              its management, or any carpark operator. This is an independent tool created by users for users.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" /> No Official Relationship
          </h2>
          <p className="text-gray-700">
            Robinson Suites Parking Assistant is a community-developed tool. We are not agents, 
            representatives, or partners of the carpark management. All trademarks and building names 
            belong to their respective owners.
          </p>
        </section>

        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Queue System Disclaimer</h2>
          <p className="text-gray-700 mb-3">
            The queue system is voluntary and honor-based. Important limitations:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Queue positions are not legally binding</li>
            <li>Carpark staff may override or ignore the queue</li>
            <li>Technical issues may cause queue data loss</li>
            <li>Users may join, leave, or skip the queue freely</li>
            <li>We cannot guarantee that other users will respect the queue order</li>
          </ul>
        </section>

        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Parking Memory Feature</h2>
          <p className="text-gray-700 mb-3">
            The parking memory feature is for your convenience only:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>You are solely responsible for remembering your actual parking location</li>
            <li>We do not guarantee the accuracy of stored parking information</li>
            <li>Always verify your parking spot with physical markers</li>
            <li>Do not rely solely on this app to find your vehicle</li>
          </ul>
        </section>

        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Situations</h2>
          <p className="text-gray-700">
            <strong>DO NOT USE THIS APP IN EMERGENCIES.</strong> If you need immediate assistance:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>Call emergency services: 995 (Singapore)</li>
            <li>Contact carpark security directly</li>
            <li>Use official building emergency procedures</li>
          </ul>
        </section>

        <div className="bg-gray-50 border rounded-lg p-6 text-center">
          <p className="text-gray-600 italic">
            By using this application, you acknowledge that you have read, understood, 
            and agree to all terms, conditions, and limitations stated in this disclaimer.
          </p>
        </div>
      </div>
    </div>
  );
}
