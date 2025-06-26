"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";


interface Guest {
  name: string;
}

export default function Home() {
  // Video & countdown refs/state
  const videoRef = useRef<HTMLVideoElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const heartContainerRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videos = ["/assets/background_video.mp4"];
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Formspree form state
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState('');
  const [guests, setGuests] = useState<Guest[]>([{ name: '' }]);
  const [attendance, setAttendance] = useState<"accept" | "decline" | "">("");
  const MAX_GUESTS = 1; // change this to 1, 2, or 3 to allow 2–4 total people
  
  const removeGuest = (index: number) => {
    setGuests((prev) => prev.filter((_, i) => i !== index))
  }
  // Countdown effect
  useEffect(() => {
    const target = new Date("2025-08-24T00:00:00");
    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return clearInterval(id);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    if (videoRef.current) videoRef.current.muted = isMuted;
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isMuted]);

  // Video start, hearts effect
  useEffect(() => {
    const handleStart = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsStarted(true);
      if (videoRef.current) {
        videoRef.current.src = videos[0];
        videoRef.current.play().catch(console.error);
      }
    };
    startBtnRef.current?.addEventListener("click", handleStart);

    const createHeart = () => {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.innerHTML = "♡";
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.animationDuration = `${3 + Math.random() * 3}s`;
      heart.style.fontSize = `${16 + Math.random() * 16}px`;
      heartContainerRef.current?.appendChild(heart);
      setTimeout(() => heart.remove(), 6000);
    };
    const intervalId = setInterval(createHeart, 300);

    return () => {
      startBtnRef.current?.removeEventListener("click", handleStart);
      clearInterval(intervalId);
    };
  }, []);

 const handleSubmit = async (e: React.FormEvent) => {
  console.log("Submitting RSVP", {
    attendance,
    guests,
  });
  e.preventDefault();
  setLoading(true); // Start loading

  try {
    const res = await fetch("/api/rsvp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({
        attendance,
        guests,
      }),
    });
    // alert(email);
  
    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Failed to submit RSVP.");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting form.");
  } finally {
    setLoading(false); // End loading
  }
};
  
if (submitted) {
  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
      <svg className="w-12 h-12 text-gold mx-auto mb-4" viewBox="0 0 24 24">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
        />
      </svg>
      <h2 className="text-2xl font-script mb-2">Thank You!</h2>
      <p className="font-serif text-gray-700">Your RSVP has been received.</p>
      <button
        onClick={() => setSubmitted(false)}
        className="mt-6 border border-black px-4 py-2 rounded-lg text-black hover:bg-black hover:text-white transition"
      >
        Close
      </button>
    </div>
  </div>
);}
//    {submitted && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
//       <svg className="w-12 h-12 text-gold mx-auto mb-4" viewBox="0 0 24 24">
//         <path
//           d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
//              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 
//              2.09C13.09 3.81 14.76 3 16.5 3 
//              19.58 3 22 5.42 22 8.5c0 3.78-3.4 
//              6.86-8.55 11.54L12 21.35z"
//           fill="currentColor"
//         />
//       </svg>
//       <h2 className="text-2xl font-script mb-2">Thank You!</h2>
//       <p className="font-serif text-gray-700">Your RSVP has been received.</p>
//       <button
//         onClick={() => setSubmitted(false)}
//         className="mt-6 border border-black px-4 py-2 rounded-lg text-black hover:bg-black hover:text-white transition"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}

 const toggleMute = () => setIsMuted(prev => !prev);
 const addGuest = () => {
  if (guests.length < MAX_GUESTS + 1) {
    setGuests([...guests, { name: '' }]);
  }
};

  const updateGuestName = (index: number, name: string) => {
    const updated = [...guests];
    updated[index].name = name;
    setGuests(updated);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wedding of Elias &amp; Reine</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      </Head>

      
      <div id="background-container">
        <video
          autoPlay
          loop
          playsInline
          id="bg-video"
          ref={videoRef}
          poster="/assets/background-thumbnail.jpg"
          style={{ opacity: isStarted ? 1 : 0.5 }}
        >
          <source src="/assets/background-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Landing Overlay */}
      {!isStarted && (
        <div id="landing-overlay">
          <button id="start-btn" ref={startBtnRef}>
            Start
          </button>
        </div>
      )}

      {/* Mute Toggle Button */}
      <button id="mute-toggle" onClick={toggleMute}>
        {isMuted ? (
          // Muted: filled heart with muted icon
          <svg width="60" height="60" viewBox="0 0 35 35"   style={{ background: "none" }}>
            <path
              d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 
                 0-3.791 3.068-5.191 5.281-5.191 
                 1.312 0 4.151.501 5.719 4.457 
                 1.59-3.968 4.464-4.447 5.726-4.447 
                 2.54 0 5.274 1.621 5.274 5.181 
                 0 4.069-5.136 8.625-11 14.402
                 m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238
                 -1.285-2.206-3.522-3.248-5.719-3.248
                 -3.183 0-6.281 2.187-6.281 6.191 
                 0 4.661 5.571 9.429 12 15.809 
                 6.43-6.38 12-11.148 12-15.809 
                 0-4.011-3.095-6.181-6.274-6.181"
              fill="black"
              stroke="black"
              strokeWidth="0.5"
            />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fill="black"
              fontSize="8"
              fontFamily="sans-serif"
            >
              🎵
            </text>
          </svg>
        ) : (
          // Unmuted: outlined heart with unmuted icon
          <svg width="60" height="60" viewBox="0 0 35 35" style={{ background: "none" }}>
            <path
              d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 
                 0-3.791 3.068-5.191 5.281-5.191 
                 1.312 0 4.151.501 5.719 4.457 
                 1.59-3.968 4.464-4.447 5.726-4.447 
                 2.54 0 5.274 1.621 5.274 5.181 
                 0 4.069-5.136 8.625-11 14.402
                 m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238
                 -1.285-2.206-3.522-3.248-5.719-3.248
                 -3.183 0-6.281 2.187-6.281 6.191 
                 0 4.661 5.571 9.429 12 15.809 
                 6.43-6.38 12-11.148 12-15.809 
                 0-4.011-3.095-6.181-6.274-6.181"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fill="white"
              stroke="white"
              fontSize="8"
              fontFamily="sans-serif"
            >
              🎶
            </text>
          </svg>
        )}
      </button>

      {/* Main Content Container */}
      <div id="content-container" className={isStarted ? "visible" : "hidden"}>
        {/* ─── HERO SECTION ──────────────────────────────────────────── */}
      <section id="hero-section">
        <div className="hero-letters">
          <span className="hero-e">E</span>
          <span className="hero-amp">&</span>
          <span className="hero-r">R</span>
        </div>

        <div className="hero-subtext">
          <p>Therefore what God has joined together, let no one separate</p>
          <p className="parents">
            Mr. &amp; Mrs. Gharbieh<br/>
            Mr. &amp; Mrs. Zakhour
          </p>
          <p className="invite">
            Request the honor of your presence at the wedding of their son and daughter
          </p>
          <p className="names">
            Elias<br/>&amp;<br/>Reine
          </p>
          <p>Sunday, August 24th, 2025</p>

          <div className="countdown">
            <div>
              <span>{timeLeft.days}</span>
              Days
            </div>
            <div>
              <span>{timeLeft.hours}</span>
              Hours
            </div>
            <div>
              <span>{timeLeft.minutes}</span>
              Minutes
            </div>
            <div>
              <span>{timeLeft.seconds}</span>
              Seconds
            </div>
          </div>
        </div>
      </section>

             <section className="detail-section">
         <h2>Wedding Ceremony</h2>
         <div className="location-block">
           {/* location pin SVG */}
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3c2f2f" viewBox="0 0 24 24">
             <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5
                      s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
           </svg>
           <span>St. Challita – 6:00 PM</span>
         </div>
         <p>Andaket</p>
         <p style={{ margin: '1.5em 0 0' }}>Sword Arch Ceremony will follow – 6:45 PM</p>
        <a
          className="map-button"
           href="https://maps.google.com/?q=St.+Challita+Andaket"
           target="_blank"
          rel="noopener noreferrer"
         >
           Map
         </a>
       </section>

        {/* <section className="double-card animated-section">
          <div className="card half-card">
            <h2>Bride’s Story</h2>
            <p>
              Once upon a time, Reine dreamed of a beautiful day filled with
              roses...
            </p>
          </div>
          <div className="ring"></div>
          <div className="card half-card">
            <h2>Groom’s Story</h2>
            <p>
              Elias, the charming hero of this tale, knew she was the one when...
            </p>
          </div>
        </section> */}

     {/* ─── CELEBRATION SECTION ─────────────────────────────────── */}
     <section className="detail-section">
       <h2>The Celebration</h2>

       <div className="location-block">
         {/* same map‑pin SVG */}
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3c2f2f" viewBox="0 0 24 24">
           <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5
                    c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
         </svg>
         <span>Al Sayyad Restaurant</span>
       </div>

       <p>Beino</p>

       <a
         className="map-button"
                  href="https://maps.app.goo.gl/JG2SdQ26GZCYsg156?g_st=com.google.maps.preview.copy"
         target="_blank"
         rel="noopener noreferrer"
       >
         Map
       </a>
     </section>
     <section className="detail-section">
       <h2>Gift Registry</h2>
       <p>You love, laughter and presence are all we could wish for on our special day. For those who wish, a wedding list is available</p>

      
     {/* ─── WISH ACCOUNT ───────────────────────────────────────── */}
      <div className="account-block">
        <span className="account-label">Wish Account</span>
       
       
      
      </div>
       <div className="account-block">
        <button
          className="copy-btn"
          onClick={() =>
            navigator.clipboard.writeText("Acc#20738868-01")
          }
          aria-label="Copy account number"
        >
          {/* simple copy icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#3c2f2f"
          >
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14
                     c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7
                     c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
       <p className="account-code">Acc#20738868-01</p>
      
       </div>
     <div className="account-block">
         
      
        <button
          className="copy-btn"
          onClick={() =>
            navigator.clipboard.writeText("+96103145404")
          }
          aria-label="Copy account number"
        >
          {/* simple copy icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#3c2f2f"
          >
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14
                     c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7
                     c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
       <p className="account-code">+96103145404</p>
       </div>
     </section>
 
     <section className=" bg-cream py-16">
  <div className="max-w-xl mx-auto px-4 detail-section">
    {/* Title */}
    <h2 className="font-script text-5xl text-center mb-2">Be Our Guest</h2>

    {/* Reply‑by + persons */}
    <p className="font-serif italic text-center mb-1">
      Please reply before <strong>July 02, 2025</strong>
    </p>
    <p className="font-serif italic text-center mb-8">
      Number of persons: 2
    </p>

    {/* Question */}
    <p className="font-serif italic text-center mb-6">Are you attending?</p>

    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Accept / Decline */}
    
      <div className="flex justify-between w-[300px] mx-auto">
      {["accept", "decline"].map((opt) => {
          const isAccept = opt === "accept";
          const selected = attendance === opt;
          return (
            <label
              key={opt}
              className={`flex items-center gap-2 cursor-pointer border-2 rounded-lg px-6 py-3 transition ${
                selected
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-black hover:text-white"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value={opt}
                checked={attendance === opt}
                onChange={() => setAttendance(opt as "accept" | "decline")}
                className="sr-only"
                required={isAccept}
              />
              <span className="text-xl">
                {selected ? "♥" : "♡"}
              </span>
              <span>
                {isAccept ? "Joyfully Accept" : "Respectfully Decline"}
              </span>
            </label>
          );
        })}
      </div>
    
      <div className="flex justify-between w-[300px] mx-auto"><p></p></div>
      <div className="flex flex-col items-center space-y-4">
  {guests.map((g, i) => (
    <div
      key={i}
      className="flex items-center justify-center w-3/4 gap-3"
    >
      <input
        type="text"
        name={`guest-${i + 1}`}
        value={g.name}
        onChange={(e) => updateGuestName(i, e.target.value)}
        placeholder={i === 0 ? "Your Name" : `Guest ${i + 1} Name`}
        className="w-full h-[50px] border-2 border-black px-5 text-lg placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold bg-white shadow-md"
        required
      />
      {i > 0 && (
        <button
          type="button"
          onClick={() => removeGuest(i)}
          className="p-2 hover:bg-red-100 transition"
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.99997 8H6.5M6.5 8V18C6.5 19.1046 7.39543 20 8.5 20H15.5C16.6046 20 17.5 19.1046 17.5 18V8M6.5 8H17.5M17.5 8H19M9 5H15M9.99997 11.5V16.5M14 11.5V16.5"
              stroke="#464455"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  ))}
</div>


<div className="flex justify-between w-[300px] mx-auto"><p></p></div>


      {/* Add Person */}
      <div className="text-center">
      <button
  type="button"
  onClick={addGuest}
  disabled={guests.length >= MAX_GUESTS + 1}
  className={`w-3/4 h-[40px] border-2 border-black p-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white shadow-md ${
    guests.length >= MAX_GUESTS + 1 ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  + Add Person
</button>

      </div>
{/*       <div className="flex justify-between w-[300px] mx-auto"><p></p></div>
      <div className="text-center">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email (optional)"
        className="w-3/4 h-[40px] border-2 border-black p-4 text-lg placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-gold bg-white shadow-md"
        />
      </div>     */}

<div className="flex justify-between w-[300px] mx-auto"><p></p></div>
      {/* Submit */}
      <div className="text-center w-3/4 mx-auto space-y-4">
      <button
  type="submit"
  disabled={loading}
  className={`w-full h-[50px] border-2 border-black bg-black text-black text-lg font-serif ${
    loading ? 'bg-gray-200 cursor-wait' : ''
  }`}
>
  {loading ? "Sending…" : "Submit RSVP"}
</button>

</div>

    </form>
  </div>
</section>

       <footer className="animated-section text-center">
  {/* Couple Image */}
  <div className="w-full">
    <img
      src="/assets/couple.JPG" // <-- replace with your actual path
      alt="Couple"
      className="rounded-xl shadow-md w-full h-auto object-cover"
    />
  </div>

  {/* Footer Text */}
  <p>Made with love 💕 by the couple</p>
</footer>
        
      </div>
      

      <div className="floating-hearts-container" ref={heartContainerRef}></div>
     
    </>
  );
}
