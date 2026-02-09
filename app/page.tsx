import SectionTwo from "@/components/Home/SectionTwo";
import Container from "../components/container";
import SectionThree from "@/components/Home/SectionThree";
import SectionFour from "@/components/Home/SectionFour";
import SectionFive from "@/components/Home/SectionFive";
import SectionSix from "@/components/Home/SectionSix";
import SectionSeven from "@/components/Home/SectionSeven";
import SectionEight from "@/components/Home/SectionEight";
import Hero from "@/components/Home/Hero";

export default function Home() {
    return (
        <Container>
          <Hero />
          <SectionTwo />
          <SectionThree />
          <SectionFour />
          <SectionFive />
          <SectionSix />
          <SectionSeven />
          <SectionEight />
        </Container>
    )
}
