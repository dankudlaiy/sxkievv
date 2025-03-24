import React, {useContext, useEffect, useState} from "react"
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Filter.module.sass";

import Select from "../Select/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";

import {
   // import your options
   price_options,
   age_options,
   weight_options,
   height_options,
   bust_size_options,
   accepts_options,
   district_metro_options,
   services_options,
} from "../../helpers/data";

import {
   // The parsing/building helpers
   parseSelection,
   buildPriceStringFromParams,
   buildAgeStringFromParams,
   // ...similar "build" functions for weight/height if you wish
} from "../../helpers/helpers.js";
import {filter_text} from "../../helpers/text"
import {UserContext} from "../../context/Context" // <-- place them wherever you like


const Filter = () => {
   const {trans} = useContext(UserContext)

   const navigate = useNavigate();
   const location = useLocation();

   const [filters, setFilters] = useState({
      price: "",
      age: "",
      weight: "",
      height: "",
      bustSize: "",
      accepts: "",
      districtMetro: "",
      services: "",
   });

   // On mount or URL change, build the filter strings from the URL
   useEffect(() => {
      const queryParams = new URLSearchParams(location.search);

      // Price
      const priceLt = queryParams.get("priceLt");
      const priceGt = queryParams.get("priceGt");
      const minPrice = queryParams.get("minPrice");
      const maxPrice = queryParams.get("maxPrice");
      const priceString = buildPriceStringFromParams({ priceLt, priceGt, minPrice, maxPrice });

      // Age
      const minAge = queryParams.get("minAge");
      const maxAge = queryParams.get("maxAge");
      const ageString = buildAgeStringFromParams({ minAge, maxAge });

      // Weight
      const minWeight = queryParams.get("minWeight");
      const maxWeight = queryParams.get("maxWeight");
      let weightString = "";
      if (queryParams.get("weightLt")) {
         weightString = `Меньше чем ${queryParams.get("weightLt")}`;
      } else if (queryParams.get("weightGt")) {
         weightString = `Больше чем ${queryParams.get("weightGt")}`;
      } else if (minWeight && maxWeight) {
         weightString = `${minWeight}-${maxWeight}`;
      }

      // Height
      const minHeight = queryParams.get("minHeight");
      const maxHeight = queryParams.get("maxHeight");
      let heightString = "";
      if (queryParams.get("heightLt")) {
         heightString = `Меньше чем ${queryParams.get("heightLt")}`;
      } else if (queryParams.get("heightGt")) {
         heightString = `Больше чем ${queryParams.get("heightGt")}`;
      } else if (minHeight && maxHeight) {
         heightString = `${minHeight}-${maxHeight}`;
      }

      // bustSize, accepts, district, services
      const bustSize = queryParams.get("breastSize") || "";
      const accepts = queryParams.get("apartment")
         ? "В апартаментах"
         : queryParams.get("toClient")
            ? "Выезд к клиенту"
            : "";
      const districtMetro = queryParams.get("district") || "";
      const services = queryParams.get("favour") || "";

      setFilters({
         price: priceString,
         age: ageString,
         weight: weightString,
         height: heightString,
         bustSize,
         accepts,
         districtMetro,
         services,
      });
   }, [location.search]);

   const handleSearch = () => {
      const { price, age, weight, height, bustSize, accepts, districtMetro, services } = filters;

      const queryParamsObject = {};

      /**
       * PRICE
       */
      if (price) {
         const parsed = parseSelection(price);
         if (parsed) {
            if (parsed.type === "lt") {
               queryParamsObject.priceLt = parsed.number; // e.g. 500
            } else if (parsed.type === "gt") {
               queryParamsObject.priceGt = parsed.number;
            } else if (parsed.type === "range") {
               queryParamsObject.minPrice = parsed.min;
               queryParamsObject.maxPrice = parsed.max;
            }
         }
      }

      /**
       * AGE
       */
      if (age) {
         const parsed = parseSelection(age);
         if (parsed && parsed.type === "range") {
            queryParamsObject.minAge = parsed.min;
            queryParamsObject.maxAge = parsed.max;
         } else if (parsed?.type === "lt") {
            // if you want "lt" for age too:
            queryParamsObject.ageLt = parsed.number;
         } else if (parsed?.type === "gt") {
            queryParamsObject.ageGt = parsed.number;
         }
      }

      /**
       * WEIGHT
       */
      if (weight) {
         const parsed = parseSelection(weight);
         if (parsed) {
            if (parsed.type === "lt") {
               queryParamsObject.weightLt = parsed.number;
            } else if (parsed.type === "gt") {
               queryParamsObject.weightGt = parsed.number;
            } else if (parsed.type === "range") {
               queryParamsObject.minWeight = parsed.min;
               queryParamsObject.maxWeight = parsed.max;
            }
         }
      }

      /**
       * HEIGHT
       */
      if (height) {
         const parsed = parseSelection(height);
         if (parsed) {
            if (parsed.type === "lt") {
               queryParamsObject.heightLt = parsed.number;
            } else if (parsed.type === "gt") {
               queryParamsObject.heightGt = parsed.number;
            } else if (parsed.type === "range") {
               queryParamsObject.minHeight = parsed.min;
               queryParamsObject.maxHeight = parsed.max;
            }
         }
      }

      /**
       * BUST SIZE
       */
      if (bustSize) {
         queryParamsObject.breastSize = bustSize;
      }

      /**
       * ACCEPTS
       */
      if (accepts === "В апартаментах") {
         queryParamsObject.apartment = true;
      } else if (accepts === "Выезд к клиенту") {
         queryParamsObject.toClient = true;
      }

      /**
       * DISTRICT / SERVICES
       */
      if (districtMetro) {
         queryParamsObject.district = districtMetro;
      }
      if (services) {
         queryParamsObject.favour = services;
      }

      /**
       * Build the final URL
       */
      const queryParams = new URLSearchParams();
      Object.keys(queryParamsObject).forEach((key) => {
         if (queryParamsObject[key] !== undefined) {
            queryParams.append(key, queryParamsObject[key]);
         }
      });

      navigate(`/?${queryParams.toString()}`);
   };

   const updateFilterField = (fieldName, value) => {
      setFilters((prev) => ({ ...prev, [fieldName]: value }));
   };

   return (
      <div className={styles.container}>
         <Select
            // title={filter_text.hourPrice}
            title={trans.price_title}
            options={trans.price_options}
            value={filters.price}
            changeState={(val) => updateFilterField("price", val)}
         />
         <Select
            title={trans.age_title}
            options={trans.age_options}
            value={filters.age}
            changeState={(val) => updateFilterField("age", val)}
         />
         <Select
            title={trans.weight_title}
            options={trans.weight_options}
            value={filters.weight}
            changeState={(val) => updateFilterField("weight", val)}
         />
         <Select
            title={trans.height_title}
            options={trans.height_options}
            value={filters.height}
            changeState={(val) => updateFilterField("height", val)}
         />
         <Select
            title={trans.bust_title}
            options={bust_size_options}
            value={filters.bustSize}
            changeState={(val) => updateFilterField("bustSize", val)}
         />
         <Select
            title={trans.accepts_title}
            options={trans.accepts_options}
            value={filters.accepts}
            changeState={(val) => updateFilterField("accepts", val)}
         />
         <Select
            title={trans.district_title}
            options={trans.district_options}
            value={filters.districtMetro}
            changeState={(val) => updateFilterField("districtMetro", val)}
         />
         <Select
            title={trans.filters_title}
            options={trans.services_options}
            value={filters.services}
            changeState={(val) => updateFilterField("services", val)}
         />

         <Button style={{ fontWeight: "600" }} onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            {trans.search}
         </Button>
      </div>
   );
};

export default Filter;
