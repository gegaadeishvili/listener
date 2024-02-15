const express = require("express");
const middleware = require("./middleware");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./expenses.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the chinook database.");
});

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS expenses");
  db.run(`CREATE TABLE expenses (
            id INTEGER PRIMARY KEY,
            info TEXT NOT NULL)`);

  const stmt = db.prepare("INSERT INTO expenses (id, info) VALUES (?,?)");
  for (let i = 0; i < 10; i++) {
    stmt.run(i + 1, "expense -> " + i + "$");
  }
  stmt.finalize();

  db.each("SELECT id, info FROM expenses", (err, row) => {
    console.log(row.id + ": " + row.info);
  });
});

const app = express();

app.use(middleware.logUserAgent);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/expenses/:id", function (req, res) {
  db.get(`SELECT * FROM expenses WHERE id = ?`, req.params.id, (err, row) => {
    if (err) {
      throw err;
    }

    res.send(row);
  });
});

app.get("/expenses", function (req, res) {
  db.all("SELECT * FROM expenses", (err, rows) => {
    if (err) {
      throw err;
    }

    res.send(rows);
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
