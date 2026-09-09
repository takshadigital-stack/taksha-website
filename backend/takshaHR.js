const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Email Transporter (Configured for Gmail as requested)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'takshadigital@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'dummy_password', // Should be App Password
    },
  });
};

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter connection before sending
    try {
      await transporter.verify();
      console.log(`[Taksha HR Email] Transporter verified. Sending to: ${to}, Subject: "${subject}"`);
    } catch (verifyErr) {
      console.error('[Taksha HR Email] Transporter verification failed:', verifyErr.message);
      return { success: false, error: new Error(`Email transporter failed to connect: ${verifyErr.message}. Check EMAIL_USER and EMAIL_PASSWORD in .env`) };
    }
    
    const info = await transporter.sendMail({
      from: '"Taksha HR — Taksha Nexus" <takshadigital@gmail.com>',
      to,
      subject,
      html,
      attachments,
    });
    console.log(`[Taksha HR Email] Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Taksha HR Email] Email delivery failed:", error.message);
    return { success: false, error };
  }
};

const evaluateApplication = async (appId) => {
  const application = await prisma.application.findUnique({ where: { id: appId } });
  if (!application) return;

  // Simple heuristic AI simulation based on requested output
  let score = 50;
  const strengths = [];
  const weaknesses = [];
  const missingSkills = [];

  const role = (application.roleTitle || '').toLowerCase();
  const skills = (application.skills || '').toLowerCase();
  const exp = parseInt(application.experience || '0', 10);

  if (application.hasProjects) {
    score += 15;
    strengths.push("Good portfolio and relevant projects");
  } else {
    weaknesses.push("No visible projects");
  }

  if (exp > 0) {
    score += 10 + (exp * 5);
    strengths.push(`${exp} years of prior experience`);
  } else {
    weaknesses.push("Limited professional experience");
  }

  // Role specific checks
  if (role.includes('frontend')) {
    if (skills.includes('react') || skills.includes('javascript') || skills.includes('html')) {
      score += 20;
      strengths.push("Strong frontend stack knowledge");
    } else {
      missingSkills.push("React, JavaScript");
    }
  } else if (role.includes('full-stack') || role.includes('full stack')) {
    if (skills.includes('node') || skills.includes('express') || skills.includes('backend')) {
      score += 10;
      strengths.push("Backend knowledge present");
    } else {
      missingSkills.push("API experience, Backend Frameworks");
      weaknesses.push("Limited backend experience");
    }
    if (skills.includes('react') || skills.includes('frontend')) {
      score += 10;
    }
  }

  score = Math.min(Math.max(score, 0), 100);

  let recommendation = "Potential Match";
  if (score >= 80) recommendation = "Strong Match";
  if (score < 50) recommendation = "Weak Match";

  await prisma.application.update({
    where: { id: appId },
    data: {
      aiScore: score,
      aiStrengths: JSON.stringify(strengths),
      aiWeaknesses: JSON.stringify(weaknesses),
      aiMissingSkills: JSON.stringify(missingSkills),
      aiRecommendation: recommendation
    }
  });

  await logSystemAction('Taksha HR completed AI analysis', application.name, `Score: ${score}/100, Rec: ${recommendation}`, 'Taksha HR');
};

const generateOfferPDF = async (application) => {
  try {
    const filename = `Taksha_Nexus_Internship_Offer_${application.name.replace(/\s+/g, '_')}.pdf`;
    
    const offersDir = path.join(__dirname, 'uploads', 'offers');
    if (!fs.existsSync(offersDir)) {
      fs.mkdirSync(offersDir, { recursive: true });
    }
    
    const filePath = path.join(offersDir, filename);

    // Read the HTML template
    let template = fs.readFileSync(path.join(__dirname, 'offerTemplate.html'), 'utf8');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Start in 7 days
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(application.duration || '6'));

    const logoPath = path.join(__dirname, 'assets', 'offer_logo.png');
    const signaturePath = path.join(__dirname, 'assets', 'offer_signature.png');
    
    let logoBase64 = '';
    if (fs.existsSync(logoPath)) {
      logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
    }
    
    let signatureBase64 = '';
    if (fs.existsSync(signaturePath)) {
      signatureBase64 = 'data:image/png;base64,' + fs.readFileSync(signaturePath).toString('base64');
    }

    const replacements = {
      '{{LOGO_SRC}}': logoBase64,
      '{{SIGNATURE_SRC}}': signatureBase64,
      '{{COMPANY_EMAIL}}': 'hr@taksha.studio',
      '{{COMPANY_PHONE}}': '+91-8093859132',
      '{{COMPANY_WEBSITE}}': 'www.taksha.studio',
      '{{REF_NUMBER}}': `TN-OFF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      '{{CURRENT_DATE}}': new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      '{{INTERN_FULL_NAME}}': application.name,
      '{{INTERN_ADDRESS}}': application.location || 'Remote',
      '{{INTERN_CONTACT}}': `${application.email} ${application.phone ? '| ' + application.phone : ''}`,
      '{{ROLE_TITLE}}': application.roleTitle,
      '{{INTERN_FIRST_NAME}}': application.name.split(' ')[0],
      '{{DEPARTMENT}}': 'Product & Engineering',
      '{{START_DATE}}': startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      '{{END_DATE}}': endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      '{{DURATION}}': application.duration || '6',
      '{{LOCATION}}': 'Remote',
      '{{WORKING_DAYS}}': 'Flexible',
      '{{WORKING_HOURS}}': '5-6 Hours/Day',
      '{{STIPEND}}': 'Performance Based',
      '{{REPORTING_MANAGER}}': 'Authorized Representative, Taksha Nexus',
      '{{NOTICE_PERIOD}}': '7 days',
      '{{ACCEPTANCE_DEADLINE}}': startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      '{{AUTH_SIGNATORY}}': 'Rahul',
      '{{AUTH_DESIGNATION}}': 'Director'
    };

    // Replace all placeholders
    for (const [key, value] of Object.entries(replacements)) {
      template = template.split(key).join(value);
    }

    // Launch Puppeteer to generate PDF
    const launchOptions = { 
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    };
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    const browser = await puppeteer.launch(launchOptions);
    
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' }
    });

    await browser.close();
    
    return filePath;
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  }
};

const logSystemAction = async (action, candidate, result, performedBy) => {
  await prisma.systemLog.create({
    data: { action, candidate, result, performedBy }
  });
};

module.exports = {
  sendEmail,
  evaluateApplication,
  generateOfferPDF,
  logSystemAction
};
