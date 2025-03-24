const StAxios = require("../utils/SimpleTextingAxios");

const createContact = async (contactData) => {
  StAxios.post("/api/contacts", {
    contactPhone: contactData.phoneNumber.replace(/^(+1 )/, ""),
    firstName: contactData.fname,
    lastName: contactData.lname,
    email: contactData.email,
    customFields: {
      zipcode: contactData.zipcode,
    },
    comment: contactData.membertype,
    listIds: ["My First List"],
  });
};

module.exports = {
  createContact,
};
