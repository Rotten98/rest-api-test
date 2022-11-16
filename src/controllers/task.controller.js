import Task from "../models/Task";
import { getPagination } from "../libs/getPagination";

export const findAllTasks = async (req, res) => {
  try {
    const { size, page, title } = req.query;
    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: "i" },
        }
      : {};
    const { limit, offset } = getPagination(page, size);
    const data = await Task.paginate(condition, {
      offset: offset,
      limit: limit,
    });
    res.json({
      totalItems: data.totaldocs,
      tasks: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "something goes wrong retrieving tasks",
    });
  }
};

export const createTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: "title can not be empty" });
  }
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false,
    });
    const taskSaved = await newTask.save();
    res.json(taskSaved);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something goes wrong creating a task",
    });
  }
};

export const findOneTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);

    if (!task)
      return res
        .status(404)
        .json({ message: `task with id ${id} do not exists` });

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving task with id ${id}`,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({
      message: `Task were deleted succesfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `cannot delete task with id ${id}`,
    });
  }
};

export const findAllDoneTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ done: true });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: `cannot find all done tasks`,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "task was updated succesfully" });
  } catch (error) {
    res.status(500).json({
      message: `cannot update task`,
    });
  }
};
