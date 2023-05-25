const express = require("express");
const app = express();
const cors = require("cors");

// It is necessary to import env config before importing note
require("dotenv").config();
const Note = require("./models/note");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

let notes = [];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const updatedImportant = request.body.important;

  Note.findByIdAndUpdate(
    id,
    { $set: { important: updatedImportant } },
    { new: true }
  )
    .then((updatedNote) => {
      if (!updatedNote) {
        return response.status(404).json({ message: "Note not found" });
      }
      response.json(updatedNote);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    });
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  //  const note = {
  //    content: body.content,
  //    important: body.important || false,
  //    id: generateId(),
  //  };
  console.log(note);
  notes = notes.concat(note);
  note.save().then((result) => {
    console.log("note saved!");
    // mongoose.connection.close()
  });

  response.json(note);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello, World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id); // param is of type string cast it to number before rendering any element
  console.log(id);
  const note = notes.find((note) => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === Number(id)); // just to show that id param passed is of type string
    return note.id === id;
  });
  console.log(note);
  if (note) {
    return response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id); // param is of type string cast it to number before rendering any element
  console.log(id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
