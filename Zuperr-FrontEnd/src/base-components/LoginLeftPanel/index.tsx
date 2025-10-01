import React from "react";
import CoverImage from "../../assets/images/loginCoverImage.svg";

const leftPanelContent = () => (
  <div
    className="relative w-full hidden md:w-1/2 bg-cover bg-center text-white md:flex font-['Poppins']"
    style={{ backgroundImage: `url(${CoverImage})` }}
  >
    <div className="flex flex-col justify-center md:h-[300px] lg:h-[300px] md:w-[400px] lg:w-[400px] md:ml-20 lg:ml-28 md:mt-20 lg:mt-36 border-l border-white border-opacity-50">
      <h1 className="font-['Poppins'] font-semibold text-3xl md:text-4xl lg:!leading-[3.5rem] tracking-wider">
        Land the Job, That&apos;s &quot;Right for You&quot;
      </h1>
      <div className="flex items-center mt-14">
        <div className="border-t border-white border-opacity-50 w-44 my-1 self-start mt-3" />
        <div className="text-sm md:text-base font-['Poppins'] font-medium">
          Discover Over 130,000+ Job Opportunities with Top Companies and
          Emerging Startups
        </div>
      </div>
    </div>
  </div>
);
export default leftPanelContent;
