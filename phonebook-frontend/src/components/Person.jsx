const Person = (props) => {
  return (
    <li>
      {props.name} {props.number}
      <button onClick={props.deletePerson}>delete</button>
    </li>
  );
};

const Persons = (props) => {
  return (
    <div>
      <ul>
        {props.showPersons.map((person, index) => (
          <Person
            key={index}
            name={person.name}
            number={person.number}
            deletePerson={() => props.deletePerson(person.id, person.name)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Persons;
