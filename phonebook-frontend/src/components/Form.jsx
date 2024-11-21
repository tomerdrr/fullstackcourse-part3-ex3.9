import personService from "../services/Persons";

const Form = (props) => {
  const messagePersonExist = `${props.newName} is already added to phonebook, Would you like to change the old number?`;
  const personObject = {
    name: props.newName,
    number: props.newNumber,
  };
  const addPerson = (event) => {
    let id = "";
    event.preventDefault();
    const exist = props.persons.reduce((acc, person) => {
      if (acc || person.name === props.newName) {
        id = person.id;
        return true;
      }
      return false;
    }, false);
    if (exist) {
      if (window.confirm(messagePersonExist)) {
        personService
          .update(id, personObject)
          .then((data) => {
            console.log(data);
            const persons = props.persons.map((person) => {
              if (person.id === id) return data.data;
              else return person;
            });
            props.setNewShow(persons);
            props.setPersons(persons);
            props.setNewName("");
            props.setNewNumber("");
            props.setNewSearch("");
          })
          .catch((error) => {
            console.log(error.response.data.error);
            props.setMessage([`${error.response.data.error}`, "error"]);
            setTimeout(() => {
              props.setMessage(null);
            }, 3000);
          });
      }
    } else {
      personService
        .create(personObject)
        .then((person) => {
          console.log(person.data);
          props.setPersons(props.persons.concat(person.data));
          props.setNewName("");
          props.setNewNumber("");
          props.setNewShow(props.persons.concat(person.data));
          props.setNewSearch("");
        })
        .catch((error) => {
          console.log(error.response.data.error);
          props.setMessage([`${error.response.data.error}`, "error"]);
          setTimeout(() => {
            props.setMessage(null);
          }, 3000);
        });
    }
  };

  return (
    <form>
      <div>
        name:{" "}
        <input
          value={props.newName}
          onChange={(event) => {
            props.setNewName(event.target.value);
          }}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={props.newNumber}
          onChange={(event) => {
            props.setNewNumber(event.target.value);
          }}
        />
      </div>
      <div>
        <button type="submit" onClick={addPerson}>
          add
        </button>
      </div>
    </form>
  );
};
export default Form;
