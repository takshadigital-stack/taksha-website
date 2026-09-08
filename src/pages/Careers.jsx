import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, Clock, Code, Database, 
  Users, Zap, Heart, 
  Gift, TrendingUp, Globe, X
} from 'lucide-react';
import SEO from '../components/SEO/SEO';
import ApplicationForm from '../components/ApplicationForm';
import './Careers.css';

const ROLES = [
  {
    id: 'DEV001',
    category: 'DEVELOPMENT',
    categoryColor: 'var(--color-card-lilac)',
    title: 'Frontend Developer Intern',
    desc: 'Work on modern web interfaces using React, Tailwind CSS and building amazing user experiences.',
    location: 'Remote',
    duration: '3 Months',
    icon: Code,
    btnColor: 'var(--color-card-lilac)',
    responsibilities: [
      'Develop interactive and responsive user interfaces',
      'Collaborate with designers to implement UI/UX designs',
      'Optimize application for maximum speed and scalability'
    ],
    requirements: [
      'Basic knowledge of React and JavaScript (ES6+)',
      'Understanding of HTML5, CSS3, and responsive design',
      'Familiarity with Git and version control',
      'Strong problem-solving skills'
    ]
  },
  {
    id: 'DEV002',
    category: 'DEVELOPMENT',
    categoryColor: 'var(--color-accent)',
    title: 'Full-Stack Developer Intern',
    desc: 'Build end-to-end features, integrate APIs, and work with databases and cloud services.',
    location: 'Remote',
    duration: '3 Months',
    icon: Database,
    btnColor: 'var(--color-accent)',
    responsibilities: [
      'Design and develop RESTful APIs',
      'Create dynamic frontend components',
      'Manage database schemas and queries'
    ],
    requirements: [
      'Experience with Node.js and Express',
      'Familiarity with SQL or NoSQL databases',
      'Knowledge of React on the frontend',
      'Eagerness to learn cloud deployment'
    ]
  }
];

const BENEFITS = [
  { title: 'Learn & Grow', desc: 'Continuous learning with mentorship and real-world projects.', icon: Users, color: 'var(--color-card-lilac)' },
  { title: 'Flexible Work', desc: 'Remote-first culture with flexible hours that work for you.', icon: Zap, color: 'var(--color-accent)' },
  { title: 'Impact Driven', desc: 'Build products that make a difference in people\'s lives.', icon: Heart, color: 'var(--color-card-mint)' },
  { title: 'Perks & Rewards', desc: 'Exciting perks, recognition and performance rewards.', icon: Gift, color: 'var(--color-card-pink)' },
  { title: 'Career Growth', desc: 'Clear growth path and leadership opportunities.', icon: TrendingUp, color: 'var(--color-card-purple)' },
  { title: 'Inclusive Culture', desc: 'A diverse, inclusive and supportive environment.', icon: Globe, color: 'var(--color-accent)' }
];

export default function Careers() {
  const [selectedRole, setSelectedRole] = React.useState(null);
  
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (selectedRole) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedRole]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <main className="careers-page pt-32 pb-32">
      <SEO 
        title="Careers | Taksha Nexus Internship Platform" 
        description="Join Taksha Nexus and be part of a mission to empower learners and build impactful products." 
      />

      {/* Hero Section */}
      <section className="careers-hero container">
        <div className="careers-hero__content">
          <div className="badge badge--pink">CAREERS</div>
          <h1 className="careers-hero__title">
            Build the Future.<br/>
            Together<span className="dot">.</span>
          </h1>
          <p className="careers-hero__desc">
            Join Taksha Nexus and be part of a mission to empower learners, build impactful products, and create meaningful change.
          </p>
          <div className="careers-hero__actions">
            <button type="button" className="btn btn--primary" onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}>
              View Open Roles <ArrowRight size={20} />
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
              Life at Taksha Nexus <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="careers-hero__visual">
          <div className="illustration-wrapper">
            {/* Sticky Note */}
            <div className="sticky-note">
              {/* ID Card */}
              <div className="id-card">
                <div className="id-card__clip"></div>
                <div className="id-card__lanyard"></div>
                <div className="id-card__photo">
                  <UserIcon />
                </div>
                <div className="id-card__lines">
                  <div className="id-card__line id-card__line--long"></div>
                  <div className="id-card__line id-card__line--short"></div>
                  <div className="id-card__line id-card__line--medium"></div>
                </div>
                <div className="id-card__corner"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="deco deco--zigzag">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10" stroke="var(--color-card-purple)" strokeWidth="4" strokeLinejoin="miter" strokeLinecap="square" />
              </svg>
            </div>
            <div className="deco deco--circle-green"></div>
            <div className="deco deco--circle-purple"></div>
            <div className="deco deco--steps">
              <div className="step-block step-block--3"></div>
              <div className="step-block step-block--2"></div>
              <div className="step-block step-block--1"></div>
            </div>
            <div className="deco deco--cross">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4 L20 20 M20 4 L4 20" stroke="var(--color-card-mint)" strokeWidth="6" strokeLinecap="square" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="roles" className="careers-roles container section-padding">
        <div className="roles-header">
          <div className="roles-header__left">
            <div className="badge badge--lilac">OPEN ROLES</div>
            <h2 className="section-title">Find Your Opportunity</h2>
            <p className="section-desc">Explore exciting opportunities and build your career with us.</p>
          </div>
          <button type="button" className="view-all-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>View All Roles <ArrowRight size={16} /></button>
        </div>

        <motion.div 
          className="roles-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {ROLES.map((role) => (
            <motion.div key={role.id} className="role-card" variants={fadeUp}>
              <div className="role-card__header">
                <span className="role-card__tag" style={{ background: role.categoryColor }}>{role.category}</span>
                <span className="role-card__id">{role.id}</span>
              </div>
              <div className="role-card__icon" style={{ background: role.categoryColor }}>
                <role.icon size={24} />
              </div>
              <h3 className="role-card__title">{role.title}</h3>
              <p className="role-card__desc">{role.desc}</p>
              
              <div className="role-card__meta">
                <span><MapPin size={14} /> {role.location}</span>
                <span><Clock size={14} /> {role.duration}</span>
              </div>

              <button 
                className="role-card__btn" 
                style={{ background: role.btnColor }}
                onClick={() => {
                  setSelectedRole(role);
                  setIsApplied(false);
                }}
              >
                View Details & Apply <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="careers-benefits container section-padding">
        <div className="benefits-header">
          <div className="badge badge--purple">WHY JOIN US</div>
          <h2 className="section-title">Benefits That Matter</h2>
          <p className="section-desc">We care for our team and empower them to do their best work.</p>
        </div>

        <motion.div 
          className="benefits-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {BENEFITS.map((benefit, i) => (
            <motion.div key={i} className="benefit-card" variants={fadeUp}>
              <div className="benefit-card__icon-wrap" style={{ background: benefit.color }}>
                <benefit.icon size={28} strokeWidth={2.5} color="var(--color-ink)" />
              </div>
              <h3 className="benefit-card__title">{benefit.title}</h3>
              <p className="benefit-card__desc">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Role Details & Application Modal */}
      {selectedRole && (
        <div className="role-modal-overlay" onClick={() => setSelectedRole(null)}>
          <div className="role-modal" onClick={e => e.stopPropagation()}>
            <button className="role-modal__close" onClick={() => setSelectedRole(null)}>
              <X size={24} />
            </button>
            
            <div className="role-modal__header" style={{ background: selectedRole.categoryColor }}>
              <div className="role-modal__badge">{selectedRole.category} • {selectedRole.id}</div>
              <h2 className="role-modal__title">{selectedRole.title}</h2>
              <div className="role-card__meta">
                <span><MapPin size={14} /> {selectedRole.location}</span>
                <span><Clock size={14} /> {selectedRole.duration}</span>
              </div>
            </div>

            <div className="role-modal__content">
              <ApplicationForm role={selectedRole} onCancel={() => setSelectedRole(null)} />
            </div>
          </div>
        </div>
      )}
      
      {/* Portal Access Section */}
      <section className="container section-padding" style={{ borderTop: '2px dashed var(--color-ink)', marginTop: 'var(--space-12)', textAlign: 'center' }}>
        <p style={{ fontWeight: '700', marginBottom: 'var(--space-4)' }}>Already part of the team?</p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn--secondary" style={{ background: 'var(--color-bg)', textDecoration: 'none' }}>
            Taksha Nexus Workspace Login <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}

// Simple internal icon for ID card photo
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-bg)' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
