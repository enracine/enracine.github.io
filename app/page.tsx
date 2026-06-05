import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar />
      <Hero />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20">
        <Studio />
      </main>
      <Footer />
    </div>
  );
}
