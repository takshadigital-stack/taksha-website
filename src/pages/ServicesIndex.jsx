/**
 * Services Index Page — Overview hub linking to all 5 services
 * PRD §13.1
 */
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Layout, Globe, Code, Bot } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import Button from '../components/Button/Button';
import { allServices } from '../content/services';
import './ServicesIndex.css';

const ICONS = { 'brand-identity': Palette, 'ui-ux-design': Layout, 'website-design': Globe, 'react-development': Code, 'ai-automation': Bot };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } } };

export default function ServicesIndex() {
  return (
    <>
      <SEO title="Services" description="Explore Taksha Nexus' services — brand identity, UI/UX design, website design, React development, and AI automation. Services built around your goals, not our templates." canonical="/services" />
      <section className="section section--lg" style={{ paddingTop: 'calc(var(--space-24) + 64px)' }}>
        <div className="container">
          <SectionHeading eyebrow="What We Do" title="Services built around your goals, not our templates." as="h1" />
          <div className="services-list">
            {allServices.map((service, i) => {
              const Icon = ICONS[service.slug] || Globe;
              return (
                <motion.div key={service.slug} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className={`service-row ${i % 2 ? 'service-row--reverse' : ''}`}>
                  <div className="service-row__visual" style={{ background: `linear-gradient(135deg, var(--color-accent-soft), var(--color-surface))` }}>
                    <Icon size={64} style={{ color: 'var(--color-accent)', opacity: 0.6 }} />
                  </div>
                  <div className="service-row__content">
                    <h2 className="h3">{service.title}</h2>
                    <p>{service.overview}</p>
                    <Button to={`/services/${service.slug}`} variant="secondary" size="sm" icon={<ArrowRight />}>Learn More</Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="cta-section-services">
        <div className="cta-section-services__inner">
          <h2>Not sure which service you need?</h2>
          <p style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>Tell us about your project and we'll recommend the right approach.</p>
          <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight />}>Start a Conversation</Button>
        </div>
      </section>
    </>
  );
}
