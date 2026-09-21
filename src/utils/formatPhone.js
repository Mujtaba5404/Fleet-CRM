// import { parsePhoneNumberFromString } from "libphonenumber-js";

// const formatPhone = (phoneNumber = "") => {
//   const phoneNumbers = phoneNumber.split("/").map((phone) => phone.trim());

//   const formattedPhoneNumbers = phoneNumbers.map((phone) => {
//     const digitsOnly = phone.replace(/\D/g, "");

//     const parsedPhoneNumber = digitsOnly.startsWith("1") && digitsOnly.length === 11 ? parsePhoneNumberFromString(`+${digitsOnly}`) : parsePhoneNumberFromString(digitsOnly, "US");

//     if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
//       return parsedPhoneNumber.formatInternational();
//     }

//     return phone;
//   });

//   return formattedPhoneNumbers.join(" / ");

//   // return phoneNumber.replace(/(\d{3})(\d{3})(\d+)/g, "$1-$2-$3").replace(/\//g, " / ");
// };

// export default formatPhone;

import { parsePhoneNumberFromString } from "libphonenumber-js";

const formatPhone = (phoneNumber = "", defaultCountry = "US") => {
  const phoneNumbers = phoneNumber.split("/").map((phone) => phone.trim());

  const formattedPhoneNumbers = phoneNumbers.map((phone) => {
    const digitsOnly = phone.replace(/\D/g, "");

    // If the number is already in E.164 format (like +14155552671) or starts with a country code
    let parsedPhoneNumber;

    if (digitsOnly.startsWith("1") && digitsOnly.length === 11) {
      // Case: US / Canada numbers starting with "1"
      parsedPhoneNumber = parsePhoneNumberFromString(`+${digitsOnly}`);
    } else if (phone.startsWith("+")) {
      // Case: Already in E.164
      parsedPhoneNumber = parsePhoneNumberFromString(phone);
    } else {
      // Case: Local dialing — use provided country
      parsedPhoneNumber = parsePhoneNumberFromString(phone, defaultCountry);
    }

    if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
      return parsedPhoneNumber.formatInternational();
    }

    return phone; // fallback
  });

  return formattedPhoneNumbers.join(" / ");
};

export default formatPhone;
