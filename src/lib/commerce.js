export const FREE_SHIPPING_THRESHOLD = 15000;
export const STANDARD_SHIPPING_COST = 500;
export const GIFT_WRAP_COST = 299;

function getStockLimit(value) {
  if (value === null || value === undefined || value === '') return null;
  const stock = Number(value);
  return Number.isFinite(stock) && stock >= 0 ? stock : null;
}

export function getCartItemKey(item) {
  return `${item.product_id}-${item.size || ''}-${item.color || ''}`;
}

export function addCartItem(items, product, size = '', color = '', quantity = 1) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const key = `${product.id}-${size || ''}-${color || ''}`;
  const existing = items.find((item) => getCartItemKey(item) === key);
  const productStock = getStockLimit(product.stock_quantity);

  if (productStock === 0) return items;

  if (existing) {
    const stockLimit = getStockLimit(existing.stock_quantity) ?? productStock;
    return items.map((item) => (
      getCartItemKey(item) === key
        ? {
            ...item,
            quantity: stockLimit === null
              ? item.quantity + safeQuantity
              : Math.min(stockLimit, item.quantity + safeQuantity),
          }
        : item
    ));
  }

  return [
    ...items,
    {
      product_id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      compare_at_price: Number(product.compare_at_price) || 0,
      image: product.image || '',
      size,
      color,
      quantity: productStock === null ? safeQuantity : Math.min(productStock, safeQuantity),
      category: product.category,
      stock_quantity: productStock,
    },
  ];
}

export function updateCartItemQuantity(items, productId, size, color, quantity) {
  const key = `${productId}-${size || ''}-${color || ''}`;
  const safeQuantity = Number(quantity) || 0;

  if (safeQuantity <= 0) {
    return items.filter((item) => getCartItemKey(item) !== key);
  }

  return items.map((item) => (
    getCartItemKey(item) === key
      ? {
          ...item,
          quantity: getStockLimit(item.stock_quantity) === null
            ? safeQuantity
            : Math.min(getStockLimit(item.stock_quantity), safeQuantity),
        }
      : item
  ));
}

export function removeCartItem(items, productId, size, color) {
  const key = `${productId}-${size || ''}-${color || ''}`;
  return items.filter((item) => getCartItemKey(item) !== key);
}

export function calculateCartSubtotal(items) {
  return items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
}

export function calculateCheckoutTotals(items, giftWrap = false) {
  const subtotal = calculateCartSubtotal(items);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const giftWrapping = giftWrap ? GIFT_WRAP_COST : 0;

  return {
    subtotal,
    shipping,
    giftWrapping,
    total: subtotal + shipping + giftWrapping,
  };
}
