import React, { useState, useEffect, useRef } from 'react';
import styles from './AdminAnketa.module.sass';
import clsx from 'clsx';
import Button from '../../components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faVenus, faChevronLeft, faChevronRight, faPen, faTurnUp, faClock, faBullhorn, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom"
import Hr from "../../components/Hr"


const AdminAnketa = ({ data }) => {
   const navigate = useNavigate()

   const [isMobile, setIsMobile] = useState(false);
   const [slideIndex, setSlideIndex] = useState(0);
   const sliderRef = useRef(null);

   // We'll store our interval ID here so we can clear/restart it
   const autoSlideRef = useRef(null);

   // Only show up to 4 photos
   const photos = data.photos.slice(0, 4);

   // ─────────────────────────────────────────────────────────────
   // 1) Detect screen width < 768 => isMobile
   // ─────────────────────────────────────────────────────────────
   useEffect(() => {
      function handleResize() {
         setIsMobile(window.innerWidth < 768);
      }
      handleResize(); // run once at mount
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // ─────────────────────────────────────────────────────────────
   // 2) Start/Restart auto-slide interval if isMobile + multiple photos
   // ─────────────────────────────────────────────────────────────
   const startAutoSlideTimer = () => {
      if (!isMobile || photos.length <= 1) return;
      // Clear any existing timer
      clearInterval(autoSlideRef.current);

      autoSlideRef.current = setInterval(() => {
         setSlideIndex((prev) => (prev + 1) % photos.length);
      }, 6000);
   };

   // On mount or when `isMobile`/photos changes, set up the timer
   useEffect(() => {
      startAutoSlideTimer();

      // Cleanup when unmounting
      return () => clearInterval(autoSlideRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isMobile, photos.length]);

   // ─────────────────────────────────────────────────────────────
   // 3) SLIDER
   // ─────────────────────────────────────────────────────────────
   const prevSlide = () => {
      setSlideIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      startAutoSlideTimer();
   };

   const nextSlide = () => {
      setSlideIndex((prev) => (prev + 1) % photos.length);
      startAutoSlideTimer();
   };

   const handleLeftClick = () => {
      if (photos.length > 1) prevSlide();
   };
   const handleRightClick = () => {
      if (photos.length > 1) nextSlide();
   };

   const touchStartX = useRef(null);

   const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
   };

   const onTouchEnd = (e) => {
      if (touchStartX.current == null) return;
      const diffX = e.changedTouches[0].clientX - touchStartX.current;

      if (Math.abs(diffX) > 50) {
         if (diffX < 0) {
            // Swiped left => next slide
            nextSlide();
         } else {
            // Swiped right => prev slide
            prevSlide();
         }
      }
      touchStartX.current = null;
   };

   // ─────────────────────────────────────────────────────────────
   // 6) Open full anketa
   // ─────────────────────────────────────────────────────────────
   const openAnketa = () => {
      navigate(`/${data.id}`)
   };

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            {/* Top Section */}
            <div className={styles.top}>
               <div className={styles.name}>
                  <FontAwesomeIcon icon={faVenus} />
                  {data.name}
               </div>
               <div className={styles.city}>Киев</div>
            </div>

            <div className={styles.middle}>
               <div className={styles.left}>
                  {isMobile ? (
                     // MOBILE SLIDER
                     <div
                        className={styles.sliderContainer}
                        ref={sliderRef}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                     >
                        {photos.map((url, index) => (
                           <div
                              key={url}
                              className={clsx(styles.slide, {
                                 [styles.activeSlide]: index === slideIndex
                              })}
                              onClick={openAnketa}
                           >
                              <img src={url} alt="" />
                           </div>
                        ))}

                        {photos.length > 1 && (
                           <>
                              {/* Nav Buttons */}
                              <button className={styles.arrowLeft} onClick={prevSlide}>
                                 <FontAwesomeIcon icon={faChevronLeft} />
                              </button>
                              <button className={styles.arrowRight} onClick={nextSlide}>
                                 <FontAwesomeIcon icon={faChevronRight} />
                              </button>
                              {/* Invisible Overlays */}
                              <div className={styles.overlayLeft} onClick={handleLeftClick} />
                              <div className={styles.overlayRight} onClick={handleRightClick} />
                           </>
                        )}
                     </div>
                  ) : (
                     // DESKTOP PHOTO GRID
                     <div className={styles.photos}>
                        {photos.map((el) => (
                           <div key={el} className={styles.photo} onClick={openAnketa}>
                              <img src={el} alt="" />
                           </div>
                        ))}
                     </div>
                  )}

                  {/*<div className={styles.description}>{data.description}</div>*/}
                  {!isMobile && <div className={styles.description}>{data.description}</div>}
               </div>

               <div className={styles.right}>
                  <div className={styles.data_container}>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Возраст:</div>
                        <div className={styles.data_value}>{data.age}</div>
                     </div>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Вес:</div>
                        <div className={styles.data_value}>{data.weight}кг</div>
                     </div>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>Рост:</div>
                        <div className={styles.data_value}>{data.height}см</div>
                     </div>

                     <div
                        style={{ borderTop: 'none', borderTopRightRadius: '4px', borderTopLeftRadius: '4px' }}
                        className={clsx(styles.data_row, styles.price)}
                     >
                        <div className={styles.data_title}>1 час:</div>
                        <div className={styles.data_value}>{data.hourPrice}грн</div>
                     </div>

                     <div className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>2 часа:</div>
                        <div className={styles.data_value}>{data.twoHourPrice}грн</div>
                     </div>

                     <div
                        style={{ borderBottomRightRadius: '4px', borderBottomLeftRadius: '4px' }}
                        className={clsx(styles.data_row, styles.price)}
                     >
                        <div className={styles.data_title}>Ночь:</div>
                        <div className={styles.data_value}>{data.nightPrice}грн</div>
                     </div>
                  </div>

                  {isMobile && <div className={styles.description}>{data.description}</div>}

                  <Button type="submit-noshine" onClick={openAnketa}>
                     Посмотреть анкету
                  </Button>
               </div>
            </div>

            <div className={styles.bottom}>
               <h2>Анкета видна на сайте</h2>

               <Hr/>

               <div className={styles.admin_data}>
                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>Пакет</div>
                     <div className={styles.admin_data_val}>Вип</div>
                  </div>

                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>Осталось дней</div>
                     <div className={styles.admin_data_val}>21</div>
                  </div>

                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>Просмотры</div>
                     <div className={styles.admin_data_val}>6234</div>
                  </div>

                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>Нажатий на телефон</div>
                     <div className={styles.admin_data_val}>150</div>
                  </div>
               </div>

               <Hr/>

               <div className={styles.admin_btns}>
                  <Button style={{background: 'gray'}}>
                     <FontAwesomeIcon icon={faEyeSlash} />
                     Скрыть
                  </Button>
                  <Button>
                     <FontAwesomeIcon icon={faTurnUp} />
                     Сменить тариф
                  </Button>
                  <Button>
                     <FontAwesomeIcon icon={faClock} />
                     Продлить анкету
                  </Button>
                  <Button>
                     <FontAwesomeIcon icon={faBullhorn} />
                     Продвигать
                  </Button>
                  <Button>
                     <FontAwesomeIcon icon={faPen} />
                     Редактировать
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminAnketa;
