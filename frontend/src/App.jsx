import { useTelegram } from "./hooks/useTelegram";


function App() {

  const telegram = useTelegram();


  if (!telegram) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-300">
            Loading Telegram data...
          </p>

        </div>

      </div>
    );

  }


  const {
    user,
    initDataRaw,
    platform,
    version
  } = telegram;



  return (

    <main className="
      min-h-screen 
      bg-gradient-to-br 
      from-slate-950 
      via-slate-900 
      to-black 
      text-white 
      flex 
      items-center 
      justify-center 
      p-6
    ">


      <section className="
        w-full 
        max-w-md 
        bg-white/10 
        backdrop-blur-lg 
        border 
        border-white/20 
        rounded-2xl 
        p-8 
        shadow-2xl
      ">


        {/* Header */}

        <div className="text-center mb-8">


          <div className="
            w-20 
            h-20 
            mx-auto 
            rounded-full 
            bg-blue-600 
            flex 
            items-center 
            justify-center 
            text-3xl 
            font-bold 
            shadow-lg 
            mb-4
          ">

            {
              user?.firstName?.charAt(0) || "T"
            }

          </div>



          <h1 className="text-3xl font-bold">
            Telegram LMS
          </h1>


          <p className="text-gray-400 mt-2">
            Welcome to your learning platform
          </p>


        </div>





        {/* User Information */}

        <div className="space-y-4">


          <InfoCard
            label="Name"
            value={
              user?.firstName || "Unknown"
            }
          />



          <InfoCard
            label="Username"
            value={
              user?.username
              ? `@${user.username}`
              : "No username"
            }
          />



          <InfoCard
            label="Telegram ID"
            value={user?.id}
          />



          <InfoCard
            label="Language"
            value={user?.languageCode}
          />



          <InfoCard
            label="Platform"
            value={platform}
          />



          <InfoCard
            label="Telegram Version"
            value={version}
          />


        </div>





        {/* Authentication Status */}

        <div className="mt-8">


          <div
            className={`
              flex 
              items-center 
              justify-between 
              rounded-xl 
              px-4 
              py-3

              ${
                initDataRaw
                ?
                "bg-green-500/20 border border-green-500/40"
                :
                "bg-red-500/20 border border-red-500/40"
              }

            `}
          >


            <span className="font-medium">
              Authentication
            </span>


            <span>

              {
                initDataRaw
                ?
                "✅ Verified"
                :
                "❌ Failed"
              }

            </span>


          </div>


        </div>





        {/* DEBUG ONLY - REMOVE LATER */}

        <div className="mt-8">


          <h3 className="font-bold mb-2">
            Init Data Raw
          </h3>


          <div className="
            bg-black/40
            rounded-xl
            p-4
            text-xs
            text-gray-300
            break-all
            max-h-40
            overflow-auto
          ">

            {
              initDataRaw
              ||
              "No init data received"
            }


          </div>


        </div>



      </section>



    </main>

  );

}





function InfoCard({
  label,
  value
}) {


  return (

    <div className="
      bg-white/5 
      rounded-xl 
      p-4 
      border 
      border-white/10
    ">


      <p className="text-sm text-gray-400">

        {label}

      </p>



      <p className="
        text-lg 
        font-semibold 
        break-all
      ">

        {
          value || "-"
        }

      </p>


    </div>

  );

}



export default App;