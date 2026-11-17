"use client";

import Script from "next/script";

export default function OpenAIPixel() {
  return (
    <Script
      id="openai-measurement-pixel"
      strategy="beforeInteractive"
    >
      {`
        (function (w, d, s, u) {
          if (w.oaiq) return;

          var q = function () {
            q.q.push(arguments);
          };

          q.q = [];
          w.oaiq = q;

          var js = d.createElement(s);
          js.async = true;
          js.src = u;

          var f = d.getElementsByTagName(s)[0];
          f.parentNode.insertBefore(js, f);

        })(window, document, "script",
          "https://bzrcdn.openai.com/sdk/oaiq.min.js"
        );

        oaiq("init", {
          pixelId: ${JSON.stringify(process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID || 'QA8NvqgfKhQJvMGevodsde')},
          debug: ${process.env.NODE_ENV !== 'production'}
        });
      `}
    </Script>
  );
}