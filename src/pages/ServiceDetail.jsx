import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import StructuredData, { serviceSchema } from '../components/StructuredData/StructuredData';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import Button from '../components/Button/Button';
import { getServiceBySlug } from '../content/services';
import { allProjects } from '../content/projects';
import './ServiceDetail.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <section className="section section--lg" style={{ textAlign: 'center', paddingTop: 'calc(var(--space-24) + 64px)' }}>
        <div className="container">
          <h1 className="h2">Service not found</h1>
          <p style={{ marginBlock: 'var(--space-6)' }}>This service page doesn't exist.</p>
          <Button to="/services" variant="primary" icon={<ArrowLeft />} iconPosition="left">Back to Services</Button>
        </div>
      </section>
    );
  }

  // Find related projects (just match first category or string match for simplicity)
  const _relatedProjects = allProjects
    .filter((p) => p.categories.some((c) => c.toLowerCase().includes(service.title.split(' ')[0].toLowerCase())))
    .slice(0, 2);

  return (
    <>
      <SEO
        title={`${service.title} — Taksha Nexus Services`}
        description={service.tagline}
        canonical={`/services/${service.slug}`}
      />
      <StructuredData schema={serviceSchema(service.title, service.tagline, `/services/${service.slug}`)} />

      <article className="service-detail">
        {/* Hero Section */}
        <header className="service-hero section section--lg">
          <div className="container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="service-hero__content"
            >
              <span className="eyebrow">Service</span>
              <h1 className="h1">{service.title}</h1>
              <p className="service-hero__tagline">{service.tagline}</p>
            </motion.div>
          </div>
        </header>

        {/* Overview & Ideal For */}
        <section className="section service-overview-section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="service-grid">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="service-overview"
              >
                <h2 className="h3">Overview</h2>
                <p>{service.overview}</p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="service-ideal"
              >
                <h2 className="h3">Ideal For</h2>
                <ul className="service-list">
                  {service.idealClients.map((client, i) => (
                    <li key={i}>
                      <CheckCircle2 className="service-list__icon" size={20} />
                      <span>{client}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Deliverables & Timeline */}
        <section className="section">
          <div className="container">
            <div className="service-grid">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="service-deliverables"
              >
                <h2 className="h3">What You Get</h2>
                <ul className="service-list service-list--bordered">
                  {service.deliverables.map((item, i) => (
                    <li key={i}>
                      <CheckCircle2 className="service-list__icon" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="service-timeline"
              >
                <div className="timeline-card">
                  <Clock className="timeline-card__icon" size={32} />
                  <h3 className="h4">Typical Timeline</h3>
                  <p>{service.timeline}</p>
                  <p className="timeline-card__note">
                    *Timelines vary based on specific project scope and feedback cycles.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="section" style={{ background: 'var(--color-surface)' }}>
            <div className="container service-faqs-container">
              <SectionHeading title="Frequently Asked Questions" as="h2" />
              <div className="service-faqs">
                {service.faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={fadeUp}
                    className="faq-item"
                  >
                    <h3 className="h5 faq-item__q">{faq.question}</h3>
                    <p className="faq-item__a">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="section section--lg service-cta">
          <div className="container text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <h2 className="h2" style={{ marginBottom: 'var(--space-4)' }}>
                Ready to start your project?
              </h2>
              <p style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
                Let's discuss how our {service.title.toLowerCase()} service can help you achieve your goals.
              </p>
              <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight />}>
                Start a Conversation
              </Button>
            </motion.div>
          </div>
        </section>
      </article>
    </>
  );
}
