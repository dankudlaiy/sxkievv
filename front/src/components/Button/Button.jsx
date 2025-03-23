import styles from './Button.module.sass'
import clsx from "clsx"

const Button = ({children, style={}, type, submit=false, ...props}) => {
   return (
      <button type={'submit' ? submit : 'button'} onClick={props.onClick} className={clsx(styles.container, styles[type])} style={style} {...props}>
         {children}
      </button>
   )
}

export default Button