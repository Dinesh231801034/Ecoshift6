"""
Ecoinvent product mapping data and utilities
"""
from typing import Dict, List, Tuple, Optional


# Ecoinvent process mappings for common product categories
ECOINVENT_MAPPINGS = {
    # Food & Beverages
    'food': {
        'organic_food': {
            'code': 'organic_food_production',
            'name': 'organic food production, at farm',
            'category': 'Food',
            'unit': 'kg',
            'default_impact': 0.5  # kg CO2-eq per kg
        },
        'beverage_bottle': {
            'code': 'bottle_PET_500ml',
            'name': 'bottle, PET, 500ml, at plant',
            'category': 'Packaging',
            'unit': 'item',
            'default_impact': 0.1  # kg CO2-eq per bottle
        },
        'glass_bottle': {
            'code': 'bottle_glass_500ml',
            'name': 'bottle, glass, 500ml, at plant',
            'category': 'Packaging',
            'unit': 'item',
            'default_impact': 0.15  # kg CO2-eq per bottle
        }
    },
    
    # Textiles & Clothing
    'textiles': {
        'cotton_tshirt': {
            'code': 'textile_cotton_tshirt',
            'name': 'textile, cotton, t-shirt, at plant',
            'category': 'Textiles',
            'unit': 'item',
            'default_impact': 2.5  # kg CO2-eq per t-shirt
        },
        'organic_cotton_tshirt': {
            'code': 'textile_organic_cotton_tshirt',
            'name': 'textile, organic cotton, t-shirt, at plant',
            'category': 'Textiles',
            'unit': 'item',
            'default_impact': 1.8  # kg CO2-eq per t-shirt
        },
        'polyester_tshirt': {
            'code': 'textile_polyester_tshirt',
            'name': 'textile, polyester, t-shirt, at plant',
            'category': 'Textiles',
            'unit': 'item',
            'default_impact': 3.2  # kg CO2-eq per t-shirt
        },
        'jeans': {
            'code': 'textile_cotton_jeans',
            'name': 'textile, cotton, jeans, at plant',
            'category': 'Textiles',
            'unit': 'item',
            'default_impact': 8.0  # kg CO2-eq per jeans
        }
    },
    
    # Electronics
    'electronics': {
        'led_bulb': {
            'code': 'lamp_LED_10W',
            'name': 'lamp, LED, 10W, at plant',
            'category': 'Electronics',
            'unit': 'item',
            'default_impact': 0.5  # kg CO2-eq per bulb
        },
        'smartphone': {
            'code': 'smartphone_production',
            'name': 'smartphone, at plant',
            'category': 'Electronics',
            'unit': 'item',
            'default_impact': 55.0  # kg CO2-eq per smartphone
        },
        'laptop': {
            'code': 'laptop_production',
            'name': 'laptop computer, at plant',
            'category': 'Electronics',
            'unit': 'item',
            'default_impact': 200.0  # kg CO2-eq per laptop
        },
        'tablet': {
            'code': 'tablet_production',
            'name': 'tablet computer, at plant',
            'category': 'Electronics',
            'unit': 'item',
            'default_impact': 80.0  # kg CO2-eq per tablet
        }
    },
    
    # Home & Garden
    'home_garden': {
        'bamboo_toothbrush': {
            'code': 'toothbrush_bamboo',
            'name': 'toothbrush, bamboo, at plant',
            'category': 'Personal Care',
            'unit': 'item',
            'default_impact': 0.05  # kg CO2-eq per toothbrush
        },
        'bamboo_cutlery': {
            'code': 'cutlery_bamboo',
            'name': 'cutlery, bamboo, at plant',
            'category': 'Home & Garden',
            'unit': 'item',
            'default_impact': 0.1  # kg CO2-eq per set
        },
        'plastic_toothbrush': {
            'code': 'toothbrush_plastic',
            'name': 'toothbrush, plastic, at plant',
            'category': 'Personal Care',
            'unit': 'item',
            'default_impact': 0.1  # kg CO2-eq per toothbrush
        },
        'reusable_bag': {
            'code': 'bag_cotton_reusable',
            'name': 'bag, cotton, reusable, at plant',
            'category': 'Packaging',
            'unit': 'item',
            'default_impact': 0.3  # kg CO2-eq per bag
        },
        'reusable_bottle': {
            'code': 'bottle_reusable_glass',
            'name': 'bottle, reusable, glass, at plant',
            'category': 'Food & Beverages',
            'unit': 'item',
            'default_impact': 0.2  # kg CO2-eq per bottle
        },
        'plastic_bag': {
            'code': 'bag_plastic_single_use',
            'name': 'bag, plastic, single-use, at plant',
            'category': 'Packaging',
            'unit': 'item',
            'default_impact': 0.02  # kg CO2-eq per bag
        }
    },
    
    # Personal Care
    'personal_care': {
        'shampoo_bar': {
            'code': 'shampoo_bar_organic',
            'name': 'shampoo, bar, organic, at plant',
            'category': 'Personal Care',
            'unit': 'item',
            'default_impact': 0.2  # kg CO2-eq per bar
        },
        'liquid_shampoo': {
            'code': 'shampoo_liquid_plastic_bottle',
            'name': 'shampoo, liquid, plastic bottle, at plant',
            'category': 'Personal Care',
            'unit': 'item',
            'default_impact': 0.4  # kg CO2-eq per bottle
        },
        'sunscreen_organic': {
            'code': 'sunscreen_organic',
            'name': 'sunscreen, organic, at plant',
            'category': 'Personal Care',
            'unit': 'item',
            'default_impact': 0.3  # kg CO2-eq per tube
        },
        'sunscreen_conventional': {
            'code': 'sunscreen_conventional',
            'name': 'sunscreen, conventional, at plant',
            'category': 'Personal Care',
            'unit': 'item',
            'default_impact': 0.5  # kg CO2-eq per tube
        }
    },
    
    # Cleaning Products
    'cleaning': {
        'eco_detergent': {
            'code': 'detergent_eco_friendly',
            'name': 'detergent, eco-friendly, at plant',
            'category': 'Cleaning',
            'unit': 'item',
            'default_impact': 0.8  # kg CO2-eq per bottle
        },
        'conventional_detergent': {
            'code': 'detergent_conventional',
            'name': 'detergent, conventional, at plant',
            'category': 'Cleaning',
            'unit': 'item',
            'default_impact': 1.2  # kg CO2-eq per bottle
        },
        'bamboo_sponge': {
            'code': 'sponge_bamboo',
            'name': 'sponge, bamboo, at plant',
            'category': 'Cleaning',
            'unit': 'item',
            'default_impact': 0.1  # kg CO2-eq per sponge
        },
        'plastic_sponge': {
            'code': 'sponge_plastic',
            'name': 'sponge, plastic, at plant',
            'category': 'Cleaning',
            'unit': 'item',
            'default_impact': 0.2  # kg CO2-eq per sponge
        }
    }
}


# Product category to ecoinvent mapping rules
CATEGORY_MAPPING_RULES = {
    'Food & Beverages': {
        'keywords': ['food', 'beverage', 'drink', 'snack', 'organic', 'natural'],
        'default_mapping': 'organic_food',
        'subcategory_mappings': {
            'bottles': 'beverage_bottle',
            'glass': 'glass_bottle',
            'organic': 'organic_food'
        }
    },
    'Clothing & Textiles': {
        'keywords': ['clothing', 'textile', 'shirt', 'dress', 'cotton', 'organic cotton'],
        'default_mapping': 'cotton_tshirt',
        'subcategory_mappings': {
            'organic': 'organic_cotton_tshirt',
            'polyester': 'polyester_tshirt',
            'jeans': 'jeans'
        }
    },
    'Electronics': {
        'keywords': ['electronics', 'phone', 'laptop', 'tablet', 'led', 'bulb'],
        'default_mapping': 'led_bulb',
        'subcategory_mappings': {
            'smartphone': 'smartphone',
            'laptop': 'laptop',
            'tablet': 'tablet',
            'led': 'led_bulb'
        }
    },
    'Home & Garden': {
        'keywords': ['home', 'garden', 'toothbrush', 'bag', 'bamboo', 'reusable', 'cutlery', 'bottle'],
        'default_mapping': 'bamboo_toothbrush',
        'subcategory_mappings': {
            'toothbrush': 'bamboo_toothbrush',
            'bag': 'reusable_bag',
            'bamboo': 'bamboo_toothbrush',
            'cutlery': 'bamboo_cutlery',
            'bottle': 'reusable_bottle'
        }
    },
    'Personal Care': {
        'keywords': ['personal', 'care', 'shampoo', 'sunscreen', 'beauty', 'skincare'],
        'default_mapping': 'shampoo_bar',
        'subcategory_mappings': {
            'shampoo': 'shampoo_bar',
            'sunscreen': 'sunscreen_organic',
            'organic': 'shampoo_bar'
        }
    },
    'Cleaning Products': {
        'keywords': ['cleaning', 'detergent', 'sponge', 'eco', 'green'],
        'default_mapping': 'eco_detergent',
        'subcategory_mappings': {
            'detergent': 'eco_detergent',
            'sponge': 'bamboo_sponge',
            'eco': 'eco_detergent'
        }
    }
}


def get_ecoinvent_mapping(product_name: str, category: str, subcategory: str = '', 
                         tags: List[str] = None, is_eco_friendly: bool = True) -> Optional[Dict]:
    """
    Get ecoinvent mapping for a product based on its attributes
    
    Args:
        product_name: Name of the product
        category: Product category
        subcategory: Product subcategory
        tags: List of product tags
        is_eco_friendly: Whether the product is eco-friendly
        
    Returns:
        Dictionary with ecoinvent mapping data or None
    """
    if not tags:
        tags = []
    
    # Convert to lowercase for matching
    product_name_lower = product_name.lower()
    category_lower = category.lower()
    subcategory_lower = subcategory.lower()
    tags_lower = [tag.lower() for tag in tags]
    
    # Direct product name matching first
    if 'bamboo' in product_name_lower and 'cutlery' in product_name_lower:
        return ECOINVENT_MAPPINGS['home_garden']['bamboo_cutlery']
    elif 'bamboo' in product_name_lower and 'toothbrush' in product_name_lower:
        return ECOINVENT_MAPPINGS['home_garden']['bamboo_toothbrush']
    elif 'cotton' in product_name_lower and 'tote' in product_name_lower:
        return ECOINVENT_MAPPINGS['home_garden']['reusable_bag']
    elif 'reusable' in product_name_lower and 'bottle' in product_name_lower:
        return ECOINVENT_MAPPINGS['home_garden']['reusable_bottle']
    
    # Find matching category
    matched_category = None
    for cat_name, cat_data in CATEGORY_MAPPING_RULES.items():
        if any(keyword in category_lower for keyword in cat_data['keywords']):
            matched_category = cat_name
            break
    
    if not matched_category:
        return None
    
    # Get category data
    cat_data = CATEGORY_MAPPING_RULES[matched_category]
    
    # Try subcategory mapping first
    mapping_key = None
    for sub_key, map_key in cat_data['subcategory_mappings'].items():
        if (sub_key in subcategory_lower or 
            sub_key in product_name_lower or 
            any(sub_key in tag for tag in tags_lower)):
            mapping_key = map_key
            break
    
    # Try keyword matching in product name and tags
    if not mapping_key:
        for sub_key, map_key in cat_data['subcategory_mappings'].items():
            if sub_key in product_name_lower or any(sub_key in tag for tag in tags_lower):
                mapping_key = map_key
                break
    
    # Use default mapping if no specific match found
    if not mapping_key:
        mapping_key = cat_data['default_mapping']
    
    # Get the actual ecoinvent data
    category_mappings = ECOINVENT_MAPPINGS.get(matched_category.lower().replace(' & ', '_').replace(' ', '_'))
    if not category_mappings:
        return None
    
    ecoinvent_data = category_mappings.get(mapping_key)
    if not ecoinvent_data:
        return None
    
    # Adjust for eco-friendly products (reduce impact by 20-30%)
    if is_eco_friendly and 'organic' not in mapping_key and 'eco' not in mapping_key:
        ecoinvent_data = ecoinvent_data.copy()
        ecoinvent_data['default_impact'] *= 0.75  # 25% reduction for eco-friendly
    
    return ecoinvent_data


def create_ecoinvent_processes():
    """
    Create ecoinvent process records in the database
    """
    from .models import EcoInventProcess
    
    created_count = 0
    updated_count = 0
    
    for category, mappings in ECOINVENT_MAPPINGS.items():
        for mapping_key, data in mappings.items():
            process, created = EcoInventProcess.objects.get_or_create(
                code=data['code'],
                defaults={
                    'name': data['name'],
                    'category': data['category'],
                    'subcategory': category,
                    'unit': data['unit'],
                    'description': f"Ecoinvent process for {data['name']}",
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
            else:
                # Update existing record
                process.name = data['name']
                process.category = data['category']
                process.subcategory = category
                process.unit = data['unit']
                process.is_active = True
                process.save()
                updated_count += 1
    
    return created_count, updated_count


def create_benchmarks():
    """
    Create benchmark records for EcoScore normalization
    """
    from .models import EcoScoreBenchmark
    
    benchmarks_data = [
        {
            'category': 'Food & Beverages',
            'subcategory': '',
            'benchmark_impact': 2.0,  # kg CO2-eq per kg
            'benchmark_unit': 'kg CO2-eq/kg',
            'description': 'Average impact for food products',
            'source': 'EU PEF Category Rules'
        },
        {
            'category': 'Clothing & Textiles',
            'subcategory': '',
            'benchmark_impact': 5.0,  # kg CO2-eq per item
            'benchmark_unit': 'kg CO2-eq/item',
            'description': 'Average impact for clothing items',
            'source': 'Fashion Revolution Report'
        },
        {
            'category': 'Electronics',
            'subcategory': '',
            'benchmark_impact': 50.0,  # kg CO2-eq per item
            'benchmark_unit': 'kg CO2-eq/item',
            'description': 'Average impact for electronic devices',
            'source': 'Green Electronics Council'
        },
        {
            'category': 'Home & Garden',
            'subcategory': '',
            'benchmark_impact': 1.0,  # kg CO2-eq per item
            'benchmark_unit': 'kg CO2-eq/item',
            'description': 'Average impact for home products',
            'source': 'Home Improvement Industry'
        },
        {
            'category': 'Personal Care',
            'subcategory': '',
            'benchmark_impact': 0.5,  # kg CO2-eq per item
            'benchmark_unit': 'kg CO2-eq/item',
            'description': 'Average impact for personal care products',
            'source': 'Personal Care Industry'
        },
        {
            'category': 'Cleaning Products',
            'subcategory': '',
            'benchmark_impact': 1.5,  # kg CO2-eq per item
            'benchmark_unit': 'kg CO2-eq/item',
            'description': 'Average impact for cleaning products',
            'source': 'Cleaning Industry Association'
        }
    ]
    
    created_count = 0
    updated_count = 0
    
    for benchmark_data in benchmarks_data:
        benchmark, created = EcoScoreBenchmark.objects.get_or_create(
            category=benchmark_data['category'],
            subcategory=benchmark_data['subcategory'],
            defaults=benchmark_data
        )
        
        if created:
            created_count += 1
        else:
            # Update existing benchmark
            for key, value in benchmark_data.items():
                setattr(benchmark, key, value)
            benchmark.save()
            updated_count += 1
    
    return created_count, updated_count
