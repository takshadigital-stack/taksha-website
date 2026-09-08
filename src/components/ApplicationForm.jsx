import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Upload } from 'lucide-react';

export default function ApplicationForm({ role, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.target);
    formData.append('roleId', role.id);
    formData.append('roleTitle', role.title);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        body: formData, // Sending as multipart/form-data
      });

      if (response.ok) {
        setIsApplied(true);
      } else {
        let errData = {};
        try { errData = await response.json(); } catch(_e) {}
        setErrorMsg(`Failed to submit application. ${errData.details ? 'Error: ' + errData.details : 'Please try again later.'}`);
      }
    } catch (err) {
      setErrorMsg(`Network error. ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApplied) {
    return (
      <div className="role-modal__success" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <CheckCircle size={64} color="var(--color-card-mint)" style={{ margin: '0 auto 20px' }} />
        <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Application Submitted!</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
          Your application for the <strong>{role.title}</strong> role has been submitted successfully! 
          Our team will review your application and contact you if you are shortlisted.
        </p>
        <button className="btn btn--secondary" onClick={onCancel}>
          Close Window
        </button>
      </div>
    );
  }

  return (
    <div className="application-form-container">
      <div className="form-header" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Apply for {role.title}</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>Please fill out all required fields marked with an asterisk (*).</p>
      </div>

      <form className="apply-form-extended" onSubmit={handleSubmit}>
        
        {/* Section 1: Personal Information */}
        <fieldset className="form-section">
          <legend>1. Personal Information</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" className="form-input" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone / WhatsApp Number *</label>
              <input type="tel" name="phone" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Current City & State *</label>
              <input type="text" name="location" className="form-input" required />
            </div>
          </div>
        </fieldset>

        {/* Section 2: Educational Information */}
        <fieldset className="form-section">
          <legend>2. Educational Information</legend>
          <div className="form-row">
            <div className="form-group">
              <label>College / University Name *</label>
              <input type="text" name="college" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Course / Degree *</label>
              <input type="text" name="degree" className="form-input" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Branch / Specialization</label>
              <input type="text" name="specialization" className="form-input" />
            </div>
            <div className="form-group">
              <label>Current Year of Study *</label>
              <select name="currentYear" className="form-input" required>
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Recently Graduated">Recently Graduated</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Expected Graduation Year *</label>
            <input type="text" name="graduationYear" className="form-input" placeholder="e.g. 2025" required />
          </div>
        </fieldset>

        {/* Section 3: Skills & Experience */}
        <fieldset className="form-section">
          <legend>3. Skills & Experience</legend>
          <div className="form-group">
            <label>Technical / Professional Skills *</label>
            <input type="text" name="skills" className="form-input" placeholder="React, Node.js, Figma, etc." required />
          </div>
          <div className="form-group">
            <label>Briefly describe your experience with these skills</label>
            <textarea name="experience" className="form-textarea" rows="3"></textarea>
          </div>
        </fieldset>

        {/* Section 4: Projects & Portfolio */}
        <fieldset className="form-section">
          <legend>4. Projects & Portfolio</legend>
          <div className="form-group">
            <label>Have you worked on any projects? *</label>
            <div className="radio-group">
              <label><input type="radio" name="hasProjects" value="true" required /> Yes</label>
              <label><input type="radio" name="hasProjects" value="false" required /> No</label>
            </div>
          </div>
          <div className="form-group">
            <label>Describe your best project</label>
            <textarea name="bestProject" className="form-textarea" rows="2"></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub Profile Link</label>
              <input type="url" name="githubUrl" className="form-input" />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile Link</label>
              <input type="url" name="linkedinUrl" className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label>Portfolio / Personal Website Link</label>
            <input type="url" name="portfolio" className="form-input" />
          </div>
        </fieldset>

        {/* Section 5: Resume */}
        <fieldset className="form-section">
          <legend>5. Resume</legend>
          <div className="form-group">
            <label>Upload Resume (PDF only) *</label>
            <div className="file-upload-wrapper">
              <input type="file" name="resume" accept="application/pdf" id="resume-upload" className="file-input-hidden" onChange={handleFileChange} required />
              <label htmlFor="resume-upload" className="file-upload-btn">
                <Upload size={18} /> {fileName ? fileName : 'Choose PDF File'}
              </label>
            </div>
          </div>
        </fieldset>

        {/* Section 6: Availability */}
        <fieldset className="form-section">
          <legend>6. Availability</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Internship Duration You Can Commit To *</label>
              <select name="duration" className="form-input" required>
                <option value="">Select Duration</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Availability *</label>
              <select name="availability" className="form-input" required>
                <option value="">Select Availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hours Available Per Week</label>
              <input type="text" name="hoursPerWeek" className="form-input" placeholder="e.g. 20 hours" />
            </div>
            <div className="form-group">
              <label>Available Start Date *</label>
              <input type="date" name="startDate" className="form-input" required />
            </div>
          </div>
        </fieldset>

        {/* Section 7: Motivation */}
        <fieldset className="form-section">
          <legend>7. Motivation</legend>
          <div className="form-group">
            <label>Why do you want to join this internship? *</label>
            <textarea name="motivation" className="form-textarea" rows="2" required></textarea>
          </div>
          <div className="form-group">
            <label>What do you hope to learn during this internship?</label>
            <textarea name="expectations" className="form-textarea" rows="2"></textarea>
          </div>
          <div className="form-group">
            <label>Why should we select you?</label>
            <textarea name="whySelectYou" className="form-textarea" rows="2"></textarea>
          </div>
        </fieldset>

        {/* Section 8: Source & Declaration */}
        <fieldset className="form-section">
          <legend>8. Source & Declaration</legend>
          <div className="form-group">
            <label>How did you hear about this internship? *</label>
            <select name="source" className="form-input" required>
              <option value="">Select Source</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="College">College</option>
              <option value="Friend / Referral">Friend / Referral</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group checkbox-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" required style={{ marginTop: '4px' }} />
              <span>I confirm that the information provided by me is accurate and genuine. *</span>
            </label>
          </div>
        </fieldset>

        {errorMsg && <div className="error-message" style={{ color: 'red', padding: '10px', background: '#ffebee', borderLeft: '4px solid red', marginBottom: '20px' }}>{errorMsg}</div>}
        
        <div className="form-actions" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button type="button" className="btn btn--secondary" onClick={onCancel} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" style={{ flex: 2, background: 'var(--color-ink)', color: 'var(--color-bg)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : <>Submit Application <ArrowRight size={18} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}
