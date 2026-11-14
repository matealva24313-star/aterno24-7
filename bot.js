const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: '3bn2.aternos.me',
        port: 25565,
        username: 'Raboot_356',
        version: '1.21.1',
        connectTimeout: 30000,
        keepAlive: true,
    });

    bot.on('spawn', () => {
        console.log(`[NPC] El bot apareció en el mapa.`);
        // setTimeout(() => bot.chat('/login erickJKN'), 4000);
    });

    bot.on('login', () => {
        console.log(`[NPC] Conexión establecida.`);
    });

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
            }

            // ANTI-AFK SEGURO: gira la cabeza y hace sneak, NO salta
            // Esto no lo detecta el anti-cheat como movimiento inválido
            await bot.look(Math.random() * Math.PI * 2, 0, true);
            bot.setControlState('sneak', true);
            await new Promise(r => setTimeout(r, 500));
            bot.setControlState('sneak', false);
            bot.swingArm();
            console.log('[NPC] Anti-AFK hecho sin saltar.');

        } catch (err) {
            console.log(`[NPC] Error en ciclo: ${err.message}`);
        }
    }, 45000);

    bot.on('end', (reason) => {
        console.log(`[NPC] Desconectado: ${reason}. Reintentando en 30s...`);
        clearInterval(loop);
        setTimeout(createBot, 30000);
    });

    bot.on('error', (err) => {
        console.log(`[NPC] Error de red: ${err.message}`);
    });

    bot.on('kicked', (reason, loggedIn) => {
        console.log(`[NPC] KICKEADO MOTIVO REAL: ${JSON.stringify(reason)}`);
    });

    bot.on('messagestr', (msg) => {
        console.log(`[CHAT] ${msg}`);
    });
}

createBot();
