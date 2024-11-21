const Search = (props) => {
  const searchPesron = (search) => {
    const toShow = props.persons.filter((person) =>
      person.name.toLowerCase().startsWith(search.toLowerCase())
    );
    props.setNewShow(toShow);
  };

  return (
    <div>
      Filter shown with:{" "}
      <input
        value={props.newSearch}
        onChange={(event) => {
          const search = event.target.value;
          props.setNewSearch(search);
          searchPesron(search);
        }}
      />
    </div>
  );
};

export default Search;
