import cn from "@/utils/cn";

type props = {
    title: string,
    isIconBold?: boolean,
    className?: string,
    titleClassName?: string,
};
export default function SectionTitle({ title, isIconBold, className, titleClassName }: props) {
    return <div className={cn(`flex justify-center items-end gap-5 md:gap-8 lg:gap-10 xl:px-0 py-10 ${className}`)}>
        <img src={`/images/bone${isIconBold ? "-bold" : ""}.png`} className="max-w-20" />
        <div className={cn(`text-4xl md:text-5xl xl:text-6xl text-center ${titleClassName}`)}>{title}</div>
        <img src={`/images/bone${isIconBold ? "-bold" : ""}.png`} className=" rotate-[135deg] max-w-20" />
    </div>
}