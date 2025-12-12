import React from "react";
import HomePage1 from "../components/HomePage1";
import HomePage2 from "../components/HomePage2";
import HomePage3 from "../components/HomePage3";
import Brands from "../components/Brands";
import Testimonial from "../components/Testimonial";

const HomePage = () => {
  return (
    <div>
      <div className="m-5">
        <HomePage1 />
      </div>

      <div className="m-10">
        <HomePage3 />
      </div>

      <div className="p-5 m-5">
        <HomePage2 />
      </div>
      <div className="p-5 m-5">
        <Testimonial />
      </div>

      <div className="m-10">
        <Brands />
      </div>
    </div>
  );
};

export default HomePage;
