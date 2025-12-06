export const trip = {
  location: {
    city: 'Karachi',
    country: 'Pakistan',
  },
  from: 1672531200,
  to: 1673059200,
  itinerary: [
    {
      date: 1672531200,
      activities: [
        {
          time: {
            start: 1672534800,
            end: 1672542000,
          },
          location: 'Clifton Beach',
          description: 'Morning walk on the beach.',
        },
        {
          time: {
            start: 1672552800,
            end: 1672560000,
          },
          location: 'Dolmen Mall',
          description: 'Shopping at the mall.',
        },
      ],
    },
    {
      date: 1672617600,
      activities: [
        {
          time: {
            start: 1672621200,
            end: 1672628400,
          },
          location: "Quaid's Mausoleum",
          description: 'Visit to the mausoleum.',
        },
        {
          time: {
            start: 1672632000,
            end: 1672639200,
          },
          location: 'National Museum of Pakistan',
          description: 'Exploring the museum.',
        },
      ],
    },
    {
      date: 1672704000,
      activities: [
        {
          time: {
            start: 1672707600,
            end: 1672714800,
          },
          location: 'Karachi Zoo',
          description: 'Visit to the zoo.',
        },
        {
          time: {
            start: 1672725600,
            end: 1672732800,
          },
          location: 'Frere Hall',
          description: 'Tour of Frere Hall.',
        },
      ],
    },
    {
      date: 1672790400,
      activities: [
        {
          time: {
            start: 1672794000,
            end: 1672801200,
          },
          location: 'Mohatta Palace',
          description: 'Tour of Mohatta Palace.',
        },
        {
          time: {
            start: 1672812000,
            end: 1672819200,
          },
          location: 'Karachi Port Trust Building',
          description: 'Visit to the port trust building.',
        },
      ],
    },
    {
      date: 1672876800,
      activities: [
        {
          time: {
            start: 1672880400,
            end: 1672887600,
          },
          location: 'Manora Island',
          description: 'Day trip to Manora Island.',
        },
        {
          time: {
            start: 1672902000,
            end: 1672909200,
          },
          location: 'PAF Museum',
          description: 'Visit to the PAF Museum.',
        },
      ],
    },
    {
      date: 1672963200,
      activities: [
        {
          time: {
            start: 1672966800,
            end: 1672974000,
          },
          location: 'Seaview Beach',
          description: 'Morning at Seaview Beach.',
        },
        {
          time: {
            start: 1672984800,
            end: 1672992000,
          },
          location: 'Port Grand',
          description: 'Afternoon at Port Grand.',
        },
      ],
    },
  ],
};

export const travelModeOption = [
  {
    mode: 'car',
    linkToRoute: '/#',
    time: 5,
  },
  {
    mode: 'bus',
    linkToRoute: '/#',
    time: 10,
  },
  {
    mode: 'bike',
    linkToRoute: '/#',
    time: 20,
  },
  {
    mode: 'walk',
    linkToRoute: '/#',
    time: 40,
  },
];
