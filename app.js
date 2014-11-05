var express = require("express"),
    path = require("path"),
    Eth = require("./node-ethereum-tmp");

var app = express();

app.set("views", path.join(__dirname,"build"));
app.set("view engine", "ejs");

app.use(require("connect-livereload")());

app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 3000);

app.get("/",function(req,res){
  res.render("index");
});

var server = app.listen(app.get("port"), function(){
  console.log("Express server listening on port " + server.address().port);
});


var eth = new Eth({
  network: {
    host: "0.0.0.0",
    port: 30303
  },
  rpc: true
});

eth.start(function(err){
  if(err){
    console.log("on start:", err);
  } else {
    console.log("Node ethereum started");
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});

function shutdown() {
  eth.log.info('app', 'shutting down');
  eth.stop(function () {
    app.log.info('app', 'bye');
  });
}
