{
  "name": "Order",
  "type": "object",
  "properties": {
    "order_number": {
      "type": "string"
    },
    "customer_name": {
      "type": "string"
    },
    "customer_email": {
      "type": "string",
      "format": "email"
    },
    "customer_phone": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned"
      ],
      "default": "pending"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product_id": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "price": {
            "type": "number"
          },
          "quantity": {
            "type": "number"
          },
          "size": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "image": {
            "type": "string"
          }
        }
      }
    },
    "subtotal": {
      "type": "number"
    },
    "shipping": {
      "type": "number"
    },
    "discount": {
      "type": "number",
      "default": 0
    },
    "total": {
      "type": "number"
    },
    "coupon_code": {
      "type": "string"
    },
    "shipping_address": {
      "type": "object",
      "properties": {
        "full_name": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
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
        }
      }
    },
    "payment_method": {
      "type": "string"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "paid",
        "failed",
        "refunded"
      ],
      "default": "pending"
    },
    "payment_id": {
      "type": "string"
    },
    "payment_details": {
      "type": "object"
    },
    "gift_wrapping": {
      "type": "boolean",
      "default": false
    },
    "gift_message": {
      "type": "string"
    },
    "notes": {
      "type": "string",
      "rls": {
        "read": {
          "user_condition": {
            "role": "admin"
          }
        },
        "write": {
          "user_condition": {
            "role": "admin"
          }
        }
      }
    },
    "tracking_number": {
      "type": "string"
    },
    "estimated_delivery": {
      "type": "string"
    },
    "confirmation_email_sent_at": {
      "type": "string",
      "format": "date-time"
    },
    "admin_notification_sent_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "items",
    "total",
    "customer_email"
  ],
  "rls": {
    "create": true,
    "read": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "data.customer_email": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
