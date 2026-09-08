import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO/SEO';
import './LegalPageLayout.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function LegalPageLayout({ title, description, lastUpdated, children }) {
  return (
    <>
      <SEO 
        title={`${title} — Taksha Nexus`}
        description={description}
      />

      <article className="legal-page">
        <header className="section legal-hero">
          <div className="container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1 className="h2">{title}</h1>
              {lastUpdated && <p className="legal-updated">Last Updated: {lastUpdated}</p>}
            </motion.div>
          </div>
        </header>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="legal-layout">
              <aside className="legal-sidebar">
                <nav className="legal-nav" aria-label="Legal pages">
                  <h3 className="h6">Legal</h3>
                  <ul className="legal-nav-list">
                    <li>
                      <Link to="/privacy-policy" className={title === 'Privacy Policy' ? 'is-active' : ''}>
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms-and-conditions" className={title === 'Terms & Conditions' ? 'is-active' : ''}>
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </nav>
              </aside>

              <div className="legal-content" role="region" aria-label="Legal content">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  {children}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
