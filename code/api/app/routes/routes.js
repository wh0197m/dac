module.exports = app => {
  const ctl = require("../controllers/controller.js");

  var router = require("express").Router();

  router.post("/config", ctl.configuration);

  router.post("/sync", ctl.sync);


  app.use("/api", router);
};
