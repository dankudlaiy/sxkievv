import React from 'react';
import clsx from 'clsx';
import styles from './EditAnketa.module.sass';

const AnketaPackageSelector = ({
                                  title,
                                  packages = [],         // array of { key, title, price }
                                  value = null,          // currently selected package object or key
                                  changeState,           // (newPackage) => void
                                  error
                               }) => {

   // Example of chunking packages into rows of 2
   const chunkedPackages = [];
   for (let i = 0; i < packages.length; i += 3) {
      chunkedPackages.push(packages.slice(i, i + 3));
   }

   // Single selection: clicking a new package replaces the old selection
   const selectPackage = (pkg) => {
      changeState(pkg);
   };

   return (
      <div className={styles.package_selector}>
         {title && <h2 className={styles.package_title}>{title}</h2>}

         <table className={styles.packageTable}>
            <tbody>
            {chunkedPackages.map((row, rowIndex) => (
               <tr key={rowIndex}>
                  {row.map((pkg, colIndex) => {
                     // if value is an object, compare .key
                     // if value is just a string, compare with pkg.key
                     const isSelected = value && (value === pkg);

                     return (
                        <td key={colIndex} className={styles.packageCell}>
                           <div
                              onClick={() => selectPackage(pkg)}
                              className={clsx(styles.packageCard, {
                                 [styles.selected]: isSelected
                              })}
                           >
                              <strong>{pkg}</strong>
                              <br />
                              {/*{pkg.price}$ / месяц*/}
                           </div>
                        </td>
                     );
                  })}
               </tr>
            ))}
            </tbody>
         </table>

         {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
   );
};

export default AnketaPackageSelector;
