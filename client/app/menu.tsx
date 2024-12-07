import Ionicons from "@expo/vector-icons/Ionicons";
import { useGlobalSearchParams } from "expo-router";
import { useState, useEffect } from 'react';
import { Text } from "react-native";
import MenuItem from "@/components/MenuItemCard";




export default function Menu() {
  const [menuData, setMenuData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useGlobalSearchParams();
  let images = params.imageList;
  
  
  
    const fetchMenuData = async () => {
      if (!images) {
        return;
      }
      
      let imageList: any[] = await Promise.all((images as string).split(",").map(async (image: string) => {
        return {
          "type": "image_url",
          "image_url": {
            "url": image,
          },
        };
      }));
      
      
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      
      try {
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
                    "text": "please create a json object with a property called name, being the name of the restaurant and a property called menu, listing every menu item according to this schema (excluding the id):\nconst menuItemSchema = new Schema({\n    menu_item_id: { type: Number, required: true, unique: true },\n    menu_id: { type: Number, required: true, ref: '\''Menu'\'' },\n    item_name: { type: String, required: true },\n    category: { type: String },\n    course: { type: String },\n    item_fulfilled_filters: [String],\n    item_price: { type: Number }\n});\nfilters should be main ingredients but not too specific (ex: instead of swordfish, just fish/seafood), common allergens, and dietary restrictions this food conforms to. Please don'\''t say anything else but giving me the JSON. Thank you"
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
        
        setMenuData(JSON.parse(data.choices[0].message.content).menu);
        
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    useEffect(() => {
      const fetchMenuDataAsync = async () => {
        await fetchMenuData();
        setLoading(false);
        
      };
      fetchMenuDataAsync();
    }, [images]);
  
     console.log("state:",JSON.stringify(menuData, null, 2));
  

  // Render your menu data here
  return (
    <>
    {loading && <Ionicons name="hourglass-outline" size={48} color="blue"></Ionicons> && <Text>Loading...</Text> 
    ||menuData == null && <Ionicons name="close-circle" size={48} color="red"></Ionicons> && <Text>No menu data</Text>
    || menuData && <Ionicons name="checkmark-circle" size={48} color="green"></Ionicons> && <Text>Menu created</Text>  }
    
    { menuData && menuData.map((item: any) => {
      return <MenuItem key={item.menu_item_id} itemName={item.item_name} price={item.item_price} category={item.category} course={item.course} fulfilledFilters={item.item_fulfilled_filters} />;
    })}
    </>
  );
}