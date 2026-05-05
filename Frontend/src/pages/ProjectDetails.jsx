import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI } from '../services/api'; 

const ProjectDetails = () => {
  // 1. Get the specific project ID from the web address (URL)
  const { id } = useParams(); 
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the real project data from your backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectAPI.getProject(id);
        
        // Save the real project data to state (adjust based on your backend response structure)
        setProject(response.data.project || response.data);
      } catch (err) {
        console.error("Could not fetch project details:", err);
        setProject(null); // This triggers the "Welcome to project details" fallback
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const styles = {
    container: { minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8fafc', padding: '3rem 2rem' },
    card: { maxWidth: '800px', margin: '2rem auto', backgroundColor: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    backLink: { color: '#0d47a1', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' },
    category: { display: 'inline-block', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' },
    title: { fontSize: '2.2rem', color: '#1e293b', margin: '0 0 0.5rem 0' },
    idText: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
    budget: { fontSize: '2rem', color: '#16a34a', fontWeight: 'bold', margin: 0 },
    description: { fontSize: '1.1rem', color: '#475569', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap' },
    metaRow: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.95rem' },
    bidButton: { width: '100%', padding: '1rem', backgroundColor: '#0d47a1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
    fallbackCenter: { textAlign: 'center', color: '#475569', marginTop: '2rem' }
  };

  // While waiting for the backend to respond
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '3rem' }}>
          🔄 Loading exact project details...
        </div>
      </div>
    );
  }

  // 3. FALLBACK: If project doesn't exist in DB (Old Dummy Projects)
  if (!project) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link to="/projects" style={styles.backLink}>← Back to Projects</Link>
          <div style={styles.card}>
            <div style={styles.fallbackCenter}>
              <h1 style={{ color: '#1e293b', marginBottom: '1rem' }}>Welcome to project details</h1>
              <p>This is either an old test project or the details could not be found in the database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. REAL PROJECT: Display exact details of the newly uploaded project
  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/projects" style={styles.backLink}>← Back to Projects</Link>
        
        <div style={styles.card}>
          <div style={styles.category}>{project.category || 'Uncategorized'}</div>
          
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>{project.title}</h1>
              <p style={styles.idText}>Project ID: {project._id}</p>
            </div>
            <div style={styles.budget}>${project.budget}</div>
          </div>

          <div style={styles.description}>
            {project.description}
          </div>

          <div style={styles.metaRow}>
            <div><strong>Posted By:</strong> {project.createdBy?.name || 'User'}</div>
            <div><strong>Current Bids:</strong> {project.bids?.length || 0}</div>
            <div><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</div>
          </div>

          <button style={styles.bidButton}>Submit a Bid</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;