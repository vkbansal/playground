"use strict";

let gulp = require("gulp"),
    fs = require("fs"),
    path = require("path"),
    data = require("gulp-data"),
    sass = require("gulp-sass"),
    md = require("markdown-it")({
        html: true
    }),
    nunjucksRender = require("gulp-nunjucks-render");

md.use(require("markdown-it-decorate"));

gulp.task("default", ["styles", "html"]);

gulp.task("styles", () => {
    gulp.src("./assets/scss/base.scss")
        .pipe(sass({
            includePaths: ["./node_modules/materialize-css/sass"]
        }).on("error", sass.logError))
        .pipe(gulp.dest("./public/css"));
});

gulp.task("styles:watch", ["styles"], () => {
    gulp.watch("./assets/**/*.scss", ["styles"]);
});

gulp.task("html", () => {
    gulp.src("./examples/**/*.njk")
        .pipe(data((file, callback) => {
            let dir = path.dirname(file.path),
                readme = path.join(dir, "README.md");

            fs.readFile(readme, "utf8", (err, data) => {
                callback(err, {
                    path: path.dirname(file.relative),
                    content: md.render(data)
                });
            });
        }))
        .pipe(nunjucksRender({
            path: ["./assets/templates"],
            envOptions: {
                autoescape: false
            }
        }))
        .pipe(gulp.dest("./public"));
});
