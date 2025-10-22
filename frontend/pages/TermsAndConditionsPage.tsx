import React from 'react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-bg py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2 className="mt-8">1. Introduction</h2>
          <p>
            Welcome to Friends of the Youth (FOTY). These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.
          </p>

          <h2 className="mt-8">2. Use of Our Service</h2>
          <p>
            You agree to use our services for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
          </p>

          <h2 className="mt-8">3. User Accounts</h2>
          <p>
            To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2 className="mt-8">4. Donations</h2>
          <p>
            All donations made to FOTY are voluntary and non-refundable. We use secure third-party payment processors (M-Pesa, Stripe) to handle transactions. FOTY is a registered non-profit organization, and your donation is tax-deductible to the extent permitted by law. We commit to using all donations to further our mission of empowering the youth of Kenya.
          </p>

          <h2 className="mt-8">5. Privacy Policy</h2>
          <p>
            We are committed to protecting your privacy. We collect personal information that you provide to us, such as your name, email address, and phone number when you register, donate, or subscribe to our newsletter. This information is used to process your transactions, communicate with you, and improve our services. We do not sell or share your personal data with third parties for marketing purposes. We may use cookies to enhance your browsing experience. By using our site, you consent to our privacy policy.
          </p>
          
          <h2 className="mt-8">6. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of FOTY or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from any of the content without our express written permission.
          </p>
          
           <h2 className="mt-8">7. User-Generated Content</h2>
          <p>
            By posting content on our community forums, you grant FOTY a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, and display such content in connection with our services and mission. You are responsible for the content you post and must not violate any laws or third-party rights.
          </p>

          <h2 className="mt-8">8. Limitation of Liability</h2>
          <p>
            Our website and services are provided "as is." We do not warrant that the service will be uninterrupted or error-free. In no event shall FOTY be liable for any direct, indirect, incidental, or consequential damages arising out of your use of our services.
          </p>
          
          <h2 className="mt-8">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new terms.
          </p>

          <h2 className="mt-8">10. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law provisions.
          </p>

          <h2 className="mt-8">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:legal@foty.org">legal@foty.org</a>.
          </p>
        </article>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;