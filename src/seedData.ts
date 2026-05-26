import { createExperience } from './services/db';
import { supabase } from './lib/supabase';

const DUMMY_POSTS = [
  {
    title: "Why I stopped using frameworks and went back to vanilla JS",
    teaser: "It sounded crazy, but removing React from my personal site taught me more about the web than my last 3 years of building apps.",
    content: "It sounded crazy, but removing React from my personal site taught me more about the web than my last 3 years of building apps.\\n\\nI realized how much of my knowledge was framework-specific rather than platform-specific. I had to re-learn DOM APIs, event delegation, and state management without hooks. The result? A site that loads in 50ms and a much deeper appreciation for what browsers can do out of the box.",
    category: "Experiences",
    price: 0,
    is_anonymous: false,
    author_name: "Alex Dev",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex"
  },
  {
    title: "I accidentally deleted production database and survived",
    teaser: "A classic dropped-the-wrong-table story, but with a twist on how blameless culture actually works in practice.",
    content: "Yes, I dropped the production users table. No, I didn't get fired.\\n\\nThe panic that sets in when you run a command and immediately realize you forgot the WHERE clause is indescribable. But our team's response was incredible. Within 5 minutes, we had the backup restoring. Within 30 minutes, we were fully recovered. We then spent 2 hours writing a post-mortem to change our tooling so nobody (including me) could ever make that mistake again.",
    category: "Embarrassing",
    price: 0,
    is_anonymous: true,
  },
  {
    title: "The harsh reality of building a SaaS solo",
    teaser: "If you think you're going to code 80% of the time, think again. Marketing, support, and sales will eat your soul.",
    content: "If you think you're going to code 80% of the time, think again. I spend maybe 20% of my time writing code now.\\n\\nThe rest is answering customer support emails, tweaking landing page copy, scrolling through Twitter trying to figure out marketing, and managing server costs. Solo founder life means you are the CFO, CMO, and CTO. It is exhausting and definitely not for everyone.",
    category: "Reality Check",
    price: 5,
    is_anonymous: false,
    author_name: "Startup Dave",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Dave"
  },
  {
    title: "My failed attempt at living completely off-grid for a month",
    teaser: "I thought it would bring me peace. Instead, I just got really, really bored and missed my microwave.",
    content: "I rented a cabin with no internet, no electricity, and no cell service. I brought books, a journal, and non-perishable food.\\n\\nDay 1 was magical. Day 2 was relaxing. Day 3 I started talking to a squirrel. By Day 7, I couldn't stop thinking about checking my email. We romanticize the idea of disconnecting, but we've fundamentally rewired our brains to need constant stimulation. Also, chopping wood is significantly harder than YouTube makes it look.",
    category: "Mistakes",
    price: 0,
    is_anonymous: false,
    author_name: "Sam H.",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sam"
  },
  {
    title: "What happens when you go viral on TikTok",
    teaser: "10 million views in 24 hours. The dopamine hit is real, but the aftermath is surprisingly hollow.",
    content: "My video about a weird spreadsheet trick blew up. 10 million views. 100k new followers overnight.\\n\\nThe sudden influx of attention was exhilarating for exactly one day. Then the pressure set in. 'What do I post next?' 'Will it flop?' I spent weeks trying to chase that high again, creating content I didn't even care about. True freedom is creating without worrying about the algorithm.",
    category: "Experiences",
    price: 0,
    is_anonymous: false,
    author_name: "Data Nerd",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nerd"
  },
  {
    title: "The unspoken rule of networking events",
    teaser: "Everyone is just as awkward as you are. Once you realize this, everything changes.",
    content: "I used to stand in the corner at networking events, pretending to text.\\n\\nThen I realized: 90% of the people there are also praying someone comes up to talk to them. So I just started walking up to people standing alone and saying, 'I know no one here, can I stand with you?' It works every single time. Vulnerability is the ultimate icebreaker.",
    category: "Ground Reality",
    price: 0,
    is_anonymous: false,
    author_name: "Emily R.",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emily"
  },
  {
    title: "I spent $5,000 on a mastermind group. Was it worth it?",
    teaser: "The short answer is yes, but not for the reasons the guru promised on the sales page.",
    content: "I didn't learn any secret tactics. I didn't get a magic formula.\\n\\nWhat I got was a room full of people who were playing the game at a higher level than me. Just being around them recalibrated what I considered 'normal' effort and 'normal' results. The real value of these groups is paying for a standard-upgrade, not secret knowledge.",
    category: "Reality Check",
    price: 15,
    is_anonymous: false,
    author_name: "Growth Hacker",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Growth"
  },
  {
    title: "How I ruined a perfectly good friendship by starting a business together",
    teaser: "We thought being best friends meant we'd be great co-founders. We were very, very wrong.",
    content: "We never signed a vesting agreement because 'we trust each other.' We never defined roles clearly because 'we'll just figure it out.'\\n\\nWhen things got hard, our different working styles caused immense friction. Because we were friends, we avoided hard conversations until they exploded. The business failed, and unfortunately, the friendship didn't survive the fallout. If you partner with a friend, paper it up like you're partnering with a stranger.",
    category: "Mistakes",
    price: 0,
    is_anonymous: true,
  },
  {
    title: "The day I realized the 'Senior' title is largely meaningless",
    teaser: "I met a Junior engineer with 2 years of experience who completely ran circles around me.",
    content: "I had 8 years of experience and the 'Senior' title. Then we hired a kid fresh out of a bootcamp.\\n\\nHe didn't just know syntax; he understood systems. He asked 'why' before he asked 'how'. He wrote tests without being asked. It humbled me deeply and made me realize that years of experience is just a measure of time, not a measure of competence.",
    category: "Reality Check",
    price: 0,
    is_anonymous: false,
    author_name: "Code Veteran",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Veteran"
  },
  {
    title: "I accidentally CC'd the entire company instead of BCC",
    teaser: "A simple email about an upcoming surprise party turned into a company-wide reply-all nightmare.",
    content: "To the 4,000 employees of my former company: I am deeply sorry for the ensuing 'Please remove me from this list' thread that lasted 3 days.\\n\\nThe worst part wasn't the mistake itself; it was the fact that our email server crashed due to the sheer volume of cascading replies. I had to personally apologize to the IT director while he was trying to restart the servers.",
    category: "Embarrassing",
    price: 0,
    is_anonymous: true,
  },
  {
    title: "Remote work isn't for everyone, and that's okay",
    teaser: "After two years of working from my kitchen table, I begged to go back to an office.",
    content: "My mental health plummeted. The boundaries between 'home' and 'work' completely dissolved.\\n\\nI found myself answering Slack messages at 10 PM because my laptop was just sitting there on the table. The lack of casual, unstructured interactions with coworkers made the job feel entirely transactional. Going back to a hybrid schedule saved my sanity.",
    category: "Ground Reality",
    price: 0,
    is_anonymous: false,
    author_name: "Office Lover",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Office"
  },
  {
    title: "I turned down a $200k job offer to backpack through South America",
    teaser: "Everyone called me crazy. My parents were terrified. It was the best decision of my life.",
    content: "The money was alluring, but I realized I was only taking the job because it felt like the 'right' next step on a predetermined path.\\n\\nSpending 6 months living out of a backpack taught me how little I actually need to be happy. I met incredible people, learned functional Spanish, and came back with a clarity about my career that no corporate retreat could have ever provided. The job will always be there; your youth won't be.",
    category: "Experiences",
    price: 0,
    is_anonymous: false,
    author_name: "Wanderlust",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Wanderlust"
  },
  {
    title: "The hidden costs of 'free' tools in a startup",
    teaser: "We bootstrapped our entire stack using free tiers. Then we hit scale, and the bill came due all at once.",
    content: "We thought we were being thrifty by stringing together 15 different free-tier services.\\n\\nBut when our traffic spiked, every single service triggered a paywall at the exact same time. Not only did our monthly costs go from $0 to $1,200 instantly, but we spent weeks dealing with rate limits and migrating off tools that didn't scale. Sometimes, paying for a robust tool from day one is the cheapest option.",
    category: "Mistakes",
    price: 10,
    is_anonymous: false,
    author_name: "SaaS Founder",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Founder"
  },
  {
    title: "I thought I was an introvert until I found my people",
    teaser: "For 25 years, I thought I simply didn't like socializing. Turns out, I just didn't like surface-level small talk.",
    content: "I always felt drained after parties and assumed I was a hardcore introvert.\\n\\nThen I joined a local club centered around a highly specific niche interest. Suddenly, I was staying out until 2 AM deep in conversation, feeling completely energized. Introversion and extraversion are often just context-dependent. If you feel drained around people, maybe you're just around the wrong people.",
    category: "Reality Check",
    price: 0,
    is_anonymous: false,
    author_name: "Not An Introvert",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Not"
  },
  {
    title: "My screen froze mid-sneeze during a Zoom interview",
    teaser: "The worst possible face immortalized on screen for a full two minutes while the panel watched in silence.",
    content: "It wasn't a cute sneeze. It was a full-face-contortion, eyes-bulging, mid-explosion sneeze.\\n\\nThe internet cut out right at the peak of the face. I reconnected two minutes later to find the three interviewers struggling to contain their laughter. I didn't get the job, presumably because they couldn't look at me without remembering that face.",
    category: "Embarrassing",
    price: 0,
    is_anonymous: true,
  },
  {
    title: "The truth about pursuing your passion as a career",
    teaser: "I loved baking, so I opened a bakery. Now I hate baking.",
    content: "When you monetize your passion, it stops being a passion and starts being a job.\\n\\nI used to bake to relieve stress. Now, baking is the source of my stress. I have to wake up at 3 AM, manage inventory, deal with angry customers, and worry about margins. The actual act of baking is maybe 10% of the job. Keep your hobbies as hobbies.",
    category: "Ground Reality",
    price: 0,
    is_anonymous: false,
    author_name: "Former Baker",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Baker"
  },
  {
    title: "I ignored my health for 'the grind' and ended up in the ER",
    teaser: "Hustle culture tells you to sleep when you're dead. My body decided to almost grant that wish prematurely.",
    content: "I was working 80-hour weeks, fueling myself on energy drinks and takeout. I proudly called it 'the grind.'\\n\\nThen my heart started doing funny things. I ended up in the ER with severe palpitations and exhaustion. The doctor told me I had the stress levels of an executive twice my age. I took two weeks off, and guess what? The company didn't collapse. 'The grind' is a scam.",
    category: "Mistakes",
    price: 0,
    is_anonymous: false,
    author_name: "Recovering Workaholic",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Recovering"
  },
  {
    title: "Why I will never buy a fixer-upper house again",
    teaser: "HGTV completely lied to us. Renovating a house while living in it is a unique form of psychological torture.",
    content: "We thought it would be fun. 'Sweat equity!' we said.\\n\\nLiving with drywall dust in your cereal for six months is not fun. Finding out the plumbing is cursed is not fun. Fighting with your spouse over tile grout colors at Home Depot on a Sunday morning is not fun. Unless you are a contractor, buy the turnkey house.",
    category: "Experiences",
    price: 0,
    is_anonymous: false,
    author_name: "DIY Regret",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Regret"
  },
  {
    title: "The myth of 'passive income'",
    teaser: "I spent hundreds of hours building an online course for 'passive income.' Then came the customer support tickets.",
    content: "There is nothing passive about passive income. \\n\\nYou either work hard upfront building the asset, or you work hard constantly maintaining the asset. My 'passive' course required weekly updates, answering student questions, fielding refund requests, and fighting off pirates. It's just a different type of active income.",
    category: "Ground Reality",
    price: 5,
    is_anonymous: false,
    author_name: "Realist",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Realist"
  },
  {
    title: "Walking out of a bad movie taught me about the Sunk Cost Fallacy",
    teaser: "I had paid $15 for the ticket. The movie was terrible after 20 minutes. Why was it so hard to leave?",
    content: "I sat there for another hour, actively miserable, just because I had already spent the money.\\n\\nOnce I finally got up and left, the relief was instantaneous. The money was gone either way, but I had reclaimed my time. I realize now how often I apply this to bad books, bad projects, and even bad relationships. The ability to walk away from a sunk cost is a superpower.",
    category: "Reality Check",
    price: 0,
    is_anonymous: false,
    author_name: "Cinephile",
    author_avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Cinephile"
  }
];

export async function seedDatabaseIfEmpty() {
  const isSeeded = localStorage.getItem('dummy_data_seeded');
  if (isSeeded === 'true') {
    return;
  }
  
  if (!supabase) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("Must be logged in to seed Supabase dummy data.");
      return; 
    }

    const userId = session.user.id;

    for (const post of DUMMY_POSTS) {
      const postId = Math.random().toString(36).substring(2, 10);
      const now = new Date();
      // randomize created_at a little to sort properly
      now.setHours(now.getHours() - Math.floor(Math.random() * 72));
      
      const p = {
        ...post,
        created_at: now.toISOString(),
        creator_id: userId,
      };
      
      await createExperience(p, postId);
    }
    console.log("Successfully seeded 20 dummy posts into Supabase!");
    localStorage.setItem('dummy_data_seeded', 'true');
  } catch (err) {
    console.error("Failed to seed dummy posts:", err);
  }
}
