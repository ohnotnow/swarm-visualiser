const Docker = require('dockerode');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const port = 3000;
var docker = new Docker({socketPath: '/var/run/docker.sock'});

var nodeList = [];
var taskList = [];

async function init() {
    nodeList = await docker.listNodes();
    taskList = await docker.listTasks();
    setTimeout(init, 1000);
}
docker.listNodes().then(nodes => nodeList = nodes);

init();

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile('index.html', {root: path.join(__dirname, 'public')}, err => {
    console.error(err);
}));
app.get('/tasks', (req, res) => res.send(taskList));
app.get('/nodes', (req, res) => res.send(nodeList));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


