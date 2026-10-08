import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Fiberise Fit',
  description:
    'Understand how Fiberise Fit collects, stores and protects your personal information. Your privacy and data security are our priority.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-white p-10 rounded-2xl shadow-2xl mb-7" style={{ backgroundColor: '#102333' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-300">Last updated on Oct 30th 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ backgroundColor: 'rgba(16, 35, 51, 0.12)', color: '#102333' }}>
            Introduction
          </span>
          <p className="text-gray-800 leading-relaxed mb-4">
            This privacy policy sets out how FIBERISE FIT PRIVATE LIMITED uses and protects any information that you give FIBERISE FIT PRIVATE LIMITED when you visit their website and/or agree to purchase from them.
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            FIBERISE FIT PRIVATE LIMITED is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
          </p>
          <p className="text-gray-800 leading-relaxed">
            FIBERISE FIT PRIVATE LIMITED may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#102333' }}>1. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Name</li>
            <li>Contact information including email address</li>
            <li>Demographic information such as postcode, preferences and interests, if required</li>
            <li>Other information relevant to customer surveys and/or offers</li>
          </ul>
        </div>

        {/* What We Do With Information */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#102333' }}>2. What We Do With the Information We Gather</h2>
          <p className="text-gray-800 leading-relaxed mb-4">We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
          <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
            <li>Internal record keeping.</li>
            <li>We may use the information to improve our products and services.</li>
            <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
            <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
          </ul>
          <p className="text-gray-800 leading-relaxed">We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#102333' }}>3. How We Use Cookies</h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            A cookie is a small file which asks permission to be placed on your computer&apos;s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
          </p>
          <p className="text-gray-800 leading-relaxed">
            You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
          </p>
        </div>

        {/* Controlling Your Information */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#102333' }}>4. Controlling Your Personal Information</h2>
          <p className="text-gray-800 leading-relaxed mb-4">You may choose to restrict the collection or use of your personal information in the following ways:</p>
          <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
            <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
            <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us</li>
          </ul>
          <p className="text-gray-800 leading-relaxed mb-4">
            We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
          </p>
          <p className="text-gray-800 leading-relaxed">
            If you believe that any information we are holding on you is incorrect or incomplete, please write to 731/508 S/F, PLOT NO.7 BLOCK 56 DB GUPTA ROAD Karol Bagh Central Delhi New Delhi Delhi India 110005 Sat Nagar SO DELHI 110005 or contact us as soon as possible. We will promptly correct any information found to be incorrect.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl p-6 mb-7 border" style={{ background: 'linear-gradient(to bottom right, #f8fafc, rgba(16, 35, 51, 0.06))', borderColor: 'rgba(16, 35, 51, 0.2)' }}>
          <p className="text-sm text-gray-600 leading-relaxed">
            Disclaimer: The above content is created at FIBERISE FIT PRIVATE LIMITED&apos;s sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant&apos;s non-adherence to it.
          </p>
        </div>

        <footer className="mt-7 py-6 rounded-2xl text-center text-sm text-gray-300" style={{ backgroundColor: '#102333' }}>
          © FIBERISE FIT PRIVATE LIMITED — All rights reserved
        </footer>
      </div>
    </div>
  )
}
