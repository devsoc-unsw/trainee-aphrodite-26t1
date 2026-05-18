import { useState } from "react";
import styles from "./toggleButton.module.css";
import { makePrivate } from "../../api/users";
export function ToggleButton({initial, setting}: {initial: boolean, setting: string} ) {
  const [on, setOn] = useState(initial);

  const handleClick = async () => {
    if (setting === "private") {
        makePrivate(!on)
    }
  }
  return (
    <div
      className={`${styles.track} ${on ? styles.on : ""}`}
      onClick={async () => {setOn(prev => !prev); await handleClick();}}
    >
      <div className={styles.knob} />
    </div>
  );
}