var nodemailer = require('nodemailer');
class MailSender{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "smtp.live.com",
            port: 465,
            secure: false,
            auth: {
                user: "[email address]",
                pass: "[password]",
            },
        });
    }

    SendEmail = async(mailContents) => {
        const requiredProps = ["GiveawayId","PrizeId", "ParticipantId", "ParticipantEmail", "GiveawayImage", "PrizeImage", "PrizeName"]
        if(mailContents && mailContents.length>0){
            for(var i=0; i<mailContents.length; i++){
                const mailContent = mailContents[i];
                if(mailContent && this.IsObjectContainsRequiredProps(mailContent, requiredProps))
                {
                    await this.transporter.sendMail({
                        from: '[sender email address]',
                        to: mailContent.ParticipantEmail, // list of receivers
                        subject: "Sended by nodejs -images changed with cid" + mailContent.ParticipantId,

                        html: `
                            <div>
                                <p>Congratulations! You won a giveaway! </p>
                                
                                <p>You won ${mailContent.PrizeName} !!</p>
                                
                            </div>
                        `,
                        attachments: [{
                            filename: '',
                            path: '',
                            cid: ''
                        }]
                    });
                }
            }            
        }
        return "hm";
    }

    IsObjectContainsRequiredProps = (object, requiredProps) => {
        if(Object.keys(object).length){
            for(var i=0; i<requiredProps.length; i++){
                if(!Object.keys(object).includes(requiredProps[i])) return false;
            }
            return true;
        }
        return false;
    }
}

module.exports = MailSender;
