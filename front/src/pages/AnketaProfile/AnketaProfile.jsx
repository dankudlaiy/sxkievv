import React, {useState, useEffect, useRef} from 'react'
import styles from './AnketaProfile.module.sass'
import clsx from 'clsx'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faVenus, faChevronLeft, faChevronRight, faCheck, faUser, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import Button from "../../components/Button/Button"
import {useNavigate, useParams} from "react-router-dom"
import Loader from "../../components/Loader/Loader"


export default function AnketaProfile({}) {
   const {id} = useParams()
   const navigate = useNavigate()

   const [isMobile, setIsMobile] = useState(false)
   const [data, setData] = useState(null)

   const [slideIndex, setSlideIndex] = useState(0)
   const autoSlideRef = useRef(null)
   const touchStartX = useRef(null)

   const [notFound, setNotFound] = useState(false)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      // Detect if window < 768 => isMobile
      function handleResize() {
         setIsMobile(window.innerWidth < 768)
      }

      handleResize() // run once
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   // If `data` is null, do nothing in effect
   useEffect(() => {
      if (!data) return // Guard: data not yet loaded
      startAutoSlideTimer()
      return () => clearInterval(autoSlideRef.current)
   }, [isMobile, data]) // Re-run when mobile state or data changes


   const fetchProfiles = async () => {
      console.log(id)

      const res = await fetch(
         `/api/Profile/${id}`,
         {
            method : "GET",
            headers: {
               "Content-Type": "application/json",
               "Accept"      : "application/json",
            },
         }
      )

      if (res.status === 404) {
         setNotFound(true)
         setLoading(false)
         return
      }

      const res_data = await res.json()

      console.log(res_data)
      console.log([res_data.apartment && 'У себя', res_data.toClient && 'Выезд к клиенту'].filter(Boolean))

      setData({
         ...res_data,
         access: [res_data.apartment && 'У себя', res_data.toClient && 'Выезд к клиенту'].filter(Boolean),
         video: res_data.videos.length && res_data.videos[0],
      })

      setLoading(false)
   }

   // Simulate async data load
   useEffect(() => {
      fetchProfiles()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   // Auto-slide every 6s (on mobile + multiple photos)
   const startAutoSlideTimer = () => {
      // Guard: if data or data.photos is missing => no slider
      if (!data || !data.photos) return
      if (!isMobile || data.photos.length <= 1) return

      clearInterval(autoSlideRef.current)
      autoSlideRef.current = setInterval(() => {
         setSlideIndex((prev) => (prev + 1) % data.photos.length)
      }, 6000)
   }

   // Manual nav
   const prevSlide = () => {
      if (!data || !data.photos) return
      setSlideIndex((prev) => (prev === 0 ? data.photos.length - 1 : prev - 1))
      startAutoSlideTimer()
   }
   const nextSlide = () => {
      if (!data || !data.photos) return
      setSlideIndex((prev) => (prev + 1) % data.photos.length)
      startAutoSlideTimer()
   }

   // Overlays
   const handleLeftClick = () => {
      if (!data || !data.photos) return
      if (data.photos.length > 1) prevSlide()
   }
   const handleRightClick = () => {
      if (!data || !data.photos) return
      if (data.photos.length > 1) nextSlide()
   }

   // Touch
   const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
   }
   const onTouchEnd = (e) => {
      if (!touchStartX.current) return
      const diffX = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(diffX) > 50) {
         if (diffX < 0) nextSlide()
         else prevSlide()
      }
      touchStartX.current = null
   }

   if (loading) return (
      <div className={styles.container} style={{padding: '35vh 0'}}>
         <Loader type={'inpage'}/>
      </div>
   )

   if (notFound) return (
      <div className={styles.container} style={{padding: '35vh 0'}}>
         <h1 style={{textAlign: 'center', color: 'white'}}>Анкета не найдена</h1>
      </div>
   )

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
                  <FontAwesomeIcon style={{color: '#9f539f', opacity: .8}} icon={faVenus}/>
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
                           <img src={url} alt="anketa"/>
                        </div>
                     ))}

                     {data.photos.length > 1 && (
                        <>
                           <button className={styles.arrowLeft} onClick={prevSlide}>
                              <FontAwesomeIcon icon={faChevronLeft}/>
                           </button>
                           <button className={styles.arrowRight} onClick={nextSlide}>
                              <FontAwesomeIcon icon={faChevronRight}/>
                           </button>
                           {/* Invisible Overlays */}
                           <div className={styles.overlayLeft} onClick={handleLeftClick}/>
                           <div className={styles.overlayRight} onClick={handleRightClick}/>
                        </>
                     )}
                  </div>

                  {data.video ?
                     <div className={styles.videoContainer}>
                        <video width="100%" controls>
                           <source src={data.video} type="video/mp4"/>
                           Your browser does not support the video tag.
                        </video>
                     </div> : ''
                  }


               </div>

               <div className={styles.rightSide}>
                  <div className={styles.infoTop}>
                     <div className={styles.infoName}>
                        Имя: <span>{data.name}</span>
                     </div>
                     <div className={styles.infoPhone}>
                        Телефон: <a type="tel" href={data.phone}>{data.phone}</a>
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
                           <div className={styles.value}>{data.breast}</div>
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
                        <div className={styles.value}>{data.districts[0]}</div>
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
                        {(data.favours || []).map((srv) => (
                           <div key={srv} className={styles.serviceItem}>
                              <FontAwesomeIcon icon={faCheck} className={styles.checkIcon}/>
                              {srv}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
   )
}
