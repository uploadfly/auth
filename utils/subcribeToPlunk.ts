import axios from "axios";

const subToPlunk = async (email: string) => {
  try {
    const { data } = await axios.post(
      "https://api.useplunk.com/v1/contacts",
      {
        email,
        subcribed: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
        },
      }
    );
    console.log(data);
  } catch (error: any) {
    console.log(error.response.data);
  }
  try {
    const { data } = await axios.post(
      "https://api.useplunk.com/v1/track",
      {
        email,
        event: "Welcome-to-uploadfly",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
        },
      }
    );
    console.log(data);
  } catch (error: any) {
    console.log(error.response.data);
  }
};

export default subToPlunk;
