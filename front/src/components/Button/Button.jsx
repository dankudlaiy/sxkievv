import styles from './Button.module.sass'
import clsx from "clsx"

const Button = ({children, disabled=false, style={}, type, submit=false, ...props}) => {
   return (
      <button
         disabled={disabled}
         type={'submit' ? submit : 'button'}
         onClick={props.onClick}
         className={clsx(styles.container, styles[type], { [styles.disabled]: disabled })}
         style={style}
         {...props}
      >
         {children}
      </button>
   )
}

export default Button