import os
import django
import random
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from restaurants.models import Restaurant, Category, MenuItem

def seed_database():
    print("Clearing existing data...")
    MenuItem.objects.all().delete()
    Restaurant.objects.all().delete()
    Category.objects.all().delete()

    print("Creating categories...")
    categories = [
        Category.objects.create(name="Pizza", image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"),
        Category.objects.create(name="Burger", image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"),
        Category.objects.create(name="Biryani", image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80"),
        Category.objects.create(name="Healthy", image_url="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80"),
        Category.objects.create(name="Desserts", image_url="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80"),
        Category.objects.create(name="Beverages", image_url="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80"),
    ]

    pizza_cat, burger_cat, biryani_cat, healthy_cat, dessert_cat, bev_cat = categories

    print("Creating real-world restaurants...")
    restaurants_data = [
        {
            "name": "OvenStory Pizza",
            "description": "Standout pizzas with unique cheese bases.",
            "address": "123 Main St, Tech Park",
            "phone_number": "9876543210",
            "rating": 4.3,
            "delivery_time": "30-40 min",
            "cost_for_two": 600,
            "tags": "Pizzas, Fast Food, Italian",
            "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
            "is_open": True,
            "items": [
                {"name": "Margherita Pizza", "desc": "Classic cheese and tomato base.", "price": "249.00", "veg": True, "cat": pizza_cat, "img": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80"},
                {"name": "Pepperoni Burst", "desc": "Loaded with spicy pepperoni.", "price": "499.00", "veg": False, "cat": pizza_cat, "img": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80"},
                {"name": "Paneer Tikka Pizza", "desc": "Indian fusion pizza.", "price": "399.00", "veg": True, "cat": pizza_cat, "img": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"},
                {"name": "Garlic Breadsticks", "desc": "Freshly baked with cheese dip.", "price": "149.00", "veg": True, "cat": pizza_cat, "img": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80"},
            ]
        },
        {
            "name": "Behrouz Biryani",
            "description": "The Royal Biryani experience.",
            "address": "45 King's Avenue, Old City",
            "phone_number": "9876543211",
            "rating": 4.5,
            "delivery_time": "45-55 min",
            "cost_for_two": 800,
            "tags": "Biryani, Mughlai, North Indian",
            "image_url": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
            "is_open": True,
            "items": [
                {"name": "Murgh Makhani Biryani", "desc": "Rich butter chicken layered with rice.", "price": "399.00", "veg": False, "cat": biryani_cat, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80"},
                {"name": "Zaikedaar Paneer Biryani", "desc": "Spiced paneer chunks with aromatic rice.", "price": "349.00", "veg": True, "cat": biryani_cat, "img": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80"},
                {"name": "Mutton Gosht Biryani", "desc": "Slow-cooked tender mutton biryani.", "price": "549.00", "veg": False, "cat": biryani_cat, "img": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80"},
                {"name": "Gulab Jamun (2 pcs)", "desc": "Classic Indian sweet.", "price": "99.00", "veg": True, "cat": dessert_cat, "img": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"},
            ]
        },
        {
            "name": "Burger King",
            "description": "Home of the Whopper.",
            "address": "Mall Road, City Center",
            "phone_number": "9876543212",
            "rating": 4.1,
            "delivery_time": "20-30 min",
            "cost_for_two": 400,
            "tags": "Burgers, Fast Food, American",
            "image_url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
            "is_open": True,
            "items": [
                {"name": "Veg Whopper", "desc": "Signature flame-grilled veg patty.", "price": "179.00", "veg": True, "cat": burger_cat, "img": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80"},
                {"name": "Chicken Whopper", "desc": "Classic chicken flame-grilled burger.", "price": "199.00", "veg": False, "cat": burger_cat, "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"},
                {"name": "Crispy Veg Double", "desc": "Double patty for double fun.", "price": "149.00", "veg": True, "cat": burger_cat, "img": "https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&q=80"},
                {"name": "French Fries", "desc": "Crispy golden salted fries.", "price": "109.00", "veg": True, "cat": burger_cat, "img": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80"},
            ]
        },
        {
            "name": "FreshBowl Salads",
            "description": "Healthy and nutritious bowls.",
            "address": "Green Avenue, West End",
            "phone_number": "9876543213",
            "rating": 4.6,
            "delivery_time": "25-35 min",
            "cost_for_two": 500,
            "tags": "Healthy, Salads, Diet",
            "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
            "is_open": True,
            "items": [
                {"name": "Caesar Salad", "desc": "Crisp lettuce, croutons, and parmesan.", "price": "249.00", "veg": True, "cat": healthy_cat, "img": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80"},
                {"name": "Grilled Chicken Bowl", "desc": "Protein-packed bowl with veggies.", "price": "349.00", "veg": False, "cat": healthy_cat, "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"},
                {"name": "Quinoa Power Bowl", "desc": "Superfood bowl with avocado.", "price": "299.00", "veg": True, "cat": healthy_cat, "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"},
                {"name": "Detox Green Juice", "desc": "Fresh pressed spinach, apple, celery.", "price": "149.00", "veg": True, "cat": bev_cat, "img": "https://images.unsplash.com/photo-1610970881699-44a5587ce572?w=400&q=80"},
            ]
        }
    ]

    for r_data in restaurants_data:
        rest = Restaurant.objects.create(
            name=r_data["name"],
            description=r_data["description"],
            address=r_data["address"],
            phone_number=r_data["phone_number"],
            rating=Decimal(str(r_data["rating"])),
            delivery_time=r_data["delivery_time"],
            cost_for_two=r_data["cost_for_two"],
            tags=r_data["tags"],
            image_url=r_data["image_url"],
            is_open=r_data["is_open"]
        )
        for item in r_data["items"]:
            MenuItem.objects.create(
                restaurant=rest,
                category=item["cat"],
                name=item["name"],
                description=item["desc"],
                price=Decimal(item["price"]),
                is_veg=item["veg"],
                is_available=True,
                image_url=item["img"]
            )
            
    print(f"Successfully seeded {len(restaurants_data)} restaurants!")

if __name__ == '__main__':
    seed_database()
