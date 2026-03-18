import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getGoogleUser = async (code) => {

  // 🔥 1. Exchange code for token (FIXED)
  let tokenRes;
  try {
       tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          code,
          client_id: process.env.google_clientid,
          client_secret: process.env.google_clientSec,
          redirect_uri: process.env.google_red_url, 
          grant_type: "authorization_code",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    
  } catch (error) {
    console.log("FULL ERROR ↓↓↓");
    console.log("message:", error.message);
    console.log("status:", error.response?.status);
    console.log("data:", error.response?.data);
  }


  const { access_token } = await tokenRes.data;
  // 🔥 2. Get user info
  const userRes = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  return {
    email: userRes.data.email,
    name: userRes.data.name,
    avatar: userRes.data.picture,
    provider_account_id: userRes.data.id,
    access_token,
  };
};