// data/testimonialsData.ts
export interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    text: string;
    date: string;
  }
  
  export const testimonialsData: Testimonial[] = [
    {
      id: 1,
      name: 'Daniel Lewis',
      avatar: '/assets/images/avatar-1.png',
      text: 'Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.',
      date: '14 June, 2021'
    },
    {
      id: 2,
      name: 'Jessica Miller',
      avatar: '/assets/images/avatar-2.png',
      text: 'Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.',
      date: '15 July, 2021'
    },
    // Add other testimonials here
  ];