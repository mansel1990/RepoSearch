import { useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { getPaginationItems } from "../lib/pagination";
import PageLink from "./PageLink";
import "./Pagination.css";

export type Props = {
  currentPage: number;
  lastPage: number;
  maxLength: number;
  total: number;
  setCurrentPage: (page: number) => void;
};

export default function Pagination({
  currentPage,
  lastPage,
  maxLength,
  total,
  setCurrentPage,
}: Props) {
  const [myPage, setMyPage] = useState(currentPage);
  const pageNums = getPaginationItems(currentPage, lastPage, maxLength);
  const [err, setErr] = useState("");
  const handleGoTo = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    if (isNaN(Number(value)) || Number(value) > lastPage) {
      setErr("Please enter a valid number");
    } else {
      setErr("");
      setMyPage(Number(value));
      debouncedSendRequest(value);
    }
  };

  const sendRequest = useCallback((value: string) => {
    if (value) {
      setCurrentPage(Number(value));
    }
  }, []);

  // memoize the debounce call with useMemo
  const debouncedSendRequest = useMemo(() => {
    return debounce(sendRequest, 1000);
  }, [sendRequest]);

  return (
    <div className="bottom-bar">
      <div>Total Records: {total}</div>
      <nav className="pagination" aria-label="Pagination">
        <PageLink
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </PageLink>
        {pageNums.map((pageNum, idx) => (
          <PageLink
            key={idx}
            active={currentPage === pageNum}
            disabled={isNaN(pageNum)}
            onClick={() => setCurrentPage(pageNum)}
          >
            {!isNaN(pageNum) ? pageNum : "..."}
          </PageLink>
        ))}

        <PageLink
          disabled={currentPage === lastPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </PageLink>
      </nav>
      <div className="goto-box">
        <span>Go To Page-</span>
        <input
          className="goto-input-eff"
          placeholder=""
          onChange={handleGoTo}
          value={myPage}
        />
        {err && <span className="error">{err}</span>}
      </div>
    </div>
  );
}
