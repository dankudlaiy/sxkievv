import styles from "./EditAnketa.module.sass";
import Input from "../../components/Input/Input";
import React, {useContext, useEffect, useState} from "react"
import Hr from "../../components/Hr";
import { kievNeighborhoodsAndMetros, plans, servicesList } from "../../helpers/data";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import {faArrowLeft, faList} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate, useParams} from "react-router-dom"
import {UserContext} from "../../context/Context"

function getPackageType(packageName, term) {
   let x_package = 1;
   let x_term = 1;

   if (packageName === "Стандарт") x_package = 1;
   if (packageName === "Голд") x_package = 2;
   if (packageName === "Вип") x_package = 3;

   if (term === "1 месяц") x_term = 1;
   if (term === "2 месяца") x_term = 2;
   if (term === "3 месяца") x_term = 3;

   return x_package * x_term;
}

const EditAnketa = () => {
   const { id } = useParams();
   const navigate = useNavigate();

   const [values, setValues] = useState({
      name: "",
      description: "",
      // We'll store photos as EITHER { url: "...", fromServer: true } or a File
      photos: [],
      // We'll store video as EITHER { url: "...", fromServer: true } or a File or ""
      video: "",
      age: "",
      weight: "",
      height: "",
      boobs: "",
      area: "",
      access: "",
      services: [],
      hour: "",
      twoHour: "",
      night: "",
      phone: "",
      status: "",
   });

   const [errors, setErrors] = useState({
      name: "",
      description: "",
      photos: "",
      video: "",
      age: "",
      weight: "",
      height: "",
      boobs: "",
      area: "",
      access: "",
      services: "",
      hour: "",
      twoHour: "",
      night: "",
      phone: "",
      status: "",
   });

   const [loading, setLoading] = useState(true);
   const [success, setSuccess] = useState(false);

   const [notFound, setNotFound] = useState(false);
   const [fetchError, setFetchError] = useState(null);

   // -------------
   // 1) FETCH ANKETA BY ID
   // -------------
   const fetchAnketa = async () => {
      try {
         const res = await fetch(`/api/Profile/${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
         });

         if (res.status === 404) {
            setNotFound(true);
            setLoading(false);
            return;
         }
         if (!res.ok) {
            throw new Error(`Error fetching profile: ${res.statusText}`);
         }

         const data = await res.json();

         // Convert server "photos" to array of objects with fromServer flag.
         // e.g. data.photos = ["/uploads/photo1.jpg", "/uploads/photo2.jpg", ...]
         const photoObjects = (data.photos || []).map((photoUrl) => ({
            url: photoUrl,
            fromServer: true,
         }));

         // If there's at least one video, store it as {url: "...", fromServer:true}.
         // If none, store "" so Input can handle a "no-video" scenario.
         const videoObj =
                  data.videos && data.videos[0]
                     ? { url: data.videos[0], fromServer: true }
                     : "";

         setValues({
            name: data.name || "",
            description: data.description || "",
            // photos are an array of either { url, fromServer } or Files
            photos: photoObjects,
            // video is either { url, fromServer } or "" or a File
            video: videoObj,
            age: data.age?.toString() || "",
            weight: data.weight?.toString() || "",
            height: data.height?.toString() || "",
            boobs: data.breast?.toString() || "",
            area: data.districts?.[0] || "",
            access: [
               data.apartment && "В апартаментах",
               data.toClient && "Выезд к клиенту",
            ].filter(Boolean),
            services: data.favours || [],
            hour: data.hourPrice?.toString() || "",
            twoHour: data.twoHourPrice?.toString() || "",
            night: data.nightPrice?.toString() || "",
            phone: data.phone || "",
            status: data.status || "",
         });
      } catch (err) {
         setFetchError(err.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAnketa();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   // -------------
   // 2) VALIDATE FORM
   // -------------
   function validateForm(currentValues) {
      const newErrors = {
         name: "",
         description: "",
         photos: "",
         video: "",
         age: "",
         weight: "",
         height: "",
         boobs: "",
         area: "",
         access: "",
         services: "",
         hour: "",
         twoHour: "",
         night: "",
         phone: "",
         status: "",
      };

      if (!currentValues.name.trim()) {
         newErrors.name = "Имя обязательно";
      }
      if (!currentValues.description.trim()) {
         newErrors.description = "Описание обязательно";
      }

      // Must have at least 1 photo (server or new file).
      if (!currentValues.photos || currentValues.photos.length === 0) {
         newErrors.photos = "Добавьте хотя бы одно фото";
      }

      if (!currentValues.age || isNaN(currentValues.age) || +currentValues.age < 18) {
         newErrors.age = "Укажите корректный возраст (от 18 лет)";
      }

      if (!currentValues.phone.trim()) {
         newErrors.phone = "Укажите номер телефона";
      } else if (!/^\+?\d{10,15}$/.test(currentValues.phone.trim())) {
         newErrors.phone = "Введите корректный номер (10–15 цифр, можно с + в начале)";
      }

      if (!currentValues.access || currentValues.access.length === 0) {
         newErrors.access = "Выберите минимум один вариант";
      }

      const isValid = Object.values(newErrors).every((msg) => msg === "");
      return { isValid, newErrors };
   }

   // -------------
   // 3) UPLOAD MEDIA
   // -------------
   async function uploadMedia(allMedia) {
      const formData = new FormData();

      for (const item of allMedia) {
         if (item instanceof File) {
            formData.append("files", item);
         } else if (typeof item === "string") {
            // fetch the file from URL
            const response = await fetch(item);
            const blob = await response.blob();
            const filename = item.split('/').pop().split('?')[0] || 'file.jpg';
            const file = new File([blob], filename, { type: blob.type });
            console.log(file)
            formData.append("files", file);
         }else if (item.url && typeof item.url === "string") {
            // fetch the file from URL
            const response = await fetch(item.url);
            const blob = await response.blob();
            const filename = item.url.split('/').pop().split('?')[0] || 'file.jpg';
            const file = new File([blob], filename, { type: blob.type });
            console.log(file)
            formData.append("files", file);
         }
         else if (item?.file instanceof File) {
            formData.append("files", item.file);
         }
      }

      const res = await fetch("/api/Media/upload", {
         method: "POST",
         body: formData,
         headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
         },
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      return data.map((item) => item.id); // return only IDs
   }


   // -------------
   // 4) SUBMIT
   // -------------
   const submitHandler = async (e) =>  {
      e.preventDefault();

      const { isValid, newErrors } = validateForm(values);
      setErrors(newErrors);

      if (!isValid) {
         // Scroll to first error
         const firstInvalidKey = Object.keys(newErrors).find((key) => newErrors[key] !== "");
         if (firstInvalidKey) {
            const invalidInput = document.querySelector(`[name="${firstInvalidKey}"]`);
            if (invalidInput) {
               invalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
            }
         }

         return;
      }

      setLoading(true);

      // Gather all media (photos + video), but skip items from server
      // Because we only want to upload brand new Files
      const allMedia = [...values.photos];
      if (values.video) {
         allMedia.push(values.video);
      }

      let mediaIds = [];
      try {
         mediaIds = await uploadMedia(allMedia);
      } catch (err) {
         setLoading(false);
         return;
      }

      // 2) Create or Update Profile
      // If editing an existing profile, you might do PUT /api/Profile/:id
      // but let's assume your code uses POST for now
      const res = await fetch("/api/Profile?id=" + id, {
         method: "PUT",
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
            apartment:
               values.access.includes("В апартаментах"),
            toClient:
               values.access.includes("Выезд к клиенту"),
            planId: getPackageType(values.package, values.term),
            media: mediaIds,
            // If "area" is an array, pass as is; if it's a string, wrap in []
            districts: Array.isArray(values.area) ? values.area : [values.area],
            favours: values.services,
         }),
      });

      if (res.status === 200) {
         setLoading(false);
         setSuccess(true);
      } else {
         // handle any error, e.g. setFetchError
         setLoading(false);
      }
   };

   // -------------
   // 5) RENDER
   // -------------
   if (loading) {
      return (
         <div className={styles.container} style={{ padding: "30vh 0" }}>
            <Loader type={"inpage"} />
         </div>
      );
   }

   if (notFound) {
      return (
         <div className={styles.container} style={{ padding: "30vh 0" }}>
            <h2>Анкета не найдена</h2>
         </div>
      );
   }

   if (fetchError) {
      return (
         <div className={styles.container} style={{ padding: "30vh 0" }}>
            <h2>Ошибка: {fetchError}</h2>
         </div>
      );
   }

   if (success) {
      return (
         <div className={styles.container} style={{ padding: "30vh 0" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
               Анкета успешно добавлена <br />
               После одобрения администратором вы сможете увидеть ее в разделе мои анкеты
            </h2>

            <NavLink to="/profile/my-anketas">
               <Button>
                  <FontAwesomeIcon icon={faList} />
                  Мои анкеты
               </Button>
            </NavLink>
         </div>
      );
   }

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <Button style={{marginLeft: '60px', scale: '1.2', marginBottom: '15px', textAlign: 'center', alignSelf: 'flex-start'}} onClick={() => navigate(-1)} >
               <FontAwesomeIcon icon={faArrowLeft}/>
               Назад
            </Button>

            <h1>Введите данные анкеты</h1>

            <form id="submit-form" onSubmit={submitHandler} className={styles.form}>
               <Input
                  placeholder="Имя"
                  title="Имя"
                  required={true}
                  value={values.name}
                  changeState={(val) => setValues({ ...values, name: val })}
                  error={errors.name}
                  name="name"
               />

               <Input
                  rows={8}
                  placeholder="Описание"
                  title="Описание"
                  required={true}
                  value={values.description}
                  changeState={(val) => setValues({ ...values, description: val })}
                  error={errors.description}
                  name="description"
               />

               {/*
            -----------
            PHOTOS
            -----------
            Here we pass an array of either { url, fromServer } or File.
            Your <Input type="photos" /> should handle both:
              - If it sees { url, fromServer }, show that existing image
                (probably by <img src={item.url} ... />).
              - If it sees a File, show a local preview with createObjectURL.
          */}
               <Input
                  type="photos"
                  placeholder="Фото модели"
                  title="Фото модели"
                  required={true}
                  value={values.photos}
                  changeState={(val) => setValues({ ...values, photos: val })}
                  error={errors.photos}
                  name="photos"
               />

               {/*
            -----------
            VIDEO
            -----------
            Single video: either "" (no video), or { url: "...", fromServer: true }, or a File.
            <Input type="video" /> should handle if `value` is a File or a server URL object.
          */}
               <Input
                  type="video"
                  title="Видео"
                  placeholder="Нажмите, чтобы выбрать видео"
                  value={values.video}
                  changeState={(val) => setValues({ ...values, video: val })}
                  error={errors.video}
                  name="video"
               />

               <Hr />

               <div className={styles.input_row}>
                  <Input
                     type="number"
                     placeholder="Возраст"
                     title="Возраст"
                     required={true}
                     value={values.age}
                     changeState={(val) => setValues({ ...values, age: val })}
                     error={errors.age}
                     name="age"
                  />
                  <Input
                     type="number"
                     placeholder="Вес"
                     title="Вес"
                     required={true}
                     value={values.weight}
                     changeState={(val) => setValues({ ...values, weight: val })}
                     error={errors.weight}
                     name="weight"
                  />
               </div>

               <div className={styles.input_row}>
                  <Input
                     type="number"
                     placeholder="Рост"
                     title="Рост"
                     required={true}
                     value={values.height}
                     changeState={(val) => setValues({ ...values, height: val })}
                     error={errors.height}
                     name="height"
                  />

                  <Input
                     placeholder="Размер груди"
                     title="Размер груди"
                     required={true}
                     value={values.boobs}
                     changeState={(val) => setValues({ ...values, boobs: val })}
                     options={[1, 2, 3, 4, 5, 6, 7]}
                     error={errors.boobs}
                     name="boobs"
                  />
               </div>

               <Hr />

               <Input
                  options={kievNeighborhoodsAndMetros}
                  placeholder="Район и метро"
                  title="Район и метро"
                  required={true}
                  value={values.area}
                  changeState={(val) => setValues({ ...values, area: val })}
                  error={errors.area}
                  name="area"
               />

               <Input
                  required={true}
                  radios={["В апартаментах", "Выезд к клиенту"]}
                  changeState={(val) => setValues({ ...values, access: val })}
                  placeholder="Принимает"
                  title="Принимает"
                  value={values.access}
                  error={errors.access}
                  name="access"
               />

               <Input
                  radios={servicesList}
                  value={values.services}
                  changeState={(val) => setValues({ ...values, services: val })}
                  title="Услуги"
                  error={errors.services}
                  name="services"
               />

               <Hr />

               <Input
                  type="number"
                  placeholder="Цена за час"
                  title="Цена за час"
                  required={true}
                  value={values.hour}
                  changeState={(val) => setValues({ ...values, hour: val })}
                  error={errors.hour}
                  name="hour"
               />
               <Input
                  type="number"
                  placeholder="Цена за 2 часа"
                  title="Цена за 2 часа"
                  required={true}
                  value={values.twoHour}
                  changeState={(val) => setValues({ ...values, twoHour: val })}
                  error={errors.twoHour}
                  name="twoHour"
               />
               <Input
                  type="number"
                  placeholder="Цена за ночь"
                  title="Цена за ночь"
                  required={true}
                  value={values.night}
                  changeState={(val) => setValues({ ...values, night: val })}
                  error={errors.night}
                  name="night"
               />

               <Hr />

               <Input
                  type="tel"
                  placeholder="Номер телефона"
                  title="Номер телефона"
                  required={true}
                  value={values.phone}
                  changeState={(val) => setValues({ ...values, phone: val })}
                  error={errors.phone}
                  name="phone"
               />

               <Input
                  options={["Активна", "Скрыта"]}
                  placeholder="Доступность анкеты"
                  title="Доступность анкеты"
                  required={true}
                  value={values.status}
                  changeState={(val) => setValues({ ...values, status: val })}
                  error={errors.status}
                  name="status"
               />

               <div className={styles.add_container}>
                  <Button submit={true} type="submit-noshine">
                     Изменить анкету
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default EditAnketa;
