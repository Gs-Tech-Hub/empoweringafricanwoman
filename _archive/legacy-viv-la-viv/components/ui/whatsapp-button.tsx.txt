"use client";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/?text=Hi! I'd like to inquire about Viv La Viv Boutique collections and services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition duration-300 hover:bg-green-600 hover:shadow-xl md:bottom-8 md:right-8 md:h-16 md:w-16"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
        <title>WhatsApp</title>
        <path fill="currentColor" d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 0 5.373 0 12c0 2.116.553 4.18 1.6 6.02L0 24l6.2-1.6A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.197-1.246-6.205-3.48-8.52zM12 21.5c-1.845 0-3.626-.49-5.18-1.416l-.372-.221-3.68.95.981-3.6-.243-.374A9.5 9.5 0 012.5 12c0-5.247 4.253-9.5 9.5-9.5s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5zM17.14 14.06c-.25-.125-1.477-.73-1.706-.814-.229-.084-.396-.125-.564.125-.168.25-.648.814-.794.98-.146.167-.292.188-.542.063-.25-.125-1.054-.388-2.006-1.24-.742-.66-1.242-1.476-1.39-1.726-.146-.25-.016-.385.109-.51.112-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.167.042-.313-.021-.438-.063-.125-.564-1.356-.772-1.856-.203-.49-.41-.426-.564-.434l-.48-.009c-.167 0-.438.063-.668.313s-.876.86-.876 2.096.9 2.433 1.027 2.602c.125.167 1.777 2.71 4.305 3.797 1.2.52 2.135.83 2.868 1.063.  ."></path>
      </svg>
    </a>
  );
}
