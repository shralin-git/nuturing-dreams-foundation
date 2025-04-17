import axios from "axios";
import { chatsData, forumData } from "../utils/testData";

const baseURL = process.env.REACT_APP_BE_BASE_URL;

// export const API = axios.create({
//   baseURL,
// });

export const API = axios.create({
  baseURL: baseURL,
});

export const privateAPI = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});

export const mockApiData = (key: string) => {
  return new Promise((resolve, rej) => {
    setTimeout(() => {
      let response: any = "";

      if (key === "student") {
        response = {
          data: [
            {
              name: "Applied Scholarship",
              value: 100,
            },
            {
              name: "Approved",
              value: 61,
            },
            {
              name: "Rejected",
              value: 5,
            },
            {
              name: "On Hold",
              value: 50,
            },
          ],
        };
      } else if (key === "forum") {
        response = {
          data: forumData.data,
        };
      } else if (key === "queue") {
        response = {
          data: [
            {
              key: "0",
              "User ID": "NU0",
              "User Name": "User 0",
              "Date Of Birth": 1067711400,
              Institution: "Test Institution 0",
              Approved: false,
              Rejected: true,
              "On Hold": false,
              "User Role": "Donor",
            },
            {
              key: "1",
              "User ID": "NU1",
              "User Name": "User 1",
              "Date Of Birth": 837801000,
              Institution: "Test Institution 1",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Student",
            },
            {
              key: "2",
              "User ID": "NU2",
              "User Name": "User 2",
              "Date Of Birth": 1005071400,
              Institution: "Test Institution 2",
              Approved: true,
              Rejected: false,
              "On Hold": false,
              "User Role": "Donor",
            },
            {
              key: "3",
              "User ID": "NU3",
              "User Name": "User 3",
              "Date Of Birth": 1029609000,
              Institution: "Test Institution 3",
              Approved: true,
              Rejected: false,
              "On Hold": false,
              "User Role": "Mentor",
            },
            {
              key: "4",
              "User ID": "NU4",
              "User Name": "User 4",
              "Date Of Birth": 937420200,
              Institution: "Test Institution 4",
              Approved: true,
              Rejected: false,
              "On Hold": false,
              "User Role": "Donor",
            },
            {
              key: "5",
              "User ID": "NU5",
              "User Name": "User 5",
              "Date Of Birth": 803673000,
              Institution: "Test Institution 5",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Mentor",
            },
            {
              key: "6",
              "User ID": "NU6",
              "User Name": "User 6",
              "Date Of Birth": 908821800,
              Institution: "Test Institution 6",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Donor",
            },
            {
              key: "7",
              "User ID": "NU7",
              "User Name": "User 7",
              "Date Of Birth": 925583400,
              Institution: "Test Institution 7",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Mentor",
            },
            {
              key: "8",
              "User ID": "NU8",
              "User Name": "User 8",
              "Date Of Birth": 790540200,
              Institution: "Test Institution 7",
              Approved: false,
              Rejected: false,
              "On Hold": true,
            },
            {
              key: "10",
              "User ID": "NU0",
              "User Name": "User 0",
              "Date Of Birth": 1067711400,
              Institution: "Test Institution 0",
              Approved: false,
              Rejected: true,
              "On Hold": false,
              "User Role": "Donor",
            },
            {
              key: "11",
              "User ID": "NU1",
              "User Name": "User 1",
              "Date Of Birth": 837801000,
              Institution: "Test Institution 1",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Student",
            },
            {
              key: "12",
              "User ID": "NU2",
              "User Name": "User 2",
              "Date Of Birth": 1005071400,
              Institution: "Test Institution 2",
              Approved: true,
              Rejected: false,
              "On Hold": false,
              "User Role": "Student",
            },
            {
              key: "13",
              "User ID": "NU3",
              "User Name": "User 3",
              "Date Of Birth": 1029609000,
              Institution: "Test Institution 3",
              Approved: true,
              Rejected: false,
              "On Hold": false,
              "User Role": "Student",
            },
            {
              key: "41",
              "User ID": "NU4",
              "User Name": "User 4",
              "Date Of Birth": 937420200,
              Institution: "Test Institution 4",
              Approved: true,
              Rejected: false,
              "On Hold": false,
              "User Role": "Student",
            },
            {
              key: "51",
              "User ID": "NU5",
              "User Name": "User 5",
              "Date Of Birth": 803673000,
              Institution: "Test Institution 5",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Student",
            },
            {
              key: "61",
              "User ID": "NU6",
              "User Name": "User 6",
              "Date Of Birth": 908821800,
              Institution: "Test Institution 6",
              Approved: false,
              Rejected: false,
              "On Hold": true,
            },
            {
              key: "17",
              "User ID": "NU7",
              "User Name": "User 7",
              "Date Of Birth": 925583400,
              Institution: "Test Institution 7",
              Approved: false,
              Rejected: false,
              "On Hold": true,
              "User Role": "Student",
            },
            {
              key: "18",
              "User ID": "NU8",
              "User Name": "User 8",
              "Date Of Birth": 790540200,
              Institution: "Test Institution 7",
              Approved: false,
              Rejected: false,
              "On Hold": true,
            },
          ],
        };
      } else if (key === "users") {
        response = {
          data: [
            {
              "User ID": 123456789,
              "User Name": "Alice123",
              Role: "Student",
              "Date Of Birth": "1985-09-20",
              Institution: "XYZ University",
              Status: "Approved",
            },
            {
              "User ID": 234567890,
              "User Name": "Bob456",
              Role: "Donor",
              "Date Of Birth": "1992-03-10",
              Institution: "Charity Foundation",
              Status: "Rejected",
            },
            {
              "User ID": 345678901,
              "User Name": "Charlie789",
              Role: "Mentor",
              "Date Of Birth": "1978-12-05",
              Institution: "ABC Organization",
              Status: "On-Hold",
            },
            {
              "User ID": 456789012,
              "User Name": "David234",
              Role: "Student",
              "Date Of Birth": "1995-07-25",
              Institution: "Learning Academy",
              Status: "Approved",
            },
            {
              "User ID": 567890123,
              "User Name": "Eva567",
              Role: "Donor",
              "Date Of Birth": "1989-02-15",
              Institution: "Nonprofit Organization",
              Status: "Rejected",
            },
            {
              "User ID": 678901234,
              "User Name": "Frank901",
              Role: "Mentor",
              "Date Of Birth": "1983-10-30",
              Institution: "Mentoring Program",
              Status: "On-Hold",
            },
            {
              "User ID": 789012345,
              "User Name": "Grace123",
              Role: "Student",
              "Date Of Birth": "1976-06-12",
              Institution: "Community College",
              Status: "Approved",
            },
            {
              "User ID": 890123456,
              "User Name": "Henry456",
              Role: "Donor",
              "Date Of Birth": "1991-04-18",
              Institution: "Support Fund",
              Status: "Approved",
            },
            {
              "User ID": 901234567,
              "User Name": "Isabel789",
              Role: "Student",
              "Date Of Birth": "1987-11-05",
              Institution: "University of Science",
              Status: "Rejected",
            },
            {
              "User ID": 912345678,
              "User Name": "Jack901",
              Role: "Mentor",
              "Date Of Birth": "1980-08-20",
              Institution: "Tech Institute",
              Status: "On-Hold",
            },
            {
              "User ID": 923456789,
              "User Name": "Karen123",
              Role: "Student",
              "Date Of Birth": "1993-05-15",
              Institution: "Arts College",
              Status: "Approved",
            },
            {
              "User ID": 934567890,
              "User Name": "Leo456",
              Role: "Donor",
              "Date Of Birth": "1984-02-28",
              Institution: "Education Foundation",
              Status: "Rejected",
            },
            {
              "User ID": 945678901,
              "User Name": "Mary789",
              Role: "Mentor",
              "Date Of Birth": "1979-09-10",
              Institution: "Career Development Center",
              Status: "On-Hold",
            },
            {
              "User ID": 956789012,
              "User Name": "Nathan234",
              Role: "Student",
              "Date Of Birth": "1996-06-25",
              Institution: "Technical School",
              Status: "Approved",
            },
            {
              "User ID": 967890123,
              "User Name": "Olivia567",
              Role: "Donor",
              "Date Of Birth": "1990-03-18",
              Institution: "Scholarship Program",
              Status: "Approved",
            },
            {
              "User ID": 978901234,
              "User Name": "Peter901",
              Role: "Mentor",
              "Date Of Birth": "1981-12-01",
              Institution: "Volunteer Organization",
              Status: "Rejected",
            },
            {
              "User ID": 989012345,
              "User Name": "Quinn123",
              Role: "Student",
              "Date Of Birth": "1988-07-22",
              Institution: "Online University",
              Status: "Approved",
            },
            {
              "User ID": 990123456,
              "User Name": "Rachel456",
              Role: "Donor",
              "Date Of Birth": "1982-04-05",
              Institution: "Foundation for Education",
              Status: "On-Hold",
            },
            {
              "User ID": 991234567,
              "User Name": "Sam789",
              Role: "Mentor",
              "Date Of Birth": "1977-11-15",
              Institution: "Youth Center",
              Status: "Approved",
            },
            {
              "User ID": 992345678,
              "User Name": "Tina901",
              Role: "Student",
              "Date Of Birth": "1994-08-30",
              Institution: "Medical College",
              Status: "Rejected",
            },
          ],
        };
      } else if (key === "chats") {
        response = {
          data: chatsData.chats,
        };
      } else if (key === "messages") {
        response = {
          data: chatsData.messages,
        };
      } else if (key === "forumMessages") {
        response = {
          data: forumData.topicMessages,
        };
      } else if (key === "orderPayment") {
        response = {
          data: {
            id: "order_O43KsxtKU6fI4o",
            entity: "order",
            amount: 100,
            amount_paid: 0,
            amount_due: 100,
            currency: "INR",
            receipt: "e641ebf017341ddc5d5b",
            offer_id: null,
            status: "created",
            attempts: 0,
            notes: [],
            created_at: 1714309588,
          },
        };
      }

      resolve(response);
    }, 2000);
  });
};
