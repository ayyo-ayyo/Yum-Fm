import { useRoute } from "@react-navigation/native";
import openai from "openai";


export default async function Menu() {
    const route = useRoute();
    let imageList = route.params;
    imageList = imageList.map((image: any) => {return {type: "image_url", image_url: {url: image}}});
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "What are in these images? Is there any difference between them?" },
                  ...imageList
                ],
              },
            ],
        }),
    });
    const data = await response.json();

}