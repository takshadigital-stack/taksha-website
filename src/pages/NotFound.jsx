import { motion } from 'framer-motion';
import { ArrowLeft, Grid } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import Button from '../components/Button/Button';
import './NotFound.css';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found — Taksha Nexus"
        description="This page doesn't exist. You might have followed a broken link, or the page was moved."
        canonical="/404"
      />

      <article className="not-found-page">
        <div className="container not-found-container">
          <motion.div 
            className="not-found-content text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="not-found-eyebrow">404 - Void Reached</div>
            <h1 className="h2">This page doesn't exist.</h1>
            <p className="not-found-description">
              The page you are looking for doesn't exist, or it has been archived.
            </p>
            
            <div className="not-found-actions">
              <Button to="/" variant="secondary" icon={<ArrowLeft />}>
                Return to Base
              </Button>
              <Button to="/work" variant="primary" icon={<Grid />}>
                View Our Work
              </Button>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
}
