import collections

image_map = {
"Margherita Pizza": "https://images.unsplash.com/photo-1601924928586-6d1b3fbbf9f0",
"Pepperoni Pizza": "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
"Garlic Bread": "https://images.unsplash.com/photo-1619535860434-5c0b8b8b7a3d",
"Choco Lava Cake": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
"Diet Coke": "https://images.unsplash.com/photo-1580910051074-3eb694886505",

"Whopper Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
"Veggie Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349",
"French Fries": "https://images.unsplash.com/photo-1576107232684-1279f390859f",
"Chicken Nuggets": "https://images.unsplash.com/photo-1606756790138-261d2b21cd59",
"Chocolate Shake": "https://images.unsplash.com/photo-1577805947697-89e18249d767",

"Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
"Paneer Tikka Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
"Garlic Naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950",
"Samosa": "https://images.unsplash.com/photo-1601050690117-94f5f6fa0e8b",
"Gulab Jamun": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0",

"Kung Pao Chicken": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
"Spring Rolls": "https://images.unsplash.com/photo-1601315488950-3b5047998b38",
"Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
"Sweet and Sour Pork": "https://images.unsplash.com/photo-1625944525903-b2f1c0f4b1d1",
"Wonton Soup": "https://images.unsplash.com/photo-1604908812875-8b8d5b0c1eaa",

"Death by Chocolate": "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
"Vanilla Sundae": "https://images.unsplash.com/photo-1570197788417-0e82375c9371",
"Strawberry Ice Cream": "https://images.unsplash.com/photo-1505253210343-0c7c9c8e1b1f",
"Cheesecake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
"Coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93",

"Masala Dosa": "https://images.unsplash.com/photo-1630409346824-4f0e7b080087",
"Idli Sambar": "https://images.unsplash.com/photo-1626074353765-517a681e40be",
"Medu Vada": "https://images.unsplash.com/photo-1626074353735-5d8c0b3e0f3b",
"Filter Coffee": "https://images.unsplash.com/photo-1498804103079-a6351b050096",
"Pongal": "https://images.unsplash.com/photo-1630409346707-c8b0c3f4b4a1",

"Fried Chicken Bucket": "https://images.unsplash.com/photo-1562967916-eb82221dfb92",
"Zinger Burger": "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
"Popcorn Chicken": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
"Fries": "https://images.unsplash.com/photo-1550547660-d9450f859349",
"Pepsi": "https://images.unsplash.com/photo-1586201375761-83865001e31c",

"Greek Salad": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
"Caesar Salad": "https://images.unsplash.com/photo-1551248429-40975aa4de74",
"Fresh Orange Juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
"Avocado Toast": "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2",
"Fruit Bowl": "https://images.unsplash.com/photo-1505252585461-04db1eb84625",

"Cappuccino": "https://images.unsplash.com/photo-1511920170033-f8396924c348",
"Iced Latte": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
"Blueberry Muffin": "https://images.unsplash.com/photo-1604908554165-7c6c0f8a1e58",
"Croissant": "https://images.unsplash.com/photo-1509440159596-0249088772ff",
"Brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",

"Spaghetti Bolognese": "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
"Penne Arrabbiata": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
"Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
"Pizza Romana": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",

"Crunchy Taco": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
"Bean Burrito": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
"Nachos": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
"Quesadilla": "https://images.unsplash.com/photo-1617196038435-68b2b5d9f1d3",
"Churros": "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",

"Chicken Shawarma": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
"Falafel": "https://images.unsplash.com/photo-1598515213692-5f1e1f6a5c8d",
"Hummus with Pita": "https://images.unsplash.com/photo-1604909053197-7b63f1f6e9f0",
"Mutton Kebab": "https://images.unsplash.com/photo-1544025162-d76694265947",
"Baklava": "https://images.unsplash.com/photo-1600891964092-4316c288032e",
"Italian Garlic Bread": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
}

counts = collections.Counter(image_map.values())
dups = [k for k, v in counts.items() if v > 1]
for url in dups:
    items = [k for k, v in image_map.items() if v == url]
    print(f"Duplicate URL {url}: {items}")
