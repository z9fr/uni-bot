const { MessageEmbed } = require('discord.js')

const puppeteer = require('puppeteer-core');
const fs = require('fs')
const { exec } = require("child_process");


module.exports = {
    name: 'dle',
    category: 'funtion',
    description: 'Returns DLE events events',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        // to delay stuff to load and things

        function delay(time) {
            return new Promise(function (resolve) {
                setTimeout(resolve, time)
            });
        }


        // i have no idea to comeup with a way to do this without creds :smh
        const email = "email@email.fr"
        const password = "password"


        exec("echo '' > out.txt", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`output from the cmd: ${stderr}`);
                return;
            }

            console.log(`removed out.txt: ${stdout}`);
        });

        (async () => {
           try{
               const browser = await puppeteer.launch({
                   executablePath: '/usr/bin/chromium',
                   headless: true
               });
               const page = await browser.newPage();
               await page.goto('https://login.microsoftonline.com/');
               //await browser.close();
               await delay(4000);
               // adding the username
               await page.type('#i0116', `${email}`);
               await page.click('#idSIButton9');
               await page.waitForNavigation();

               await delay(4000);

               //input the password
               await page.type('#i0118', `${password}`)
               await page.click('#idSIButton9')
               await page.waitForNavigation();

               // sending a redirect to the dle calender
               await delay(4000);
               await page.goto('https://dle.plymouth.ac.uk/calendar/view.php?view=month');

               // delay for a bit to load and get the table
               await delay(7000);
               console.log('delay for 7')

               await delay(3000);
               console.log("starting to get tables")

               const data = await page.$$eval('table tr td', tds => tds.map((td) => {

                   return td.innerText;
               }));


               let values = data.toString().replace('...', '')
               let valu2 = values.replace(' ,', '')

               /*
   
               if someone can comeup with a better idea please send a pull i have no idaea how to make this work so i did it in this dumb way :joy:
   
               */

               fs.writeFile("/home/dasith/projects/moodle-bot/commands/funtions/out.txt", valu2, function (err) {
                   if (err) {
                       return console.log(err);
                   }
                   console.log("The file was saved!");
               });

               console.log('finding the events')

               // running the grep to find the availible events

               

               try{
                   delay(3000)
                   exec("cat /home/dasith/projects/moodle-bot/commands/funtions/out.txt | grep -vvv events | grep event,", (error, stdout, stderr) => {
                       if (error) {
                           console.log(`error: ${error.message}`);
                           return;
                       }
                       if (stderr) {
                           console.log(`output from the cmd: ${stderr}`);
                           return;
                       }
                       // output the cmd output saying if there's any events or not 
                       let output = stdout;
                       console.log(`enddd: ${stdout}`);
                       const embed = new MessageEmbed()
                           .setTitle('Assignments On DLE :red_circle: ')
                           .setDescription(`Go submit this shit ffs ${stdout}`)
                       message.channel.send(embed)

                       setTimeout(() => {
                           browser.close()
                       }, 1000);

                   });
               }
               catch(err){
                   console.log(err)
                   const embed = new MessageEmbed()
                       .setTitle('Something went wrong come fix me! :rage:')
                       .setDescription(`error : ${err}`)
                   message.channel.send(embed)

                   setTimeout(() => {
                       browser.close()
                   }, 1000);

               }

           }
           catch(err){
               console.log(err)
               const embed = new MessageEmbed()
                   .setTitle('Something went wrong come fix me! :rage:')
                   .setDescription(`error : ${err}`)
               message.channel.send(embed)

               setTimeout(() => {
                   browser.close()
               }, 1000);
           }

        })();

    }
}
