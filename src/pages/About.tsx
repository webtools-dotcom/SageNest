import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export const AboutPage = () => {
  return (
    <main id="main-content" className="container article">
      <SEOHead
        title="About SageNest — Evidence-Based Pregnancy Planning Tools"
        description="Learn about SageNest's mission to provide trustworthy, private pregnancy due date calculators and evidence-based guidance for expectant parents."
        canonicalPath="/about"
      />

      <h1>About SageNest</h1>
      
      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
        We believe pregnancy planning should be informed, private, and empowering.
      </p>

      <h2>Our Mission</h2>
      <p>
        SageNest was created to provide expectant parents with accurate, evidence-based pregnancy 
        planning tools that respect your privacy and support informed decision-making. We understand 
        that pregnancy is a deeply personal journey, and you deserve tools that are both trustworthy 
        and easy to use.
      </p>

      <h2>What We Offer</h2>
      
      <h3>Pregnancy Due Date Calculator</h3>
      <p>
        Our primary tool is a comprehensive due date calculator that accounts for various conception 
        methods and individual cycle variations:
      </p>
      <ul>
        <li>
          <strong>LMP-based calculations</strong> with cycle length adjustments (21-40 days) for 
          personalized estimates
        </li>
        <li>
          <strong>IVF-specific dating</strong> for embryo transfers at different developmental stages 
          (day 3, 5, 6, and 7)
        </li>
        <li>
          <strong>Conception date calculations</strong> for those who know their fertilization timing
        </li>
        <li>
          <strong>Gestational age tracking</strong> showing your current week and trimester
        </li>
        <li>
          <strong>Conception window estimates</strong> based on your specific cycle length
        </li>
      </ul>

      <h3>Educational Resources</h3>
      <p>
        Our blog provides comprehensive, research-backed articles on pregnancy planning topics:
      </p>
      <ul>
        <li>How healthcare providers calculate and adjust due dates</li>
        <li>Understanding the difference between LMP dating and ultrasound dating</li>
        <li>IVF pregnancy timelines and milestone tracking</li>
        <li>Week-by-week pregnancy development and what to expect</li>
        <li>Preparing for prenatal appointments and important screenings</li>
      </ul>

      <h2>Our Approach</h2>

      <h3>Evidence-Based Information</h3>
      <p>
        Every calculation method and piece of educational content on SageNest is based on established 
        medical standards and clinical guidelines. Our due date formulas align with those used by 
        healthcare providers, including:
      </p>
      <ul>
        <li>Naegele's Rule for LMP-based dating</li>
        <li>Standard gestational age calculations (280 days from LMP)</li>
        <li>IVF embryo age adjustments (266 days from fertilization)</li>
        <li>Cycle length corrections for irregular menstrual cycles</li>
      </ul>

      <h3>Privacy First</h3>
      <p>
        We take your privacy seriously. Unlike many online tools:
      </p>
      <ul>
        <li>All calculations happen entirely in your browser</li>
        <li>We don't collect, store, or transmit any personal information</li>
        <li>No account creation or email required</li>
        <li>No tracking cookies or analytics that identify you</li>
        <li>No third-party data sharing</li>
      </ul>

      <h3>Accessibility and Ease of Use</h3>
      <p>
        Our calculator is designed to be simple and accessible:
      </p>
      <ul>
        <li>Clean, intuitive interface with step-by-step guidance</li>
        <li>Mobile-friendly design that works on any device</li>
        <li>Instant results without page refreshes</li>
        <li>Local timezone formatting for accurate date display</li>
        <li>Share and print options for easy record-keeping</li>
      </ul>

      <h2>Why Due Dates Matter</h2>
      <p>
        Your estimated due date serves as an important reference point throughout your pregnancy. 
        While only about 5% of babies arrive on their exact due date, this estimate helps:
      </p>
      <ul>
        <li>Schedule prenatal appointments and important screenings</li>
        <li>Monitor fetal growth and development appropriately</li>
        <li>Plan for maternity leave and baby preparation</li>
        <li>Communicate clearly with your healthcare team</li>
        <li>Understand which trimester you're in and what to expect</li>
      </ul>

      <h2>Understanding Our Calculations</h2>

      <h3>Last Menstrual Period (LMP) Method</h3>
      <p>
        This is the most common method used by healthcare providers. We calculate your due date by 
        adding 280 days to the first day of your last period, with adjustments for your cycle length. 
        If your cycle is longer or shorter than 28 days, ovulation likely occurred on a different day, 
        and we adjust accordingly.
      </p>

      <h3>IVF Embryo Transfer Method</h3>
      <p>
        For IVF pregnancies, we use the embryo's age at transfer to calculate a highly accurate due 
        date. Since the exact fertilization date is known, IVF due dates are typically more precise 
        than LMP-based calculations. We account for transfers at day 3, 5, 6, and 7 developmental stages.
      </p>

      <h3>Conception Date Method</h3>
      <p>
        If you know when conception occurred, we calculate your due date by adding 266 days from that 
        date. This method assumes you know the exact day of fertilization.
      </p>

      <h2>Important Limitations</h2>
      <p>
        While our calculator provides accurate estimates based on medical standards, it's important 
        to understand:
      </p>
      <ul>
        <li>
          <strong>This is an educational tool, not medical advice.</strong> Always consult with your 
          healthcare provider for personalized guidance.
        </li>
        <li>
          <strong>Due dates are estimates.</strong> Most babies arrive within a week before or after 
          their estimated due date.
        </li>
        <li>
          <strong>Ultrasound may provide more accurate dating.</strong> First-trimester ultrasounds 
          are considered the gold standard for pregnancy dating and may differ from LMP calculations.
        </li>
        <li>
          <strong>Your provider may adjust your due date.</strong> If there's a significant difference 
          between LMP dating and early ultrasound, your healthcare provider will use the more accurate 
          measurement.
        </li>
      </ul>

      <h2>When to Consult Your Healthcare Provider</h2>
      <p>
        Our calculator is designed to help you plan and prepare, but it doesn't replace professional 
        medical care. Contact your healthcare provider if:
      </p>
      <ul>
        <li>You're uncertain about your last menstrual period date</li>
        <li>You have irregular cycles or underlying health conditions</li>
        <li>Your ultrasound dating significantly differs from your calculated due date</li>
        <li>You have any concerns about your pregnancy</li>
        <li>You experience bleeding, severe pain, or other worrying symptoms</li>
      </ul>

      <h2>How to Use SageNest Effectively</h2>
      <ol>
        <li>
          <strong>Use the calculator early.</strong> Calculate your due date as soon as you know 
          you're pregnant to start planning prenatal care.
        </li>
        <li>
          <strong>Bring your results to your first appointment.</strong> Share your calculated due 
          date with your healthcare provider, who will confirm or adjust it.
        </li>
        <li>
          <strong>Track your pregnancy progress.</strong> Return to see your current gestational age 
          and trimester status.
        </li>
        <li>
          <strong>Read our educational content.</strong> Learn about what to expect week by week and 
          how dating methods work.
        </li>
        <li>
          <strong>Keep records.</strong> Use the share or print features to save your results for 
          your records.
        </li>
      </ol>

      <h2>Our Commitment to You</h2>
      <p>
        SageNest is committed to:
      </p>
      <ul>
        <li>Maintaining the highest standards of accuracy in our calculations</li>
        <li>Protecting your privacy completely—we never see or store your data</li>
        <li>Providing clear, evidence-based information without sensationalism</li>
        <li>Keeping our tools free and accessible to everyone</li>
        <li>Continuously improving based on medical best practices</li>
      </ul>

      <h2>Technical Details</h2>
      <p>
        For those interested in how our calculator works:
      </p>
      <ul>
        <li>Built with React and TypeScript for reliability and performance</li>
        <li>All processing happens client-side (in your browser)</li>
        <li>No backend servers storing your information</li>
        <li>Open calculation methods based on standard medical formulas</li>
        <li>Regular updates to ensure accuracy and usability</li>
      </ul>

      <h2>Questions or Feedback?</h2>
      <p>
        While we don't provide medical advice or personal pregnancy counseling, we welcome feedback 
        about our tools and content. If you notice any technical issues or have suggestions for 
        improvement, please let us know.
      </p>

      <div className="cta-inline" style={{ marginTop: 'var(--space-2xl)' }}>
        <h3>Ready to Calculate Your Due Date?</h3>
        <Link to="/pregnancy-due-date-calculator">Open Calculator</Link>
      </div>

      <p className="disclaimer" style={{ marginTop: 'var(--space-2xl)' }}>
        <strong>Medical Disclaimer:</strong> SageNest provides educational tools for informational 
        purposes only. This calculator does not provide medical advice, diagnosis, or treatment. 
        Always consult with a qualified healthcare provider for personalized medical guidance during 
        pregnancy. Your healthcare provider is the best source for information about your specific 
        situation.
      </p>
    </main>
  );
};
