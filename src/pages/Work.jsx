/**
 * Work Page — Portfolio index with filterable grid
 * PRD §10
 */
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import ConceptBadge from '../components/ConceptBadge/ConceptBadge';
import { FilterPill } from '../components/Tag/Tag';
import Button from '../components/Button/Button';
import { allProjects, CATEGORIES } from '../content/projects';
import './Work.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
};

export default function Work() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter(
      (p) => p.categories.includes(activeCategory) || p.industry === activeCategory
    );
  }, [activeCategory]);

  const handleFilter = (category) => {
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <>
      <SEO
        title="Work"
        description="Explore Taksha Nexus' Studio Originals — concept projects across healthcare, SaaS, hospitality, real estate, and fintech, crafted without compromise."
        canonical="/work"
      />

      <section className="section section--lg work-hero">
        <div className="container">
          <SectionHeading
            eyebrow="Studio Originals"
            title="Concept work, crafted without compromise."
            subtitle="Taksha Nexus is a new studio. Every project here is a self-initiated exploration — designed and built to the same standard as client work, without a client's constraints."
            as="h1"
          />

          {/* Filter bar */}
          <div className="filter-bar" role="group" aria-label="Filter projects by category">
            {CATEGORIES.map((cat) => (
              <FilterPill
                key={cat}
                active={activeCategory === cat}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </FilterPill>
            ))}
          </div>

          {/* Results count — aria-live for screen readers */}
          <p className="sr-only" aria-live="polite">
            {filteredProjects.length} projects shown
          </p>

          {/* Project grid */}
          <div className="work-grid">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.slug}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                  <WorkProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="work-empty">
              <p className="work-empty__message">
                No projects match this filter yet — check back soon or view all work.
              </p>
              <Button variant="secondary" onClick={() => handleFilter('All')}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function WorkProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="work-card" aria-label={`View ${project.name} case study`}>
      <div className="work-card__image" style={{ background: `linear-gradient(135deg, ${project.accentColor}20, ${project.accentColor}40)` }}>
        <div className="work-card__image-placeholder" style={{ color: project.accentColor }}>
          {project.name.charAt(0)}
        </div>
        <div className="work-card__overlay">
        </div>
        <ConceptBadge className="work-card__badge" />
      </div>
      <div className="work-card__info">
        <h3 className="work-card__name">{project.name}</h3>
        <p className="work-card__tagline">{project.tagline}</p>
        <div className="work-card__footer">
          <span className="work-card__category">{project.industry}</span>
          <div className="work-card__arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
