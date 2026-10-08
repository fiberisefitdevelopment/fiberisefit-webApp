import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lyte Privacy Policy | Data Protection & User Privacy',
  description:
    'Learn how Lyte collects, uses and protects your personal data. Read our privacy policy for secure and transparent data handling practices.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div
          className="text-white p-10 rounded-2xl shadow-2xl mb-7"
          style={{ backgroundColor: '#102333' }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Privacy Policy – LYTE
          </h1>
          <p className="text-gray-300">FIBERISE FIT PRIVATE LIMITED — LYTE</p>
          <p className="text-gray-300 text-sm mt-1">Last updated on Mar 10th 2026</p>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5 space-y-6">
          {/* Intro */}
          <p className="text-gray-800 leading-relaxed">
            This Privacy Policy (hereinafter referred to as the <strong>&quot;Policy&quot;</strong>) describes how
            FIBERISE FIT PRIVATE LIMITED, its affiliates, subsidiaries, licensors, service providers, and partners
            (collectively referred to as <strong>&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;,</strong> or{' '}
            <strong>&quot;Our&quot;</strong>) collect, use, store, process, and disclose personal information obtained
            from users of the LYTE wearable device, associated mobile applications, website, and related services
            (collectively referred to as the <strong>&quot;Platform&quot;</strong> or <strong>&quot;Services&quot;</strong>).
          </p>
          <p className="text-gray-800 leading-relaxed">
            By accessing, downloading, registering for, or using the Platform or any related Services, you (hereinafter
            referred to as the <strong>&quot;User&quot;, &quot;You&quot;,</strong> or <strong>&quot;Your&quot;</strong>)
            consent to the collection, storage, processing, and use of your information as described in this Policy. If
            you do not agree with the terms of this Privacy Policy, you must discontinue use of the Platform
            immediately.
          </p>

          {/* 1. Scope */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              1. SCOPE OF THIS PRIVACY POLICY
            </h2>
            <p className="text-gray-800 leading-relaxed">This Privacy Policy applies to:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>The LYTE wearable device</li>
              <li>LYTE mobile applications</li>
              <li>The website and digital platforms operated by FIBERISE FIT PRIVATE LIMITED</li>
              <li>All related products, services, and technologies offered by the Company</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              This Policy governs the collection and processing of personal information and health-related data
              generated through the use of the device and Platform. It does not apply to third-party websites,
              applications, or services that may be linked through our Platform.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              2. INFORMATION WE COLLECT
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We may collect various types of information from Users including but not limited to:
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">2.1 Personal Information</h3>
            <p className="text-gray-800 leading-relaxed">
              Personal Information may include details such as:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Age</li>
              <li>Gender</li>
              <li>Location</li>
              <li>Profile information</li>
              <li>Account login credentials</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-3">2.2 Health and Fitness Data</h3>
            <p className="text-gray-800 leading-relaxed">
              When you use the LYTE wearable device or associated applications, the Platform may collect:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Heart rate data</li>
              <li>Activity levels</li>
              <li>Calories burned</li>
              <li>Sleep patterns</li>
              <li>Body movement metrics</li>
              <li>Exercise and training data</li>
              <li>Wellness metrics and lifestyle indicators</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              This information may be collected through sensors embedded in the wearable device or entered manually by
              the User.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">2.3 Device and Technical Information</h3>
            <p className="text-gray-800 leading-relaxed">
              The Platform may automatically collect information such as:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Device type and identifiers</li>
              <li>Operating system and app version</li>
              <li>IP address and browser type (where applicable)</li>
              <li>Usage logs and interaction with the Platform</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              This information helps us improve the performance, security, and functionality of our Services.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">2.4 Payment and Transaction Information</h3>
            <p className="text-gray-800 leading-relaxed">
              If Users purchase devices, subscriptions, or services through the Platform, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Billing information</li>
              <li>Payment transaction details</li>
              <li>Shipping address</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              Payment processing is handled through secure third-party payment gateways.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">2.5 Cookies and Tracking Technologies</h3>
            <p className="text-gray-800 leading-relaxed">
              We may use cookies, pixels, or other tracking technologies to improve website functionality, analyze
              usage patterns, personalize user experience, and deliver relevant marketing content. Users may disable
              cookies through browser settings, although certain features may not function properly.
            </p>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              3. HOW WE USE YOUR INFORMATION
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Company may use collected information for purposes including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Providing and maintaining the Platform and Services</li>
              <li>Delivering personalized fitness insights and analytics</li>
              <li>Operating the wearable device and related applications</li>
              <li>Processing transactions and purchases</li>
              <li>Improving device performance and app functionality</li>
              <li>Customer support and troubleshooting</li>
              <li>Fraud prevention and security monitoring</li>
              <li>Sending marketing communications and promotional offers (where permitted)</li>
              <li>Complying with legal and regulatory obligations</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              Information may also be used to enhance product development and overall user experience.
            </p>
          </section>

          {/* 4. Data Sharing */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              4. DATA SHARING AND DISCLOSURE
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We do not sell personal information to third parties. However, we may share information in the following
              circumstances:
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">4.1 Service Providers</h3>
            <p className="text-gray-800 leading-relaxed">
              We may share information with trusted third-party vendors who assist in operating our Services, including
              cloud storage providers, payment processors, analytics providers, and customer support systems. These
              service providers are contractually required to protect the confidentiality of your information.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">4.2 Legal Compliance</h3>
            <p className="text-gray-800 leading-relaxed">
              We may disclose information when required to comply with applicable laws, respond to government requests,
              enforce legal rights or agreements, or protect the safety of users or the public.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-3">4.3 Business Transfers</h3>
            <p className="text-gray-800 leading-relaxed">
              In the event of a merger, acquisition, restructuring, or sale of assets, user information may be
              transferred as part of the business transaction, subject to appropriate confidentiality protections.
            </p>
          </section>

          {/* 5. Data Security */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              5. DATA SECURITY
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Company implements reasonable administrative, technical, and physical safeguards to protect personal
              information against unauthorized access, data loss, misuse, or unauthorized disclosure. Security measures
              may include encryption technologies, secure servers, and restricted access to personal information.
              However, no digital transmission or storage system is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* 6. Data Retention */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              6. DATA RETENTION
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We retain personal information only for as long as necessary to provide Services, comply with legal
              obligations, resolve disputes, and enforce agreements. Once data is no longer required, it may be deleted
              or anonymized in accordance with applicable laws.
            </p>
          </section>

          {/* 7. User Rights */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              7. USER RIGHTS
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Subject to applicable laws, Users may have rights to:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Access their personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of personal data, subject to legal retention requirements</li>
              <li>Restrict certain data processing activities</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              Requests may be submitted through the contact details provided in Section 11 below.
            </p>
          </section>

          {/* 8. Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              8. CHILDREN&apos;S PRIVACY
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Platform is not intended for individuals under the age of 18 without parental supervision. We do not
              knowingly collect personal information from children. If we become aware that such data has been
              collected, it will be deleted promptly in accordance with applicable law.
            </p>
          </section>

          {/* 9. Third-Party Links */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              9. THIRD-PARTY LINKS
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Platform may contain links to third-party websites or services. The Company is not responsible for the
              privacy practices or policies of such third parties. Users are encouraged to review the privacy policies
              of those websites independently.
            </p>
          </section>

          {/* 10. Changes */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              10. CHANGES TO THIS PRIVACY POLICY
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Company reserves the right to update or modify this Privacy Policy at any time. Any changes will be
              posted on the Platform with an updated <strong>&quot;Last Updated&quot;</strong> date. Continued use of
              the Platform after such updates constitutes acceptance of the revised Policy.
            </p>
          </section>

          {/* 11. Contact */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold" style={{ color: '#102333' }}>
              11. CONTACT INFORMATION
            </h2>
            <p className="text-gray-800 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy or your personal information, you may
              contact us at:
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>FIBERISE FIT PRIVATE LIMITED – LYTE</strong>
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Email:</strong> support@fiberisefit.com
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Phone:</strong> +91-7070705026
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Website:</strong> www.fiberisefit.com
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer
          className="mt-7 py-6 rounded-2xl text-center text-sm text-gray-300"
          style={{ backgroundColor: '#102333' }}
        >
          © FIBERISE FIT PRIVATE LIMITED — LYTE — All rights reserved
        </footer>
      </div>
    </div>
  )
}
