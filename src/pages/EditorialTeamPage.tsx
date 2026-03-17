import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { DisclaimerBox } from '../components/DisclaimerBox';

export const EditorialTeamPage = () => {
  return (
    <main id="main-content" className="container article">
      <SEOHead
        title="SageNest Editorial Team – Our Research Standards"
        description="Learn how the SageNest Editorial Team researches and writes pregnancy and women's health content using ACOG, WHO, CDC, NIH, and IOM guidelines."
        canonicalPath="/editorial-team"
      />

      <h1>SageNest Editorial Team</h1>

      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
        Every article on SageNest is researched and written to a single standard: accurate enough
        that you can bring it to your provider's appointment and not be embarrassed by it.
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }}>
        Last reviewed: March 2026
      </p>

      <h2>Who We Are</h2>
      <p>
        The SageNest Editorial Team is a dedicated research and writing team focused exclusively on
        pregnancy, fertility, and women's health content. We are not a content farm, and we do not
        publish to fill a content calendar. Every article we publish exists because a real question
        — one that women are actively searching for — deserves a thorough, honest answer grounded in
        clinical evidence.
      </p>
      <p>
        We operate under a strict editorial policy: no personal opinions, no anecdotal claims, and
        no information sourced from unverified platforms. If a clinical claim cannot be traced to a
        recognised authority in obstetrics or women's health, it does not appear on SageNest.
      </p>

      <h2>Our Primary Sources</h2>
      <p>
        Every article on SageNest draws its clinical content from guidelines and research published
        by the following institutions:
      </p>
      <ul>
        <li>
          <strong>
            <a href="https://www.acog.org" target="_blank" rel="noopener noreferrer">ACOG</a>
          </strong>{' '}
          — American College of Obstetricians and Gynecologists. The leading
          professional body for obstetric and gynecologic care in the United States, whose practice
          bulletins and committee opinions set the clinical standard for pregnancy management.
        </li>
        <li>
          <strong>
            <a href="https://www.who.int/health-topics/maternal-health" target="_blank" rel="noopener noreferrer">WHO</a>
          </strong>{' '}
          — World Health Organization. The United Nations agency responsible
          for international public health, whose guidelines on maternal and reproductive health are
          used globally.
        </li>
        <li>
          <strong>
            <a href="https://www.cdc.gov/reproductivehealth/index.htm" target="_blank" rel="noopener noreferrer">CDC</a>
          </strong>{' '}
          — Centers for Disease Control and Prevention. The US federal agency
          providing data-driven guidance on maternal health, pregnancy complications, and
          reproductive outcomes.
        </li>
        <li>
          <strong>
            <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer">NIH / NCBI</a>
          </strong>{' '}
          — National Institutes of Health and its National Center for
          Biotechnology Information, which hosts peer-reviewed clinical research through PubMed.
        </li>
        <li>
          <strong>
            <a href="https://www.nationalacademies.org" target="_blank" rel="noopener noreferrer">IOM / NAM</a>
          </strong>{' '}
          — Institute of Medicine, now the National Academy of Medicine.
          The source of the evidence-based gestational weight gain guidelines used by providers
          across the US.
        </li>
        <li>
          <strong>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/basics/healthy-pregnancy/hlv-20049471" target="_blank" rel="noopener noreferrer">Mayo Clinic</a>
          </strong>{' '}
          — Used selectively for general clinical summaries where ACOG
          or NIH guidance is corroborated.
        </li>
      </ul>

      <h2>How We Research and Write</h2>

      <h3>We paraphrase, never quote</h3>
      <p>
        All clinical information is paraphrased from primary sources. We do not reproduce sentences
        or passages from published guidelines or articles. This keeps our content original and
        ensures we are synthesising information rather than simply relaying it.
      </p>

      <h3>Every specific claim is attributed</h3>
      <p>
        Any statistic, threshold, or clinical recommendation in a SageNest article is attributed by
        name to its source. You will never see "studies suggest" without knowing which study or
        institution it refers to. If we cannot name the source, we do not publish the claim.
      </p>

      <h3>We do not sensationalise</h3>
      <p>
        Health content that frightens readers into engagement is a pattern we actively avoid. Our
        tone is the same in every article: calm, direct, and specific. We state risks where they
        exist and in the proportions the evidence supports — not amplified for clicks.
      </p>

      <h3>Every article includes a "When to Call Your Doctor" section</h3>
      <p>
        This is a non-negotiable part of every post we publish. It lists specific, observable red
        flags — not vague reassurances — because we believe health content should always direct
        readers toward professional care, not substitute for it.
      </p>

      <h2>What We Do Not Do</h2>
      <ul>
        <li>We do not publish dosage recommendations without a "as directed by your provider" qualifier</li>
        <li>We do not make claims that any food, supplement, or practice prevents miscarriage or birth defects</li>
        <li>We do not write in ways that could be read as diagnosing a condition</li>
        <li>We do not discourage readers from seeking medical care under any circumstances</li>
        <li>We do not source content from social media, forums, or unverified health blogs</li>
      </ul>

      <h2>Our Editorial Standards in Practice</h2>
      <p>
        Before any article is published on SageNest, it must satisfy the following criteria without
        exception:
      </p>
      <ul>
        <li>All clinical claims are attributed to ACOG, WHO, CDC, NIH, IOM, or equivalent authority</li>
        <li>The article contains a specific, actionable "When to Call Your Doctor" section</li>
        <li>No sentences are reproduced verbatim from external sources</li>
        <li>The medical disclaimer is present at the end of the article</li>
        <li>The content does not contradict current guidelines from the above institutions</li>
        <li>At least one link to a relevant SageNest tool is included where genuinely useful to the reader</li>
      </ul>

      <h2>Why This Matters for Health Content</h2>
      <p>
        Google's quality evaluation framework for health content — sometimes referred to as E-E-A-T
        (Experience, Expertise, Authoritativeness, Trustworthiness) — exists because the stakes of
        inaccurate health information are real. A pregnant woman reading an article about ovulation
        timing, weight gain, or a worrying symptom is not looking for engagement. She is looking for
        an answer she can act on. We take that responsibility seriously.
      </p>
      <p>
        SageNest was built to be the resource that gives her that answer clearly, accurately, and
        without asking for her data, her email address, or her attention in exchange for an ad.
      </p>

      <h2>About SageNest's Tools</h2>
      <p>
        In addition to editorial content, The calculation methods used in our tools align with formulas used by healthcare providers — including the{' '}
        <Link to="/pregnancy-due-date-calculator">Pregnancy Due Date Calculator</Link>,{' '}
        <Link to="/pregnancy-weight-gain-calculator">Pregnancy Weight Gain Calculator</Link>, and{' '}
        <Link to="/ovulation-calculator">Ovulation Calculator</Link>. All calculation methods align
        with formulas used by healthcare providers, including Naegele's Rule, IOM gestational weight
        gain bands, and standard IVF embryo dating adjustments.
      </p>

      <div className="cta-inline" style={{ marginTop: 'var(--space-2xl)' }}>
        <h3>Explore Our Content</h3>
        <Link to="/blog">Browse all articles</Link>
      </div>
      <DisclaimerBox />
    </main>
  );
};
