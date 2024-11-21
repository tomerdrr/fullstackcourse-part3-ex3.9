const express = require("express");
const app = express();
require("dotenv").config();

const Contact = require("./models/contact");

let persons = [];

app.use(express.static("dist"));

const errorHandler = (error, request, response, next) => {
  console.error(error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  console.log(error);
  next(error);
};

const cors = require("cors");

app.use(express.json());
app.use(cors());

const morgan = require("morgan");

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  console.log(request.headers["user-agent"]);
  response.send("<h1>Hello World!</h1>");
});

app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    console.log(contacts);
    response.json(contacts);
  });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      console.log(savedContact);
      response.json(savedContact);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  response.send(`
    <p>Phonebook has info for ${Contact.length} people.</p>
    <p>${new Date().toUTCString()}</p>
    `);
});

app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})

app.get("/api/persons/:id", (request, response, next) => {
  console.log(request.params.id);
  Contact.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result);
      response.json(result).status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
