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
        // Parse skills JSON string for SQLite
        const skills = JSON.parse(profile.skills || '[]');
        if (skills.includes(skill)) {
          return profile.projects.map(project => ({
            ...project,
            links: JSON.parse(project.links || '[]'),
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
        // Parse JSON string for SQLite
        const skills = JSON.parse(profile.skills || '[]');
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
                contains: q // Search within JSON string
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

      // Filter and parse results for SQLite
      const results = profiles.map(profile => ({
        ...profile,
        skills: JSON.parse(profile.skills || '[]'),
        links: profile.links ? JSON.parse(profile.links) : {},
        projects: profile.projects.map(project => ({
          ...project,
          links: JSON.parse(project.links || '[]')
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