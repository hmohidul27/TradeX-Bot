app.get('/webhook', async (req, res) => {
    const { uid, dep, reg, sumdep } = req.query;

    let message = '';

    // যদি কেউ নতুন একাউন্ট তৈরি করে
    if (reg === 'true' && !dep) {
        message = `👤 New Registration!\nUID: ${uid || 'N/A'}`;
    } 
    // যদি কেউ ডিপোজিট করে
    else if (dep === 'true' || sumdep > 0) {
        message = `💰 New Deposit!\nUID: ${uid || 'N/A'} - DP $${sumdep || '0'}`;
    }

    if (message) {
        // টেলিগ্রামে মেসেজ পাঠানোর কোড
        const telegramUrl = `https://api.telegram.org/bot8883240267:AAH3gQuF1i8vGZ2vJ0tMu652sHbZIpyiP9A/sendMessage?chat_id=8827085716&text=${encodeURIComponent(message)}`;
        await fetch(telegramUrl);
    }

    res.sendStatus(200);
});
