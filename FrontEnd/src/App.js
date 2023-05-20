import { useState, useEffect } from "react";
//import axios from "axios";
import Note from "./components/Note";
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  const toggleImportance = (id) => {
    console.log("change inportance of note no. ", id);
    // const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService.update(id, changedNote).then((updatedNote) => {
      setNotes(notes.map((note) => (note.id !== id ? note : updatedNote)));
    });
  };

  useEffect(() => {
    // noteService.getAll().then((response) => {                     actual format
    //   setNotes(response.data);
    // });
    console.log("effect")
    noteService.getAll().then((initialNote) => {
      setNotes(initialNote); // modified format
    });
  }, []);

  console.log("render", notes.length, "notes");

  const notesToShow = showAll
    ? notes
    : notes.filter((n) => n.important === true);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    noteService.create(noteObject).then((createdNote) => {
      setNotes(notes.concat(createdNote));
      setNewNote("");
    });
    console.log("event is ", event.target);
  };

  const handleNote = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportance(note.id)}
            />
          ))}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNote} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
