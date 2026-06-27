// app/product-feed.xml/route.ts

import { products } from "@/data/products";

export async function GET() {
  const xmlItems = products
    .map((p) => {
      const priceNumber = (p.price || "").replace(/[^0-9.]/g, "");

      return `
      <item>
        <g:id>${p.id}</g:id>
        <g:title><![CDATA[${p.name}]]></g:title>
        <g:description><![CDATA[${p.description || ""}]]></g:description>

        <g:link>
          https://www.poshkaarkashmir.com/product/${p.id}
        </g:link>

        <g:image_link>
          https://www.poshkaarkashmir.com${p.image}
        </g:image_link>

        <g:price>${priceNumber} INR</g:price>

        <g:availability>${
          p.stockStatus === "sold-out" ? "out of stock" : "in stock"
        }</g:availability>

        <g:brand>Poshkaar Kashmir</g:brand>
        <g:condition>new</g:condition>
        <g:google_product_category>1604</g:google_product_category>
      </item>
      `;
    })
    .join("");

  const xml = `
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <title>Poshkaar Kashmir Product Feed</title>
        <link>https://www.poshkaarkashmir.com</link>
        <description>Handcrafted Kashmiri couture – Product Feed</description>
        ${xmlItems}
      </channel>
    </rss>
  `.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
