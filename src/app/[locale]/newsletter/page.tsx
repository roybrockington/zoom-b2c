"use client";

import { useState } from "react";
import Image from "next/image";

export default function NewsletterPage() {
const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);


    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="mb-8 flex justify-center">
                    <Image src="/logo.svg" alt="Zoom" width={140} height={60} />
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <>
                            <h1 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
                                Stay in the loop
                            </h1>
                            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                                Sign up for the Zoom newsletter and be the first to hear about new products, exclusive offers, and updates.
                            </p>

                            

                                    
    <div id="mc_embed_shell">
      <div id="mc_embed_signup">
        <form
          action="https://zoom-europe.us9.list-manage.com/subscribe/post?u=ebbeb7f485892a2aa1b0b4187&id=443188377d&f_id=0089c2e1f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_self"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <div className="indicates-required text-xs text-red-700 flex justify-center mb-5">
              <span className="asterisk">*</span> indicates required
            </div>

            <div className="mc-field-group flex flex-col my-4">
              <label htmlFor="mce-EMAIL">
                Email Address <span className="asterisk">*</span>
              </label>
              <input
                type="email"
                name="EMAIL"
                className="required email border border-zinc-300 rounded"
                id="mce-EMAIL"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mc-field-group flex flex-col my-4">
              <label htmlFor="mce-FNAME">First Name</label>
              <input
                type="text"
                name="FNAME"
                className="text border border-zinc-300 rounded"
                id="mce-FNAME"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mc-field-group flex flex-col my-4">
              <label htmlFor="mce-LNAME">Last Name</label>
              <input
                type="text"
                name="LNAME"
                className="text border border-zinc-300 rounded"
                id="mce-LNAME"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div hidden>
              <input type="hidden" name="tags" value="470,472" />
            </div>

            <div id="mce-responses" className="clear">
              <div className="response" id="mce-error-response" style={{ display: "none" }} />
              <div className="response" id="mce-success-response" style={{ display: "none" }} />
            </div>

            {/* Honeypot field to detect bots — must stay hidden */}
            <div aria-hidden="true" className="absolute -left-[5000px]">
              <input
                type="text"
                name="b_ebbeb7f485892a2aa1b0b4187_443188377d"
                tabIndex={-1}
                defaultValue=""
              />
            </div>

            <div className="clear flex justify-center flex-col">
              <input
                type="submit"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button mt-6 inline-block rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-900 cursor-pointer"
                value="Subscribe"
                onClick={() => setLoading(true)}
              />
              {loading && (
                <svg
                  className="ml-2 inline-block h-4 w-4 animate-spin text-zinc-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>



                            <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
                                You can unsubscribe at any time. We respect your privacy.
                            </p>
                        </>
                    
                </div>
            </div>
        </div>
    );
}
