import React, { useState, useEffect, useRef } from 'react';
import styles from './AnketaProfile.module.sass';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faVenus, faChevronLeft, faChevronRight, faCheck, faUser, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import Button from "../../components/Button/Button"
import {useNavigate} from "react-router-dom"


export default function AnketaProfile({}) {
   const navigate = useNavigate()

   const [isMobile, setIsMobile] = useState(false);
   const [data, setData] = useState(null);

   const [slideIndex, setSlideIndex] = useState(0);
   const autoSlideRef = useRef(null);
   const touchStartX = useRef(null);

   useEffect(() => {
      // Detect if window < 768 => isMobile
      function handleResize() {
         setIsMobile(window.innerWidth < 768);
      }
      handleResize(); // run once
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // If `data` is null, do nothing in effect
   useEffect(() => {
      if (!data) return; // Guard: data not yet loaded
      startAutoSlideTimer();
      return () => clearInterval(autoSlideRef.current);
   }, [isMobile, data]); // Re-run when mobile state or data changes

   // Simulate async data load
   useEffect(() => {
      const res_data = {
         id: 1,
         name: 'test',
         age: 18,
         boobs: 4,
         phone: '+380961234567',
         photos: [
            'https://iso.500px.com/wp-content/uploads/2016/11/stock-photo-159533631-1500x1000.jpg',
            'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww',
            'https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?cs=srgb&dl=pexels-lukas-rodriguez-1845331-3680219.jpg&fm=jpg',
            'https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?cs=srgb&dl=pexels-ozgomz-2893685.jpg&fm=jpg',
         ],
         description:
            'Хватит уже наяривать ручками дома под одеялом, приезжай ко мне в гости и я покажу тебе что такое настоящий секс, бурный и жаркий как летний денёчек. Звони мне быстрее и приезжай пока я свободна.',
         weight: 50,
         height: 150,
         services: ['service1', 'service2', 'service3'],
         location: 'klsdjflksdjfkdsjfk dsjfkjsdflfk dsjkfdj',
         access: ['home', 'on place'],
         hourPrice: 2000,
         twoHourPrice: 4000,
         nightPrice: 3000,
      };

      setData(res_data);
   }, []);

   // Auto-slide every 6s (on mobile + multiple photos)
   const startAutoSlideTimer = () => {
      // Guard: if data or data.photos is missing => no slider
      if (!data || !data.photos) return;
      if (!isMobile || data.photos.length <= 1) return;

      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
         setSlideIndex((prev) => (prev + 1) % data.photos.length);
      }, 6000);
   };

   // Manual nav
   const prevSlide = () => {
      if (!data || !data.photos) return;
      setSlideIndex((prev) => (prev === 0 ? data.photos.length - 1 : prev - 1));
      startAutoSlideTimer();
   };
   const nextSlide = () => {
      if (!data || !data.photos) return;
      setSlideIndex((prev) => (prev + 1) % data.photos.length);
      startAutoSlideTimer();
   };

   // Overlays
   const handleLeftClick = () => {
      if (!data || !data.photos) return;
      if (data.photos.length > 1) prevSlide();
   };
   const handleRightClick = () => {
      if (!data || !data.photos) return;
      if (data.photos.length > 1) nextSlide();
   };

   // Touch
   const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
   };
   const onTouchEnd = (e) => {
      if (!touchStartX.current) return;
      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diffX) > 50) {
         if (diffX < 0) nextSlide();
         else prevSlide();
      }
      touchStartX.current = null;
   };

   if (!data) return <p>Loading...</p>;

   return (
      <div className={styles.container}>

         <div className={styles.backContainer}>
            <Button onClick={() => navigate(-1)}>
               <FontAwesomeIcon icon={faArrowLeft}/>
               Назад
            </Button>
         </div>

         <div className={styles.profileContainer}>
            {/* TOP BLOCK: name + city */}
            <div className={styles.topBlock}>
               <div className={styles.topName}>
                  <FontAwesomeIcon style={{color: '#9f539f', opacity: .8}} icon={faVenus} />
                  {data.name}
               </div>
            </div>

            <div className={clsx(styles.mainContent, {
               [styles.columnLayout]: isMobile,
            })}>
               <div className={styles.leftSide}>
                  <div
                     className={styles.sliderContainer}
                     onTouchStart={onTouchStart}
                     onTouchEnd={onTouchEnd}
                  >
                     {data.photos.map((url, index) => (
                        <div
                           key={url}
                           className={clsx(styles.slide, {
                              [styles.activeSlide]: index === slideIndex,
                           })}
                        >
                           <img src={url} alt="anketa" />
                        </div>
                     ))}

                     {data.photos.length > 1 && (
                        <>
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

                  <div className={styles.videoContainer}>
                     <video width="100%" controls>
                        <source src="https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                     </video>
                  </div>


               </div>

               <div className={styles.rightSide}>
                  <div className={styles.infoTop}>
                     <div className={styles.infoName}>
                        Имя: <span>{data.name}</span>
                     </div>
                     <div className={styles.infoPhone}>
                        Телефон: <a type='tel' href={data.phone}>{data.phone}</a>
                     </div>
                     <div className={styles.warning}>
                        Девушки с осторожностью относятся к звонкам, поэтому скажите ей, что узнали про неё на сайте
                        <strong> Ночной Киев</strong>. Чтобы не нарваться на мошенников не совершайте предоплату.
                     </div>

                     <div className={styles.priceRow}>
                        <div className={styles.priceBox}>
                           <div>1 час:</div>
                           <div>{data.hourPrice}грн</div>
                        </div>
                        <div className={styles.priceBox}>
                           <div>2 часа:</div>
                           <div>{data.twoHourPrice}грн</div>
                        </div>
                        <div className={styles.priceBox}>
                           <div>Ночь:</div>
                           <div>{data.nightPrice}грн</div>
                        </div>
                     </div>
                  </div>

                  <div className={styles.dataBlock}>
                     <div className={styles.dataRow}>
                        <div className={styles.dataCol}>
                           <div className={styles.label}>Грудь:</div>
                           <div className={styles.value}>{data.boobs}</div>
                        </div>
                        <div className={styles.dataCol}>
                           <div className={styles.label}>Возраст:</div>
                           <div className={styles.value}>{data.age}</div>
                        </div>
                     </div>
                     <div className={styles.dataRow}>
                        <div className={styles.dataCol}>
                           <div className={styles.label}>Рост:</div>
                           <div className={styles.value}>{data.height}</div>
                        </div>
                        <div className={styles.dataCol}>
                           <div className={styles.label}>Вес:</div>
                           <div className={styles.value}>{data.weight}</div>
                        </div>
                     </div>

                     <div className={styles.dataSingleRow}>
                        <div className={styles.label}>Район и метро:</div>
                        <div className={styles.value}>{data.location}</div>
                     </div>
                     <div className={styles.dataSingleRow}>
                        <div className={styles.label}>Принимает:</div>
                        <div className={styles.value}>{(data.access || []).join(', ')}</div>
                     </div>
                  </div>

                  <div className={styles.descBlock}>{data.description}</div>

                  <div className={styles.servicesBlock}>
                     <h3>Интим услуги девушки {data.name}</h3>
                     <div className={styles.servicesList}>
                        {(data.services || []).map((srv) => (
                           <div key={srv} className={styles.serviceItem}>
                              <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                              {srv}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
   );
}
