import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import banner from "../../../public/images/banner.jpg";

export function ProfileHeader({
  name,
  role,
  photo,
}: {
  name: string;
  role: string;
  photo?: string | null;
}) {
  return (
    <div>
      <div className="relative">
        <div className="h-32 w-full rounded-3xl sm:h-40">
          <Image
            src={banner}
            alt="Banner"
            height={200}
            width={500}
            className="h-44 w-full rounded-2xl object-cover border border-[#3d3d3d] opacity-90"
          />
        </div>
        <div className="absolute left-6 top-full -translate-y-1/2 sm:left-8">
          <div className="rounded-full border-3 border-primary shadow-md">
            <Avatar src={photo} name={name} size={88} />
          </div>
        </div>
      </div>
      <div className="mt-12 pl-1 sm:pl-2">
        <p className="font-heading text-lg font-extrabold text-foreground sm:text-xl">
          {name}
        </p>
        <p className="text-xs capitalize text-muted-foreground sm:text-sm">
          <span className="text-primary">Role: </span>
          {role.toLowerCase()}
        </p>
      </div>
    </div>
  );
}
