/**
 * English source text. Every other language implements the same `Dictionary`
 * shape, so a missing translation is a type error.
 * Long text may use **bold** and [label](/path) - rendered by <Rich />.
 * {placeholders} are filled by fmt().
 */

const en = {
  meta: {
    title: "ARYPlusD: Free ARY Plus Downloader in 4K - No Sign-in",
    description:
      "Free ARY Plus video downloader. Download ARY dramas in 4K Ultra HD, 1080p or 240p - no sign-in, no app. Search a drama, get every episode and download several at once as MP4.",
    tagline: "ARY Plus Video Downloader",
    ogAlt: "ARYPlusD - free ARY Plus video downloader",
  },
  nav: {
    downloader: "Downloader",
    howTo: "How to use",
    guides: "Guides",
    blog: "Blog",
    faq: "FAQ",
    about: "About",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    disclaimer: "Disclaimer & DMCA",
    home: "Home",
    language: "Language",
    toggleTheme: "Toggle theme",
  },
  footer: {
    about: "Free ARY Plus Video Downloader: save ARY Plus and ARY ZAP drama episodes to your phone or PC as MP4, from 240p to 4K.",
    guides: "Guides",
    site: "Site",
    legal:
      "{name} is an independent tool and is not affiliated with, endorsed by or connected to ARY Digital Network, ARY Plus or ARY ZAP. All trademarks belong to their respective owners. Only download content you own or have permission to save.",
  },
  common: {
    readGuide: "Read the guide",
    readMore: "Read guide",
    openDownloader: "Open the downloader",
    ready: "**Ready?** Paste your ARY Plus link and download the episode in seconds.",
    moreGuides: "More guides",
    faqTitle: "Frequently asked questions",
    allQuestions: "All questions",
    fullGuide: "Full guide with tips for Android, iPhone and PC",
    allArticles: "All articles",
    lastUpdated: "Last updated: {date}",
  },
  ui: {
    findVideo: "Find a video",
    findVideoHint: "Paste an ARY Plus series or episode link.",
    tabPaste: "Paste a link",
    tabSearch: "Search ARY Plus",
    linkPlaceholder: "Paste a video link",
    linkLabel: "Video URL",
    pasteClipboard: "Paste from clipboard",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    pasteFirst: "Paste a video link first.",
    analysisFailed: "Analysis failed",
    clipboardDenied: "Clipboard access was denied by the browser.",
    foundSeries: "Found \"{title}\" with {count} episodes",
    videoFound: "Video found",
    downloadStarted: "Download started",
    downloadStartedHint: "Your video is being fetched.",
    couldNotStart: "Could not start the download.",
    saveAs: "Save as",
    dismiss: "Dismiss",
    original: "Original",
    video: "Video",
    quality: "Quality",
    about: "about {size}",
    download: "Download",
    downloadQuality: "Download {quality}",
    starting: "Starting...",
    searchPlaceholder: "Search ARY Plus dramas, shows, movies...",
    searchLabel: "Search ARY Plus catalog",
    search: "Search",
    searching: "Searching...",
    searchFirst: "Type a drama, show or movie name first.",
    noMatches: "No titles matched",
    noMatchesHint: "Try a shorter or different spelling.",
    searchFailed: "Search failed.",
    loadFailed: "Could not load this title.",
    backToResults: "Back to results",
    episodesShort: "{count} eps",
    episodes: "{count} episodes",
    premium: "premium",
    premiumCount: "{count} premium",
    openOnAry: "open on ARY Plus",
    pickEpisode: "Pick an episode to choose its quality.",
    premiumTitle: "Premium title",
    premiumText: "This title is not available for download - try another drama or show.",
    tapToChoose: "Tap to choose quality",
    loadingQualities: "Loading qualities...",
    streamFailed: "Could not read this episode's stream.",
    retry: "Retry",
    standardQuality: "Standard quality",
    best: "best",
    sizeUnknown: "size unknown",
    q4k: "4K Ultra HD",
    q2k: "2K Quad HD",
    qFullHd: "Full HD",
    qHd: "HD",
    qStandard: "Standard",
    qSaver: "Data saver",
    qStream: "Stream",
    downloads: "Downloads",
    liveActive: "live - {count} active",
    noDownloads: "No downloads yet",
    noDownloadsHint: "Pick a video above - it will show up here and save to your device when done.",
    statusQueued: "Queued",
    statusDownloading: "Downloading",
    statusFailed: "Failed",
    statusCanceled: "Canceled",
    statusSaving: "Saving to device",
    waitingSlot: "Waiting for a free slot...",
    sendingToDevice: "{size} - sending to your Downloads folder...",
    sizeUnknownShort: "size unknown",
    cancel: "Cancel",
    cancelTitle: "Cancel this download?",
    cancelText: "{title} will stop downloading and everything downloaded so far will be deleted from the server.",
    keepDownloading: "Keep downloading",
    cancelDownload: "Cancel download",
    canceled: "Download canceled",
    canceledHint: "Its files were removed from the server.",
    couldNotCancel: "Could not cancel the download.",
    requeued: "Download requeued",
    couldNotRetry: "Could not retry the download.",
    removed: "Removed",
    couldNotDelete: "Could not delete the download.",
    stoppedEarly: "Stopped before completion.",
    savingToDevice: "Saving to device",
    savingToDeviceHint: "{title} is downloading to your Downloads folder.",
    videoChapters: "Video chapters",
    videoLanguage: "Video voice",
    stepsHeading: "Step-by-step (video transcript)",
  },
  home: {
    h1: "Free ARY Plus Video Downloader - Download ARY Dramas in 4K",
    intro:
      "Paste an ARY Plus link or search a drama name, then download every episode in 4K Ultra HD, 1080p or 240p - several at the same time. 100% free, no sign-in, no app.",
    videoHeading: "Watch: download ARY dramas step by step (with voice)",
    videoText:
      "Paste a link or search a drama name, get every episode in up to 4K, and download several at once - free, no sign-in.",
    howHeading: "How to download ARY Plus episodes",
    howSub: "Three steps, about two minutes.",
    whyHeading: "Why use {name}",
    features: [
      { title: "Free - no sign-in", text: "No account, no login, no app and no daily limit. Open the site and download." },
      { title: "4K Ultra HD free", text: "Every published quality from 240p up to 4K Ultra HD, with the real file size shown first." },
      { title: "Many episodes at once", text: "Search a drama, start several episodes - three download at the same time, the rest queue up." },
      { title: "Any device", text: "Works in the browser on Android, iPhone, Windows, Mac and Linux." },
      { title: "Nothing kept", text: "Files are deleted from our server as soon as they reach your device." },
      { title: "Safe and clean", text: "No pop-ups, no extensions, no installers - just the MP4 you asked for." },
    ],
    qualityHeading: "Every quality, with the real file size",
    qualityText:
      "Sizes below are for a typical 40-minute ARY drama episode. {name} measures the exact size of each quality before you download, so there are no surprises on mobile data.",
    qualityCaption: "Typical file size per quality for a 40-minute episode",
    colQuality: "Quality",
    colName: "Name",
    colSize: "Size",
    devicesAlt: "ARYPlusD works on Android phones, iPhones, tablets and Windows, Mac or Linux computers",
    devicesHeading: "Download ARY dramas on any device",
    devicesText:
      "{name} runs in your browser, so the same ARY Plus downloader works on your phone, tablet and computer. Pick your device for a step-by-step guide.",
    deviceGuides: [
      { title: "Android phones", text: "Save ARY episodes with Chrome straight to your Downloads folder - no APK needed." },
      { title: "iPhone & iPad", text: "Download with Safari to the Files app, then move episodes to Photos." },
      { title: "PC, laptop & Mac", text: "Get ARY dramas in 1080p or 4K on Windows, macOS or Linux and play them on your TV." },
    ],
    aboutHeading: "The free ARY Plus downloader for Pakistani dramas",
    aboutParagraphs: [
      "ARY Digital is home to some of the most-watched Pakistani dramas, and ARY Plus (formerly ARY ZAP) is where new episodes stream after they air on TV. {name} is an ARY Plus video downloader that turns any free episode into a single MP4 file, so you can watch ARY dramas offline on a phone, laptop or TV - without buffering and without using your data again.",
      "Unlike screen recorders or random APKs, {name} saves the original stream in the quality you choose, from 240p for small phones up to 1080p Full HD and 4K. Each quality shows the real MP4 file size before you download, measured from the stream itself, so you always know how much space an episode needs.",
      "It works with every kind of link: ARY Plus episode links, full drama (series) links, share links from the ARY Plus app and legacy ARY ZAP links. Don't have a link? Search the drama by name and pick the episode from the list.",
    ],
    supportedHeading: "Supported links",
    supportedLinks: [
      "ARY Plus episode links (aryplus.tv/video/...)",
      "ARY Plus drama / series links",
      "Share links from the ARY Plus app",
      "Legacy ARY ZAP links (aryzap.com)",
    ],
    guidesHeading: "Popular guides",
    blogHeading: "From the drama blog",
  },
  steps: [
    {
      title: "Paste the ARY Plus link",
      text: "Open the episode or series on aryplus.tv, copy the link from the address bar (or the Share button), paste it into the ARYPlusD box and press Analyze. You can also search a drama by name.",
      alt: "Pasting an ARY Plus episode link into the ARYPlusD downloader and pressing Analyze",
    },
    {
      title: "Pick a quality",
      text: "Every available quality appears as a tile with its exact file size - from 240p data saver to 1080p Full HD and 4K. Tap the one you want and press Download.",
      alt: "Quality tiles from 240p to 4K, each showing the file size, with 720p selected",
    },
    {
      title: "Save it to your device",
      text: "ARYPlusD prepares the MP4 and your browser saves it to the Downloads folder automatically. Watch it offline on your phone, laptop or TV - no app needed.",
      alt: "The finished MP4 episode saved in the Downloads folder of a phone and computer",
    },
  ],
  faqs: [
    { q: "What is ARYPlusD?", a: "ARYPlusD is a free online ARY Plus video downloader. You paste an ARY Plus or ARY ZAP episode or series link, choose a quality, and the episode is saved to your device as an MP4 file you can watch offline." },
    { q: "How do I download an ARY Plus drama episode?", a: "Copy the episode or series link from aryplus.tv, paste it into the box on the ARYPlusD home page and press Analyze. Pick a quality tile (240p to 4K), press Download, and the MP4 is saved to your Downloads folder automatically when it is ready." },
    { q: "Is ARYPlusD free?", a: "Yes. ARYPlusD is 100% free in every quality, including 4K Ultra HD - no sign-in, no account, no app install and no daily download limit." },
    { q: "Do I need to sign in or create an account?", a: "No. There is no login, registration or account of any kind. Open the site and start downloading." },
    { q: "Can I download ARY dramas in 4K Ultra HD?", a: "Yes, free. Whenever an episode is published in 2160p, a 4K Ultra HD tile appears with its file size - pick it and press Download." },
    { q: "Can I download all episodes of a drama at the same time?", a: "Yes. Search the drama name, open it to see every episode, and start as many as you like. Three download at the same time, the rest wait in line automatically, and each one saves to your device as soon as it is ready." },
    { q: "Which video qualities can I download?", a: "Every quality the episode is published in - usually 240p, 480p, 720p, 1080p, 1440p and 4K (2160p). Each tile shows the exact file size before you download, so you can pick a small file for mobile data or full HD for a TV." },
    { q: "Does it work on Android, iPhone and PC?", a: "Yes. ARYPlusD runs in the browser, so it works on Android, iPhone, iPad, Windows, Mac and Linux. Files are saved as standard MP4, which every phone and computer can play." },
    { q: "How big is one drama episode?", a: "A 40-minute episode is roughly 55 MB at 240p, 120 MB at 480p, 220 MB at 720p and 440 MB at 1080p. The exact size is shown on each quality tile before you start." },
    { q: "Can I download premium or DRM-protected episodes?", a: "No. Titles that need a paid subscription or are DRM-protected are marked as premium and cannot be downloaded. ARYPlusD only works with free, publicly streamable episodes." },
    { q: "Is ARYPlusD affiliated with ARY Digital or ARY Plus?", a: "No. ARYPlusD is an independent tool and is not affiliated with, endorsed by or connected to ARY Digital Network, ARY Plus or ARY ZAP. All trademarks belong to their owners." },
    { q: "Are downloaded videos stored on your servers?", a: "Only while they are being prepared. As soon as the file has been sent to your device it is deleted from our server, and cancelled downloads are deleted immediately." },
  ],
  video: {
    chapters: ["Paste the ARY Plus link", "Pick a quality - up to 4K", "Download & save to device", "Search a drama by name", "See all episodes", "Download several at once"],
    steps: [
      "Open aryplusd.com in any browser, on your phone or computer.",
      "Copy the episode link from ARY Plus, paste it in the box and press Analyze.",
      "Every available quality appears, up to 4K Ultra HD, with the real file size.",
      "Tap the quality you want, then press Download.",
      "Watch the live progress while your video is prepared.",
      "When it's ready, the MP4 is saved to your Downloads folder automatically.",
      "No link? Switch to Search and type the drama name, then pick it from the results.",
      "Every episode appears with its thumbnail and length.",
      "Open an episode, choose a quality and press Download.",
      "Start as many episodes as you like - three download at the same time.",
      "Each one is saved to your device as soon as it's ready.",
    ],
  },
  pages: {
    howTo: {
      title: "How to Download ARY Plus Dramas",
      description:
        "Video + step-by-step guide: download ARY Plus dramas free in 4K without sign-in. Paste a link or search a drama name, see all episodes and download several at once.",
      intro:
        "Save any free ARY Plus episode to your phone or computer in about two minutes - in up to 4K Ultra HD, 100% free and with no sign-in. {name} works in your browser, nothing to install.",
      videoHeading: "Watch: the whole process, step by step",
      videoText:
        "A narrated walkthrough in **English** and **Urdu**: paste a link, pick a quality, save the MP4 - then search a drama by name and download several episodes at the same time. Every step is written out below the video.",
      stepLabel: "Step {n}: {title}",
      sections: [
        {
          h2: "Search a drama and download all its episodes",
          body: [
            "No link? Open the **Search ARY Plus** tab and type the drama name - for example Sharpasand or Dar-e-Nijaat. Open the drama from the results and **every episode** appears with its thumbnail and length.",
          ],
          list: [
            "Tap an episode, choose a quality (up to 4K) and press Download.",
            "Tap the next episode and do the same - you don't have to wait.",
            "Three episodes download at the same time; extra ones wait in line automatically.",
            "Each episode is saved to your device as soon as it is ready.",
          ],
          after: ["Everything is free, with no sign-in and no daily limit."],
        },
        {
          h2: "Where to find the ARY Plus link",
          body: [
            "On **aryplus.tv** open the drama, then the episode you want. On a computer, copy the address from the browser bar. On a phone, tap **Share** and choose **Copy link**. Both episode links and series links work - a series link lists every episode so you can pick one.",
            "Don't have the link? Use the **Search ARY Plus** tab and type the drama name.",
          ],
        },
        {
          h2: "Tips for Android",
          body: [
            "Use Chrome or Samsung Internet. When the download finishes, Android shows it in the notification shade and in the **Files → Downloads** app. Choose 480p or 720p to save mobile data.",
          ],
        },
        {
          h2: "Tips for iPhone and iPad",
          body: [
            "Use Safari. Finished episodes go to the **Files** app under **Downloads**. From there tap **Share → Save Video** to move one into Photos. Keep Safari open until the download completes.",
          ],
        },
        {
          h2: "Tips for Windows, Mac and Linux",
          body: [
            "Any modern browser works. Files land in your normal **Downloads** folder and play in VLC, Windows Media Player, QuickTime or any TV with USB playback. 1080p or 4K looks best on large screens.",
          ],
        },
        {
          h2: "Which quality should I choose?",
          list: [
            "**240p - 480p:** small phones and limited data (about 55-120 MB per episode).",
            "**720p:** the best balance for phones and tablets (about 220 MB).",
            "**1080p - 4K:** laptops, monitors and TVs (about 440 MB - 1.4 GB).",
          ],
          after: ["The exact size is printed on every quality tile before you press Download."],
        },
        {
          h2: "Something not working?",
          body: [
            "Premium episodes that need a subscription can't be downloaded. If a free episode fails, press Retry, or paste the link again - links can expire. Still stuck? See the [FAQ](/faq) or [contact us](/contact).",
          ],
        },
      ],
    },
    faq: {
      title: "ARY Plus Downloader FAQ",
      description:
        "Answers about downloading ARY Plus dramas with ARYPlusD: is it free, which qualities, file sizes, Android and iPhone support, premium episodes and privacy.",
      intro: "Quick answers to the questions people ask most.",
    },
    about: {
      title: "About ARYPlusD",
      metaTitle: "About Us",
      description:
        "ARYPlusD is a free, independent ARY Plus video downloader for watching Pakistani dramas offline on any phone or computer. Learn what it does and how it works.",
      intro: "{name} is a free, independent web tool that lets drama fans keep ARY Plus episodes for offline viewing.",
      imageAlt: "ARYPlusD on a laptop, a tablet and a phone",
      sections: [
        {
          h2: "Why we built it",
          body: [
            "Millions of viewers in Pakistan and abroad follow ARY dramas, often on slow or expensive mobile data, during travel, or in places with unreliable internet. Streaming the same episode again and again wastes data. {name} lets you save an episode once, in the size that suits your device, and watch it anywhere.",
          ],
        },
        {
          h2: "What makes it different",
          list: [
            "Works in the browser - no app, extension or account.",
            "Shows the real file size of every quality before you download.",
            "Saves a single clean MP4 that plays on every phone, PC and TV.",
            "Deletes files from our server the moment they reach you.",
            "No pop-ups or fake download buttons.",
          ],
        },
        {
          h2: "What it does not do",
          body: [
            "{name} does not host any videos, does not bypass DRM, and cannot download premium titles that require a subscription. It only helps you save free, publicly streamable episodes for personal, offline viewing.",
          ],
        },
        {
          h2: "Independence",
          body: [
            "{name} is not affiliated with, endorsed by or connected to ARY Digital Network, ARY Plus or ARY ZAP. Names are used only to describe compatibility. All trademarks belong to their owners.",
          ],
        },
      ],
    },
    contact: {
      title: "Contact Us",
      description: "Contact the ARYPlusD team for support, feedback, business enquiries or copyright requests.",
      intro: "We read every message and usually reply within two working days.",
      emailHeading: "Email",
      helpHeading: "Help us help you",
      help: [
        "**Download problem:** include the episode link, the quality you picked and your device/browser.",
        "**Feedback or ideas:** tell us what would make {name} better.",
        "**Business or advertising:** put \"Business\" in the subject.",
        "**Copyright:** see our [Disclaimer & DMCA](/disclaimer) page for what to include.",
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "How ARYPlusD handles your data, cookies, advertising and downloaded files.",
      sections: [
        {
          h2: "Summary",
          body: [
            "{name} does not require an account and does not ask for your name, email or phone number to use the downloader. Videos you download are deleted from our server as soon as they are delivered to your device.",
          ],
        },
        {
          h2: "Information we process",
          list: [
            "**Links you paste** - used only to find and prepare the video you asked for.",
            "**Temporary files** - the video is stored briefly while it is prepared, then deleted after delivery or when you cancel.",
            "**Visit statistics** - which pages are viewed and when, counted without names, accounts or stored IP addresses.",
            "**Server logs** - standard technical data such as browser type and time of request, kept for security and to fix errors.",
            "**Browser storage** - your theme preference is stored on your own device.",
          ],
        },
        {
          h2: "Cookies and advertising",
          body: [
            "We may show ads from Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits to {domain} and/or other sites on the Internet.",
            "You can opt out of personalised advertising in [Google Ads Settings](https://adssettings.google.com) or at [aboutads.info](https://www.aboutads.info/choices). See also [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites). Visitors in the EEA, UK and Switzerland are asked for consent before personalised ads are shown.",
          ],
        },
        {
          h2: "Sharing",
          body: [
            "We do not sell your personal information. We share data only with service providers needed to run the site (hosting, advertising) or when required by law.",
          ],
        },
        {
          h2: "Children",
          body: ["{name} is not directed at children under 13 and we do not knowingly collect their personal information."],
        },
        {
          h2: "Your rights",
          body: ["Depending on where you live you may ask to access or delete personal data we hold about you. Email [{email}](mailto:{email})."],
        },
        {
          h2: "Changes",
          body: ["We may update this policy. The date at the top shows the latest version."],
        },
      ],
    },
    terms: {
      title: "Terms of Use",
      description: "The rules for using ARYPlusD, including acceptable use, copyright and limitation of liability.",
      intro: "Last updated: {date}. By using {domain} you agree to these terms.",
      sections: [
        {
          h2: "1. The service",
          body: [
            "{name} is a free tool that helps you save publicly available, non-DRM ARY Plus episodes to your own device for personal, offline viewing. We do not host, upload or distribute any videos.",
          ],
        },
        {
          h2: "2. Your responsibilities",
          list: [
            "Download only content you own or have permission to save, and respect the content owner's terms and copyright law in your country.",
            "Do not re-upload, sell, broadcast or publicly share downloaded videos.",
            "Do not use the service to bypass DRM, paywalls or other protection.",
            "Do not overload, scrape or attack the service, or use automated tools against it.",
          ],
        },
        {
          h2: "3. Intellectual property",
          body: [
            "All videos, titles and trademarks belong to their respective owners. {name} is not affiliated with ARY Digital Network. The {name} name, logo and site design belong to us.",
          ],
        },
        {
          h2: "4. No warranty",
          body: [
            "The service is provided \"as is\" without warranties of any kind. Availability, speed and supported content can change at any time, and some links may not work.",
          ],
        },
        {
          h2: "5. Limitation of liability",
          body: [
            "To the fullest extent allowed by law, {name} is not liable for any indirect or consequential loss, or for how you use downloaded content.",
          ],
        },
        {
          h2: "6. Changes and contact",
          body: ["We may change these terms; continued use means you accept them. Questions: [{email}](mailto:{email})."],
        },
      ],
    },
    disclaimer: {
      title: "Disclaimer & DMCA",
      description: "ARYPlusD is independent and hosts no videos. How rights holders can send a copyright (DMCA) request.",
      sections: [
        {
          h2: "Disclaimer",
          body: [
            "{name} is an independent tool. It is not affiliated with, endorsed by, sponsored by or connected to ARY Digital Network, ARY Plus, ARY ZAP or any of their partners. \"ARY\", \"ARY Plus\" and related names are trademarks of their owners and are used here only to describe compatibility.",
            "{name} does not host, store long-term or index any videos. Files are prepared on request for the person who asked for them and deleted as soon as they are delivered. Users are responsible for making sure their use complies with the law and the content owner's terms.",
          ],
        },
        {
          h2: "Copyright / DMCA requests",
          body: [
            "We respect intellectual property. If you own the rights to content and want it blocked from {name}, email [{email}](mailto:{email}) with the subject \"DMCA\" and include:",
          ],
          ordered: [
            "Your name, organisation and contact details.",
            "The work you own and the exact links (titles or episode URLs) concerned.",
            "A statement that you believe in good faith the use is not authorised.",
            "A statement, under penalty of perjury, that the information is accurate and you are the owner or authorised to act for them.",
            "Your physical or electronic signature.",
          ],
          after: ["We review valid requests promptly and block the reported content from being processed."],
        },
      ],
    },
    guides: {
      title: "ARY Plus Download Guides",
      description:
        "Guides for downloading ARY Plus and ARY ZAP dramas on Android, iPhone and PC, saving them as MP4 and watching Pakistani dramas offline.",
      intro: "Everything you need to download and enjoy ARY dramas on any device.",
    },
    blog: {
      title: "ARY Drama Blog",
      description:
        "ARY drama lists, Pakistani drama guides and tips for watching offline - the latest ARY Digital dramas, star filmographies, data-saving tips and more.",
      intro: "Drama lists, star guides and tips for watching ARY dramas anywhere.",
      latest: "Latest",
      minRead: "{n} min read",
      keepReading: "Keep reading",
      englishNote: "This article is currently available in English.",
      categories: { "Drama lists": "Drama lists", "Drama guides": "Drama guides", "Watching tips": "Watching tips" },
    },
  },
  guides: [
    {
      "slug": "ary-zap-downloader",
      "metaTitle": "ARY ZAP Downloader - Download ARY ZAP Videos as MP4",
      "description": "Free ARY ZAP downloader. Paste an ARY ZAP or ARY Plus link, choose 240p to 4K and save ARY ZAP drama episodes as MP4 on mobile or PC. No app, no login.",
      "h1": "ARY ZAP Downloader - Save ARY ZAP Episodes as MP4",
      "label": "ARY ZAP downloader",
      "intro": "ARY ZAP is now part of ARY Plus, but old ARY ZAP links are still shared everywhere - in WhatsApp groups, Facebook pages and YouTube descriptions. ARYPlusD understands both, so you can download ARY ZAP videos with the same three steps.",
      "imageAlt": "Pasting an ARY ZAP link into the ARYPlusD downloader",
      "sections": [
        {
          "h2": "What happened to ARY ZAP?",
          "body": [
            "ARY ZAP was ARY Digital Network's streaming app and website for dramas, telefilms and shows. The catalogue has since moved to ARY Plus (aryplus.tv), but ARY ZAP links are still shared widely, so a good ARY ZAP downloader has to recognise them and find the same title on ARY Plus.",
            "ARYPlusD does this automatically: paste the ARY ZAP link and it resolves the title, the episode list and every available quality for you."
          ]
        },
        {
          "h2": "How to download ARY ZAP videos",
          "body": [
            "The process is the same whether your link starts with aryzap.com or aryplus.tv:"
          ],
          "list": [
            "Copy the ARY ZAP or ARY Plus link of the episode or drama.",
            "Paste it into the box on the ARYPlusD home page and press Analyze.",
            "Pick a quality tile - each one shows the exact MP4 file size.",
            "Press Download. The MP4 is saved to your Downloads folder when it is ready."
          ]
        },
        {
          "h2": "Which ARY ZAP links work?",
          "body": [
            "Episode links, series (drama) links and share links all work. If a link points to a whole drama, ARYPlusD lists every episode with its thumbnail and length so you can choose the one you want. If an old link no longer opens anywhere, search the drama name in the Search ARY Plus tab instead."
          ]
        },
        {
          "h2": "ARY ZAP download quality and size",
          "body": [
            "Most ARY dramas are published in 240p, 480p, 720p and 1080p, and newer titles also in 1440p and 4K. A typical 40-minute episode is about 55 MB in 240p, 220 MB in 720p and 440 MB in 1080p. Choose a lower quality to save mobile data or storage, and a higher one for laptops and TVs."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Is ARY ZAP the same as ARY Plus?",
          "a": "ARY ZAP's dramas and shows moved to ARY Plus. ARYPlusD accepts both ARY ZAP and ARY Plus links."
        },
        {
          "q": "Can I download a full ARY ZAP drama at once?",
          "a": "Paste the drama (series) link to see every episode, then download the ones you want one by one in the quality you choose."
        },
        {
          "q": "Do I need the ARY ZAP app?",
          "a": "No. ARYPlusD works in your browser on Android, iPhone and PC, so no app is required."
        }
      ]
    },
    {
      "slug": "pakistani-drama-downloader",
      "metaTitle": "Pakistani Drama Downloader - Download Dramas in HD",
      "description": "Download Pakistani dramas from ARY Plus in HD with ARYPlusD. Save full episodes as MP4 on Android, iPhone or PC, 240p to 4K, free and without an app.",
      "h1": "Pakistani Drama Downloader - Watch Your Favourite Dramas Offline",
      "label": "Pakistani drama downloader",
      "intro": "Pakistani dramas are watched by millions of people in Pakistan, India, the Gulf, the UK, the USA and Canada. ARYPlusD lets you download Pakistani drama episodes from ARY Plus in HD so you can watch them offline - on a flight, during load-shedding or anywhere the internet is slow.",
      "imageAlt": "Pakistani drama episodes saved on a phone, tablet and laptop",
      "sections": [
        {
          "h2": "Why download Pakistani dramas instead of streaming?",
          "body": [
            "Streaming a long drama episode again and again uses a lot of data and stops whenever the connection drops. Downloading once gives you:"
          ],
          "list": [
            "Smooth playback with no buffering, even on weak 3G/4G.",
            "Big data savings - choose 240p or 480p for small phones.",
            "Offline viewing while travelling, at work breaks or during power cuts.",
            "A file you can play on a TV through a USB stick."
          ]
        },
        {
          "h2": "How to download a Pakistani drama episode",
          "body": [
            "Open the drama on ARY Plus, copy the episode or drama link and paste it into ARYPlusD. You can also type the drama name into the Search ARY Plus tab. Pick a quality, press Download and the MP4 is saved to your device automatically."
          ]
        },
        {
          "h2": "Best quality for Pakistani dramas",
          "body": [
            "For most phones, 480p or 720p looks sharp and keeps each episode between about 120 MB and 220 MB. On laptops and smart TVs, 1080p Full HD gives the best picture at around 440 MB per 40-minute episode. 4K is available for selected new dramas and is best kept for large TVs."
          ]
        },
        {
          "h2": "Watching Pakistani dramas abroad",
          "body": [
            "Overseas Pakistanis often face slow hotel Wi-Fi or expensive roaming. Downloading episodes at home on Wi-Fi before you travel is the easiest way to keep up with your favourite drama without worrying about data. Some titles may not be available in every country."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Which Pakistani dramas can I download?",
          "a": "Free episodes published on ARY Plus. Premium titles that need a subscription or use DRM protection can't be downloaded."
        },
        {
          "q": "Can I download Pakistani dramas with English subtitles?",
          "a": "ARYPlusD saves the video as it is streamed. Subtitles burned into the picture are kept; separate subtitle tracks are not included."
        },
        {
          "q": "Is downloading Pakistani dramas free?",
          "a": "Yes, ARYPlusD is free and has no sign-up or daily limit."
        }
      ]
    },
    {
      "slug": "download-ary-dramas-on-android",
      "metaTitle": "How to Download ARY Dramas on Android Phone",
      "description": "Step-by-step guide to download ARY Plus dramas on Android with Chrome - no app needed. Find the episode link, pick 480p or 720p and save it as MP4 to your phone.",
      "h1": "How to Download ARY Dramas on Android",
      "label": "Download on Android",
      "intro": "You don't need to install an APK or an unknown downloader app to save ARY dramas on Android. Everything works in Chrome (or Samsung Internet) with ARYPlusD, and the episode lands in your phone's Downloads folder as a normal MP4.",
      "imageAlt": "An ARY drama episode saved as MP4 in an Android phone's Downloads folder",
      "sections": [
        {
          "h2": "Step 1 - Copy the episode link",
          "body": [
            "Open aryplus.tv in Chrome and go to the episode. Tap the address bar and copy the link, or use the Share button and choose Copy link. If you use the ARY Plus app, its share button also gives you a link you can copy."
          ]
        },
        {
          "h2": "Step 2 - Paste it into ARYPlusD",
          "body": [
            "Open aryplusd.com in Chrome, long-press the link box and tap Paste (or use the clipboard button), then tap Analyze."
          ]
        },
        {
          "h2": "Step 3 - Choose a quality and download",
          "body": [
            "Tap a quality tile. On Android phones 480p (about 120 MB) or 720p (about 220 MB) is the sweet spot between picture and storage. Tap Download and keep Chrome open; when the episode is ready Android saves it and shows a notification."
          ]
        },
        {
          "h2": "Where are downloaded dramas saved on Android?",
          "body": [
            "Open the Files app (or My Files on Samsung) and go to Downloads. You can play the MP4 in your gallery, VLC or MX Player, move it to an SD card, or share it to a TV with a USB stick."
          ]
        },
        {
          "h2": "Android tips",
          "list": [
            "Download on Wi-Fi to avoid using mobile data.",
            "If the download doesn't start, check Chrome is allowed to download files (Chrome settings → Downloads).",
            "Low on storage? Pick 240p - a full episode is only about 55 MB.",
            "Add aryplusd.com to your home screen from Chrome's menu for one-tap access."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Do I need an APK to download ARY dramas on Android?",
          "a": "No. ARYPlusD works in Chrome, so you don't have to install any APK or third-party app."
        },
        {
          "q": "Why can't I find the downloaded episode?",
          "a": "Look in Files → Downloads. Some phones also show it in the Gallery under Download."
        }
      ]
    },
    {
      "slug": "download-ary-dramas-on-iphone",
      "metaTitle": "How to Download ARY Dramas on iPhone & iPad",
      "description": "Download ARY Plus dramas on iPhone and iPad with Safari - no app. Save the MP4 to the Files app, then move it to Photos to watch offline. Easy step-by-step guide.",
      "h1": "How to Download ARY Dramas on iPhone and iPad",
      "label": "Download on iPhone",
      "intro": "iPhones and iPads can download files straight from Safari, so you can save ARY drama episodes without any App Store downloader. Here's exactly where the file goes and how to watch it offline.",
      "imageAlt": "Choosing a video quality for an ARY drama on iPhone",
      "sections": [
        {
          "h2": "Step 1 - Copy the ARY Plus link",
          "body": [
            "In Safari, open the episode on aryplus.tv, tap the Share icon and choose Copy. In the ARY Plus app, use its Share button and copy the link."
          ]
        },
        {
          "h2": "Step 2 - Open ARYPlusD in Safari",
          "body": [
            "Go to aryplusd.com, tap the link box, choose Paste and tap Analyze. Then tap the quality you want and press Download."
          ]
        },
        {
          "h2": "Step 3 - Find the episode in the Files app",
          "body": [
            "When the episode is ready, Safari asks to download it. Tap Download. Safari's download arrow (top of the screen) shows the progress; when it finishes the MP4 is in the Files app → On My iPhone (or iCloud Drive) → Downloads."
          ]
        },
        {
          "h2": "Move the episode to Photos (optional)",
          "body": [
            "Open the MP4 in Files, tap Share and choose Save Video. It then appears in the Photos app, where you can watch it like any other video."
          ]
        },
        {
          "h2": "iPhone tips",
          "list": [
            "Keep Safari open until the episode has finished preparing.",
            "720p looks sharp on every iPhone screen and keeps files around 220 MB.",
            "Change where Safari saves files in Settings → Safari → Downloads.",
            "Add aryplusd.com to your Home Screen via Share → Add to Home Screen."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Does it work on older iPhones?",
          "a": "Yes, on any iPhone or iPad with iOS 13 or later, which added downloads to Safari."
        },
        {
          "q": "Can I use Chrome on iPhone?",
          "a": "Yes, but Safari gives the simplest download experience on iOS."
        }
      ]
    },
    {
      "slug": "download-ary-dramas-on-pc",
      "metaTitle": "Download ARY Dramas on PC, Laptop & Mac in HD",
      "description": "Download ARY Plus dramas on Windows PC, laptop or Mac in 1080p or 4K. Save MP4 episodes with any browser and watch on your computer or TV. Free, no software.",
      "h1": "Download ARY Dramas on PC, Laptop and Mac",
      "label": "Download on PC & Mac",
      "intro": "On a computer you can enjoy ARY dramas in Full HD or even 4K. ARYPlusD works in Chrome, Edge, Firefox and Safari on Windows, macOS and Linux - no software or browser extension to install.",
      "imageAlt": "An ARY drama episode downloaded on a laptop in HD",
      "sections": [
        {
          "h2": "How to download ARY dramas on Windows or Mac",
          "list": [
            "Open the episode on aryplus.tv and copy the URL from the address bar (Ctrl+C or Cmd+C).",
            "Open aryplusd.com and paste the link (Ctrl+V or Cmd+V), then press Enter.",
            "Click the 1080p or 4K tile for the best picture, then click Download.",
            "The MP4 appears in your Downloads folder when it is ready."
          ]
        },
        {
          "h2": "Best quality for laptops, monitors and TVs",
          "body": [
            "1080p Full HD (about 440 MB per 40-minute episode) looks great on laptops and most TVs. If you have a 4K TV or monitor and the drama is published in 2160p, choose 4K (around 1.4 GB). 720p is a good compromise if your disk is nearly full."
          ]
        },
        {
          "h2": "Play ARY dramas on your TV",
          "body": [
            "Copy the downloaded MP4 to a USB stick and plug it into your smart TV, or cast it from your laptop. MP4 (H.264 video, AAC audio) is supported by virtually every TV, laptop and media player, including VLC, Windows Media Player and QuickTime."
          ]
        },
        {
          "h2": "Downloading several episodes",
          "body": [
            "Paste a drama (series) link to see every episode. Start one download, then pick the next episode - three run at the same time, any extra ones wait in line, and each is saved automatically when it finishes."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Do I need to install software on my PC?",
          "a": "No. ARYPlusD runs in your browser; no installer or extension is needed."
        },
        {
          "q": "Can I download ARY dramas in 4K?",
          "a": "Yes, when the episode is published in 2160p. The 4K tile only appears for titles that offer it."
        }
      ]
    },
    {
      "slug": "watch-ary-dramas-offline",
      "metaTitle": "Watch ARY Dramas Offline Without Internet",
      "description": "How to watch ARY Digital dramas offline: download episodes once on Wi-Fi and watch without internet on phone, laptop or TV. Save data and avoid buffering.",
      "h1": "How to Watch ARY Dramas Offline",
      "label": "Watch dramas offline",
      "intro": "Slow internet, load-shedding, long journeys and expensive data packages all get in the way of your favourite drama. The simple fix is to download ARY drama episodes while you have Wi-Fi and watch them later - no internet needed.",
      "imageAlt": "ARY drama episodes saved for offline viewing",
      "sections": [
        {
          "h2": "Download once, watch anywhere",
          "body": [
            "With ARYPlusD you save each episode as a standard MP4 file. Once it is on your phone or laptop it plays without internet, as many times as you like, in any video player."
          ]
        },
        {
          "h2": "How much data does an ARY drama episode use?",
          "body": [
            "Approximate size of one 40-minute episode by quality:"
          ],
          "list": [
            "240p - about 55 MB",
            "480p - about 120 MB",
            "720p - about 220 MB",
            "1080p - about 440 MB",
            "4K - about 1.4 GB"
          ]
        },
        {
          "h2": "Save data on mobile packages",
          "body": [
            "Streaming re-downloads the video every time you watch, and adaptive streaming often jumps to high quality without asking. Downloading in 240p or 480p on Wi-Fi and watching offline can cut your mobile data use for dramas to almost zero."
          ]
        },
        {
          "h2": "Plan for travel and load-shedding",
          "list": [
            "Download the latest episodes on home or office Wi-Fi the night before.",
            "Keep your phone charged - offline playback uses less battery than streaming.",
            "Use a USB stick to watch on a TV or car screen.",
            "Delete episodes you've watched to free up storage."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Can I watch downloaded episodes without the internet?",
          "a": "Yes. Once the MP4 is saved on your device it plays fully offline."
        },
        {
          "q": "Do downloaded episodes expire?",
          "a": "No. The MP4 stays on your device until you delete it."
        }
      ]
    },
    {
      "slug": "ary-plus-to-mp4",
      "metaTitle": "ARY Plus to MP4 Converter - Save Episodes as MP4",
      "description": "Convert ARY Plus videos to MP4 online. ARYPlusD saves ARY Plus episodes as a single MP4 file that plays on any phone, PC or TV, in 240p to 4K. Free.",
      "h1": "ARY Plus to MP4 - Save Any Free Episode as an MP4 File",
      "label": "ARY Plus to MP4",
      "intro": "ARY Plus streams episodes in hundreds of small video pieces. ARYPlusD downloads those pieces and joins them into one clean MP4 file - the most compatible video format there is - so it plays everywhere.",
      "imageAlt": "Converting an ARY Plus episode to MP4 in the chosen quality",
      "sections": [
        {
          "h2": "Why MP4?",
          "body": [
            "MP4 with H.264 video and AAC audio plays on Android, iPhone, Windows, Mac, smart TVs, game consoles and car screens without extra apps. It also lets you skip forward and back instantly, which streamed episodes don't always allow offline."
          ]
        },
        {
          "h2": "How the ARY Plus to MP4 conversion works",
          "body": [
            "When you choose a quality, ARYPlusD fetches the episode's video pieces in parallel for speed and joins them into a single MP4 without re-encoding, so there is no loss in picture or sound quality. The finished file is sent to your device and immediately deleted from our server."
          ]
        },
        {
          "h2": "Choose the MP4 quality",
          "body": [
            "Every tile shows the real size of the finished MP4 before you start - measured from the actual stream, not guessed - so you know exactly how much space it needs."
          ]
        }
      ],
      "faqs": [
        {
          "q": "Does converting to MP4 reduce quality?",
          "a": "No. The video is joined into MP4 without re-encoding, so quality is identical to the stream you chose."
        },
        {
          "q": "Can I convert ARY Plus to MP3 audio?",
          "a": "Not at the moment - ARYPlusD saves the full video as MP4."
        }
      ]
    }
  ] as GuideText[],
};

export interface Section {
  h2: string;
  body?: string[];
  list?: string[];
  ordered?: string[];
  after?: string[];
}

export interface GuideText {
  slug: string;
  metaTitle: string;
  description: string;
  h1: string;
  label: string;
  intro: string;
  imageAlt?: string;
  sections: Section[];
  faqs: { q: string; a: string }[];
}

export type Dictionary = typeof en;
export default en;
