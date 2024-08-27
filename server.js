const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require("cors")
require("dotenv").config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json());

const spreadsheetId = process.env.spreadsheetId; // Replace with your spreadsheet ID
// const credentials = require('./credentials.json'); // Your credentials file

const auth = new google.auth.GoogleAuth({
  type : process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key:  process.env.private_key,
  auth_uri:  process.env.auth_uri,
  token_uri:  process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain:  process.env.universe_domain,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/submit-form', async (req, res) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    const { name, email, phone, message } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1:D1', // Adjust the range to match your sheet's layout
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, phone, message]],
      },
    });

    res.status(200).send('Data added to Google Sheets');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));