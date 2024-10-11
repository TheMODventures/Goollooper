import Image from "next/image";
import Picture from "@/public/assets/Image/login-bg.svg"; // Import your image file
import Logo from "@/public/assets/Image/Logo.svg";

import { AuthModule } from "@/types/type";
import Link from "next/link";

const AuthLayout: React.FC<AuthModule> = ({
  title,
  subText,
  children,
  additionalText,
}) => {
  console.log("AuthLayout");
  
  return (
    <div className="flex justify-start h-screen overflow-hidden">
      <section className="w-1/2 h-full">

        <Image alt="login-cover-image" className="object-cover w-full h-full" src={Picture}/>

      </section>

      <section className="w-1/2 bg-backGroundColor flex items-center justify-center">
        <div className="fixed top-0 right-0 flex justify-end pt-[2em] pr-[2.5em]">
          <Image width={100} height={100} src={Logo} alt="Logo" className="w-[5em] h-[5em]" />
        </div>
        <div className="w-[24.688em] px-[1.75em] bg-white border border-border rounded-md ">
            <div className="pt-[2em] mb-[1.688em] pb-[1.688em] border-b border-border">
              <h1 className="text-3xl font-bold ">{title}</h1>
              <p className="text-sm text-black pt-3">{subText}</p>
            </div>

            <div>
              {children}
              <p className="flex justify-center mb-[1.563em]"> <Link href={'/'} className="text-PrimaryColor no-underline"> {additionalText}</Link></p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
