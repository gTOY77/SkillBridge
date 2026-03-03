import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Updated categories specifically for university students
  const categories = [
    { id: 1, name: 'Assignment Help', icon: '📝' },
    { id: 2, name: 'Peer Tutoring', icon: '🧑‍🏫' },
    { id: 3, name: 'Project Collaboration', icon: '🤝' },
    { id: 4, name: 'Exam Prep', icon: '📚' },
  ];

  return (
    <div style={styles.container}>
      {/* Updated Hero Section */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Your Campus Skill Marketplace</h1>
        <p style={styles.heroSubtitle}>Get help with assignments, projects, and tutoring from expert students, or offer your own skills to earn money.</p>
        <div style={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="What subject or project do you need help with?" 
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>Search</button>
        </div>
      </header>

      {/* Updated Categories Section */}
      <section style={styles.categoriesSection}>
        <h2 style={styles.sectionTitle}>Top Student Services</h2>
        <div style={styles.grid}>
          {categories.map((category) => (
            <div key={category.id} style={styles.card}>
              <div style={styles.icon}>{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Keeping the same clean styling we used before
const styles = {
  container: { fontFamily: 'Arial, sans-serif' },
  hero: { backgroundColor: '#004aad', color: 'white', padding: '4rem 2rem', textAlign: 'center', borderRadius: '10px', marginBottom: '3rem' },
  heroTitle: { fontSize: '2.5rem', marginBottom: '1rem' },
  heroSubtitle: { fontSize: '1.2rem', marginBottom: '2rem' },
  searchContainer: { display: 'flex', justifyContent: 'center', gap: '10px' },
  searchInput: { padding: '0.8rem', width: '60%', maxWidth: '500px', borderRadius: '5px', border: 'none', fontSize: '1rem' },
  searchButton: { padding: '0.8rem 1.5rem', backgroundColor: '#00cc66', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  categoriesSection: { padding: '0 2rem' },
  sectionTitle: { fontSize: '2rem', marginBottom: '1.5rem', color: '#333' },
  grid: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1', minWidth: '200px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
  icon: { fontSize: '3rem', marginBottom: '1rem' }
};

export default Home;