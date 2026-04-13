import Image from "next/image";

const IMG_BASE = "https://media.sound-service.eu/zoom/home-seo/";

const tiles: { name: string; image: string; text: string; }[] = [
    { 
      name: "Handy Recorders",
      image: "zoom-home-handy-recorders.webp",
      text: "The best-known ZOOM products are probably our Handy Recorders. As the name suggests, these recorders are super practical and convenient. Handy Recorders let you create digital audio recordings and can be used for a variety of applications. For example, you can use a Handy Recorder just like you would have used a cassette recorder in the past. Handy Recorders also have built-in microphones, so they can record on the go without additional equipment. If you’re a musician, you can use them to record yourself or your band. Or you can go out into nature and simply record sounds. This might be the chirping of a cricket, the sound of the sea or even the noise of a construction site. If you are a filmmaker or like to produce videos, you can mount a Handy Recorder on the hot shoe of your camera and record the perfect sound to go with your video."
    },
    { 
      name: "Field Recorders",
      image: "zoom-home-field-recorders.webp",
      text: "Field Recorders are professional audio recording devices for outdoor recordings in professional settings such as film productions, television recordings, broadcast productions and news reports. Field recorders are often multi-track recorders and have multiple inputs and recording tracks. Unlike our Handy Recorders, Field Recorders do not have a built-in microphone, and are mostly designed to work with external microphones. Field Recorders are tools that have to withstand continuous daily use in a professional environment and are therefore extremely robustly built and designed for operational reliability. They allow additional backup recordings to be created automatically on extra tracks, or the audio material to be recorded on two memory cards simultaneously."
    },
    { 
      name: "Podcast Records",
      image: "zoom-home-podcast-recorders.webp",
      text: "Podcast recorders and podcast studios are audio recorders designed especially for podcast recording and production. Podcast recorders are designed to be as simple and intuitive to use as possible. They usually offer multiple microphone inputs and recording tracks, so you can record an interview with two or more people at the same time. If the person being interviewed or the talk show guest is not in the same room, podcast recorders offer the option of connecting a smartphone and thus adding a guest via telephone. The caller is then recorded normally, as if he were sitting in the room, but receives a mix-minus signal back over the telephone line as a monitor signal."
    },
    { 
      name: "Handy Video Recorders",
      image: "zoom-home-video-recorders.webp",
      text: "Handy Video Recorders are a separate product category created by us. Our Handy Video Recorders add video recording capabilities to our popular Handy Recorders. So, they are essentially Handy Recorders with an integrated video camera. They are just as handy and compact and easy to use as a Handy Recorder, making them perfect for musicians who expect the highest audio quality for their video recordings, too. Unlike smartphones or digital cameras, Handy Video Recorders have built-in or even interchangeable studio-quality stereo microphones and can record audio at up to 24-bit/96 kHz on two or four tracks in addition to the video signal."
    },
    { 
      name: "iOS / Android Microphones",
      image: "zoom-home-mobile-recorders.webp",
      text: "Our stereo microphones for iPhone, iPad, iPod, and Android smartphones are the perfect accessory for any content creator who owns a smartphone. A smartphone can do an incredible amount these days, but when it comes to audio recording quality in particular, it's natural to expect a reduction in quality. This is quite understandable, as the size of a smartphone means there is no room for professional microphone capsules with an adequate diaphragm diameter. Our iOS/Android microphones are the perfect solution to this problem. Based on the microphone technology of our popular Handy Recorders, the microphones add a stereo microphone to any smartphone for professional-quality audio recording. This allows you to turn your smartphone into a mobile audio recorder."
    },
    { 
      name: "Audio Interfaces",
      image: "zoom-home-interfaces.webp",
      text: "Audio interfaces are the professional version of the sound card or sound chip already found in most computers. Mostly available as an external, compact desktop unit or 19\" rack unit, these interfaces greatly enhance and expand the audio functionality of a computer. They are usually connected via USB, although there are also devices that support other interfaces. In addition, audio interfaces often also have built-in microphone preamps like in a mixer, allowing you to connect professional studio microphones or instruments directly. The inputs and outputs are usually 3-pin XLR or 6.3 mm jack sockets. Audio interfaces are therefore ideal if you want to make audio recordings with your computer or use audio applications such as audio editing software, DAW software or DJ software on your computer."
    },
    { 
      name: "Digital Mixer & Multi-Track Recorders",
      image: "zoom-home-mixers.webp",
      text: "Digital mixers are – as the name suggests – the digital version of an audio mixer. The main task of a mixer is to mix – or sum – several audio signals together into one signal. When mixing, the volume ratios of the original individual signals are then adjusted to each other in the mixer, usually via faders, and the sound of the individual signals can be processed using various tools such as equalisers or control amplifiers. A digital mixer has one or more internal processors, meaning many tools such as equalisers, compressors or even effects like reverb, chorus and delay can be rendered on it, so you don’t need any additional external devices. The design of a digital mixer is similar to that of an audio interface. Studio microphones, handheld microphones and instruments can all be connected directly via professional XLR inputs or jack sockets."
    },
    { 
      name: "Multi Effects",
      image: "zoom-home-multieffects.webp",
      text: "Multi-effects are effects processors that essentially combine several effects units in a single device. Multi-effects processors are digital devices with an internal processor and can thus produce multiple different effects simultaneously. The individual effects are rendered on the DSP using effect algorithms, so depending on the processor power you can also combine several effect algorithms with each other in any order. The advantage of a digital multi-effects processor is that the internal DSP can also handle features other than effects such as reverb, chorus, delay, overdrive, distortion, pitch shifter, wah-wah, and many more. For example, some multi-effects processors offer algorithms that simulate a guitar and/or bass amplifier (amp modeling). Speaker emulations (Cab emulators) are usually available to go with this, giving guitarists and bassists everything you need to create your own personal guitar or bass sound in a single device."
    },
    { 
      name: "Vocal Processors",
      image: "zoom-home-vocal.webp",
      text: "Vocal processors are multi-effects units that offer special effects for vocals. Like a multi-effects processor for guitar, a vocal processor or voice processor uses effects algorithms on a DSP so that effects can be switched easily, and multiple effects can even be used simultaneously. In this case, however, the effects algorithms used are particularly suitable for vocals and have been optimized accordingly. Vocal processors are mostly used to enhance the voice and vocals on stage, in the rehearsal room or in the studio. Depending on the effect used, a vocal processor can also be used to significantly distort and alter your voice, allowing you to use vocal effects as a creative stylistic device for your vocal performance."
    },
    { 
      name: "Microphones",
      image: "zoom-home-microphones.webp",
      text: "A microphone is a sound transducer that converts acoustic signals into an electrical signal so that it can then be recorded, processed or amplified and played back. At the heart of a microphone is the microphone capsule. The microphone capsule has a diaphragm that is moved by sound, which then generates an electrical signal. This is done differently depending on the design of the microphone. The best-known types of microphones are the dynamic microphone and the condenser microphone. Dynamic microphones are usually more robust and are therefore popular for live use on stage or at events. Condenser microphones are more complex in their design and require phantom power for operation. This is usually 48V and is supplied by the microphone preamp, mixer, vocal processor or audio interface."
    },
];

export default async function CreatorProse() {

  if (tiles.length === 0) return null;

  return (
    <section id="mostWanted" className="py-10">
      <h2 className="mb-6 text-xl text-zinc-900 dark:text-white">
        <span className="font-bold">WE'RE ZOOM.</span> AND WE'RE FOR CREATORS.
      </h2>
      <p className="my-7">
        Welcome to the official ZOOM-Europe online store! We offer the perfect equipment for musicians, podcasters, filmmakers, sound designers and streamers – we want to help you bring your creative ideas to life with our products.
    </p>
      <p className="my-7">
    Zoom produces a wide range of products for creative professionals of all kinds, including mobile recorders for musicians, journalists and filmmakers, professional multi-track recorders for sound designers and filmmakers, multi-effects processors for guitarists and bassists, digital mixers for bands, solo artists, recording studios and podcasters, audio interfaces for musicians, live streamers and content creators, all-in-one compact studios for musicians, video cameras for content creators of all kinds, microphones for Android and iOS smartphone users, vocal processors for singers, analogue and USB microphones for a variety of applications, and podcast recorders and podcast studios designed specifically for podcasters.
    </p>
      <div className="w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        {tiles.map((tile, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={tile.name}
              className={`flex flex-col gap-14 py-12 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}
            >
              <div className="md:w-2/5 shrink-0">
                <Image
                  src={`${IMG_BASE}${tile.image}`}
                  alt={tile.name}
                  width={600}
                  height={400}
                  className="w-full rounded-xl object-cover shadow-md"
                />
              </div>
              <div className="md:w-3/5">
                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
                  {tile.name}
                </h3>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: tile.text }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

