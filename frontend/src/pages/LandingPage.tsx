import styles from "./landing.module.css"
import AudioBars from "../components/audiobars/AudioBars.tsx"
import AudioBars2 from "../components/audiobars/AudioBars2.tsx"
import { useState } from "react"


/* When clicking on the email page make the red zoom out and fill th entire page */
export default function LandingPage() {
  const [clicked, setClicked] = useState(false)
  return (
    
    <div className={styles.main}>
      <div className={clicked ? styles.disappear : ''}>
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
              <input type="text" placeholder="Enter your email" className={styles.emailButton} />
              <button onClick={() => setClicked(true)} className={styles.enterButton}>
                <img src="arrow.svg"></img>
              </button>
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
      <img src="banner.svg" className={`${styles.banner} ${clicked ? styles.expand : ''}`}></img>
      <div className={`${styles.loginPage} ${clicked ? '' : styles.hide}`}>
        <AudioBars2></AudioBars2>
        <div className={styles.loginDashboard}>
          <div className={styles.loginTitle}>startune</div>
          <div className={styles.loginSubtitle}>Login</div>
          <div className={styles.loginText}>Email</div>
          <input type="text"className={styles.loginBubble}></input>
          <div className={styles.loginText}>Password</div>
          <input type="password" className={styles.loginBubble}></input>
          <button className={styles.loginEnter}>Enter</button>
          <a className={styles.loginExtras}>Forgot password?</a>
          <a className={styles.loginExtras}>Create an account.</a>
        </div>
      </div>
    </div>
  )
}
