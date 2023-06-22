const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('speedtrap')
            .setDescription('Speed required for your booster to be trapped')
            .addIntegerOption(option => 
                option.setName('boosterbase')
                .setDescription('Base Speed of Booster')
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName('boosteraddedspeed')
                .setDescription('+Speed of Booster')
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName('spdlead')
                .setDescription('Speed Lead of Booster: Default None')
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName('enemybase')
                .setDescription('Base Speed of Enemy Monster')
                .setRequired(true)
            )
            
            .addIntegerOption(option => 
                option.setName('enemylead')
                .setDescription('Speed Lead: Default None')
                .setRequired(true)
            ),
    async execute(interaction) {
        //get inputs
        const boosterBase = interaction.options.getInteger('boosterbase');
        const boosterAddedSpeed = interaction.options.getInteger('boosteraddedspeed');
        const spdLead = interaction.options.getInteger('spdlead') * .01;
        const enemyBase = interaction.options.getInteger('enemybase');
        const enemyLead = interaction.options.getInteger('enemylead') * .01;
        const boosterRuneSpd = Math.floor(boosterAddedSpeed - boosterBase * 0.25);
        const boosterSwiftBonus = boosterBase * 0.25;
        const spdTower = .15

        //do calculations
        const boosterCombatSpd = Math.ceil(boosterBase + boosterRuneSpd + boosterBase*spdTower + boosterBase*spdLead + boosterSwiftBonus);
        const enemyRuneSpd = Math.ceil(boosterCombatSpd - enemyBase - enemyBase*spdTower - enemyBase*enemyLead - enemyBase*0.25);
        const enemySpeedReq = Math.ceil(enemyRuneSpd + enemyBase*0.25)
        
        //return response
        const embedResponse = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Speed Trap')
                            .setDescription('Booster Base Speed: ' + boosterBase.toString() + ' AddedSpeed: +' + boosterAddedSpeed + ' Speed Lead: ' + (spdLead*100) + '%')
                            .addFields(
                                { name: 'Enemy Base Speed', value:  enemyBase.toString(), inline:true },
                                { name: 'Enemy Speed Required', value: '+' + enemySpeedReq.toString(), inline:true },
                                { name: 'Enemy Lead', value: Math.round(enemyLead*100).toString() + '%', inline:true},
                                { name: 'Your Combat Speed', value: boosterCombatSpd.toString()}
                            );
        await interaction.reply({embeds: [embedResponse]});
    }
}