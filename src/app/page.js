import Header from '@/features/home/components/Header';
import About from '@/features/home/components/About';
import Map from '@/features/home/components/InteractiveMap';
// import Announcement from '@/features/home/components/Announcement';
import Navbar from '@/components/shared/Navbar';
import Chatbot from '@/features/chat/components/Chatbot';
import IntroVideoSection from '@/components/shared/IntroVideoModal';
// import GoogleFor from '@/components/shared/GoogleFormEmbed';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Header />
      {/* <GoogleFor /> */}
      <About />
      <IntroVideoSection />
      <Map />
      <Chatbot />
      {/* <Announcement /> */}
    </div>
  );
}
