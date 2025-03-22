import React from 'react'
import styles from './Select.module.sass'


function capitalizeFirstLetter(val) {
   return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

const Select = ({title, options, value, changeState, ...props}) => {
   const onChange = (e) => {
      e.preventDefault();
      changeState(e.target.value);
   };

   return (
     <select className={styles.container} onChange={onChange} value={value} {...props}>
        <option value={""}>{title}</option>

        {options.map(el => (
           <option key={el} name={el} value={el}>{capitalizeFirstLetter(el)}</option>
        ))}
     </select>
   )
}

export default Select