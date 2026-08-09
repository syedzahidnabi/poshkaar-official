{
  "name": "Review",
  "type": "object",
  "properties": {
    "product_id": {
      "type": "string"
    },
    "rating": {
      "type": "number"
    },
    "title": {
      "type": "string"
    },
    "body": {
      "type": "string"
    },
    "author_name": {
      "type": "string"
    },
    "verified_purchase": {
      "type": "boolean",
      "default": false
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      }
    }
  },
  "required": [
    "product_id",
    "rating"
  ]
}