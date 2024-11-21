import { useState, useEffect } from "react";
import personService from "./services/Persons";
import Persons from "./components/Person";
import Search from "./components/Search";
import Form from "./components/Form";
import Notification from "./components/Notification";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [showPersons, setNewShow] = useState(persons);
  const [showMessage, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((data) => {
      console.log("Data", data);
      setPersons(data);
      setNewShow(data);
    });
  }, []);

  const deletePerson = (id, name) => {
    console.log(id);
    if (window.confirm("Do you really want to delete this person?")) {
      personService
        .remove(id)
        .then((response) => {
          console.log(response);
          console.log("Deleted", response.data.name);
          personService.getAll().then((data) => {
            setPersons(data);
            setNewShow(data);
          });
          setMessage([
            `${response.data.name} was successfuly removed from the server.`,
            "success",
          ]);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setMessage([
            `Information of ${name} as already been removed from the server`,
            "error",
          ]);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        });
    } else {
      setMessage([`Delete cancelled`, "error"]);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <Notification message={showMessage} />
      <Search
        persons={persons}
        setNewShow={setNewShow}
        newSearch={newSearch}
        setNewSearch={setNewSearch}
      />
      <Form
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setNewShow={setNewShow}
        setNewSearch={setNewSearch}
        setMessage={setMessage}
      />
      <h2>Numbers</h2>
      <Persons showPersons={showPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
