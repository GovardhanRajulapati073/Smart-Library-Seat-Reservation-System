import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function AdminActivityMonitor() {

  const [activity,setActivity] = useState([]);
  const [refresh,setRefresh] = useState(false);

  useEffect(()=>{

    const socket = io("https://smart-library-seat-reservation-system.onrender.com");

    socket.on("activityFeed",(data)=>{

      setActivity(prev => [data,...prev.slice(0,20)]);

    });

    return ()=>socket.disconnect();

  },[]);


  // AUTO REFRESH TIME EVERY 30s

  useEffect(()=>{

    const interval = setInterval(()=>{

      setRefresh(prev => !prev);

    },30000);

    return ()=>clearInterval(interval);

  },[]);



  // TIME AGO FUNCTION

  const timeAgo = (time)=>{

    if(!time) return "just now";

    const now = new Date();
    const past = new Date(time);

    const diff = Math.floor((now - past)/1000);

    if(diff < 60) return "just now";

    if(diff < 3600)
      return `${Math.floor(diff/60)} min ago`;

    if(diff < 86400)
      return `${Math.floor(diff/3600)} hr ago`;

    return `${Math.floor(diff/86400)} day ago`;

  };


  const getIcon = (action)=>{

    if(action==="booked") return "🟢";
    if(action==="cancelled") return "🔴";
    if(action==="expired") return "🟡";

    return "⚪";

  };


  return(

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex justify-center py-10">

      <div className="w-[900px] bg-gray-900/70 border border-gray-800 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Live Library Activity
        </h2>


        {activity.length===0 && (

          <p className="text-center text-gray-400">
            No recent activity
          </p>

        )}


        <div className="space-y-4">

          {activity.map((a,index)=>(

            <div
              key={index}
              className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 transition p-4 rounded-lg"
            >

              <div className="flex items-center gap-3">

                <span className="text-xl">
                  {getIcon(a.action)}
                </span>

                <span className="text-lg">

                  Seat <b>{a.seat}</b> {a.action}

                  {a.section && (
                    <span className="text-blue-400 ml-2">
                      in {a.section}
                    </span>
                  )}

                </span>

              </div>

              <span className="text-gray-400 text-sm">

                {timeAgo(a.timestamp)}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default AdminActivityMonitor;
