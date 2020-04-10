const Docker = require("dockerode");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const port = process.env.VIS_PORT ? process.env.VIS_PORT : 3000;
const refreshInterval = process.env.VIS_REFRESH
  ? process.env.VIS_REFRESH
  : 1000;
var nodeList = [];
var taskList = [];

process.once("SIGINT", function(code) {
  console.log("SIGINT received...");
  process.exit(0);
});
process.once("SIGTERM", function(code) {
  console.log("SIGTERM received...");
  process.exit(0);
});

async function refreshDockerInfo() {
  nodeList = await docker.listNodes().catch((err) => console.error(err));
  taskList = await docker.listTasks().catch((err) => console.error(err));
  setTimeout(refreshDockerInfo, refreshInterval);
}

refreshDockerInfo();

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(
    "index.html",
    { root: path.join(__dirname, "public") },
    (err) => {
      console.error(err);
    }
  )
);
app.get("/tasks", (req, res) => res.send(taskList));
app.get("/nodes", (req, res) => res.send(nodeList));

app.listen(port, () =>
  console.log(`Swarm visualiser listening on port ${port}`)
);
