const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('tuneoffense')
            .setDescription('Speed required to tune to booster for offense')
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
                option.setName('mon2base')
                .setDescription('Base Speed of Monster 2')
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName('mon3base')
                .setDescription('Base Speed of Monster 3')
            )
            .addIntegerOption(option => 
                option.setName('atbboost')
                .setDescription('Attack Bar Boost Amount: Default 0')
            )
            .addBooleanOption(option => 
                option.setName('boosterswift')
                .setDescription('Booster on swift set: Default True')
            )
            .addIntegerOption(option => 
                option.setName('spdlead')
                .setDescription('Speed Lead: Default None')
            )
            .addBooleanOption(option => 
                option.setName('spdbuff')
                .setDescription('Speed Buff applied by booster: Default False')
            )
            .addIntegerOption(option => 
                option.setName('mon2spdincreasing')
                .setDescription('Spd Increasing % on Monster 2')
            )
            .addIntegerOption(option => 
                option.setName('mon3spdincreasing')
                .setDescription('Spd Increasing % on Monster 3')
            ),
    async execute(interaction) {
        //get inputs
        const boosterBase = interaction.options.getInteger('boosterbase');
        const boosterAddedSpeed = interaction.options.getInteger('boosteraddedspeed');
        const spdLead = interaction.options.getInteger('spdlead') * .01 ?? 0;
        const boosterSwift = interaction.options.getBoolean('boosterswift') ?? true;    
        const spdBuff = interaction.options.getBoolean('spdbuff') ?? false;      
        const boosterRuneSpd = boosterSwift ? Math.floor(boosterAddedSpeed - boosterBase * 0.25) : boosterAddedSpeed;
        const boosterSwiftBonus = boosterSwift ? boosterBase * 0.25 : 0;
        const spdTower = .15

        const atbBoost = interaction.options.getInteger('atbboost') ?? 0;
        const mon2Base = interaction.options.getInteger('mon2base');
        const mon2SpdIncreasing = interaction.options.getInteger('mon2spdincreasing') ?? 0;
        const mon2SpdBonus = spdBuff ? 1.3 + (mon2SpdIncreasing * .01 * .3) : 1;
        const mon3Base = interaction.options.getInteger('mon3base') ?? 0;
        const mon3SpdIncreasing = interaction.options.getInteger('mon3spdincreasing') ?? 0;
        const mon3SpdBonus = spdBuff ? 1.3 + (mon3SpdIncreasing * .01 * .3) : 1;

        //do calculations
        const boosterCombatSpd = Math.ceil(boosterBase + boosterRuneSpd + boosterBase*spdTower + boosterBase*spdLead + boosterSwiftBonus);
        const enemyCombatSpd = boosterCombatSpd;

        const tickTo100 = Math.ceil(100 / (boosterCombatSpd * 0.07));
        const enemyTickPlusOne = enemyCombatSpd * 0.07 * (tickTo100 + 1);
        const enemyTickPlusTwo = enemyCombatSpd * 0.07 * (tickTo100 + 2);
        const mon2CombatSpd = ((1/0.07)*(enemyTickPlusOne - atbBoost)) / (tickTo100 + mon2SpdBonus);

        const mon3CombatSpd = ((1/0.07)*(enemyTickPlusTwo - atbBoost)) / (tickTo100 + 2*mon3SpdBonus);

        let mon2RuneSpd = Math.ceil(mon2CombatSpd - mon2Base - mon2Base*spdTower - mon2Base*spdLead);
        let mon2SwiftSpd = Math.ceil(Math.ceil(mon2CombatSpd - mon2Base - mon2Base*spdTower - mon2Base*spdLead - mon2Base*0.25) + mon2Base*0.25);
        const mon3RuneSpd = mon3Base == 0 ? 0 : Math.ceil(mon3CombatSpd - mon3Base - mon3Base*spdTower - mon3Base*spdLead);
        const mon3SwiftSpd = mon3Base == 0 ? 0 : Math.ceil(Math.ceil(mon3CombatSpd - mon3Base - mon3Base*spdTower - mon3Base*spdLead - mon3Base*0.25) + mon3Base*0.25);
        //check edge case of mon3 atb > mon2 atb at tick+1
        const mon2Atb = mon2CombatSpd * (tickTo100 + mon2SpdBonus);
        const mon3Atb = mon3Base == 0 ? 0 : mon3CombatSpd * (tickTo100 + mon3SpdBonus);
        if (mon3Atb > mon2Atb) {
            //recalculate the mon2 combat speed needed to move before mon3
            const mon2NewCombatSpd = (mon3Atb) / (tickTo100 + mon2SpdBonus);            
            mon2RuneSpd = Math.ceil(mon2NewCombatSpd - mon2Base - mon2Base*spdTower - mon2Base*spdLead) + 1;
            mon2SwiftSpd = Math.ceil(Math.ceil(mon2NewCombatSpd - mon2Base - mon2Base*spdTower - mon2Base*spdLead - mon2Base*0.25) + mon2Base*0.25) + 1;
        }  
        //return response
        const embedResponse = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Speed Tuning' )
                            .setDescription('Booster Base Speed: ' + boosterBase.toString() + ' AddedSpeed: +' + boosterAddedSpeed)
                            .addFields(
                                { name: 'Monster 2 Speed Required(swift)', value: `+${mon2RuneSpd.toString()}(+${mon2SwiftSpd.toString()})`, inline:true},
                                { name: 'Monster 2 Base Spd', value: mon2Base.toString(), inline:true},
                                { name: 'Monster 2 Speed Increasing', value: mon2SpdIncreasing.toString(), inline:true },
                                { name: '\u200B', value: '\u200B' },
                                { name: 'Monster 3 Speed Required(swift)', value: `+${mon3RuneSpd.toString()}(+${mon3SwiftSpd.toString()})`, inline:true },
                                { name: 'Monster 3 Base Spd', value: mon3Base.toString(), inline:true },
                                { name: 'Monster 3 Speed Increasing', value: mon3SpdIncreasing.toString(), inline:true }
                            );
        await interaction.reply({embeds: [embedResponse]});
    }
}