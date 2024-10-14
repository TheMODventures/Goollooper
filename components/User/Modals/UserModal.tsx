import Image from "next/image";
import { User } from "@/types/type";
import { IMAGE_URL } from "@/lib/constants";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageGrid from "./ImageGrid";
import InfoRow from "./InfoRow";
import ImageAvatar from "@/components/ImageAvatar";

export function UserModal({ user }: { user: User }) {
  const renderGallery = () => (
    <div className="mt-6">
      <h1 className="text-xl font-bold text-black mb-3">Gallery</h1>
      {user?.galleryImages?.length ? (
        <ImageGrid images={user.galleryImages} alt="user-picture" />
      ) : (
        <h4 className="text-center">No Images</h4>
      )}
    </div>
  );

  const renderVisualsValidation = () => (
    <>
      {(user?.visualFiles?.length ?? 0) > 0 && (
        <div className="mt-6">
          <h1 className="text-xl font-bold text-black mb-3">
            Visuals validation
          </h1>
          <ImageGrid images={user?.visualFiles || []} alt="user visuals" />
        </div>
      )}
    </>
  );

  const renderBrandInformation = () => (
    <>
      {(user?.company?.logo?.length ?? 0) > 0 && (
        <div className="mt-6">
          <h1 className="text-xl font-bold text-black mb-3">
            Brand Information
          </h1>
          <Image
            src={`${IMAGE_URL}${user?.company?.logo}`}
            alt="company logo"
            width={250}
            height={250}
            className="rounded-2xl"
          />
        </div>
      )}
    </>
  );

  const renderCertifications = () => (
    <>
      {(user?.certificates?.length ?? 0) > 0 && (
        <div className="mt-6">
          <h1 className="text-xl font-bold text-black mb-3">
            Professional Certifications
          </h1>
          <ImageGrid images={user?.certificates || []} alt="user certificate" />
        </div>
      )}
    </>
  );

  const renderLicensing = () => (
    <>
      {(user?.licenses?.length ?? 0) > 0 && (
        <div className="mt-6">
          <h1 className="text-xl font-bold text-black mb-3">Licensing</h1>
          <ImageGrid images={user?.licenses || []} alt="user license" />
        </div>
      )}
    </>
  );

  const renderInsurances = () => (
    <>
      {(user?.insurances?.length ?? 0) > 0 && (
        <div className="mt-6">
          <h1 className="text-xl font-bold text-black mb-3">Insurances</h1>
          <ImageGrid images={user?.insurances || []} alt="user insurance" />
        </div>
      )}
    </>
  );

  return (
    <DialogContent className="h-[85%] w-[30%] overflow-auto">
      <DialogHeader>
        <DialogTitle className="mx-auto pb-4">User&#8217;s Profile</DialogTitle>
        <hr />
        <DialogDescription>
          <div className="flex flex-col justify-between h-[420px]">
            <div className="flex items-center flex-col mt-10 h-[30%]">
              <ImageAvatar
                profileImage={user.profileImage}
                firstName={user.firstName}
                lastName={user.lastName}
                isModal={true}
                css="w-[6.125rem] h-[6.125rem]"
              />
              <h1 className="mt-2 font-bold text-black text-xl">
                {`${user.firstName} ${user.lastName}`}
              </h1>
              <div className="mt-3 text-center">
                <p>{user?.role === 3 ? "Tasker" : "Not a Tasker"}</p>
              </div>
            </div>
            <div className="mt-24">
              <h1 className="text-black font-bold text-xl">Personal Info</h1>
              <InfoRow label="Email Address" value={user.email || ""} />
              <InfoRow label="Phone number" value={user.phone || ""} />
              <InfoRow label="Gender" value={user.gender || ""} />
              <InfoRow label="Age" value={user?.age?.toString() || ""} />
            </div>
            {user?.role === 2 ? (
              renderGallery()
            ) : (
              <>
                {renderVisualsValidation()}
                {renderBrandInformation()}
                {renderCertifications()}
                {renderLicensing()}
                {renderInsurances()}
              </>
            )}
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
