const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('cleavespeed')
            .setDescription('Speed required for your def to be cleaved')
            .addIntegerOption(option => 
                option.setName('monsterbase')
                .setDescription('Base Speed of Monster')
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName('runespeed')
                .setDescription('+Speed of Monster')
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName('spdlead')
                .setDescription('Speed Lead of Monster')
                .setRequired(true)
            )
            .addBooleanOption(option => 
                option.setName('swift')
                .setDescription('Swift? Default True')
            ),
    async execute(interaction) {
        //get inputs
        const monsterBase = interaction.options.getInteger('monsterbase');
        const monsterAddedSpeed = interaction.options.getInteger('runespeed');
        const spdLead = interaction.options.getInteger('spdlead') * .01;
        const swift = interaction.options.getBoolean('swift') ?? true;
        const runeSpd = swift ? Math.floor(monsterAddedSpeed - monsterBase * 0.25) : monsterAddedSpeed;
        const swiftBonus = swift ? monsterBase * 0.25 : 0;
        const spdTower = .15

        //do calculations
        const combatSpd = Math.ceil(monsterBase + runeSpd + monsterBase*spdTower + monsterBase*spdLead + swiftBonus);
        // Gally/Bern(111 + 24 lead)
        const bernRuneSpd = Math.ceil(combatSpd - 111 - 111*spdTower - 111*.24 - 111*0.25);
        const bernSpeedReq = Math.ceil(bernRuneSpd + 111*0.25)
        // Miri(107 + 24 lead)
        const miriRuneSpd = Math.ceil(combatSpd - 107 - 107*spdTower - 107*.24 - 107*0.25);
        const miriSpeedReq = Math.ceil(miriRuneSpd + 107*0.25)
        // Gem/Kahli(102+19 lead)
        const kahliRuneSpd = Math.ceil(combatSpd - 102 - 102*spdTower - 102*.19 - 102*0.25);
        const kahliSpeedReq = Math.ceil(kahliRuneSpd + 102*0.25)
        // Jamire/homie(101+24 lead)
        const homieRuneSpd = Math.ceil(combatSpd - 101 - 101*spdTower - 101*.24 - 101*0.25);
        const homieSpeedReq = Math.ceil(homieRuneSpd + 101*0.25)
        // Garo/Draco(106+30 lead)
        const dracoRuneSpd = Math.ceil(combatSpd - 106 - 106*spdTower - 106*.30 - 106*0.25);
        const dracoSpeedReq = Math.ceil(dracoRuneSpd + 106*0.25)
        // Khmun/Racuni(105+19 lead)
        const racuniRuneSpd = Math.ceil(combatSpd - 105 - 105*spdTower - 105*.19 - 105*0.25);
        const racuniSpeedReq = Math.ceil(racuniRuneSpd + 105*0.25)
        // Gally/Tiana(96+24 lead)
        const tianaRuneSpd = Math.ceil(combatSpd - 96 - 96*spdTower - 96*.24 - 96*0.25);
        const tianaSpeedReq = Math.ceil(tianaRuneSpd + 96*0.25)
        // Bastet(99+0 lead)
        const bastetRuneSpd = Math.ceil(combatSpd - 99 - 99*spdTower - 99*0.25);
        const bastetSpeedReq = Math.ceil(bastetRuneSpd + 99*0.25)
        // Gin/Dova(105+30 lead)
        const dovaRuneSpd = Math.ceil(combatSpd - 105 - 105*spdTower - 105*.30 - 105*0.25);
        const dovaSpeedReq = Math.ceil(dovaRuneSpd + 105*0.25)
        // Susano/Kona(91+30 lead)
        const konaRuneSpd = Math.ceil(combatSpd - 91 - 91*spdTower - 91*.30 - 91*0.25);
        const konaSpeedReq = Math.ceil(konaRuneSpd + 91*0.25)
        //return response
        const embedResponse = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Cleave Speed Needed')
                            .setDescription('Defense Base Speed: ' + monsterBase.toString() + ' AddedSpeed: +' + monsterAddedSpeed + ' Speed Lead: ' + (spdLead*100) + '%')
                            .addFields(
                                { name: 'Gally/Bern/Julie', value: '+' + bernSpeedReq.toString() },
                                { name: 'Miri/Shen', value: '+' + miriSpeedReq.toString() },
                                { name: 'Gem/Kahli/Leah', value: '+' + kahliSpeedReq.toString() },
                                { name: 'Jamire/Homie/x', value: '+' + homieSpeedReq.toString() },
                                { name: 'Garo/Draco/Kahli', value: '+' + dracoSpeedReq.toString() },
                                { name: 'Khmun/Racuni/x', value: '+' + racuniSpeedReq.toString() },
                                { name: 'Gally/Tiana/x', value: '+' + tianaSpeedReq.toString() },
                                { name: 'Bastet + 2', value: '+' + bastetSpeedReq.toString() },                                
                                { name: 'Gin/Dova/x', value: '+' + dovaSpeedReq.toString() },                                
                                { name: 'Susano/Kona/x', value: '+' + konaSpeedReq.toString() }
                            );
        await interaction.reply({embeds: [embedResponse]});
    }
}