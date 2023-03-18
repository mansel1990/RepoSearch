import { useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";

type Props = {
  setSearchValue: (value: string) => void;
};

function SearchBar({ setSearchValue }: Props) {
  const [value, setValue] = useState("madam");
  const [error, setError] = useState("");
  const handleInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setValue(value);
    debouncedSendRequest(value);
  };

  const sendRequest = useCallback(
    (value: string) => {
      if (value) {
        setSearchValue(value);
        setError("");
      } else {
        setError("Search box cannot be empty");
      }
    },
    [setSearchValue]
  );

  // memoize the debounce call with useMemo
  const debouncedSendRequest = useMemo(() => {
    return debounce(sendRequest, 1000);
  }, [sendRequest]);

  return (
    <>
      <div className="search-bar">
        <span>Throttled Search bar:&emsp;</span>
        <input
          className="input-eff"
          placeholder="Enter your search.."
          onChange={handleInput}
          value={value}
        />
      </div>
      {error && (
        <p className="error">
          Search value cannot be empty. Please enter some value in the search
          box.
        </p>
      )}
    </>
  );
}

export default SearchBar;
