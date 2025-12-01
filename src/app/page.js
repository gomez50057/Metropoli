import Header from '@/components/home/Header';
import About from '@/components/home/About';
import Slider from '@/components/home/Slider';
import Map from '@/components/home/InteractiveMap';
// import Announcement from '@/components/home/Announcement';
import Navbar from '@/components/shared/Navbar';
import Chatbot from '@/components/chat/Chatbot';
import IntroVideoModal from '../components/shared/IntroVideoModal';
// import GoogleFor from '../components/shared/GoogleFormEmbed';

export default function Home() {
  return (
    <div>
      <Navbar />
      <IntroVideoModal />
      <Header />
      {/* <GoogleFor /> */}
      <About />
      <Slider />
      <Map />
      <Chatbot />
      {/* <Announcement /> */}
    </div>
  );
}
