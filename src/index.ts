import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import Utils from '../utils';
import Redirect from '../models/redirectModel';

// Use destructuring to import config function from dotenv
import { config } from 'dotenv';

// Call config function to load environment variables
config(process.env.NODE_ENV === 'production' ? {} : { path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port if available

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    const dbAddress = process.env.MONGODBADDRESS;
    if(dbAddress) {
        mongoose.connect(dbAddress).then(() => {
            console.log('Connected to database');
        }).catch((err) => { 
            console.error(err); // Use console.error for logging errors
        });
    } else {
        console.warn('No database address provided'); // Use console.warn for logging warnings
    }
});

app.post('/redirection', async (req: Request, res: Response) => {
    try {
        const { url: urlToRedirect, hours: hoursToKeepOnline } = req.query;

        if (!urlToRedirect || 
            !hoursToKeepOnline || 
            typeof urlToRedirect != "string" || 
            !urlToRedirect.startsWith('http') || 
            isNaN(Number(hoursToKeepOnline))
        ) {
            return res.status(400).send('Invalid data provided');
        }

        let generatedCode = Utils.GenerateShortRandomString(5);
        let uniqueCode = await Redirect.findOne({ code: generatedCode });

        while(uniqueCode) {
            console.log("LOOPING", uniqueCode);
            generatedCode = Utils.GenerateShortRandomString(5);
            uniqueCode = await Redirect.findOne({ code: generatedCode });
        }

        const response = await Redirect.create({
            redirectAddress: urlToRedirect,
            deletedAt: moment().utc().add(Number(hoursToKeepOnline), 'hours').toDate(),
            createdAt: moment().utc().toDate(),
            code: generatedCode
        });

        if (!response._id) { 
            return res.status(500).send('Internal server error');
        }

        res.status(200).send('OK');
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

app.get('/:id', async (req: Request, res: Response) => {
    const defaultRedirectAddress = process.env.DEFAULTREDIRECTADDRESS || 'https://valeteer.com';

    try {
        const redirect = await Redirect.findOne({ code: req.params.id });
        
        if (!redirect) return res.status(404).redirect(defaultRedirectAddress);

        if (redirect.deletedAt && moment().utc().isAfter(redirect.deletedAt)) 
            return res.status(410).redirect(defaultRedirectAddress);

        return res.redirect(301, redirect.redirectAddress || defaultRedirectAddress);
    } catch(err) {
        console.error(err);
        return res.status(410).redirect(defaultRedirectAddress);
    }
});