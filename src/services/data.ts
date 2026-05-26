export const CATEGORIES = [
  "All Posts",
  "Experiences",
  "Mistakes",
  "Ground Reality",
  "Reality Check",
  "Embarrassing",
];

export interface Post {
  id: string;
  title: string;
  teaser: string;
  content?: string;
  category: string;
  price: number;
  created_at: string;
  creator_id: string;
  is_anonymous: boolean;
  author_name?: string;
  author_avatar?: string;
}

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "I quit my $150k job to build a startup. Here's exactly what I lost.",
    teaser: "Everyone tells you about the glorious freedom of entrepreneurship. Nobody tells you about the anxiety that hits at 3 AM when you realize your runway is down to 3 months and you haven't found product-market fit...",
    content: "Everyone tells you about the glorious freedom of entrepreneurship. Nobody tells you about the anxiety that hits at 3 AM when you realize your runway is down to 3 months and you haven't found product-market fit.\n\nI used to have a predictable paycheck. Now, I have a predictable panic attack every Sunday night. My relationships have suffered because I'm always \"on.\" Even when I'm physically present, mentally I'm turning over the latest metric or bug report.\n\nThe hardest part isn't the work volume, it's the sheer weight of decision fatigue. When you're an employee, someone else ultimately decides the strategy. As a founder, every wrong turn is entirely your fault.",
    category: "Reality Check",
    price: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    is_anonymous: false,
    author_name: "Sarah Jenkins",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah"
  },
  {
    id: "2",
    title: "The biggest mistake I made in my 20s was saving too much money.",
    teaser: "I know how contradictory this sounds. I saved 60% of my income from age 22 to 29. Did I hit my financial goals? Yes. Did I miss out on trips, experiences, and a social life that I can never get back? Also yes.",
    content: "I know how contradictory this sounds. I saved 60% of my income from age 22 to 29. Did I hit my financial goals? Yes. Did I miss out on trips, experiences, and a social life that I can never get back? Also yes.\n\nWhile my friends were backpacking through Europe or staying out late and forming bonds that last a lifetime, I was tracking pennies on a spreadsheet. Now I'm in my 30s with a solid net worth, but I feel like I'm playing catch-up on how to be a human being.",
    category: "Mistakes",
    price: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    is_anonymous: false,
    author_name: "Michael Chen",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael"
  },
  {
    id: "3",
    title: "How an embarrassing presentation actually got me promoted.",
    teaser: "I was presenting our Q3 strategy to the board. Five minutes in, I knocked over a full cup of coffee onto the CFO's laptop. It was dead immediately. What I did next changed the trajectory of my entire career...",
    content: "I was presenting our Q3 strategy to the board. Five minutes in, I knocked over a full cup of coffee onto the CFO's laptop. It was dead immediately. What I did next changed the trajectory of my entire career.\n\nInstead of panicking, I took a deep breath, apologized sincerely once, and then shifted completely. I walked over to the whiteboard and drew the entire strategy from memory. The disruption actually broke the stiff corporate energy in the room. The executives started chiming in, and it turned from a boring slide presentation into a collaborative brainstorm.\n\nTwo months later, the CEO brought me into his office and offered me a Director position because he \"wanted someone who could handle complete chaos with a steady hand.\"",
    category: "Embarrassing",
    price: 49,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    is_anonymous: false,
    author_name: "Jessica Walsh",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica"
  },
  {
    id: "4",
    title: "The ground reality of living as a digital nomad in Bali",
    teaser: "Instagram shows you laptops on the beach and aesthetic acai bowls. The reality is dealing with visa runs, random power outages, terrible internet when you need it most, and an overwhelming sense of isolation.",
    content: "Instagram shows you laptops on the beach and aesthetic acai bowls. The reality is dealing with visa runs, random power outages, terrible internet when you need it most, and an overwhelming sense of isolation.\n\nDon't get me wrong, the sunsets are beautiful. But nobody talks about the transient nature of friendships here. Everyone you meet leaves in 3 months. You're constantly introducing yourself, constantly having the same \"where are you from\" conversations, and rarely building deep connections.",
    category: "Ground Reality",
    price: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    creator_id: "00000000-0000-0000-0000-000000000000",
    is_anonymous: true,
  },
  {
    id: "5",
    title: "I spent 10 years climbing the corporate ladder only to realize it was leaning against the wrong wall.",
    teaser: "I finally got the VP title I thought I wanted. The day I got it, I went home and cried. Not tears of joy. I realized I absolutely despised the industry I was in, but the golden handcuffs were too tight to leave.",
    content: "I finally got the VP title I thought I wanted. The day I got it, I went home and cried. Not tears of joy. I realized I absolutely despised the industry I was in, but the golden handcuffs were too tight to leave.\n\nIf you're in your 20s, my biggest advice is to optimize for learning and alignment with your core values, not just title progression. The title feels great for exactly 48 hours, and then you have to actually do the job every single day.",
    category: "Experiences",
    price: 99,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    is_anonymous: false,
    author_name: "David R.",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David"
  }
];
