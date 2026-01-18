const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  education: "B.S. Computer Science, University of Technology (2021)",
  skills: JSON.stringify([
    "JavaScript", "TypeScript", "Node.js", "React", "Python", 
    "PostgreSQL", "Express.js", "MongoDB", "Docker", "AWS",
    "REST APIs", "GraphQL", "Git", "Prisma", "Next.js"
  ]),
  projects: [
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce application with user authentication, payment processing, and inventory management. Built with React, Node.js, and PostgreSQL.",
      links: JSON.stringify(["https://github.com/alexjohnson/ecommerce-platform", "https://ecommerce-demo.vercel.app"])
    },
    {
      title: "Task Management API",
      description: "RESTful API for task management with team collaboration features. Implemented real-time updates using WebSockets and Redis for caching.",
      links: JSON.stringify(["https://github.com/alexjohnson/task-api"])
    },
    {
      title: "Weather Dashboard",
      description: "React-based weather dashboard with location search and 7-day forecasts. Integrates with OpenWeatherMap API and uses responsive design.",
      links: JSON.stringify(["https://github.com/alexjohnson/weather-dashboard", "https://weather-dash-demo.netlify.app"])
    },
    {
      title: "AI Chat Bot",
      description: "Python-based chatbot using natural language processing. Deployed on AWS Lambda with DynamoDB for conversation storage.",
      links: JSON.stringify(["https://github.com/alexjohnson/ai-chatbot"])
    }
  ],
  work: [
    {
      company: "TechStart Inc.",
      role: "Full Stack Developer",
      duration: "2022 - Present",
      description: "Developing scalable web applications using React and Node.js. Built microservices architecture serving 100K+ daily active users. Implemented CI/CD pipelines and automated testing."
    },
    {
      company: "Digital Solutions Co.",
      role: "Frontend Developer Intern",
      duration: "2021 - 2022",
      description: "Created responsive user interfaces for client projects. Collaborated with UX designers to implement modern web designs. Optimized application performance resulting in 40% faster load times."
    },
    {
      company: "University Tech Lab",
      role: "Research Assistant",
      duration: "2020 - 2021",
      description: "Assisted in machine learning research projects. Developed data visualization tools using Python and D3.js. Published research on neural network optimization techniques."
    }
  ],
  links: JSON.stringify({
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alex-johnson-dev",
    portfolio: "https://alexjohnson.dev"
  })
};

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { email: seedData.email }
    });

    if (existingProfile) {
      console.log('📋 Profile already exists, skipping seed...');
      return;
    }

    // Create the profile with related data
    const profile = await prisma.profile.create({
      data: {
        name: seedData.name,
        email: seedData.email,
        education: seedData.education,
        skills: seedData.skills,
        links: seedData.links,
        projects: {
          create: seedData.projects
        },
        work: {
          create: seedData.work
        }
      },
      include: {
        projects: true,
        work: true
      }
    });

    console.log('✅ Database seeded successfully!');
    console.log(`👤 Created profile: ${profile.name}`);
    console.log(`📝 Projects: ${profile.projects.length}`);
    console.log(`💼 Work experiences: ${profile.work.length}`);
    console.log(`🚀 Skills: ${profile.skills.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.code === 'P1001') {
      console.error('🔌 Database connection failed. Please check your DATABASE_URL in .env file.');
      console.error('💡 Tip: Make sure PostgreSQL is running or use a cloud database like Neon.');
    } else if (error.code === 'P2002') {
      console.error('📧 Email already exists in database.');
    } else {
      console.error('🐛 Unexpected error:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = seed;