import React from 'react';
import styles from './Filter.module.sass';
import Select from "./Select"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass, faUser} from "@fortawesome/free-solid-svg-icons"
import Button from "./Button"


const price_options = [
   "Меньше чем 500грн",
   "0грн-500грн",
   "500грн-1000грн",
   "1000грн-1500грн",
   "1500грн-2000грн",
   "2000грн-2500грн",
   "2500грн-3000грн",
   "3000грн-3500грн",
   "3500грн-4000грн",
   "4000грн-4500грн",
   "4500грн-5000грн",
   "5000грн-5500грн",
   "5500грн-6000грн",
   "Больше чем 6000грн"
];

const age_options = [
   "18-21",
   "21-24",
   "24-27",
   "27-30",
   "30-33",
   "33-36",
   "36-39",
   "39-42",
   "42-45",
   "45-48",
   "48-51",
   "51-54",
   "54-57",
   "57-60",
   "Больше чем 60"
];

const weight_options = [
   "Меньше чем 30",
   "30-40",
   "40-50",
   "50-60",
   "60-70",
   "70-80",
   "80-90",
   "90-100",
   "Больше чем 100"
];

const height_options = [
   "Меньше чем 145",
   "145-150",
   "150-155",
   "155-160",
   "160-165",
   "165-170",
   "170-175",
   "175-180",
   "180-185",
   "185-190",
   "190-195",
   "195-200",
   "200-205",
   "Больше чем 205"
];

const bust_size_options = [
   "1",
   "2",
   "3",
   "4",
   "5",
   "6",
   "7"
];

const accepts_options = [
   "В апартаментах",
   "Выезд к клиенту"
];

const district_metro_options = [
   "Правый берег",
   "Левый берег",
   "Академгородок",
   "Арсенальная",
   "Берестейская",
   "Бориспольская",
   "Васильковская",
   "Вокзальная",
   "Выдубичи",
   "Выставочный центр",
   "Героев Днепра",
   "Гидропарк",
   "Голосеевская",
   "Дарница",
   "Демеевская",
   "Днепр",
   "Дорогожичи",
   "Житомирская",
   "Золотые ворота",
   "Ипподром",
   "Кловская",
   "Контрактовая площадь",
   "Красный хутор",
   "Крещатик",
   "Левобережная",
   "Лесная",
   "Лукьяновская",
   "Лыбедская",
   "Майдан Незалежности",
   "Минская",
   "Нивки",
   "Оболонь",
   "Олимпийская",
   "Осокорки",
   "Палац «Украина»",
   "Палац спорта",
   "Почайна",
   "Площадь Льва Толстого",
   "Позняки",
   "Политехнический институт",
   "Святошин",
   "Славутич",
   "Сырец",
   "Тараса Шевченко",
   "Театральная",
   "Теремки",
   "Университет",
   "Харьковская",
   "Черниговская",
   "Шулявская",
   "Голосеевский",
   "Дарницкий",
   "Деснянский",
   "Днепровский",
   "Оболонский",
   "Печерский",
   "Подольский",
   "Святошинский",
   "Соломенский",
   "Шевченковский"
];

const services_options = [
   "Секс классический",
   "Секс анальный",
   "Секс групповой",
   "Секс лесбийский",
   "Минет в презервативе",
   "Минет без презерватива",
   "Минет глубокий",
   "Куннилингус",
   "Секс игрушки",
   "Ролевые игры",
   "Услуги семейной паре",
   "Окончание на грудь",
   "Окончание на лицо",
   "Окончание в рот",
   "Фото/видео съемка",
   "Минет в машине",
   "Эскорт",
   "Страпон",
   "Анилингус делаю",
   "Золотой дождь выдача",
   "Золотой дождь прием",
   "Копро выдача",
   "Фистинг анальный",
   "Фистинг классический",
   "Стриптиз профи",
   "Стриптиз не профи",
   "Лесби откровенное",
   "Лесби-шоу легкое",
   "Массаж расслабляющий",
   "Массаж классический",
   "Массаж профи",
   "Массаж тайский",
   "Массаж урологический",
   "Массаж точечный",
   "Массаж эротический",
   "Массаж ветка сакуры",
   "Бондаж",
   "Госпожа",
   "Рабыня",
   "БДСМ игры",
   "Легкая доминация",
   "Порка",
   "Фетиш",
   "Трамплинг"
];



const Filter = () => {
   return (
      <div className={styles.container}>
         <Select title="Цена за час" options={price_options}/>
         <Select title="Возраст" options={age_options}/>
         <Select title="Вес" options={weight_options}/>
         <Select title="Рост" options={height_options}/>
         <Select title="Размер груди" options={bust_size_options}/>
         <Select title="Принимает" options={accepts_options}/>
         <Select title="Райно и Метро" options={district_metro_options}/>
         <Select title="Услуги" options={services_options}/>

         <Button style={{fontWeight: '600'}}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Поиск
         </Button>
      </div>
   );
};

export default Filter;