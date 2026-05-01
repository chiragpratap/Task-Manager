const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      // Find all projects owned by Admin to get their tasks
      const projects = await Project.find({ owner: req.user.id });
      const projectIds = projects.map(p => p._id);
      tasks = await Task.find({ project: { $in: projectIds } }).populate('project', 'title').populate('assignedTo', 'name');
    } else {
      // Members see tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user.id }).populate('project', 'title').populate('assignedTo', 'name');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, project, assignedTo } = req.body;

    // Verify project exists and belongs to admin
    const projectExists = await Project.findById(project);
    if (!projectExists || projectExists.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Project not found or not authorized' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      project,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    // If member, only allow status update
    let updateData = req.body;
    if (req.user.role === 'Member') {
      updateData = { status: req.body.status };
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask };
