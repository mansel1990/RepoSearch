import { useEffect, useState } from "react";
import axios from "axios";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Pagination from "./Pagination";
import Spinner from "./Spinner";
import { isError } from "lodash";

type Props = {
  searchValue: string;
};

function RepoGrid({ searchValue }: Props) {
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRec, setTotalRec] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  useEffect(() => {
    console.log("currentPage ==> ", currentPage);
    const getData = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams([
        ["q", `${searchValue}`],
        ["page", `${currentPage}`],
        ["per_page", "10"],
      ]);
      const data = await axios.get(
        `https://api.github.com/search/repositories?${queryParams}`
      );
      return data.data;
    };
    getData()
      .then((data) => {
        setIsLoading(false);
        setRowData(data.items);
        setLastPage(Math.ceil(data.total_count / 10));
        setTotalRec(data.total_count);
        setError("");
      })
      .catch((err) => {
        console.log("Error", err);
        setError(err.response.data.message);
        setIsLoading(false);
      });
  }, [currentPage, searchValue]);

  const columns = [
    { key: "id", name: "ID" },
    { key: "name", name: "Name" },
    { key: "description", name: "Description" },
    { key: "watchers", name: "Watchers" },
  ];

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {error ? (
            <div className="error">{error}</div>
          ) : (
            <DataGrid columns={columns} rows={rowData} rowHeight={32} />
          )}
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            maxLength={7}
            setCurrentPage={setCurrentPage}
            total={totalRec}
          />
        </div>
      )}
    </div>
  );
}

export default RepoGrid;
