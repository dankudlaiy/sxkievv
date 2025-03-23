import styles from './AddAnketa.module.sass'
import Input from "../../components/Input/Input"
import React, {useEffect, useState} from "react"
import Hr from "../../components/Hr"
import {kievNeighborhoodsAndMetros, plans, servicesList} from "../../helpers/data"
import Button from "../../components/Button/Button"
import Loader from "../../components/Loader/Loader"
import AnketaPackageSelector from "./PackageSelector"
import {faList} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {NavLink} from "react-router-dom"



function mapPackage(pkg) {
   if (pkg === "Стандарт") return "basic"
   if (pkg === "Голд") return "premium"
   if (pkg === "Вип") return "vip"
   return null
}

function mapTerm(term) {
   if (term === "1 месяц") return "1_month"
   if (term === "2 месяца") return "2_month"
   if (term === "3 месяца") return "3_month"
   return null
}

function getPackageType(packageName, term) {
   let x_package = 1
   let x_term = 1
   
   if (packageName === 'Стандарт')
      x_package = 1
   if (packageName === 'Голд')
      x_package = 2
   if (packageName === 'Вип')
      x_package = 3

   if (term === "1 месяц")
      x_term = 1
   if (term === "2 месяца")
      x_term = 2
   if (term === "3 месяца")
      x_term = 3
   
   return x_package * x_term;
}


const AddAnketa = () => {
   const [values, setValues] = useState({
      name       : '',
      description: '',
      photos     : [],
      video      : '',
      age        : '',
      weight     : '',
      height     : '',
      boobs      : '',
      area       : '',
      access     : '',
      services   : [],
      hour       : '',
      twoHour    : '',
      night      : '',
      phone      : '',
      status     : '',
      package    : '',
      term    : '',
   })
   const [errors, setErrors] = useState({
      name       : '',
      description: '',
      photos     : '',
      video      : '',
      age        : '',
      weight     : '',
      height     : '',
      boobs      : '',
      area       : '',
      access     : '',
      services   : '',
      hour       : '',
      twoHour    : '',
      night      : '',
      phone      : '',
      status     : '',
      package    : '',
      term    : ''
   })

   const [loading, setLoading] = useState(false)
   const [payValue, setPayValue] = useState(0)
   const [success, setSuccess] = useState(false)

   useEffect(() => {
      const script = document.createElement('script')
      script.src = '/registerForm.js'
      script.async = true
      document.body.appendChild(script)

      return () => {
         document.body.removeChild(script)
      }
   }, [])

   useEffect(() => {
      const pkgKey = mapPackage(values.package)
      const termKey = mapTerm(values.term)

      if (pkgKey && termKey) {
         setPayValue(plans[pkgKey].prices[termKey])
      } else {
         setPayValue(0)
      }
   }, [values.package, values.term])

   function validateForm(values) {
      // 1) Create a fresh errors object
      const newErrors = {
         name       : "",
         description: "",
         photos     : "",
         video      : "",
         age        : "",
         weight     : "",
         height     : "",
         boobs      : "",
         area       : "",
         access     : "",
         services   : "",
         hour       : "",
         twoHour    : "",
         night      : "",
         phone      : "",
         status     : "",
         package    : "",
         term       : ""
      }

      // 2) Validate each field. Adjust rules as you like:
      if (!values.name.trim()) {
         newErrors.name = "Имя обязательно"
      }
      if (!values.description.trim()) {
         newErrors.description = "Описание обязательно"
      }
      if (!values.photos || values.photos.length === 0) {
         newErrors.photos = "Добавьте хотя бы одно фото"
      }
      if (!values.age || isNaN(values.age) || +values.age < 18) {
         newErrors.age = "Укажите корректный возраст (от 18 лет)"
      }
      if (!values.phone.trim()) {
         newErrors.phone = "Укажите номер телефона"
      } else if (!/^\+?\d{10,15}$/.test(values.phone.trim())) {
         newErrors.phone = "Введите корректный номер (10–15 цифр, можно с + в начале)"
      }

      if (!values.access || values.access.length === 0) {
         newErrors.access = "Выберете минимум один вариант"
      }

      // **Check if package selected**
      if (!values.package) {
         newErrors.package = "Выберите пакет"
      }

      // **Check if term selected**
      if (!values.term) {
         newErrors.term = "Выберите срок"
      }

      // 3) Determine if the form is valid by checking if any error is non-empty
      const isValid = Object.values(newErrors).every((msg) => msg === "")

      // Return results
      return { isValid, newErrors }
   }

   async function uploadMedia(files) {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const res = await fetch('/api/Media/upload', {
         method: 'POST',
         body: formData,
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
         },
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json() // Assuming server returns JSON

      return data.map(item => item.id) // return array of ids
   }


   const submitHandler = async (e) => {
      e.preventDefault()

      const { isValid, newErrors } = validateForm(values)
      setErrors(newErrors)

      if (!isValid) {
         const firstInvalidKey = Object.keys(newErrors).find(
            (key) => newErrors[key] !== ""
         )

         if (firstInvalidKey) {
            const invalidInput = document.querySelector(
               `[name="${firstInvalidKey}"]`
            )
            // 3) Scroll into view
            if (invalidInput) {
               invalidInput.scrollIntoView({ behavior: "smooth", block: "center" })
            }
         }
      } else {
         setLoading(true)

         // 1) Upload photos
         const allFiles = [...values.photos]
         if (values.video) {
            allFiles.push(values.video)
         }

         let mediaIds = []
         try {
            mediaIds = await uploadMedia(allFiles)
         } catch (e) {
            console.error("Media upload failed", e)
            return
         }

         // 2) Create post
         // console.log('aparts', values.access[0] === 'В апартаментах' || values.access[1] === 'В апартаментах')
         // console.log('client', values.access[0] === 'Выезд к клиенту' || values.access[1] === 'Выезд к клиенту')
         const res = await fetch('/api/Profile', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
               name: values.name,
               description: values.description,
               age: +values.age,
               height: +values.height,
               breast: +values.boobs,
               weight: +values.weight,
               phone: values.phone,
               hourPrice: +values.hour,
               twoHourPrice: +values.twoHour,
               nightPrice: +values.night,
               apartment: values.access[0] === 'В апартаментах' || values.access[1] === 'В апартаментах',
               toClient: values.access[0] === 'Выезд к клиенту' || values.access[1] === 'Выезд к клиенту',
               planId: getPackageType(values.package, values.term), // see note below
               media: mediaIds,
               districts: Array.isArray(values.area) ? values.area : [values.area],
               favours: values.services,
            }),
         })

         if (res.status === 200) {
            setLoading(false)
            setSuccess(true)
         }
      }
   }

   if (success) return (
      <div className={styles.container} style={{padding: '30vh 0'}}>
         <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Анкета успешно добавлена <br/>После одобрения администратором вы сможете увидеть ее в разделе мои анкеты</h2>

         <NavLink to="/profile/my-anketas">
            <Button >
               <FontAwesomeIcon icon={faList}/>
               Мои анкеты
            </Button>
         </NavLink>
      </div>
   )

   return (
      <div className={styles.container}>
         {loading && <Loader/>}

         <div className={styles.wrapper}>
            <h1>Введите данные анкеты</h1>

            <form id="submit-form" onSubmit={submitHandler} className={styles.form}>

               <Input
                  placeholder="Имя"
                  title="Имя"
                  required={true}
                  value={values.name}
                  changeState={(val) => setValues({...values, name: val})}
                  error={errors.name}
                  name='name'
               />

               <Input
                  rows={8}
                  placeholder="Описание"
                  title="Описание"
                  required={true}
                  value={values.description}
                  changeState={(val) => setValues({...values, description: val})}
                  error={errors.description}
                  name='description'
               />

               <Input
                  type="photos"
                  placeholder="Фото модели"
                  title="Фото модели"
                  required={true}
                  value={values.photos}
                  changeState={(val) => setValues({...values, photos: val})}
                  error={errors.photos}
                  name='photos'
               />

               <Input
                  type="video"
                  title="Видео"
                  placeholder="Нажмите, чтобы выбрать видео"
                  value={values.video}
                  changeState={(val) => setValues({...values, video: val})}
                  error={errors.video}
                  name='video'
               />

               <Hr/>

               <div className={styles.input_row}>
                  <Input
                     type="number"
                     placeholder="Возраст"
                     title="Возраст"
                     required={true}
                     value={values.age}
                     changeState={(val) => setValues({...values, age: val})}
                     error={errors.age}
                     name='age'
                  />
                  <Input
                     type="number"
                     placeholder="Вес"
                     title="Вес"
                     required={true}
                     value={values.weight}
                     changeState={(val) => setValues({...values, weight: val})}
                     error={errors.weight}
                     name='weight'
                  />
               </div>

               <div className={styles.input_row}>
                  <Input
                     type="number"
                     placeholder="Рост"
                     title="Рост"
                     required={true}
                     value={values.height}
                     changeState={(val) => setValues({...values, height: val})}
                     error={errors.height}
                     name='height'
                  />

                  <Input
                     placeholder="Размер груди"
                     title="Размер груди"
                     required={true}
                     value={values.boobs}
                     changeState={(val) => setValues({...values, boobs: val})}
                     options={[1, 2, 3, 4, 5, 6, 7]}
                     error={errors.boobs}
                     name='boobs'
                  />
               </div>

               <Hr/>


               <Input
                  options={kievNeighborhoodsAndMetros}
                  placeholder="Район и метро"
                  title="Район и метро"
                  required={true}
                  value={values.area}
                  changeState={(val) => setValues({...values, area: val})}
                  error={errors.area}
                  name='area'
               />

               <Input
                  required={true}
                  radios={['В апартаментах', 'Выезд к клиенту']}
                  changeState={(val) => setValues({...values, access: val})}
                  placeholder="Принимает"
                  title="Принимает"
                  value={values.access}
                  error={errors.access}
                  name='access'
               />


               <Input
                  radios={servicesList}
                  value={values.services}
                  changeState={(val) => setValues({...values, services: val})}
                  title="Услуги"
                  error={errors.services}
                  name='services'
               />

               <Hr/>

               <Input
                  type="number"
                  placeholder="Цена за час"
                  title="Цена за час"
                  required={true}
                  value={values.hour}
                  changeState={(val) => setValues({...values, hour: val})}
                  error={errors.hour}
                  name='hour'
               />
               <Input
                  type="number"
                  placeholder="Цена за 2 часа"
                  title="Цена за 2 часа"
                  required={true}
                  value={values.twoHour}
                  changeState={(val) => setValues({...values, twoHour: val})}
                  error={errors.twoHour}
                  name='twoHour'
               />
               <Input
                  type="number"
                  placeholder="Цена за ночь"
                  title="Цена за ночь"
                  required={true}
                  value={values.night}
                  changeState={(val) => setValues({...values, night: val})}
                  error={errors.night}
                  name='night'
               />

               <Hr/>

               <Input
                  type="tel"
                  placeholder="Номер телефона"
                  title="Номер телефона"
                  required={true}
                  value={values.phone}
                  changeState={(val) => setValues({...values, phone: val})}
                  error={errors.phone}
                  name='phone'
               />

               <Input
                  options={['Активна', 'Скрыта']}
                  placeholder="Доступность анкеты"
                  title="Доступность анкеты"
                  required={true}
                  value={values.status}
                  changeState={(val)=> setValues({...values, status: val})}
                  error={errors.status}
                  name='status'
               />

               <AnketaPackageSelector
                  title="Выберите пакет"
                  packages={['Стандарт', "Голд", "Вип"]}
                  value={values.package}  // we store the *object* in state
                  changeState={(pkg) => setValues({ ...values, package: pkg })}
                  error={errors.package}
                  name='package'
               />

               <AnketaPackageSelector
                  title="Выберите срок"
                  packages={['1 месяц', "2 месяца", "3 месяца"]}
                  value={values.term}  // we store the *object* in state
                  changeState={(pkg) => setValues({ ...values, term: pkg })}
                  error={errors.term}
                  name='term'
               />

              <div className={styles.add_container}>
                 <h2>К оплате: {payValue}$</h2>

                 <Button submit={true} type="submit-noshine">
                    Добавить анкету
                 </Button>
              </div>
            </form>

         </div>
      </div>
   )
}

export default AddAnketa