const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// This makes the home page show a simple search bar
app.get('/', (req, res) => {
    res.send(`
        <h1>Vroom Tunnel</h1>
        <form action="/proxy">
            <input name="url" placeholder="Paste link here (e.g. https://msn.com)" style="width:300px;">
            <button type="submit">Go</button>
        </form>
    `);
});

// This is the actual "Tunnel" logic
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.send("No URL provided");

    try {
        const response = await axios.get(targetUrl, {
            responseType: 'text',
            headers: { 'User-Agent': 'Mozilla/5.0' } // Tells the site you are a browser
        });
        // Sends the site content back to your screen
        res.send(response.data); 
    } catch (error) {
        res.status(500).send("Error fetching the site: " + error.message);
    }
});

app.listen(PORT, () => console.log(`Tunnel spinning on port ${PORT}`));
