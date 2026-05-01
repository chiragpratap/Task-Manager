const Project = require('../models/Project');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      // Admin sees projects they own
      projects = await Project.find({ owner: req.user.id }).populate('members', 'name email');
    } else {
      // Member sees projects they are a member of
      projects = await Project.find({ members: req.user.id }).populate('owner', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: members || [],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project (add members)
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('members', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject };
