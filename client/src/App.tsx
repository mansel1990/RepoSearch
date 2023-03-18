import { useState } from "react";
import "./App.css";
import RepoGrid from "./components/RepoGrid";
import SearchBar from "./components/SearchBar";

function App() {
  const [searchValue, setSearchValue] = useState("madam");
  return (
    <div className="container">
      <h1>Git Hub Repo Search</h1>
      <SearchBar setSearchValue={setSearchValue} />
      <RepoGrid searchValue={searchValue} />
    </div>
  );
}

export default App;
