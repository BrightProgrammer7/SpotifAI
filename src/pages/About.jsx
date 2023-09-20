import { Github, Linkedin } from "lucide-react";
import { team } from "../data";
import { BsDiscord } from "react-icons/bs";
import { Header } from "../components/Home/Header";

function About() {
  return (
    <>
      <Header />
      <div className="md:py-8 py-16 w-full  text-center lg:py-24 lg:px-6">
        <div className="lg:mb-8">
          <h2 className="mb-12 text-4xl tracking-tight font-bold text-white">
            Our Team
          </h2>
        </div>
        <div className="grid gap-8 lg:gap-16 ">
          {team.map((person) => (
            <div key={person.name} className="text-center text-md text-primary">
              <img
                className="mx-auto mb-4 w-36 h-36 rounded-full border border-slate-900"
                src={person.image}
                alt="img"
              />
              <h3 className="mb-1 text-white text-2xl font-bold tracking-tight text-car">
                {person.name}
              </h3>
              <p className="py-2 text-slate-200">{person.job}</p>
              <ul className="flex justify-center mt-4 space-x-4">
                <li>
                  <a
                    href={person.github}
                    className="text-white hover:text-gray-700"
                  >
                    <Github />
                  </a>
                </li>
                <li>
                  <a
                    href={person.linkedIn}
                    className="text-[#3e66d3] hover:text-white"
                  >
                    <Linkedin />
                  </a>
                </li>
                <li>
                  <a
                    href={person.discord}
                    className="text-[#ffffff] hover:text-[#3e66d3]"
                  >
                    <BsDiscord size='24' />
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export default About;