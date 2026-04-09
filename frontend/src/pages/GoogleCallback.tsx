import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const ran = useRef(false); // React strict mode mounts components twice so this code will fail without this:

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    } else {
        console.log("GO BACK")
      navigate("/", { replace: true });
    }
  }, []);

  return <div>Logging you in...</div>;
}