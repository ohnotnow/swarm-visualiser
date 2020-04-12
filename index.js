const Docker = require("dockerode");
const express = require("express");
const cors = require("cors");
const path = require("path");

const port = process.env.VIS_PORT ? process.env.VIS_PORT : 3000;
const refreshInterval = process.env.VIS_REFRESH
  ? process.env.VIS_REFRESH
  : 1000;
var nodeList = [];
var taskList = [];
var serviceList = [];

// inistialise express
const app = express();
app.use(cors());

// initialise the docker api client
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// trap any exit signals
process.once("SIGINT", function(code) {
  console.log("SIGINT received...");
  process.exit(0);
});
process.once("SIGTERM", function(code) {
  console.log("SIGTERM received...");
  process.exit(0);
});

// gets the current list of nodes and tasks from the docker api
async function refreshDockerInfo() {
  nodeList = await docker.listNodes().catch((err) => console.error(err));
  taskList = await docker.listTasks().catch((err) => console.error(err));
  serviceList = await docker.listServices().catch((err) => console.error(err));
  setTimeout(refreshDockerInfo, refreshInterval);
}

// set up express to serve any static files in the /public directory
app.use(express.static("public"));

// homepage
app.get("/", (req, res) =>
  res.sendFile(
    "index.html",
    { root: path.join(__dirname, "public") },
    (err) => {
      console.error(err);
    }
  )
);
// json endpoints for the swarm tasks and nodes
app.get("/tasks", (req, res) => res.send(taskList));
app.get("/nodes", (req, res) => res.send(nodeList));
app.get("/services", (req, res) => res.send(serviceList));

// and off we go
refreshDockerInfo();
app.listen(port, () =>
  console.log(`Swarm visualiser listening on port ${port}`)
);
