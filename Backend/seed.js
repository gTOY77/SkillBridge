require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');

const MONGODB_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample clients
    const clients = await User.insertMany([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'client',
        bio: 'Startup founder looking for talented developers',
        university: 'Stanford University',
        major: 'Business Administration',
        profileImage: null,
        isVerified: true,
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        role: 'client',
        bio: 'Product manager at tech company',
        university: 'MIT',
        major: 'Computer Science',
        profileImage: null,
        isVerified: true,
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        role: 'client',
        bio: 'Freelance designer and creative director',
        university: 'UC Berkeley',
        major: 'Graphic Design',
        profileImage: null,
        isVerified: true,
      },
    ]);
    console.log(`✅ Created ${clients.length} client accounts`);

    // Create sample experts
    const experts = await User.insertMany([
      {
        name: 'David Chen',
        email: 'david@example.com',
        password: 'password123',
        role: 'expert',
        bio: 'Full-stack developer with 5 years of experience',
        university: 'Carnegie Mellon University',
        major: 'Computer Science',
        hourlyRate: 50,
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        rating: 4.8,
        totalReviews: 45,
        isVerified: true,
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: 'password123',
        role: 'expert',
        bio: 'UI/UX Designer specializing in mobile apps',
        university: 'RISD',
        major: 'Graphic Design',
        hourlyRate: 40,
        skills: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
        rating: 4.9,
        totalReviews: 38,
        isVerified: true,
      },
      {
        name: 'Frank Martinez',
        email: 'frank@example.com',
        password: 'password123',
        role: 'expert',
        bio: 'Machine Learning engineer and data scientist',
        university: 'Stanford University',
        major: 'Computer Science',
        hourlyRate: 75,
        skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
        rating: 4.7,
        totalReviews: 28,
        isVerified: true,
      },
      {
        name: 'Grace Lee',
        email: 'grace@example.com',
        password: 'password123',
        role: 'expert',
        bio: 'Mobile app developer - iOS and Android specialist',
        university: 'University of Washington',
        major: 'Computer Science',
        hourlyRate: 55,
        skills: ['React Native', 'iOS Development', 'Android Development', 'Flutter'],
        rating: 4.6,
        totalReviews: 32,
        isVerified: true,
      },
      {
        name: 'Henry Thompson',
        email: 'henry@example.com',
        password: 'password123',
        role: 'expert',
        bio: 'DevOps and Cloud Infrastructure specialist',
        university: 'University of Texas',
        major: 'Computer Science',
        hourlyRate: 65,
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        rating: 4.5,
        totalReviews: 24,
        isVerified: true,
      },
    ]);
    console.log(`✅ Created ${experts.length} expert accounts`);

    // Create sample projects
    const projects = await Project.insertMany([
      {
        title: 'E-Commerce Platform MVP',
        description: 'Need to build a modern e-commerce platform with React frontend and Node.js backend. Must include product catalog, shopping cart, and payment integration.',
        category: 'Web Development',
        budget: 5000,
        skillsRequired: ['React', 'Node.js', 'MongoDB'],
        createdBy: clients[0]._id,
        status: 'open',
        bids: [
          {
            expert: experts[0]._id,
            amount: 4800,
            timeline: '30 days',
            proposal: 'I can build this using React and Node.js with Express and MongoDB. I have experience with similar projects.',
          },
          {
            expert: experts[3]._id,
            amount: 5500,
            timeline: '35 days',
            proposal: 'Can develop cross-platform solution with React Native for mobile support as well.',
          },
        ],
      },
      {
        title: 'Mobile App UI/UX Design',
        description: 'Design a modern and intuitive UI/UX for our fitness tracking mobile app. Include wireframes, prototypes, and design system.',
        category: 'UI/UX Design',
        budget: 2000,
        skillsRequired: ['UI Design', 'UX Design', 'Figma'],
        createdBy: clients[1]._id,
        status: 'open',
        bids: [
          {
            expert: experts[1]._id,
            amount: 1800,
            timeline: '14 days',
            proposal: 'I specialize in mobile app design and can deliver high-quality prototypes in Figma.',
          },
        ],
      },
      {
        title: 'Data Analysis Dashboard',
        description: 'Create a dashboard to visualize business metrics and analytics. Need to process large datasets and create interactive visualizations.',
        category: 'Data Analysis',
        budget: 3500,
        skillsRequired: ['Python', 'Data Analysis', 'React'],
        createdBy: clients[2]._id,
        status: 'open',
        bids: [
          {
            expert: experts[2]._id,
            amount: 3200,
            timeline: '21 days',
            proposal: 'Can build a comprehensive analytics dashboard using Python for backend and React for frontend.',
          },
        ],
      },
      {
        title: 'Cloud Infrastructure Setup',
        description: 'Help us migrate our application to AWS cloud. Need to set up servers, databases, and CI/CD pipelines.',
        category: 'DevOps',
        budget: 4000,
        skillsRequired: ['AWS', 'Docker', 'Kubernetes'],
        createdBy: clients[0]._id,
        status: 'in-progress',
        assignedTo: experts[4]._id,
        bids: [
          {
            expert: experts[4]._id,
            amount: 3800,
            timeline: '20 days',
            proposal: 'Expert in AWS infrastructure. Can set up production-ready environment.',
          },
        ],
      },
      {
        title: 'React Component Library',
        description: 'Build a reusable component library for our design system with Storybook documentation.',
        category: 'Web Development',
        budget: 2500,
        skillsRequired: ['React', 'JavaScript', 'Storybook'],
        createdBy: clients[1]._id,
        status: 'completed',
        assignedTo: experts[0]._id,
        bids: [
          {
            expert: experts[0]._id,
            amount: 2400,
            timeline: '18 days',
            proposal: 'Can build well-documented component library following best practices.',
          },
        ],
      },
      {
        title: 'Machine Learning Model Optimization',
        description: 'Optimize our existing ML model for faster inference and better accuracy. Currently running slower than expected.',
        category: 'Machine Learning',
        budget: 3000,
        skillsRequired: ['Python', 'Machine Learning', 'TensorFlow'],
        createdBy: clients[2]._id,
        status: 'completed',
        assignedTo: experts[2]._id,
        bids: [
          {
            expert: experts[2]._id,
            amount: 2800,
            timeline: '15 days',
            proposal: 'Experienced in model optimization. Can improve inference speed by 40-50%.',
          },
        ],
      },
      {
        title: 'iOS App Development',
        description: 'Develop a native iOS app for our social networking platform. Need to integrate with REST APIs and support real-time notifications.',
        category: 'Mobile Development',
        budget: 6000,
        skillsRequired: ['iOS Development', 'Swift', 'REST APIs'],
        createdBy: clients[0]._id,
        status: 'open',
      },
      {
        title: 'Website Redesign',
        description: 'Complete redesign of our company website with modern design, better UX, and improved performance.',
        category: 'Web Design',
        budget: 2800,
        skillsRequired: ['UI Design', 'Web Development', 'Responsive Design'],
        createdBy: clients[1]._id,
        status: 'open',
      },
      {
        title: 'Database Schema Optimization',
        description: 'Optimize our MongoDB schema for better query performance. Current queries are taking too long.',
        category: 'Database Design',
        budget: 1500,
        skillsRequired: ['MongoDB', 'Database Design'],
        createdBy: clients[2]._id,
        status: 'open',
      },
      {
        title: 'API Development and Documentation',
        description: 'Build RESTful APIs for our backend services and create comprehensive API documentation using OpenAPI/Swagger.',
        category: 'Web Development',
        budget: 3500,
        skillsRequired: ['Node.js', 'REST APIs', 'API Documentation'],
        createdBy: clients[0]._id,
        status: 'open',
      },
    ]);
    console.log(`✅ Created ${projects.length} projects`);

    console.log('\n📊 Sample Data Summary:');
    console.log(`  • Clients: ${clients.length}`);
    console.log(`  • Experts: ${experts.length}`);
    console.log(`  • Projects: ${projects.length}`);
    console.log('\n🎉 Database seeded successfully!');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
