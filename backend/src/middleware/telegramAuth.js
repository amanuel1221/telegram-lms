const {
  parse,
  validate
} = require("@telegram-apps/init-data-node");


const telegramAuth = (req, res, next) => {

  try {

    const initData = req.headers["x-telegram-init-data"];


    if (!initData) {

      return res.status(401).json({
        message: "Telegram init data missing"
      });

    }


    const botToken = process.env.BOT_TOKEN;


    validate(
      initData,
      botToken
    );


    const parsedData = parse(initData);


    console.log("PARSED TELEGRAM DATA:");
    console.log(parsedData);



    req.telegramUser = parsedData.user;


    next();



  } catch(error) {


    console.log("TELEGRAM AUTH ERROR:", error.message);


    return res.status(401).json({

      message:error.message

    });


  }

};


module.exports = telegramAuth;