import { notification } from "antd";

export function getTimeAgo(epochTimestamp: number) {
  const currentDate = new Date();
  const inputDate = new Date(epochTimestamp * 1000); // Convert epoch timestamp to milliseconds

  const timeDifference = currentDate.getTime() - inputDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}

export function sendNotification(
  type: "error" | "success",
  message: string = ""
) {
  notification[type]({
    duration: 5,
    message: message,
    style: {
      width: 350,
      height: "auto",
    },
  });
}

export const getFirstLetters = (name: any) => {
  const wordArray = name?.split(" ");
  // Get the first letter of each word
  const firstLetter1 = wordArray[0]?.charAt(0) || "";
  const firstLetter2 = wordArray[1]?.charAt(0) || "";

  // Return the first letters as a string
  return `${firstLetter1}${firstLetter2}`;
};

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear().toString(); // Get last two digits of the year

  return dateToEpoch(`${day}-${month}-${year}`);
};

function dateToEpoch(dateString: any) {
  const [day, month, year] = dateString?.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Months are zero-based in JavaScript

  return date.getTime() / 1000; // Convert milliseconds to seconds for epoch timestamp
}

export function epochToDate(epoch: any) {
  // Convert epoch to milliseconds
  const date = new Date(epoch * 1000);

  // Get individual date components
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + date.getDate()).slice(-2);

  // Return formatted date string
  return `${day}-${month}-${year}`;
}

export function capitalizeWords(str: string = "") {
  // Split the string into an array of words
  const words = str.split(" ");

  // Iterate over each word in the array
  const capitalizedWords = words.map((word) => {
    // Capitalize the first character of each word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a single string
  return capitalizedWords.join(" ");
}

export const phoneNumberValidator = (_: any, value: any) => {
  const phoneRegex = /^\d{10}$/;
  if (!value || phoneRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error("Please enter a valid 10-digit phone number")
  );
};
