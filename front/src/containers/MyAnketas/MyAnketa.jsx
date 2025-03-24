import React, {useContext, useEffect, useRef, useState} from 'react'
import styles from './MyAnketa.module.sass'
import clsx from 'clsx'
import Button from '../../components/Button/Button'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBullhorn, faChevronLeft, faChevronRight, faClock, faEye, faEyeSlash, faPaperPlane, faPen, faTurnUp, faVenus} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom"
import Hr from "../../components/Hr"
import {Status, status_names} from "../../helpers/data"
import Loader from "../../components/Loader/Loader"
import {getDaysLeft} from "../../helpers/helpers"
import UserProvider, {UserContext} from "../../context/Context"


function getTarrifById(id) {
   if (id === 2)
      return 'Вип'

   if (id === 1)
      return 'Голд'

   if (id === 0)
      return 'Стандарт'
}


const MyAnketa = ({data}) => {
   const {supportUrl, trans} = useContext(UserContext)

   console.log(data)

   const navigate = useNavigate()

   const [status, setStatus] = useState(status_names[data.status])
   const [loading, setLoading] = useState(false)

   const [isMobile, setIsMobile] = useState(false)
   const [slideIndex, setSlideIndex] = useState(0)
   const sliderRef = useRef(null)

   // We'll store our interval ID here so we can clear/restart it
   const autoSlideRef = useRef(null)

   // Only show up to 4 photos
   const photos = data.photos.slice(0, 4)

   const fetchChangeStatus = async (new_status) => {
      await fetch("/api/Profile?id=" + data.id, {
         method : "PUT",
         headers: {
            'Content-Type' : 'application/json',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
         },
         body   : JSON.stringify({
            status: Status[new_status],
         })
      })

      setStatus(new_status)
      setLoading(false)
   }

   // const fetchViewClicks = async () => {
   //    await fetch("/api/Profile?id=" + data.id, {
   //       method : "PUT",
   //       headers: {
   //          'Content-Type' : 'application/json',
   //          'Accept'       : 'application/json',
   //          'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
   //       },
   //       body   : JSON.stringify({
   //          status: Status[new_status],
   //       })
   //    })
   // }

   const changeStatus = (new_status) => {
      setLoading(true)
      fetchChangeStatus(new_status)
   }

   // ─────────────────────────────────────────────────────────────
   // 1) Detect screen width < 768 => isMobile
   // ─────────────────────────────────────────────────────────────
   useEffect(() => {
      function handleResize() {
         setIsMobile(window.innerWidth < 768)
      }

      handleResize() // run once at mount
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   // ─────────────────────────────────────────────────────────────
   // 2) Start/Restart auto-slide interval if isMobile + multiple photos
   // ─────────────────────────────────────────────────────────────
   const startAutoSlideTimer = () => {
      if (!isMobile || photos.length <= 1) return
      // Clear any existing timer
      clearInterval(autoSlideRef.current)

      autoSlideRef.current = setInterval(() => {
         setSlideIndex((prev) => (prev + 1) % photos.length)
      }, 6000)
   }

   // On mount or when `isMobile`/photos changes, set up the timer
   useEffect(() => {
      startAutoSlideTimer()

      // Cleanup when unmounting
      return () => clearInterval(autoSlideRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isMobile, photos.length])

   // ─────────────────────────────────────────────────────────────
   // 3) SLIDER
   // ─────────────────────────────────────────────────────────────
   const prevSlide = () => {
      setSlideIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
      startAutoSlideTimer()
   }

   const nextSlide = () => {
      setSlideIndex((prev) => (prev + 1) % photos.length)
      startAutoSlideTimer()
   }

   const handleLeftClick = () => {
      if (photos.length > 1) prevSlide()
   }
   const handleRightClick = () => {
      if (photos.length > 1) nextSlide()
   }

   const touchStartX = useRef(null)

   const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
   }

   const onTouchEnd = (e) => {
      if (touchStartX.current == null) return
      const diffX = e.changedTouches[0].clientX - touchStartX.current

      if (Math.abs(diffX) > 50) {
         if (diffX < 0) {
            // Swiped left => next slide
            nextSlide()
         } else {
            // Swiped right => prev slide
            prevSlide()
         }
      }
      touchStartX.current = null
   }

   // ─────────────────────────────────────────────────────────────
   // 6) Open full anketa
   // ─────────────────────────────────────────────────────────────
   const openAnketa = () => {
      navigate(`/${data.id}`)
   }

   let status_title = <h2>{trans.myAnketa.visible}</h2>
   let show_btn = <Button onClick={() => changeStatus('Hidden')} style={{background: 'gray'}}>
      <FontAwesomeIcon icon={faEyeSlash}/>
      {trans.myAnketa.hide}
   </Button>

   if (status === 'Hidden') {
      status_title = <div className={styles.status_container}>
         <h2>{trans.myAnketa.hiddenTitle}</h2>
         <p>{trans.myAnketa.hiddenNote}</p>
      </div>

      show_btn = <Button onClick={() => changeStatus('Active')}>
         <FontAwesomeIcon icon={faEye}/>
         {trans.myAnketa.show}
      </Button>
   }

   let status_overlay = ''
   if (status === 'Banned') {
      status_overlay = <div className={clsx(styles.status_overlay, styles.ban)}>
         <h2>{trans.myAnketa.banned}</h2>
         <Button onClick={() => window.location.href = supportUrl}>
            <FontAwesomeIcon icon={faPaperPlane}/>
            {trans.myAnketa.contactSupport}
         </Button>
      </div>
   }

   if (status === 'Expired') {
      status_overlay = <div className={clsx(styles.status_overlay, styles.expired)}>
         <h2>{trans.myAnketa.expired}</h2>
         <Button onClick={() => navigate(`/profile/prolong/${data.id}`)}>
            {trans.myAnketa.prolong}
         </Button>
      </div>
   }

   return (
      <div className={styles.container}>
         {loading && <Loader type={'in-overlay'}/>}

         {status_overlay}

         <div className={styles.wrapper}>
            <div className={styles.top}>
               <div className={styles.name}>
                  <FontAwesomeIcon icon={faVenus}/>
                  {data.name}
               </div>
               <div className={styles.city}>{trans.city}</div>
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
                              <img src={url} alt=""/>
                           </div>
                        ))}

                        {photos.length > 1 && (
                           <>
                              {/* Nav Buttons */}
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
                  ) : (
                     // DESKTOP PHOTO GRID
                     <div className={styles.photos}>
                        {photos.map((el) => (
                           <div key={el} className={styles.photo} onClick={openAnketa}>
                              <img src={el} alt=""/>
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
                        <div className={styles.data_title}>{trans.myAnketa.age}:</div>
                        <div className={styles.data_value}>{data.age}</div>
                     </div>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>{trans.myAnketa.weight}:</div>
                        <div className={styles.data_value}>{data.weight}кг</div>
                     </div>
                     <div className={styles.data_row}>
                        <div className={styles.data_title}>{trans.myAnketa.height}:</div>
                        <div className={styles.data_value}>{data.height}см</div>
                     </div>

                     <div
                        style={{borderTop: 'none', borderTopRightRadius: '4px', borderTopLeftRadius: '4px'}}
                        className={clsx(styles.data_row, styles.price)}
                     >
                        <div className={styles.data_title}>{trans.myAnketa.oneHour}:</div>
                        <div className={styles.data_value}>{data.hourPrice}грн</div>
                     </div>

                     <div className={clsx(styles.data_row, styles.price)}>
                        <div className={styles.data_title}>{trans.myAnketa.twoHours}</div>
                        <div className={styles.data_value}>{data.twoHourPrice}грн</div>
                     </div>

                     <div
                        style={{borderBottomRightRadius: '4px', borderBottomLeftRadius: '4px'}}
                        className={clsx(styles.data_row, styles.price)}
                     >
                        <div className={styles.data_title}>{trans.myAnketa.night}:</div>
                        <div className={styles.data_value}>{data.nightPrice}грн</div>
                     </div>
                  </div>

                  {isMobile && <div className={styles.description}>{data.description}</div>}

                  <Button type="submit-noshine" onClick={openAnketa}>
                     {trans.myAnketa.viewProfile}
                  </Button>
               </div>
            </div>

            <div className={styles.bottom}>
               {status_title}

               <Hr/>

               <div className={styles.admin_data}>
                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>{trans.myAnketa.package}</div>
                     <div className={styles.admin_data_val}>{getTarrifById(data.type)}</div>
                  </div>

                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>{trans.myAnketa.daysLeft}</div>
                     <div className={styles.admin_data_val}>{getDaysLeft(data.expirationDate)}</div>
                  </div>

                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>{trans.myAnketa.views}</div>
                     <div className={styles.admin_data_val}>{data.clicks}</div>
                  </div>

                  <div className={styles.admin_data_row}>
                     <div className={styles.admin_data_title}>{trans.myAnketa.phoneClicks}</div>
                     <div className={styles.admin_data_val}>{data.mobileCalls}</div>
                  </div>
               </div>

               <Hr/>

               <div className={styles.admin_btns}>
                  {show_btn}

                  <Button onClick={() => navigate(`/profile/change-tarrif/${data.id}`)}>
                     <FontAwesomeIcon icon={faTurnUp}/>
                     {trans.myAnketa.changeTariff}
                  </Button>
                  <Button onClick={() => navigate(`/profile/prolong/${data.id}`)}>
                     <FontAwesomeIcon icon={faClock} />
                     {trans.myAnketa.prolongProfile}
                  </Button>
                  {/*<Button>*/}
                  {/*   <FontAwesomeIcon icon={faBullhorn}/>*/}
                  {/*   Продвигать*/}
                  {/*</Button>*/}
                  <Button onClick={() => navigate(`/edit-anketa/${data.id}`)}>
                     <FontAwesomeIcon icon={faPen}/>
                     {trans.myAnketa.edit}
                  </Button>

                  <Button style={{background: 'red'}} onClick={() => navigate(`/profile/delete-anketa/${data.id}`)}>
                     <FontAwesomeIcon icon={faPen}/>
                     {trans.myAnketa.delete}
                  </Button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default MyAnketa
