const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: '3bn2.aternos.me',
        port: 25565, // <-- ESTE es el puerto Java de Aternos, no 19132
        username: 'Raboot_356',
        version: false, // autodetecta, está bien
        connectTimeout: 30000, // no esperar 3 minutos para fallar
        keepAlive: true,
        checkTimeoutInterval: 30 * 1000,
    });

    bot.on('spawn', () => {
        console.log(`[NPC] El bot apareció en el mapa.`);
        // Si es no-premium, descomenta esto:
        // setTimeout(() => bot.chat('/login erickJKN'), 4000);
    });

    bot.on('login', () => {
        console.log(`[NPC] Conexión establecida.`);
    });

    // Rutina cada 45s
    const loop = setInterval(async () => {
        if (!bot || !bot.entity) return;
        try {
            const chestBlock = bot.findBlock({
                matching: bot.registry.blocksByName.chest.id,
                maxDistance: 5
            });

            if (chestBlock) {
                console.log('[NPC] Abriendo cofre...');
                const chest = await bot.openChest(chestBlock);
                await new Promise(r => setTimeout(r, 2000));
                chest.close();
                console.log('[NPC] Cofre cerrado.');
            } else {
                console.log('[NPC] No hay cofre cerca.');
            }

            await new Promise(r => setTimeout(r, 1000));
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);

        } catch (err) {
            console.log(`[NPC] Error en ciclo: ${err.message}`);
        }
    }, 45000);

    bot.on('end', (reason) => {
        console.log(`[NPC] Desconectado: ${reason}. Reintentando en 25s...`);
        clearInterval(loop);
        setTimeout(createBot, 25000);
    });

    // ESTE era el otro problema: antes solo logueabas el error y no reconectabas
    bot.on('error', (err) => {
        console.log(`[NPC] Error de red: ${err.message}`);
        // mineflayer igual dispara 'end' después, ahí reconecta
    });

    bot.on('kicked', (reason, loggedIn) => {
    console.log(`[NPC] KICKEADO MOTIVO REAL: ${JSON.stringify(reason, null, 2)}`);
});

bot.on('messagestr', (msg) => {
    console.log(`[CHAT] ${msg}`);
});
    });
}

createBot();
