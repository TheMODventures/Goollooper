import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import React from "react";

const GuidelineLinks = [
  {
    title: "Terms & Conditions",
    link: "/guideline",
  },
  {
    title: "Privacy Policy",
    link: "/guideline/privacy",
  },
  {
    title: "FAQ",
    link: "/guideline/faq",
  },
  {
    title: "Task Interests (Categories)",
    link: "/guideline/Interest",
  },
  {
    title: "Volunteer",
    link: "/guideline/Volunteer",
  },
  {
    title: "Industry",
    link: "/guideline/Industry",
  },
];

export default function GuidelineLayout({ children }: { children: ReactNode }) {
  const currentActivePath = usePathname();
  const basePath = currentActivePath.split('/').slice(0, 3).join('/');

  return (
    <>
      <div className="h-calc-screen flex flex-row mt-[0.563em] ml-[0.813em] gap-[0.813em] mb-2">

        <div className="fixed h-[86vh] mb-10 w-[25.188em] border border-border rounded-md bg-white px-[1.75em] py-[1.813em]">
          <div className="flex flex-col">
            <h1 className="font-bold text-[1.875rem] leading-[2.813rem]">Guidelines</h1>
            <p className="text-subTitleColor text-[0.875rem] leading-[1.313rem] mb-[1.7rem] mt-[0.5rem]">You can manage</p>
            <ul className="flex flex-col gap-0">
              {GuidelineLinks.map((item) => (
                <li key={item.link} className={`py-[0.938em] px-[1.188em] rounded-md 
                ${ basePath === item.link ? "border border-border font-semibold shadow-custom" : ""}`
                }>
                  <Link href={item.link} className="text-[0.875rem] leading-[1.313rem]">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 ml-[26rem]">
            {children}
        </div>

      </div>
    </>
  );
}
