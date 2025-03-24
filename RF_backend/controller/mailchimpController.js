require("dotenv").config();
const MailChimp = require("@mailchimp/mailchimp_marketing");
const { MemberType } = require("../constants/constant");

const MAILCHIMP_CONFIG = {
  client_key: process.env.MAILCHIMP_API_KEY,
  server_prefix: process.env.MAILCHIMP_SERVER_PREFIX,
  list_id: process.env.MAILCHIMP_LIST_ID,
};

MailChimp.setConfig({
  apiKey: MAILCHIMP_CONFIG.client_key,
  server: MAILCHIMP_CONFIG.server_prefix,
});

const createListMember = async (memberData) => {
  try {
    const member = await MailChimp.lists.addListMember(
      MAILCHIMP_CONFIG.list_id,
      {
        email_address: memberData.email,
        status: "subscribed",
        merge_fields: {
          FNAME: memberData.fname,
          LNAME: memberData.lname,
          BIRTHDAY: memberData.birthday,
          PHONE: memberData.phoneNumber,
          // SMSPHONE: memberData.phoneNumber.replace(/^(\+1 )/, ''),
          ADDRESS: {
            addr1: memberData.addr1,
            city: memberData.city,
            state: memberData.state,
            zip: memberData.zipCode,
            country: memberData.country,
          },
          MEMBERTYPE: memberData.membertype,
        },
      },
      {
        skipMergeValidation: false,
      }
    );
    return member;
  } catch (err) {
    console.log("err :>> ", err);
  }
};

const addOrUpdateListMember = async (member_id, memberData) => {
  try {
    if (member_id) {
      await MailChimp.lists.setListMember(
        MAILCHIMP_CONFIG.list_id,
        member_id,
        {
          email_address: memberData.email,
          status_if_new: "Subscribed",
          merge_fields: {
            FNAME: memberData.fname,
            LNAME: memberData.lname,
            BIRTHDAY: memberData.birthday,
            PHONE: memberData.phoneNumber,
            // SMSPHONE: memberData.phoneNumber.replace(/^(\+1 )/, ''),
            ADDRESS: {
              addr1: memberData.addr1,
              city: memberData.city,
              state: memberData.state,
              zip: memberData.zipCode,
            },
            MEMBERTYPE: memberData.membertype,
          },
        },
        {
          skipMergeValidation: false,
        }
      );
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

const deleteListMember = async (member_id) => {
  try {
    await MailChimp.lists.deleteListMemberPermanent(
      MAILCHIMP_CONFIG.list_id,
      member_id
    );
    return;
  } catch (err) {
    console.log("err :>> ", err);
  }
};

module.exports = {
  createListMember,
  addOrUpdateListMember,
  deleteListMember,
};
