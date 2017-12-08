const blessed = require("blessed");
const { spawn } = require("child_process");

const screen = blessed.screen({
  smartCSR: true,
  sendFocus: true,
  dockBorders: false,
  fullUnicode: true,
  autoPadding: true,
});

screen.title = "one-punch-fitness -- dev process [option+drag to select text]";

const bsbBox = blessed.box({
  align: "left",
  width: "50%",
  height: "100%",
  mouse: true,
  keys: true,
  scrollable: true,
  tags: true,
  border: {
    type: "line",
  },
});

const expoBox = blessed.box({
  align: "right",
  scrollable: true,
  width: "50%",
  right: true,
  mouse: true,
  keys: true,
  height: "100%",
  tags: true,
  border: {
    type: "line",
  },
});

// Append our box to the screen.
screen.append(expoBox);
screen.append(bsbBox);

const reasonBuildSysWatch = spawn("npm", ["run", "watch-reason"]);
const expoServer = spawn("npm", ["run", "start-expo"]);

reasonBuildSysWatch.stdout.on("data", data => {
  bsbBox.pushLine(data.toString());
  bsbBox.setScrollPerc(100);
  screen.render();
});

reasonBuildSysWatch.stderr.on("data", data => {
  bsbBox.pushLine(data.toString());
  bsbBox.setScrollPerc(100);
  screen.render();
});

reasonBuildSysWatch.on("close", code => {
  bsbBox.pushLine(`child process exited with code ${code}`);
  bsbBox.setScrollPerc(100);
  screen.render();
});

expoServer.stdout.on("data", data => {
  expoBox.pushLine(data.toString());
  expoBox.setScrollPerc(100);
  screen.render();
});

expoServer.stderr.on("data", data => {
  expoBox.pushLine(data.toString());
  expoBox.setScrollPerc(100);
  screen.render();
});

expoServer.on("close", code => {
  expoBox.pushLine(`child process exited with code ${code}`);
  expoBox.setScrollPerc(100);
  screen.render();
});

screen.key(["escape", "q", "C-c"], function(ch, key) {
  reasonBuildSysWatch.kill();
  expoServer.kill();
  return process.exit(0);
});

// Render the screen.
screen.render();