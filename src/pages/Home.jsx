/* =======================================================================
   Home Page — Tactile Premium Hybrid Redesign
   ======================================================================= */
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowDown, Palette, Layout, Code, Bot } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import StructuredData, { localBusinessSchema } from '../components/StructuredData/StructuredData';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import Button from '../components/Button/Button';
import { usePrefersReducedMotion } from '../context/MotionPreferenceContext';
import './Home.css';

// Lazy load ThreeHero to avoid blocking initial render
const ThreeHero = lazy(() => import('../components/ThreeHero/ThreeHero'));

/* -----------------------------------------------------------------------
   Services data
   ----------------------------------------------------------------------- */const SERVICES = [
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Logos, visual systems, and brand foundations built to scale.',
    path: '/services/brand-identity',
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description: 'Interfaces designed around clarity, hierarchy, and behavior.',
    path: '/services/ui-ux-design',
  },
  {
    icon: Code,
    title: 'Engineering',
    description: 'Fast, accessible, precision-built React frontends.',
    path: '/services/website-design',
  },
  {
    icon: Bot,
    title: 'AI Automation',
    description: 'Chatbots and workflows that remove friction from your business.',
    path: '/services/ai-automation',
  },
];

const PROCESS_STEPS = [
  { number: '01', label: 'Discover' },
  { number: '02', label: 'Shape' },
  { number: '03', label: 'Build' },
  { number: '04', label: 'Refine' },
  { number: '05', label: 'Launch' },
];

const MANIFESTO_LINES = [
  'We believe technology means nothing without intention.',
  'We believe design is a form of respect for the people who use it.',
  'We believe simplicity takes more discipline than complexity.',
  'We believe craft is not a phase of a project — it\'s the standard for all of it.',
  'We are Taksha Nexus. We carve, shape, and build — with precision.',
];

/* -----------------------------------------------------------------------
   Animation variants
   ----------------------------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }, // tactile ease
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */
export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <SEO
        title={null}
        description="Taksha Nexus is a digital craft studio blending branding, design, engineering, and AI to build digital experiences ambitious businesses are proud to own."
        canonical="/"
      />
      <StructuredData schema={localBusinessSchema()} />

      <HeroSection prefersReducedMotion={prefersReducedMotion} />
      <CraftPhilosophy />
      <ServicesOverview />
      <ProcessPreview />
      <WhyTaksha />
      <BrandManifesto prefersReducedMotion={prefersReducedMotion} />
      <FinalCTA />
    </>
  );
}

/* =======================================================================
   HERO SECTION
   ======================================================================= */
function HeroSection({ prefersReducedMotion }) {
  const scrollToNext = () => {
    const next = document.querySelector('.craft-section');
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero__inner">
          <motion.div
            className="hero__content"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="hero__headline" variants={fadeUp} custom={0}>
              <span className="hero__headline-top">CRAFTING</span><br/>
              <span className="hero__headline-bottom highlight-block">DIGITAL</span><br/>
              <span className="hero__headline-top">EXCELLENCE.</span>
            </motion.h1>
            <motion.p className="hero__subhead" variants={fadeUp} custom={1}>
              Taksha Nexus blends branding, design, engineering, and AI to build digital
              experiences ambitious businesses are proud to own.
            </motion.p>
            <motion.div className="hero__ctas" variants={fadeUp} custom={2}>
              <Button to="/work" variant="primary" size="lg" icon={<ArrowRight />}>
                View Our Work
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Start a Project
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            aria-hidden="true"
          >
            <div className="hero__visual-canvas-container">
               <Suspense fallback={null}>
                 <ThreeHero prefersReducedMotion={prefersReducedMotion} />
               </Suspense>
            </div>
          </motion.div>
        </div>
      </div>

      <button className="hero__scroll-cue tactile-press" onClick={scrollToNext} aria-label="Scroll to next section">
        <span>Scroll to explore</span>
        <ArrowDown className="hero__scroll-cue-arrow" />
      </button>
    </section>
  );
}

/* =======================================================================
   CRAFT PHILOSOPHY (The Meaning Section)
   ======================================================================= */
function CraftPhilosophy() {
  return (
    <section className="section section--lg craft-section">
      <div className="container content-medium">
        <motion.div 
          className="meaning-panel neu-inset"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="meaning-panel__inner clay-panel">
            <span className="text-eyebrow meaning-panel__eyebrow">The Meaning Behind Taksha Nexus</span>
            <h2 className="meaning-panel__title">To carve. To shape. To craft &mdash; with precision.</h2>
            <p className="meaning-panel__text">
              Taksha Nexus comes from the Sanskrit '<span lang="sa">Takṣa</span>' — the act of shaping something with intention and skill. We apply that same philosophy to digital products: nothing is default, nothing is templated. Every interface, every interaction, every line of code is considered.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================================================================
   SERVICES OVERVIEW
   ======================================================================= */
function ServicesOverview() {
  return (
    <section className="section section--lg" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title="Four disciplines. One studio."
          align="center"
        />

        <motion.div
          className="services-overview__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {SERVICES.map((service, i) => (
            <motion.div key={service.title} variants={fadeUp} custom={i}>
              <Link to={service.path} className="service-card tactile-surface tactile-press">
                <div className="service-card__icon-wrapper neu-inset">
                  <service.icon className="service-card__icon" aria-hidden="true" />
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <div className="service-card__arrow-btn"><ArrowRight size={18} /></div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button to="/services" variant="secondary" size="lg" icon={<ArrowRight />}>
            Explore All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================================================================
   PROCESS PREVIEW
   ======================================================================= */
function ProcessPreview() {
  return (
    <section className="section section--lg">
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title="A process built on clarity, not guesswork."
          align="center"
        />

        <div className="process-tactile__container">
          <motion.div
            className="process-tactile__grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={step.number} className="process-tactile__step tactile-surface" variants={fadeUp} custom={i}>
                <div className="process-tactile__number clay-panel clay-panel--yellow">{step.number}</div>
                <div className="process-tactile__label">{step.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button to="/process" variant="primary" size="lg" icon={<ArrowRight />}>
            See Our Full Process
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================================================================
   WHY TAKSHA
   ======================================================================= */
function WhyTaksha() {
  return (
    <section className="section section--lg" style={{ background: 'var(--color-surface-inset)' }}>
      <div className="container">
        <div className="why-taksha__inner clay-panel" style={{ padding: 'var(--space-8)' }}>
          <motion.div
            className="why-taksha__body"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.span className="text-eyebrow" variants={fadeUp} style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
              Why Taksha Nexus
            </motion.span>
            <motion.h2 className="h2" variants={fadeUp} style={{ marginBottom: 'var(--space-6)' }}>
              A new studio. An honest one.
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
              We won't show you fabricated testimonials or invented client logos — because we don't
              have any yet, and pretending otherwise isn't craftsmanship. What we do have is original,
              self-initiated work built to the same standard we'd bring to yours.
            </motion.p>
            <motion.p variants={fadeUp} style={{ fontSize: 'var(--text-lg)' }}>
              Taksha Nexus isn't a web development agency. We're a Digital Craft Studio — branding, design,
              engineering, and AI, combined with intention.
            </motion.p>
          </motion.div>

          <motion.div
            className="why-taksha__stats"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div className="stat-callout tactile-surface" variants={fadeUp} custom={0}>
              <CountUp target={9} className="stat-callout__number" />
              <p className="stat-callout__label">
                Self-initiated concept projects across multiple domains
              </p>
            </motion.div>
            <motion.div className="stat-callout tactile-surface" variants={fadeUp} custom={1}>
              <CountUp target={95} suffix="+" className="stat-callout__number" />
              <p className="stat-callout__label">
                Target Lighthouse score on every build we ship
              </p>
            </motion.div>
            <motion.div className="stat-callout tactile-surface" variants={fadeUp} custom={2}>
              <span className="stat-callout__number" style={{ fontSize: 'var(--text-2xl)' }}>WCAG 2.2</span>
              <p className="stat-callout__label">
                AA accessibility as a baseline, not an afterthought
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Counter animation for stat numbers */
function CountUp({ target, suffix = '', className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setCount(target);
      return;
    }

    const duration = 1200;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

/* =======================================================================
   BRAND MANIFESTO
   ======================================================================= */
function BrandManifesto({ prefersReducedMotion }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-20%' });
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      setActiveIndex(MANIFESTO_LINES.length - 1);
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (sectionHeight + viewportHeight * 0.5)
      ));
      const index = Math.floor(scrollProgress * MANIFESTO_LINES.length) - 1;
      setActiveIndex(Math.min(index, MANIFESTO_LINES.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion, isInView]);

  return (
    <section className="manifesto" ref={sectionRef}>
      <div className="container content-medium">
        <div className="manifesto__lines">
          {MANIFESTO_LINES.map((line, i) => (
            <p
              key={i}
              className={`manifesto__line ${i <= activeIndex ? 'manifesto__line--visible' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =======================================================================
   FINAL CTA
   ======================================================================= */
function FinalCTA() {
  return (
    <section className="section section--lg final-cta" style={{ background: 'var(--color-ink)', color: 'var(--color-bg)' }}>
      <div className="container">
        <motion.div
          className="final-cta__content tactile-surface"
          style={{ background: 'var(--color-accent)', color: 'var(--color-ink)', padding: 'var(--space-12)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2 className="final-cta__heading" variants={fadeUp} style={{ fontSize: 'var(--text-4xl)' }}>
            Have a project worth crafting well?
          </motion.h2>
          <motion.p className="final-cta__subhead" variants={fadeUp} style={{ fontSize: 'var(--text-xl)' }}>
            Tell us what you're building. We'll tell you how we'd approach it.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight />}>
              Start a Project
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
