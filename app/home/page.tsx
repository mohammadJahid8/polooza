import HeroSection from './_components/hero-section';
import ScheduleSection from './_components/schedule-section';
import RsvpSection from './_components/rsvp-section';
import MusicSection from './_components/music-section';
import TransportSection from './_components/transport-section';
import NeedToKnowSection from './_components/need-to-know-section';
import ChaptersSection from './_components/chapters-section';
import MemoriesSection from './_components/memories-section';
import UpdatesSection from './_components/updates-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ScheduleSection />
      <RsvpSection />
      <MusicSection />
      <TransportSection />
      <NeedToKnowSection />
      <MemoriesSection />
      <ChaptersSection />
      <UpdatesSection />
    </>
  );
}
