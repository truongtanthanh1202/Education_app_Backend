const siteRouter = require("./site");
const meRouter = require("./me");
const teacherRouter = require("./teacher");
const studentRouter = require("./student");
const splashRouter = require("./splash");
const uploadRouter = require("./upload");
const emailRouter = require("./email");
function route(app) {
  app.use("/splash-screens", splashRouter);
  app.use("/teacher", teacherRouter);
  app.use("/student", studentRouter);
  app.use("/site", siteRouter);
  app.use("/me", meRouter);
  app.use("/upload", uploadRouter);
  app.use("/check", emailRouter);
  app.use("/", siteRouter);
}

module.exports = route;
