const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: '3bn2.aternos.me',
        port: 25565,
        username: 'Raboot_356',
        version: '1.21.1', // <-- OJO, esto tiene que ser EXACTO a tu server
        connectTimeout: 30000,
    });

    bot.on('spawn', () => {
        console.log(`[NPC] Spawneé, no hago NADA, solo quedo quieto.`);
        // Desactivamos la física del bot para que no mande paquetes de movimiento
        bot.physics.enabled = false;
    });

    bot.on('kicked', (reason) => {
        console.log(`[NPC] KICKEADO: ${JSON.stringify(reason)}`);
    });

    bot.on('error', (err) => console.log(`[NPC] Error: ${err.message}`));
    bot.on('end', () => {
        console.log(`[NPC] Desconectado, reintento en 20s`);
        setTimeout(createBot, 20000);
    });
}

createBot();
