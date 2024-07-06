import { URI } from "@/source";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion, sync, useCycle } from "framer-motion";

export default function View() {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [userName , setUsername] = useState("")
  const { slug } = router.query;

  const fetchUserData = async () => {
    const bodyObject = {
      userID: slug,
    };
    debugger;
    const response = await fetch(`${URI}/api/getlinks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyObject),
    });
    const result = await response.json();
    setUserData(result.data.links);
    setUsername(result)
  };

  useEffect(() => {
    if (slug) {
      fetchUserData();
    }
  }, [slug]);

  const handlelink = (url) => {
    const newTab = window.open(url, '_blank');
    // Focus on the new tab (optional)
    if (newTab) {
      newTab.focus();
    } else {
      // If pop-up blocker prevents opening new tab, provide alternative
      console.log("Please allow pop-ups for this site to open the link.");
    }
  }
  return (
    <div className="backggroundColor flex justify-center w-full h-full">
      <div className="flex justify-center flex-col items-center w-2/6">
        <div class="circle">
          <p class="circle-inner">AY</p>
        </div>
        <div className="userName">
        @{userName?.data?.username}
        </div>
        {userData.length > 0 ? userData.map((item, index) => {
          return (
            <motion.div animate={{ y: -10 }}
              transition={{
                type: "spring", duration: 1, stiffness: 100,
                damping: 10
              }} key={index} className="cursor-pointer w-3/6 bg-white min-h-12 text-cyan-500 mb-2 border rounded-2xl mt-2 font-sans text-lg font-normal pl-12 pr-12 pt-2 pb-2">
              <div className="flex justify-center items-center bg-white font-medium font-sans" onClick={() => handlelink(item.link)}>
                {item.title}
              </div>
            </motion.div>
          )
        }) : null}
      </div>
    </div>
  );
}
