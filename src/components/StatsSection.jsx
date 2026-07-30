import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiBriefcase, FiUsers } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './StatsSection.css';

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: <FiBookOpen />, count: '5+', label: t('stats.storiesPublished') },
    { icon: <FiBriefcase />, count: '3', label: t('stats.industriesExplored') },
    { icon: <FiUsers />, count: '2', label: t('stats.founderInterviews') }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="stats-section">
      <div className="container">
        <motion.div 
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} className="stat-item" variants={itemVariants}>
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-count">{stat.count}</h3>
              <p className="stat-label">{stat.label}</p>
              {index < stats.length - 1 && <div className="stat-divider"></div>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
