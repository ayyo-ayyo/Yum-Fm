import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import openai from "openai";


export default async function Menu() {
    const route = useRoute();
    const params: any = route.params;
    if (!params) {
        return (
            <>
            <Ionicons name="close-circle" size={48} color="red"></Ionicons> No menu pictures taken
            </>
        )
    }
    let imageList = params.imageList;
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
                "role": "system",
                "content": [
                  {
                    "type": "text",
                    "text": "please create a json object with a property called name, being the name of the restaurant and a property list, listing every menu item according to this schema (excluding the id):\nconst menuItemSchema = new Schema({\n    menu_item_id: { type: Number, required: true, unique: true },\n    menu_id: { type: Number, required: true, ref: '\''Menu'\'' },\n    item_name: { type: String, required: true },\n    category: { type: String },\n    course: { type: String },\n    item_fulfilled_filters: [String],\n    item_price: { type: Number }\n});\nfilters should be main ingredients but not too specific (ex: instead of swordfish, just fish/seafood), common allergens, and dietary restrictions this food conforms to. Please don'\''t say anything else but giving me the JSON. Thank you"
                  }
                ]
              },
              {
                role: "user",
                content: imageList,
              },
            ],
            response_format: {
              type: "json_object",
            },
        }),
    });
    const data = await response.json();
    if (data.error) {
        return (
            <>
            <Ionicons name="close-circle" size={48} color="red"></Ionicons> {data.error.message}
            </>
        )
    }

    return (
        <>
        <Ionicons name="checkmark-circle" size={48} color="green"></Ionicons> Menu uploaded!
        
        </>
    )

}