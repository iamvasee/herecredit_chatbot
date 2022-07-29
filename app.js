/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  console.log(req.method);

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      
      const messages = [
                      "Hi there, Welcome to herecredit.👋 What do you need?\nChoose an option below to get going.👇\nMenu\n1. Why am I waitlisted?\n2. Am I eligible for a loan?\n3. On what basis does Herecredit lend?\n4. Why wasn't my application was not approved?"
      ];
      
            const responses = [
        "",
        "There could be any number of reasons for the users to be on the waitlist.\n🦄- Insufficient credit history.\n🦄- Residing outside the service area.\nIf you are living outside our service area. Don't worry. We will let you as soon as we are availabe on your location.",
        "We’re on slow roll out phase. Right now we’re only serving the users in certain cities in Tamilnadu. Slowly we’re moving to other areas aswell. If you don’t live in Tamil Nadu. you maynot be eligible. But don’t worry. Soon, we will be available to you.",
        "Herecredit lends based on the authenticity of the profile details and documents provided by you.",
        "We decide the eligibility of every borrower based on our own set parameters and algorithms. Don’t worry if your loan did not get approved – it is not necessarily a reflection of your credit worthiness. It simply means that your profile does not fit our set algorithms and credit model. We will let you know in case your application could not be approved. Also, you may re-apply after 3 months in such cases."
      ]
            
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      if (msg_body === "Hi herecredit, \n I’d like some assistance.") {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v13.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: messages[0] },
          },
        headers: { "Content-Type": "application/json" },
        });
      } else if (responses[msg_body]) {
          axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v13.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: { body: responses[msg_body] },
            },
          headers: { "Content-Type": "application/json" },
          });
      } else {
          axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v13.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: { body: "Sorry, I can't understand. Please choose one of the options below to get going👇\n\nMenu\n1. Why am I waitlisted?\n2. Am I eligible for a loan?\n3. On what basis does Herecredit lend?\n4. Why wasn't my application was not approved?"},
            },
          headers: { "Content-Type": "application/json" },
          });
      }
      
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  console.log(req.method);

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
