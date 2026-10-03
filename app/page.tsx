import { NetworkHero } from "@/components/brand/NetworkHero";
import { getHome } from "@/lib/content";

export default async function Home() {
  const home = await getHome();
  return <NetworkHero hero={home.hero} />;
}
