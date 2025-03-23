
// Extracts the first integer found in a string (e.g. "500грн" -> 500, "Меньше чем 30" -> 30)
function extractNumber(str) {
   const match = str.match(/\d+/);
   return match ? parseInt(match[0], 10) : 0;
}

/**
 * parseSelection("Меньше чем 500грн") => { type: 'lt', number: 500 }
 * parseSelection("Больше чем 6000грн") => { type: 'gt', number: 6000 }
 * parseSelection("500грн-1000грн") => { type: 'range', min: 500, max: 1000 }
 * parseSelection("18-21") => { type: 'range', min: 18, max: 21 }   // For age
 * parseSelection("Меньше чем 30") => { type: 'lt', number: 30 }    // For weight
 */
export function parseSelection(value) {
   if (!value) return null;

   if (value.includes("Меньше чем")) {
      return { type: "lt", number: extractNumber(value) };
   }
   if (value.includes("Больше чем")) {
      return { type: "gt", number: extractNumber(value) };
   }
   if (value.includes("-")) {
      // e.g. "500грн-1000грн" or "18-21"
      const [left, right] = value.split("-");
      const minVal = extractNumber(left);
      const maxVal = extractNumber(right);
      return { type: "range", min: minVal, max: maxVal };
   }

   // If it doesn't match any pattern, return null
   return null;
}

/**
 * buildPriceStringFromParams({ priceLt, priceGt, minPrice, maxPrice })
 * => "Меньше чем 500грн" OR "Больше чем 6000грн" OR "500грн-1000грн"
 *
 * We do a similar approach for age, weight, height, etc.
 */
export function buildPriceStringFromParams({ priceLt, priceGt, minPrice, maxPrice }) {
   if (priceLt) return `Меньше чем ${priceLt}грн`;
   if (priceGt) return `Больше чем ${priceGt}грн`;
   if (minPrice && maxPrice) return `${minPrice}грн-${maxPrice}грн`;
   return "";
}

/**
 * buildRangeStringFromParams({ minAge, maxAge }) => "18-21"
 * Same idea for weight, height, etc.
 */
export function buildAgeStringFromParams({ minAge, maxAge }) {
   if (minAge && maxAge) return `${minAge}-${maxAge}`;
   return "";
}