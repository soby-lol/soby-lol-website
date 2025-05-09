import SectionTitle from "@/components/SectionTitle";

const SOBYLIFE_URL = "https://twitter.com/sobylife";
const XAI_GAME_URL = "https://twitter.com/XAI_GAMES";

export default function About() {
  return (
    <div id="about" className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto">
      <SectionTitle title="About $SOBY" />
      <div className="mt-[30px] flex flex-col gap-0 justify-center items-center">
        <div className="w-full max-w-[820px] flex flex-col items-end">
          <img src="/images/two-dogs.png" className="w-[160px] mr-10" />
          <div className="w-full py-5 px-10 rounded-3xl border-b-2 border-brown flex flex-col gap-2 bg-[#FFEFC3] group hover:border hover:bg-[#FFE49A]">
            <div className="flex items-center content-center gap-4">
              <img src="/images/dog-head.png" className="w-[60px]" />
              <div className="h-[5px] w-full bg-[#FFE49A] group-hover:bg-[#FFCA38]"></div>
            </div>
            <div className="text-2xl leading-[36px] font-normal grid gap-3">
              <p className="text-center">
                This project pays homage to{" "}
                <a href={SOBYLIFE_URL} target="_blank" className="underline">
                  @sobylife
                </a>{" "}
                and his dog, responding to the popular demand for dog-based
                narrative in the crypto space. Soby was created to meet this
                demand and to add value to the ecosystem created by{" "}
                <a href={SOBYLIFE_URL} target="_blank" className="underline">
                  @sobylife
                </a>{" "}
                and his partner—the{" "}
                <a href={XAI_GAME_URL} target="_blank" className="underline">
                  @XAI_Games
                </a>{" "}
                blockchain.
              </p>
              <p className="text-center">
                $SOBY is more than just a cryptocurrency; it is also a movement.
                We believe that{" "}
                <a href={XAI_GAME_URL} target="_blank" className="underline">
                  @XAI_Games
                </a>{" "}
                has the potential to change the world of blockchain gaming for
                the better, and we are committed to making it more inclusive and
                welcoming for everyone.
              </p>
              <p className="text-center">
                $SOBY is the meme on{" "}
                <a href={XAI_GAME_URL} target="_blank" className="underline">
                  @XAI_Games
                </a>
                . Join us as we follow{" "}
                <a href={SOBYLIFE_URL} target="_blank" className="underline">
                  @sobylife
                </a>{" "}
                to spread XAI into the degenerate world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
