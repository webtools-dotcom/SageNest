import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export const PrivacyPage = () => {
  return (
    <main id="main-content" className="container article">
      <SEOHead
        title="Privacy Policy — SageNest"
        description="SageNest's privacy-first approach: all calculations happen in your browser with zero data collection. Learn how we protect your privacy."
        canonicalPath="/privacy"
      />

      <h1>Privacy Policy</h1>
      
      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
        <strong>Last Updated:</strong> February 14, 2026
      </p>

      <p style={{ 
        background: 'var(--sage-softest)', 
        padding: 'var(--space-lg)', 
        borderRadius: 'var(--radius-md)',
        borderLeft: '4px solid var(--sage-primary)',
        marginBottom: 'var(--space-xl)'
      }}>
        <strong>Our Privacy Promise:</strong> SageNest does not collect, store, transmit, or share 
        any personal information. All pregnancy calculations happen entirely in your browser. We 
        never see your data.
      </p>

      <h2>Introduction</h2>
      <p>
        At SageNest, we understand that pregnancy is a deeply personal experience, and your privacy 
        is paramount. This Privacy Policy explains our privacy-first approach and how we've designed 
        our tools to ensure your information remains completely private.
      </p>

      <h2>What Information We Do NOT Collect</h2>
      <p>
        Unlike most online tools, SageNest is designed with privacy at its core. We do not collect, 
        store, process, or transmit:
      </p>
      <ul>
        <li>Last menstrual period (LMP) dates</li>
        <li>Cycle length information</li>
        <li>Conception dates or IVF transfer dates</li>
        <li>Embryo age or fertility treatment details</li>
        <li>Calculated due dates or gestational ages</li>
        <li>Personal identification information (name, email, phone number)</li>
        <li>Location data or IP addresses</li>
        <li>Device information or browser fingerprints</li>
        <li>Usage patterns or browsing history</li>
        <li>Any other personal or health information</li>
      </ul>

      <h2>How Our Calculator Works</h2>
      
      <h3>Client-Side Processing Only</h3>
      <p>
        Our pregnancy due date calculator is a "client-side" tool, which means:
      </p>
      <ul>
        <li>All calculations happen entirely in your web browser on your device</li>
        <li>The dates and information you enter never leave your device</li>
        <li>No data is sent to our servers or any third-party servers</li>
        <li>Your information is not stored in any database</li>
        <li>When you close your browser or leave the page, your information disappears</li>
      </ul>

      <h3>Technical Implementation</h3>
      <p>
        For those interested in the technical details:
      </p>
      <ul>
        <li>The calculator uses JavaScript to perform calculations in your browser</li>
        <li>No form data is submitted to any server</li>
        <li>No cookies are set to track your usage</li>
        <li>No third-party analytics or tracking scripts are loaded</li>
        <li>The website is a static application with no backend database</li>
      </ul>

      <h2>Website Hosting and Infrastructure</h2>
      
      <h3>Static Site Hosting</h3>
      <p>
        SageNest is hosted as a static website on Cloudflare Pages. This means:
      </p>
      <ul>
        <li>The website consists only of HTML, CSS, and JavaScript files</li>
        <li>There is no server-side processing of your data</li>
        <li>Cloudflare may collect standard web server logs (IP addresses, access times) for security and performance purposes, but this information is not shared with us</li>
        <li>We do not have access to Cloudflare's logs or any visitor information</li>
      </ul>

      <h3>SSL/TLS Encryption</h3>
      <p>
        All connections to SageNest use HTTPS encryption to protect the privacy of your browsing 
        session, even though no personal data is transmitted.
      </p>

      <h2>Cookies and Local Storage</h2>
      
      <h3>No Tracking Cookies</h3>
      <p>
        SageNest does not use cookies to:
      </p>
      <ul>
        <li>Track your visits or behavior</li>
        <li>Store personal information</li>
        <li>Identify you across browsing sessions</li>
        <li>Share data with third parties</li>
      </ul>

      <h3>Local Browser Storage (If Implemented)</h3>
      <p>
        While currently not implemented, we may use your browser's local storage in the future for 
        convenience features such as:
      </p>
      <ul>
        <li>Remembering your preferred cycle length</li>
        <li>Saving your due date for quick reference</li>
      </ul>
      <p>
        If implemented, this information would:
      </p>
      <ul>
        <li>Be stored only on your device</li>
        <li>Never be transmitted to our servers</li>
        <li>Be completely under your control (you can clear it anytime)</li>
        <li>Require your explicit consent before use</li>
      </ul>

      <h2>Third-Party Services</h2>

      <h3>Google Fonts</h3>
      <p>
        Our website uses Google Fonts to display text beautifully. When you visit SageNest:
      </p>
      <ul>
        <li>Your browser may download font files from Google's servers</li>
        <li>Google may collect standard web request information (IP address, user agent)</li>
        <li>We use font preconnect to minimize data sent to Google</li>
        <li>No personal pregnancy information is shared with Google</li>
      </ul>
      <p>
        Google's privacy policy governs this interaction. You can learn more at{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          https://policies.google.com/privacy
        </a>.
      </p>

      <h3>No Other Third-Party Services</h3>
      <p>
        We do not use:
      </p>
      <ul>
        <li>Google Analytics or any analytics platforms</li>
        <li>Advertising networks or tracking pixels</li>
        <li>Social media widgets or plugins</li>
        <li>Third-party commenting systems</li>
        <li>Email marketing services</li>
        <li>Customer relationship management (CRM) tools</li>
      </ul>

      <h2>Share and Print Features</h2>

      <h3>Share Functionality</h3>
      <p>
        When you use the "Share" button on your results:
      </p>
      <ul>
        <li>If your device supports Web Share API, a native sharing dialog appears</li>
        <li>You choose which app or contact to share with</li>
        <li>We do not see or track what you share or with whom</li>
        <li>As a fallback, we copy the result to your clipboard (stays on your device)</li>
      </ul>

      <h3>Print Functionality</h3>
      <p>
        The "Print" feature uses your browser's native print dialog and does not send any information 
        to SageNest or external servers.
      </p>

      <h2>Blog and Educational Content</h2>
      <p>
        Our blog articles are static content that you can read without creating an account or 
        providing any information. We do not:
      </p>
      <ul>
        <li>Track which articles you read</li>
        <li>Monitor how long you spend on each page</li>
        <li>Collect email addresses for newsletters</li>
        <li>Require registration to access content</li>
      </ul>

      <h2>Children's Privacy</h2>
      <p>
        SageNest is designed for adults planning or experiencing pregnancy. We do not knowingly 
        collect information from children under 13. Since we don't collect any personal information 
        from anyone, this policy applies universally.
      </p>

      <h2>Your Rights and Control</h2>
      
      <h3>You Are Always in Control</h3>
      <p>
        Because we don't collect your data, you maintain complete control:
      </p>
      <ul>
        <li>No data deletion requests needed—we never have your data</li>
        <li>No opt-out processes—there's nothing to opt out of</li>
        <li>No access requests needed—your data never leaves your device</li>
        <li>No portability concerns—your information is already entirely yours</li>
      </ul>

      <h3>Browser Privacy Settings</h3>
      <p>
        You can enhance your privacy further by:
      </p>
      <ul>
        <li>Using private/incognito browsing mode</li>
        <li>Clearing your browser history after using the calculator</li>
        <li>Using browser extensions that block third-party requests</li>
        <li>Disabling JavaScript (though this will prevent the calculator from working)</li>
      </ul>

      <h2>Security</h2>
      <p>
        While we don't store your data, we take security seriously:
      </p>
      <ul>
        <li>All connections use HTTPS encryption</li>
        <li>Our code is regularly reviewed for vulnerabilities</li>
        <li>We use a modern, secure hosting platform (Cloudflare Pages)</li>
        <li>We keep our dependencies updated to patch security issues</li>
      </ul>
      <p>
        Because all processing happens in your browser and no data is transmitted, the security of 
        your pregnancy information depends primarily on the security of your own device.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or 
        for legal reasons. Any changes will be posted on this page with an updated "Last Updated" date.
      </p>
      <p>
        If we ever change our fundamental privacy-first approach (which we have no plans to do), we 
        will notify users prominently on our website.
      </p>

      <h2>International Users</h2>
      <p>
        SageNest is available to users worldwide. Because we don't collect any personal data:
      </p>
      <ul>
        <li>There are no cross-border data transfers to worry about</li>
        <li>No GDPR compliance issues (we exceed GDPR requirements by collecting nothing)</li>
        <li>No data residency concerns</li>
        <li>No varying privacy laws affecting your use</li>
      </ul>

      <h2>Legal Basis for Processing (GDPR)</h2>
      <p>
        For users in the European Union: We do not process any personal data as defined by GDPR. 
        The calculations you perform happen entirely on your device, and no data is collected, 
        stored, or processed by us.
      </p>

      <h2>California Privacy Rights (CCPA)</h2>
      <p>
        For California residents: Because we do not collect any personal information, the California 
        Consumer Privacy Act does not apply to our services. We do not:
      </p>
      <ul>
        <li>Sell personal information</li>
        <li>Share personal information for cross-context behavioral advertising</li>
        <li>Collect sensitive personal information</li>
      </ul>

      <h2>Data Breach Notification</h2>
      <p>
        Because we do not collect, store, or process any personal data, there is no risk of a data 
        breach involving your pregnancy information. Your data never exists on our systems.
      </p>

      <h2>Comparison with Other Pregnancy Tools</h2>
      <p>
        Many pregnancy apps and calculators:
      </p>
      <ul>
        <li>Require account creation with email</li>
        <li>Store your pregnancy dates and information</li>
        <li>Use tracking analytics to monitor your usage</li>
        <li>Share data with advertising partners</li>
        <li>Send marketing emails</li>
      </ul>
      <p>
        SageNest does none of these things. We believe your pregnancy planning should be private.
      </p>

      <h2>Contact and Questions</h2>
      <p>
        If you have questions about this Privacy Policy or our privacy practices, please note:
      </p>
      <ul>
        <li>We cannot answer questions about your specific pregnancy (consult your healthcare provider)</li>
        <li>We cannot retrieve or delete your data (we never have it)</li>
        <li>We can answer general questions about how our privacy practices work</li>
      </ul>

      <h2>Transparency Commitment</h2>
      <p>
        We are committed to complete transparency about our privacy practices:
      </p>
      <ul>
        <li>This policy is written in plain language, not legalese</li>
        <li>We explicitly state what we DON'T collect (everything)</li>
        <li>Our technical implementation matches our privacy promises</li>
        <li>Users can verify our claims by inspecting our code (it's all client-side)</li>
      </ul>

      <h2>Why We Built SageNest This Way</h2>
      <p>
        We believe privacy is a fundamental right, especially during pregnancy. Many pregnancy apps 
        collect extensive personal data that could be sensitive if breached or misused. By designing 
        SageNest as a completely client-side tool, we ensure:
      </p>
      <ul>
        <li>Your pregnancy planning remains entirely private</li>
        <li>You don't have to trust us with your data (we never have it)</li>
        <li>There's no risk of data breaches compromising your information</li>
        <li>You can use our tools without creating accounts or sharing email addresses</li>
      </ul>

      <div className="cta-inline" style={{ marginTop: 'var(--space-2xl)' }}>
        <h3>Calculate Your Due Date Privately</h3>
        <p style={{ marginBottom: 'var(--space-md)' }}>
          Your information stays on your device. Always.
        </p>
        <Link to="/pregnancy-due-date-calculator">Open Calculator</Link>
      </div>

      <p className="disclaimer" style={{ marginTop: 'var(--space-2xl)' }}>
        This privacy policy applies to SageNest (sagenest.app). If you have concerns about privacy 
        practices of other websites or services, please review their respective privacy policies.
      </p>
    </main>
  );
};
