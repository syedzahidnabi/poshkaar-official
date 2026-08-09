import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STATIC_ROUTE_META = {
  "/login": ["Sign in | Poshkaar Kashmir", "Sign in to manage your Poshkaar account."],
  "/register": ["Create an account | Poshkaar Kashmir", "Create a Poshkaar account for a faster checkout."],
  "/forgot-password": ["Reset password | Poshkaar Kashmir", "Request a secure password reset link."],
  "/reset-password": ["Choose a new password | Poshkaar Kashmir", "Choose a new password for your Poshkaar account."],
  "/checkout": ["Secure checkout | Poshkaar Kashmir", "Complete delivery and payment details for your order."],
  "/order-success": ["Order confirmed | Poshkaar Kashmir", "Your Poshkaar order has been received."],
  "/account": ["Your account | Poshkaar Kashmir", "View your Poshkaar account and orders."],
  "/wishlist": ["Saved pieces | Poshkaar Kashmir", "View pieces saved to your wishlist."],
  "/search": ["Search | Poshkaar Kashmir", "Search the Poshkaar catalogue."],
  "/admin": ["Catalogue administration | Poshkaar Kashmir", "Manage verified catalogue records."],
  "/admin/catalog": ["Catalogue administration | Poshkaar Kashmir", "Manage verified catalogue records."],
  "/admin/orders": ["Order administration | Poshkaar Kashmir", "Manage customer orders."],
};

function focusElement(element) {
  if (!element) return;
  const hadTabIndex = element.hasAttribute("tabindex");
  if (!hadTabIndex) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  if (!hadTabIndex) {
    element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
  }
}

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const meta = STATIC_ROUTE_META[pathname];
    if (meta) {
      document.title = meta[0];
      const description = document.head.querySelector('meta[name="description"]');
      description?.setAttribute("content", meta[1]);
      const canonical = document.head.querySelector('link[rel="canonical"]');
      canonical?.setAttribute("href", `${window.location.origin}${pathname}`);
    }

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        const target = document.getElementById(id);
        target?.scrollIntoView({ behavior: "smooth" });
        focusElement(target);
      }, 50);
      return () => window.clearTimeout(timer);
    }

    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    const timer = window.setTimeout(() => focusElement(document.getElementById("main-content")), 0);
    return () => window.clearTimeout(timer);
  }, [pathname, hash, navigationType]);

  return null;
}
