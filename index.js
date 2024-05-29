const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("body", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  console.log(request.headers["user-agent"]);
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  console.log(persons);
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date().toUTCString()}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    console.log("Happened");
    response.json(person);
  } else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 99999);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "Persons already exists",
    });
  }

  let id = generateId();
  while (persons.find((person) => person.id === id)) id = generateId();
  const person = {
    id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
