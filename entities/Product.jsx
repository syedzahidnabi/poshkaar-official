{
  "name": "Product",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "slug": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "short_description": {
      "type": "string"
    },
    "price": {
      "type": "number"
    },
    "compare_at_price": {
      "type": "number"
    },
    "currency": {
      "type": "string",
      "default": "INR"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      }
    },
    "category": {
      "type": "string",
      "enum": [
        "Shawls",
        "Kurtis",
        "Sarees",
        "Suits",
        "Bridal",
        "Pashmina",
        "Stoles",
        "Kaftans",
        "Jackets"
      ]
    },
    "collection": {
      "type": "string",
      "enum": [
        "New Arrivals",
        "Best Sellers",
        "Wedding Collection",
        "Heritage Collection",
        "Festive Edit",
        "Everyday Luxury"
      ]
    },
    "embroidery_type": {
      "type": "string",
      "enum": [
        "Sozni",
        "Tilla",
        "Aari",
        "Papier M\u00e2ch\u00e9",
        "Crewel",
        "Chain Stitch"
      ]
    },
    "fabric": {
      "type": "string",
      "enum": [
        "Pashmina",
        "Silk",
        "Wool",
        "Cotton",
        "Velvet",
        "Georgette",
        "Cashmere"
      ]
    },
    "colors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "sizes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "in_stock": {
      "type": "boolean",
      "default": true
    },
    "stock_quantity": {
      "type": "number",
      "default": 10
    },
    "is_featured": {
      "type": "boolean",
      "default": false
    },
    "is_bestseller": {
      "type": "boolean",
      "default": false
    },
    "rating": {
      "type": "number",
      "default": 4.5
    },
    "review_count": {
      "type": "number",
      "default": 0
    },
    "care_instructions": {
      "type": "string"
    },
    "crafting_time": {
      "type": "string"
    },
    "origin": {
      "type": "string",
      "default": "Kashmir, India"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "title",
    "price",
    "category"
  ]
}