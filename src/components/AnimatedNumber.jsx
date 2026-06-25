import { useEffect, useRef, useState } from "react";
import { fmt } from "../utils/format";


export default function AnimatedNumber({ value, className }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const intervalRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    let s = 0;
    intervalRef.current = setInterval(() => {
      s++;
      if (s >= 20) {
        setDisplay(to);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        fromRef.current = to;
      } else {
        setDisplay(Math.round(from + (to - from) * (s / 20)));
      }
    }, 16);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [value]);

  return <div className={className}>{fmt(display)}</div>;
}
