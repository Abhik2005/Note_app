const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir("./todo", function (err, files) {
    if (err) console.log(err);
    else {
      let todoTitle = files
        .map(function (file) {
          return file.split(".")[0];
        })
        .filter((title) => {
          if (title.length > 0) {
            return true;
          }
        });
      res.render("index", { todoTitle: todoTitle });
    }
  });
});

app.get("/todo/:title", function (req, res) {
  fs.readFile(
    `./todo/${req.params.title}.txt`,
    "utf8",
    function (err, fileData) {
      if (err) console.log(err);
      else {
        res.render("showTodo", {
          title: req.params.title.split("_").join(" "),
          fileData: fileData,
        });
      }
    },
  );
});

app.get("/todo/delete/:title", function (req, res) {
  fs.unlink(`./todo/${req.params.title}.txt`, function (err) {
    if (err) console.log(err);
    else res.redirect("/");
  });
});

app.get("/todo/update/:title", function (req, res) {
  fs.readFile(
    `./todo/${req.params.title.split(" ").join("_")}.txt`,
    "utf8",
    function (err, fileData) {
      if (err) console.log(err);
      else
        res.render("updateTodo", {
          title: req.params.title,
          fileData: fileData,
        });
    },
  );
});

app.post("/create", function (req, res) {
  var title = req.body.title.split(" ").filter((a)=> {
    return a
  }).join("_");
  console.log(title)
  fs.writeFile(
    `./todo/${title}.txt`,
    `${req.body.details}`,
    function (error) {
      if (error) console.log(error);
      else 
        res.redirect("/");
    },
  );
});

app.post(`/todo/update/:title`, function (req, res) {
  var title = req.body.title.split(" ").filter((a)=> {
    return a
  }).join("_");
  console.log(title)
  fs.writeFile(
    `./todo/${req.params.title.split(" ").join("_")}.txt`,
    `${req.body.details}`,
    function (err) {
      if (err) console.log(err);
    }
  );
  fs.rename(
    `./todo/${req.params.title.split(" ").join("_")}.txt`,
    `./todo/${title}.txt`,
    function (err) {
      if (err) console.error(err);
      else res.redirect(`/todo/${title}`);
      
    }
  );
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
