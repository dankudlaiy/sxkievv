import styles from './AddAnketa.module.sass'
import Input from "../../components/Input/Input"
import {useState} from "react"
import Select from "../../components/Select/Select"
import Hr from "../../components/Hr"

const AddAnketa = () => {

   const [photos, setPhotos] = useState([])
   const [video, setVideo] = useState('')

   const [name, setName] = useState('')
   const [description, setDescription] = useState('')
   const [age, setAge] = useState('')
   const [weight, setWeight] = useState('')
   const [height, setHeight] = useState('')
   const [boobs, setBoobs] = useState('')
   const [area, setArea] = useState('')
   const [access, setAccess] = useState('')
   const [services, setServices] = useState('')
   const [hour, setHour] = useState('')
   const [twoHour, setTwoHour] = useState('')
   const [night, setNight] = useState('')
   const [phone, setPhone] = useState('')
   const [status, setStatus] = useState('')

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <h1>Введите данные анкеты</h1>

            <form className={styles.form}>
               <Input placeholder="Имя" title="Имя" required={true} value={name} changeState={setName}/>
               <Input rows={8} placeholder="Описание" title="Описание" required={true} value={description} changeState={setDescription}/>

               <Input
                  type="photos"
                  placeholder="Фото модели"
                  title="Фото модели"
                  required={true}
                  value={photos}
                  changeState={setPhotos}
               />

               <Input
                  type="video"
                  title="Видео"
                  placeholder="Нажмите, чтобы выбрать видео"
                  value={video}
                  changeState={setVideo}
               />

               <Hr/>

               <div className={styles.input_row}>
                  <Input type={'number'} placeholder="Возраст" title="Возраст" required={true} value={age} changeState={setAge}/>
                  <Input type={'number'} placeholder="Вес" title="Вес" required={true} value={weight} changeState={setWeight}/>
               </div>

               <div className={styles.input_row}>
                  <Input type={'number'} placeholder="Рост" title="Рост" required={true} value={height} changeState={setHeight}/>

                  <Input
                     placeholder="Размер груди"
                     title="Размер груди"
                     required={true}
                     value={boobs}
                     changeState={setBoobs}
                     options={[1, 2, 3, 4, 5, 6, 7]}
                  />

               </div>

               <Hr/>



               <Input placeholder="Район и метро" title="Район и метро" required={true} value={area} changeState={setArea}/>
               <Input placeholder="Принимает" title="Принимает" required={true} value={access} changeState={setAccess}/>
               <Input placeholder="Услуги " title="Услуги " required={true} value={services} changeState={setServices}/>
               <Input placeholder="Цена за час" title="Цена за час" required={true} value={hour} changeState={setHour}/>
               <Input placeholder="Цена за 2 часа" title="Цена за 2 часа " required={true} value={twoHour} changeState={setTwoHour}/>
               <Input placeholder="Услуги " title="Услуги " required={true} value={services} changeState={setServices}/>
               <Input placeholder="Цена за ночь" title="Цена за ночь " required={true} value={night} changeState={setNight}/>
               <Input placeholder="Номер телефона" title="Номер телефона" required={true} value={phone} changeState={setPhone}/>
               <Input placeholder="Доступность анкеты" title="Доступность анкеты" required={true} value={status} changeState={setStatus}/>
            </form>

         </div>
      </div>
   )
}

export default AddAnketa