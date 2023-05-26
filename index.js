const Joi = require("joi");
const express = require("express");
const { send } = require("process");
const app = express();
const port = process.env.PORT || 5000;

//Middle Wares
app.use(express.json());

const genres = [
  { id: 1, name: "action" },
  { id: 2, name: "thriller" },
  { id: 3, name: "horror" },
  { id: 4, name: "drama" },
  { id: 5, name: "comdey" },
  { id: 6, name: "romance" },
];

app.get("/api/genres", (req, res) => res.send(JSON.stringify(genres)));

app.get("/api/genres/:genre", (req, res) => {
  const genre = genres.find((item) => item.name === req.params.genre);

  if (!genre) return res.status(404).send("requested genre not found");
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error, value } = validateGenre(req.body);

  if (error) return res.status(400).send(error?.details[0].message);
  const genre = { id: genres.length + 1, name: req.body.name };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:genre", (req, res) => {
  const genre = genres.find((item) => item.name === req.params.genre);

  if (!genre) return res.status(404).send("requested genre not found");

  const { error, value } = validateGenre(req.body);

  if (error) return res.status(400).send(error?.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

const validateGenre = (genre) => {
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  return schema.validate(genre);
};

//root
app.get("/", (req, res) => res.send("Vidly Surver is running"));
app.listen(port, () => console.log(`Listening on port ${port}`));
