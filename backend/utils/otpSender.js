const axios = require('axios');




module.exports = async (number,otp) => {
	try {
    

        var data = JSON.stringify({
            "messages": [
              {
                "channel": "sms",
                "recipients": [
                    `+91${number}`
                ],
                "content": `Your Verification OTP is ${otp}`,
                "msg_type": "text",
                "data_coding": "text"
              }
            ],
            "message_globals": {
              "originator": "SignOTP",
              "report_url": "https://the_url_to_recieve_delivery_report.com"
            }
          });
          var config = {
            method: 'post',
            url: 'https://api.d7networks.com/messages/v1/send',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiMWZjMGQ1MzktYjAxZC00NjA5LTlkMzItMzEwMjE3YzkzMmVlIn0.iBEY4YLb3vRKzzIl2ykNTaB52RFax5L6Y_QfAAuCvW8'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
		
	} catch (error) {
		console.log("otp not sent!");
		console.log(error);
		return error;
	}
};