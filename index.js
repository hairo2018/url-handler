const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const LOG_CHANNEL_ID = 'log kanal id'; 

client.on('ready', () => {
    console.log(`Bot giriş yaptı: ${client.user.tag}`);
});

client.on('guildUpdate', async (oldGuild, newGuild) => {

    const oldURL = oldGuild.vanityURLCode;
    const newURL = newGuild.vanityURLCode;

    if (oldURL !== newURL) {
     
        const auditLogs = await newGuild.fetchAuditLogs({
            type: 1, 
            limit: 1,
        });
        const auditLog = auditLogs.entries.first();
        const executor = auditLog ? auditLog.executor : null;

        if (executor) {
            try {
       
                const member = await newGuild.members.fetch(executor.id);
                if (member) {
               
                    await member.roles.set([]);

               
                    const channels = newGuild.channels.cache;
                    channels.forEach(channel => {
                    
                        channel.permissionOverwrites.edit(executor.id, {
                            VIEW_CHANNEL: PermissionsBitField.Flags.ViewChannel, 
                        }).catch(err => console.error(`${err}`));
                    });

                    const logChannel = newGuild.channels.cache.get(LOG_CHANNEL_ID);
                    if (logChannel) {
                        const embed = new EmbedBuilder()
                            .setColor('#000000') 
                            .setTitle('Nobody faster than hairo')
                            .setDescription(`Claimed`)
                            .addFields(
                                { name: 'Before', value: oldURL || 'Bilinmiyor', inline: true },
                                { name: 'After', value: newURL || 'Bilinmiyor', inline: true }
                            )
                            .setImage('https://raw.githubusercontent.com/hairo2018/url-sniper/main/1e480768718e3cd173ea672e6b58e614.jpg') 
                            .setTimestamp();

                        logChannel.send({ content: '@everyone SİZİN TAKILDIĞINIZ YERLERİ BİZ İNŞA ETTİK X:D?', embeds: [embed] });
                    }
                }
            } catch (err) {
                console.error('Bir hata oluştu:', err);
            }
        }
    }
});

client.login('token gelecek');
