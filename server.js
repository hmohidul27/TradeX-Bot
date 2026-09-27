const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // ১. cors মডিউল যোগ করা
const app = express();

app.use(cors()); // ২. সবার জন্য এক্সেস ওপেন করা
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// টেলিগ্রাম ক্রেডেনশিয়ালস
const BOT_TOKEN = '8883240267:AAH3gQuF1i8vGZ2vJ0tMu652sHbZIpyiP9A';
const CHAT_ID = '8827085716';

// টেস্ট ইউআইডি
const TEST_UID = 'ADMIN999';

app.get('/', (req, res) => {
    res.send('TradeX-Lite-Bot is live!');
});

app.get('/webhook', async (req, res) => {
    const { uid, dep, reg, sumdep } = req.query;
    let message = '';

    if (reg === 'true' && !dep) {
        message = `👤 New Registration!\nUID: ${uid || 'N/A'}`;
    } else if (dep === 'true' || (sumdep && sumdep > 0)) {
        message = `💰 New Deposit!\nUID: ${uid || 'N/A'} - DP $${sumdep || '0'}`;
    }

    if (message) {
        try {
            const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
            await fetch(telegramUrl);
        } catch (error) {
            console.error('Telegram Error:', error);
        }
    }
    res.sendStatus(200);
});

app.post('/check-access', (req, res) => {
    const { uid } = req.body;

    if (uid === TEST_UID) {
        return res.json({ success: true, message: "Test access granted!" });
    }

    res.json({ success: false, message: "এই লিংক দিয়ে তৈরি ইউআইডি না" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
