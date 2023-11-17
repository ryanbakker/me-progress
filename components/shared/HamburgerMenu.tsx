"use client";

import { mobileLinks } from "@/constants";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement; // Select the HTML element

    if (isOpen) {
      // Add the class to toggle scrolling
      htmlElement.classList.add("disable-scroll");
    } else {
      // Remove the class to enable scrolling
      htmlElement.classList.remove("disable-scroll");
    }

    // Clean up the effect when the component unmounts
    return () => {
      htmlElement.classList.remove("disable-scroll");
    };
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Close the mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const handleLinkClick = (id: string, href: string) => {
    // Check if the clicked link is the "Home" link
    if (id === "home") {
      closeMobileMenu();
    } else {
      // Close the menu and open the link in a new tab
      closeMobileMenu();
      window.open(href, "_blank");
    }
  };

  return (
    <div className="flex justify-between items-center ml-auto">
      <Link
        href="/"
        className={`z-[1000] absolute left-8 text-white delay-1000 transition-all ${
          isOpen ? "inline-flex" : "hidden"
        }`}
      >
        <h1 className="text-2xl font-rubik tracking-tighter mr-4">
          me<span className="text-red-500 font-extralight">|</span>
          Progress
        </h1>
      </Link>
      <button
        className={`hamburger_icon lg:hidden flex items-center ml-auto ${
          isOpen ? "hamburger_active" : ""
        }`}
        onClick={handleClick}
        aria-label="hamburger button"
      >
        <span
          className={`hamburger_line hamburger_icon_line_top ${
            isOpen && "!bg-white"
          }`}
        />
        <span
          className={`hamburger_line hamburger_icon_line_middle ${
            isOpen && "!bg-white"
          }`}
        />
        <span
          className={`hamburger_line hamburger_icon_line_bottom ${
            isOpen && "!bg-white"
          }`}
        />
      </button>

      <div
        className={`menu_container_box relative ${
          isOpen ? "menu-open" : "menu-closed"
        }`}
      >
        <div
          className={`menu_container_backdrop ${
            isOpen ? "backdrop-open" : "backdrop-closed"
          }`}
        ></div>
        <nav
          className={`menu_container md:hidden w-full pt-9 bg-slate-700 ${
            isOpen ? "menu-open" : "menu-closed"
          }`}
        >
          <ul className="flex gap-14 items-center flex-s">
            {mobileLinks.map((link) => {
              return (
                <li key={link.name}>
                  <button
                    className="nav_link mobile_link_lg text-white hover:text-white/70 transition-all"
                    onClick={() => {
                      handleLinkClick(link.name, link.route);
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
