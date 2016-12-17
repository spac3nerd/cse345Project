//The mailer uses a gmail account to send out emails - nothing fancy happening here, just the basic functionality of nodemailer

mailer = function() {
	var nodemailer = require("nodemailer");
	var transporter = nodemailer.createTransport("smtps://cse345Project@gmail.com:tester1234@smtp.gmail.com");
	var mailOptions = {};
	
	var sendMail = function(date, to, time, vehicle) {
		mailOptions = {
			from: '"Car House - system" <cse345Project@gmail.com>',
			to: to,
			subject: "Your scheduled appointment with us!", 
			text: "", 
			html: "Thank you for scheduling your appointment for your <b>" + vehicle.make + " " + vehicle.model + "</b> at <b>" + time + "</b> on <b>" + date + "</b><br>" +
				"If you wish to cancel your appointment, visit out website and go to your account."
		};
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			}
		});
	};
	
	return {
		sendConfirmationEmail: function(date, to, time, vehicle) {
			sendMail(date, to, time, vehicle);
		}
	};
};
mailer();
module.exports = mailer;