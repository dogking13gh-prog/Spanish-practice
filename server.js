const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Vroom Tunnel 2.0</h1>
            <form action="/proxy">
                <input name="url" placeholder="https://msn.com" style="padding: 10px; width: 300px;">
                <button style="padding: 10px;">Go</button>
            </form>
        </div>
    `);
});

app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.send("No URL provided");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        let html = response.data;
        
        // This is the "Magic Trick": It tells the browser to look at the original site for images/css
        const origin = new URL(targetUrl).origin;
        html = html.replace('<head>', `<head><base href="${origin}/">`);

        res.send(html);
    } catch (error) {
        res.status(500).send("Tunnel Error: " + error.message);
    }
});

app.listen(PORT, () => console.log(`Tunnel live on ${PORT}`));
