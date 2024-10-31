// app/page.tsx

import { Button } from "@/components/common/Button";
import React from "react";
import Image from "next/image";

const LandingPage: React.FC = () => {
  return (
    <div className="py-20 flex md:flex-row flex-col items-center">
      <div className="flex flex-col justify-between space-y-28 max-w-3xl mb-8 md:mb-0 p-12 relative">
        <p className="text-6xl text-center md:text-left gradient-text tracking-wider leading-relaxed pt-44">
          Unlocking the <br /> Future of Security
        </p>
        <div className="flex space-x-10 justify-center">
          <Button backgroundImage="/images/button1.png" className="w-1/3">
            Get Started
          </Button>
          <Button backgroundImage="/images/button2.png" className="w-1/3">
            Learn More
          </Button>
        </div>
      </div>
      <Image
        src="/images/artwork.png"
        className="absolute right-5 w-2/4 md:w-auto"
        alt="background"
        width={300}
        height={300}
      />
    </div>
  );
};

export default LandingPage;
