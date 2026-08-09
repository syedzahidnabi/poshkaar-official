{
  "name": "Address",
  "type": "object",
  "properties": {
    "label": {
      "type": "string",
      "enum": [
        "Home",
        "Work",
        "Other"
      ],
      "default": "Home"
    },
    "full_name": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "address_line_1": {
      "type": "string"
    },
    "address_line_2": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "state": {
      "type": "string"
    },
    "pincode": {
      "type": "string"
    },
    "country": {
      "type": "string",
      "default": "India"
    },
    "is_default": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "full_name",
    "phone",
    "address_line_1",
    "city",
    "state",
    "pincode"
  ]
}