import Image from "next/image";

function Loader() {
  return (
    <div className="flex items-center justify-center w-full">
      <Image
        src="/assets/icons/loader.svg"
        alt="loading"
        width={24}
        height={24}
      />
    </div>
  );
}

export default Loader;
