import styles from "./button.module.css"

type ButtonStyle = "default" | "accent" | "outline";

interface ButtonProps {
  children: React.ReactNode,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  active?: boolean,
  buttonStyle?: ButtonStyle
}

export function Button({ children, onClick, active, buttonStyle }: ButtonProps) {
  return (
    <button onClick={onClick ? onClick : undefined} className={
      `${styles.button} ${active ? styles.active : null} ${buttonStyle === "accent" ?
        styles.buttonAccent : buttonStyle === "outline" ?
        styles.buttonOutline : ""
      }`
    }>{children}</button>
  )
}
export function LinkButton({ children, href, newTab }: { children: React.ReactNode, href: string, newTab?: boolean }) {
  return (
    <a href={href} className={styles.button} target={newTab ? "_blank" : "_self"}>{children}</a>
  )
}