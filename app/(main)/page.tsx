import Footer from "@/components/footer";
import LandingPage from "@/components/home/landing-page";

export default function Home() {
  return (
    <div className="bg-white">
      <main>
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
