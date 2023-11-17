"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Image from "next/image";
import { blogLinks, whereLinks } from "@/constants";

function NavMenu() {
  return (
    <nav>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[18rem]">
              <ul className="flex flex-col p-3 gap-1">
                {blogLinks.map((link) => {
                  return (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.route}
                          className="flex gap-3 items-start hover:bg-gray-100 hover:dark:bg-gray-900 p-3 rounded-md"
                          target={link.target}
                        >
                          <Image
                            src={link.iconPath}
                            alt={link.title}
                            height={30}
                            width={30}
                            className="dark:invert pt-1"
                          />
                          <div>
                            <h5 className="font-medium">{link.title}</h5>
                            <p className="text-sm font-normal">
                              {link.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Where I am</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[18rem]">
              <ul className="flex flex-col p-3 gap-1">
                {whereLinks.map((link) => {
                  return (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.route}
                          className="flex gap-3 items-start hover:bg-gray-100 hover:dark:bg-gray-900 p-3 rounded-md"
                          target={link.target}
                        >
                          <Image
                            src={link.iconPath}
                            alt={link.title}
                            height={30}
                            width={30}
                            className="dark:invert pt-1"
                          />
                          <div>
                            <h5 className="font-medium">{link.title}</h5>
                            <p className="text-sm font-normal">
                              {link.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="https://github.com/ryanbakker/me-progress"
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Blog Repo
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default NavMenu;
