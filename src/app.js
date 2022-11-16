import express from "express";
import TasksRoutes from "./routes/task.routes";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({}));

app.get("/", (req, res) => {
  res.json({ messsage: "Welcome to my app" });
});

app.use("/api/tasks", TasksRoutes);

export default app;
