const { MessageEmbed } = require('discord.js')
const axios = require('axios')

const teamsjwt = '<jwt token>'

axios.defaults.headers.common = { 'Authorization': `Bearer ${teamsjwt}` }

module.exports = {
    name: 'teams',
    category: 'funtions',
    description: 'Get Teams Meeting links for two days ( today and tomo )',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let tomorowDate = date_ob.getDate() + 1;
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        let startDate = year + "-" + month + "-" + date;
        let endDate = todayDate = year + "-" + month + "-" + tomorowDate;

        /*
            teams thing to check and give me the meetings
            - im using teams api to get the events ( today and tomorow ) auth is done via the token.
        */

        axios.get(`https://teams.microsoft.com/api/mt/apac/beta/me/calendarEvents?StartDate=${startDate}T18:30:00.000Z&EndDate=${endDate}T18:30:00.000Z`)
            .then((res) => {
                let info = res.data
                jsonArray = JSON.parse(JSON.stringify(info));

                if (jsonArray.value[0].objectId != null) {
                    console.log(`${jsonArray.value[0].subject} \n ${jsonArray.value[0].startTime} \n ${jsonArray.value[0].endTime}
                            ${jsonArray.value[0].organizerName} \n ${jsonArray.value[0].skypeTeamsMeetingUrl}`)

                    // send the message with content     
                    const embed = new MessageEmbed()
                        .setTitle(`${jsonArray.value[0].subject} :rocket: `)
                        .setDescription(`Start Time - ${jsonArray.value[0].startTime} \nEnd Time - ${jsonArray.value[0].endTime}
                            ${jsonArray.value[0].organizerName} \n [Meeting Url :page_with_curl: ](${jsonArray.value[0].skypeTeamsMeetingUrl})`)
                    message.channel.send(embed)

                } else {
                    message.channel.send('no events found')
                }

                if (jsonArray.value[1].objectId != null) {
                    console.log(`${jsonArray.value[1].subject} \n ${jsonArray.value[1].startTime} \n ${jsonArray.value[1].endTime}
                                 ${jsonArray.value[1].organizerName} \n ${jsonArray.value[1].skypeTeamsMeetingUrl}`)

                    // send the output
                    
                    const embed = new MessageEmbed()
                        .setTitle(`${jsonArray.value[1].subject} :rocket:`)
                        .setDescription(`Start Time - ${jsonArray.value[1].startTime} \nEnd Time - ${jsonArray.value[1].endTime}
                            ${jsonArray.value[1].organizerName} \n [Meeting Url :page_with_curl: ](${jsonArray.value[1].skypeTeamsMeetingUrl})`)
                    message.channel.send(embed)

                } else {
                    message.channel.send('no events found.')
                }

            })
            .catch((err) => {
                console.log(err)
                message.channel.send(err)
            })

    }
}
