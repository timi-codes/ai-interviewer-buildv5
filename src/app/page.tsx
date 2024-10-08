"use client"
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import axios, { AxiosError } from "axios";


export default function Home() {
  const router = useRouter();

  const uploadFileRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    uploadFile(selectedFiles?.[0])
  };

  const uploadFile = async (file: File) => {
    setUploading(true)
    const formData = new FormData();
    formData.append('file', file as Blob);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { data } = response;
      localStorage.setItem('session', JSON.stringify(data));
      router.push('/roles?session_id=' + data.session_id);
    } catch (e) {
      setUploading(false);
      const error = e as AxiosError<{ detail: string }>;

      if (uploadFileRef.current) {
        uploadFileRef.current.value = '';
      }
      toast(error.response?.data.detail)
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center ">

        <div className="flex items-center flex-col">
          <h1 className="text-xl mb-4 font-bold">Interview Warmup</h1>
          <p>A quick way to prepare for your next interview in </p>
          <div className="bg-[rgb(27, 110, 243)]">
            <TypeAnimation
              sequence={['Project Management', 3000, 'Data Analytics', 3000, 'UX Design', 4000, 'Frontend Development', 3000, 'Cyber Security', 4000]}
              deletionSpeed={2}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{ fontSize: '1em', display: 'inline-block' }}
              className="text-accent  text-black bg-white"
            />
          </div>

          <p className="mt-28 w-9/12 text-center">Practice key questions, get insights about your answers, and get more comfortable interviewing.</p>
        </div>

        <div className="flex gap-5 justify-center sm:flex-row w-full">
          <div className="text-center">
            <div
              className="relative rounded-full transition-colors flex items-center justify-center bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              <input ref={uploadFileRef} accept="application/pdf" type="file" id="file_input" className="opacity-0 absolute top-0 bottom-0 right-0 left-0" onChange={selectFile} />
              <Image
                className="dark:invert"
                src="https://nextjs.org/icons/file.svg"
                alt="Vercel logomark"
                width={15}
                height={15}
                style={{ marginRight: "0.5rem" }}
              />
              Upload Resume
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PDF (max. 5mb)</p>
          </div>
        </div>

        {
          uploading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/github.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Github
        </a>
      </footer>
    </div>
  );
}
