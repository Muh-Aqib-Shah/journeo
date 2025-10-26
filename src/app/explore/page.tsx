import TripCard from '@/components/explore/explore-card';
import SearchBar from '@/components/explore/search-bar';

export default function Explore() {
  const dummyData = Array(6).fill({
    img: '/placeholder_location.png',
    title: 'Exclusice Seoul 8-day Trip',
    desc: 'enjoy a beautiful vacation in the vibrant city of seoul, get lost in the culture of blossom',
    providerName: 'Chris Nolan',
    duration: {
      from: 1721478234,
      to: 1722167509,
    },
  });

  return (
    <div className="container space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl font-semibold">Explore Trips</h2>
        <div className="text-center">
          Find trips created by other users and get inspired for your next
          vacation
        </div>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dummyData &&
          dummyData.map((elem) => (
            <TripCard
              img={elem.img}
              title={elem.title}
              desc={elem.desc}
              providerName={elem.providerName}
              duration={elem.duration}
              key={elem.title}
            />
          ))}
      </div>
    </div>
  );
}
