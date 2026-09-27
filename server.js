const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// আপনার কনফিগার করা টোকেন এবং চ্যাট আইডি
const TELEGRAM_BOT_TOKEN = '8883240267:AAH3gQuF1i8vGZ2vJ0tMu652sHbZIpyiP9A';
const TELEGRAM_CHAT_ID = '8827085716';

// কটেক্স থেকে পোস্টব্যাক রিসিভ করার রুট (Endpoint)
app.get('/cortex-postback', async (req, res) => {
    try {
        // কটেক্স থেকে পাঠানো UID এবং ডিপোজিট অ্যামাউন্ট রিসিভ করা
        const uid = req.query.uid || req.query.click_id || 'Unknown';
        const depositAmount = req.query.amount || req.query.dp || '0';

        if (uid === 'Unknown') {
            return res.status(400).send('UID missing');
        }

        // আপনার কাঙ্ক্ষিত ফরম্যাট: UID:-12345678 -DP $10
        const message = `🔔 *New Deposit Alert!*\nUID:-${uid} -DP $${depositAmount}`;

        // টেলিগ্রাম বটে মেসেজ পাঠানোর API কল
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        res.status(200).send('Successfully notified to Telegram');
    } catch (error) {
        console.error('Error sending telegram message:', error);
        res.status(500).send('Internal Server Error');
    }
});

// সার্ভার স্টার্ট
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
