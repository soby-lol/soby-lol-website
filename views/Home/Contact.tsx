import SectionTitle from "@/components/SectionTitle";
import { SOCIAL_URL } from "@/types/common";

export default function Contact() {

    return <div id="contact" className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto py-4">
        <SectionTitle title="Contact" />
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            <div className="p-10 bg-[#FFEFC3] hover:bg-[#FFE49A] hover:border rounded-3xl border-b-2 border-brown">
                <a href={SOCIAL_URL.TWITTER.url} target="_blank">
                    <div className="flex justify-between">
                        <span className="text-2xl font-normal">{SOCIAL_URL.TWITTER.name}</span>
                        <img src={SOCIAL_URL.TWITTER.icon} className="w-[44px] h-[44px]" />
                    </div>
                </a>
            </div>
            <div className="p-10 bg-[#FFEFC3] hover:bg-[#FFE49A] hover:border rounded-3xl border-b-2 border-brown">
                <a href={SOCIAL_URL.TELEGRAM.url} target="_blank">
                    <div className="flex justify-between">
                        <span className="text-2xl font-normal">{SOCIAL_URL.TELEGRAM.name}</span>
                        <img src={SOCIAL_URL.TELEGRAM.icon} className="w-[44px] h-[44px]" />
                    </div>
                </a>
            </div>
        </div>
    </div>

}