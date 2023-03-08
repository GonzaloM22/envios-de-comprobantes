const axios = require('axios');
let FormData = require('form-data');

const whatsappService = async (data) => {
  const { file, phoneNumber } = data;
  try {
    const configAPI = {
      token:
        'EABQDH1AYB5YBAMcilsOIecVutVOFIvrEed9P3YC8fd2R53W6ZAJkVoMRxOfBQUrv4QtfaHLZAYfTPbmZCN2ZCfSaoLnBjgasIpLcN4ZAP0xQOCTasSRTkwDdHtO4Ao0AejKwXgSTPr7ZCrR4UWOycdgXWKnm49jMjSoGbLZAtkBoZAt7HKeztxccpEf5RQhiHomg7J2oWSHrO8KLdNYwYEM4',
      version: 'v15.0',
      Phone_Number_ID: '109679228721909',
      url_request: 'https://graph.facebook.com',
    };
    const { token, Phone_Number_ID, version, url_request } = configAPI;

    let jsonFile = file.replace('data:application/pdf;base64,', '');
    let pdf64 = Buffer.from(jsonFile, 'base64');

    let data = new FormData();
    data.append('messaging_product', 'whatsapp');
    data.append('file', pdf64, {
      filename: 'document.pdf',
      contentType: 'application/pdf',
    });

    let configMedia = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        ...data.getHeaders(),
      },
    };
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data: dataId } = await axios.post(
      `${url_request}/${version}/${Phone_Number_ID}/media`,
      data,
      configMedia
    );

    let mediaId = dataId.id;
    let Phone_Number_Id = Phone_Number_ID;
    let Recipient_Phone_Number = phoneNumber;
    let dataM = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: Recipient_Phone_Number,
      type: 'document',
      document: {
        id: mediaId,
        caption: '',
        filename: 'Comprobante',
      },
    };
    await axios.post(
      `${url_request}/${version}/${Phone_Number_Id}/messages`,
      dataM,
      config
    );
    return true;
  } catch (error) {
    console.log(error.response.data);
    return false;
  }
};

module.exports = { whatsappService };
