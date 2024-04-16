import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";

export async function getServerSideProps(ctx: any) {
    let body: any = await fetch("https://api.lanyard.rest/v1/users/1180483272556421140").then((res: any) => res.json());

    return {
        props: { body },
    };
}

const Home: NextPage = ({ body }: any) => {
    const [data, setData] = useState(body.data);

    const [second, addSecond] = useState(0);
    let count = 0;

    const updateData = (newData: any) => {
        addSecond(count++);
    };

    useEffect(() => {
        updateData(data);

        const interval = setInterval(async () => {
            let newBody: any = await fetch("https://api.lanyard.rest/v1/users/1180483272556421140").then((res: any) =>
                res.json()
            );
            if (newBody.data.spotify !== data.spotify) setData(newBody.data);
        }, 4000);
        
        setInterval(() => {
          updateData(data);
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    if (!data.spotify)
        return (
            <div className="w-[100vw] h-[100vh] flex items-center justify-center text-black">
                Salmon is not listening to anything right now. Also please dont stalk
            </div>
        );

        const progress = Math.round(
          ((new Date().getTime() - data.spotify.timestamps.start) / (data.spotify.timestamps.end - data.spotify.timestamps.start)) *
            100
        );

        function formatDuration(ms: number) {
            const totalSeconds = ms / 1000;
            const minutes = (~~(totalSeconds / 60)).toString();
            const seconds = (~~(totalSeconds % 60)).toString();
            return minutes + ":" + seconds.padStart(2, "0");
        }
    return (
        <>
            <Head>
                <title>
                    Listening to: {data.spotify.song} by {data.spotify.artist}{" "}
                </title>
                <meta name="theme-color" content="#1DB954" />

                <meta name="og:title" content={`loli-company.tech`} />
                <meta
                    name="og:description"
                    content={`Sam is currently listening to ${
                        data.spotify.song ? data.spotify.song + " by " + data.spotify.artist : "nothing"
                    }`}
                />
                <meta name="og:image" content={data.spotify.album_art_url} />
            </Head>
            <div className="absolute w-[100vw] h-[100vh] overflow-hidden opacity-80 z-[10] flex items-center justify-center">
                <img
                    className="w-[100vw] blur-xl z-[10]"
                    src={data.spotify.album_art_url}
                    alt="Album art but blurred"
                />
            </div>
            <div className="absolute w-[100vw] h-[100vh] flex items-center justify-center text-white z-[20]">
                <div className="shadow-[0_20px_50px_rgba(250,_128,_114,_0.7)] p-8 w-[33rem] max-xl:w-[22rem] bg-[#000] bg-opacity-60 rounded-lg flex flex-col items-center justify-start font-karla">          
                  <div className="flex flex-col items-center">  
                    <div className="flex items-center">
                      <img src={data.spotify.album_art_url} className="w-24 h-24 rounded-md" />
                      <div className="ml-4">
                        <div className="text-lg font-bold">
                          <a
                            href={`https://open.spotify.com/track/${data.spotify.track_id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {data.spotify.song}  
                          </a>  
                        </div>
                        <div className="text-sm">
                            {data.spotify.artist}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="text-sm">{formatDuration(new Date().getTime() - data.spotify.timestamps.start)}</div>
                        <div className="w-64 h-1 bg-gray-500 rounded-full ml-2 mr-2">
                          <div className="w-1/2 h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      <div className="text-sm">{formatDuration(data.spotify.timestamps.end - data.spotify.timestamps.start)}</div>
                    </div>
                  </div>
                </div>
            </div>
        </>
    );
};

export default Home;
