"use client";

import Script from "next/script";

const PIXEL_ID = "1128247570557270";

export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          var consented = localStorage.getItem('cookie_consent') === 'accepted';
          fbq('dataProcessingOptions', consented ? [] : ['LDU'], 0, 0);
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');

          window.addEventListener('cookie_consent_accepted', function () {
            fbq('dataProcessingOptions', []);
          });
        `}
      </Script>
      {/* Server-rendered fallback: makes the pixel visible to crawlers/checkers
          that read raw HTML instead of executing JS (next/script's
          afterInteractive scripts are injected client-side only). */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
