// components/Seo.tsx
import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  keywords?: string[];
};

export default function Seo({ title, description, canonical, image, keywords }: Props) {
  const site = "https://poshkaarkashmir.com";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={canonical ?? site} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
