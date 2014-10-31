var express = require("express"),
    path = require("path");

var app = express();

app.set("views", path.join(__dirname,"build"));
app.set("view engine", "ejs");

app.use(require("connect-livereload")());

app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "templates")));

app.set("port", process.env.PORT || 3000);

app.get("/",function(req,res){
  console.log("got request");
  res.render("index");
});

var server = app.listen(app.get("port"), function(){
  console.log("Express server listening on port " + server.address().port);
});
