var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),
    bowerFiles = require("main-bower-files"),
    //angularFilesort = require("gulp-angular-filesort"),
    es = require("event-stream");

//TODO DRY up
//TODO move all assets into build/public

gulp.task("clean",function(){
  return gulp.src("./build/*", {read:false})
    .pipe(plugins.clean());
});

gulp.task("bower", function(){
  return plugins.bower({directory: "./assets/bower_components"});
});

gulp.task("build-js",["clean","bower"],function(){
  return es.merge(
    gulp.src("./assets/js/**/*.js", {base: "./assets/js/"})
      .pipe(gulp.dest("./build/js")),
    gulp.src(bowerFiles({
      paths: {
        bowerDirectory: 'assets/bower_components',
        bowerrc: '.bowerrc',
        bowerJson: 'bower.json'
      }
    })).pipe(gulp.dest("./build/js/bower/"))
  );
});

gulp.task("build-css",["clean","bower"],function(){
  return gulp.src("./assets/css/**/*.less")
    .pipe(plugins.less())
    .pipe(gulp.dest("./build/css"));
});

var runIndex = function(){
  return gulp.src("./views/index.ejs")
    .pipe(plugins.inject(gulp.src("js/bower/**/*.js",{read:false, cwd: "./build"})
                         .pipe(plugins.order([
                           "jquery.js",
                           "angular.js",
                           "*"
                         ])),
                         {starttag: "<!-- inject:bower_components:js -->"}))
    .pipe(plugins.inject(gulp.src(["js/**/*.js", "!js/bower/**/*.js"], {cwd: "./build"})
                         .pipe(plugins.angularFilesort())))
    .pipe(plugins.inject(gulp.src("css/**/*.css", {read: false, cwd: "./build"})))
    .pipe(gulp.dest("./build/"))
    .pipe(plugins.livereload());
};

gulp.task("index", function(){
  return runIndex();
});

gulp.task("build",["build-js", "build-css"]);


gulp.task("watch", function(){
  es.merge(
    plugins.watch("assets/js/**/*.js", {base: "./assets"})
      .pipe(gulp.dest("./build/")),

    plugins.watch("assets/css/**/*.less", {base: "./assets"})
      .pipe(plugins.less())
      .pipe(gulp.dest("./build/")),

    plugins.watch("public/templates/**/*.html")
  ).pipe(plugins.livereload());

  plugins.watch(["build/**/*.js","build/**/*.css"], {read:false},function(){
    gulp.start("index");
  });

  plugins.watch("bower.json", function(){
    gulp.start("build");
  });
});


gulp.task("default",["build","watch"],function(){
  plugins.nodemon({
    script: "app.js",
    ext: "js ejs json",
    ignore: ["node_modules/**", "assets/**"]
  }).on("restart", function(){
    console.log("Nodemon: restarted.");
  });
});
