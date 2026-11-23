/**
 * Blog articles about ARY dramas and watching them. Rendered by
 * app/blog/[slug]/page.tsx; each post also gets a generated cover image.
 *
 * Editorial rule: only state facts that are well established (title, lead
 * cast, approximate year, channel). No ratings, view counts or air dates
 * that can't be checked - wrong facts cost trust and rankings.
 */

export interface PostSection {
  h2: string;
  body: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  /** <title>; brand is appended automatically. */
  metaTitle: string;
  description: string;
  excerpt: string;
  category: "Drama lists" | "Drama guides" | "Watching tips";
  /** ISO date, used for sorting and schema. */
  date: string;
  /** Short words drawn on the generated cover. */
  coverKicker: string;
  sections: PostSection[];
  faqs?: { q: string; a: string }[];
  /** Guide or downloader link shown at the end. */
  cta?: { href: string; label: string };
  /** Comma-separated SEO keywords (first = main keyword). */
  keywords?: string;
}

export const posts: Post[] = [
  {
    slug: "top-rated-ary-dramas-2026",
    title: "Top-Rated ARY Dramas of 2026: The Ratings Leaders Ranked",
    metaTitle: "Top-Rated ARY Dramas of 2026 - Highest TRP List",
    description:
      "The top-rated ARY Digital dramas of 2026 by reported TRPs - Kafeel, Doctor Bahu, Bas Tera Saath Ho, Dar-e-Nijaat and Sharpasand - with cast and where to watch.",
    excerpt:
      "Kafeel, Doctor Bahu and Bas Tera Saath Ho led the 2026 ratings. Here are ARY's highest-rated dramas this year, who stars in them and how to watch every episode.",
    category: "Drama lists",
    date: "2026-11-24",
    coverKicker: "TOP RATED",
    keywords: "top rated ARY dramas 2026, highest TRP Pakistani dramas 2026, best ARY dramas 2026, ARY drama ratings, most watched ARY dramas",
    sections: [
      {
        h2: "How we ranked them",
        body: [
          "TRP (television rating points) figures for Pakistani dramas are published unofficially and change week to week, so treat the numbers below as reported snapshots rather than an official league table. We combined those reports with how much each drama was discussed and watched online in 2026.",
        ],
      },
      {
        h2: "1. Kafeel",
        body: [
          "Kafeel aired on ARY Digital from December 2025 to April 2026 and was reported to top the TRP charts week after week, often above 12 TRPs. Sanam Saeed leads as Zeba, a mother of four, with Emmad Irfani opposite her. It was directed by Meesam Naqvi and produced by Fahad Mustafa and Dr Ali Kazmi's Big Bang Entertainment, and most sources credit Umera Ahmed as the writer.",
        ],
      },
      {
        h2: "2. Doctor Bahu",
        body: [
          "Mehreen Jabbar's Doctor Bahu premiered in March 2026 and one ratings report placed it at the top of ongoing dramas with around 11.5 TRPs. Kubra Khan plays a young doctor who marries into a family of medical professionals, opposite Shuja Asad, with Saba Hameed and Hajra Yamin in standout supporting roles.",
        ],
      },
      {
        h2: "3. Bas Tera Saath Ho",
        body: [
          "Farhan Saeed and Sana Javed lead this emotional drama as Anas and Ansa. Launched in May 2026 and reported at around 11.3 TRPs, it was written by the late Saira Raza and directed by Qasim Ali Mureed. The first episode opened with a tribute to its writer.",
        ],
      },
      {
        h2: "4. Dar-e-Nijaat",
        body: [
          "Umera Ahmed's spiritual romance premiered on 1 August 2026 with Sheheryar Munawar, Durefishan Saleem and Nameer Nawaz Khan. Its original soundtrack even topped a major Spotify playlist, a sign of how widely the drama is followed.",
        ],
      },
      {
        h2: "5. Sharpasand",
        body: [
          "Nauman Ijaz's chilling turn as the manipulative neighbour Farasat Ali, opposite Hareem Farooq, kept Sharpasand in the conversation across more than 50 episodes.",
        ],
      },
      {
        h2: "Watch the top-rated ARY dramas offline",
        body: [
          "All of these dramas stream on ARY Plus. To binge them without buffering, search the drama on ARYPlusD, open the full episode list and download several episodes at the same time - free, with no sign-in, in any quality up to 4K Ultra HD when available.",
        ],
      },
    ],
    faqs: [
      { q: "Which ARY drama has the highest TRP in 2026?", a: "Reports put Kafeel, Doctor Bahu and Bas Tera Saath Ho at the top of the 2026 ratings, with Kafeel often reported above 12 TRPs." },
      { q: "Where can I watch the top-rated ARY dramas?", a: "On ARY Plus and ARY Digital's official YouTube channel. You can also download free episodes with ARYPlusD to watch offline." },
    ],
    cta: { href: "/", label: "Download top-rated ARY dramas free" },
  },
  {
    slug: "kafeel-ary-drama-cast-story",
    title: "Kafeel ARY Drama: Cast, Story and Where to Watch",
    metaTitle: "Kafeel ARY Drama - Cast, Story & All Episodes",
    description:
      "Kafeel on ARY Digital: Sanam Saeed and Emmad Irfani lead this top-rated drama directed by Meesam Naqvi. Cast, story, crew and how to download all episodes free.",
    excerpt:
      "Sanam Saeed's return as Zeba, a mother of four, made Kafeel one of the biggest ARY hits of 2026. Here is everything to know.",
    category: "Drama guides",
    date: "2026-11-24",
    coverKicker: "DRAMA GUIDE",
    keywords: "Kafeel ARY drama, Kafeel cast, Kafeel drama story, Kafeel all episodes, Sanam Saeed Kafeel",
    sections: [
      {
        h2: "What is Kafeel about?",
        body: [
          "Kafeel is a family drama built around trust, responsibility and deception. Sanam Saeed plays Zeba, a mother of four, and the story follows how the people she depends on - and who depend on her - are tested. Sanam Saeed said in interviews that the writer convinced her to take on a role so different from her usual characters.",
        ],
      },
      {
        h2: "Kafeel cast",
        body: [],
        list: [
          "Sanam Saeed - Zeba",
          "Emmad Irfani",
          "Kashif Mehmood",
          "Munazza Arif",
          "Hassaan Khan",
          "Aashir Wajahat (joined later in the run)",
        ],
      },
      {
        h2: "Who made Kafeel?",
        body: [
          "Kafeel was directed by Meesam Naqvi and produced by Fahad Mustafa and Dr Ali Kazmi under Big Bang Entertainment. Most sources credit Umera Ahmed as the writer. It aired on ARY Digital from December 2025 to April 2026.",
        ],
      },
      {
        h2: "Was Kafeel a hit?",
        body: [
          "Yes. Ratings round-ups in spring 2026 reported Kafeel consistently at or near the top of the TRP charts, with huge episode views online.",
        ],
      },
      {
        h2: "How to watch and download Kafeel",
        body: [
          "Kafeel is available on ARY Plus. Search Kafeel on ARYPlusD to see every episode, then download as many as you like - three at the same time - in any available quality, free and without signing in.",
        ],
      },
    ],
    faqs: [
      { q: "Who plays the lead in Kafeel?", a: "Sanam Saeed plays Zeba, opposite Emmad Irfani." },
      { q: "Who directed Kafeel?", a: "Meesam Naqvi directed Kafeel; it was produced by Fahad Mustafa and Dr Ali Kazmi's Big Bang Entertainment." },
    ],
    cta: { href: "/", label: "Download all Kafeel episodes" },
  },
  {
    slug: "bas-tera-saath-ho-ary-drama",
    title: "Bas Tera Saath Ho: Cast, Story and the Late Writer Saira Raza",
    metaTitle: "Bas Tera Saath Ho ARY Drama - Cast & Story",
    description:
      "Bas Tera Saath Ho on ARY Digital: Farhan Saeed and Sana Javed as Anas and Ansa, written by the late Saira Raza and directed by Qasim Ali Mureed. Cast and episodes.",
    excerpt:
      "Farhan Saeed and Sana Javed's emotional ARY drama, and the writer it was dedicated to. Cast, crew and how to watch every episode.",
    category: "Drama guides",
    date: "2026-11-23",
    coverKicker: "DRAMA GUIDE",
    keywords: "Bas Tera Saath Ho, Bas Tera Saath Ho cast, Bas Tera Sath Ho ARY drama, Farhan Saeed Sana Javed drama, Saira Raza",
    sections: [
      {
        h2: "About Bas Tera Saath Ho",
        body: [
          "Bas Tera Saath Ho (also spelled Bas Tera Sath Ho) is an ARY Digital drama that launched in May 2026. Farhan Saeed plays Anas and Sana Javed plays Ansa Jameel in a story about love, hardship and standing by each other. Farhan Saeed has spoken about how the cruelty his character faces affected him personally.",
        ],
      },
      {
        h2: "A tribute to Saira Raza",
        body: [
          "The drama was written by Saira Raza, who passed away in June 2025. The first episode opened with an emotional tribute to her, and many viewers watched it as a farewell to one of the industry's respected writers.",
        ],
      },
      {
        h2: "Bas Tera Saath Ho cast and crew",
        body: [],
        list: [
          "Farhan Saeed - Anas",
          "Sana Javed - Ansa Jameel",
          "Zoya Nasir",
          "Shagufta Ejaz",
          "Faran Tahir",
          "Haris Waheed",
          "Director: Qasim Ali Mureed",
        ],
      },
      {
        h2: "Ratings",
        body: [
          "One ratings round-up placed Bas Tera Saath Ho among the top two ongoing dramas of 2026, at around 11.3 TRPs. The serial has since concluded.",
        ],
      },
      {
        h2: "Watch every episode offline",
        body: [
          "Search Bas Tera Saath Ho on ARYPlusD to list all episodes and download several at once - free, no sign-in, in any quality the episode is published in.",
        ],
      },
    ],
    faqs: [
      { q: "Who wrote Bas Tera Saath Ho?", a: "The late Saira Raza; the drama opened with a tribute to her." },
      { q: "Who are the leads in Bas Tera Saath Ho?", a: "Farhan Saeed as Anas and Sana Javed as Ansa Jameel." },
    ],
    cta: { href: "/", label: "Download Bas Tera Saath Ho episodes" },
  },
  {
    slug: "upcoming-ary-dramas-rutba-izzat",
    title: "Upcoming ARY Dramas: Rutba and Izzat - Cast and First Look",
    metaTitle: "Upcoming ARY Dramas 2026 - Rutba & Izzat",
    description:
      "New ARY dramas coming soon: Umera Ahmed's Rutba with Hiba Qadir and Talha Chahour, and Izzat with Merub Ali and Atabik Mohsin. Cast, writers and teasers.",
    excerpt:
      "Two new ARY Digital dramas have fans talking after their teasers: Umera Ahmed's Rutba and the family drama Izzat. Here is what we know.",
    category: "Drama lists",
    date: "2026-11-22",
    coverKicker: "COMING SOON",
    keywords: "upcoming ARY dramas, new ARY dramas 2026, Rutba ARY drama, Izzat ARY drama, ARY drama teaser",
    sections: [
      {
        h2: "Rutba",
        body: [
          "Rutba is written by Umera Ahmed and directed by Haseeb Hassan. Hiba Qadir and Talha Chahour lead the cast, and their chemistry in the teaser drew praise from fellow stars including Maya Ali and Yumna Zaidi. Reports also name Ali Tahir, Zahid Ahmed and Irsa Ghazal in the cast. The story begins with a bond built on respect and asks what happens when that responsibility is lost.",
        ],
      },
      {
        h2: "Izzat",
        body: [
          "Izzat's teaser arrived in September 2026 and left fans intrigued. The ensemble includes Merub Ali, Atabik Mohsin, Hashaam Khan, Nadia Hussain Khan and Saleem Sheikh.",
        ],
      },
      {
        h2: "When do they air?",
        body: [
          "ARY Digital announces exact start dates and time slots close to launch. Follow ARY's official channels for the schedule - and once episodes are on ARY Plus, you can download them with ARYPlusD.",
        ],
      },
    ],
    faqs: [
      { q: "Who wrote Rutba?", a: "Rutba is written by Umera Ahmed and directed by Haseeb Hassan." },
      { q: "Who stars in Izzat?", a: "Merub Ali, Atabik Mohsin, Hashaam Khan, Nadia Hussain Khan and Saleem Sheikh." },
    ],
    cta: { href: "/blog/latest-ary-dramas-2026", label: "See the latest ARY dramas" },
  },
  {
    slug: "umera-ahmed-ary-dramas",
    title: "Umera Ahmed's ARY Dramas: Dar-e-Nijaat, Kafeel, Rutba and More",
    metaTitle: "Umera Ahmed Dramas on ARY Digital - Full Guide",
    description:
      "Umera Ahmed's ARY Digital dramas in one place - Dar-e-Nijaat, Kafeel and the upcoming Rutba - plus the classics that made her Pakistan's most-loved drama writer.",
    excerpt:
      "From Peer-e-Kamil to Dar-e-Nijaat, Umera Ahmed's stories shape Pakistani TV. Here are her ARY dramas and where to watch them.",
    category: "Drama lists",
    date: "2026-11-21",
    coverKicker: "WRITER GUIDE",
    keywords: "Umera Ahmed dramas, Umera Ahmed ARY dramas, Umera Ahmed new drama 2026, Dar-e-Nijaat writer, Umera Ahmed Kafeel",
    sections: [
      {
        h2: "Who is Umera Ahmed?",
        body: [
          "Umera Ahmed is one of Pakistan's most popular novelists and screenwriters. Her novel Peer-e-Kamil and dramas such as Zindagi Gulzar Hai made her a household name, and her stories are known for layered characters, moral choices and spiritual themes.",
        ],
      },
      {
        h2: "Dar-e-Nijaat (2026)",
        body: [
          "A spiritual romance directed by Saqib Khan, starring Sheheryar Munawar, Durefishan Saleem and Nameer Nawaz Khan. It premiered on ARY Digital on 1 August 2026.",
        ],
      },
      {
        h2: "Kafeel (2025-2026)",
        body: [
          "Most sources credit Umera Ahmed for Kafeel, the Sanam Saeed and Emmad Irfani drama that was reported to top the 2026 TRP charts. It was directed by Meesam Naqvi.",
        ],
      },
      {
        h2: "Rutba (upcoming)",
        body: [
          "Her next ARY drama, directed by Haseeb Hassan, stars Hiba Qadir and Talha Chahour. The teaser has already drawn praise from fellow actors.",
        ],
      },
      {
        h2: "Watch Umera Ahmed's dramas offline",
        body: [
          "Search any of these titles on ARYPlusD to see every episode and download them free, several at once, in up to 4K where available.",
        ],
      },
    ],
    faqs: [
      { q: "Which ARY dramas are written by Umera Ahmed?", a: "Dar-e-Nijaat (2026) and the upcoming Rutba; most sources also credit her for Kafeel (2025-2026)." },
      { q: "What is Umera Ahmed's most famous work?", a: "Her novel Peer-e-Kamil and the drama Zindagi Gulzar Hai are among her best-known works." },
    ],
    cta: { href: "/blog/dar-e-nijaat-ary-drama-guide", label: "Read the Dar-e-Nijaat guide" },
  },
  {
    slug: "latest-ary-dramas-2026",
    keywords: "latest ARY dramas 2026, new ARY Digital dramas, ARY drama list 2026, Dar-e-Nijaat, Doctor Bahu",
    title: "Latest ARY Dramas 2026: New ARY Digital Dramas to Watch Right Now",
    metaTitle: "Latest ARY Dramas 2026 - New ARY Digital Dramas",
    description:
      "The latest ARY Digital dramas of 2026 - Dar-e-Nijaat, Doctor Bahu, Sharpasand, Mera Ghar and Hey Fam - with cast, story and how to download every episode free in up to 4K.",
    excerpt:
      "Dar-e-Nijaat, Doctor Bahu, Sharpasand, Mera Ghar and Hey Fam: the new ARY dramas everyone is talking about, who stars in them and how to watch.",
    category: "Drama lists",
    date: "2026-11-23",
    coverKicker: "NEW IN 2026",
    sections: [
      {
        h2: "ARY Digital's 2026 line-up at a glance",
        body: [
          "2026 has been a big year for ARY Digital, with a spiritual romance from Umera Ahmed, a Mehreen Jabbar family drama and a gripping thriller about a dangerous neighbour. Here are the newest ARY dramas worth adding to your watch list - and how to download every free episode to watch offline in up to 4K Ultra HD.",
        ],
      },
      {
        h2: "1. Dar-e-Nijaat",
        body: [
          "Written by Umera Ahmed and directed by Saqib Khan, Dar-e-Nijaat premiered on ARY Digital on 1 August 2026. Sheheryar Munawar plays Abu Bakar and Durefishan Saleem plays Zaryab, with Nameer Nawaz Khan, Sania Saeed, Saba Hamid, Faran Tahir and Nadia Afgan in the cast. It is a spiritual romantic drama about love, loss and the courage it takes to forgive.",
        ],
      },
      {
        h2: "2. Doctor Bahu",
        body: [
          "Directed by Mehreen Jabbar and written by Sanam Mehdi Zaryab, Doctor Bahu premiered in March 2026. Kubra Khan plays a young doctor who marries into a family of medical professionals, opposite Shuja Asad. Saba Hameed, Adeel Hussain and Hajra Yamin lead a strong supporting cast, and the drama has been praised for turning the usual daughter-in-law story on its head.",
        ],
      },
      {
        h2: "3. Sharpasand",
        body: [
          "Nauman Ijaz plays Farasat Ali, a manipulative neighbour who threatens the marriage of Sanam, played by Hareem Farooq. Written by Sara Sadain Syed, with Hira Mani and Affan Waheed also in the cast, Sharpasand is a tense drama about toxic personalities and moral conflict, and a long-running serial with dozens of episodes.",
        ],
      },
      {
        h2: "4. Mera Ghar",
        body: [
          "A new family drama announced to premiere on 17 November 2026, starring Shahroz Sabzwari, Uzma Hassan and Zubab Rana, with Behrooz Sabzwari in the supporting cast. A good pick if you love classic joint-family stories.",
        ],
      },
      {
        h2: "5. Hey Fam",
        body: [
          "A fresh ensemble drama with Duaa Zahra, Zaviyar Ejaz and Zarrar Khan, backed by experienced names including Faysal Quraishi, Nauman Masood and Mashal Karim.",
        ],
      },
      {
        h2: "How to watch and download the latest ARY dramas",
        body: [
          "New episodes stream on ARY Plus after they air on TV. To watch offline, search the drama name on ARYPlusD, open it to see every episode, and start downloading several episodes at the same time - free, with no sign-in, in any quality up to 4K when the episode is published in 4K.",
        ],
      },
      {
        h2: "A note on schedules",
        body: [
          "Air days and times can change, especially around Ramadan, Eid and special transmissions. Check ARY Digital's official channels for the current schedule.",
        ],
      },
    ],
    faqs: [
      { q: "What are the latest ARY dramas in 2026?", a: "Dar-e-Nijaat, Doctor Bahu, Sharpasand, Mera Ghar and Hey Fam are among ARY Digital's newest dramas in 2026." },
      { q: "Who stars in Dar-e-Nijaat?", a: "Sheheryar Munawar, Durefishan Saleem and Nameer Nawaz Khan lead the cast. It is written by Umera Ahmed and directed by Saqib Khan." },
      { q: "Can I download the latest ARY dramas in 4K?", a: "Yes - free and without signing in, whenever the episode is published in 4K (2160p). Dar-e-Nijaat episodes, for example, are available in 4K." },
    ],
    cta: { href: "/", label: "Download the latest ARY dramas free" },
  },
  {
    slug: "doctor-bahu-ary-drama-cast-story",
    keywords: "Doctor Bahu ARY drama, Dr Bahu cast, Doctor Bahu story, Kubra Khan drama, Mehreen Jabbar",
    title: "Doctor Bahu ARY Drama: Cast, Story and Where to Watch",
    metaTitle: "Doctor Bahu ARY Drama - Cast, Story & Episodes",
    description:
      "Doctor Bahu on ARY Digital: Mehreen Jabbar's drama with Kubra Khan and Shuja Asad. Full cast, story, writer and how to download every episode free.",
    excerpt:
      "Mehreen Jabbar's Doctor Bahu flips the classic bahu story. Here is the cast, what it is about and how to watch every episode.",
    category: "Drama guides",
    date: "2026-11-21",
    coverKicker: "DRAMA GUIDE",
    sections: [
      {
        h2: "What is Doctor Bahu about?",
        body: [
          "Kubra Khan plays a young doctor who marries into a family of medical professionals. Instead of the usual meek daughter-in-law, Doctor Bahu explores a confident, working woman navigating a demanding household - one of the reasons critics said it subverts the typical bahu trope.",
        ],
      },
      {
        h2: "Doctor Bahu cast",
        body: [],
        list: [
          "Kubra Khan - the title role, a young doctor",
          "Shuja Asad - the male lead",
          "Saba Hameed - Dr. Farheen",
          "Adeel Hussain - Kabir",
          "Alyy Khan - Tauqeer, Kabir's father",
          "Hajra Yamin - in a much-praised supporting role",
        ],
      },
      {
        h2: "Who made it?",
        body: [
          "Doctor Bahu is directed by Mehreen Jabbar - one of Pakistan's most respected drama directors - and written by Sanam Mehdi Zaryab. It premiered on ARY Digital in March 2026.",
        ],
      },
      {
        h2: "Where to watch Doctor Bahu",
        body: [
          "Episodes are available on ARY Plus after they air on ARY Digital. To watch offline, paste an episode link into ARYPlusD or search the drama name, then download one or several episodes at the same time - free and without signing in.",
        ],
      },
    ],
    faqs: [
      { q: "Who is the director of Doctor Bahu?", a: "Mehreen Jabbar. The drama is written by Sanam Mehdi Zaryab." },
      { q: "Who plays Doctor Bahu?", a: "Kubra Khan plays the title role, opposite Shuja Asad." },
    ],
    cta: { href: "/", label: "Download Doctor Bahu episodes" },
  },
  {
    slug: "sharpasand-ary-drama-cast-story",
    keywords: "Sharpasand ARY drama, Sharpasand cast, Shar Pasand drama, Nauman Ijaz drama, Sharpasand all episodes",
    title: "Sharpasand ARY Drama: Nauman Ijaz's Thriller - Cast and Story",
    metaTitle: "Sharpasand ARY Drama - Cast, Story & Episodes",
    description:
      "Sharpasand on ARY Digital: Nauman Ijaz as Farasat Ali opposite Hareem Farooq. Cast, story, writer and how to download all Sharpasand episodes free.",
    excerpt:
      "Nauman Ijaz plays a neighbour you will never forget. Everything to know about Sharpasand - and how to download all of its episodes at once.",
    category: "Drama guides",
    date: "2026-11-19",
    coverKicker: "THRILLER",
    sections: [
      {
        h2: "What is Sharpasand about?",
        body: [
          "Sharpasand (also written Shar Pasand) follows Farasat Ali, a manipulative neighbour whose interference threatens a young couple's marriage. It is a drama about toxic personalities, complex relationships and moral conflict - the kind of slow-burning tension that keeps viewers coming back every week.",
        ],
      },
      {
        h2: "Sharpasand cast",
        body: [],
        list: [
          "Nauman Ijaz - Farasat Ali",
          "Hareem Farooq - Sanam",
          "Hira Mani",
          "Affan Waheed",
          "Nadia Afgan",
        ],
      },
      {
        h2: "Writer",
        body: ["Sharpasand is written by Sara Sadain Syed."],
      },
      {
        h2: "How to download all Sharpasand episodes",
        body: [
          "Sharpasand has dozens of episodes, so downloading them one by one from a link is slow. Instead, open ARYPlusD, choose Search ARY Plus and type Sharpasand. Open the drama to see every episode with its thumbnail and length, then start several episodes - they download at the same time and each one saves to your device automatically. It is free, needs no sign-in, and you can pick any quality the episode is published in.",
        ],
      },
    ],
    faqs: [
      { q: "Who plays Farasat Ali in Sharpasand?", a: "Nauman Ijaz plays Farasat Ali." },
      { q: "Can I download all Sharpasand episodes?", a: "Yes. Search the drama on ARYPlusD to list every episode and download several at the same time, free and without signing in." },
    ],
    cta: { href: "/how-to-use", label: "Watch the step-by-step video" },
  },
  {
    slug: "download-ary-dramas-4k-free-no-sign-in",
    keywords: "download ARY dramas in 4K, ARY drama 4K download free, download ARY dramas without sign in, ARY Plus 4K",
    title: "Download ARY Dramas in 4K Ultra HD - Free, No Sign-in",
    metaTitle: "Download ARY Dramas in 4K Ultra HD Free - No Sign-in",
    description:
      "How to download ARY Plus dramas in 4K Ultra HD for free without signing in. No account, no app, no limit - pick 2160p and save the MP4 to your device.",
    excerpt:
      "Yes, you can download ARY dramas in real 4K Ultra HD - free, with no account and no app. Here is how, and when 4K is worth it.",
    category: "Watching tips",
    date: "2026-11-22",
    coverKicker: "4K ULTRA HD",
    sections: [
      {
        h2: "Free 4K downloads with no sign-in",
        body: [
          "ARYPlusD never asks you to create an account, log in or install anything. Open the site, paste an ARY Plus link or search a drama name, and every quality the episode is published in appears - including 2160p 4K Ultra HD when it is available. Downloads are completely free with no daily limit.",
        ],
      },
      {
        h2: "How to download an ARY drama in 4K",
        body: [],
        list: [
          "Copy the episode link from ARY Plus, or search the drama name on ARYPlusD.",
          "Press Analyze (or open the drama from the search results).",
          "Tap the 2160p tile - it is labelled 4K Ultra HD and marked BEST.",
          "Press Download. The 4K MP4 is saved to your device automatically.",
        ],
      },
      {
        h2: "Which ARY dramas are in 4K?",
        body: [
          "Newer ARY Plus releases are often published in 4K. For example, Dar-e-Nijaat episodes are available in 2160p, 1440p, 1080p, 720p, 480p and 240p. If an episode was not published in 4K, the highest quality it has is shown as the best option instead.",
        ],
      },
      {
        h2: "Is 4K worth it?",
        body: [
          "A 40-minute episode in 4K is about 1.4 GB, compared with about 440 MB in 1080p. 4K is worth it on 4K TVs and large monitors; on phones, 720p or 1080p looks almost identical and saves a lot of space. Every quality tile shows the exact file size before you download, so you can decide.",
        ],
      },
    ],
    faqs: [
      { q: "Is 4K download really free?", a: "Yes. ARYPlusD is free in every quality including 4K, with no sign-in, no subscription and no daily limit." },
      { q: "Do I need to sign in or create an account?", a: "No. There is no login or account of any kind." },
      { q: "Why don't I see a 4K option?", a: "The episode was not published in 4K. ARYPlusD shows every quality that is actually available." },
    ],
    cta: { href: "/", label: "Download in 4K now - free" },
  },
  {
    slug: "best-ary-digital-dramas-of-all-time",
    keywords: "best ARY Digital dramas, top ARY dramas of all time, ARY drama list, Meray Paas Tum Ho, Kabhi Main Kabhi Tum",
    title: "10 Best ARY Digital Dramas of All Time You Must Watch",
    metaTitle: "10 Best ARY Digital Dramas of All Time",
    description:
      "From Meray Paas Tum Ho to Kabhi Main Kabhi Tum: the 10 best ARY Digital dramas ever made, with cast, story and why each one is worth watching.",
    excerpt:
      "The ARY dramas that had all of Pakistan talking - romance, family conflict, comedy and patriotism - and why each one still deserves a watch.",
    category: "Drama lists",
    date: "2026-11-20",
    coverKicker: "TOP 10",
    sections: [
      {
        h2: "What makes an ARY drama a classic?",
        body: [
          "ARY Digital has produced some of the most talked-about Pakistani dramas of the last fifteen years. The best ones share a few things: a strong writer, a lead pair with real chemistry, and a story that people argue about at the dinner table. This list mixes record-breaking blockbusters with long-running favourites, so there is something for every kind of drama fan.",
        ],
      },
      {
        h2: "1. Meray Paas Tum Ho (2019-2020)",
        body: [
          "Written by Khalil-ur-Rehman Qamar and starring Humayun Saeed, Ayeza Khan and Adnan Siddiqui, Meray Paas Tum Ho became a national event. Its story of love, betrayal and self-respect - and its sharp, quotable dialogue - made the final episode one of the most anticipated TV moments in Pakistan's history, even screening in cinemas.",
        ],
      },
      {
        h2: "2. Kabhi Main Kabhi Tum (2024)",
        body: [
          "Fahad Mustafa and Hania Aamir lead this romantic family drama about a couple who marry for convenience and slowly fall for each other. Its light humour, emotional twists and the pair's on-screen chemistry turned it into one of the most-discussed dramas of 2024, both in Pakistan and abroad.",
        ],
      },
      {
        h2: "3. Mere Humsafar (2022)",
        body: [
          "Farhan Saeed and Hania Aamir star as Hamza and Hala in a story about a young woman mistreated by her in-laws and the husband who stands up for her. It struck a chord with viewers for showing quiet strength and respect inside a marriage.",
        ],
      },
      {
        h2: "4. Sinf-e-Aahan (2021-2022)",
        body: [
          "An ensemble drama following young women who join the Pakistan Army, featuring a star cast including Sajal Aly, Kubra Khan, Syra Yousuf, Yumna Zaidi and Ramsha Khan. Sinf-e-Aahan stands out for its inspiring theme and for showing friendship and ambition rather than only romance.",
        ],
      },
      {
        h2: "5. Jaan-e-Jahan (2024)",
        body: [
          "Hamza Ali Abbasi's much-awaited return to television, opposite Ayeza Khan. A big-budget romantic drama with family rivalries and grand visuals, it drew a huge audience from its very first episodes.",
        ],
      },
      {
        h2: "6. Mujhe Pyaar Hua Tha (2022-2023)",
        body: [
          "Hania Aamir, Wahaj Ali and Zaviyar Nauman Ijaz form a love triangle in this emotional drama about unspoken feelings and family pressure. Wahaj Ali's performance in particular won many new fans.",
        ],
      },
      {
        h2: "7. Bulbulay (2009-present)",
        body: [
          "Not every classic is a tearjerker. Bulbulay, the long-running family sitcom with Nabeel, Ayesha Omar, Mehmood Aslam and Hina Dilpazeer as the unforgettable Momo, has kept families laughing for well over a decade.",
        ],
      },
      {
        h2: "8. Kaisi Teri Khudgharzi (2022)",
        body: [
          "Danish Taimoor and Dur-e-Fishan Saleem star in an intense story of obsession and class divide. Its gripping plot kept viewers hooked week after week.",
        ],
      },
      {
        h2: "9. Habs (2022)",
        body: [
          "Feroze Khan and Ushna Shah lead this drama about a young woman who carries the financial weight of her family and the marriage that tests her. A grounded, emotional story about duty and sacrifice.",
        ],
      },
      {
        h2: "10. Jalan (2020)",
        body: [
          "Minal Khan, Imran Ashraf and Areeba Habib star in a controversial story of jealousy between sisters. Jalan sparked intense debate - which is exactly why so many people watched it.",
        ],
      },
      {
        h2: "Watch them your way",
        body: [
          "Many classic ARY dramas are available on ARY Plus and on ARY Digital's official YouTube channel. If you want to binge-watch on a flight or save data, you can download free episodes as MP4 and watch them offline.",
        ],
      },
    ],
    faqs: [
      { q: "Which is the most popular ARY drama ever?", a: "Meray Paas Tum Ho (2019-2020) is widely considered ARY Digital's biggest drama phenomenon, with a final episode that drew nationwide attention." },
      { q: "Where can I watch old ARY dramas?", a: "Many are on ARY Plus and on ARY Digital's official YouTube channel." },
    ],
    cta: { href: "/", label: "Download ARY dramas to watch offline" },
  },
  {
    slug: "dar-e-nijaat-ary-drama-guide",
    keywords: "Dar-e-Nijaat ARY drama, Dar-e-Nijaat cast, Dar-e-Nijaat story, Umera Ahmed Dar-e-Nijaat, Dar-e-Nijaat episodes",
    title: "Dar-E-Nijaat: Story, Writer and Where to Watch the ARY Drama",
    metaTitle: "Dar-E-Nijaat ARY Drama - Story, Writer & Where to Watch",
    description:
      "Dar-E-Nijaat on ARY: written by Umera Ahmed and directed by Saqib Khan. What the story is about, where to watch every episode and how to watch it offline.",
    excerpt:
      "Umera Ahmed's drama about love, loss and the courage it takes to forgive - what to know before you start, and where to watch every episode.",
    category: "Drama guides",
    date: "2026-11-22",
    coverKicker: "DRAMA GUIDE",
    sections: [
      {
        h2: "What is Dar-E-Nijaat about?",
        body: [
          "ARY Plus introduces Dar-E-Nijaat with three lines: some stories begin with love, some are tested by loss, and some are remembered for the courage it takes to forgive. It is a drama about relationships under pressure - and about whether forgiveness is possible after real hurt.",
          "\"Dar-e-Nijaat\" roughly means \"the door to salvation\", a title that points to the drama's themes of redemption and second chances.",
        ],
      },
      {
        h2: "Dar-e-Nijaat cast",
        body: [
          "Dar-e-Nijaat premiered on ARY Digital on 1 August 2026. The lead cast is Sheheryar Munawar as Abu Bakar, Durefishan Saleem as Zaryab and Nameer Nawaz Khan as Zamil, with Romaisa Khan as Hamna and Sehar Hashmi as Bella.",
          "The supporting cast includes veteran actors Sania Saeed, Saba Hamid, Faran Tahir and Nadia Afgan.",
        ],
      },
      {
        h2: "Who wrote and directed it?",
        body: [
          "Dar-E-Nijaat is written by Umera Ahmed, one of Pakistan's best-known novelists and screenwriters, whose earlier work includes the novel Peer-e-Kamil and the drama Zindagi Gulzar Hai. It is directed by Saqib Khan.",
          "Umera Ahmed's stories are known for layered characters, moral dilemmas and spiritual themes, so fans of her writing will find familiar depth here.",
        ],
      },
      {
        h2: "Where to watch Dar-E-Nijaat",
        body: [
          "New episodes are available on ARY Plus (aryplus.tv) after they air on ARY Digital. Episodes run roughly 40 minutes each.",
        ],
        list: [
          "Watch online on ARY Plus on your phone, PC or smart TV.",
          "Catch up on missed episodes from the drama's page on ARY Plus.",
          "Download episodes to watch offline with ARYPlusD - paste the episode link and pick a quality.",
        ],
      },
      {
        h2: "How big is a Dar-E-Nijaat episode to download?",
        body: ["Measured on a real episode of about 39 minutes, the MP4 sizes are approximately:"],
        list: ["240p - 57 MB", "480p - 124 MB", "720p - 222 MB", "1080p - 443 MB", "4K - 1.4 GB"],
      },
    ],
    faqs: [
      { q: "Who is the writer of Dar-E-Nijaat?", a: "Dar-E-Nijaat is written by Umera Ahmed and directed by Saqib Khan." },
      { q: "Who is in the cast of Dar-E-Nijaat?", a: "Sheheryar Munawar, Durefishan Saleem and Nameer Nawaz Khan lead the cast, with Sania Saeed, Saba Hamid, Faran Tahir and Nadia Afgan in supporting roles." },
      { q: "When did Dar-E-Nijaat start?", a: "It premiered on ARY Digital on 1 August 2026." },
      { q: "Where can I watch Dar-E-Nijaat?", a: "On ARY Plus (aryplus.tv). You can also save free episodes as MP4 with ARYPlusD to watch offline." },
    ],
    cta: { href: "/", label: "Download Dar-E-Nijaat episodes" },
  },
  {
    slug: "hania-aamir-ary-dramas",
    keywords: "Hania Aamir dramas, Hania Aamir ARY dramas, Kabhi Main Kabhi Tum, Mere Humsafar, Hania Aamir drama list",
    title: "Hania Aamir's ARY Dramas: Every Hit From Ishqiya to Kabhi Main Kabhi Tum",
    metaTitle: "Hania Aamir ARY Dramas - Complete List",
    description:
      "All of Hania Aamir's ARY Digital dramas in one place - Ishqiya, Mere Humsafar, Mujhe Pyaar Hua Tha and Kabhi Main Kabhi Tum - with co-stars and story.",
    excerpt:
      "Hania Aamir became one of Pakistan's biggest stars through a run of ARY hits. Here is every one, with her co-stars and what makes each worth watching.",
    category: "Drama lists",
    date: "2026-11-18",
    coverKicker: "STAR LIST",
    sections: [
      {
        h2: "Why Hania Aamir's ARY dramas stand out",
        body: [
          "Few actors have had a run like Hania Aamir on ARY Digital. Her natural, expressive acting and her chemistry with very different co-stars made each of these dramas a talking point, and her fan base now stretches far beyond Pakistan.",
        ],
      },
      {
        h2: "Ishqiya (2020)",
        body: [
          "Hania Aamir starred alongside Feroze Khan and Ramsha Khan in this intense story of love and betrayal between sisters. It was one of the dramas that showed her range in a more serious role.",
        ],
      },
      {
        h2: "Mere Humsafar (2022)",
        body: [
          "As Hala, opposite Farhan Saeed, Hania played a young woman who endures mistreatment from her in-laws until her husband stands by her. The drama became a massive hit and is often named among her best performances.",
        ],
      },
      {
        h2: "Mujhe Pyaar Hua Tha (2022-2023)",
        body: [
          "With Wahaj Ali and Zaviyar Nauman Ijaz, Hania was at the centre of a heartbreaking love triangle. The drama is remembered for its emotional storytelling and powerful supporting performances.",
        ],
      },
      {
        h2: "Kabhi Main Kabhi Tum (2024)",
        body: [
          "Paired with Fahad Mustafa, Hania played Sharjeena in a romantic family drama that mixes comedy with heartbreak. It became one of the most-watched and most-discussed dramas of 2024.",
        ],
      },
      {
        h2: "Binge-watch her dramas offline",
        body: [
          "Planning a Hania Aamir marathon? Download the free episodes on Wi-Fi in 480p or 720p and you can watch them anywhere without buffering or using your data.",
        ],
      },
    ],
    cta: { href: "/download-ary-dramas-on-android", label: "How to download dramas on your phone" },
  },
  {
    slug: "how-to-watch-ary-dramas-abroad",
    keywords: "watch ARY dramas abroad, ARY dramas in UK, ARY dramas in USA, ARY dramas in UAE, ARY Digital overseas",
    title: "How to Watch ARY Dramas Abroad: UK, USA, UAE, Canada and Saudi Arabia",
    metaTitle: "How to Watch ARY Dramas Abroad (UK, USA, UAE)",
    description:
      "Living outside Pakistan? The easy ways to watch ARY Digital dramas in the UK, USA, UAE, Canada and Saudi Arabia - online, on YouTube and offline.",
    excerpt:
      "Overseas Pakistanis are some of ARY's most loyal viewers. Here are the simplest legal ways to keep up with your dramas from anywhere in the world.",
    category: "Watching tips",
    date: "2026-11-15",
    coverKicker: "OVERSEAS",
    sections: [
      {
        h2: "Option 1: ARY Plus online",
        body: [
          "ARY Plus (aryplus.tv) streams ARY dramas on the web, Android, iPhone and smart TVs. It is the official home of ARY content online. Some titles or premium features may differ by country, so check what is available where you live.",
        ],
      },
      {
        h2: "Option 2: ARY Digital's YouTube channel",
        body: [
          "ARY Digital uploads many drama episodes to its official YouTube channel, which works in almost every country. It is a good free option if you mostly watch on a phone or a smart TV with the YouTube app.",
        ],
      },
      {
        h2: "Option 3: Watch offline",
        body: [
          "Hotel Wi-Fi, roaming charges and long flights make streaming difficult when you travel. Download free episodes before you leave and watch them offline - a 40-minute episode in 480p is only about 120 MB.",
        ],
        list: [
          "UK, USA and Canada: download on home broadband and watch on the commute.",
          "UAE and Saudi Arabia: save on mobile data by downloading on Wi-Fi.",
          "Flights: download a few episodes the night before you travel.",
        ],
      },
      {
        h2: "Tips for the best experience abroad",
        body: [],
        list: [
          "Follow ARY Digital's official social accounts for new episode announcements.",
          "Use 720p for phones and 1080p for TVs.",
          "Keep a USB stick with downloaded episodes to watch on any hotel TV.",
        ],
      },
    ],
    cta: { href: "/watch-ary-dramas-offline", label: "Guide: watch ARY dramas offline" },
  },
  {
    slug: "ary-plus-vs-ary-zap",
    keywords: "ARY Plus vs ARY ZAP, ARY ZAP, ARY Plus app, ARY ZAP closed",
    title: "ARY Plus vs ARY ZAP: What Changed and Where to Watch ARY Dramas Now",
    metaTitle: "ARY Plus vs ARY ZAP - What Changed?",
    description:
      "ARY ZAP or ARY Plus? What happened to ARY ZAP, how ARY Plus is different, and where to watch and download ARY dramas today.",
    excerpt:
      "If you still have old ARY ZAP links saved, you are not alone. Here is how ARY's streaming platforms changed and what that means for you.",
    category: "Watching tips",
    date: "2026-11-10",
    coverKicker: "EXPLAINED",
    sections: [
      {
        h2: "What was ARY ZAP?",
        body: [
          "ARY ZAP was ARY Digital Network's video-on-demand platform, with an app and website for catching up on ARY dramas, shows and telefilms. Its links were shared widely on social media and in drama fan groups.",
        ],
      },
      {
        h2: "What is ARY Plus?",
        body: [
          "ARY Plus (aryplus.tv) is ARY's current streaming home. It carries the drama catalogue, organises titles into series with episode lists, and offers both free and premium content on the web, mobile and TV apps.",
        ],
      },
      {
        h2: "What happens to old ARY ZAP links?",
        body: [
          "Older ARY ZAP links still appear all over the internet. ARYPlusD recognises both ARY ZAP and ARY Plus links, finds the same title on ARY Plus and lets you download the episode. If an old link no longer works anywhere, search the drama by name instead.",
        ],
      },
      {
        h2: "Free vs premium content",
        body: [
          "Many ARY Plus episodes are free to stream. Premium titles that need a subscription are DRM-protected and cannot be downloaded with ARYPlusD - they are clearly marked as premium in the episode list.",
        ],
      },
    ],
    cta: { href: "/ary-zap-downloader", label: "Use the ARY ZAP downloader" },
  },
  {
    slug: "how-much-data-does-a-pakistani-drama-use",
    keywords: "drama episode data usage, how much data does streaming use, Pakistani drama data, save mobile data dramas",
    title: "How Much Data Does Watching a Pakistani Drama Use? (Real Numbers)",
    metaTitle: "How Much Data Does a Drama Episode Use?",
    description:
      "Real measured data usage for a 40-minute Pakistani drama episode at 240p, 480p, 720p, 1080p and 4K - and how to cut your mobile data use for dramas.",
    excerpt:
      "We measured a real ARY drama episode at every quality. Here is exactly how much data each one uses, and how to save on your mobile package.",
    category: "Watching tips",
    date: "2026-11-12",
    coverKicker: "REAL DATA",
    sections: [
      {
        h2: "Measured data usage per episode",
        body: [
          "We measured a real ARY drama episode of about 39 minutes at every quality it is published in. These are the sizes of the finished MP4 files:",
        ],
        list: [
          "240p (data saver): about 57 MB",
          "480p (standard): about 124 MB",
          "720p (HD): about 222 MB",
          "1080p (Full HD): about 443 MB",
          "1440p (2K): about 648 MB",
          "2160p (4K): about 1.4 GB",
        ],
      },
      {
        h2: "How much is a whole drama?",
        body: [
          "A typical Pakistani drama runs 25 to 40 episodes. At 720p, 30 episodes is roughly 6.5 GB - more than many monthly mobile packages. At 480p the same drama is about 3.7 GB, and at 240p under 2 GB.",
        ],
      },
      {
        h2: "Why streaming can use even more",
        body: [
          "Streaming apps adjust quality automatically and often jump to HD on a good connection, and if you rewatch an episode the data is used again. Downloading once on Wi-Fi and watching offline means you pay for the data only once - or not at all on home Wi-Fi.",
        ],
      },
      {
        h2: "5 ways to save mobile data on dramas",
        body: [],
        list: [
          "Download episodes on Wi-Fi and watch offline.",
          "Pick 480p for phones - it looks sharp on a small screen.",
          "Use 240p when you are low on data or storage.",
          "Turn off auto-play of the next episode in streaming apps.",
          "Delete watched episodes to free space for new ones.",
        ],
      },
    ],
    faqs: [
      { q: "How much data does a 40-minute episode use in HD?", a: "About 220 MB at 720p and about 440 MB at 1080p, based on a real ARY drama episode." },
      { q: "What is the lowest data option?", a: "240p uses only about 55-60 MB per 40-minute episode." },
    ],
    cta: { href: "/", label: "Download in the quality you choose" },
  },
  {
    slug: "best-video-players-for-downloaded-dramas",
    keywords: "best video player for dramas, VLC, MX Player, watch downloaded dramas",
    title: "Best Free Video Players for Watching Downloaded Dramas",
    metaTitle: "Best Video Players for Downloaded Dramas",
    description:
      "The best free video players to watch downloaded Pakistani dramas on Android, iPhone, Windows and Mac - VLC, MX Player and more, plus playback tips.",
    excerpt:
      "Your downloaded episodes are standard MP4 files, so almost any player works. These free players make binge-watching even better.",
    category: "Watching tips",
    date: "2026-11-08",
    coverKicker: "TOOLS",
    sections: [
      {
        h2: "VLC Media Player (all devices)",
        body: [
          "VLC is free, open source and runs on Android, iPhone, Windows, Mac and Linux. It plays practically any video file, lets you speed up or slow down playback, and remembers where you stopped.",
        ],
      },
      {
        h2: "MX Player (Android)",
        body: ["A long-time favourite on Android with gesture controls for volume, brightness and seeking - handy for watching dramas in bed or on the go."],
      },
      {
        h2: "Built-in players",
        body: [
          "You don't need anything extra: the Photos/Gallery app on phones, Movies & TV or Media Player on Windows, and QuickTime on Mac all play MP4 files downloaded with ARYPlusD.",
        ],
      },
      {
        h2: "Watching on a TV",
        body: [
          "Copy episodes to a USB stick and plug it into your smart TV - most TVs play MP4 natively. You can also cast from your phone or laptop using Chromecast, AirPlay or the TV's screen-mirroring feature.",
        ],
      },
      {
        h2: "Playback tips for drama marathons",
        body: [],
        list: [
          "Name files by episode number so they stay in order.",
          "Use 1.25x speed for slower recap scenes (VLC and MX Player support this).",
          "Keep brightness lower at night to save battery.",
        ],
      },
    ],
    cta: { href: "/ary-plus-to-mp4", label: "Save episodes as MP4" },
  },
];

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Reading time at 200 words per minute, rounded up. */
export function readingMinutes(post: Post): number {
  const words = post.sections
    .flatMap((s) => [s.h2, ...s.body, ...(s.list ?? [])])
    .join(" ")
    .split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}
