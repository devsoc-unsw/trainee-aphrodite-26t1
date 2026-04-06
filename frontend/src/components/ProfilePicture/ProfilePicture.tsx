import styles from "./ProfilePicture.module.css";

export type ProfilePictureProps = {
    src: string
}

const ProfilePicture = (props : ProfilePictureProps) => {
    return (
        <img src={props.src} className = {styles.profilePicture} ></img>
    )
}

export { ProfilePicture };