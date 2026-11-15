const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: '3bn2.aternos.me',
        port: 25565,
        username: 'Raboot_356',
        version: '26.1',
        connectTimeout: 30000,
    });

    bot.on('spawn', () => {
        console.log(`[NPC] Entré bien!`);
    });

    setInterval(() => {
        if (!bot || !bot.entity) return;
        bot.look(Math.random() * Math.PI * 2, 0, true);
        bot.swingArm();
        console.log('[NPC] Anti-AFK');
    }, 45000);

    bot.on('kicked', (reason) => {
        console.log(`[NPC] KICKEADO: ${JSON.stringify(reason)}`);
    });

    bot.on('error', (err) => console.log(`[NPC] Error: ${err.message}`));
    bot.on('end', () => setTimeout(createBot, 20000));
}

createBot();
