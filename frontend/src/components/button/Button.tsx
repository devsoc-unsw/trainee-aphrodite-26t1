import styles from "./button.module.css"

export function Button({ children, onClick }: { children: React.ReactNode, onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button onClick={onClick ? onClick : undefined} className={styles.button}>{children}</button>
  )
}
export function LinkButton({ children, href, newTab }: { children: React.ReactNode, href: string, newTab?: boolean }) {
  return (
    <a href={href} className={styles.button} target={newTab ? "_blank" : "_self"}>{children}</a>
  )
}