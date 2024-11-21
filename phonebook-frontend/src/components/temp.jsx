const Person = (props) => {
  return (
    <ul>
      {props.persons.map((person) => (
        <li>
          {person.name} {person.number}
        </li>
      ))}
    </ul>
  );
};

export default Person;
