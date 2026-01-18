const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const profileController = {
  // Create a new profile
  async createProfile(req, res) {
    try {
      const { name, email, education, skills, projects, work, links } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const profile = await prisma.profile.create({
        data: {
          name,
          email,
          education: education || '',
          skills: skills || [],
          links: links || {},
          projects: {
            create: projects?.map(project => ({
              title: project.title,
              description: project.description,
              links: project.links || []
            })) || []
          },
          work: {
            create: work?.map(w => ({
              company: w.company,
              role: w.role,
              duration: w.duration,
              description: w.description
            })) || []
          }
        },
        include: {
          projects: true,
          work: true
        }
      });

      res.status(201).json(profile);
    } catch (error) {
      console.error('Create profile error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (error.code === 'P1001') {
        return res.status(500).json({ error: 'Database connection failed. Please check your DATABASE_URL.' });
      }
      res.status(500).json({ error: 'Failed to create profile' });
    }
  },

  // Get all profiles
  async getAllProfiles(req, res) {
    try {
      const profiles = await prisma.profile.findMany({
        include: {
          projects: true,
          work: true
        }
      });
      res.json(profiles);
    } catch (error) {
      console.error('Get profiles error:', error);
      res.status(500).json({ error: 'Failed to fetch profiles' });
    }
  },

  // Get profile by ID
  async getProfileById(req, res) {
    try {
      const { id } = req.params;
      const profile = await prisma.profile.findUnique({
        where: { id },
        include: {
          projects: true,
          work: true
        }
      });

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json(profile);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  },

  // Update profile
  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const { name, email, education, skills, projects, work, links } = req.body;

      // Delete existing projects and work
      await prisma.project.deleteMany({ where: { profileId: id } });
      await prisma.work.deleteMany({ where: { profileId: id } });

      const profile = await prisma.profile.update({
        where: { id },
        data: {
          name,
          email,
          education: education || '',
          skills: skills || [],
          links: links || {},
          projects: {
            create: projects?.map(project => ({
              title: project.title,
              description: project.description,
              links: project.links || []
            })) || []
          },
          work: {
            create: work?.map(w => ({
              company: w.company,
              role: w.role,
              duration: w.duration,
              description: w.description
            })) || []
          }
        },
        include: {
          projects: true,
          work: true
        }
      });

      res.json(profile);
    } catch (error) {
      console.error('Update profile error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.status(500).json({ error: 'Failed to update profile' });
    }
  },

  // Delete profile
  async deleteProfile(req, res) {
    try {
      const { id } = req.params;
      
      await prisma.profile.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Delete profile error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.status(500).json({ error: 'Failed to delete profile' });
    }
  }
};

module.exports = profileController;