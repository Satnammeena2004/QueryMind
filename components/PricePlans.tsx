import React from "react";
import Section from "./Section";
import { pricingPlans } from "@/lib/helper";
import PriceplanCard from "./PriceplanCard";

const PricePlans = () => {
  return (
    <Section type="b" className="flex flex-wrap  justify-center gap-3 p-8 md:px-16">
      {pricingPlans.map((plans) => {
        return <PriceplanCard {...plans} />;
      })}
    </Section>
  );
};

export default PricePlans;
