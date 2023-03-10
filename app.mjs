import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import PizzaOrderModel from './models/PizzaOrderModel.mjs';

const PORT = process.env.PORT || 8080
const app = express();
app.use(cors())
app.use(express.json());
dotenv.config()

const dbUri = process.env.DB_URI
mongoose.set('strictQuery', true);
mongoose.connect(dbUri)


// {
//     "responseId": "response-id",
//     "session": "projects/project-id/agent/sessions/session-id",
//     "queryResult": {
//       "queryText": "End-user expression",
//       "parameters": {
//         "param-name": "param-value"
//       },
//       "allRequiredParamsPresent": true,
//       "fulfillmentText": "Response configured for matched intent",
//       "fulfillmentMessages": [
//         {
//           "text": {
//             "text": [
//               "Response configured for matched intent"
//             ]
//           }
//         }
//       ],
//       "outputContexts": [
//         {
//           "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
//           "lifespanCount": 5,
//           "parameters": {
//             "param-name": "param-value"
//           }
//         }
//       ],
//       "intent": {
//         "name": "projects/project-id/agent/intents/intent-id",
//         "displayName": "matched-intent-name"
//       },
//       "intentDetectionConfidence": 1,
//       "diagnosticInfo": {},
//       "languageCode": "en"
//     },
//     "originalDetectIntentRequest": {}
//   }

app.get('/', (req, res) => {
    res.send({
        msg: 'this is a server for dialogflow'
    })
})

app.post('/webhook', async (req, res) => {
    const body = req.body
    const parameters = body.queryResult.parameters
    const intent = body.queryResult.intent.displayName
    // console.log(body);
    console.log(intent, parameters);

    const response = (msg) => {
        res.send(
            {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                msg,
                            ]
                        }
                    }
                ]
            }
        )
    }

    if (intent === 'Default Welcome Intent') {
        const intro = 'Saylani Online Pizza & Bar B.Q'
        response(`Welcome to ${intro}`)
    }

    if (intent === 'orderPizza') {
        const order = await PizzaOrderModel.create({
            name: 'obaid',
            item: parameters.item,
            qty: parameters.qty,
            flavor: parameters.flavor
        })
        console.log(order);
        response(`Your ${parameters.qty} ${parameters.flavor} ${parameters.item} has been ordered , please wait`)
    }


})

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////


app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
})