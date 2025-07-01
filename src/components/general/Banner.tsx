import type React from "react";
import SecondaryNav from "./SecondaryNav";
import Hero from "./Hero";

const Banner: React.FC = () => {
    return (
        <div>
            <h2 className="text-5xl font-bold text-center">Where to?</h2>
            <section className="mt-14 mb-14">
                <SecondaryNav />
            </section>
            <Hero />
        </div>
    );
};

export default Banner;