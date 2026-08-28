export interface GoogleReview {
  name: string;
  initials: string;
  color: string;
  rating: number; // 1..5
  when: string;
  text: string;
}

export const GOOGLE_RATING = 3.7;
export const GOOGLE_REVIEW_COUNT = 413;

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: 'Priya Raghavan',
    initials: 'PR',
    color: '#087ea4',
    rating: 5,
    when: '2 weeks ago',
    text: 'Stayed in a couple room for our anniversary. Room was clean, the bed comfortable and hot water worked all night. Walking distance to Lovedale station and the front desk was very helpful.',
  },
  {
    name: 'Arun Kumar',
    initials: 'AK',
    color: '#a9801d',
    rating: 4,
    when: 'a month ago',
    text: 'Good budget stay near Coonoor Road. Rooms are basic but well maintained, and parking is available on site. Handy base for a short Ooty trip. Would come again.',
  },
  {
    name: 'Sneha & Vikram',
    initials: 'SV',
    color: '#0a7d33',
    rating: 5,
    when: '3 weeks ago',
    text: 'Booked the family room for four of us. Spacious with a separate dining area and the kids loved the view. Staff arranged an early check-in when we called ahead.',
  },
  {
    name: 'Mohammed Irfan',
    initials: 'MI',
    color: '#8a3ffc',
    rating: 3,
    when: '2 months ago',
    text: 'Location is convenient and close to the toy train. Room was okay for the price, though the AC took a while to cool. Reception staff were polite.',
  },
  {
    name: 'Lakshmi Narayan',
    initials: 'LN',
    color: '#c0392b',
    rating: 4,
    when: 'a month ago',
    text: 'Peaceful area away from the crowded Ooty market. Got a couple room on the upper floor, nice and quiet, bathroom clean. Wifi was a little slow in the evening.',
  },
  {
    name: 'Deepak Menon',
    initials: 'DM',
    color: '#6f6650',
    rating: 2,
    when: '3 months ago',
    text: 'Ground-floor room smelled slightly damp on arrival but they moved us after we asked. Hot water was fine. Not much of a view from the lower rooms.',
  },
  {
    name: 'Ananya Iyer',
    initials: 'AI',
    color: '#087ea4',
    rating: 5,
    when: '1 week ago',
    text: 'Lovely quiet stay. The team was warm, checked us in quickly and gave good directions for local sightseeing. Room was tidy and the blankets were thick and warm.',
  },
  {
    name: 'Rahul Sharma',
    initials: 'RS',
    color: '#a9801d',
    rating: 4,
    when: '2 months ago',
    text: 'Decent rooms, honest pricing, and reception is open 24 hours which helped as our bus reached late. Close to Love Dale Junction. Good for a no-fuss stay.',
  },
  {
    name: 'Fathima Beevi',
    initials: 'FB',
    color: '#0a7d33',
    rating: 3,
    when: 'a month ago',
    text: 'Clean enough and staff were courteous. The weekend rate is a bit high for what you get, but the family room was comfortable for the three of us.',
  },
  {
    name: 'Karthik Subramanian',
    initials: 'KS',
    color: '#c0392b',
    rating: 1,
    when: '4 months ago',
    text: 'Our booking got confused and we waited a while at the desk. The room itself was fine once sorted, and they apologised and adjusted the bill.',
  },
  {
    name: 'Neha Gupta',
    initials: 'NG',
    color: '#8a3ffc',
    rating: 5,
    when: '3 weeks ago',
    text: 'Great value near Coonoor Road. Room was spotless, the water heater strong, and on-site parking made it easy with our car. Staff even booked a cab to Doddabetta.',
  },
  {
    name: 'Sanjay Pillai',
    initials: 'SP',
    color: '#6f6650',
    rating: 4,
    when: '2 months ago',
    text: 'Simple, clean and well located for exploring Lovedale and the tea estates. Rooms are compact but everything worked. Would stay here again.',
  },
];
