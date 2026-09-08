import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import StructuredData, { localBusinessSchema } from '../components/StructuredData/StructuredData';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import Button from '../components/Button/Button';
import './Contact.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    projectDetails: '',
    timeline: '',
    serviceRequired: initialService ? [initialService] : [],
    honeypot: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const services = [
    'Brand Identity',
    'UI/UX Design',
    'Website Design',
    'React Development',
    'AI Automation',
    'Not sure yet'
  ];

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2 || value.length > 80) error = 'Name must be 2-80 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
        break;
      case 'company':
        if (value.length > 100) error = 'Company name is too long';
        break;
      case 'budget':
        if (!value) error = 'Please select a budget range';
        break;
      case 'timeline':
        if (!value) error = 'Please select a timeline';
        break;
      case 'projectDetails':
        if (!value.trim()) error = 'Project details are required';
        else if (value.length < 20) error = 'Please provide a bit more detail (minimum 20 characters)';
        else if (value.length > 2000) error = 'Project details cannot exceed 2000 characters';
        break;
      case 'serviceRequired':
        if (value.length === 0) error = 'Please select at least one service';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const newServices = checked 
        ? [...formData.serviceRequired, value]
        : formData.serviceRequired.filter(s => s !== value);
      
      setFormData({ ...formData, serviceRequired: newServices });
      
      if (errors.serviceRequired) {
        setErrors({ ...errors, serviceRequired: validateField('serviceRequired', newServices) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      
      if (errors[name]) {
        setErrors({ ...errors, [name]: validateField(name, value) });
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Don't validate checkboxes on blur here easily, handled in change
    if (e.target.type !== 'checkbox') {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Honeypot check
    if (formData.honeypot) {
      // Silently reject
      setIsSuccess(true);
      return;
    }

    // Validate all
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'honeypot') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (_err) {
      setSubmitError('Failed to connect to the server. Please check your connection or email us directly at hello@taksha.studio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Start a Project — Taksha Nexus"
        description="Tell us what you're building. Start a project with Taksha Nexus Digital Craft Studio."
        canonical="/contact"
      />
      <StructuredData schema={localBusinessSchema()} />

      <article className="contact-page">
        <header className="section section--lg contact-hero">
          <div className="container text-center">
            <SectionHeading 
              eyebrow="Start a Project"
              title="Tell us what you're building."
              subtitle="The more context you share, the better we can tell you how we'd approach it."
              as="h1"
            />
          </div>
        </header>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container contact-container">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-panel"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <CheckCircle size={48} className="success-icon" />
                  </motion.div>
                  <h2 className="h3">Message received.</h2>
                  <p>We'll review your inquiry and an engineer will be in touch within 24 hours.</p>
                  <Button to="/work" variant="primary">View Our Work</Button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSubmit}
                  className="contact-form"
                  noValidate
                >
                  {/* Honeypot */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="honeypot">Leave this field blank</label>
                    <input type="text" id="honeypot" name="honeypot" tabIndex="-1" autoComplete="off" value={formData.honeypot} onChange={handleChange} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input 
                        type="text" id="name" name="name" 
                        value={formData.name} onChange={handleChange} onBlur={handleBlur}
                        className={errors.name ? 'input-error' : ''}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input 
                        type="email" id="email" name="email" 
                        value={formData.email} onChange={handleChange} onBlur={handleBlur}
                        className={errors.email ? 'input-error' : ''}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input 
                      type="text" id="company" name="company" 
                      value={formData.company} onChange={handleChange} onBlur={handleBlur}
                      className={errors.company ? 'input-error' : ''}
                      aria-invalid={!!errors.company}
                    />
                    {errors.company && <span className="error-message">{errors.company}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="budget">Budget *</label>
                      <select 
                        id="budget" name="budget" 
                        value={formData.budget} onChange={handleChange} onBlur={handleBlur}
                        className={errors.budget ? 'input-error' : ''}
                        aria-invalid={!!errors.budget}
                      >
                        <option value="">Select a range</option>
                        <option value="Under $2,000">Under $2,000</option>
                        <option value="$2,000–$5,000">$2,000–$5,000</option>
                        <option value="$5,000–$15,000">$5,000–$15,000</option>
                        <option value="$15,000+">$15,000+</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                      {errors.budget && <span className="error-message">{errors.budget}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="timeline">Timeline *</label>
                      <select 
                        id="timeline" name="timeline" 
                        value={formData.timeline} onChange={handleChange} onBlur={handleBlur}
                        className={errors.timeline ? 'input-error' : ''}
                        aria-invalid={!!errors.timeline}
                      >
                        <option value="">Select a timeline</option>
                        <option value="ASAP">ASAP</option>
                        <option value="Within 1 month">Within 1 month</option>
                        <option value="1–3 months">1–3 months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                      {errors.timeline && <span className="error-message">{errors.timeline}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Service Required *</label>
                    <div className="checkbox-grid">
                      {services.map(service => (
                        <label key={service} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            name="serviceRequired" 
                            value={service}
                            checked={formData.serviceRequired.includes(service)}
                            onChange={handleChange}
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                    {errors.serviceRequired && <span className="error-message">{errors.serviceRequired}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectDetails">Project Details *</label>
                    <textarea 
                      id="projectDetails" name="projectDetails" rows="5"
                      value={formData.projectDetails} onChange={handleChange} onBlur={handleBlur}
                      className={errors.projectDetails ? 'input-error' : ''}
                      aria-invalid={!!errors.projectDetails}
                      placeholder="Tell us about your goals, audience, and any existing constraints..."
                    />
                    {errors.projectDetails && <span className="error-message">{errors.projectDetails}</span>}
                  </div>

                  {submitError && (
                    <div className="submit-error" role="alert">
                      {submitError}
                    </div>
                  )}

                  <div className="form-submit">
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Project Details'}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </article>
    </>
  );
}
