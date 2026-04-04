import { useState, } from "react";
import styles from "./searchbar.module.css"

interface SearchBarProps {
  placeholder: string,
  onSubmit: (query: string) => void
}

export default function SearchBar({ onSubmit, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    onSubmit(trimmed);
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
        placeholder={placeholder}
      />
    </form>
  )
}