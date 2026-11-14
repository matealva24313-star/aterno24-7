const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: '3bn2.aternos.me',
        port: 25565,
        username: 'Raboot_356',
        version: '1.21.1', // CAMBIA ESTO por la version exacta de tu server en Aternos
        connectTimeout: 30000,
        keepAlive: true,
    });

    bot.on('spawn', () => {
        console.log(`[NPC] El bot apareció en el mapa.`);
        // Si tu server pide login, descomenta la linea de abajo y pone tu contra:
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
            await new Promise(r => setTimeout(r, 1000));
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
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
