import styles from "./landing.module.css"
import AudioBars from "../components/audiobars/AudioBars.tsx"
import AudioBars2 from "../components/audiobars/AudioBars2.tsx"
import { useState } from "react"
import { createAccount, login } from "../api/users.ts"
import { useNavigate } from "react-router";



/* When clicking on the email page make the red zoom out and fill th entire page */
export default function LandingPage() {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [createPassword, setCreatePassword] = useState("")
  const [passwordConfirm, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [createClicked, setCreate] = useState(false)
  const [username, setUsername ] = useState("")

  const refresh = () => {
    setUsername("")
    setPassword("")
    setError("")
  }

  const handleLogin = async () => {

    const emailValid = /\S+@\S+\.\S+/.test(email);
    if (!emailValid) {
      setError("Please enter a valid email");
      return;
    }
    if (!clicked) {
      setClicked(true)
      return;
    }
    if (!createClicked) {
      if (email.length == 0 && clicked) {
        setError("Please enter an email");
        return;
      }

      if (password.length == 0 && clicked) {
        setError("Please enter a password");
        return;
      }

      if (password.length < 8 && clicked) {
        setError("Password needs to be at least 8 characters long");
        return;
      }
    } 
    if (createClicked) {

      if (createPassword.length == 0 && clicked) {
        setError("Please enter a password");
        return;
      }

      if (createPassword.length < 8 && clicked) {
        setError("Password needs to be at least 8 characters long");
        return;
      }

      if (username.length == 0) {
        setError("Please enter a username");
        return;
      }

      if (createPassword != passwordConfirm && clicked) {
        setError("Passwords do not match");
        return;
      }

      const data = await createAccount( username, email, password);
      if (data.message) {

        setError(data.message);
        return;
      } else {

        localStorage.setItem("token", data.token);
        navigate("/home");
      }

    } else {
      const data = await login(email, password);
      console.log()
      if (data.message) {
        setError(data.message);
        return;
      } else {

        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    }
    setError("");
  };

  return (
    
    <div className={styles.main}>
      <div className={clicked ? styles.disappear : styles.visible}>
        <AudioBars></AudioBars>
        <img src="banner.svg" className={`${styles.banner} ${clicked ? styles.expand : ''}`}></img>
        <div className={styles.dashboard}>
          <div className={styles.title}>startune</div>
          <div className={styles.description}>Find music. Share takes. Start arguments.</div>
          <div className={styles.login}>
            <a className={styles.loginButton}>
              <img src='spotify.svg' className={styles.logo}></img>
              Continue with Spotify
            </a>
            <a className={styles.loginButton}>
              <img src='google.svg' className={styles.google}></img>
              Continue with Google
            </a>
            <div className={styles.logintext}>OR</div>
            <div className={styles.emailContainer}>
              <input type="text" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} className={styles.emailButton} />
              <button onClick={() => handleLogin()} className={styles.enterButton}>
                <img src="arrow.svg"></img>
              </button>
              <div className={error ? styles.errorMessage : ''}>{error}</div>
            </div>
          </div>
        </div>
        <div className={styles.carousel}>
          <div className={styles.group}>
            <div className={styles.card}>
              <img src='card1.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Enhance and socialse your listening experience.</div>
            </div>
            <div className={styles.card}>
              <img src='card2.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Listen, react and leave comments.<br /><br />  All in one place</div>
            </div>
            <div className={styles.card}>
              <img src='card3.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Find like-minded individuals.</div>
            </div>
          </div>
          <div aria-hidden className={styles.group}>
            <div className={styles.card}>
              <img src='card1.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Enhance and socialse your listening experience.</div>
            </div>
            <div className={styles.card}>
              <img src='card2.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Listen, react and leave comments.<br /><br />  All in one place</div>
            </div>
            <div className={styles.card}>
              <img src='card3.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Find like-minded individuals.</div>
            </div>
          </div>
          <div aria-hidden className={styles.group}>
            <div className={styles.card}>
              <img src='card1.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Enhance and socialse your listening experience.</div>
            </div>
            <div className={styles.card}>
              <img src='card2.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Listen, react and leave comments.<br /><br />  All in one place</div>
            </div>
            <div className={styles.card}>
              <img src='card3.png' className={styles.card_img}></img>
              <div className={styles.card_text}>Find like-minded individuals.</div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.loginPage} ${ (clicked && !createClicked) ? '' : styles.hide}`}>
        <AudioBars2></AudioBars2>
        <div className={styles.loginDashboard}>
          <div className={styles.loginTitle}>startune</div>
          <div className={styles.loginSubtitle}>Login</div>
          <div className={styles.loginText}>Email</div>
          <input type="text" defaultValue={email} onChange={(e) => setEmail(e.target.value)} className={styles.loginBubble}></input>
          <div className={styles.loginText}>Password</div>
          <input type="password" onChange={(p) => setPassword(p.target.value)} className={styles.loginBubble}></input>
          <div className={error ? styles.loginErrorMessage : ''}>{error}</div>
          <div className={styles.loginButtons}>
            <button className={styles.backButton} onClick={() => {setClicked(false); setError("")}} >
              <img src="arrow.svg" className={styles.backImg}></img>
              Back
            </button>
            <button className={styles.loginEnter} onClick={() => handleLogin()}>Enter</button>
          </div>
          
          <a className={styles.loginExtras}>Forgot password?</a>
          <button className={styles.loginExtras} onClick={() => {setCreate(true); refresh()}}>Create an account.</button>
        </div>
      </div>
      <div className={`${styles.loginPage} ${ createClicked ? styles.createPage : styles.hide}`}>
        <AudioBars2></AudioBars2>
        <div className={styles.loginDashboard}>
          <div className={styles.loginTitle}>startune</div>
          <div className={styles.createSubtitle}>Create an Account</div>
          <div className={styles.loginText}>Email</div>
          <input type="text" defaultValue={email} onChange={(e) => setEmail(e.target.value)} className={styles.loginBubble}></input>
           <div className={styles.loginText}>Username</div>
          <input type="text" onChange={(e) => setUsername(e.target.value)} className={styles.loginBubble}></input>
          <div className={styles.loginText}>Password</div>
          <input type="password" onChange={(p) => setCreatePassword(p.target.value)} className={styles.loginBubble}></input>
          <div className={styles.loginText}>Confirm Password</div>
          <input type="password" onChange={(p) => setConfirmPassword(p.target.value)} className={styles.loginBubble}></input>
          <div className={error ? styles.loginErrorMessage : ''}>{error}</div>
          <div className={styles.loginButtons}>
            <button className={styles.backButton} onClick={() => {setCreate(false); setError("")}} >
              <img src="arrow.svg" className={styles.backImg}></img>
              Back
            </button>
            <button className={styles.loginEnter} onClick={() => handleLogin()}>Enter</button>
          </div>
        </div>
      </div>
    </div>
  )
}
