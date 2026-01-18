const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const queryController = {
  // Get projects filtered by skill
  async getProjectsBySkill(req, res) {
    try {
      const { skill } = req.query;
      
      if (!skill) {
        return res.status(400).json({ error: 'Skill parameter is required' });
      }

      const profiles = await prisma.profile.findMany({
        where: {
          skills: {
            contains: skill // For SQLite, we search within the JSON string
          }
        },
        include: {
          projects: true
        }
      });

      const projects = profiles.flatMap(profile => {
        // Skills is already a PostgreSQL array
        const skills = profile.skills || [];
        if (skills.includes(skill)) {
          return profile.projects.map(project => ({
            ...project,
            links: project.links || [], // Links is already a JSON object in PostgreSQL
            profileName: profile.name,
            profileId: profile.id
          }));
        }
        return [];
      });

      res.json(projects);
    } catch (error) {
      console.error('Get projects by skill error:', error);
      if (error.code === 'P1001') {
        return res.status(500).json({ error: 'Database connection failed. Please check your DATABASE_URL.' });
      }
      res.status(500).json({ error: 'Failed to fetch projects by skill' });
    }
  },

  // Get top skills by frequency
  async getTopSkills(req, res) {
    try {
      const profiles = await prisma.profile.findMany({
        select: {
          skills: true
        }
      });

      const skillCount = {};
      profiles.forEach(profile => {
        // Skills is already a PostgreSQL array
        const skills = profile.skills || [];
        skills.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      });

      const topSkills = Object.entries(skillCount)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);

      res.json(topSkills);
    } catch (error) {
      console.error('Get top skills error:', error);
      if (error.code === 'P1001') {
        return res.status(500).json({ error: 'Database connection failed. Please check your DATABASE_URL.' });
      }
      res.status(500).json({ error: 'Failed to fetch top skills' });
    }
  },

  // Generic search across skills, projects, and work descriptions
  async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Query parameter (q) is required' });
      }

      const searchTerm = q.toLowerCase();

      const profiles = await prisma.profile.findMany({
        where: {
          OR: [
            {
              skills: {
                has: q // Search within PostgreSQL array
              }
            },
            {
              projects: {
                some: {
                  OR: [
                    {
                      title: {
                        contains: q
                      }
                    },
                    {
                      description: {
                        contains: q
                      }
                    }
                  ]
                }
              }
            },
            {
              work: {
                some: {
                  description: {
                    contains: q
                  }
                }
              }
            }
          ]
        },
        include: {
          projects: true,
          work: true
        }
      });

      // Return results for PostgreSQL
      const results = profiles.map(profile => ({
        ...profile,
        skills: profile.skills || [], // Already a PostgreSQL array
        links: profile.links || {}, // Already a JSON object in PostgreSQL  
        projects: profile.projects.map(project => ({
          ...project,
          links: project.links || [] // Already a JSON object in PostgreSQL
        }))
      }));

      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      if (error.code === 'P1001') {
        return res.status(500).json({ error: 'Database connection failed. Please check your DATABASE_URL.' });
      }
      res.status(500).json({ error: 'Failed to perform search' });
    }
  }
};

module.exports = queryController;